import { setNotReadyToPay } from '@/features/cart/cartSlice'
import { StoreProps } from '@/utils/types'
import { useEffect, useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface PlaceResult { }

export default function TransbankForm({ selectedPlace }: { selectedPlace: PlaceResult | null }): ReactNode {
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const transbank = useSelector((state: StoreProps) => state.cart.transbank)

    useEffect(() => {
        if (selectedPlace !== null) {
            setIsDisabled(false)
        }
    }, [selectedPlace])

    const dispatch = useDispatch()

    return (
        <div className="flex flex-col">
            <form method="post" action={transbank.url}>
                <input type="hidden" name="token_ws" value={transbank.token} />
                <button disabled={isDisabled} type='submit' className={`w-full h-8 flex justify-center items-center px-2 uppercase text-[#10100e] mt-3 transition-all duration-200 ${!selectedPlace ? 'bg-sym_gray-100 cursor-not-allowed' : 'bg-[#ffffff] hover:bg-indigo-500 active:bg-[#ffffff]'}`}>
                    Pay
                </button>
            </form>
            <button type='button' onClick={() => { dispatch(setNotReadyToPay()) }} className='h-8 hover:bg-red-600 active:bg-transparent px-2 uppercase text-[#ffffff] mt-3 transition-all duration-200 text-[12px] text-right'>Cancel</button>
        </div>
    )
}
