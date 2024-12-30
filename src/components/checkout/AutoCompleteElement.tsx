import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import TransbankForm from "./TransbankForm"
import { useDispatch, useSelector } from "react-redux"
import { StoreProps } from "@/utils/types"
import { getUserByIdAsync } from "@/features/userAuth/userAuthSlice"
import { AppDispatch } from "@/store/store"

interface PlaceAutocompleteProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
    selectedPlace: google.maps.places.PlaceResult
}


const PlaceAutocomplete = ({ onPlaceSelect, selectedPlace }: PlaceAutocompleteProps) => {

    const dispatch: AppDispatch = useDispatch()
    const id = useSelector((state: StoreProps) => state.userAuth.user).id
    const user = useSelector((state: StoreProps) => state.userAuth.userData)
    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
    const [address, setAddress] = useState<{ street: string, city: string, state: string, country: string, zip: string } | null>(null)
    const [billingAddress, setBillingAddress] = useState<{ street: string, city: string, state: string, country: string, zip: string } | null>(null)

    const [placeFromUser, setPlaceFromUser] = useState<boolean>(false)

    const shippingFormRef = useRef<HTMLDivElement>(null)

    function scrollToElement() {
        if (shippingFormRef.current) {
            shippingFormRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const inputRef = useRef<HTMLInputElement>(null)
    const places = useMapsLibrary('places')

    useLayoutEffect(() => {
        dispatch(getUserByIdAsync(id))
    }, [])

    useEffect(() => {
        setAddress({
            street: user.street,
            city: user.city,
            state: user.state,
            country: user.country,
            zip: user.zipcode
        })

        setBillingAddress({
            street: user.street,
            city: user.city,
            state: user.state,
            country: user.country,
            zip: user.zipcode
        })

        setPlaceFromUser(true)
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
                    street: commaSeparated[0],
                    city: commaSeparated[1].trim().split(' ').length > 2 ? `${commaSeparated[1].trim().split(' ')[1]} ${commaSeparated[1].trim().split(' ')[2]}` : commaSeparated[1].trim().split(' ')[1],
                    state: commaSeparated[2],
                    country: commaSeparated[3].trim(),
                    zip: commaSeparated[1].trim().split(' ')[0]
                }
                setAddress(newAddress)
                setBillingAddress(newAddress)
            }
        })
    }, [onPlaceSelect, placeAutocomplete])

    useEffect(() => {
        if (address || shippingFormRef.current) {
            scrollToElement()
        }
    }, [address])

    return (
        <div className="flex flex-col gap-y-10 pt-10">
            <div className="autocomplete-container">
                <label className="text-[#ffffff] text-[1rem]" htmlFor="placeautocomplete">Check your shipping address</label>
                <input id="placeautocomplete" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" ref={inputRef} />
            </div>
            {
                address && billingAddress && (
                    <>
                        <div ref={shippingFormRef} className="flex flex-col gap-y-5 pb-20">
                            <h1 className="text-[2rem] uppercase text-[#ffffff]">Shipping address</h1>
                            <div className="w-full grid grid-cols-2 gap-x-5">
                                <div className="col-span-1">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="street">Street</label>
                                    <input onChange={({ target }) => { setAddress({ ...address, street: target.value }) }} value={address.street} id="street" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="city">City</label>
                                    <input onChange={({ target }) => { setAddress({ ...address, city: target.value }) }} value={address.city} id="city" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
                                </div>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-x-5">
                                <div className="">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="state">state</label>
                                    <input onChange={({ target }) => { setAddress({ ...address, state: target.value }) }} value={address.state} id="state" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
                                </div>
                                <div className="">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="country">Country</label>
                                    <input onChange={({ target }) => { setAddress({ ...address, country: target.value }) }} value={address.country} id="country" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
                                </div>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-x-5">
                                <div></div>
                                <div className="">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="zip">Zipcode</label>
                                    <input onChange={({ target }) => { setAddress({ ...address, zip: target.value }) }} value={address.zip} id="zip" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
                                </div>
                            </div>
                        </div>
                        <div className="border-b"></div>
                        <div className="flex flex-col gap-y-5 pb-20">
                            <h1 className="text-[2rem] uppercase text-[#ffffff]">Billing address</h1>
                            <div className="w-full grid grid-cols-2 gap-x-5">
                                <div className="col-span-1">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="street">Street</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, street: target.value }) }} value={billingAddress.street} id="street" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="city">City</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, city: target.value }) }} value={billingAddress.city} id="city" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
                                </div>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-x-5">
                                <div className="">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="state">state</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, state: target.value }) }} value={billingAddress.state} id="state" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
                                </div>
                                <div className="">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="country">Country</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, country: target.value }) }} value={billingAddress.country} id="country" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
                                </div>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-x-5">
                                <div></div>
                                <div className="">
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="zip">Zipcode</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, zip: target.value }) }} value={billingAddress.zip} id="zip" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
                                </div>
                            </div>
                            <TransbankForm placeFromUser={placeFromUser} selectedPlace={selectedPlace} />
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default PlaceAutocomplete