import { useLayoutEffect } from "react"
import { AppDispatch } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"

//* Components
import video from '@/assets/video/Error.webm'
import { Banner } from "@/components/home/Banner"
import { Banner2 } from "@/components/home/Banner2"
import HomeSkeleton from "@/components/home/HomeSkeleton"
import { ProductCard } from "@/components/common/ProductCard"
import { BannerContent } from "@/components/home/BannerContent"

//* Types
import { StoreProps } from "@/utils/types"
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
    const { currentTemplate, currConfig } = useSelector((state: StoreProps) => state.ui)
    const isLoading = useSelector((state: StoreProps) => state.homeCollection.collectionIsLoading)
    const hasError = useSelector((state: StoreProps) => state.homeCollection.collectionHasError)

    const heroConfig = currConfig.home.hero
    const products = useRecoilValue(paginatedProductsSelector)

    infiniteScrollFetch()

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
                (hasError || Object.keys(currentTemplate).length === 0) || !products.length && (
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
                !isLoading && Object.keys(currentTemplate).length > 0 && (
                    <section className='relative w-full flex flex-col justify-center items-center pb-20'>
                        <div className="w-full flex flex-col">
                            <Banner>
                                <div className="w-full max-w-[1440px] h-[950px] flex justify-center items-center bg-[#fdfdfd] overflow-hidden">
                                    <BannerContent heroConfig={heroConfig}>
                                        <div className="flex gap-x-5">
                                            {
                                                Array.from({ length: 5 }).map((_, i) => (
                                                    <div key={`id-${i}`} className="w-[140px] h-[140px] glass bg-[#fff] rounded-[6px]"></div>
                                                ))
                                            }
                                        </div>
                                    </BannerContent>
                                    <div className="absolute w-full h-full bg-[#10100e] z-0"></div>
                                    {
                                        heroConfig.image !== '' && (
                                            <div className="absolute w-full h-full">
                                                <img src={heroConfig.image} alt="banner" className='absolute w-full h-full object-cover z-0' />
                                                <div className="absolute w-full h-full bg-radial from-transparent from-20% to-[#10100e]"></div>
                                            </div>
                                        )
                                    }
                                </div>
                            </Banner>
                            <Carousel />
                            <Banner2 />
                            <div className={currentTemplate.card.layout || 'grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3'}>
                                {
                                    products.length > 0 && products.map(product => (
                                        <div key={product.id}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))
                                }
                                {

                                }
                            </div>

                        </div>
                    </section>
                )
            }
        </>
    )
}

export default Home