import { useLayoutEffect, useState, type ReactNode } from 'react'

import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import HomeSection from '@/components/dashboard/builder/home/HomeSection'
import AuthSection from '@/components/dashboard/builder/auth/AuthSection'
import { getUIConfigurationAsync, postNewUIConfigurationAsync } from '@/features/ui/uiSlice'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'

function Builder(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const [navState, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false,
        four: false,
        five: false,
    })

    useLayoutEffect(() => {
        async function getCurrentUIOrCreateNewUIConfiguration() {
            {
                try {
                    const { payload } = await dispatch(getUIConfigurationAsync())
                    if (payload.message) {
                        const { payload } = await dispatch(postNewUIConfigurationAsync())
                        console.log(payload)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        getCurrentUIOrCreateNewUIConfiguration()
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