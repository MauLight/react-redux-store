import { type ReactNode } from 'react'

function HomeSkeleton(): ReactNode {
    return (
        <div className='relative w-full flex flex-col justify-center items-center gap-y-5'>
            <div className="w-full h-full min-h-[900px] bg-gray-300 rounded animate-pulse"></div>
            <div className="w-full h-full min-h-[900px] bg-gray-300 rounded animate-pulse"></div>
            <div className="w-full grid grid-cols-3 gap-x-5">
                <div className="col-span-1 h-[700px] bg-gray-300 rounded animate-pulse"></div>
                <div className="col-span-1 h-[700px] bg-gray-300 rounded animate-pulse"></div>
                <div className="col-span-1 h-[700px] bg-gray-300 rounded animate-pulse"></div>
            </div>
        </div>
    )
}

export default HomeSkeleton
