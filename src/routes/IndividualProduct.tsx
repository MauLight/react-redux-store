import ProductDescription from '@/components/common/ProductDescription'
import { StoreProps } from '@/utils/types'
import { type ReactNode } from 'react'
import { useSelector } from 'react-redux'

function IndividualProduct({ id }: { id: string | undefined }): ReactNode {
    const products = useSelector((state: StoreProps) => state.inventory.products)
    const product = products.find(elem => elem.id === id)

    return (
        <div className='w-screen h-screen'>
            {
                product !== undefined && (
                    <ProductDescription product={product} />
                )
            }
        </div>
    )
}

export default IndividualProduct
