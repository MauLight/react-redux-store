import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/functions'

export const BannerContent = ({ children, heroConfig }: { children: ReactNode, heroConfig: { header: string, subHeader: string } }) => {
    return (
        <div className="w-full h-full flex flex-col justify-start items-center pb-5">
            <div className="h-[28%]"></div>
            <div className="flex flex-col">
                <motion.h1
                    variants={fadeIn('top', 0.2)}
                    initial={'hidden'}
                    whileInView={'show'}
                    className='text-[4rem] min-[400px]:text-[5rem] sm:text-[8.5rem] leading-none uppercase animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent font-semibold tracking-tight bg-clip-text z-10'>{heroConfig.header}</motion.h1>
                <div
                    className="w-full flex justify-between mt-2 px-5 z-20">
                    <p className='text-[16px] neue text-[#ffffff] z-10 uppercase'>{heroConfig.subHeader}</p>
                </div>
            </div>
            <div className="grow border"></div>
            <div className="w-full flex justify-end z-20">
                {
                    children
                }
            </div>
        </div>
    )
}
