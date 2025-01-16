import { type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'
import { SummaryCard } from './SummaryCard'

function ReviewPayment(): ReactNode {
    const cart = useSelector((state: StoreProps) => state.cart.cart)
    const total = useSelector((state: StoreProps) => state.cart.totalWithCourier)
    const courierFee = useSelector((state: StoreProps) => state.cart.courierFee)

    return (
        <div className='w-full h-full flex flex-col justify-start items-center pt-20'>
            <div className="flex flex-col border p-5">
                <h1 className='text-[1rem] text-[#10100e]'>Payment Summary:</h1>
                <div className="w-[500px] border border-gray-300 p-2 flex flex-col gap-y-5">
                    {
                        cart.length > 0 && cart.map((product, i) => (
                            <SummaryCard isPayment product={product} key={i} />
                        ))
                    }
                    <div className={`flex flex-col gap-y-1`}>
                        <div className='grid grid-cols-3 gap-x-5 items-center justify-center'>
                            <p className='text-[0.8rem] text-gray-500 text-end'>Courier</p>
                            <p className='text-[0.8rem] text-gray-500 text-end'>Service</p>
                            <p className='text-[0.8rem] text-gray-500 text-end'>Price</p>
                        </div>
                        <div className='grid grid-cols-3 gap-x-5 items-center justify-center pb-2'>
                            <div className="col-span-1 flex justify-center items-center p-2 bg-[#ff0]">
                                <img className='w-full object-cover' src='https://developers.wschilexpress.com/content/logo_chilexpress_negro.svg' alt="courier" />
                            </div>
                            <p className="text-[#10100e] col-span-1 text-end">{courierFee.quote.serviceDescription}</p>
                            <p className="text-[#10100e] col-span-1 text-end">{`$${courierFee.quote.serviceValue}`}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-x-5 bg-[#10100e] text-[#fffff] px-2">
                    <h1 className='text-[1.8rem]'>Total</h1>
                    <h1 className='text-[1.8rem]'>${total}</h1>
                </div>
            </div>
        </div>
    )
}

export default ReviewPayment
