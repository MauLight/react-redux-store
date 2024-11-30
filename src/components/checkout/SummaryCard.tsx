import { type ReactElement } from 'react'

interface SummaryCardProps {
  product: any
}

export const SummaryCard = ({ product }: SummaryCardProps): ReactElement => {

  return (
    <div className="grid grid-cols-8 border-b border-[#10100e] pb-3">
      <div className="col-span-1 border">
        <img src={product.image} alt="product" className="w-[80px] h-[80px] object-cover" />
      </div>
      <div className="col-span-6 h-full flex flex-col justify-start items-between px-5">
        <div className="w-full flex justify-between">
          <div className="flex flex-col">
            <h1 className='text-xl aktivLight text-[#ffffff] uppercase'>{product.title}</h1>
            <div className="flex">
              <h1 className='text-xl font-semiBold text-[#ffffff] uppercase'>{`${product.price}$`}</h1>
              <h1 className='text-md aktivLight text-[#ffffff] uppercase line-through'>{`${product.discount}$`}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
