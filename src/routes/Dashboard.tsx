import { useLayoutEffect, type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { StoreProps } from '@/utils/types'
import ItemsTable from '@/components/dashboard/ItemsTable'
import IndividualProduct from '@/components/dashboard/IndividualProduct'
import ProductsByJSON from '@/components/dashboard/ProductsByJSON'

export default function Dashboard(): ReactNode {
    const user = useSelector((state: StoreProps) => state.userAuth.user)
    const navigate = useNavigate()

    // useLayoutEffect(() => {
    //     if (!user.isAdmin) {
    //         navigate('/')
    //     }
    // })

    return (
        <section className='w-screen flex flex-col gap-y-10 bg-[#ffffff] pb-20'>
            <ItemsTable />
            <div className='grid grid-cols-7 border-y border-sym_gray-400'>
                <IndividualProduct />
                <ProductsByJSON />
            </div>
        </section>
    )
}
