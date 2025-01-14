import type { Dispatch, ReactNode, SetStateAction } from 'react'

export default function DashboardSidebar({ titles, state, setState }: { titles: string[], state: Record<string, boolean>, setState: Dispatch<SetStateAction<Record<string, boolean>>> }): ReactNode {

    const { one, two, three, four, five } = state

    return (
        <div className="fixed top-0 left-0 h-screen w-[220px] z-0 bg-[#ffffff] border-r border-sym_gray-100">
            <div className="flex flex-col gap-y-2 mt-20 justify-start items-center">
                <button onClick={() => { setState({ one: true, two: false, three: false, four: false, five: false }) }} className={`${titles[0] ? '' : 'hidden'} w-[180px] h-10 text-left font-light text-[0.9rem] px-2 rounded-[5px] ${one ? 'text-indigo-500 bg-gray-100 font-semibold' : 'text-[#10100e]'}`}>{titles[0]}</button>
                <button onClick={() => { setState({ one: false, two: true, three: false, four: false, five: false }) }} className={`${titles[1] ? '' : 'hidden'} w-[180px] h-10 text-left font-light text-[0.9rem] px-2 rounded-[5px] ${two ? 'text-indigo-500 bg-gray-100 font-semibold' : 'text-[#10100e]'}`}>{titles[1]}</button>
                <button onClick={() => { setState({ one: false, two: false, three: true, four: false, five: false }) }} className={`${titles[2] ? '' : 'hidden'} w-[180px] h-10 text-left font-light text-[0.9rem] px-2 rounded-[5px] ${three ? 'text-indigo-500 bg-gray-100 font-semibold' : 'text-[#10100e]'}`}>{titles[2]}</button>
                <button onClick={() => { setState({ one: false, two: false, three: false, four: true, five: false }) }} className={`${titles[3] ? '' : 'hidden'} w-[180px] h-10 text-left font-light text-[0.9rem] px-2 rounded-[5px] ${four ? 'text-indigo-500 bg-gray-100 font-semibold' : 'text-[#10100e]'}`}>{titles[3]}</button>
                <button onClick={() => { setState({ one: false, two: false, three: false, four: false, five: true }) }} className={`${titles[4] ? '' : 'hidden'} w-[180px] h-10 text-left font-light text-[0.9rem] px-2 rounded-[5px] ${five ? 'text-indigo-500 bg-gray-100 font-semibold' : 'text-[#10100e]'}`}>{titles[4]}</button>
            </div>
        </div>
    )
}
