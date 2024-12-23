import { ReactNode } from 'react'
import { SummaryCard } from './SummaryCard'
import { CartItemProps, StoreProps } from '@/utils/types'
import { useDispatch, useSelector } from 'react-redux'
import { setNotReadyToPay } from '@/features/cart/cartSlice'
import PlaceAutocomplete from './AutoCompleteElement'

interface PlaceResult { }

interface PaymentFormProps {
  cart: CartItemProps[]
  totalWithVat: number
  children: ReactNode
  setSelectedPlace: (place: PlaceResult | null) => void
}

export const PaymentForm = ({ cart, totalWithVat, children, setSelectedPlace }: PaymentFormProps) => {

  const transbank = useSelector((state: StoreProps) => state.cart.transbank)
  const dispatch = useDispatch()

  return (
    <main className="w-full flex justify-between">
      <section className="flex flex-col gap-y-10 w-1/2 py-10 overflow-y-scroll">
        <div className="relative flex flex-col min-h-[450px]">
          {
            children
          }
          {
            cart.map((product, i) => (
              <SummaryCard product={product} key={i} />
            ))
          }
        </div>
        <div className="autocomplete-control">
          <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
        </div>
      </section>
      <section className='flex flex-col gap-y-4 w-[400px] rounded-[20px] min-h-[400px] pt-0'>
        <div className="h-[25px]"></div>
        <div className='bg-[#ffffff]'>
          <img className='w-full' src="https://res.cloudinary.com/maulight/image/upload/v1734712129/zds7cbfpfhfki1djh3wp.png" alt="webpay" />
        </div>
        <div className="border-b"></div>
        <div className="flex gap-x-5 mt-10">
          <h1 className='text-[#ffffff] aktivLight text-[38px] uppercase'>Total</h1>
          <h1 className='text-[#ffffff] aktiv text-[38px] uppercase'>{totalWithVat}$</h1>
        </div>
        <div className="flex flex-col">
          <form method="post" action={transbank.url}>
            <input type="hidden" name="token_ws" value={transbank.token} />
            <button type='submit' className='w-full h-8 flex justify-center items-center bg-[#ffffff] hover:bg-indigo-500 active:bg-[#ffffff] px-2 uppercase text-[#10100e] mt-3 transition-all duration-200'>
              Pay
            </button>
          </form>
          <button type='button' onClick={() => { dispatch(setNotReadyToPay()) }} className='h-8 hover:bg-red-600 active:bg-transparent px-2 uppercase text-[#ffffff] mt-3 transition-all duration-200 text-[12px] text-right'>Cancel</button>
        </div>
      </section>
    </main>
  )
}
