import { Dispatch, SetStateAction, type ReactNode } from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { handleCopyToClipboard } from '@/utils/functions'

interface IndividualProductFormProps {
    register: UseFormRegister<{
        brand?: string | undefined
        image?: string | undefined
        weight?: number | undefined
        height?: number | undefined
        width?: number | undefined
        length?: number | undefined
        quantity?: number | undefined
        title: string
        description: string
        price: number
        discount: number
    }>
    errors: FieldErrors<{
        image?: string | undefined
        title: string
        brand: string
        description: string
        weight: number | undefined
        height: number | undefined
        width: number | undefined
        length: number | undefined
        price: number | undefined
        discount: number | undefined
        quantity: number | undefined
    }>
    cloudinaryFileUpload: string | null
    priceWithDiscount: number
    compress: number
    setCompress: Dispatch<SetStateAction<number>>
}

function IndividualProductForm({ register, errors, cloudinaryFileUpload, priceWithDiscount, compress, setCompress }: IndividualProductFormProps): ReactNode {



    return (
        <div className='w-2/3 h-full min-h-[436px] flex flex-col gap-y-7 pr-5'>
            <div className="flex gap-x-2">
                <div className="w-full flex flex-col gap-y-2">
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
                <div className="w-full flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">Brand</label>
                        <input
                            {...register('brand')}
                            type="text"
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.brand !== undefined ? 'ring-1 ring-red-500' : ''}`}
                            placeholder='Brand'
                        />
                    </div>
                    {errors.brand && <small className="text-red-500">{errors.brand.message}</small>}
                </div>
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

            <div className="flex gap-x-2">
                <div className="w-full flex flex-col gap-y-2">
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
                <div className="flex flex-col gap-y-2 justify-center items-center">
                    <div className="flex flex-col gap-y-1 justify-center items-center">
                        <label className='text-[0.8rem]' htmlFor="description">Compress</label>
                        <div className="inline-flex items-center">
                            <label className="flex items-center cursor-pointer relative">
                                <input
                                    value={compress}
                                    onChange={() => { setCompress(compress === 1 ? 0 : 1) }}
                                    type="checkbox"
                                    defaultChecked
                                    className="peer h-10 w-10 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-indigo-500 checked:border-indigo-500" id="check1" />
                                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-x-2">
                <div className="w-full flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="weight">Weight</label>
                        <input
                            {...register('weight')}
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.weight !== undefined ? 'ring-1 ring-red-500' : ''}`}
                            placeholder='Price'
                        />
                    </div>
                    {errors.weight && <small className="text-red-500">{errors.weight.message}</small>}
                </div>

                <div className="w-full flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="height">Height</label>
                        <input
                            {...register('height')}
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500  ${errors.height !== undefined ? 'ring-1 ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.height && <small className="text-red-500">{errors.height.message}</small>}
                </div>

                <div className="w-full flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="width">Width</label>
                        <input
                            {...register('width')}
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500  ${errors.width !== undefined ? 'ring-1 ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.width && <small className="text-red-500">{errors.width.message}</small>}
                </div>

                <div className="w-full flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="length">Length</label>
                        <input
                            {...register('length')}
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500  ${errors.length !== undefined ? 'ring-1 ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.length && <small className="text-red-500">{errors.length.message}</small>}
                </div>
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
                        <label className='text-[0.8rem]' htmlFor="description">{'Discount (optional)'}</label>
                        <input
                            {...register('discount')}
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                        />
                    </div>
                    {errors.discount && <small className="text-red-500">{errors.discount.message}</small>}
                </div>

                <div className="w-full flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="quantity">Quantity</label>
                        <input
                            {...register('quantity')}
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.quantity !== undefined ? 'ring-1 ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.quantity && <small className="text-red-500">{errors.quantity.message}</small>}
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