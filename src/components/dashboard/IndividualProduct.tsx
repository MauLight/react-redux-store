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
import IndividualProductForm from './IndividualProductsForm'
import IndividualProductImage from './IndividualProductImage'
import { generateSignature } from '@/utils/functions'

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME
const CloudinaryAPIKEY = import.meta.env.VITE_CLOUDINARY_APIKEY

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
        const formData = new FormData()
        if (event.target.files !== null) {
            formData.append('file', event.target.files[0])
            formData.append('upload_preset', 'marketplace')
        }

        const response = await postToCloudinary(formData)
        setCloudinaryFileUpload(response.secure_url)
        setCloudinaryPublicId(response.public_id)
        setValue('image', response.secure_url)
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
                    <IndividualProductForm
                        register={register}
                        errors={errors}
                        cloudinaryFileUpload={cloudinaryFileUpload}
                        priceWithDiscount={priceWithDiscount}
                    />
                    <IndividualProductImage
                        handleResetUploadImage={handleResetUploadImage}
                        cloudinaryFileUpload={cloudinaryFileUpload}
                        handleFileButtonClick={handleFileButtonClick}
                        handleFileUpload={handleFileUpload}
                        fileInputRef={fileInputRef}
                    />
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
