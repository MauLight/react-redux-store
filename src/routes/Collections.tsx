import { useEffect, useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { getAllCollectionsTitlesAsync, getCollectionByTitleAsync, updateCollectionByIdAsync, updateCollectionDeleteProductByIdAsync } from '@/features/collections/collectionsSlice'

import CustomDropdownWithCreate from '@/components/common/CustomDropdownWithCreate'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { ProductProps, StoreProps } from '@/utils/types'
import Tableheader from '@/components/common/Tableheader'
import EmptyList from '@/components/common/EmptyList'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { Modal } from '@/components/common/Modal'
import AddProductsToCollection from '@/components/dashboard/collections/AddProductsToCollection'
import Fallback from '@/components/common/Fallback'
import ErrorComponent from '@/components/common/ErrorComponent'

function Collections(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const collectionTitles = useSelector((state: StoreProps) => state.collections.titles)
    const currCollection = useSelector((state: StoreProps) => state.collections.collection)
    const collectionIsLoading = useSelector((state: StoreProps) => state.collections.isLoading)
    const collectionHasError = useSelector((state: StoreProps) => state.collections.hasErrors)

    const [products, setProducts] = useState<any[]>([])
    const [titles, setTitles] = useState<string[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [navState, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })

    function handleOpenModal() {
        setOpenModal(!openModal)
    }

    async function getProductsFromCollection() {
        try {
            const { payload } = await dispatch(getCollectionByTitleAsync(inputValue))
            if (payload.collection && payload.collection.products.length > 0) {
                setProducts(payload.collection.products)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleAddProductsToCollection(productId: string) {
        console.log('triggered!', productId)
        const { payload } = await dispatch(updateCollectionByIdAsync({ id: currCollection.id, productId }))
        getProductsFromCollection()
        console.log(payload)
    }

    async function handleRemoveProductsFromCollection(productId: string) {
        console.log('triggered!', productId)
        const { payload } = await dispatch(updateCollectionDeleteProductByIdAsync({ id: currCollection.id, productId }))
        getProductsFromCollection()
        console.log(payload)
    }

    useEffect(() => {
        async function getCollectionTitles() {
            await dispatch(getAllCollectionsTitlesAsync())
            setIsLoading(false)
        }

        if (collectionTitles.length === 0 && isLoading) {
            getCollectionTitles()
        }
    }, [])

    useEffect(() => {
        if (collectionTitles.length > 0) {
            setTitles(collectionTitles.map(col => col.title))
        }
    }, [collectionTitles])

    useEffect(() => {
        if (inputValue !== 'Choose a collection' && products.length === 0 && !isLoading) {
            getProductsFromCollection()
        }
    }, [inputValue])

    return (
        <div className='w-full h-screen flex justify-start pl-[265px] items-center'>
            <div className="w-[1400px] min-h-[700px] flex flex-col gap-y-10 rounded-[10px] bg-[#ffffff] p-10">
                {
                    collectionHasError && (
                        <ErrorComponent />
                    )
                }
                {
                    !collectionHasError && collectionIsLoading && (
                        <div className="w-full h-full min-h-[700px] flex justify-center items-center">
                            <Fallback />
                        </div>
                    )
                }
                {
                    !collectionHasError && !collectionIsLoading && (
                        <>
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-y-5">
                                    <h1>1. Choose a collection:</h1>
                                    {
                                        titles.length > 0 && (
                                            <div className='flex flex-col gap-y-1 w-[250px]'>
                                                <label className='text-[0.8rem]' htmlFor="collections">Collections</label>
                                                <CustomDropdownWithCreate
                                                    list={titles}
                                                    value={inputValue}
                                                    setValue={setInputValue}
                                                    defaultValue='Choose a collection'
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    inputValue !== 'Choose a collection' && (
                                        <div className="flex flex-col gap-y-5 justify-end">

                                            <button onClick={handleOpenModal} className='z-10 px-3 h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                                <i className="fa-solid fa-plus"></i>
                                                Add products
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                            {
                                inputValue !== 'Choose a collection' && (
                                    <div className="flex flex-col gap-y-5">
                                        <h1>2. Browse products in the collection:</h1>
                                        <div>
                                            <Tableheader />

                                            {
                                                products.length > 0 ? products.map((product: ProductProps) => (
                                                    <DashboardCard isCollection addProducts={handleAddProductsToCollection} removeProducts={handleRemoveProductsFromCollection} key={product.id} product={product} />
                                                ))
                                                    :
                                                    (
                                                        <EmptyList legend='There are no items to display.'>
                                                            <button onClick={handleOpenModal} className='z-10 px-3 h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                                                <i className="fa-solid fa-plus"></i>
                                                                Add products
                                                            </button>
                                                        </EmptyList>
                                                    )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div>
            <DashboardSidebar state={navState} setState={setNavState} titles={['Collections']} />
            <Modal width='w-[1200px]' openModal={openModal} handleOpenModal={handleOpenModal}>
                <AddProductsToCollection
                    addProducts={handleAddProductsToCollection}
                    removeProducts={handleRemoveProductsFromCollection}
                />
            </Modal>
        </div>
    )
}

export default Collections
