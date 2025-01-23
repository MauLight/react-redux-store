import { useState, type ReactNode } from 'react'
import ProductsByJSON from '@/components/dashboard/ProductsByJSON'
import IndividualProduct from '@/components/dashboard/IndividualProduct'
import ProductsTable from '@/components/dashboard/ProductsTable'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default function Products(): ReactNode {
    const [navState, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })

    return (
        <section className={navState.three ? 'relative pt-[100px] flex justify-start items-center pl-[265px]' : 'relative pt-20 flex justify-start items-center pl-[420px]'}>
            <div className={navState.three ? 'w-[1400px]' : 'w-[1100px]'}>
                {
                    navState.one && <IndividualProduct />
                }
                {
                    navState.two && <ProductsByJSON />
                }
                {
                    navState.three && (
                        <div className="overflow-scroll rounded-[10px]">
                            <ProductsTable />
                        </div>
                    )

                }
            </div>
            <DashboardSidebar state={navState} setState={setNavState} titles={['Individual Products', 'Products in Bulk', 'Products Table']} />
        </section>
    )
}
