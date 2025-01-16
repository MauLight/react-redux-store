import { useState, type ReactNode } from 'react'
import GoogleMaps from './GoogleMaps'
import ReviewPayment from './ReviewPayment'

const paymentSteps = [
    {
        id: 'id-1-06105PQHcs',
        title: 'Select Shipping Options',
        step: 1
    },
    {
        id: 'id-2-d2xGYSqGkN',
        title: 'Review and Payment',
        step: 2
    }
]

function CheckoutToPaymentStep({ title, step, current, handleCurrent }: { title: string, step: number, current: boolean, handleCurrent: () => void }) {
    return (
        <button onClick={handleCurrent} className={`relative col-span-1 flex justify-center items-center gap-x-2 bg-[#ffffff] border-b-[4px] ${current ? 'border-[#10100e]' : 'border-gray-200'}`}>
            <div className={`w-[30px] h-[30px] flex justify-center items-center rounded-full text-[#ffffff] ${current ? 'bg-[#10100e]' : 'bg-gray-300'}`}>{step}</div>
            <p className={`text-[1.2rem] ${current ? 'text-[#10100e]' : 'font-light text-gray-400'}`}>{title}</p>
            {
                current && (
                    <div className='absolute w-full bottom-0 left-0 flex justify-center items-center'>
                        <i className="fa-solid fa-xl fa-caret-up text-[#10100e]"></i>
                    </div>
                )
            }
        </button>
    )
}

export default function CheckoutToPayment(): ReactNode {
    const [{ one, two }, setCurrentStep] = useState<{ one: boolean, two: boolean }>({
        one: true,
        two: false
    })

    function handleCurrentStep(step: number) {
        if (step === 1) {
            setCurrentStep({
                one: true,
                two: false
            })
        } else {
            setCurrentStep({
                one: false,
                two: true
            })
        }
    }

    return (
        <main className='w-full h-full text-[#ffffff] pb-20'>
            <section className="h-full grid grid-cols-3 gap-x-10">

                <div className='h-full col-span-2 border bg-[#ffffff]'>
                    <div className='w-full flex flex-col'>
                        <div className="w-full h-[60px] grid grid-cols-2">
                            {
                                paymentSteps.map((step, i) => (
                                    <CheckoutToPaymentStep
                                        key={step.id}
                                        step={step.step}
                                        title={step.title}
                                        current={i === 0 ? one : two}
                                        handleCurrent={() => { handleCurrentStep(i === 0 ? 1 : 2) }}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    {
                        one && (

                            <div>
                                <GoogleMaps setStep={setCurrentStep} />
                            </div>

                        )
                    }
                    {
                        two && (
                            <div>
                                <ReviewPayment />
                            </div>
                        )
                    }
                </div>

                <div className='h-full col-span-1 border'></div>

            </section>
        </main>
    )
}
