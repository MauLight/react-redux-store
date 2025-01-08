import { type ReactNode } from 'react'
import ProductsByJSON from '@/components/dashboard/ProductsByJSON'
import IndividualProduct from '@/components/dashboard/IndividualProduct'

export default function Products(): ReactNode {
    return (
        <div className='grid max-sm:grid-cols-1 grid-cols-2 border-y border-sym_gray-400 max-sm:pb-20'>
            <IndividualProduct />
            <ProductsByJSON />
        </div>
    )
}
