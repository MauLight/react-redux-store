import { type ReactNode } from 'react'

export default function Confirmation(): ReactNode {
    return (
        <div className='w-full flex justify-center animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className='w-web'>
                <div className="h-[70%] flex flex-col justify-center items-center gap-y-1">
                    <h1 className='aktiv uppercase text-7xl text-[#10100e] antialiased'>
                        Thank you!
                    </h1>
                    <p className='text-2xl text-[#10100e] antialiased'> Your payment has been confirmed.</p>
                </div>
            </div>
        </div>
    )
}
