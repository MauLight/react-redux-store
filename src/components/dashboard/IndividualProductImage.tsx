import type { ReactNode, RefObject } from 'react'

interface IndividualProductImageProps {
    cloudinaryFileUpload: string | null
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
    children: ReactNode
    handleFileButtonClick: () => void
    fileInputRef: RefObject<HTMLInputElement>
    handleResetUploadImage: () => void
}

export default function IndividualProductImage({
    cloudinaryFileUpload,
    fileInputRef,
    handleFileUpload,
    children,
    handleFileButtonClick,
    handleResetUploadImage
}: IndividualProductImageProps): ReactNode {

    return (
        <div className='w-1/3 h-full pt-6 pl-5 flex flex-col gap-y-[35.5px]'>
            {
                cloudinaryFileUpload ? (
                    <div className='relative h-[405px] rounded-[5px] overflow-hidden'>
                        <img src={cloudinaryFileUpload} alt="product" className='object-cover' />
                        <button type='button' onClick={handleResetUploadImage} className='absolute top-2 right-2 w-[30px] h-[30px] flex justify-center items-center rounded-full bg-indigo-500 text-[#ffffff] hover:bg-[#10100e] active:bg-indigo-500'>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                )
                    :
                    (
                        <div className='h-[405px] border border-dashed border-sym_gray-300 rounded-[5px] p-2'>
                            <button type='button' className='w-full h-full flex flex-col justify-center items-center gap-y-3 hover:text-indigo-500 active:text-[#10100e] transition-color duration-200' onClick={handleFileButtonClick}>
                                <i className="fa-solid fa-cloud-arrow-up fa-xl"></i>
                                Upload Image
                            </button>
                            <input type='file' ref={fileInputRef} onChange={handleFileUpload} className='hidden' />
                        </div>
                    )
            }
            {
                children
            }
        </div>
    )
}
