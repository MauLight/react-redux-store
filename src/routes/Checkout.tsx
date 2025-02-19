import { useEffect, type ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

//* Components
import { CheckSummary } from '@/components/checkout/CheckSummary'
import { CheckoutCard } from '@/components/checkout/CheckoutCard'

//* Types
import { ProductProps, StoreProps } from '@/utils/types'
import { fadeIn } from '@/utils/functions'
import CheckoutToPayment from '@/components/checkout/CheckoutToPayment'
import { fillCart } from '@/features/cart/cartSlice'

const Checkout = (): ReactElement => {
    const cart = useSelector((state: StoreProps) => state.cart.cart)
    const localCart: ProductProps[] = JSON.parse(localStorage.getItem('marketplace-cart') || '[]')
    const dispatch = useDispatch()

    //* Cart state
    const readyToPay = useSelector((state: StoreProps) => state.cart.readyToPay)
    const total = cart.length > 0 ? cart.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0) : localCart.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0)
    const vat = Math.floor(((total / 100) * 19))
    const totalWithVat = total + vat

    useEffect(() => {
        if (localCart.length > 0 && !cart.length) {
            dispatch(fillCart(localCart))
        }
    }, [])

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('marketplace-cart', JSON.stringify(cart))
        }
    }, [])

    return (
        <div className={`min-[500px]:max-[1440px]:px-10 w-full flex justify-center ${readyToPay ? 'bg-[#10100e]' : 'gap-y-10 bg-[#fdfdfd]'}`}>
            <div className={`w-[1440px] flex flex-col justify-center overflow-y-scroll transition-color duration-200 ${readyToPay ? 'bg-[#10100e] min-h-screen' : 'gap-y-10 bg-[#fdfdfd] h-screen'}`}>
                <div className="h-[100px]"></div>
                <div className="flex flex-col gap-y-5">
                    {
                        !readyToPay && (
                            <div className="flex justify-between items-start">
                                <motion.h1
                                    variants={fadeIn('bottom', 0.1)}
                                    initial={'hidden'}
                                    whileInView={'show'}
                                    className='uppercase text-[2rem] min-[500px]:text-[4rem] lg:text-9xl text-[#10100e]'>
                                    your cart
                                </motion.h1>
                                <Link to={'/'}>
                                    <i className="fa-solid fa-xmark text-[#2E3D49] font-accent hover:rotate-90 hover:text-[#EA0C1D] transition-all duration-200"></i>
                                </Link>
                            </div>
                        )
                    }
                    {
                        !readyToPay && (
                            <div>
                                <p className='text-[1rem] lg:text-2xl text-[#10100e] uppercase'>{`total ${cart.length} items`}</p>
                                <p className='text-[1rem] lg:text-2xl text-[#10100e] uppercase'>Your products are not reserved until payment is complete</p>
                            </div>
                        )
                    }
                </div>
                <>
                    {
                        readyToPay ? (

                            <>
                                <CheckoutToPayment totalWithVat={totalWithVat} />
                            </>
                        )
                            :
                            (
                                <div className="relative grid-cols-1 grid md:grid-cols-5 xl:grid-cols-4 gap-x-5 overflow-y-scroll scrollbar-hide max-md:gap-y-20">
                                    <div className="col-span-3">
                                        {
                                            cart.length > 0 && cart.map((product, i) => (
                                                <CheckoutCard key={product.id + i} dispatch={dispatch} product={product} />
                                            ))
                                        }
                                        {
                                            cart.length === 0 && localCart.map((product: ProductProps, i) => (
                                                <CheckoutCard key={(product.id as string) + i} dispatch={dispatch} product={product} />
                                            ))
                                        }
                                    </div>
                                    <div className="col-span-2 xl:col-span-1">
                                        <CheckSummary numberOfProducts={Object.values(cart).length} total={total} taxes={vat} totalWithTaxes={totalWithVat}>
                                            <div className="col-span-3">
                                                {
                                                    cart.length > 0 && cart.map((product, i) => (
                                                        <CheckoutCard isConfirmation key={product.id + i} dispatch={dispatch} product={product} />
                                                    ))
                                                }
                                                {
                                                    cart.length === 0 && localCart.map((product: ProductProps, i) => (
                                                        <CheckoutCard isConfirmation key={(product.id as string) + i} dispatch={dispatch} product={product} />
                                                    ))
                                                }
                                            </div>
                                        </CheckSummary>
                                    </div>
                                </div>
                            )
                    }
                </>
                <div className="grow"></div>
            </div>
        </div>
    )
}

export default Checkout
