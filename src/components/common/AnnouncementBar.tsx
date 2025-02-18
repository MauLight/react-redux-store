import { type ReactNode } from 'react'

export default function AnnouncementBar({ children }: { children: ReactNode }): ReactNode {
    return (
        <div className='fixed z-50 w-full h-[35px] flex justify-center items-center gap-x-5 bg-amber-200'>
            {
                children
            }
        </div>
    )
}
