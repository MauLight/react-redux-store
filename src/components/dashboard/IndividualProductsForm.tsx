import { type ReactNode } from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { handleCopyToClipboard } from '@/utils/functions'

interface IndividualProductFormProps {
    register: UseFormRegister<{
        image?: string | undefined;
        title: string;
        description: string;
        price: number;
        discount: number;
    }>
    errors: FieldErrors<{
        image?: string | undefined;
        title: string;
        description: string;
        price: number;
        discount: number;
    }>
    cloudinaryFileUpload: string | null
    priceWithDiscount: number
}

function IndividualProductForm({ register, errors, cloudinaryFileUpload, priceWithDiscount }: IndividualProductFormProps): ReactNode {



    return (
        <div className='w-2/3 h-full min-h-[436px] flex flex-col gap-y-7 pr-5'>
            <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-1">
                    <label className='text-[0.8rem]' htmlFor="description">Title</label>
                    <input
                        {...register('title')}
                        type="text"
                        className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.title !== undefined ? 'ring-1 ring-red-500' : ''}`}
                        placeholder='Title'
                    />
                </div>
                {errors.title && <small className="text-red-500">{errors.title.message}</small>}
            </div>

            <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-1">
                    <label className='text-[0.8rem]' htmlFor="description">Description</label>
                    <input
                        {...register('description')}
                        type="text"
                        className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.description !== undefined ? 'ring-1 ring-red-500' : ''}`}
                        placeholder='Description'
                    />
                </div>
                {errors.description && <small className="text-red-500">{errors.description.message}</small>}
            </div>

            <div className="flex flex-col gap-y-2">
                <div className="relative flex flex-col gap-y-1">
                    <label className='text-[0.8rem]' htmlFor="description">Image</label>
                    <input
                        disabled
                        {...register('image')}
                        type="text"
                        className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none pl-2 pr-10 truncate placeholder-sym_gray-500 ${errors.image !== undefined ? 'ring-1 ring-red-500' : ''}`}
                        placeholder='Image'
                    />
                    {
                        cloudinaryFileUpload && <i onClick={() => { handleCopyToClipboard(cloudinaryFileUpload, 'URL copied to clipboard.') }} className="absolute top-8 right-2 hover:text-indigo-500 active:text-[#10100e] cursor-pointer transition-color duration-200 fa-solid fa-clipboard"></i>
                    }
                </div>
                {errors.image && <small className="text-red-500">{errors.image.message}</small>}
            </div>
            <div className="flex gap-x-2">
                <div className="w-full flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">Price</label>
                        <input
                            {...register('price')}
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.price !== undefined ? 'ring-1 ring-red-500' : ''}`}
                            placeholder='Price'
                        />
                    </div>
                    {errors.price && <small className="text-red-500">{errors.price.message}</small>}
                </div>

                <div className="w-full flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">{'Discount (leave empty if no discount)'}</label>
                        <input
                            {...register('discount')}
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                        />
                    </div>
                    {errors.discount && <small className="text-red-500">{errors.discount.message}</small>}
                </div>
            </div>

            <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-1">
                    <label className='text-[0.8rem]' htmlFor="description">Price with discount</label>
                    <input
                        disabled
                        value={priceWithDiscount}
                        type="number"
                        className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-indigo-500 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                    />
                </div>
            </div>

        </div>
    )
}

export default IndividualProductForm