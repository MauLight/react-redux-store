import { useLayoutEffect, type ReactNode } from 'react'
import video from '@/assets/video/Sign_video.webm'
import LoginForm from '@/components/login/LoginForm'
import LoginFooter from '@/components/login/LoginFooter'
import { useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'
import { useNavigate } from 'react-router-dom'


function Login({ isBuilder }: { isBuilder?: boolean }): ReactNode {
    const navigate = useNavigate()
    const user = useSelector((state: StoreProps) => state.userAuth.user)

    const authUI = useSelector((state: StoreProps) => state.ui.ui.auth)

    return (
        <section className={`relative ${isBuilder ? 'w-full h-full' : 'w-full h-screen'} flex items-center justify-center overflow-hidden`}>
            <div className="h-full col-span-1 flex flex-col items-start justify-center px-10 gap-y-3 z-20">
                <LoginForm isBuilder={isBuilder} />
                <LoginFooter />
            </div>
            {
                authUI.background === '' ? (
                    <video src={video} autoPlay loop muted className='absolute w-full h-full object-cover' />
                )
                    :
                    (
                        <img className='absolute w-full h-full object-cover' src={authUI.background} alt="background image" />
                    )
            }
        </section>
    )
}

export default Login
