import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { getUserByIdAsync, updateUserByIdAsync } from '@/features/userAuth/userAuthSlice'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Fallback from '@/components/common/Fallback'
import WishlistCard from '@/components/profile/WishlistCard'
import video from '@/assets/video/empty.webm'

import { ProductProps, StoreProps } from '@/utils/types'
import { postWishlistFromUser } from '@/features/wishList/wishListSlice'
import { Modal } from '@/components/common/Modal'
import { toast } from 'react-toastify'

const schema = yup
    .object({
        firstname: yup.string().required(),
        lastname: yup.string().required(),
        address: yup.string().required(),
        email: yup.string().email().required(),
        phone: yup.string().required(),
    })
    .required()


function Profile(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const id = useSelector((state: StoreProps) => state.userAuth.user.id)
    const user = useSelector((state: StoreProps) => state.userAuth.userData)
    const wishlist = useSelector((state: StoreProps) => state.wishList.wishlist)
    const isLoading = useSelector((state: StoreProps) => state.userAuth.isLoading)

    const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm({
        defaultValues: {
            firstname: '',
            lastname: '',
            address: '',
            phone: '',
        },
        resolver: yupResolver(schema)
    })

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    function handleIsEditing() {
        setIsEditing(!isEditing)
    }

    function handleOpenConfirmation({ firstname, lastname, address, phone }: { firstname: string, lastname: string, address: string, phone: string }) {

        if (!firstname || !lastname || !address || !phone) {
            toast.error('You must provide all the values.')
            return
        }

        setIsOpen(true)
    }

    async function handlePostUpdate() {
        const updatedUser = getValues()
        const { payload } = await dispatch(updateUserByIdAsync(updatedUser))
        if (payload.updatedUser) {
            reset()
            setIsEditing(false)
            setIsOpen(false)
        }

    }

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
                                        <h1 className='w-full text-left text-9xl animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Profile</h1>
                                        {
                                            isEditing ? (
                                                <form className='text-[#ffffff]' onSubmit={handleSubmit(handleOpenConfirmation)}>
                                                    <div className="flex gap-x-2 gap-y-2">
                                                        <input {...register('firstname')} type='text' className={`w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.firstname !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Firstname' />
                                                        <input {...register('lastname')} type='text' className={`w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.lastname !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Lastname' />
                                                    </div>
                                                    <input {...register('email')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.email !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Email' />
                                                    <input {...register('address')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.address !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Address' />
                                                    <input {...register('phone')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.phone !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Phone' />
                                                    <div className="w-full flex justify-end gap-x-2 mt-5">
                                                        <button onClick={handleIsEditing} className='h-10 px-5 w-[100px] bg-[#ffffff] text-[#10100e] hover:bg-red-500 transition-color duration-200'>Cancel</button>
                                                        <button onClick={() => handleOpenConfirmation(getValues())} className='h-10 px-5 w-[100px] bg-[#ffffff] text-[#10100e] hover:bg-indigo-500 transition-color duration-200'>Save</button>
                                                    </div>
                                                </form>
                                            )
                                                :
                                                (
                                                    <div>
                                                        <div className="flex gap-x-1">
                                                            <p className='text-[2rem]'>{user.firstname}</p>
                                                            <p className='text-[2rem]'>{user.lastname}</p>
                                                        </div>
                                                        <p className='text-[1rem] text-sym_gray-100 font-light'>{user.email}</p>
                                                        <p className='text-[1rem] text-sym_gray-100 font-light'>{user.address}</p>
                                                        <p className='text-[1rem] text-sym_gray-100 font-light'>{user.phone}</p>
                                                        <button onClick={handleIsEditing} className='mt-5 hover:text-indigo-500 transition-color duration-200'>Edit Profile</button>
                                                    </div>
                                                )
                                        }
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
                                            <WishlistCard userId={id} key={i} product={{ ...product, quantity: 1 }} />
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
                <Modal openModal={isOpen} handleOpenModal={() => { setIsOpen(!isOpen) }}>
                    <main className='flex flex-col gap-y-5'>
                        <p className='text-[1.5rem]'>Please confirm your information before submitting:</p>
                        <section>
                            <div className="flex gap-x-1">
                                <p className='text-[2rem]'>{getValues().firstname}</p>
                                <p className='text-[2rem]'>{getValues().lastname}</p>
                            </div>
                            <p className='text-[1rem] text-sym_gray-400 font-light'>{getValues().email}</p>
                            <p className='text-[1rem] text-sym_gray-400 font-light'>{getValues().address}</p>
                            <p className='text-[1rem] text-sym_gray-400 font-light'>{getValues().phone}</p>
                        </section>
                        <div className="w-full flex justify-end gap-x-2 mt-5">
                            <button onClick={handleIsEditing} className='h-10 px-5 w-[100px] bg-[#10100e] text-[#ffffff] hover:bg-red-500 transition-color duration-200'>Cancel</button>
                            <button onClick={handlePostUpdate} className='h-10 px-5 w-[100px] bg-[#10100e] text-[#ffffff] hover:bg-indigo-500 transition-color duration-200'>Save</button>
                        </div>
                    </main>
                </Modal>
            </>

        </main>
    )
}

export default Profile
