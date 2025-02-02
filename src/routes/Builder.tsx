import { useLayoutEffect, useState, type ReactNode } from 'react'

import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import HomeSection from '@/components/dashboard/builder/home/HomeSection'
import AuthSection from '@/components/dashboard/builder/auth/AuthSection'
import { DecodedProps } from '@/utils/types'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

function Builder(): ReactNode {

    const navigate = useNavigate()
    const [navState, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false,
        four: false,
        five: false,
    })

    useLayoutEffect(() => {
        const admin = localStorage.getItem('marketplace-admin') ? JSON.parse(localStorage.getItem('marketplace-admin') as string) : {}
        if (Object.keys(admin).length) {
            const decoded: DecodedProps = jwtDecode(admin.token)
            if (decoded.wizard) {
                navigate('/admin')
            }
        }
    }, [])

    return (
        <div className='h-screen w-full flex flex-col justify-center gap-y-5 items-start pl-[400px]'>
            {
                navState.one && (
                    <>
                        <AuthSection />
                    </>
                )
            }
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