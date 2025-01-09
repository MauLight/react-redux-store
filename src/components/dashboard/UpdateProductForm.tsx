import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { getAllProductsAsync, updateProductByIdAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import IndividualProductImage from './IndividualProductImage'
import { OnSubmitFormValues, ProductProps } from '@/utils/types'
import { getPercentage, handleCopyToClipboard } from '@/utils/functions'

export const productSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    brand: yup.string(),
    description: yup.string().required('Description is required'),
    image: yup.string().url('Image must be a valid URL'),
    price: yup.number().required(),
    discount: yup.number().required()
})

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME

interface IndividualProductFormProps {
    product: ProductProps
    handleOpenUpdateProduct: () => void
}

function UpdateProductForm({ product, handleOpenUpdateProduct }: IndividualProductFormProps): ReactNode {
    const dispatch: AppDispatch = useDispatch()

    //* UseForm State
    const [priceWithDiscount, setPriceWithDiscount] = useState<number>(0)
    const { watch, register, getValues, setValue, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: product.title,
            brand: product.brand || '',
            description: product.description || '',
            image: product.image || '',
            price: product.price || 0,
            discount: product.discount || 0
        },
        resolver: yupResolver(productSchema)
    })
    const watchedValues = watch(['price', 'discount'])

    const onSubmit = (data: OnSubmitFormValues) => {
        handleUpdateProduct(data)
    }

    async function handleUpdateProduct(data: OnSubmitFormValues) {
        const { payload } = await dispatch(updateProductByIdAsync({ id: product.id as string, values: data }))
        if (payload.updatedProduct) {
            await dispatch(getAllProductsAsync())
            handleOpenUpdateProduct()
            reset()
        }
    }

    //* Cloudinary state
    const [cloudinaryFileUpload, setCloudinaryFileUpload] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleFileButtonClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const postToCloudinary = async (formData: FormData): Promise<any> => {
        const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CloudinaryCloudName}/image/upload`, formData)
        return data
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        event.preventDefault()
        const formData = new FormData()
        if (event.target.files !== null) {
            formData.append('file', event.target.files[0])
            formData.append('upload_preset', 'marketplace')
        }

        const response = await postToCloudinary(formData)
        setCloudinaryFileUpload(response.secure_url)
        setValue('image', response.secure_url)
    }

    useEffect(() => {
        getPercentage(getValues, setPriceWithDiscount)
    }, [watchedValues])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full col-span-1 flex flex-col gap-y-5 px-4 md:px-5 pt-10 bg-[#ffffff] rounded-[8px]'>
                <div className="flex gap-x-5">
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
                                <label className='text-[0.8rem]' htmlFor="description">Brand</label>
                                <input
                                    {...register('brand')}
                                    type="text"
                                    className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.brand !== undefined ? 'ring-1 ring-red-500' : ''}`}
                                    placeholder='Brand'
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
                    <IndividualProductImage
                        cloudinaryFileUpload={cloudinaryFileUpload}
                        handleFileButtonClick={handleFileButtonClick}
                        handleFileUpload={handleFileUpload}
                        fileInputRef={fileInputRef}
                    />
                </div>
                <div className="flex justify-end gap-x-5 px-5">
                    <button type='button' onClick={handleOpenUpdateProduct} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-red-500 active:bg-[#10100e] rounded-[10px]'>Cancel</button>
                    <button type='submit' className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] rounded-[10px]'>Update</button>
                </div>
            </form>
        </>
    )
}

export default UpdateProductForm