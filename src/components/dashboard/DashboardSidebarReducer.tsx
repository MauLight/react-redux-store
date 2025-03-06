import { type ReactNode } from 'react'

export default function DashboardSidebarReducer({ titles, state, dispatcher }: { titles: string[], state: any, dispatcher: any }): ReactNode {

    const { one, two, three } = state

    return (
        <div className="fixed top-0 left-0 h-screen w-[220px] z-0 bg-[#ffffff] border-r border-sym_gray-100">
            <div className="flex flex-col gap-y-2 mt-20 justify-start items-center">
                <button onClick={() => dispatcher({ type: 'TOGGLE_ONE' })} className={`${titles[0] ? '' : 'hidden'} w-[180px] h-10 text-left font-light text-[0.9rem] px-2 rounded-[5px] ${one ? 'text-indigo-500 bg-gray-100 font-semibold' : 'text-[#10100e]'}`}>{titles[0]}</button>
                <button onClick={() => dispatcher({ type: 'TOGGLE_TWO' })} className={`${titles[1] ? '' : 'hidden'} w-[180px] h-10 text-left font-light text-[0.9rem] px-2 rounded-[5px] ${two ? 'text-indigo-500 bg-gray-100 font-semibold' : 'text-[#10100e]'}`}>{titles[1]}</button>
                <button onClick={() => dispatcher({ type: 'TOGGLE_THREE' })} className={`${titles[2] ? '' : 'hidden'} w-[180px] h-10 text-left font-light text-[0.9rem] px-2 rounded-[5px] ${three ? 'text-indigo-500 bg-gray-100 font-semibold' : 'text-[#10100e]'}`}>{titles[2]}</button>
            </div>
        </div>
    )
}
