import { type ReactNode } from 'react'
import ProductsByJSON from '@/components/dashboard/ProductsByJSON'
import IndividualProduct from '@/components/dashboard/IndividualProduct'
import ProductsTable from '@/components/dashboard/ProductsTable'

export default function Products(): ReactNode {
    return (
        <section className='pb-20'>
            <div className='grid max-sm:grid-cols-1 grid-cols-2 border-y border-sym_gray-400'>
                <IndividualProduct />
                <ProductsByJSON />
            </div>
            <ProductsTable />
        </section>
    )
}
