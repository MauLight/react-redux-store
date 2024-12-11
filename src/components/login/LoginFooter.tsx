import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

function LoginFooter(): ReactNode {
    return (
        <footer className="w-[300px] h-[60px] bg-[#ffffff] rounded-[10px]">
            <div className="flex h-full items-center justify-center gap-x-1">
                <p className='font-body text-[0.8rem] text-sym_gray-700 font-semibold'>Don't have an account?</p>
                <Link to={'/sign'} className='font-body text-[0.8rem] text-indigo-500 font-semibold'>Sign in</Link>
            </div>
        </footer>
    )
}

export default LoginFooter
