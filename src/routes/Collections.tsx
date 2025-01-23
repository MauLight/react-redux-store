import { useEffect, useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { getAllCollectionsTitlesAsync, getCollectionByTitleAsync } from '@/features/collections/collectionsSlice'

import CustomDropdownWithCreate from '@/components/common/CustomDropdownWithCreate'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { ProductProps, StoreProps } from '@/utils/types'
import Tableheader from '@/components/common/Tableheader'
import EmptyList from '@/components/common/EmptyList'
import DashboardCard from '@/components/dashboard/DashboardCard'

function Collections(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const collectionTitles = useSelector((state: StoreProps) => state.collections.titles)
    const collectionIsLoading = useSelector((state: StoreProps) => state.collections.isLoading)
    const collectionHasError = useSelector((state: StoreProps) => state.collections.hasErrors)

    const [products, setProducts] = useState<any[]>([])
    const [titles, setTitles] = useState<string[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [navState, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })

    useEffect(() => {
        async function getCollectionTitles() {
            await dispatch(getAllCollectionsTitlesAsync())
        }

        if (collectionTitles.length === 0) {
            getCollectionTitles()
        }
    }, [])

    useEffect(() => {
        if (collectionTitles.length > 0) {
            setTitles(collectionTitles.map(col => col.title))
        }
    }, [collectionTitles])

    useEffect(() => {
        async function getProductsFromCollection() {
            try {
                const { payload } = await dispatch(getCollectionByTitleAsync(inputValue))
                console.log(payload, 'check')
                if (payload.collection && payload.collection.products.length > 0) {
                    setProducts(payload.collection.products)
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (inputValue !== 'Choose a collection') {
            getProductsFromCollection()
        }
    }, [inputValue])

    return (
        <div className='w-full h-screen flex justify-start pl-[265px] items-center'>
            <div className="w-[1400px] min-h-[700px] flex flex-col gap-y-10 rounded-[10px] bg-[#ffffff] p-10">
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
                        <div className="flex flex-col gap-y-5">
                            <h1>2. Browse products in the collection:</h1>
                            <div>
                                <Tableheader />

                                {
                                    products.length > 0 ? products.map((product: ProductProps) => (
                                        <DashboardCard key={product.id} product={product} />
                                    ))
                                        :
                                        (
                                            <EmptyList legend='There are no items to display.'>
                                                <button onClick={() => { }} className='z-10 px-3 h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                                    <i className="fa-solid fa-plus"></i>
                                                    Add product
                                                </button>
                                            </EmptyList>
                                        )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <DashboardSidebar state={navState} setState={setNavState} titles={['Collections']} />
        </div>
    )
}

export default Collections
