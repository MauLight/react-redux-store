import { type ReactNode } from 'react'
import { motion } from 'motion/react'
import { animatedGradientText } from '@/utils/styles'

export default function Landing(): ReactNode {
    return (
        <div className='w-full min-h-screen flex flex-col justify-center items-center gap-y-20'>
            {/* <motion.div className='w-[50px] h-[50px] bg-[#10100e] rounded-[5px] border' animate={{ rotate: 360, transition: { duration: 4 } }} /> */}
            {/* Animate from an initial state */}
            {/* <motion.div className='w-[50px] h-[50px] bg-[#10100e] rounded-[5px] border' initial={{ scale: 0 }} animate={{ rotate: 360, scale: 3, transition: { duration: 4 } }} /> */}

            {/* Animate with event states */}
            {/* <motion.div
                className='w-[50px] h-[50px] bg-[#10100e] rounded-[5px] border'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => { console.log('hover!') }}
            /> */}

            <div className="relative w-[1584px] h-[396px] border shadow-sm bg-sym_gray-700">
                <div className="w-full h-full grid grid-cols-3">
                    <div className='flex justify-center items-center'>
                        <h1 className={`text-[10rem] text-balance tracking-normal leading-tight ${animatedGradientText}`}>{'</>'}</h1>
                    </div>
                    <div className="flex justify-center items-center pl-[65px]">
                        <div className='flex flex-col items-start justify-center gap-y-8'>
                            <h1 className={`text-[3rem] text-balance tracking-normal leading-tight ${animatedGradientText}`}>If you can imagine it, you can make it real.</h1>
                            <div className="flex items-center gap-x-3">
                                <img src="https://res.cloudinary.com/maulight/image/upload/v1738652966/dnegritgu1jhievndntb.png" alt="react" className='w-[40px] h-[40px] object-cover' />
                                <p className={`text-[1.2rem] text-balance tracking-normal leading-tight ${animatedGradientText}`}>{'Define your online presence with impressive design and software that delivers real results.'}</p>
                            </div>
                        </div>
                    </div>
                    <div></div>

                </div>
                <img className='absolute top-0 left-0 w-full h-full object-cover grayscale opacity-10' src="https://res.cloudinary.com/maulight/image/upload/v1738651384/ehks0q9uamkyn4mendiw.jpg" alt="" />
            </div>
        </div>
    )
}
