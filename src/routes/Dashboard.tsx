import { useLayoutEffect, type ReactNode } from 'react'
import ItemsTable from '@/components/dashboard/ProductsTable'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'
import { getUIConfigurationAsync } from '@/features/ui/uiSlice'
import { useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'

export default function Dashboard(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const currUI = useSelector((state: StoreProps) => state.ui.currUI)

    // useLayoutEffect(() => {
    //     if (!user.isAdmin) {
    //         navigate('/')
    //     }
    // })

    useLayoutEffect(() => {
        async function getCurrentUIOrCreateNewUIConfiguration() {
            {
                try {
                    const response = await dispatch(getUIConfigurationAsync())
                    console.log(response)
                } catch (error) {
                    console.log(error)
                }
            }
        }

        if (!Object.keys(currUI).length) {
            getCurrentUIOrCreateNewUIConfiguration()
        }

    })

    return (
        <main className='w-screen flex flex-col items-center bg-[#ffffff] pb-20'>
            <ItemsTable />
            <div className='grid grid-cols-7 border-y border-sym_gray-400'>

            </div>
        </main>
    )
}
