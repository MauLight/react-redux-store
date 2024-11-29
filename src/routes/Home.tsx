
//* Components
import { TopBar } from "../components/home/TopBar"
import { Banner } from "@/components/home/Banner"
import { Banner2 } from "@/components/home/Banner2"


function Home({ state, dispatch }: { state: any, dispatch: any }) {

    const product = state.inventory[0]

    return (
        <div className='relative w-full h-full flex flex-col justify-center items-center overflow-y-scroll'>
            {/* topbar */}
            <TopBar />
            <div className="w-full h-full overflow-scroll scrollbar-hide flex flex-col">
                {/* banner */}
                <Banner product={product} />
                <Banner2 />
                <div className="grid grid-cols-3">
                </div>
                <div className="w-full min-h-20 bg-[#10100e]"></div>
            </div>
        </div>
    )
}

export default Home