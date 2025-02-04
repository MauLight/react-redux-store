import { type ReactNode } from 'react'
import { motion } from 'motion/react'


export default function FadeinAnimationBox({ children }: { children: ReactNode }): ReactNode {

    const variants = {
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, }
        },
        hidden: {
            y: 100,
            opacity: 0
        }
    }

    return (

        <motion.li
            variants={variants}
            initial='hidden'
            whileInView='visible'
            exit='hidden'
            viewport={{ amount: 0.4 }}
        >
            {children}
        </motion.li>

    )
}
