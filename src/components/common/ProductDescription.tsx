import { useEffect, useState, type ReactNode } from 'react'
import { ProductCard } from './ProductCard'
import { ProductProps } from '@/utils/types'

export default function ProductDescription({ product }: { product: ProductProps }): ReactNode {
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

    useEffect(() => {
        if (product !== undefined) {
            calculateRating(product.rating)
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
                                <h2 className='text-[2.5rem] font-light text-sym_gray-600 text-balance uppercase'>{product.title}</h2>
                                <div className='flex justify-end gap-x-2'>
                                    <p className='text-[3rem] text-end'>{`$${product.price}`}</p>
                                    <p className='text-[1.5rem] str font-light text-sym_gray-200 text-end uppercase line-through'>{product.fullPrice}</p>
                                </div>
                                <button className='h-10 px-2 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'>Add to cart</button>
                                <div className="border-b border-sym_gray-600 mt-10 mb-5"></div>
                                <p className='font-light text-[1.2rem] tracking-tighter text-sym_gray-600'>{product.description}</p>
                            </div>
                            <div className="flex justify-end items-center gap-x-2">
                                <p className='font-light leading-none'>{`(${product.rating}/5)`}</p>
                                <div className="flex gap-x-[0.1rem] justify-end items-center text-sym_gray-500">
                                    {
                                        stars.map((star: ReactNode) => (
                                            <>
                                                {star}
                                            </>
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
