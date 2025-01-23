import { type ReactNode } from 'react'

export default function EmptyList({ legend, children }: { legend?: string, children?: ReactNode }): ReactNode {
    return (
        <div className='relative min-h-[400px] glass flex flex-col justify-center items-center gap-y-10 px-5'>
            <i className="fa-solid fa-magnifying-glass fa-2xl fa-beat-fade z-20"></i>
            <h1 className='z-20'>{legend ? legend : 'We couldn\'t find what you\'re looking for.'}</h1>
            {
                children
            }
            <div className='w-full h-full absolute top-0 left-0 bg-[#ffffff] z-0 opacity-80'></div>
        </div>
    )
}
