import { type ReactNode } from 'react'
import video from '@/assets/video/Sign_video.webm'
import LoginForm from '@/components/login/LoginForm'
import LoginFooter from '@/components/login/LoginFooter'


function Signup(): ReactNode {

    return (
        <section className='relative w-full h-screen flex items-center justify-center overflow-hidden'>
            <div className="h-full col-span-1 flex flex-col items-start justify-center px-10 gap-y-3 z-20">
                <LoginForm />
                <LoginFooter />
            </div>
            <video src={video} autoPlay loop className='absolute w-full h-full object-cover' />
        </section>
    )
}

export default Signup