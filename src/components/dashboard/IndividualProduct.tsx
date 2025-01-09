import { postIndividualProductAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { Modal } from '../common/Modal'
import ConfirmationModal from './ConfirmationModal'
import axios from 'axios'
import { handleCopyToClipboard } from '@/utils/functions'

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME

export const productSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    image: yup.string().url('Image must be a valid URL'),
    price: yup.number().required(),
    discount: yup.number().required()
})

function IndividualProduct(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const [confirmationDialogue, setConfirmationDialogue] = useState<boolean>(false)
    const [priceWithDiscount, setPriceWithDiscount] = useState<number>(0)

    //* UseForm State
    const { watch, register, getValues, setValue, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            image: ''
        },
        resolver: yupResolver(productSchema)
    })
    const watchedValues = watch(['price', 'discount'])

    const onSubmit = () => {
        setConfirmationDialogue(true)
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

    async function handlePostProduct() {
        const data = getValues()

        const isUrl = /^(https?:\/\/)?((([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+:)*([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:[0-9]+)?(\/([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)*(\?([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?(#([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?$/.test(data.image as string)

        if (!isUrl) {
            const { payload } = await dispatch(postIndividualProductAsync({ ...data, image: 'https://dummyimage.com/600x400/000/fff' }))
            if (payload) {
                toast.success(payload.message)
            } else {
                toast.error('There was an error with your request.')
            }
        } else {
            const { payload } = await dispatch(postIndividualProductAsync({ ...data }))
            if (payload) {
                toast.success(payload.message)
            } else {
                toast.error('There was an error with your request.')
            }
        }
        reset()
        setConfirmationDialogue(false)
    }

    function getPercentage() {
        const percentage = getValues().discount
        const price = getValues().price
        const discount = (percentage / 100) * price
        setPriceWithDiscount(price - discount)
    }

    useEffect(() => {
        getPercentage()
    }, [watchedValues])


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full col-span-1 flex flex-col gap-y-5 px-4 md:px-10 py-10 bg-[#ffffff] rounded-[8px]'>
                <h1 className='text-[1rem] sm:text-[1.2rem] text-balance leading-tight'>Add individual products here:</h1>
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
                </div>

                <div className="flex justify-end">
                    <button type="submit" className='w-[150px] h-10 bg-[#10100e] text-[#ffffff] mt-2 rounded-[10px]'>Submit</button>
                </div>
            </form>
            {
                confirmationDialogue && (
                    <Modal openModal={confirmationDialogue} handleOpenModal={() => { setConfirmationDialogue(!confirmationDialogue) }}>
                        <ConfirmationModal
                            product={{ ...getValues() }}
                            setConfirmationDialogue={setConfirmationDialogue}
                            handlePostProduct={handlePostProduct}
                        />
                    </Modal>
                )
            }
        </>
    )
}

export default IndividualProduct
