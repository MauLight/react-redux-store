import { Dispatch, ReactNode, SetStateAction } from 'react'
import TransbankForm from './TransbankForm'
import { BillingAddressProps } from '@/utils/types'

//* In this case, selectedPlace (google address value) and placefromUser (boolean, true if fetched address from user) signal if the user address was selected.

interface BillingAddressComponentProps {
    billingAddress: BillingAddressProps
    setBillingAddress: Dispatch<SetStateAction<BillingAddressProps | null>>
    placeFromUser: boolean
    selectedPlace: any
}

export default function BillingAddress({ billingAddress, setBillingAddress }: BillingAddressComponentProps): ReactNode {

    return (
        <section className="flex flex-col gap-y-5 pb-20">
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
            <TransbankForm readyToPay={true} />
        </section>
    )
}
