import { useLayoutEffect, useState, type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { StoreProps } from '@/utils/types'
import ItemsTable from '@/components/dashboard/ItemsTable'
import IndividualProduct from '@/components/dashboard/IndividualProduct'
import ProductsByJSON from '@/components/dashboard/ProductsByJSON'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'

export default function Dashboard(): ReactNode {
    const user = useSelector((state: StoreProps) => state.userAuth.user)
    const navigate = useNavigate()

    // useLayoutEffect(() => {
    //     if (!user.isAdmin) {
    //         navigate('/')
    //     }
    // })

    return (
        <main className='w-screen flex flex-col items-center bg-[#ffffff] pb-20'>
            <ItemsTable />
            <div className='grid grid-cols-7 border-y border-sym_gray-400'>
                <IndividualProduct />
                <ProductsByJSON />
            </div>
        </main>
    )
}
