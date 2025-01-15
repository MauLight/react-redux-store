import { type ReactNode } from 'react'

interface ErrorComponentProps {
    error?: any
}

export default function ErrorComponent({ error }: ErrorComponentProps): ReactNode {
    return (
        <div className='relative min-h-[400px] glass flex flex-col justify-center items-center gap-y-10'>
            <i className="fa-solid fa-circle-exclamation fa-2xl fa-beat-fade z-20"></i>
            <h1 className='z-20'>{error ? error : 'There was an error on our side.'}</h1>
            <div className='w-full h-full absolute top-0 left-0 bg-[#ffffff] z-0 opacity-80'></div>
        </div>
    )
}
