import { type ReactNode } from 'react'

interface ErrorComponentProps {
    error?: any
    theme?: string
    width?: string
}

export default function ErrorComponent({ error, theme, width }: ErrorComponentProps): ReactNode {
    return (
        <div className={`relative min-h-[400px] ${width ? width : 'min-w-[400px]'} glass flex flex-col justify-center items-center gap-y-10 ${theme === 'dark' ? 'text-indigo-500' : ''}`}>
            <i className={`fa-solid fa-circle-exclamation ${theme === 'dark' ? '' : 'text-red-500'} fa-2xl fa-beat-fade z-20`}></i>
            <h1 className='z-20'>{error ? error : 'There was an error on our side.'}</h1>
            <div className={`w-full h-full absolute top-0 left-0 ${theme === 'dark' ? 'bg-[#10100e]' : 'bg-[#ffffff] opacity-80'} z-0`}></div>
        </div>
    )
}
