import { type ReactNode } from 'react'
import { motion } from 'motion/react'

export default function Landing(): ReactNode {
    return (
        <div className='w-full min-h-screen flex flex-col justify-center items-center gap-y-20'>
            <motion.div className='w-[50px] h-[50px] bg-[#10100e] rounded-[5px] border' animate={{ rotate: 360, transition: { duration: 4 } }} />
            {/* Animate from an initial state */}
            <motion.div className='w-[50px] h-[50px] bg-[#10100e] rounded-[5px] border' initial={{ scale: 0 }} animate={{ rotate: 360, scale: 3, transition: { duration: 4 } }} />

            {/* Animate with event states */}
            <motion.div
                className='w-[50px] h-[50px] bg-[#10100e] rounded-[5px] border'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => { console.log('hover!') }}
            />
        </div>
    )
}
