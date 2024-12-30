import { useEffect, type ReactElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

//* Components
import { CheckSummary } from '@/components/checkout/CheckSummary'
import { CheckoutCard } from '@/components/checkout/CheckoutCard'
import { XMarkIcon } from '@heroicons/react/20/solid'

//* Types
import { ProductProps, StoreProps } from '@/utils/types'
import { fadeIn } from '@/utils/functions'
import GoogleMapsAPI from '@/components/checkout/GoogleMapsAPI'

const Checkout = (): ReactElement => {
    const navigate = useNavigate()
    const cart = useSelector((state: StoreProps) => state.cart.cart)
    const localCart: ProductProps[] = JSON.parse(localStorage.getItem('marketplace-cart') || '[]')
    const dispatch = useDispatch()

    //* Cart state
    const readyToPay = useSelector((state: StoreProps) => state.cart.readyToPay)
    const total = cart.length > 0 ? cart.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0) : localCart.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0)
    const vat = Math.floor(((total / 100) * 19))
    const totalWithVat = total + vat

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('marketplace-cart', JSON.stringify(cart))
        }
    }, [])

    useEffect(() => {
        if (cart.length === 0) {
            localStorage.removeItem('marketplace-cart')
            navigate('/')
        }
    }, [cart])

    return (
        <div className={`min-[500px]:max-[1440px]:px-10 w-full flex justify-center ${readyToPay ? 'bg-[#10100e]' : 'gap-y-10 bg-[#fdfdfd]'}`}>
            <div className={`w-web flex flex-col justify-center overflow-y-scroll transition-color duration-200 ${readyToPay ? 'bg-[#10100e] min-h-screen' : 'gap-y-10 bg-[#fdfdfd] h-screen'}`}>
                <div className="h-[100px]"></div>
                <div className="flex flex-col gap-y-5">
                    <div className="flex justify-between items-start">
                        <motion.h1
                            variants={fadeIn('bottom', 0.1)}
                            initial={'hidden'}
                            whileInView={'show'}
                            className={`uppercase text-[2rem] min-[500px]:text-[4rem] lg:text-9xl ${readyToPay ? 'text-[#ffffff]' : 'text-[#10100e]'}`}>{readyToPay ? 'checkout' : 'your cart'}</motion.h1>
                        <Link to={'/'}>
                            <XMarkIcon className='w-6 text-[#2E3D49] font-accent hover:rotate-90 hover:text-[#EA0C1D] transition-all duration-200' />
                        </Link>
                    </div>
                    {
                        !readyToPay && (
                            <div>
                                <p className='text-[1rem] lg:text-2xl text-[#10100e] uppercase'>{`total ${0} items`}</p>
                                <p className='text-[1rem] lg:text-2xl text-[#10100e] uppercase'>Your products are not reserved until payment is complete</p>
                            </div>
                        )
                    }
                </div>
                <>
                    {
                        readyToPay ? (
                            <GoogleMapsAPI vat={vat} totalWithVat={totalWithVat} />
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
                                            cart.length === 0 && localCart.map((product, i) => (
                                                <CheckoutCard key={product.id + i} dispatch={dispatch} product={product} />
                                            ))
                                        }
                                    </div>
                                    <div className="col-span-2 xl:col-span-1">
                                        <CheckSummary numberOfProducts={Object.values(cart).length} total={total} taxes={vat} totalWithTaxes={totalWithVat} />
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
