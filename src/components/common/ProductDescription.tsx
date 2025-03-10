import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import InnerImageZoom from 'react-inner-image-zoom'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css'
import { motion } from 'framer-motion'

import { addItem } from '@/features/cart/cartSlice'
import { AppDispatch } from '@/store/store'

import { ProductProps } from '@/utils/types'
import Fallback from './Fallback'

export default function ProductDescription({ product, isLoading }: { product: ProductProps, isLoading: boolean }): ReactNode {
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

    const handleAddItemToCart = () => {
        const itemToAdd = {
            title: product.title,
            image: product.images[0].image,
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

    // `${currentTemplate.product.layout ? currentTemplate.product.layout : 'flex gap-x-[100px] bg-[#ffffff] p-10'} ${!isAdmin ? 'h-auto' : ''}

    return (
        <div className={`flex gap-x-20 bg-[#fff] p-5 sm:p-10 w-full max-sm:min-w-screen min-h-[700px] lg:w-auto max-sm:mt-[180px]`}>
            {loading || isLoading && (
                <div className={`w-full h-auto flex justify-center items-center`}>
                    <Fallback />
                </div>
            )}
            {
                product !== undefined && !loading && !isLoading && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className='flex max-lg:flex-col'
                    >
                        <div className='hidden lg:flex flex-col justify-center h-full'>
                            <InnerImageZoom
                                className='max-h-[500px]'
                                width={500}
                                height={500}
                                hideHint={true}
                                zoomPreload={true}
                                zoomType='hover'
                                src={product.images[0].image as string} zoomSrc={product.images[0].image} />
                            {
                                !isAdmin && (
                                    <div className={`justify-center gap-x-2 mt-5 ${!(product.images.length > 1) ? 'flex' : 'hidden'}`}>
                                        {
                                            product.images.map(({ image, image_public_id }, i) => (
                                                <div key={`id-${image_public_id}-${i}`} className='w-20 h-20 border border-sym_gray-200 overflow-hidden'>
                                                    <img src={image} className='object-cover h-full'></img>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>

                        <div className='w-full flex justify-center items-center py-5'>
                            <img className='max-h-[250px] max-lg:block hidden' src={product.images[0].image} alt="product" />
                        </div>

                        <div className="flex flex-col justify-between lg:pl-10">
                            <div className="flex flex-col">
                                <h2 aria-label={product.title} className='text-[1.1rem] sm:text-[1.5rem] lg:text-[2rem] font-light text-sym_gray-600 text-balance uppercase'>{product.title}</h2>
                                <div className='flex justify-end gap-x-2'>
                                    <p className='text-[1.5rem] lg:text-[3rem] text-end'>{`$${getPercentage()}`}</p>
                                    {
                                        product.discount !== undefined && product.discount > 0 && (
                                            <p className='text-[1rem] lg:text-[1.5rem] str font-light text-sym_gray-200 text-end uppercase line-through'>{product.price}</p>
                                        )
                                    }
                                </div>
                                {
                                    !isAdmin && (
                                        <button onClick={handleAddItemToCart} className={'h-10 px-2 mt-5 uppercase text-[#ffffff] transition-color duration-500 ease-in-out bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'}>Add to cart</button>
                                    )
                                }
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="border-b border-sym_gray-600 mt-10 mb-5"></motion.div>
                                <p className='font-light text-[1rem] sm:text-[1.2rem] tracking-tighter text-sym_gray-600'>{product.description}</p>
                            </div>
                        </div>
                    </motion.section>
                )
            }
        </div>
    )
}
