import { useState, type ReactNode } from 'react'
import { AppDispatch } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { postLoginAsync, postNewUserAsync } from '@/features/userAuth/userAuthSlice'
import { toast } from 'react-toastify'

import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"

import { RotatingLines } from 'react-loader-spinner'
import { LoginProps, NewUserProps, StoreProps } from '@/utils/types'
import { useNavigate } from 'react-router-dom'
import GoogleButton from '../login/GoogleButton'
import { GoogleOAuthProvider } from '@react-oauth/google'

const schema = yup
    .object({
        firstname: yup.string().required(),
        lastname: yup.string().required(),
        phone: yup.number().required(),
        email: yup.string().email().required().matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,5}$/, 'Email must be a valid email address.'),
        password: yup.string().required().min(8, 'Password must be at least 8 characters long.').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/, 'Password must contain at least one uppercase, one lowercase, one number and one special character.'),
    })
    .required()

function SignForm({ isBuilder }: { isBuilder: boolean }): ReactNode {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    //* Login UI state
    const authUI = useSelector((state: StoreProps) => state.ui.auth)
    const isLoading = useSelector((state: StoreProps) => state.userAuth.isLoading)
    const hasError = useSelector((state: StoreProps) => state.userAuth.hasError)
    const [error, setError] = useState<string>('')

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            phone: undefined,
            password: '',
        },
        resolver: yupResolver(schema)
    })

    const handleSignUp = async ({ firstname, lastname, email, phone, password }: NewUserProps): Promise<void> => {

        const newUser = {
            firstname,
            lastname,
            email,
            phone,
            password
        }
        const response = await dispatch(postNewUserAsync(newUser))

        if (response.payload.error) {
            toast.error(response.payload.error)
            setError(response.payload.error)
        }
        if (response.payload.message === 'User created succesfully.') {
            navigate('/login')
            reset()
        }
    }

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
        navigate('/')
    }

    return (
        <section className="w-[350px] flex flex-col rounded-[10px] gap-y-5 px-7 py-9 bg-[#ffffff]">
            <>
                {
                    isLoading && (
                        <div className="h-full flex justify-center items-center">
                            <RotatingLines
                                width="40"
                                strokeColor='#10100e'
                            />
                        </div>
                    )
                }
                {
                    !isLoading && (
                        (
                            <>
                                <>
                                    {
                                        authUI.logoUrl && (
                                            <div className="w-full flex justify-center items-center">
                                                <img className='w-[60px]' src={authUI.logoUrl} alt="logo" />
                                            </div>
                                        )
                                    }
                                </>
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
                                <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-y-2 pt-5 text-[0.9rem]">
                                    <div className="flex gap-x-2">
                                        <input {...register('firstname')} type='text' className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.firstname !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Firstname' />
                                        <input {...register('lastname')} type='text' className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.lastname !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Lastname' />
                                    </div>
                                    <input {...register('email')} type='text' className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.email !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Email' />
                                    <input {...register('phone')} type='text' className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.phone !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Phone' />
                                    <input {...register('password')} type='password' className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.password !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Password' />
                                    <button disabled={errors.email !== undefined || errors.password !== undefined} type='submit' className={`w-full h-10 font-body text-[16px] text-[#ffffff] mt-1 uppercase ${errors.email !== undefined || errors.password !== undefined ? 'cursor-not-allowed bg-sym_gray-400' : 'bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'}`}>Sign in</button>
                                    <div className="flex justify-center items-center pt-2">
                                        <div className="w-full border-b border-gray-300"></div>
                                        <p className='text-[14px] font-body text-gray-500 px-5 uppercase'>or</p>
                                        <div className="w-full border-b border-gray-300"></div>
                                    </div>
                                </form>
                                <div className="flex flex-col gap-y-2">
                                    {
                                        authUI.allowGoogle && (
                                            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                                                <div className="flex items-center justify-center gap-x-1 cursor-pointer">
                                                    <GoogleButton operation={1} handleLogin={handleLogin} />
                                                    {/* <i className="fa-brands fa-google text-[#4285f4]"></i>
                                            <p className='font-body text-[16px] text-[#4285f4]'>Continue with Google</p> */}
                                                </div>
                                            </GoogleOAuthProvider>
                                        )
                                    }
                                    <div className="flex flex-col">
                                        <div className="flex justify-start">
                                            {
                                                errors.email !== undefined ? <small className='text-red-500'>{errors.email.message}</small> : null
                                            }
                                        </div>
                                        <div className="flex justify-start">
                                            {
                                                errors.password !== undefined ? <small className='text-red-500'>{errors.password.message}</small> : null
                                            }
                                        </div>
                                        <div className="flex justify-center">
                                            {
                                                hasError && <small className='text-red-500'>{error}</small>
                                            }
                                        </div>
                                    </div>
                                    <p className='text-center font-light text-[0.75rem] text-sym-gray-700 cursor-pointer uppercase'>Forgot password?</p>
                                </div>
                            </>
                        )
                    )
                }
            </>
        </section>
    )
}

export default SignForm

