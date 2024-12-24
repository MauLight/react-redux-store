import { type ReactElement } from 'react'

interface SummaryCardProps {
  product: any
}

export const SummaryCard = ({ product }: SummaryCardProps): ReactElement => {

  return (
    <div className="w-full grid grid-cols-8 border-b border-sym_gray-400 items-center pb-2">
      <div className="col-span-1 w-[40px] h-[40px] overflow-hidden border">
        <img src={product.image} alt="product" className="w-[40px] h-[40px] object-cover" />
      </div>
      <div className="col-span-7 h-full flex justify-between items-center">
        <h1 className='text-[1rem] text-[#ffffff] uppercase'>{product.title}</h1>
        <h1 className='text-[1rem] font-semiBold text-[#ffffff] uppercase'>{`${product.price}$`}</h1>
      </div>
    </div>
  )
}
