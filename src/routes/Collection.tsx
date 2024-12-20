import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { ProductCard } from '@/components/common/ProductCard'
import video from '@/assets/video/Alien.webm'
import { useDispatch, useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'
import { AppDispatch } from '@/store/store'
import { getAllProductsAsync, getProductSortedByPriceAsync } from '@/features/products/productsSlice'

interface CollectionProps {
    title: string
}

export default function Collection({ title = 'Collection' }: CollectionProps): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const products = useSelector((state: StoreProps) => state.inventory.products)
    const sortedCollection = useSelector((state: StoreProps) => state.inventory.sortedProducts)
    const [loading, setLoading] = useState<boolean>(true)
    const [openSortMenu, setOpenSortMenu] = useState<boolean>(false)

    async function getCollection() {
        await dispatch(getAllProductsAsync())
    }

    function handleOpenSortMenu() {
        setOpenSortMenu(!openSortMenu)
    }

    async function handleSortProductsByPrice(order: string) {
        const { payload } = await dispatch(getProductSortedByPriceAsync({ order }))
        console.log(payload)
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



    return (
        <main className='relative w-screen min-h-screen flex flex-col justify-center items-center pb-20'>
            <div className='z-20 min-[1440px]:w-web'>
                <header className='h-[30rem] flex justify-start items-center max-[1440px]:px-10'>
                    <h1 className='text-[#ffffff] text-[2rem] min-[350px]:text-[3rem] md:text-[5rem] animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>{title}</h1>
                </header>
                <nav className='flex items-center gap-x-5 h-[60px]'>
                    <div className='relative h-full'>
                        <button onClick={handleOpenSortMenu} className='h-full w-[200px] border px-2 uppercase text-[#ffffff] transition-all duration-200 bg-transparent hover:bg-indigo-500 active:bg-[#10100e]'>Sort by price</button>
                        {
                            openSortMenu &&
                            <div className="absolute top-[60px] left-0 w-full flex flex-col bg-[#ffffff] z-20">
                                <button onClick={() => { handleSortProductsByPrice('asc') }} className='h-[60px] hover:text-indigo-500 transition-color duration-200'>Low to Hight</button>
                                <button onClick={() => { handleSortProductsByPrice('des') }} className='h-[60px] hover:text-indigo-500 transition-color duration-200'>Hight to Low</button>
                            </div>
                        }
                    </div>
                </nav>
                {
                    !loading ? (
                        <section className="w-full min-web:w-[1440px] h-full grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3 gap-5">
                            {
                                sortedCollection.length > 0 && sortedCollection.map((product) => (
                                    <ProductCard key={`${product.image + product.id}`} product={product} />
                                ))
                            }
                            {
                                sortedCollection.length === 0 && products.map((product) => (
                                    <ProductCard key={`${product.image + product.id}`} product={product} />
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
            <video autoPlay muted loop src={video} className='absolute top-0 left-0 w-screen h-screen object-cover opacity-30'></video>
        </main>
    )
}
