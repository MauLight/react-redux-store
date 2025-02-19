import { useLayoutEffect } from "react"
import { AppDispatch } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"

//* Components
import video from '@/assets/video/Error.webm'
import { Banner } from "@/components/home/Banner"
import { Banner2 } from "@/components/home/Banner2"
import { PriceCard } from "@/components/common/PriceCard"
import HomeSkeleton from "@/components/home/HomeSkeleton"
import { ProductCard } from "@/components/common/ProductCard"
import { BannerContent } from "@/components/home/BannerContent"

//* Types
import { ProductProps, StoreProps } from "@/utils/types"
import { getAllProductsAsync } from "@/features/products/productsSlice"
import { selector, useRecoilValue } from "recoil"
import { currentPageState, productsListState } from "@/utils/recoil"
import { infiniteScrollFetch } from "@/hooks/useFetchProductList"
import Carousel from "@/components/home/Carousel"
import { Link } from "react-router-dom"

const pageSize = 7

const paginatedProductsSelector = selector({
    key: 'paginatedProductsSelector',
    get: async ({ get }) => {
        const products = get(productsListState)
        const currentPage = get(currentPageState)
        return products.slice(0, currentPage * pageSize)
    }
})

function Home() {
    const dispatch = useDispatch<AppDispatch>()
    const { currentTemplate } = useSelector((state: StoreProps) => state.ui)
    const isLoading = useSelector((state: StoreProps) => state.homeCollection.collectionIsLoading)
    const hasError = useSelector((state: StoreProps) => state.homeCollection.collectionHasError)

    const products = useRecoilValue(paginatedProductsSelector)

    infiniteScrollFetch()

    const product = products[0]

    const collection: ProductProps[] = products.slice(1)

    async function getProducts() {
        const { payload } = await dispatch(getAllProductsAsync())
        return payload
    }

    useLayoutEffect(() => {
        if (products.length === 0) {
            getProducts()
        }
    }, [])

    return (
        <>
            {
                isLoading && (
                    <HomeSkeleton />
                )
            }
            {
                (hasError || Object.keys(currentTemplate).length === 0) || !collection.length && (
                    <div className="relative w-screen h-screen flex justify-end items-center pr-32">
                        <Link to={'/admin'} className="relative w-[400px] flex flex-col gap-y-5 z-20 p-10 glass">
                            <h1 className="text-[#fff] text-[1.5rem] text-balance uppercase leading-tight z-10">Your Marketplace is one step away.</h1>
                            <p className="text-slate-300 text-balance z-10">Head into the administrator's area and add products to your store, you can also customize this place to make it your own.</p>
                            <div className="absolute w-full h-full top-0 left-0 bg-[#10100e] opacity-40 z-0"></div>
                        </Link>
                        <video className="absolute top-0 left-0 w-full h-full object-cover" src={video} loop autoPlay muted />
                    </div>
                )
            }
            {
                !isLoading && product !== undefined && Object.keys(currentTemplate).length > 0 && (
                    <section className='relative w-full flex flex-col justify-center items-center pb-20'>
                        <div className="w-full flex flex-col">
                            <Banner>
                                <div className="w-full max-w-[1440px] h-[950px] flex justify-center items-center bg-[#fdfdfd] overflow-hidden">
                                    <BannerContent>
                                        <PriceCard product={product} />
                                    </BannerContent>
                                    <img src='https://res.cloudinary.com/maulight/image/upload/v1732922082/e-commerce/kx2betzo07jrpgq9i077.webp' alt="banner" className='absolute  w-full h-full object-none object-bottom z-10' />
                                    <img src={product.image} alt="banner" className='absolute w-full h-full object-none object-bottom z-0' />
                                </div>
                            </Banner>
                            <Carousel />
                            <Banner2 />
                            <div className={currentTemplate.card.layout || 'grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3'}>
                                {
                                    collection.length > 0 && collection.map(product => (
                                        <div key={product.id}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))
                                }
                                {

                                }
                            </div>
                            <div className="w-full min-h-20 bg-[#10100e]"></div>
                        </div>
                    </section>
                )
            }
        </>
    )
}

export default Home