import { animatedGradient, animatedGradientText } from '@/utils/styles'

export default function SymetriaLogo(): JSX.Element {

    return (
        <div className='flex justify-end items-center z-20'>
            <div className={`w-[200px] h-[200px] flex justify-center items-center rounded-full ${animatedGradient}`}>
                <h1 className={`text-[6rem] text-balance tracking-normal leading-tight text-[#10100e] font-bold`}>{'<|>'}</h1>
            </div>
        </div>
    )
}
