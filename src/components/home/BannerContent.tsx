import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/functions'

export const BannerContent = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full h-full flex flex-col justify-start items-center">
            <div className="h-[25%]"></div>
            <div className="flex flex-col">
                <motion.h1
                    variants={fadeIn('top', 0.2)}
                    initial={'hidden'}
                    whileInView={'show'}
                    className='aktiv text-[240px] leading-none uppercase animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text z-10'>Emotions</motion.h1>
                <div
                    className="w-full flex justify-between mt-2 px-5 z-20">
                    <p className='text-[16px] neue text-[#ffffff] z-10 uppercase'>Captured</p>
                    <p className='text-[16px] neue text-[#ffffff] z-10 uppercase'>In</p>
                    <p className='text-[16px] neue text-[#ffffff] z-10 uppercase'>Time</p>
                </div>
            </div>
            <div className="grow"></div>
            <div className="w-full flex justify-end pb-5 z-20">
                {
                    children
                }
            </div>
        </div>
    )
}
