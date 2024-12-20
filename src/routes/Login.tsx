import { useLayoutEffect, type ReactNode } from 'react'
import video from '@/assets/video/Sign_video.webm'
import LoginForm from '@/components/login/LoginForm'
import LoginFooter from '@/components/login/LoginFooter'
import { useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'
import { useNavigate } from 'react-router-dom'


function Login(): ReactNode {
    const user = useSelector((state: StoreProps) => state.userAuth.user)
    const navigate = useNavigate()

    return (
        <section className='relative w-full h-screen flex items-center justify-center overflow-hidden'>
            <div className="h-full col-span-1 flex flex-col items-start justify-center px-10 gap-y-3 z-20">
                <LoginForm />
                <LoginFooter />
            </div>
            <video src={video} autoPlay loop muted className='absolute w-full h-full object-cover' />
        </section>
    )
}

export default Login
