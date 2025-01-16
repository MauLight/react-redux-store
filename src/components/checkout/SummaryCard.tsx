import { type ReactElement } from 'react'

interface SummaryCardProps {
  product: any
  isPayment?: boolean
}

export const SummaryCard = ({ product, isPayment }: SummaryCardProps): ReactElement => {

  function getPercentage() {
    const percentage = product.discount
    const price = product.price
    const discount = percentage ? (percentage / 100) * price : 0
    return (price - discount)
  }

  const vat = (19 / 100) * getPercentage()

  return (
    <>
      <div className="w-full grid grid-cols-8 gap-y-2 items-center">
        <div className={`col-span-1 ${isPayment ? 'w-[100px] h-[100px]' : 'w-[40px] h-[40px]'} overflow-hidden border`}>
          <img src={product.image} alt="product" className="w-full h-full object-cover" />
        </div>
        <div className={`col-span-7 flex flex-col items-end ${isPayment ? 'text-[#10100e]' : 'text-[#ffffff]'}`}>
          <h1 className='text-[1rem] uppercase'>{product.title}</h1>
          <h1 className='text-[1rem] font-semiBold uppercase'>{`${getPercentage()}$`}</h1>
        </div>
      </div>
      <div className={`flex justify-end gap-x-2 border-b border-sym_gray-400 ${isPayment ? 'text-[#10100e]' : 'text-[#ffffff]'}`}>
        <h1 className='text-[0.8rem]'>+ Taxes</h1>
        <h1 className='text-[0.8rem] font-semiBold uppercase'>{`${vat}$`}</h1>
      </div>
    </>
  )
}
