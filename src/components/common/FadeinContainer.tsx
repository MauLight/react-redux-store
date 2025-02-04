import { type ReactNode } from 'react'
import { motion } from 'motion/react'

export default function FadeinContainer({ children }: { children: ReactNode }): ReactNode {

    const containerVariants = {
        visible: {
            y: 0,
            opacity: 1,
            transition: { staggerChildren: 0.4, delayChildren: 0.2 }
        },
        hidden: {
            y: 100,
            opacity: 0,
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    }

    return (
        <motion.ul
            className='w-full flex flex-wrap gap-12 justify-center items-center'
            initial='hidden'
            whileInView='visible'
            viewport={{ amount: 0.4 }}
            variants={containerVariants}
        >
            {
                children
            }
        </motion.ul>
    )
}
