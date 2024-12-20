import Fallback from '@/components/common/Fallback'
import { getConfirmationFromTransbankAsync } from '@/features/cart/cartSlice'
import { AppDispatch } from '@/store/store';
import { StoreProps } from '@/utils/types';
import { useLayoutEffect, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Confirmation(): ReactNode {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token_ws')
    const buyOrder = localStorage.getItem('marketplace-order')

    const dispatch: AppDispatch = useDispatch()
    const isLoading = useSelector((state: StoreProps) => state.cart.isLoading)
    const hasError = useSelector((state: StoreProps) => state.cart.hasError)

    async function handleConfirmationAsync() {
        if (token && buyOrder) {
            const { payload } = await dispatch(getConfirmationFromTransbankAsync({ token, buyOrder }))
            if (payload.status === 'AUTHORIZED') {
                localStorage.removeItem('marketplace-cart')
                setTimeout(() => {
                    navigate('/')
                }, 3000)
            }
            if (payload.status === 'FAILED') {
                setTimeout(() => {
                    navigate('/checkout')
                }, 3000)
            }
        }

        return null
    }

    useLayoutEffect(() => {
        handleConfirmationAsync()
    }, [])

    return (
        <div className={`w-full h-screen flex justify-center ${hasError ? 'bg-[#10100e]' : 'animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}`}>
            <div className='w-web'>
                {
                    isLoading ? (
                        <Fallback />
                    )
                        :
                        (
                            <div className="h-[80%] flex flex-col justify-center items-center">
                                <h1 className={`uppercase ${hasError ? 'text-[3rem] text-[#ffffff]' : 'text-[6rem] text-[#10100e]'} antialiased leading-tight`}>
                                    {hasError ? 'There was an error with your purchase' : 'Thank You!'}
                                </h1>
                                <p className='text-[2rem] text-[#10100e] antialiased'> Your payment has been confirmed.</p>
                            </div>
                        )
                }
            </div>
        </div>
    )
}
