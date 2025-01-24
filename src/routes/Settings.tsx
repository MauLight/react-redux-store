import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useState, type ReactNode } from 'react'

export default function Settings(): ReactNode {
    const [navState, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <DashboardSidebar state={navState} setState={setNavState} titles={['Settings']} />
        </div>
    )
}
