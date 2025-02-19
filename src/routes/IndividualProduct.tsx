import { memo, useEffect, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { getProductById } from '@/features/products/productsSlice'

import ProductDescription from '@/components/common/ProductDescription'
import { StoreProps } from '@/utils/types'
import video from '@/assets/video/Product.webm'
import Fallback from '@/components/common/Fallback'
import ErrorComponent from '@/components/common/ErrorComponent'

function IndividualProduct({ id }: { id: string | undefined }): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const { currentTemplate, uiIsLoading, uiHasError } = useSelector((state: StoreProps) => state.ui)

    const product = useSelector((state: StoreProps) => state.inventory.individualProduct)
    const { productsAreLoading, productsHasError } = useSelector((state: StoreProps) => state.inventory)

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id))
        }
    }, [id])

    return (
        <>
            {
                uiHasError && (
                    <ErrorComponent />
                )
            }
            {
                !uiHasError && uiIsLoading && (
                    <div className="w-full h-screen flex justify-center items-center">
                        <Fallback />
                    </div>
                )
            }
            {
                !uiHasError && !uiIsLoading && Object.keys(currentTemplate).length > 0 && (
                    <div className='relative w-screen h-screen flex justify-center items-center sm:max-lg:pt-[350px] bg-gray-100'>
                        <div className="w-[1440px] pt-[80px] z-20">
                            <div>
                                {
                                    productsHasError && (
                                        <ErrorComponent />
                                    )
                                }
                                {
                                    !productsHasError && productsAreLoading && (
                                        <div className='h-[33rem] w-full flex justify-center items-center'>
                                            <Fallback color='#3f51b5' />
                                        </div>
                                    )
                                }
                                {
                                    !productsHasError && !productsAreLoading && product !== undefined && (
                                        <ProductDescription key={product.id} product={product} />
                                    )
                                }
                            </div>
                        </div>
                        {
                            currentTemplate.product.video && (
                                <video className='absolute w-full h-full object-cover' src={video} autoPlay loop muted />
                            )
                        }
                    </div>
                )
            }
        </>
    )
}

function areEqual(prevProps: { id: string | undefined }, nextProps: { id: string | undefined }) {
    return prevProps.id === nextProps.id
}

export default memo(IndividualProduct, areEqual)
