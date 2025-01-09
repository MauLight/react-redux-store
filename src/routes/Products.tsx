import { useState, type ReactNode } from 'react'
import ProductsByJSON from '@/components/dashboard/ProductsByJSON'
import IndividualProduct from '@/components/dashboard/IndividualProduct'
import ProductsTable from '@/components/dashboard/ProductsTable'

export default function Products(): ReactNode {
    const [{ one, two, three }, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })

    return (
        <section className='relative py-20 flex justify-center items-center'>
            <div className='w-[1000px]'>
                {
                    one && <IndividualProduct />
                }
                {
                    two && <ProductsByJSON />
                }
                {
                    three && <ProductsTable />
                }
            </div>
            <div className="absolute top-0 left-0 h-screen w-[200px] z-40 bg-[#ffffff] border-r border-sym_gray-300"></div>
        </section>
    )
}
