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
                    className='text-[2rem] min-[400px]:text-[3rem] sm:text-[5rem] lg:text-[8.5rem] leading-none uppercase animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent font-semibold tracking-tight bg-clip-text z-10 max-sm:px-5'>{heroConfig.header}</motion.h1>
                <div
                    className="w-full flex justify-between mt-2 px-5 z-20">
                    <p className='w-full text-[0.9rem] max-[400px]:text-center sm:text-[16px] text-[#fff] z-10 uppercase text-balance leading-tight'>{heroConfig.subHeader}</p>
                </div>
            </div>
            <div className="h-[30%]"></div>
            <div className="w-full flex justify-center z-20">
                {
                    children
                }
            </div>
        </div>
    )
}
