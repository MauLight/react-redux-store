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

import { ProductProps, RegionProps, DropdownProps, StoreProps } from '@/utils/types'
import { postListToWishlistAsync, postWishlistFromUser } from '@/features/wishList/wishListSlice'
import { Modal } from '@/components/common/Modal'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { getRegionsAsync } from '@/utils/functions'

interface OpenConfirmationProps {
    firstname: string
    lastname: string
    email: string
    phone: string
    street: string
    street_number: string
    house_number?: string
    city: string
    state: string
    country: string
    zipcode: string
}

const schema = yup
    .object({
        firstname: yup.string().required(),
        lastname: yup.string().required(),
        street: yup.string().required(),
        street_number: yup.string().required(),
        house_number: yup.string(),
        city: yup.string().required(),
        state: yup.string().required(),
        country: yup.string().required(),
        zipcode: yup.string().required(),
        email: yup.string().email().required(),
        phone: yup.string().required(),
    })
    .required()


function Profile(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const id = useSelector((state: StoreProps) => state.userAuth.user.id)
    const loggedUser = useSelector((state: StoreProps) => state.userAuth.user)
    const user = useSelector((state: StoreProps) => state.userAuth.userData)
    const wishlist = useSelector((state: StoreProps) => state.wishList.wishlist)
    const isLoading = useSelector((state: StoreProps) => state.userAuth.isLoading)
    const navigate = useNavigate()

    const { register, handleSubmit, getValues, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            street: user.street || '',
            street_number: user.street_number || '',
            house_number: user.house_number || '',
            city: user.city || '',
            state: user.state || '',
            country: user.country || '',
            phone: user.phone || '',
            zipcode: user.zipcode || '',
            email: user.email || ''
        },
        resolver: yupResolver(schema)
    })

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [regionsList, setRegionsList] = useState<string[]>([])

    function handleCancelConfirmation() {
        setIsOpen(false)
        setIsEditing(false)
    }

    function handleOpenConfirmation({ firstname, lastname, street, street_number, city, state, country, zipcode, phone, email }: OpenConfirmationProps) {
        console.log(state)
        if (!firstname || !lastname || !street || !street_number || !phone || !city || !state || !country || !email || !zipcode) {
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
        if (Object.keys(loggedUser).length === 0) {
            navigate('/')
        }
    }, [user])

    useLayoutEffect(() => {
        const invitedWishList = JSON.parse(localStorage.getItem('marketplace-invitedWishlist') || '[]')
        if (invitedWishList.length > 0) {
            dispatch(postListToWishlistAsync(invitedWishList))
        }

        dispatch(getUserByIdAsync(id))
    }, [])

    useLayoutEffect(() => {
        if (user) {
            setValue('firstname', user.firstname)
            setValue('lastname', user.lastname)
            setValue('email', user.email)
            setValue('phone', user.phone)
            setValue('country', user.country)
            setValue('state', user.state)
            setValue('city', user.city)
            setValue('street', user.street)
            setValue('street_number', user.street_number)
            setValue('house_number', user.house_number)
            setValue('zipcode', user.zipcode)
        }
    }, [user])

    useEffect(() => {
        async function getRegions() {
            const regions = await getRegionsAsync()
            setRegionsList(regions.map((region: RegionProps) => region.regionName))
        }

        getRegions()
    }, [])

    useEffect(() => {
        if (user.wishlist) {
            dispatch(postWishlistFromUser(user.wishlist))
        }
    }, [user])

    return (
        <main className='w-screen min-h-screen flex flex-col items-center gap-y-20 pt-44 pb-20 bg-[#10100e]'>
            <>
                {
                    isLoading && (
                        <Fallback color='#ffffff' />
                    )
                }
                {
                    !isLoading && user && (
                        <main>
                            <header className='w-full min-[1440px]:w-[1440px] text-[#ffffff] flex flex-col gap-y-2 tracking-tight uppercase'>
                                <div className='flex'>
                                    <div className='flex flex-col items-end gap-y-5'>
                                        <h1 className='w-full text-left text-[4rem] min-[530px]:text-9xl animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Profile</h1>
                                        {
                                            isEditing ? (
                                                <form className='text-[#ffffff] w-full flex flex-col gap-y-3' onSubmit={handleSubmit(handleOpenConfirmation)}>
                                                    <div className="flex gap-x-2 gap-y-2">
                                                        <input {...register('firstname')} type='text' className={`w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.firstname !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Firstname' />
                                                        <input {...register('lastname')} type='text' className={`w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.lastname !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Lastname' />
                                                    </div>
                                                    <input {...register('email')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.email !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Email' />
                                                    <input {...register('phone')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.phone !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Phone' />

                                                    <div className="flex gap-x-2 gap-y-2">
                                                        <input {...register('country')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.country !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Country' />
                                                        <RegionsDropdown defaultValue={getValues().state} setValue={setValue} list={regionsList} />
                                                    </div>
                                                    <div className="flex gap-x-2 gap-y-2">
                                                        <input {...register('city')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.city !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='City' />
                                                        <input {...register('street')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.street !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Street' />
                                                    </div>
                                                    <div className="flex gap-x-5 gap-y-2">
                                                        <input {...register('street_number')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.street_number !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Street Number' />
                                                        <input {...register('house_number')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.house_number !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='House Number' />
                                                        <input {...register('zipcode')} type='text' className={`mt-2 w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 ${errors.zipcode !== undefined ? 'ring-1 ring-red-500' : ''}`} placeholder='Zipcode' />
                                                    </div>

                                                    <div className="w-full flex justify-end gap-x-2 mt-5">
                                                        <button onClick={() => { setIsEditing(false) }} className='h-10 px-5 w-[100px] bg-[#ffffff] text-[#10100e] hover:bg-red-500 transition-color duration-200'>Cancel</button>
                                                        <button disabled={Object.keys(errors).length > 0} onClick={() => handleOpenConfirmation(getValues())} className={`h-10 px-5 w-[100px] transition-color duration-200 ${Object.keys(errors).length > 0 ? 'cursor-not-allowed bg-sym_gray-300' : 'bg-[#ffffff] text-[#10100e] hover:bg-indigo-500 '}`}>Save</button>
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
                                                        <p className='text-[1rem] text-sym_gray-100 font-light'>{user.street}</p>
                                                        <p className='text-[1rem] text-sym_gray-100 font-light'>{user.city}</p>
                                                        <p className='text-[1rem] text-sym_gray-100 font-light'>{user.state}</p>
                                                        <p className='text-[1rem] text-sym_gray-100 font-light'>{user.country}</p>
                                                        <p className='text-[1rem] text-sym_gray-100 font-light'>{user.zipcode}</p>
                                                        <p className='text-[1rem] text-sym_gray-100 font-light'>{user.phone}</p>
                                                        <button onClick={() => { setIsEditing(!isEditing) }} className='mt-5 hover:text-indigo-500 transition-color duration-200'>Edit Profile</button>
                                                    </div>
                                                )
                                        }
                                    </div>
                                    <div className="grow"></div>
                                </div>
                                <div className="w-full border-b border-sym_gray-50 mt-20"></div>
                            </header>
                            <section className='w-full min-[1440px]:w-[1440px] flex flex-col gap-y-5 pt-10'>
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
                        <div className="flex gap-x-1">
                            <p className='text-[2rem]'>{getValues().firstname}</p>
                            <p className='text-[2rem]'>{getValues().lastname}</p>
                        </div>
                        <section className='flex flex-col items-center gap-y-5'>
                            <div className="flex flex-col gap-y-1">
                                <p className='text-[1rem] text-sym_gray-400 font-light'>{getValues().email}</p>
                                <p className='text-[1rem] text-sym_gray-400 font-light'>{getValues().phone}</p>
                                <div className="flex gap-x-2">
                                    <p className='text-[1rem] text-sym_gray-400 font-light'>{`${getValues().street} ${getValues().street_number}`}</p>
                                    {
                                        getValues().house_number !== undefined && (
                                            <p className='text-[1rem] text-sym_gray-400 font-light'>{`#${getValues().house_number}`}</p>
                                        )
                                    }
                                </div>
                                <p className='text-[1rem] text-sym_gray-400 font-light'>{getValues().city}</p>
                                <p className='text-[1rem] text-sym_gray-400 font-light'>{getValues().state}</p>
                                <p className='text-[1rem] text-sym_gray-400 font-light'>{getValues().country}</p>
                                <p className='text-[1rem] text-sym_gray-400 font-light'>{getValues().zipcode}</p>
                            </div>
                        </section>
                        <div className="w-full flex justify-end gap-x-2 mt-5">
                            <button onClick={handleCancelConfirmation} className='h-10 px-5 w-[100px] bg-[#10100e] text-[#ffffff] hover:bg-red-500 transition-color duration-200'>Cancel</button>
                            <button onClick={handlePostUpdate} className='h-10 px-5 w-[100px] bg-[#10100e] text-[#ffffff] hover:bg-indigo-500 transition-color duration-200'>Save</button>
                        </div>
                    </main>
                </Modal>
            </>

        </main>
    )
}

export default Profile

function RegionsDropdown({ setValue, list, defaultValue }: DropdownProps): ReactNode {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [choice, setChoice] = useState<string>(defaultValue || '')

    useEffect(() => {
        if (choice !== '') {
            setValue('state', choice)
        }
    }, [choice])

    return (
        <div onClick={() => { setIsOpen(!isOpen) }} className='relative mt-2 w-full h-9 flex items-center bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2'>
            <p className={`capitalize ${choice === '' ? 'text-sym_gray-300' : 'text-[#ffffff]'}`}>{choice === '' ? 'State' : choice}</p>
            {
                isOpen && (
                    <div className='absolute top-9 left-0 w-full h-[200px] overflow-y-scroll bg-[#10100e] border-b border-x rounded-b-[5px]'>
                        {
                            list.map((item: string, i) => (
                                <button key={`${item}-${i}`} onClick={() => { setChoice(item) }} className='w-full h-9 bg-transparent rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300'>
                                    {
                                        item
                                    }
                                </button>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}