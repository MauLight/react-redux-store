import { type ReactNode } from 'react'
import ItemsTable from '@/components/dashboard/ItemsTable'

export default function Dashboard(): ReactNode {

    // useLayoutEffect(() => {
    //     if (!user.isAdmin) {
    //         navigate('/')
    //     }
    // })

    return (
        <main className='w-screen flex flex-col items-center bg-[#ffffff] pb-20'>
            <ItemsTable />
            <div className='grid grid-cols-7 border-y border-sym_gray-400'>

            </div>
        </main>
    )
}
