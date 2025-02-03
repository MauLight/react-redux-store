import { type ReactNode } from 'react'
import { motion } from 'motion/react'

interface DashboardButtonProps {
    type: "button" | "submit" | "reset" | undefined
    label: string
    action: () => void
    actionType: string
}

export default function DashboardButton({ action, actionType, label, type }: DashboardButtonProps): ReactNode {
    return (
        <>

            {
                actionType === 'cancel' && (
                    <motion.button
                        type={type}
                        transition={{ duration: 0.05 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={action}
                        className='w-[120px] h-10 bg-[#10100e] hover:bg-red-500 active:bg-[#10100e] transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                        <i className="fa-solid fa-ban"></i>
                        {label}
                    </motion.button>
                )
            }
            {
                actionType === 'confirm' && (
                    <motion.button
                        type={type}
                        transition={{ duration: 0.05 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={action}
                        className='w-[120px] h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                        <i className="fa-solid fa-floppy-disk"></i>
                        {label}
                    </motion.button>
                )
            }
        </>
    )
}




