import { motion } from 'framer-motion'
import { useState, type SVGProps } from 'react'

interface CheckIconProps extends SVGProps<SVGSVGElement> { }

export function CheckIcon(props: CheckIconProps): JSX.Element {
    return (
        <svg
            {...props}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
        >
            <motion.path
                initial={{
                    pathLength: 0
                }}
                animate={{
                    pathLength: 1
                }}
                transition={{
                    delay: 0.1,
                    type: 'tween',
                    ease: 'easeOut'
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
            />
        </svg>
    );
}

function Step({ step, currentStep }: { step: number, currentStep: number }) {

    //* If step equals currentStep, then step is active. If currentStep is less than step, then step is inactive (hasn't been done yet). If currentStep is more than step, it means that step is completed.
    let status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete'

    return (
        <motion.div animate={status} className='relative'>
            <motion.div
                variants={{
                    inactive: {
                        scale: 1
                    },
                    active: {
                        scale: 1,
                        transition: {
                            delay: 0,
                            duration: 0.2
                        }
                    },
                    complete: {
                        scale: 1.25
                    }
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.2,
                    type: 'tween',
                    ease: 'circOut'
                }}
                className="absolute inset-0 bg-blue-200 rounded-full"></motion.div>
            <motion.div
                initial={false}
                transition={{ duration: 0.5 }}
                variants={{
                    inactive: {
                        backgroundColor: '#fff',
                        borderColor: '#E2E8F0',
                        color: '#94A3B8'
                    },
                    active: {
                        backgroundColor: '#fff',
                        borderColor: '#3b82f6',
                        color: '#3b82f6'
                    },
                    complete: {
                        backgroundColor: '#3b82f6',
                        borderColor: '#3b82f6',
                        color: '#fff'

                    }
                }}
                className={`relative w-10 h-10 flex justify-center items-center rounded-full border-2 font-semibold ${status === 'active' ? 'border-blue-500 bg-[#ffffff] text-blue-500' : status === 'complete' ? 'border-blue-500 bg-blue-500' : 'border-slate-200 bg-[#ffffff] text-slate-400'}`}>
                <div className="flex items-center justify-center">
                    {
                        status === 'complete' ? (
                            <CheckIcon className='w-6 h-6 text-[#ffffff]' />
                        )
                            :
                            (
                                <span>{step}</span>
                            )
                    }
                </div>
            </motion.div>
        </motion.div>
    )
}

function Multistep() {

    const [step, setStep] = useState<number>(0)

    return (
        <main className="mx-auto w-full max-w-md min-h-[200px] rounded-[12px] bg-[#ffffff]">
            <section className="flex justify-between rounded p-8">
                {
                    Array.from({ length: 4 }).map((_, i) => (
                        <Step key={i} step={i} currentStep={step} />
                    ))
                }
            </section>

            <section className='px-8 pb-8'>
                <div>
                    <div className="mt-2 h-6 w-40 rounded bg-slate-100" />
                    <div className="mt-4 space-y-2">
                        <div className="h-4 w-5/6 rounded bg-slate-100" />
                        <div className="h-4 rounded bg-slate-100" />
                        <div className="h-4 w-4/6 rounded bg-slate-100" />
                    </div>
                </div>

                <div className='flex justify-between items-center mt-10'>
                    {/* If step is less than 2, step (eg. 1), if not, step is step minus 1 (4 => 3, 3 => 2, 2 => 1) */}
                    <button onClick={() => setStep(step < 1 ? step : step - 1)} className='rounded px-2 py-1 text-slate-400 hover:text-slate-700 transition-color duration-200 cursor-pointer'>
                        Back
                    </button>
                    <button onClick={() => setStep(step < 4 ? step + 1 : step)} className={`${step < 4 ? '' : 'pointer-events-none opacity-50'} flex justify-center items-center rounded-[12px] bg-blue-500 py-2 px-4 font-medium tracking-tight text-[#ffffff] hover:bg-blue-400 active:bg-blue-700 transition-color duration-200`}>Continue</button>
                </div>
            </section>
        </main>
    )
}

export default Multistep