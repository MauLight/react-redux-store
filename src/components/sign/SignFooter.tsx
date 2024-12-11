import { type ReactNode } from 'react'

function SignFooter(): ReactNode {
    return (
        <footer className="w-[350px] h-[60px] bg-[#ffffff] rounded-[10px]">
            <div className="flex h-full items-center justify-center gap-x-1">
                <p className='font-body text-[0.8rem] text-sym_gray-700 font-semibold uppercase'>Already have an account?</p>
                <p className='font-body text-[0.8rem] text-indigo-500 font-semibold uppercase'>Login</p>
            </div>
        </footer>
    )
}

export default SignFooter
