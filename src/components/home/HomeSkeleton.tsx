import { type ReactNode } from 'react'

function HomeSkeleton(): ReactNode {
    return (
        <div className="flex flex-wrap gap-4">
            <div className="w-48 h-72 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-48 h-72 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-48 h-72 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-48 h-72 bg-gray-300 rounded animate-pulse"></div>
        </div>
    )
}

export default HomeSkeleton
