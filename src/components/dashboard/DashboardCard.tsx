import { deleteProductByIdAsync, updateProductByIdAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps } from '@/utils/types'
import { useState, type ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { Modal } from '../common/Modal'
import ProductDescription from '../common/ProductDescription'
import UpdateProductForm from './UpdateProductForm'

export default function DashboardCard({ product }: { product: ProductProps }): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [updateIsOpen, setUpdateIsOpen] = useState<boolean>(false)

    function handleOpenUpdateProduct() {
        setUpdateIsOpen(!updateIsOpen)
    }

    function handleOpenDeleteProduct() {
        setModalIsOpen(!modalIsOpen)
    }

    async function handleUpdateProduct() {
        await dispatch(updateProductByIdAsync(product.id as string))
        setModalIsOpen(false)
    }

    async function handleDeleteProduct() {
        await dispatch(deleteProductByIdAsync(product.id as string))
        setModalIsOpen(false)
    }

    return (
        <div className='h-20 w-full grid grid-cols-9 gap-x-5 px-10 border-b bg-[#ffffff] content-center overflow-x-scroll'>
            <p className='text-balance truncate'>{product.id}</p>
            <p className='text-balance truncate uppercase'>{product.title}</p>
            <p className='col-span-2 text-balance font-light truncate line-clamp-2'>{product.description}</p>
            <p className='text-balance truncate'>{product.price}</p>
            <p className='text-balance truncate'>{product.discount}</p>
            <a target='_blank' aria-label='image' href={product.image} className='text-balance font-light truncate'>{product.image}</a>
            <p className='text-balance truncate'>{product.rating?.averageRating}</p>
            <div className="flex gap-x-2 justify-center">
                <button onClick={handleOpenUpdateProduct} className='h-10 w-[50px] bg-[#10100e] text-[#ffffff] hover:bg-indigo-500 transition-color duration-200 rounded-[10px]'>
                    <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button onClick={handleOpenDeleteProduct} className='h-10 w-[50px] bg-[#10100e] text-[#ffffff] hover:bg-red-500 transition-color duration-200 rounded-[10px]'>
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
            <Modal openModal={modalIsOpen} handleOpenModal={handleOpenDeleteProduct}>
                <section className='flex flex-col gap-y-10'>
                    <h1 className='text-[1.5rem] text-balance uppercase'>Are you sure you want to delete this product?</h1>
                    <ProductDescription product={product} />
                    <div className="flex justify-end gap-x-5">
                        <button onClick={handleOpenDeleteProduct} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-red-500 active:bg-[#10100e] rounded-[10px]'>Cancel</button>
                        <button onClick={handleDeleteProduct} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] rounded-[10px]'>Confirm</button>
                    </div>
                </section>
            </Modal>
            <Modal openModal={updateIsOpen} handleOpenModal={handleOpenUpdateProduct}>
                <section className='flex flex-col gap-y-10'>
                    <h1 className='text-[1.5rem] text-balance uppercase'>Update product</h1>
                    <UpdateProductForm product={product} />
                    <div className="flex justify-end gap-x-5">
                        <button onClick={handleOpenUpdateProduct} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-red-500 active:bg-[#10100e] rounded-[10px]'>Cancel</button>
                        <button onClick={handleUpdateProduct} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] rounded-[10px]'>Confirm</button>
                    </div>
                </section>
            </Modal>
        </div>
    )
}
