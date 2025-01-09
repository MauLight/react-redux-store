import { type ReactNode } from 'react'
import DashboardNavbar from './DashboardNavbar'

function DashboardHeader(): ReactNode {
    return (
        <header className='fixed top-0 left-0 z-20 w-full h-[60px] flex flex-col items-center bg-[#ffffff]'>
            <section className='w-full h-full flex  gap-x-5 py-5 px-5 bg-[#ffffff] border-b border-sym_gray-100'>
                <h1 className='text-[1rem] text-[#10100e] uppercase max-sm:px-4'>Admin dashboard</h1>
                <DashboardNavbar />
            </section>
        </header>
    )
}

export default DashboardHeader
