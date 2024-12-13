import { type ReactNode } from 'react'
import { RotatingLines } from 'react-loader-spinner'

export default function Fallback(): ReactNode {
    return (
        <div className="h-full flex justify-center items-center">
            <RotatingLines
                width="40"
                strokeColor='#10100e'
            />
        </div>
    )
}
