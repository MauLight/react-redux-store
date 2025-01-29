import { useLayoutEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'

export default function Dashboard(): ReactNode {
    //const dispatch: AppDispatch = useDispatch()
    const client = useSelector((state: StoreProps) => state.userAuth.client)
    const navigate = useNavigate()

    useLayoutEffect(() => {
        if (!Object.keys(client).length) {
            navigate('/')
        } else {
            console.log(client)
        }
    }, [])

    return (
        <main className='w-screen flex flex-col items-center bg-[#ffffff] pb-20'>
        </main>
    )
}
