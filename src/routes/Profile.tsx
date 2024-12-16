import { useEffect, useLayoutEffect, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { getUserByIdAsync } from '@/features/userAuth/userAuthSlice'

import Fallback from '@/components/common/Fallback'
import WishlistCard from '@/components/profile/WishlistCard'
import video from '@/assets/video/empty.webm'

import { ProductProps, StoreProps } from '@/utils/types'
import { postWishlistFromUser } from '@/features/wishList/wishListSlice'


function Profile(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const id = useSelector((state: StoreProps) => state.userAuth.user.id)
    const user = useSelector((state: StoreProps) => state.userAuth.userData)
    const wishlist = useSelector((state: StoreProps) => state.wishList.wishlist)
    const isLoading = useSelector((state: StoreProps) => state.userAuth.isLoading)

    useLayoutEffect(() => {
        dispatch(getUserByIdAsync(id))
    }, [])

    useEffect(() => {
        if (user.wishlist) {
            dispatch(postWishlistFromUser(user.wishlist))
        }
    }, [user])

    return (
        <main className='w-screen min-h-screen flex flex-col items-center gap-y-20 pt-44 pb-20'>
            <>
                {
                    isLoading && (
                        <Fallback color='#ffffff' />
                    )
                }
                {
                    !isLoading && user && (
                        <main>
                            <header className='w-[1440px] text-[#ffffff] flex flex-col gap-y-2 tracking-tight uppercase'>
                                <div className='flex'>
                                    <div className='flex flex-col items-end gap-y-5'>
                                        <h1 className='text-9xl animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Profile</h1>
                                        <div>
                                            <div className="flex gap-x-1">
                                                <p className='text-[2rem]'>{user.firstname}</p>
                                                <p className='text-[2rem]'>{user.lastname}</p>
                                            </div>
                                            <p className='text-[1rem] text-sym_gray-100 font-light'>{user.email}</p>
                                            <p className='text-[1rem] text-sym_gray-100 font-light'>{user.address}</p>
                                            <p className='text-[1rem] text-sym_gray-100 font-light'>{user.phone}</p>
                                            <button className='mt-5 hover:text-indigo-500 transition-color duration-200'>Edit Profile</button>
                                        </div>
                                    </div>
                                    <div className="grow"></div>
                                </div>
                                <div className="w-full border-b border-sym_gray-50 mt-20"></div>
                            </header>
                            <section className='w-[1440px] flex flex-col gap-y-5 pt-10'>
                                <h1 className='text-[#ffffff] text-[3rem] uppercase'>Wishlist</h1>
                                <div className='flex flex-col gap-y-5 py-10 px-5 border bg-[#ffffff]'>
                                    {
                                        wishlist.length > 0 && wishlist.map((product: ProductProps, i: number) => (
                                            <WishlistCard dispatch={() => { }} key={i} product={{ ...product, quantity: 1 }} />
                                        ))
                                    }
                                    {
                                        wishlist.length === 0 && (
                                            <div className='relative'>
                                                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-end pb-20 z-10">
                                                    <h1 className='text-[2rem]'>It's a little empty in here...</h1>
                                                </div>
                                                <video className='w-full object-cover' autoPlay loop muted src={video} />
                                            </div>
                                        )
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
