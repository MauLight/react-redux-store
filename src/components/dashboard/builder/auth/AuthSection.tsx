import Login from '@/routes/Login'
import { type ReactNode } from 'react'
import AuthBuilderPanel from './AuthBuilderPanel'

export default function AuthSection(): ReactNode {
    return (
        <main className='grid grid-cols-7 gap-x-10 w-[1100px] gap-y-1 py-5 px-10 bg-[#ffffff] rounded-[5px]'>
            <div className="col-span-3">
                <AuthBuilderPanel />
            </div>
            <div className="col-span-4 h-[700px] flex justify-center items-center rounded-[5px] overflow-hidden">
                <Login isBuilder />
            </div>
        </main>
    )
}
