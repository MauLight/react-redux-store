import { type ReactNode } from 'react'
import { RotatingLines } from 'react-loader-spinner'

export default function Fallback({ color = '#10100e', size }: { color?: string, size?: string }): ReactNode {
    return (
        <div className={`h-full flex justify-center items-center`}>
            <RotatingLines
                width={size ? size : "40"}
                strokeColor={color}
            />
        </div>
    )
}
