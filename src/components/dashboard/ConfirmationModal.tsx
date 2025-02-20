import { Dispatch, ReactNode, SetStateAction, useEffect } from 'react'
import { ProductCard } from '../common/ProductCard'
import { ProductProps } from '@/utils/types'
import Fallback from '../common/Fallback'
import ErrorComponent from '../common/ErrorComponent'

interface ConfirmationModalProps {
    product: ProductProps
    imageList: any
    setConfirmationDialogue: Dispatch<SetStateAction<boolean>>
    handlePostProduct: () => void
    postProductError: boolean
    postProductIsLoading: boolean
    errorMessage: any
}

export default function ConfirmationModal({
    product,
    imageList,
    setConfirmationDialogue,
    handlePostProduct,
    postProductError,
    postProductIsLoading,
    errorMessage
}: ConfirmationModalProps): ReactNode {

    function getPercentage() {
        const percentage = product.discount
        const price = product.price
        const discount = percentage ? (percentage / 100) * price : 0
        return (price - discount)
    }

    useEffect(() => {
        if (postProductError) {
            console.log(postProductError, 'the error')
        }
    }, [postProductError])

    return (
        <>
            {
                postProductError && (
                    <ErrorComponent error={errorMessage} />
                )
            }
            {
                !postProductError && postProductIsLoading && (
                    <div className="flex justify-center items-center">
                        <Fallback color='#6366f1' />
                    </div>
                )
            }
            {
                !postProductError && !postProductIsLoading && (
                    <>
                        <h1 className='text-[2rem] text-balance uppercase'> Is the information correct?</h1>
                        <div className="border-b border-sym_gray-600 mb-10 mt-5"></div>
                        <section className='flex gap-x-5'>
                            <div className='min-w-[23rem] h-[33rem]'>
                                <ProductCard product={product} imageList={imageList} />
                            </div>
                            <div className="w-full h-[33rem] flex flex-col justify-between">
                                <div className="flex flex-col">
                                    <h2 className='text-[2.5rem] font-light text-sym_gray-600 text-balance uppercase'>{product.title}</h2>
                                    <div className='flex justify-end gap-x-2'>
                                        <p className='text-[3rem] text-end'>{`$${getPercentage()}`}</p>
                                        {
                                            product.discount !== undefined && product.discount > 0 && (
                                                <p className='text-[1.5rem] font-light text-sym_gray-200 text-end uppercase line-through'>{`$${product.price}`}</p>
                                            )
                                        }
                                    </div>
                                    <button className='h-10 px-2 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'>Add to cart</button>
                                    <div className="border-b border-sym_gray-600 mt-10 mb-5"></div>
                                    <p className='font-light text-[1.2rem] tracking-tighter text-sym_gray-600'>{product.description}</p>
                                </div>
                            </div>
                        </section>
                        <div className="border-b border-sym_gray-600 mb-5 mt-10"></div>
                        <div className="flex justify-between items-center gap-x-5">
                            <div>
                                {
                                    product.description.length < 200 && (
                                        <p className='text-red-500 text-[0.8rem]'>Your description is too short, try adding more than 200 characters.</p>
                                    )
                                }
                                {
                                    imageList.length === 0 && (
                                        <p className='text-red-500 text-[0.8rem]'>A placeholder was added as image because you did not add a valid image url.</p>
                                    )
                                }
                            </div>
                            <div className="flex gap-x-5">
                                <button onClick={() => { setConfirmationDialogue(false) }} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-red-500 active:bg-[#10100e]'>Cancel</button>
                                <button onClick={handlePostProduct} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'>Confirm</button>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}
