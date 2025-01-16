import { changeItemQuantity, removeItem } from '@/features/cart/cartSlice'
import { type ReactElement } from 'react'
import { useLocation } from 'react-router-dom'

interface CheckoutCardProps {
  product: any
  dispatch: any
  isConfirmation?: boolean
}

export const CheckoutCard = ({ product, dispatch, isConfirmation }: CheckoutCardProps): ReactElement => {

  const { pathname } = useLocation()
  const isProfile = pathname.includes('profile')

  const handleChangeQuantity = (type: number) => {
    if (product.quantity === 1 && type !== 1) {
      return
    }
    const id = product.id
    const newQuantity = type === 1 ? product.quantity + 1 : product.quantity - 1
    dispatch(changeItemQuantity({ id, newQuantity }))
  }

  function handleRemoveProduct(id: number) {
    dispatch(removeItem(id))
  }

  function getPercentage() {
    const percentage = product.discount
    const price = product.price
    const discount = percentage ? (percentage / 100) * price : 0
    return (price - discount)
  }

  return (
    <div key={product.id} className={`grid grid-cols-5 border-b border-[#10100e] pb-3 ${isConfirmation ? 'lg:h-[100px]' : 'lg:h-[220px]'}`}>
      <div className='col-span-1 border'>
        <img src={product.image} alt="product" className='w-full h-full object-cover' />
      </div>
      <div className={`${isConfirmation ? 'col-span-3' : 'col-span-4'} h-full flex flex-col justify-start items-between px-5`}>
        <div className="w-full flex justify-between">
          <div className="flex flex-col">
            <h1 className='text-[1rem] lg:text-xl text-[#10100e] uppercase'>{product.title}</h1>
            <div className="flex">
              <h1 className='text-xl font-semiBold text-[#10100e] uppercase'>{`${getPercentage()}$`}</h1>
              {
                product.discount && (
                  <h1 className='text-[1rem] lg:text-md text-[#10100e] uppercase line-through'>{`${product.price}$`}</h1>
                )
              }
            </div>
          </div>
          {
            !isConfirmation && (
              <div className="flex flex-col">
                <h1 className='text-[1rem] lg:text-xl text-[#10100e] uppercase'>Qty</h1>
                <div className='flex items-center justify-between border border-[#10100e] w-[80px] h-12 px-2'>{product.quantity}
                  <div className="h-full flex flex-col py-1 justify-between">
                    <i onClick={() => { handleChangeQuantity(1) }} className="fa-solid fa-md fa-plus hover:text-indigo-500"></i>
                    <i onClick={() => { handleChangeQuantity(2) }} className="fa-solid fa-md fa-minus hover:text-indigo-500"></i>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div className="w-full h-full flex justify-between item-end">
          {
            !isConfirmation && (
              <div className="flex gap-x-5 items-end">
                <button onClick={() => { handleRemoveProduct(product.id) }} className="h-10 flex items-center gap-x-1 py-1 cursor-pointer text-[#10100e] hover:text-red-600 transition-color duration-200">
                  <i className="fa-solid fa-trash-can pb-[3.5px]"></i>
                  <p className='text-[18px] pb-0 leading-none'>Remove</p>
                </button>
                {
                  isProfile && (
                    <button onClick={() => { handleRemoveProduct(product.id) }} className="h-10 flex items-center gap-x-1 cursor-pointer text-[18px] px-2 leading-none text-[#ffffff] animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                      <i className='relative fa-solid fa-cart-shopping cursor-pointer' />
                      <p className='text-[18px] pb-0 leading-none'>Add to Cart</p>
                    </button>
                  )
                }
              </div>
            )
          }
          {
            !isConfirmation && (
              <div className="flex items-end gap-x-1">
                <p className='pb-0 text-[1rem] leading-none text-[#10100e]'>Total</p>
                <p className='text-[1rem] pb-0 leading-none text-[#10100e]'>{`${product.price}$`}</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
