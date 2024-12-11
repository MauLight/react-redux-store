import { type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'

const schema = yup
    .object({
        email: yup.string().required(),
        password: yup.string().required(),
    })
    .required()

function LoginForm(): ReactNode {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: yupResolver(schema)
    })

    const handleLogin = (): void => {
        reset()
    }

    return (
        <header className="min-h-[400px] w-[300px] flex flex-col rounded-[10px] pt-12 gap-y-5 px-7 pb-2 bg-[#ffffff]">
            <h1 className='font-body text-[#10100e] text-4xl text-center'>Welcome</h1>
            <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-y-2 pt-5">
                <input {...register('email')} type='text' className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none text-[12px] px-2 ${errors.email !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Phone number, username, or email' />
                <input {...register('password')} type='password' className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none text-[12px] px-2 ${errors.password !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Password' />
                <button type='submit' className='w-full h-8 font-body text-[16px] text-[#ffffff] bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-500 rounded-[10px] mt-1'>Log in</button>
                <div className="flex justify-center items-center pt-2">
                    <div className="w-full border-b border-gray-300"></div>
                    <p className='text-[14px] font-body text-gray-500 px-5 uppercase'>or</p>
                    <div className="w-full border-b border-gray-300"></div>
                </div>
            </form>
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-center gap-x-1 cursor-pointer">
                    <i className="fa-brands fa-google text-[#4285f4]"></i>
                    <p className='font-body text-[16px] text-[#4285f4]'>Continue with Google</p>
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-center">
                        {
                            errors.email !== undefined ? <small className='text-red-500'>{errors.email.message}</small> : null
                        }
                    </div>
                    <div className="flex justify-center">
                        {
                            errors.password !== undefined ? <small className='text-red-500'>{errors.password.message}</small> : null
                        }
                    </div>
                </div>
                <p className='text-center font-light text-[14px] text-gray-600 cursor-pointer'>Forgot password?</p>
            </div>
        </header>
    )
}

export default LoginForm