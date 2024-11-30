import { Dispatch, SetStateAction, type ReactElement } from 'react'

interface CheckSummaryProps {
    numberOfProducts: number
    total: number
    taxes: number
    totalWithTaxes: number
    setReadyToPay: Dispatch<SetStateAction<boolean>>
}

export const CheckSummary = ({ numberOfProducts, total, taxes, totalWithTaxes, setReadyToPay } : CheckSummaryProps): ReactElement => {
  const handleCheckout = () => {
    totalWithTaxes !== 0 && setReadyToPay(true)
  }

  return (
    <div className="sticky top-0 right-0 flex flex-col">
      <h1 className='text-xl aktiv text-[#10100e] uppercase border-b border-[#10100e]'>Summary</h1>
      <div className="w-full flex flex-col pt-2 pb-3 border-[#10100e] border-b">
        <div className="w-full flex justify-between">
          <h1 className='text-lg aktivLight text-gray-700 uppercase'>{`${numberOfProducts} ${numberOfProducts > 1 || numberOfProducts === 0 ? 'products' : 'product'}`}</h1>
          <h1 className='text-lg aktivLight text-gray-700 uppercase'>{total}$</h1>
        </div>
        <div className="w-full flex justify-between">
          <h1 className='text-lg aktivLight text-gray-700 uppercase leading-none'>Shipping</h1>
          <h1 className='text-lg aktivLight text-gray-700 uppercase'>See at checkout</h1>
        </div>
      </div>
      <div className="w-full flex flex-col py-2">
        <div className="w-full flex justify-between">
          <h1 className='text-lg aktiv text-[#10100e] uppercase'>Total amount</h1>
          <h1 className='text-lg aktivLight text-gray-700 uppercase'>{totalWithTaxes}$</h1>
        </div>
        <div className="w-full flex justify-between">
          <h1 className='text-lg aktivLight text-gray-700 uppercase leading-none'>{`Includes ${taxes} VAT`}</h1>
        </div>
      </div>
      <button disabled={totalWithTaxes === 0} onClick={handleCheckout} className={`h-10 px-2 uppercase text-[#ffffff] mt-3 transition-all duration-200 ${totalWithTaxes === 0 ? 'cursor-not-allowed bg-gray-600' : 'bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'}`}>Checkout</button>
      <div className="w-full border-t border-[#10100e] mt-10">
        <h1 className='text-lg aktivLight text-[#10100e] uppercase'>Accepted payment methods</h1>
        <div className="w-full h-10 flex items-center justify-between">
          <i className="fa-brands fa-xl fa-cc-visa text-[#10100e]"></i>
          <i className="fa-brands fa-xl fa-cc-mastercard text-[#10100e]"></i>
          <i className="fa-brands fa-xl fa-cc-apple-pay text-[#10100e]"></i>
          <i className="fa-brands fa-xl fa-google-pay text-[#10100e]"></i>
          <i className="fa-brands fa-xl fa-cc-paypal text-[#10100e]"></i>
          <i className="fa-brands fa-xl fa-cc-stripe text-[#10100e]"></i>
        </div>
      </div>
    </div>
  )
}
