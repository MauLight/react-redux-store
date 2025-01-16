import { useState, type ReactNode } from 'react'
import GoogleMaps from './GoogleMaps'
import ReviewPayment from './ReviewPayment'
import { useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'
import { SummaryCard } from './SummaryCard'
import TransbankForm from './TransbankForm'

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

function CheckoutToPaymentStep({ title, step, current }: { title: string, step: number, current: boolean }) {

    return (
        <div className={`relative col-span-1 flex justify-center items-center gap-x-2 bg-[#ffffff] border-b-[4px] ${current ? 'border-[#10100e]' : 'border-gray-200'}`}>
            <div className={`w-[30px] h-[30px] flex justify-center items-center rounded-full text-[#ffffff] ${current ? 'bg-[#10100e]' : 'bg-gray-300'}`}>{step}</div>
            <p className={`text-[1.2rem] ${current ? 'text-[#10100e]' : 'font-light text-gray-400'}`}>{title}</p>
            {
                current && (
                    <div className='absolute w-full bottom-0 left-0 flex justify-center items-center'>
                        <i className="fa-solid fa-xl fa-caret-up text-[#10100e]"></i>
                    </div>
                )
            }
        </div>
    )
}

export default function CheckoutToPayment({ totalWithVat }: { totalWithVat: number }): ReactNode {
    const cart = useSelector((state: StoreProps) => state.cart.cart)
    const total = useSelector((state: StoreProps) => state.cart.totalWithCourier)
    const [{ one, two }, setCurrentStep] = useState<{ one: boolean, two: boolean }>({
        one: true,
        two: false
    })

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

                <div className='h-full col-span-1'>
                    <section className='flex flex-col gap-y-4 min-h-[400px] pt-0'>
                        <div className='bg-[#ffffff] mb-5'>
                            <img className='w-full' src="https://res.cloudinary.com/maulight/image/upload/v1734712129/zds7cbfpfhfki1djh3wp.png" alt="webpay" />
                        </div>
                        {
                            cart.map((product, i) => (
                                <SummaryCard product={product} key={i} />
                            ))
                        }
                        <div>
                            <div className="w-full flex justify-between mt-10">
                                <h1 className='text-[#ffffff] text-[2rem] uppercase'>Total</h1>
                                <h1 className='text-[#ffffff] text-[2rem] uppercase'>{total === 0 ? totalWithVat : total}$</h1>
                            </div>
                            <div className="w-full flex justify-end">
                                <h1 className='text-[1rem] lg:text-lg text-gray-400 uppercase leading-none'>{`Includes 19% VAT`}</h1>
                            </div>
                        </div>
                        <TransbankForm readyToPay={two} />
                    </section>
                </div>

            </section>
        </main>
    )
}
