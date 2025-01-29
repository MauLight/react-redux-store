import { type ReactNode } from 'react'
import video from '@/assets/video/Sign_video.webm'
import LoginForm from '@/components/login/LoginForm'
import LoginFooter from '@/components/login/LoginFooter'
import { useLocation } from 'react-router-dom'


function AdminLogin(): ReactNode {
    const { pathname } = useLocation()
    const isAdmin = pathname.includes('admin')

    return (
        <section className='relative w-full h-screen flex items-center justify-center overflow-hidden'>
            <div className="h-full col-span-1 flex flex-col items-start justify-center px-10 gap-y-3 z-20">
                <LoginForm isBuilder={false} />
                {
                    !isAdmin && <LoginFooter isBuilder={false} />
                }
            </div>
            <video src={video} autoPlay loop muted className='absolute w-full h-full object-cover grayscale' />
        </section>
    )
}

export default AdminLogin