import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { getAllProductsAsync, updateProductByIdAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import Compressor from 'compressorjs'

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import IndividualProductImage from './IndividualProductImage'
import { OnSubmitFormValues, ProductProps } from '@/utils/types'
import { generateSignature, getPercentage, handleCopyToClipboard } from '@/utils/functions'

export const productSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    brand: yup.string(),
    description: yup.string().required('Description is required'),
    image: yup.string().url('Image must be a valid URL'),
    price: yup.number().required(),
    discount: yup.number().required()
})

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME
const CloudinaryAPIKEY = import.meta.env.VITE_CLOUDINARY_APIKEY

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
    const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string | null>(null)
    const [compress, setCompress] = useState<number>(1)
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

        if (event.target.files !== null) {
            const file = event.target.files[0]
            const formData = new FormData()
            if (compress === 1) {
                new Compressor(file, {
                    quality: 0.6,
                    success(res) {
                        formData.append('file', res)
                        formData.append('upload_preset', 'marketplace')
                        postToCloudinary(formData)
                            .then((response) => {
                                setCloudinaryFileUpload(response.secure_url)
                                setCloudinaryPublicId(response.public_id)
                                setValue('image', response.secure_url)
                            })
                    }
                })
            } else {
                formData.append('file', file)
                formData.append('upload_preset', 'marketplace')
                postToCloudinary(formData)
                    .then((response) => {
                        setCloudinaryFileUpload(response.secure_url)
                        setCloudinaryPublicId(response.public_id)
                        setValue('image', response.secure_url)
                    })
            }


        }
    }

    //* Erase last uploaded image if wants to upload another
    const handleResetUploadImage = async () => {
        const timestamp = Math.floor(Date.now() / 1000)
        const signature = generateSignature({ public_id: cloudinaryPublicId, timestamp })

        const formData = new FormData()
        formData.append('public_id', cloudinaryPublicId as string)
        formData.append('timestamp', timestamp.toString())
        formData.append('api_key', CloudinaryAPIKEY)
        formData.append('signature', signature)

        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${CloudinaryCloudName}/image/destroy`, formData)
            console.log('Image was deleted succesfully: ', response.data)
        } catch (error) {
            console.error('There was an error deleting this image: ', error)
        }

        setCloudinaryFileUpload(null)
        setValue('image', product.image)
    }

    useEffect(() => {
        getPercentage(getValues, setPriceWithDiscount)
    }, [watchedValues])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full col-span-1 flex flex-col gap-y-5 px-4 md:px-5 pt-10 bg-[#ffffff] rounded-[8px]'>
                <div className="flex gap-x-5">
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
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                {errors.brand && <small className="text-red-500">{errors.brand.message}</small>}
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
                        handleResetUploadImage={handleResetUploadImage}
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