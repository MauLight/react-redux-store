import { useEffect, useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { getAllCollectionsTitlesAsync, getCollectionByTitleAsync, publishCollectionByIdAsync, resetErrorState, updateCollectionByIdAsync, updateCollectionDeleteProductByIdAsync } from '@/features/collections/collectionsSlice'

import CustomDropdownWithCreate from '@/components/common/CustomDropdownWithCreate'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { ProductProps, StoreProps } from '@/utils/types'
import Tableheader from '@/components/common/Tableheader'
import EmptyList from '@/components/common/EmptyList'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { Modal } from '@/components/common/Modal'
import AddProductsToCollection from '@/components/dashboard/collections/AddProductsToCollection'
import ErrorComponent from '@/components/common/ErrorComponent'
import AddNewCollection from '@/components/dashboard/collections/AddNewCollection'
import { motion } from 'framer-motion'
import { Switch } from '@/components/common/Switch'

function Collections(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const collectionTitles = useSelector((state: StoreProps) => state.collections.titles)
    const currCollection = useSelector((state: StoreProps) => state.collections.collection)
    const collectionHasError = useSelector((state: StoreProps) => state.collections.hasErrors)

    const [clicked, setClicked] = useState<boolean>(false)
    const [products, setProducts] = useState<any[]>([])
    const [titles, setTitles] = useState<string[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [openModalCreateCollection, setOpenModalCreateCollection] = useState<boolean>(false)
    const [navState, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })

    async function handleClick() {
        await dispatch(publishCollectionByIdAsync(currCollection.id))
        setClicked(!clicked)
    }

    function handleSetInputValue(value: string) {
        setInputValue(value)
        setProducts([])
    }

    function handleOpenModal() {
        setOpenModal(!openModal)
    }

    function handleOpenModalCreateCollection() {
        setOpenModalCreateCollection(!openModalCreateCollection)
        dispatch(resetErrorState())
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
        await dispatch(updateCollectionByIdAsync({ id: currCollection.id, productId }))
        getProductsFromCollection()
    }

    async function handleRemoveProductsFromCollection(productId: string) {
        await dispatch(updateCollectionDeleteProductByIdAsync({ id: currCollection.id, productId }))
        getProductsFromCollection()
    }

    useEffect(() => {
        if (collectionTitles.length > 0) {
            console.log(inputValue)
            const currCollectionIsLive = collectionTitles.find(col => col.title === inputValue)?.isLive
            setClicked(currCollectionIsLive as boolean)
        }
    }, [inputValue])

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
        if (inputValue !== '' && products.length === 0) {
            getProductsFromCollection()
        }
    }, [inputValue])

    return (
        <div className='w-full h-screen flex justify-start pl-[265px] items-center'>
            <div className="w-[1400px] min-h-[715px] flex flex-col gap-y-10 rounded-[10px] bg-[#ffffff] p-10">
                {
                    collectionHasError && (
                        <ErrorComponent />
                    )
                }
                {
                    !collectionHasError && (
                        <>
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-y-5">
                                    <h1>1. Choose a collection:</h1>
                                    <div className="flex gap-x-20 items-center">

                                        {
                                            titles.length > 0 && (
                                                <div className='flex flex-col gap-y-1 w-[250px]'>
                                                    <label className='text-[0.8rem]' htmlFor="collections">Collections</label>
                                                    <CustomDropdownWithCreate
                                                        create
                                                        label='Add New Collection'
                                                        buttonFunction={handleOpenModalCreateCollection}
                                                        list={titles}
                                                        value={inputValue}
                                                        setValue={handleSetInputValue}
                                                        defaultValue={inputValue}
                                                    />
                                                </div>
                                            )
                                        }
                                        {
                                            inputValue !== '' && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex gap-x-5 items-center pt-5">
                                                    <p className='text-[1rem] text-gray-700'>Publish this Collection</p>
                                                    <Switch clicked={clicked} handleClick={handleClick} />
                                                </motion.div>
                                            )
                                        }
                                    </div>
                                </div>
                                {
                                    inputValue !== '' && (
                                        <div className="flex flex-col gap-y-5 justify-end">

                                            <motion.button
                                                transition={{ duration: 0.05 }}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleOpenModal}
                                                className='z-10 px-3 h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                                <i className="fa-solid fa-plus"></i>
                                                Add products
                                            </motion.button>
                                        </div>
                                    )
                                }
                            </div>
                            {
                                inputValue !== '' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col gap-y-5">
                                        <h1>2. Browse products in the collection:</h1>
                                        <div>
                                            <Tableheader />

                                            {
                                                products.length > 0 ? products.map((product: ProductProps) => (
                                                    <DashboardCard
                                                        isCollection
                                                        key={product.id}
                                                        product={product}
                                                        addProducts={handleAddProductsToCollection}
                                                        removeProducts={handleRemoveProductsFromCollection}
                                                    />
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
                                    </motion.div>
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
            <Modal openModal={openModalCreateCollection} handleOpenModal={handleOpenModalCreateCollection}>
                <AddNewCollection hasError={collectionHasError} closeModal={handleOpenModalCreateCollection} />
            </Modal>
        </div>
    )
}

export default Collections
