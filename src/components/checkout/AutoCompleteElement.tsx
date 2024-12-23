import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { useEffect, useRef, useState } from "react"

interface PlaceAutocompleteProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
}


const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
    const [address, setAddress] = useState<{ street: string, city: string, region: string, country: string, zip: string } | null>(null)
    const [billingAddress, setBillingAddress] = useState<{ street: string, city: string, region: string, country: string, zip: string } | null>(null)

    const shippingFormRef = useRef<HTMLDivElement>(null)

    function scrollToElement() {
        if (shippingFormRef.current) {
            shippingFormRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const inputRef = useRef<HTMLInputElement>(null)
    const places = useMapsLibrary('places')

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
                    city: commaSeparated[1].trim().split(' ')[1],
                    region: commaSeparated[2],
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
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="region">Region</label>
                                    <input onChange={({ target }) => { setAddress({ ...address, region: target.value }) }} value={address.region} id="region" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
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
                                    <label className="text-[#ffffff] text-[1rem]" htmlFor="region">Region</label>
                                    <input onChange={({ target }) => { setBillingAddress({ ...billingAddress, region: target.value }) }} value={billingAddress.region} id="region" className="w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500" />
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
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default PlaceAutocomplete