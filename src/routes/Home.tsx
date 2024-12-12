import { useLayoutEffect } from "react"
import { AppDispatch } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { getHomeCollectionAsync } from "@/features/homeCollection/homeCollectionSlice"

//* Components
import { Banner } from "@/components/home/Banner"
import { Banner2 } from "@/components/home/Banner2"
import { PriceCard } from "@/components/common/PriceCard"
import HomeSkeleton from "@/components/home/HomeSkeleton"
import { ProductCard } from "@/components/common/ProductCard"
import { BannerContent } from "@/components/home/BannerContent"
import video from '@/assets/video/Error.webm'

//* Types
import { StoreProps } from "@/utils/types"
import { ProductProps } from "@/features/homeCollection/types"

function Home() {
    const dispatch = useDispatch<AppDispatch>()
    const products = useSelector((state: StoreProps) => state.homeCollection.collection)
    const isLoading = useSelector((state: StoreProps) => state.homeCollection.collectionIsLoading)
    const hasError = useSelector((state: StoreProps) => state.homeCollection.collectionHasError)
    const product = products[0]

    const collection: ProductProps[] = products.slice(1)

    async function getCollection() {
        const { payload } = await dispatch(getHomeCollectionAsync())
        return payload
    }

    useLayoutEffect(() => {
        if (products.length === 0) {
            getCollection()
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
                hasError && (
                    <div className="relative w-screen h-screen flex justify-end items-center pr-20">
                        <div className="w-[15rem] flex z-20">
                            <h1 className="text-[#ffffff] text-[3rem] text-balance uppercase leading-tight">We'll be back shortly...</h1>
                        </div>
                        <video className="absolute top-0 left-0 w-full h-full object-cover" src={video} loop autoPlay muted />
                    </div>
                )
            }
            {
                !isLoading && product !== undefined && (
                    <section className='relative w-full flex flex-col justify-center items-center overflow-y-scroll'>
                        <div className="w-full overflow-scroll scrollbar-hide flex flex-col">
                            <Banner>
                                <div className="w-full max-w-[1440px] h-[950px] flex justify-center items-center bg-[#fdfdfd] overflow-hidden">
                                    <BannerContent>
                                        <PriceCard product={product} />
                                    </BannerContent>
                                    <img src='https://res.cloudinary.com/maulight/image/upload/v1732922082/e-commerce/kx2betzo07jrpgq9i077.webp' alt="banner" className='absolute  w-full h-full object-none object-bottom z-10' />
                                    <img src={product.image} alt="banner" className='absolute  w-full h-full object-none object-bottom z-0' />
                                </div>
                            </Banner>
                            <Banner2 />
                            <div className="grid grid-cols-3">
                                {
                                    collection.length > 0 && collection.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))
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