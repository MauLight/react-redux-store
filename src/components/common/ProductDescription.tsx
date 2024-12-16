import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'

import { ProductCard } from './ProductCard'
import { ProductProps } from '@/utils/types'
import { postProductRating } from '@/features/products/productsSlice'

export default function ProductDescription({ product }: { product: ProductProps }): ReactNode {
    const { pathname } = useLocation()
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const dispatch: AppDispatch = useDispatch()

    const [stars, setStars] = useState<ReactNode[]>([])

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

    function handleRating(id: string) {
        const myRating = {
            productId: product.id as string,
            rating: Number(id) + 1
        }
        dispatch(postProductRating(myRating))
        calculateRating(Number(id) + 1)
    }

    function handleRatingAnswer() {
        if (stars.length > 0) {
            setIsAdmin(true)
        }
    }

    useLayoutEffect(() => {
        setIsAdmin(pathname.includes('admin'))
    }, [])

    useEffect(() => {
        if (product !== undefined) {
            calculateRating(product.rating?.averageRating as number)
        }
    }, [])

    return (
        <>
            {
                product !== undefined && (
                    <section className='flex gap-x-5'>
                        <div className='min-w-[23rem] h-[33rem]'>
                            <ProductCard product={product} />
                        </div>
                        <div className="w-full h-[33rem] flex flex-col justify-between">
                            <div className="flex flex-col">
                                <h2 aria-label={product.title} className='text-[2.5rem] font-light text-sym_gray-600 text-balance uppercase'>{product.title}</h2>
                                <div className='flex justify-end gap-x-2'>
                                    <p className='text-[3rem] text-end'>{`$${product.price}`}</p>
                                    <p className='text-[1.5rem] str font-light text-sym_gray-200 text-end uppercase line-through'>{product.fullPrice}</p>
                                </div>
                                <button className='h-10 px-2 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'>Add to cart</button>
                                <div className="border-b border-sym_gray-600 mt-10 mb-5"></div>
                                <p className='font-light text-[1.2rem] tracking-tighter text-sym_gray-600'>{product.description}</p>
                            </div>
                            <div className="flex justify-end items-center gap-x-2">
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
                            </div>
                        </div>
                    </section>
                )
            }
        </>
    )
}