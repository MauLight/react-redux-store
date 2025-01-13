import type { Dispatch, ReactNode, SetStateAction } from 'react'

export default function DashboardSidebar({ titles, state, setState }: { titles: string[], state: Record<string, boolean>, setState: Dispatch<SetStateAction<Record<string, boolean>>> }): ReactNode {

    const { one, two, three, four, five } = state

    return (
        <div className="fixed top-0 left-0 h-screen w-[200px] z-0 bg-[#ffffff] border-r border-sym_gray-100">
            <div className="flex flex-col gap-y-2 mt-20 justify-start items-center">
                <button onClick={() => { setState({ one: true, two: false, three: false, four: false, five: false }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${one ? 'text-indigo-500' : 'text-[#10100e]'}`}>{titles[0]}</button>
                <button onClick={() => { setState({ one: false, two: true, three: false, four: false, five: false }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${two ? 'text-indigo-500' : 'text-[#10100e]'}`}>{titles[1]}</button>
                <button onClick={() => { setState({ one: false, two: false, three: true, four: false, five: false }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${three ? 'text-indigo-500' : 'text-[#10100e]'}`}>{titles[2]}</button>
                <button onClick={() => { setState({ one: false, two: false, three: false, four: true, five: false }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${four ? 'text-indigo-500' : 'text-[#10100e]'}`}>{titles[3]}</button>
                <button onClick={() => { setState({ one: false, two: false, three: false, four: true, five: true }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${five ? 'text-indigo-500' : 'text-[#10100e]'}`}>{titles[4]}</button>
            </div>
        </div>
    )
}
