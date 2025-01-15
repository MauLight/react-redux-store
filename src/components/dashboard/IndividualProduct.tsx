import { useEffect, useRef, useState, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import Compressor from 'compressorjs'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { postIndividualProductAsync } from '@/features/products/productsSlice'

import { Modal } from '../common/Modal'
import IndividualProductForm from './IndividualProductsForm'
import IndividualProductImage from './IndividualProductImage'
import ConfirmationModal from './ConfirmationModal'

import { generateSignature } from '@/utils/functions'

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME
const CloudinaryAPIKEY = import.meta.env.VITE_CLOUDINARY_APIKEY

export const productSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    brand: yup.string(),
    description: yup.string().required('Description is required'),
    image: yup.string().url('Image must be a valid URL'),
    weight: yup.number(),
    height: yup.number(),
    width: yup.number(),
    length: yup.number(),
    price: yup.number().required('Price is required'),
    discount: yup.number(),
    quantity: yup.number(),
})

function IndividualProduct(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const [confirmationDialogue, setConfirmationDialogue] = useState<boolean>(false)
    const [priceWithDiscount, setPriceWithDiscount] = useState<number>(0)
    const [compress, setCompress] = useState<number>(1)

    const [tags, setTags] = useState<string[]>([])
    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false)

    //* UseForm State
    const { watch, register, getValues, setValue, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            image: '',
            weight: 0,
            height: 0,
            width: 0,
            length: 0
        },
        resolver: yupResolver(productSchema)
    })
    const watchedValues = watch(['price', 'discount'])
    const valuesForDescription = watch(['title', 'brand'])
    const descriptionAdded = watch(['description'])

    const onSubmit = () => {
        setConfirmationDialogue(true)
    }

    //* Cloudinary state
    const [cloudinaryFileUpload, setCloudinaryFileUpload] = useState<string | null>(null)
    const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string | null>(null)
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

    //* Upload a new image to Cloudinary
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        event.preventDefault()

        if (event.target.files !== null) {
            const file = event.target.files[0]
            const formData = new FormData()
            if (compress === 1) {
                new Compressor(file, {
                    quality: 0.6,
                    success(res) {
                        console.log(res.size, 'This is the new size.')
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
        setValue('image', '')
    }

    function handleResetForm() {
        reset()
        setWasSubmitted(true)
    }

    async function handlePostProduct() {
        const data = getValues()

        const isUrl = /^(https?:\/\/)?((([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+:)*([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:[0-9]+)?(\/([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)*(\?([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?(#([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?$/.test(data.image as string)

        if (!isUrl) {
            const { payload } = await dispatch(postIndividualProductAsync({ ...data, image: 'https://dummyimage.com/600x400/000/fff', tags }))
            if (payload) {
                toast.success(payload.message)
            } else {
                toast.error('There was an error with your request.')
            }
        } else {
            const { payload } = await dispatch(postIndividualProductAsync({ ...data, tags }))
            if (payload) {
                toast.success(payload.message)
            } else {
                toast.error('There was an error with your request.')
            }
        }
        reset()
        setTags([])
        setCloudinaryFileUpload(null)
        setConfirmationDialogue(false)
        setWasSubmitted(true)
    }

    function getPercentage() {
        const percentage = getValues().discount
        const price = getValues().price
        const discount = percentage ? (percentage / 100) * price : 0
        setPriceWithDiscount(price - discount)
    }

    useEffect(() => {
        getPercentage()
    }, [watchedValues])

    useEffect(() => {
        if (wasSubmitted && (watchedValues.length || valuesForDescription.length || descriptionAdded.length)) {
            setWasSubmitted(false)
        }
    }, [watchedValues, valuesForDescription, descriptionAdded])


    return (
        <>
            <form onSubmit={(e) => { e.preventDefault() }} className='w-full col-span-1 flex flex-col gap-y-5 px-4 md:px-10 py-10 bg-[#ffffff] rounded-[8px]'>
                <h1 className='text-[1rem] sm:text-[1.2rem] text-balance leading-tight'>Add individual products here:</h1>
                <div className="flex gap-x-5">
                    <IndividualProductForm
                        tags={tags}
                        errors={errors}
                        setTags={setTags}
                        register={register}
                        setValue={setValue}
                        compress={compress}
                        wasSubmitted={wasSubmitted}
                        setCompress={setCompress}
                        descriptionAdded={descriptionAdded}
                        priceWithDiscount={priceWithDiscount}
                        cloudinaryFileUpload={cloudinaryFileUpload}
                        valuesForDescription={valuesForDescription}
                    />
                    <IndividualProductImage
                        fileInputRef={fileInputRef}
                        handleFileUpload={handleFileUpload}
                        cloudinaryFileUpload={cloudinaryFileUpload}
                        handleFileButtonClick={handleFileButtonClick}
                        handleResetUploadImage={handleResetUploadImage}
                    />
                </div>
                <div className="flex gap-x-2 justify-end">
                    <button onClick={handleResetForm} type='button' className='w-[150px] h-10 bg-[#ffffff] border border-gray-400 hover:bg-red-500 text-[#10100e] hover:text-[#ffffff] active:bg-[#ffffff] active:text-[#10100e] transition-color duration-200 mt-2 rounded-[10px]'>Reset</button>
                    <button onClick={handleSubmit(onSubmit)} className='w-[150px] h-10 bg-[#10100e] text-[#ffffff] hover:bg-green-600 active:bg-[#10100e] transition-color duration-200 mt-2 rounded-[10px]'>Submit</button>
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
