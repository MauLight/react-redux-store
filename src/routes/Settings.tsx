import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useState, type ReactNode } from 'react'

const templates = [
    {
        id: 'a1',
        title: 'Classic'
    },
    {
        id: 'b2',
        title: 'Modern'
    },
    {
        id: 'c3',
        title: 'Technical'
    },
]

export default function Settings(): ReactNode {
    const [navState, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })
    return (
        <div className='w-full h-screen flex justify-start pl-[425px] items-center'>
            <div className="w-[1100px] min-h-[700px] flex flex-col gap-y-10 rounded-[10px] bg-[#ffffff] p-10">
                <div className="w-full h-full flex flex-col gap-y-10">
                    <h1 className='text-[1rem] sm:text-[1.2rem] text-balance leading-tight'>
                        Choose a UI Template:
                    </h1>
                    <div className="grid grid-cols-3 gap-5">
                        {
                            templates.map((temp) => (
                                <button onClick={() => { console.log(temp.id) }} className='flex flex-col justify-center items-center gap-y-1' key={temp.id}>
                                    <div className='w-full h-[280px] border hover:border-indigo-500'></div>
                                    <p>{temp.title}</p>
                                </button>
                            ))
                        }
                    </div>
                </div>
            </div>
            <DashboardSidebar state={navState} setState={setNavState} titles={['UI Settings', 'Global Settings', 'Personal Settings']} />
        </div>
    )
}
