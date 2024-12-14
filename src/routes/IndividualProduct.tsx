import { useEffect, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { getProductById } from '@/features/products/productsSlice'

import ProductDescription from '@/components/common/ProductDescription'
import { StoreProps } from '@/utils/types'
import video from '@/assets/video/Product.webm'

function IndividualProduct({ id }: { id: string | undefined }): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const product = useSelector((state: StoreProps) => state.inventory.individualProduct)

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id))
        }
    }, [])

    return (
        <div className='relative w-screen h-screen flex justify-center items-center'>
            <div className="w-[1440px] z-20">
                <div className="w-2/3 bg-[#ffffff] p-10">
                    {
                        product !== undefined && (
                            <ProductDescription product={product} />
                        )
                    }
                </div>
            </div>
            <video className='absolute w-full h-full object-cover' src={video} autoPlay loop muted />
        </div>
    )
}

export default IndividualProduct
