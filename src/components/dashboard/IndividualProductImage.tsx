import type { ReactNode, RefObject } from 'react'

interface IndividualProductImageProps {
    cloudinaryFileUpload: string | null
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
    handleFileButtonClick: () => void
    fileInputRef: RefObject<HTMLInputElement>
}

export default function IndividualProductImage({
    cloudinaryFileUpload,
    fileInputRef,
    handleFileUpload,
    handleFileButtonClick
}: IndividualProductImageProps): ReactNode {
    return (
        <div className='w-1/3 h-full pt-6 pl-5'>
            {
                cloudinaryFileUpload ? (
                    <div className='h-[405px] rounded-[5px] overflow-hidden'>
                        <img src={cloudinaryFileUpload} alt="product" className='object-cover' />
                    </div>
                )
                    :
                    (
                        <div className='h-[405px] border border-dashed border-sym_gray-300 rounded-[5px] p-2'>
                            <button type='button' className='w-full h-full flex flex-col justify-center items-center gap-y-3 hover:text-indigo-500 active:text-[#10100e] transition-color duration-200' onClick={handleFileButtonClick}>
                                <i className="fa-solid fa-cloud-arrow-up fa-xl"></i>
                                Upload file
                            </button>
                            <input type='file' ref={fileInputRef} onChange={handleFileUpload} className='hidden' />
                        </div>
                    )
            }
        </div>
    )
}
