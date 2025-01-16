import { getUserByIdAsync, updateUserByIdAsync } from "@/features/userAuth/userAuthSlice"
import { Dispatch, memo, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/store/store"

import { RotatingLines } from "react-loader-spinner"

import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'

import { RegionProps, StoreProps } from "@/utils/types"
import { updateOrderAddressAsync } from "@/features/cart/cartSlice"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { getCoverageFromCourierAsync, getRegionsFromCourierAsync, postQuoteCourierAsync } from "@/features/courier/courierSlice"
import { getRegionsAsync } from "@/utils/functions"
import CourierOptions from "./CourierOptions"
//import BillingAddress from "./BillingAddress"
import Fallback from "../common/Fallback"
import ErrorComponent from "../common/ErrorComponent"
import CustomDropdown from "../common/CustomDropdown"

interface PlaceAutocompleteProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
    selectedPlace: google.maps.places.PlaceResult
    setStep: Dispatch<SetStateAction<{ one: boolean, two: boolean }>>
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


const PlaceAutocomplete = ({ onPlaceSelect, setStep }: PlaceAutocompleteProps) => {

    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch()
    //* Courier state
    const courierIsLoading = useSelector((state: StoreProps) => state.courier.isLoading)
    const courierHasError = useSelector((state: StoreProps) => state.courier.hasError)
    const regions = useSelector((state: StoreProps) => state.courier.regions)
    const counties = useSelector((state: StoreProps) => state.courier.counties)

    const id = useSelector((state: StoreProps) => state.userAuth.user).id
    const user = useSelector((state: StoreProps) => state.userAuth.userData)
    const isLoading = useSelector((state: StoreProps) => state.userAuth.isLoading)
    const updateAddressError = useSelector((state: StoreProps) => state.cart.hasError)
    const declaredWorth = useSelector((state: StoreProps) => state.cart.total)

    const [regionsList, setRegionsList] = useState<string[]>([])

    //* Courier options
    const quote = useSelector((state: StoreProps) => state.courier.quote)
    const cartHasError = useSelector((state: StoreProps) => state.cart.hasError)

    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
    const [gotAddress, setGotAddress] = useState<boolean>(false)

    const [userWasUpdated, setUserWasUpdated] = useState<boolean>(false)
    const [courierWasChosen, setCourierWasChosen] = useState<boolean>(false)

    const shippingFormRef = useRef<HTMLFormElement>(null)

    const { register, watch, handleSubmit, getValues, setValue, formState: { errors } } = useForm({
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

    const watchedValue = watch('state')

    const inputRef = useRef<HTMLInputElement>(null)
    const places = useMapsLibrary('places')

    function handleNextStep() {
        setStep({
            one: false,
            two: true
        })
    }

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
                const { payload } = await dispatch(updateOrderAddressAsync({ address: updatedAddress, buyOrder, additional: getValues().additional_information || '' }))
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
        }

        setGotAddress(true)

    }, [user])

    useEffect(() => {
        async function getRegions() {
            const { payload } = await dispatch(getRegionsFromCourierAsync())
            setRegionsList(payload.regions.map((region: RegionProps) => region.regionName))
        }

        getRegions()
    }, [])

    useEffect(() => {
        async function getCountiesAsync() {
            if (getValues().state !== '') {
                const selectedRegion = getValues().state
                const regionCode = regions.find(region => region.regionName === selectedRegion).regionId
                if (regionCode) {
                    await dispatch(getCoverageFromCourierAsync({ regionCode, type: 0 }))
                }
            }
        }

        if (regions.length > 0) {
            getCountiesAsync()
        }
    }, [watchedValue, regions])

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
                setGotAddress(true)
            }
        })
    }, [onPlaceSelect, placeAutocomplete])

    useEffect(() => {
        async function getRegionCodeAndCoverage() {
            const regions = await getRegionsAsync()
            if (regions.length > 0) {

                const regionCode = regions.find((region) => region.regionName === getValues().state)?.regionId

                if (regionCode) {
                    await dispatch(postQuoteCourierAsync({ regionCode, destinationCounty: getValues().city, declaredWorth, deliveryTime: 0 }))
                }
            }
        }

        if (gotAddress) {
            getRegionCodeAndCoverage()
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
        <div className="flex flex-col gap-y-10 pt-10 px-5">
            <div className="autocomplete-container flex flex-col gap-y-1">
                <label className="text-[#10100e] text-[0.8rem]" htmlFor="placeautocomplete">Search Location</label>
                <input id="placeautocomplete" className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 text-[#10100e] ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`} ref={inputRef} />
            </div>
            {
                gotAddress && (
                    <main className="flex flex-col gap-y-20 pb-10">
                        <section className="flex flex-col gap-y-5">
                            <h1 className="text-[1rem] text-[#10100e]">Shipping address</h1>
                            <form onSubmit={handleSubmit(handleSaveDefaultAddress)} ref={shippingFormRef} className="flex flex-col gap-y-5 text-[#10100e]">
                                <div className="w-full grid grid-cols-2 gap-x-5">
                                    <div className="">
                                        <label className=" text-[0.8rem]" htmlFor="country">Country</label>
                                        <input {...register('country')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.country !== undefined ? 'ring-1 ring-red-500' : ''}`} />
                                    </div>
                                    <div className="">
                                        <label className=" text-[0.8rem]" htmlFor="state">State</label>
                                        <CustomDropdown
                                            value='state'
                                            defaultValue={getValues().state}
                                            setValue={setValue}
                                            list={regionsList}
                                            loading={courierIsLoading}
                                            error={courierHasError}
                                        />
                                    </div>

                                </div>
                                <div className="w-full grid grid-cols-2 gap-x-5">
                                    <div className="col-span-1">
                                        <label className=" text-[0.8rem]" htmlFor="city">City</label>
                                        <CustomDropdown
                                            value='city'
                                            defaultValue={getValues().city}
                                            setValue={setValue}
                                            list={counties}
                                            loading={courierIsLoading}
                                            error={courierHasError}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className=" text-[0.8rem]" htmlFor="street">Street</label>
                                        <input {...register('street')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.street !== undefined ? 'ring-1 ring-red-500' : ''}`} />
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-3 gap-x-5">
                                    <div className="col-span-1">
                                        <label className=" text-[0.8rem]" htmlFor="city">Street number</label>
                                        <input {...register('street_number')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.street_number !== undefined ? 'ring-1 ring-red-500' : ''}`} />
                                    </div>
                                    <div className="col-span-1">
                                        <label className=" text-[0.8rem]" htmlFor="street">{'House number (*)'}</label>
                                        <input {...register('house_number')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`} />
                                    </div>
                                    <div className="">
                                        <label className=" text-[0.8rem]" htmlFor="zip">Zipcode</label>
                                        <input {...register('zipcode')} className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.zipcode !== undefined ? 'ring-1 ring-red-500' : ''}`} />
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-1 gap-x-5">
                                    <div className="">
                                        <label className=" text-[0.8rem]" htmlFor="zip">{'Additional Information (*)'}</label>
                                        <textarea {...register('additional_information')} className="w-full h-20 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none p-2 placeholder-sym_gray-500" />
                                    </div>
                                    <small className=" mt-5">{'(*) Optional'}</small>
                                </div>
                            </form>
                            <div className="flex justify-end">
                                <button disabled={userWasUpdated} onClick={handleSaveDefaultAddress} className={`h-8 w-[200px] text-[#ffffff] bg-[#10100e] ${updateAddressError ? 'bg-red-600 ' : userWasUpdated ? 'bg-green-400 cursor-not-allowed' : 'text-[#10100e] hover:bg-indigo-500 active:bg-[#ffffff]'} flex justify-center items-center`}>{isLoading ?
                                    <RotatingLines
                                        width="30"
                                        strokeColor={'#10100e'}
                                    />
                                    : updateAddressError ? 'Error' : userWasUpdated ? 'Saved' : 'Confirm Address'}</button>
                            </div>
                        </section>
                        <>
                            {
                                cartHasError ? (
                                    <ErrorComponent />
                                )
                                    :
                                    (
                                        <div className="flex flex-col gap-y-5">
                                            {
                                                Object.keys(quote).length ? (
                                                    <CourierOptions quote={quote} setWasChosen={setCourierWasChosen} />
                                                )
                                                    :
                                                    (
                                                        <Fallback color='#6366f1' />
                                                    )
                                            }
                                            {
                                                userWasUpdated && courierWasChosen && (
                                                    <div className="w-full flex flex-col items-end gap-x-2">
                                                        <button onClick={handleNextStep} className="h-8 w-[200px] text-[#ffffff] bg-[#10100e]">Next</button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                            }
                        </>
                    </main>
                )
            }
        </div>
    )
}

export default memo(PlaceAutocomplete)