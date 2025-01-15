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
        <section className={navState.three ? 'relative py-32 flex justify-start items-center pl-[265px]' : 'relative pt-20 flex justify-start items-center pl-[420px]'}>
            <div className={navState.three ? 'w-[1400px]' : 'w-[1100px]'}>
                {
                    navState.one && <IndividualProduct />
                }
                {
                    navState.two && <ProductsByJSON />
                }
                {
                    navState.three && (
                        <div className="h-[800px] overflow-scroll rounded-[10px]">
                            <ProductsTable />
                        </div>
                    )

                }
            </div>
            {/* <div className="fixed top-0 left-0 h-screen w-[200px] z-0 bg-[#ffffff] border-r border-sym_gray-100">
                <div className="flex flex-col gap-y-2 mt-20 justify-start items-center">
                    <button onClick={() => { setNavState({ one: true, two: false, three: false }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${one ? 'text-indigo-500' : 'text-[#10100e]'}`}>Individual Products</button>
                    <button onClick={() => { setNavState({ one: false, two: true, three: false }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${two ? 'text-indigo-500' : 'text-[#10100e]'}`}>Products in Bulk</button>
                    <button onClick={() => { setNavState({ one: false, two: false, three: true }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${three ? 'text-indigo-500' : 'text-[#10100e]'}`}>Products Table</button>
                </div>
            </div> */}
            <DashboardSidebar state={navState} setState={setNavState} titles={['Individual Products', 'Products in Bulk', 'Products Table']} />
        </section>
    )
}
