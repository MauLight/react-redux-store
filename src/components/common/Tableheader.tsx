import { type ReactNode } from 'react'

function Tableheader(): ReactNode {
    return (
        <div className='h-12 w-full grid grid-cols-11 gap-x-5 px-10 border-b bg-sym_gray-400 text-[#ffffff] content-center overflow-x-scroll'>
            <p className='text-balance truncate uppercase'>Id</p>
            <p className='col-span-2 text-balance truncate uppercase'>Title</p>
            <p className='text-balance truncate uppercase'>Brand</p>
            <p className='col-span-2 text-balance truncate uppercase'>Description</p>
            <p className='text-balance truncate uppercase'>Price</p>
            <p className='text-balance truncate uppercase'>Discount</p>
            <p className='text-balance truncate uppercase'>Image</p>
            <p className='text-balance truncate uppercase'>Rating</p>
            <p className='text-balance truncate uppercase'>Actions</p>
        </div>
    )
}

export default Tableheader