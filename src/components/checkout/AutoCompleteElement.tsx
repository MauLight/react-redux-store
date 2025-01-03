import { getUserByIdAsync, updateUserByIdAsync } from "@/features/userAuth/userAuthSlice"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/store/store"

import TransbankForm from "./TransbankForm"
import { RotatingLines } from "react-loader-spinner"

import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'

import { StoreProps } from "@/utils/types"
import { updateOrderAddressAsync } from "@/features/cart/cartSlice"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

interface PlaceAutocompleteProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
    selectedPlace: google.maps.places.PlaceResult
}

interface BillingAddressProps {
    country: string
    state: string
    city: string
    street: string
    street_number: string
    house_number?: string
    zipcode: string
}

const schema = yup
    .object({
        country: yup.string().required(),
        state: yup.string().required(),
        city: yup.string().required(),
        street: yup.string().required(),
        street_number: yup.string().required(),
        house_number: yup.string(),
        zipcode: yup.string().required(),
        additional_information: yup.string()
    })
    .required()


const PlaceAutocomplete = ({ onPlaceSelect, selectedPlace }: PlaceAutocompleteProps) => {

    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch()
    const id = useSelector((state: StoreProps) => state.userAuth.user).id
    const user = useSelector((state: StoreProps) => state.userAuth.userData)
    const isLoading = useSelector((state: StoreProps) => state.userAuth.isLoading)
    const updateAddressError = useSelector((state: StoreProps) => state.cart.hasError)
    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
    const [billingAddress, setBillingAddress] = useState<BillingAddressProps | null>(null)
    const [gotAddress, setGotAddress] = useState<boolean>(false)

    const [placeFromUser, setPlaceFromUser] = useState<boolean>(false)
    const [userWasUpdated, setUserWasUpdated] = useState<boolean>(false)

    const shippingFormRef = useRef<HTMLFormElement>(null)

    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm({
        defaultValues: {
            country: '',
            state: '',
            city: '',
            street: '',
            street_number: '',
            house_number: '',
            zipcode: '',
            additional_information: '',
        },
        resolver: yupResolver(schema)
    })

    function scrollToElement() {
        if (shippingFormRef.current) {
            shippingFormRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const inputRef = useRef<HTMLInputElement>(null)
    const places = useMapsLibrary('places')

    async function handleSaveDefaultAddress() {
        const updatedUser = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
        }

        const updatedAddress = {
            street: getValues().street,
            street_number: getValues().street_number,
            house_number: getValues().house_number,
            city: getValues().city,
            state: getValues().state,
            country: getValues().country,
            zipcode: getValues().zipcode
        }

        const { payload } = await dispatch(updateUserByIdAsync({ ...updatedUser, ...updatedAddress }))
        if (payload.updatedUser) {
            const buyOrder = localStorage.getItem('marketplace-order')
            if (buyOrder) {
                const { payload } = await dispatch(updateOrderAddressAsync({ address: updatedAddress, buyOrder }))
                if (payload.message) {
                    setUserWasUpdated(true)
                }
            } else {
                toast.error('Order could not be completed, please try again.')
                setTimeout(() => {
                    navigate('/')
                }, 2000)
            }
        }
    }

    useLayoutEffect(() => {
        dispatch(getUserByIdAsync(id))
    }, [])

    useEffect(() => {
        if (user) {
            setValue('country', user.country)
            setValue('state', user.state)
            setValue('city', user.city)
            setValue('street', user.street)
            setValue('street_number', user.street_number)
            setValue('house_number', user.house_number)
            setValue('zipcode', user.zipcode)

            setBillingAddress({
                country: user.country,
                state: user.state,
                city: user.city,
                street: user.street,
                street_number: user.street_number,
                house_number: user.house_number,
                zipcode: user.zipcode
            })
        }

        setPlaceFromUser(true)
        setGotAddress(true)
    }, [user])

    useEffect(() => {
        if (!places || !inputRef.current) return

        const options = {
            fields: ['geometry', 'name', 'formatted_address']
        }

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options))
    }, [places])

    useEffect(() => {
        if (!placeAutocomplete) return

        placeAutocomplete.addListener('place_changed', () => {
            const fetchedAddress = placeAutocomplete.getPlace()
            onPlaceSelect(fetchedAddress)
            if (fetchedAddress.formatted_address !== undefined) {
                const commaSeparated = fetchedAddress.formatted_address.split(',')

                const newAddress = {
                    street: commaSeparated[0]?.split(' ')?.slice(0, -1).join(' ') || '',
                    street_number: commaSeparated[0]?.split(' ')[commaSeparated[0]?.split(' ')?.length - 1] || '',
                    city: commaSeparated[1].trim().split(' ').length > 2 ? `${commaSeparated[1].trim().split(' ')[1]} ${commaSeparated[1].trim().split(' ')[2]}` : commaSeparated[1].trim().split(' ')[1],
                    state: commaSeparated[2],
                    country: commaSeparated[3].trim(),
                    zipcode: commaSeparated[1].trim().split(' ')[0]
                }

                setValue('country', newAddress.country)
                setValue('state', newAddress.state)
                setValue('city', newAddress.city)
                setValue('street', newAddress.street)
                setValue('street_number', newAddress.street_number)
                setValue('zipcode', newAddress.zipcode)

                setBillingAddress(newAddress)
                setGotAddress(true)
            }
        })
    }, [onPlaceSelect, placeAutocomplete])

    useEffect(() => {
        if (gotAddress || shippingFormRef.current) {
            scrollToElement()
        }
    }, [gotAddress])

    useEffect(() => {
        if (updateAddressError) {
            toast.error('There was an error from our part, please try again.')
            setTimeout(() => {
                window.location.reload()
            }, 3000)
        }
    }, [updateAddressError])

    return (
        <div className="flex flex-col gap-y-10 pt-10">
            <div className="autocomplete-container">
                <label className="text-[#ffffff] text-[1rem]" htmlFor="placeautocomplete">Check your shipping address</label>
                <input id="placeautocomplete" className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`} ref={inputRef} />
            </div>
            {
                gotAddress && billingAddress && (
                    <main className="flex flex-col gap-y-20">
                        <section className="flex flex-col gap-y-10">
                            <form onSubmit={handleSubmit(handleSaveDefaultAddress)} ref={shippingFormRef} className="flex flex-col gap-y-10">
                                <h1 className="text-[2rem] uppercase text-[#ffffff]">Shipping address</h1>
                                <div className="w-full grid grid-cols-2 gap-x-5">
                                    <div className="">
                                        <label className="text-[#ffffff] text-[1rem]" htmlFor="country">Country</label>
                                        <input {...register('country')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.country !== undefined ? 'ring-1 ring-red-500' : ''}`} />
                                    </div>
                                    <div className="">
                                        <label className="text-[#ffffff] text-[1rem]" htmlFor="state">State</label>
                                        <input {...register('state')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.state !== undefined ? 'ring-1 ring-red-500' : ''}`} />
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-2 gap-x-5">
                                    <div className="col-span-1">
                                        <label className="text-[#ffffff] text-[1rem]" htmlFor="city">City</label>
                                        <input {...register('city')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.city !== undefined ? 'ring-1 ring-red-500' : ''}`} />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-[#ffffff] text-[1rem]" htmlFor="street">Street</label>
                                        <input {...register('street')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.street !== undefined ? 'ring-1 ring-red-500' : ''}`} />
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-3 gap-x-5">
                                    <div className="col-span-1">
                                        <label className="text-[#ffffff] text-[1rem]" htmlFor="city">Street number</label>
                                        <input {...register('street_number')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.street_number !== undefined ? 'ring-1 ring-red-500' : ''}`} />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-[#ffffff] text-[1rem]" htmlFor="street">{'House number (*)'}</label>
                                        <input {...register('house_number')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`} />
                                    </div>
                                    <div className="">
                                        <label className="text-[#ffffff] text-[1rem]" htmlFor="zip">Zipcode</label>
                                        <input {...register('zipcode')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.zipcode !== undefined ? 'ring-1 ring-red-500' : ''}`} />
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-1 gap-x-5">
                                    <div className="">
                                        <label className="text-[#ffffff] text-[1rem]" htmlFor="zip">{'Additional Information (*)'}</label>
                                        <textarea {...register('additional_information')} className="w-full h-20 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none p-2 placeholder-sym_gray-500" />
                                    </div>
                                    <small className="text-[#ffffff] mt-5">{'(*) Optional'}</small>
                                </div>
                            </form>
                            <div>
                                <button disabled={userWasUpdated} onClick={handleSaveDefaultAddress} className={`h-8 w-full bg-[#ffffff] ${updateAddressError ? 'bg-red-600 text-[#ffffff]' : userWasUpdated ? 'bg-green-400 cursor-not-allowed' : 'text-[#10100e] hover:bg-indigo-500 active:bg-[#ffffff]'} flex justify-center items-center`}>{isLoading ?
                                    <RotatingLines
                                        width="30"
                                        strokeColor={'#10100e'}
                                    />
                                    : updateAddressError ? 'Error' : userWasUpdated ? 'Saved' : 'Save Default Address'}</button>
                            </div>
                        </section>
                        <div className="flex flex-col gap-y-5 pb-20">
                            <h1 className="text-[2rem] uppercase text-[#ffffff]">Billing address</h1>
                            <div className="w-full grid grid-cols-2 gap-x-5">
                                <div className="col-span-1">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="street">Street</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, street: target.value }) }} value={billingAddress.street} id="street" className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`} />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="city">City</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, city: target.value }) }} value={billingAddress.city} id="city" className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`} />
                                </div>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-x-5">
                                <div className="">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="state">state</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, state: target.value }) }} value={billingAddress.state} id="state" className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`} />
                                </div>
                                <div className="">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="country">Country</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, country: target.value }) }} value={billingAddress.country} id="country" className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`} />
                                </div>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-x-5">
                                <div></div>
                                <div className="">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="zip">Zipcode</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, zipcode: target.value }) }} value={billingAddress.zipcode} id="zip" className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`} />
                                </div>
                            </div>
                            <TransbankForm placeFromUser={placeFromUser} selectedPlace={selectedPlace} />
                        </div>
                    </main>
                )
            }
        </div>
    )
}

export default PlaceAutocomplete