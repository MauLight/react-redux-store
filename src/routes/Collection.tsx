// @ts-nocheck
import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { ProductCard } from '@/components/common/ProductCard'
import video from '@/assets/video/Alien.webm'
import { useDispatch, useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'
import { AppDispatch } from '@/store/store'
import { clearSortedProducts, getAllProductsAsync, getProductsBySearchWordAsync, getProductSortedByAlphabetAsync, getProductSortedByPriceAsync } from '@/features/products/productsSlice'
import EmptyList from '@/components/common/EmptyList'

interface CollectionProps {
    title: string
}

export default function Collection({ title = 'Collection' }: CollectionProps): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const products = useSelector((state: StoreProps) => state.inventory.products)
    const sortedCollection = useSelector((state: StoreProps) => state.inventory.sortedProducts)
    const searchingIsLoading = useSelector((state: StoreProps) => state.inventory.productsAreLoading)

    const [inputValue, setInputValue] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)
    const [openSortMenu, setOpenSortMenu] = useState<boolean>(false)
    const [focusX, setFocusX] = useState<boolean>(false)
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)

    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [isSorting, setIsSorting] = useState<boolean>(false)

    async function getCollection() {
        await dispatch(getAllProductsAsync())
    }

    function handleOpenSortMenu() {
        setOpenSortMenu(!openSortMenu)
    }

    async function handleSortProductsByPrice(order: string) {
        await dispatch(getProductSortedByPriceAsync({ order }))
        setIsSorting(true)
        setOpenSortMenu(false)
    }

    async function handleSortProductsByAlphabet(order: string) {
        await dispatch(getProductSortedByAlphabetAsync({ order }))
        setIsSorting(true)
        setOpenSortMenu(false)
    }

    async function handleSubmitSearch(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (e.key === 'Enter') {
            if (!isSearching) {
                setIsSearching(true)
            }
            await dispatch(getProductsBySearchWordAsync(inputValue))
        }
    }

    function handleClearInput() {
        dispatch(clearSortedProducts())
        setInputValue('')
        setIsSearching(false)
    }


    useLayoutEffect(() => {
        if (products.length === 0) {
            getCollection()
        }
    }, [])

    useEffect(() => {
        if (products.length > 0) {
            setTimeout(() => {
                setLoading(false)
            }, 150)
        }
    }, [products])


    useEffect(() => {
        if (inputValue === '') {
            setIsSearching(false)
        }
    }, [isSearching, inputValue])

    return (
        <main className='relative w-screen min-h-screen flex flex-col justify-center items-center pb-20'>
            <div className='z-20 min-[1440px]:w-web'>
                <header className='h-[30rem] flex justify-start items-center max-[1440px]:px-10'>
                    <h1 className='text-[2rem] min-[350px]:text-[3rem] md:text-[5rem] animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>{title}</h1>
                </header>
                <section className="w-full min-web:w-[1440px] h-full grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3 gap-5">
                    <div className='col-span-1'></div>
                    <div className='col-span-1'></div>
                    <div className='col-span-1 hidden sm:max-[1440px]:flex'></div>
                    <nav className='col-span-1 flex justify-end items-center h-[60px]'>
                        <div className='group w-full relative h-full'>
                            <i className="absolute top-8 left-3 fa-xl fa-solid fa-magnifying-glass text-sym_gray-300"></i>
                            {
                                inputValue.length > 0 && (
                                    <i onClick={handleClearInput} className={`absolute top-[23px] right-2 fa-regular fa-circle-xmark cursor-pointer ${focusX ? 'text-[#10100e]' : 'text-[#ffffff]'}`}></i>
                                )
                            }
                            <input
                                onFocus={() => { setFocusX(true); setIsInputFocused(true) }}
                                onBlur={() => { setFocusX(false); setIsInputFocused(false) }}
                                onMouseEnter={() => { setFocusX(true) }}
                                onMouseLeave={() => { !isInputFocused && setFocusX(false) }}
                                value={inputValue}
                                onChange={({ target }) => { setInputValue(target.value) }}
                                onKeyDown={handleSubmitSearch}
                                className='h-full w-full min-[1440px]:w-[267px] outline-none border-none pl-[50px] pr-2 bg-transparent text-[#ffffff] group-hover:bg-[#ffffff] group-hover:text-[#10100e] focus:bg-[#ffffff] focus:text-[#10100e]' type="text" />
                        </div>
                        <div className='group relative h-full'>
                            <button onClick={handleOpenSortMenu} className='h-full w-[200px] px-2 uppercase text-[#ffffff] transition-all duration-200 bg-transparent border border-transparent group-hover:bg-indigo-500 group-hover:border-indigo-500'>Sort by price</button>
                            {
                                openSortMenu &&
                                <div className="absolute top-[60px] left-0 w-full flex flex-col bg-[#ffffff] z-20">
                                    <button onClick={() => { setIsSorting(false) }} className='h-[60px] hover:text-indigo-500 transition-color duration-200'>Recommended</button>
                                    <button onClick={() => { handleSortProductsByPrice('asc') }} className='h-[60px] hover:text-indigo-500 transition-color duration-200'>Low to Hight</button>
                                    <button onClick={() => { handleSortProductsByPrice('des') }} className='h-[60px] hover:text-indigo-500 transition-color duration-200'>Hight to Low</button>
                                    <button onClick={() => { handleSortProductsByAlphabet('asc') }} className='h-[60px] hover:text-indigo-500 transition-color duration-200'>Title A to Z</button>
                                    <button onClick={() => { handleSortProductsByAlphabet('des') }} className='h-[60px] hover:text-indigo-500 transition-color duration-200'>Title Z to A</button>
                                </div>
                            }
                        </div>
                    </nav>
                </section>
                {
                    !loading && !searchingIsLoading ? (
                        <section className="w-full min-web:w-[1440px] h-full grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3 gap-5">
                            {
                                isSearching && sortedCollection.length === 0 && (
                                    <section className="border col-span-3">
                                        <EmptyList />
                                    </section>
                                )
                            }
                            {
                                isSearching && sortedCollection.length > 0 && sortedCollection.map((product) => (
                                    <ProductCard key={`${product.image as string + product.id}`} product={product} />
                                ))
                            }
                            {
                                isSorting && sortedCollection.length > 0 && sortedCollection.map((product) => (
                                    <ProductCard key={`${product.image as string + product.id}`} product={product} />
                                ))
                            }
                            {
                                !isSearching && !isSorting && products.map((product) => (
                                    <ProductCard key={`${product.image as string + product.id}`} product={product} />
                                ))
                            }
                        </section>
                    )
                        :
                        (
                            <section className="w-full min-web:w-[1440px] h-full grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3 gap-5">
                                {
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className='sm:h-full sm:min-h-[450px] col-span-1 animate-pulse bg-sym_gray-50 opacity-20'></div>
                                    ))
                                }
                            </section>
                        )
                }
            </div>
            <video autoPlay muted loop src={video} className='absolute top-0 left-0 w-screen h-screen object-cover opacity-80'></video>
            <div className='absolute top-0 left-0 w-screen h-screen bg-[#10100e] opacity-80'></div>
        </main>
    )
}
