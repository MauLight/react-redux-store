import { useLayoutEffect } from "react"
import { AppDispatch } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

//* Components
import video from '@/assets/video/Error.webm'
import { Banner } from "@/components/home/Banner"
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
    const navigate = useNavigate()
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
                                                products.length > 4 && products.map((product, i) => (
                                                    <motion.button
                                                        onClick={() => { navigate(`/product/${product.id}`) }}
                                                        initial={{ scale: 1 }}
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                                                        key={`id-${i}`} className="relative group w-[180px] h-[180px] glass bg-[#fff] rounded-[6px]">
                                                        <img className="h-full object-cover z-0" src={product.images[0].image} alt={product.title} />
                                                        <div className="absolute top-0 left-0 w-full h-full bg-radial from-20% from-transparent to-[#10100e] opacity-20"></div>
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            whileHover={{ opacity: 0.5 }}
                                                            transition={{ duration: 0.5 }}
                                                            className="absolute hidden group-hover:flex justify-center items-center top-0 left-0 w-full h-full bg-[#10100e] opacity-20 transition-all duration-200">
                                                            <p className="text-[#fff]">{product.title}</p>
                                                        </motion.div>
                                                    </motion.button>
                                                ))
                                            }
                                        </div>
                                    </BannerContent>
                                    <div className="absolute w-full h-full bg-[#10100e] z-0"></div>
                                    {
                                        heroConfig.image !== '' && (
                                            <motion.div
                                                initial={{ scale: 1 }}
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.8, type: 'tween' }}
                                                className="absolute w-full h-full">
                                                <img src={heroConfig.image} alt="banner" className='absolute w-full h-full object-cover z-0' />
                                                <div className="absolute w-full h-full bg-radial from-transparent from-20% to-[#10100e]"></div>
                                            </motion.div>
                                        )
                                    }
                                </div>
                            </Banner>
                            <Carousel />
                            {/* <Banner2 /> */}
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