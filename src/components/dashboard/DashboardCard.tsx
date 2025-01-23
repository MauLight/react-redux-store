import { deleteProductByIdAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps, StoreProps } from '@/utils/types'
import { useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from '../common/Modal'
import ProductDescription from '../common/ProductDescription'
import UpdateProductForm from './UpdateProductForm'
import Fallback from '../common/Fallback'
import UpdateCollectionModal from './collections/UpdateCollectionModal'
import { resetErrorState } from '@/features/collections/collectionsSlice'

export default function DashboardCard({ product }: { product: ProductProps }): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const productsAreLoading = useSelector((state: StoreProps) => state.inventory.productsAreLoading)
    const collectionHasError = useSelector((state: StoreProps) => state.collections.hasErrors)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [updateIsOpen, setUpdateIsOpen] = useState<boolean>(false)
    const [collectionIsOpen, setCollectionIsOpen] = useState<boolean>(false)

    function handleOpenCollectionDialogue() {
        setCollectionIsOpen(!collectionIsOpen)
        if (collectionHasError) {
            dispatch(resetErrorState())
        }
    }

    function handleOpenUpdateProduct() {
        setUpdateIsOpen(!updateIsOpen)
    }

    function handleOpenDeleteProduct() {
        setModalIsOpen(!modalIsOpen)
    }

    async function handleDeleteProduct() {
        await dispatch(deleteProductByIdAsync(product.id as string))
        setModalIsOpen(false)
    }

    return (
        <div className='h-20 w-full grid grid-cols-11 gap-x-5 px-10 border-b bg-[#ffffff] content-center overflow-x-scroll'>
            <p className='text-balance truncate'>{product.id}</p>
            <p className='col-span-2  text-balance truncate uppercase'>{product.title}</p>
            <p className='text-balance truncate'>{product.brand || '...'}</p>
            <p className='col-span-2 text-balance font-light truncate line-clamp-2'>{product.description}</p>
            <p className='text-balance truncate'>{product.price}</p>
            <p className='text-balance truncate'>{product.discount}</p>
            <a target='_blank' aria-label='image' href={product.image} className='text-balance font-light truncate'>{product.image}</a>
            <p className='text-balance truncate'>{product.rating?.averageRating}</p>
            <div className="flex gap-x-2 justify-center items-center">
                <button onClick={handleOpenCollectionDialogue} className='h-[30px] w-[30px] bg-[#10100e] text-[#ffffff] hover:bg-indigo-500 transition-color duration-200 rounded-[10px]'>
                    <i className="fa-solid fa-layer-group"></i>
                </button>
                <button onClick={handleOpenUpdateProduct} className='h-[30px] w-[30px] bg-[#10100e] text-[#ffffff] hover:bg-indigo-500 transition-color duration-200 rounded-[10px]'>
                    <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button onClick={handleOpenDeleteProduct} className='h-[30px] w-[30px] bg-[#10100e] text-[#ffffff] hover:bg-red-500 transition-color duration-200 rounded-[10px]'>
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
            <Modal openModal={modalIsOpen} handleOpenModal={handleOpenDeleteProduct}>
                {
                    productsAreLoading ? (
                        <div className='min-h-[436px] flex justify-center items-center'>
                            <Fallback color='#6366f1' />
                        </div>
                    )
                        :
                        (
                            <section className='flex flex-col gap-y-10'>
                                <h1 className='text-[1.5rem] text-balance uppercase'>Are you sure you want to delete this product?</h1>
                                <ProductDescription product={product} />
                                <div className="flex justify-end gap-x-5">
                                    <button onClick={handleOpenDeleteProduct} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-red-500 active:bg-[#10100e] rounded-[10px]'>Cancel</button>
                                    <button onClick={handleDeleteProduct} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] rounded-[10px]'>Confirm</button>
                                </div>
                            </section>
                        )
                }

            </Modal>
            <Modal width='w-[1200px]' openModal={updateIsOpen} handleOpenModal={handleOpenUpdateProduct}>
                {
                    productsAreLoading ? (
                        <div className='min-h-[436px] flex justify-center items-center'>
                            <Fallback color='#6366f1' />
                        </div>
                    )
                        :
                        (
                            <section className='flex flex-col'>
                                <UpdateProductForm
                                    product={product}
                                    closeModal={handleOpenUpdateProduct}
                                    handleOpenUpdateProduct={handleOpenUpdateProduct}
                                />
                            </section>
                        )
                }
            </Modal>
            <Modal width='w-[500px]' openModal={collectionIsOpen} handleOpenModal={handleOpenCollectionDialogue}>
                {
                    productsAreLoading ? (
                        <div className='min-h-[436px] flex justify-center items-center'>
                            <Fallback color='#6366f1' />
                        </div>
                    )
                        :
                        (
                            <section className='flex flex-col'>
                                <UpdateCollectionModal productId={product.id} closeModal={handleOpenCollectionDialogue} />
                            </section>
                        )
                }
            </Modal>
        </div>
    )
}
