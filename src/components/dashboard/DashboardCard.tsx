import { deleteProductByIdAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps, StoreProps } from '@/utils/types'
import { useEffect, useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from '../common/Modal'
import UpdateProductForm from './UpdateProductForm'
import Fallback from '../common/Fallback'
import UpdateCollectionModal from './collections/UpdateCollectionModal'
import { resetErrorState } from '@/features/collections/collectionsSlice'
import SimpleProductCard from '../common/SimpleProductCard'

interface DashboardCardProps {
    product: ProductProps
    isCollection?: boolean
    addProducts?: (productId: string) => Promise<void>
    removeProducts?: (productId: string) => Promise<void>
}

function HoverMessage({ message, width }: { message: string, width: string }) {
    return (
        <div
            className={`absolute top-5 right-6 ${width} py-1 px-2 text-[0.8rem] bg-[#fff] rounded-[3px] border border-gray-300 shadow-xl group-hover:flex hidden`}
        >
            {message}
        </div>
    )
}

export default function DashboardCard({ product, isCollection, addProducts, removeProducts }: DashboardCardProps): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const productsAreLoading = useSelector((state: StoreProps) => state.inventory.productsAreLoading)
    const collectionHasError = useSelector((state: StoreProps) => state.collections.hasErrors)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [updateIsOpen, setUpdateIsOpen] = useState<boolean>(false)
    const [collectionIsOpen, setCollectionIsOpen] = useState<boolean>(false)

    const [wasAdded, setWasAdded] = useState<boolean>(false)

    const collectionProducts = useSelector((state: StoreProps) => state.collections.collection.products)

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

    useEffect(() => {
        if (collectionProducts) {
            const wasAdded = collectionProducts.find((elem) => elem.id === product.id)
            if (wasAdded) {
                setWasAdded(true)
            }
        }
    }, [collectionProducts])

    return (
        <div className='h-20 w-full grid grid-cols-10 gap-x-5 px-10 border-b border-gray-300 bg-[#ffffff] content-center overflow-x-scroll'>
            <p className='text-balance truncate text-gray-700'>{product.id}</p>
            <p className='col-span-2  text-balance truncate uppercase text-gray-700'>{product.title}</p>
            <p className='text-balance truncate'>{product.brand || '...'}</p>
            <p className='col-span-2 text-balance font-light truncate line-clamp-2'>{product.description}</p>
            <p className='text-balance truncate'>{product.price}</p>
            <p className='text-balance truncate'>{product.discount}</p>
            <a target='_blank' aria-label='image' href={product.images[0].image} className='text-balance font-light truncate'>{product.images[0].image}</a>
            {
                isCollection && addProducts && removeProducts ? (
                    <div className="flex gap-x-2 justify-center items-center">
                        <button disabled={wasAdded} onClick={() => { addProducts(product.id as string) }} className={`h-[30px] w-[30px] transition-color duration-200 rounded-[10px] ${wasAdded ? 'bg-gray-200 text-[#ffffff] cursor-not-allowed' : 'bg-[#10100e] text-[#ffffff] hover:bg-indigo-500'}`}>
                            <i className="fa-solid fa-circle-plus"></i>
                        </button>
                        <button onClick={() => { removeProducts(product.id as string) }} className='h-[30px] w-[30px] bg-[#10100e] text-[#ffffff] hover:bg-red-500 transition-color duration-200 rounded-[10px]'>
                            <i className="fa-solid fa-circle-minus"></i>
                        </button>
                    </div>
                )
                    :
                    (
                        <div className="flex gap-x-2 justify-center items-center">

                            <div className='relative group'>
                                <button onClick={handleOpenCollectionDialogue} className='h-[30px] w-[30px] bg-[#10100e] text-[#ffffff] hover:bg-indigo-500 transition-color duration-200 rounded-[10px]'>
                                    <i className="fa-solid fa-layer-group"></i>
                                </button>
                                <HoverMessage width='w-[120px]' message='Add to collection' />
                            </div>

                            <div className="relative group">
                                <button onClick={handleOpenUpdateProduct} className='h-[30px] w-[30px] bg-[#10100e] text-[#ffffff] hover:bg-indigo-500 transition-color duration-200 rounded-[10px]'>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <HoverMessage width='w-[95px]' message='Edit product' />
                            </div>
                            <div className="relative group">
                                <button onClick={handleOpenDeleteProduct} className='h-[30px] w-[30px] bg-[#10100e] text-[#ffffff] hover:bg-red-500 transition-color duration-200 rounded-[10px]'>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                                <HoverMessage width='w-[120px]' message='Delete product' />
                            </div>

                        </div>
                    )
            }
            <Modal width='w-[900px]' openModal={modalIsOpen} handleOpenModal={handleOpenDeleteProduct}>
                {
                    productsAreLoading ? (
                        <div className='min-h-[436px] flex justify-center items-center'>
                            <Fallback color='#6366f1' />
                        </div>
                    )
                        :
                        (
                            <section className='flex flex-col gap-y-5'>
                                <h1 className='text-[1.5rem] text-balance uppercase'>Are you sure you want to delete this product?</h1>
                                <SimpleProductCard product={product} />
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
                                <UpdateCollectionModal productId={product.id as string} closeModal={handleOpenCollectionDialogue} />
                            </section>
                        )
                }
            </Modal>
        </div>
    )
}
