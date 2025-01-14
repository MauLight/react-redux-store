import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import InnerImageZoom from 'react-inner-image-zoom'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css'

import { addItem } from '@/features/cart/cartSlice'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'

import Fallback from './Fallback'
import { ProductProps } from '@/utils/types'
//import { postProductRating } from '@/features/products/productsSlice'

export default function ProductDescription({ product }: { product: ProductProps }): ReactNode {
    const { pathname } = useLocation()
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const dispatch: AppDispatch = useDispatch()

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

    // function handleRating(id: string) {
    //     const myRating = {
    //         productId: product.id as string,
    //         rating: Number(id) + 1
    //     }
    //     dispatch(postProductRating(myRating))
    //     calculateRating(Number(id) + 1)
    // }

    // function handleRatingAnswer() {
    //     if (stars.length > 0) {
    //         setIsAdmin(true)
    //     }
    // }

    const handleAddItemToCart = () => {
        const itemToAdd = {
            title: product.title,
            image: product.image,
            price: product.price,
            discount: product.discount
        }
        dispatch(addItem(itemToAdd))
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
                    <section className={`lg:flex gap-x-5 ${!isAdmin ? 'min-h-[33rem]' : ''}`}>
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
                                <h2 aria-label={product.title} className={isAdmin ? 'text-[1.5rem] min-[500px]:text-[2rem] font-light text-sym_gray-600 text-balance uppercase' : 'text-[1.5rem] min-[500px]:text-[2.5rem] font-light text-sym_gray-600 text-balance uppercase'}>{product.title}</h2>
                                <div className='flex justify-end gap-x-2'>
                                    <p className='text-[1.5rem] min-[500px]:text-[3rem] text-end'>{`$${product.price}`}</p>
                                    <p className='text-[1rem] min-[500px]:text-[1.5rem] str font-light text-sym_gray-200 text-end uppercase line-through'>{product.discount}</p>
                                </div>
                                {
                                    !isAdmin && (
                                        <button onClick={handleAddItemToCart} className='h-10 px-2 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'>Add to cart</button>
                                    )
                                }
                                <div className="border-b border-sym_gray-600 mt-10 mb-5"></div>
                                <p className='font-light text-[1.2rem] tracking-tighter text-sym_gray-600'>{product.description}</p>
                            </div>
                            {/* <div className="flex justify-end items-center gap-x-2">
                                <p className='font-light leading-none'>{`(${stars.length}/5)`}</p>
                                <div onMouseEnter={() => { setIsAdmin(false) }} onMouseLeave={handleRatingAnswer} className="flex gap-x-[0.1rem] justify-end items-center text-sym_gray-500">
                                    {
                                        isAdmin && stars.map((star: ReactNode, i) => (
                                            <div className='' key={i}>
                                                {star}
                                            </div>
                                        ))
                                    }
                                    {
                                        !isAdmin && Array.from({ length: 5 }).map((_, i) => (
                                            <div className='' key={i}>
                                                <i key={i} onClick={() => { handleRating(String(i)) }} id={String(i)}
                                                    className="fa-regular fa-star fa-lg"></i>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div> */}
                        </div>
                    </section>
                )
            }
        </>
    )
}
