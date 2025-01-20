import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

function SignFooter({ isBuilder }: { isBuilder: boolean | undefined }): ReactNode {
    return (
        <footer className="w-[350px] h-[60px] bg-[#ffffff] rounded-[10px]">
            <div className="flex h-full items-center justify-center gap-x-1">
                <p className='font-body text-[0.8rem] text-sym_gray-700 font-semibold'>Already have an account?</p>
                {
                    isBuilder ? (
                        <p className='font-body text-[0.8rem] text-indigo-500 font-semibold'>Login</p>
                    )
                        :
                        (
                            <Link to={'/login'} className='font-body text-[0.8rem] text-indigo-500 font-semibold'>Login</Link>
                        )
                }
            </div>
        </footer>
    )
}

export default SignFooter
