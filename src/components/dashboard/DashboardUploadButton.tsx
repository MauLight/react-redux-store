import { type ReactNode } from 'react'
import { motion } from 'motion/react'

interface DashboardUploadButtonProps {
    action: () => void
}

export default function DashboardUploadButton({ action }: DashboardUploadButtonProps): ReactNode {
    return (
        <motion.button
            transition={{ duration: 0.05 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type='button' className='w-full h-full flex flex-col justify-center items-center gap-y-3 hover:text-indigo-500 active:text-[#10100e] transition-color duration-200' onClick={action}>
            <i className="fa-solid fa-cloud-arrow-up fa-xl"></i>
            Upload Image
        </motion.button>
    )
}
