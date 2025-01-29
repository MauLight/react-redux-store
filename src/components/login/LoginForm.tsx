import { useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { yupResolver } from "@hookform/resolvers/yup"
import { AppDispatch } from '@/store/store'
import { useForm } from 'react-hook-form'
import { GoogleOAuthProvider } from '@react-oauth/google'
import * as yup from 'yup'
import { jwtDecode } from 'jwt-decode'

import { DecodedProps, LoginProps, StoreProps } from '@/utils/types'
import { toast } from 'react-toastify'
import Fallback from '../common/Fallback'
import GoogleButton from './GoogleButton'
import { postLoginAsync, postLoginClientAsync } from '@/features/userAuth/userAuthSlice'

const schema = yup
    .object({
        email: yup.string().email().required().matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,5}$/, 'Email must be a valid email address.'),
        password: yup.string().required().min(8, 'Password must be at least 8 characters long.').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/, 'Password must contain at least one uppercase, one lowercase, one number and one special character.'),
    })
    .required()

function LoginForm({ isBuilder }: { isBuilder: boolean | undefined }): ReactNode {

    //* Login UI state
    const authUI = useSelector((state: StoreProps) => state.ui.currConfig.auth)

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [searchParams] = useSearchParams()
    const comesFromCheckout = Boolean(searchParams.get('checkout'))
    const isAdmin = pathname.includes('admin') && !isBuilder

    const dispatch = useDispatch<AppDispatch>()
    const isLoading = useSelector((state: StoreProps) => state.userAuth.isLoading)
    const hasError = useSelector((state: StoreProps) => state.userAuth.hasError)
    const [error, setError] = useState<string>('')

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: yupResolver(schema)
    })

    const handleLogin = async ({ email, password }: LoginProps): Promise<void> => {

        if (isBuilder) {
            return
        }

        const user = {
            email,
            password
        }

        const response = await dispatch(postLoginAsync(user))
        if (response.payload.error) {
            toast.error(response.payload.error)
            setError(response.payload.error)
            return
        }
        reset()
        if (comesFromCheckout) {
            navigate('/checkout')
        } else {
            navigate('/')
        }
    }

    const handleAdminLogin = async ({ email, password }: LoginProps): Promise<void> => {
        const user = {
            email,
            password
        }

        try {
            const { payload } = await dispatch(postLoginClientAsync(user))
            if (payload.token) {
                const decoded: DecodedProps = jwtDecode(payload.token)
                const currentTime = Date.now() / 1000

                if (decoded.role !== 'admin') {
                    navigate('/')
                    return
                }

                if (decoded.exp < currentTime) {
                    toast.error('Token expired, please try again.')
                    return
                }

                reset()
                navigate('/admin/builder')
            }
        } catch (error) {
            console.log(error)
        }

        // reset()
        // navigate('/admin/dashboard')
    }

    return (
        <header className={`min-h-[400px] w-[300px] flex flex-col rounded-[10px] px-7 pb-2 bg-[#ffffff] ${authUI.logoUrl ? 'gap-y-2' : 'gap-y-5'} ${authUI.allowGoogle ? 'pt-9' : 'pt-12'}`}>
            <>
                {
                    isLoading && (
                        <Fallback />
                    )
                }
                {
                    !isLoading && (
                        <>
                            {
                                authUI.logoUrl && (
                                    <div className="w-full flex justify-center items-center">
                                        <img className='w-[60px]' src={authUI.logoUrl} alt="logo" />
                                    </div>
                                )
                            }
                            <>
                                {
                                    authUI.header !== '' && (
                                        <h1 className='font-body text-[#10100e] text-4xl text-center'>{authUI.header}</h1>
                                    )
                                }
                            </>
                            <>
                                {
                                    !authUI.logoUrl && authUI.header === '' && (
                                        <h1 className='font-body text-[#10100e] text-4xl text-center uppercase'>Welcome</h1>
                                    )
                                }
                            </>
                            <form onSubmit={isAdmin ? handleSubmit(handleAdminLogin) : handleSubmit(handleLogin)} className="flex flex-col gap-y-2 pt-5 text-[0.9rem]">
                                <input {...register('email')} type='text' className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.email !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Email' />
                                <input {...register('password')} type='password' className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.password !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Password' />
                                <button disabled={errors.email !== undefined || errors.password !== undefined} type='submit' className={`w-full h-10 font-body text-[16px] text-[#ffffff] mt-1 uppercase ${errors.email !== undefined || errors.password !== undefined ? 'cursor-not-allowed bg-sym_gray-400' : 'bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'}`}>Log in</button>
                                <div className="flex justify-center items-center pt-2">
                                    <div className="w-full border-b border-gray-300"></div>
                                    <p className='text-[14px] font-body text-gray-500 px-5 uppercase'>or</p>
                                    <div className="w-full border-b border-gray-300"></div>
                                </div>
                            </form>
                            <div className="flex flex-col gap-y-2">
                                {
                                    !isAdmin && authUI.allowGoogle && (
                                        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                                            <div className="flex items-center justify-center gap-x-1 cursor-pointer">
                                                <GoogleButton operation={1} handleLogin={handleLogin} />
                                            </div>
                                        </GoogleOAuthProvider>
                                    )
                                }
                                <div className="flex flex-col">
                                    <div className="flex justify-center">
                                        {
                                            errors.email !== undefined && <small className='text-red-500'>{errors.email.message}</small>
                                        }
                                    </div>
                                    <div className="flex justify-center">
                                        {
                                            errors.password !== undefined && <small className='text-red-500'>{errors.password.message}</small>
                                        }
                                    </div>
                                    <div className="flex justify-center">
                                        {
                                            hasError && <small className='text-red-500'>{error}</small>
                                        }
                                    </div>
                                </div>
                                <p className='text-center font-light text-[0.8rem] text-gray-700 cursor-pointer uppercase'>Forgot password?</p>
                            </div>
                        </>
                    )
                }
            </>
        </header>
    )
}

export default LoginForm