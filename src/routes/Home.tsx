
//* Components
import { Banner } from "@/components/home/Banner"
import { Banner2 } from "@/components/home/Banner2"
import { BannerContent } from "@/components/home/BannerContent"
import { PriceCard } from "@/components/common/PriceCard"


function Home({ state, dispatch }: { state: any, dispatch: any }) {

    const product = state.inventory[0]

    return (
        <div className='relative w-full h-full flex flex-col justify-center items-center overflow-y-scroll'>
            <div className="w-full h-full overflow-scroll scrollbar-hide flex flex-col">
                {/* banner */}
                <Banner>
                    <div className="w-[1440px] h-[900px] flex justify-center items-center bg-[#fdfdfd] overflow-hidden">
                        <BannerContent>
                            <PriceCard product={product} dispatch={dispatch} />
                        </BannerContent>
                        <img src='https://res.cloudinary.com/maulight/image/upload/v1732922082/e-commerce/kx2betzo07jrpgq9i077.webp' alt="banner" className='absolute -bottom-32 w-full object-none object-bottom z-10' />
                        <img src={product.image} alt="banner" className='absolute -bottom-32 w-full object-none object-bottom z-0' />
                    </div>
                </Banner>
                <Banner2 />
                <div className="grid grid-cols-3">
                </div>
                <div className="w-full min-h-20 bg-[#10100e]"></div>
            </div>
        </div>
    )
}

export default Home