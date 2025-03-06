import { type ReactNode } from 'react'
import video from '@/assets/video/Sign_video1.webm'
import LoginForm from '@/components/login/LoginForm'
import LoginFooter from '@/components/login/LoginFooter'
import { useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'
//import { useNavigate } from 'react-router-dom'


function Login({ isBuilder }: { isBuilder?: boolean }): ReactNode {
    // const navigate = useNavigate()
    // const user = useSelector((state: StoreProps) => state.userAuth.user)

    const currUI = useSelector((state: StoreProps) => state.ui.currConfig)

    return (

        <section className={`relative ${isBuilder ? 'w-full h-full' : 'w-full h-screen'} flex items-center justify-center overflow-hidden`}>
            <div className="h-full col-span-1 flex flex-col items-start justify-center px-10 gap-y-3 z-20">
                <LoginForm isBuilder={isBuilder} />
                <LoginFooter isBuilder={isBuilder} />
            </div>
            {
                currUI.auth.background === '' && (
                    <video src={video} autoPlay loop muted className='absolute w-full h-full object-cover' />
                )
            }
            {
                currUI.auth.background !== '' && (
                    <img className='absolute w-full h-full object-cover' src={currUI.auth.background} alt="background image" />
                )
            }
        </section>
    )
}

export default Login
