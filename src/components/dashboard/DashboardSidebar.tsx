import { ReactNode, useState } from 'react'

export default function DashboardSidebar({ titles }: { titles: string[] }): ReactNode {
    const [{ one, two, three }, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })

    return (
        <div className="fixed top-0 left-0 h-screen w-[200px] z-0 bg-[#ffffff] border-r border-sym_gray-100">
            <div className="flex flex-col gap-y-2 mt-20 justify-start items-center">
                <button onClick={() => { setNavState({ one: true, two: false, three: false }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${one ? 'text-indigo-500' : 'text-[#10100e]'}`}>{titles[0]}</button>
                <button onClick={() => { setNavState({ one: false, two: true, three: false }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${two ? 'text-indigo-500' : 'text-[#10100e]'}`}>{titles[1]}</button>
                <button onClick={() => { setNavState({ one: false, two: false, three: true }) }} className={`w-[150px] h-10 text-left font-light text-[0.9rem] ${three ? 'text-indigo-500' : 'text-[#10100e]'}`}>{titles[2]}</button>
            </div>
        </div>
    )
}
