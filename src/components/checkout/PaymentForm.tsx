// @ts-nocheck
import { ReactNode } from 'react'
import { SummaryCard } from './SummaryCard'
import { CartItemProps, StoreProps } from '@/utils/types'
import PlaceAutocomplete from './AutoCompleteElement'
import TransbankForm from './TransbankForm'
import { useSelector } from 'react-redux'

interface PlaceResult { }

interface PaymentFormProps {
  cart: CartItemProps[]
  totalWithVat: number
  children: ReactNode
  selectedPlace: PlaceResult | null
  setSelectedPlace: (place: PlaceResult | null) => void
  vat: number
}

export const PaymentForm = ({ cart, vat, totalWithVat, children, selectedPlace, setSelectedPlace }: PaymentFormProps) => {

  const total = useSelector((state: StoreProps) => state.cart.totalWithCourier)

  return (
    <main className="w-full flex justify-between">
      <section className="flex flex-col gap-y-10 w-1/2 py-10 overflow-y-scroll">
        <div className="relative flex flex-col min-h-[450px]">
          {
            children
          }
        </div>
        <div className="autocomplete-control">
          <PlaceAutocomplete selectedPlace={selectedPlace as PlaceResult} onPlaceSelect={setSelectedPlace} />
        </div>
      </section>
      <section className='fixed right-32 top-55 flex flex-col gap-y-4 w-[400px] min-h-[400px] pt-0'>
        <div className="h-[25px]"></div>
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
          <div className="w-full flex justify-end gap-x-2">
            <h1 className='text-[#ffffff] text-[1rem] uppercase'>{'(*) Includes'}</h1>
            <h1 className='text-[#ffffff] text-[1rem] uppercase'>{vat}$ VAT</h1>
          </div>
        </div>
        <TransbankForm placeFromUser selectedPlace={selectedPlace} />
      </section>
    </main>
  )
}
