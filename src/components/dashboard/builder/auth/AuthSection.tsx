import Login from '@/routes/Login'
import { useState, type ReactNode } from 'react'
import AuthBuilderPanel from './AuthBuilderPanel'
import Signup from '@/routes/Sign'
import { Switch } from '@/components/common/Switch'

export default function AuthSection(): ReactNode {
    const [authStep, setAuthStep] = useState<number>(0)
    const [clicked, setClicked] = useState<boolean>(false)

    function handleClick() {
        setAuthStep(authStep === 0 ? 1 : 0)
        setClicked(!clicked)
    }

    return (
        <main className='grid grid-cols-7 gap-x-10 w-[1100px] gap-y-1 py-5 px-10 bg-[#ffffff] rounded-[5px]'>
            <div className="col-span-3">
                <AuthBuilderPanel />
            </div>
            <div className="col-span-4 h-full flex flex-col rounded-[5px] overflow-hidden">
                <div className="h-10 flex justify-center gap-x-5">
                    <p>Login</p>
                    <Switch clicked={clicked} handleClick={handleClick} />
                    <p>Sign Up</p>
                </div>
                <div className="w-full h-[700px] flex justify-center items-center rounded-[5px] overflow-hidden">
                    {
                        authStep === 0 ? (
                            <Login isBuilder />
                        )
                            :
                            (
                                <Signup isBuilder />
                            )
                    }
                </div>
            </div>
        </main>
    )
}
