import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

function LoginFooter({ isBuilder }: { isBuilder: boolean | undefined }): ReactNode {
    return (
        <footer className="w-[300px] h-[60px] bg-[#ffffff] rounded-[10px]">
            <div className="flex h-full items-center justify-center gap-x-1">
                <p className='font-body text-[0.8rem] text-sym_gray-700 font-semibold'>Don't have an account?</p>
                {
                    isBuilder ? (
                        <p className='font-body text-[0.8rem] text-indigo-500 font-semibold'>Sign in</p>
                    )
                        :
                        (
                            <Link to={'/sign'} className='font-body text-[0.8rem] text-indigo-500 font-semibold'>Sign in</Link>
                        )
                }
            </div>
        </footer>
    )
}

export default LoginFooter
