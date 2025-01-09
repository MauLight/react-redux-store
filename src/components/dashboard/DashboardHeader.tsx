import { type ReactNode } from 'react'
import DashboardNavbar from './DashboardNavbar'

function DashboardHeader(): ReactNode {
    return (
        <header className='w-full flex flex-col items-center bg-[#ffffff] px-5 border-b border-sym_gray-100'>
            <section className='w-full flex  gap-x-5 py-5'>
                <h1 className='text-[1rem] text-[#10100e] uppercase max-sm:px-4'>Admin dashboard</h1>
                <DashboardNavbar />
            </section>
        </header>
    )
}

export default DashboardHeader
