import { postCourierTotal } from '@/features/cart/cartSlice'
import { AppDispatch } from '@/store/store'
import { QuotesProps, StoreProps } from '@/utils/types'
import { useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface CourierOptionsProps { quote: QuotesProps[] }

function CourierOptions({ quote }: CourierOptionsProps): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const total = useSelector((state: StoreProps) => state.cart.total)
    const [selectedCourier, setSelectedCourier] = useState<string>('')

    const newTotal = total

    function handleSelectCourier(e: React.ChangeEvent<HTMLInputElement>): void {
        console.log(newTotal)
        dispatch(postCourierTotal(total + Number(e.target.value)))
        setSelectedCourier(e.target.value)
    }

    return (
        <section className="flex flex-col gap-y-10 border px-5 pt-5 pb-10">
            <h1 className="text-[2rem] uppercase text-[#ffffff]">Shipping Options</h1>
            <div className="flex flex-col gap-y-5">
                {
                    quote.slice(0, 2).map((quo: QuotesProps, i: number) => (
                        <div key={`${quo.serviceValue}-${i}`} className={`flex justify-between gap-x-5 ${i === 0 ? 'pb-5 border-b border-[#ffffff]' : ''}`}>
                            <div className={`flex flex-col gap-y-2`}>
                                <div className='grid grid-cols-3 gap-x-5 items-center'>
                                    <div className="flex justify-center items-center p-2 bg-[#ff0]">
                                        <img src='https://developers.wschilexpress.com/content/logo_chilexpress_negro.svg' alt="courier" />
                                    </div>
                                    <p className="text-[#ffffff]">{quo.serviceDescription}</p>
                                    <p className="text-[#ffffff]">{`$${quo.serviceValue}`}</p>
                                </div>
                                <p className='text-balance text-[#ffffff]'>{i === 0 ? 'Entrega en destino hasta las 11:00 horas para RM y hasta las 12:00 hrs. en regiones del día hábil siguiente a la admisión.' : 'Entrega  en destino hasta las 19:00 hrs. del día hábil siguiente a la admisión.'}</p>
                            </div>
                            <div className="flex justify-center items-center">
                                <input
                                    value={quo.serviceValue}
                                    checked={selectedCourier === quo.serviceValue}
                                    onChange={handleSelectCourier} className='accent-indigo-500 w-5 h-5'
                                    name="courier"
                                    type="radio"
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default CourierOptions
