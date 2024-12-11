import { type ReactNode } from 'react'
import video from '@/assets/video/Not found.webm'

export default function NotFound(): ReactNode {
    return (
        <div className='relative w-screen h-screen flex justify-start items-center'>
            <div className="pl-32 flex flex-col text-[#ffffff] z-20">
                <h1 className='uppercase text-[5rem]'>Not Found</h1>
                <p className='text-[1.2rem]'>We're sorry but we couldn't find what you're looking for.</p>
            </div>
            <video className='absolute top-0 left-0 w-full h-full object-cover' src={video} loop autoPlay></video>
            <div className='absolute top-0 left-0 w-full h-full bg-[#10100e] opacity-20'></div>
        </div>
    )
}
