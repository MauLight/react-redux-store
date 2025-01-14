import { useState, type ReactNode } from 'react'

import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import HomeSection from '@/components/dashboard/builder/home/HomeSection'

function Builder(): ReactNode {
    const [navState, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false,
        four: false,
        five: false,
    })
    return (
        <div className='h-screen w-full flex flex-col justify-center gap-y-5 items-start pl-[400px]'>
            {
                navState.two && (
                    <HomeSection />
                )
            }
            <DashboardSidebar
                titles={['Auth', 'Home', 'Collection', 'Checkout', 'Profile']}
                state={navState}
                setState={setNavState}
            />
        </div>
    )
}

export default Builder