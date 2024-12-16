import Fallback from '@/components/common/Fallback'
import WishlistCard from '@/components/profile/WishlistCard'
import { getUserByIdAsync } from '@/features/userAuth/userAuthSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps, StoreProps } from '@/utils/types'
import { useLayoutEffect, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const mockItems = [
    {
        description: "col-484d6936-64c6-47ae-ba0d-41a74177b446",
        title: "Into the unknown",
        price: 1400,
        fullPrice: 1680,
        image: "https://res.cloudinary.com/maulight/image/upload/v1732918791/e-commerce/banner_1.webp"
    },
    {
        description: "col-484d6936-64c6-47ae-ba0d-41a74177b446",
        title: "Into the unknown",
        price: 1400,
        fullPrice: 1680,
        image: "https://res.cloudinary.com/maulight/image/upload/v1732918791/e-commerce/banner_1.webp"
    },
    {
        description: "col-484d6936-64c6-47ae-ba0d-41a74177b446",
        title: "Into the unknown",
        price: 1400,
        fullPrice: 1680,
        image: "https://res.cloudinary.com/maulight/image/upload/v1732918791/e-commerce/banner_1.webp"
    }
]

function Profile(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const id = useSelector((state: StoreProps) => state.userAuth.user.id)
    const user = useSelector((state: StoreProps) => state.userAuth.userData)
    const isLoading = useSelector((state: StoreProps) => state.userAuth.isLoading)

    useLayoutEffect(() => {
        if (!user) {
            dispatch(getUserByIdAsync(id))
        }
    }, [])

    return (
        <main className='w-screen min-h-screen flex flex-col items-center gap-y-20 pt-44 pb-20'>
            <>
                {
                    !isLoading && (
                        <Fallback color='#ffffff' />
                    )
                }
                {
                    isLoading && user && (
                        <main>
                            <section className='w-[1440px] text-[#ffffff] flex flex-col gap-y-2 tracking-tight uppercase'>
                                <h1 className='text-9xl animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Profile</h1>
                                <p className='text-[1.5rem]'>{user.email}</p>
                                <div className="w-full border-b border-sym_gray-50 mt-20"></div>
                            </section>
                            <section className='w-[1440px] flex flex-col gap-y-5'>
                                <h1 className='text-[#ffffff] text-[2rem] uppercase'>Wishlist</h1>
                                <div className='flex flex-col gap-y-5 py-10 px-5 border bg-[#ffffff]'>
                                    {
                                        mockItems.map((product: ProductProps, i: number) => (
                                            <WishlistCard dispatch={() => { }} key={i} product={{ ...product, quantity: 1 }} />
                                        ))
                                    }
                                </div>
                            </section>
                        </main>
                    )
                }
            </>

        </main>
    )
}

export default Profile
