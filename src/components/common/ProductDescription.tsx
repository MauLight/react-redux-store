import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import InnerImageZoom from 'react-inner-image-zoom'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css'

import { addItem } from '@/features/cart/cartSlice'
import { AppDispatch } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'

import Fallback from './Fallback'
import { ProductProps, StoreProps } from '@/utils/types'

export default function ProductDescription({ product }: { product: ProductProps }): ReactNode {
    const { pathname } = useLocation()
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    const dispatch: AppDispatch = useDispatch()
    const { currentTemplate, uiIsLoading, uiHasError } = useSelector((state: StoreProps) => state.ui)

    const [loading, setLoading] = useState<boolean>(true)
    const [_stars, setStars] = useState<ReactNode[]>([])

    function calculateRating(rating: number) {
        const ratingArray: ReactNode[] = []
        const emptyStar = <i className="fa-regular fa-star fa-lg"></i>
        const fullStar = <i className="fa-solid fa-star fa-lg"></i>

        for (let i = 0; i < rating; i++) {
            ratingArray.push(fullStar)
        }

        for (let i = 0; i < 5 - rating; i++) {
            ratingArray.push(emptyStar)
        }

        setStars(ratingArray)
    }

    const handleAddItemToCart = () => {
        const itemToAdd = {
            title: product.title,
            image: product.image,
            price: product.price,
            discount: product.discount
        }
        dispatch(addItem(itemToAdd))
    }

    function getPercentage() {
        const percentage = product.discount
        const price = product.price
        const discount = percentage ? (percentage / 100) * price : 0
        return (price - discount)
    }

    useLayoutEffect(() => {
        setIsAdmin(pathname.includes('admin'))
    }, [])

    useEffect(() => {
        if (product !== undefined) {
            calculateRating(product.rating?.averageRating as number)
        }
    }, [])


    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 150)
    }, [])

    return (
        <>
            {loading && (
                <div className='lg:min-w-[23rem] sm:h-[33rem]'>
                    <Fallback />
                </div>
            )}
            {
                product !== undefined && !loading && (
                    <section className={`${currentTemplate.product.layout ? currentTemplate.product.layout : 'flex gap-x-5 bg-[#ffffff] p-10'} ${!isAdmin ? 'min-h-[33rem]' : ''}`}>
                        <div>
                            <InnerImageZoom className='max-h-[650px]' height={2} hideHint={true} zoomPreload={true} zoomType='hover' src={product.image as string} zoomSrc={product.image} />
                            {
                                !isAdmin && (
                                    <div className="flex justify-center gap-x-2 mt-5">
                                        {
                                            Array.from({ length: 4 }).map((_, i) => (
                                                <div className='w-20 h-20 border border-sym_gray-200 overflow-hidden'>
                                                    <img src={product.image} key={i} className='object-cover h-full'></img>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                        <div className="w-full flex flex-col justify-between pl-10">
                            <div className="flex flex-col">
                                <h2 aria-label={product.title} className={isAdmin ? 'text-[1.5rem] min-[500px]:text-[2rem] font-light text-sym_gray-600 text-balance uppercase' : currentTemplate.product.title ? currentTemplate.product.title : 'text-[1.5rem] min-[500px]:text-[2.5rem] font-light text-sym_gray-600 text-balance'}>{product.title}</h2>
                                <div className='flex justify-end gap-x-2'>
                                    <p className='text-[1.5rem] min-[500px]:text-[3rem] text-end'>{`$${getPercentage()}`}</p>
                                    {
                                        product.discount !== undefined && product.discount > 0 && (
                                            <p className='text-[1rem] min-[500px]:text-[1.5rem] str font-light text-sym_gray-200 text-end uppercase line-through'>{product.price}</p>
                                        )
                                    }
                                </div>
                                {
                                    !isAdmin && (
                                        <button onClick={handleAddItemToCart} className={currentTemplate.product.button ? currentTemplate.product.button : 'h-10 px-2 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'}>Add to cart</button>
                                    )
                                }
                                <div className="border-b border-sym_gray-600 mt-10 mb-5"></div>
                                <p className='font-light text-[1.2rem] tracking-tighter text-sym_gray-600'>{product.description}</p>
                            </div>
                        </div>
                    </section>
                )
            }
        </>
    )
}
