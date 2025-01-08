import { type ReactNode } from 'react'
import DashboardNavbar from './DashboardNavbar'

function DashboardHeader(): ReactNode {
    return (
        <header className='w-full max-w-[1440px] flex flex-col gap-y-5 py-10 bg-[#ffffff]'>
            <h1 className='text-[2rem] sm:text-[3rem] text-[#10100e] uppercase max-sm:px-4'>Admin dashboard</h1>
            <DashboardNavbar />
        </header>
    )
}

export default DashboardHeader
