import { type ReactNode } from 'react'
import { RotatingLines } from 'react-loader-spinner'

export default function Fallback({ color = '#10100e' }: { color?: string }): ReactNode {
    return (
        <div className="h-full flex justify-center items-center">
            <RotatingLines
                width="40"
                strokeColor={color}
            />
        </div>
    )
}
