import { type ReactNode } from 'react'

export default function AnnouncementBar(): ReactNode {
    return (
        <div className='w-full h-[35px] flex justify-center items-center gap-x-5 bg-amber-200'>
            <div className="flex gap-x-2">
                <p className='text-[1rem] font-light'>Summer Sale up to</p>
                <p className='text-[1rem] font-semibold'>50% off</p>
            </div>
            <div className='h-5 border border-[#10100e]'></div>
            <div className="flex gap-x-2">
                <p className='text-[1rem] font-light'>Free shipping from 45 US$</p>
            </div>
        </div>
    )
}
