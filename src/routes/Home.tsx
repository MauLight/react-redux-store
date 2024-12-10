import { useDispatch, useSelector } from "react-redux"

//* Components
import { Banner } from "@/components/home/Banner"
import { Banner2 } from "@/components/home/Banner2"
import { BannerContent } from "@/components/home/BannerContent"
import { PriceCard } from "@/components/common/PriceCard"
import { ProductCard } from "@/components/common/ProductCard"

//* Types
import { ProductProps } from "@/features/homeCollection/types"
import { wishListProduct } from "@/features/wishList/types"
import { useLayoutEffect } from "react"
import { getHomeCollectionAsync } from "@/features/homeCollection/homeCollectionSlice"
import HomeSkeleton from "@/components/home/HomeSkeleton"
import { AppDispatch } from "@/store/store"

interface StoreProps {
    cart: Array<ProductProps>
    homeCollection: {
        collection: Array<ProductProps>
    }
    wishList: Array<wishListProduct>
}


function Home() {
    const dispatch = useDispatch<AppDispatch>()
    const products = useSelector((state: StoreProps) => state.homeCollection.collection)
    const product = products[0]

    const collection: ProductProps[] = products.slice(1)

    useLayoutEffect(() => {
        if (products.length === 0) {
            dispatch(getHomeCollectionAsync())
        }
    }, [])

    return (
        <>
            {
                products.length > 0 ? (
                    <section className='relative w-full flex flex-col justify-center items-center overflow-y-scroll'>
                        <div className="w-full overflow-scroll scrollbar-hide flex flex-col">
                            <Banner>
                                <div className="w-[1440px] h-[900px] flex justify-center items-center bg-[#fdfdfd] overflow-hidden">
                                    <BannerContent>
                                        <PriceCard product={product} />
                                    </BannerContent>
                                    <img src='https://res.cloudinary.com/maulight/image/upload/v1732922082/e-commerce/kx2betzo07jrpgq9i077.webp' alt="banner" className='absolute -bottom-32 w-full object-none object-bottom z-10' />
                                    <img src={product.image} alt="banner" className='absolute -bottom-32 w-full object-none object-bottom z-0' />
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
                    :
                    (
                        <HomeSkeleton />
                    )
            }
        </>
    )
}

export default Home