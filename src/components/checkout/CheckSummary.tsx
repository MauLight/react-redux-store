import { type ReactNode, useState } from 'react'
import { AppDispatch } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { createTransbankTransactionAsync, postTotal, resetCart, setReadyToPay } from '@/features/cart/cartSlice'

import { v4 as uuid } from 'uuid'
import { StoreProps } from '@/utils/types'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../common/Modal'

interface CheckSummaryProps {
  numberOfProducts: number
  total: number
  taxes: number
  totalWithTaxes: number
  children: ReactNode
}

export const CheckSummary = ({ numberOfProducts, total, taxes, totalWithTaxes, children }: CheckSummaryProps): ReactNode => {

  const [openModal, setOpenModal] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch()
  const user = useSelector((state: StoreProps) => state.userAuth.user)
  const navigate = useNavigate()

  async function handleTransbankCreateTransaction() {
    const sessionId = `session-${Date.now().toString()}-${uuid()}`
    const paymentInformation = { amount: totalWithTaxes, sessionId }

    const { payload } = await dispatch(createTransbankTransactionAsync(paymentInformation))
    localStorage.setItem('marketplace-order', payload.buyOrder)
  }

  const handleCheckout = async () => {
    if (!user.token) {
      navigate('/login?checkout=true')
    }
    if (totalWithTaxes > 0 && user.token) {
      await handleTransbankCreateTransaction()
      dispatch(postTotal(totalWithTaxes))
      dispatch(setReadyToPay())
    }
  }

  function handleOpenModal() {
    setOpenModal(!openModal)
  }

  const handleClearCart = () => {
    dispatch(resetCart())
    localStorage.removeItem('marketplace-cart')
    navigate('/')
  }

  return (
    <div className="sticky top-0 right-0 flex flex-col">
      <h1 className='text-xl aktiv text-[#10100e] uppercase border-b border-[#10100e]'>Summary</h1>
      <div className="w-full flex flex-col pt-2 pb-3 border-[#10100e] border-b">
        <div className="w-full flex justify-between">
          <h1 className='text-[1rem] lg:text-lg text-gray-700 uppercase'>{`${numberOfProducts} ${numberOfProducts > 1 || numberOfProducts === 0 ? 'products' : 'product'}`}</h1>
          <h1 className='text-[1rem] lg:text-lg text-gray-700 uppercase'>{total}$</h1>
        </div>
        <div className="w-full flex justify-between">
          <h1 className='text-[1rem] lg:text-lg text-gray-700 uppercase leading-none'>Shipping</h1>
          <h1 className='text-[1rem] lg:text-lg text-gray-700 uppercase'>See at checkout</h1>
        </div>
      </div>
      <div className="w-full flex flex-col py-2">
        <div className="w-full flex justify-between">
          <h1 className='text-lg aktiv text-[#10100e] uppercase'>Total amount</h1>
          <h1 className='text-[1rem] lg:text-lg text-gray-700 uppercase'>{totalWithTaxes}$</h1>
        </div>
        <div className="w-full flex justify-between">
          <h1 className='text-[1rem] lg:text-lg text-gray-700 uppercase leading-none'>{`Includes ${taxes} VAT`}</h1>
        </div>
      </div>
      <button disabled={totalWithTaxes === 0} onClick={handleCheckout} className={`h-10 px-2 uppercase text-[#ffffff] mt-3 transition-all duration-200 ${totalWithTaxes === 0 ? 'cursor-not-allowed bg-gray-600' : 'bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'}`}>Checkout</button>
      <div className="w-full border-t border-[#10100e] mt-10">
        <h1 className='text-[1rem] lg:text-lg text-[#10100e] uppercase'>Accepted payment methods</h1>
        <div className="w-full h-10 flex items-center justify-between">
          <i className="fa-brands fa-xl fa-cc-visa text-[#10100e]"></i>
          <i className="fa-brands fa-xl fa-cc-mastercard text-[#10100e]"></i>
          <i className="fa-brands fa-xl fa-cc-apple-pay text-[#10100e]"></i>
          <i className="fa-brands fa-xl fa-google-pay text-[#10100e]"></i>
          <i className="fa-brands fa-xl fa-cc-paypal text-[#10100e]"></i>
          <i className="fa-brands fa-xl fa-cc-stripe text-[#10100e]"></i>
        </div>
      </div>
      <button className='mt-5 px-5 h-10 border hover:border-transparent hover:bg-red-600 hover:text-[#ffffff] transition-color duration-200' onClick={handleOpenModal}>Clear cart</button>
      <Modal openModal={openModal} handleOpenModal={handleOpenModal} >
        <div className='flex flex-col gap-y-10'>
          <h1 className='text-[1.5rem]'>This action will clear your cart.</h1>
          {
            children
          }
          <div className="flex justify-end gap-x-2">
            <button onClick={handleOpenModal} className='h-8 w-[150px] bg-[#10100e] hover:bg-red-500 transition-color duration-200 text-[#ffffff]'>Cancel</button>
            <button onClick={handleClearCart} className='h-8 w-[150px] bg-[#10100e] hover:bg-indigo-500 transition-color duration-200 text-[#ffffff]'>Confirm</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
