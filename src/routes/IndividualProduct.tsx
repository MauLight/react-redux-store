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
    const product = useSelector((state: StoreProps) => state.inventory.individualProduct)
    const isLoading = useSelector((state: StoreProps) => state.inventory.productsAreLoading)
    const hasError = useSelector((state: StoreProps) => state.inventory.productsHasError)

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id))
        }
    }, [id])

    return (
        <div className='relative w-screen h-screen flex justify-center items-center sm:max-lg:pt-[350px]'>
            <div className="w-[1440px] z-20">
                <div className=" bg-[#ffffff] p-10">
                    {
                        hasError && (
                            <ErrorComponent />
                        )
                    }
                    {
                        !hasError && isLoading && (
                            <div className='h-[33rem] w-full flex justify-center items-center'>
                                <Fallback color='#3f51b5' />
                            </div>
                        )
                    }
                    {
                        !hasError && !isLoading && product !== undefined && (
                            <ProductDescription key={product.id} product={product} />
                        )
                    }
                </div>
            </div>
            <video className='absolute w-full h-full object-cover' src={video} autoPlay loop muted />
        </div>
    )
}

function areEqual(prevProps: { id: string | undefined }, nextProps: { id: string | undefined }) {
    return prevProps.id === nextProps.id
}

export default memo(IndividualProduct, areEqual)
