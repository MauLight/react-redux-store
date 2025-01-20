import { generateSignature, postToCloudinary } from '@/utils/functions'
import { useRef, useState, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import Compressor from 'compressorjs'
import axios from 'axios'
import ErrorComponent from '@/components/common/ErrorComponent'
import Fallback from '@/components/common/Fallback'

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME
const CloudinaryAPIKEY = import.meta.env.VITE_CLOUDINARY_APIKEY

function HeroSectionPanel(): ReactNode {

    const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string>('')
    const [cloudinaryBackground, setCloudinaryBackground] = useState<string | null>(null)
    const [cloudinaryLoading, setCloudinaryLoading] = useState<boolean>(false)
    const [cloudinaryError, setCloudinaryError] = useState<string | null>(null)
    const [compress, setCompress] = useState<number>(1)

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleFileButtonClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        event.preventDefault()

        if (event.target.files !== null) {
            try {
                setCloudinaryLoading(true)

                const file = event.target.files[0]
                const formData = new FormData()
                if (compress === 1) {
                    new Compressor(file, {
                        quality: 0.6,
                        success(res) {
                            console.log(res.size, 'This is the new size.')
                            formData.append('file', res)
                            formData.append('upload_preset', 'marketplace')
                            postToCloudinary(formData, setCloudinaryError)
                                .then((response) => {

                                    setCloudinaryBackground(response.secure_url)
                                    setCloudinaryPublicId(response.public_id)
                                    setCloudinaryLoading(false)

                                })
                        }
                    })
                } else {
                    formData.append('file', file)
                    formData.append('upload_preset', 'marketplace')
                    postToCloudinary(formData, setCloudinaryError)
                        .then((response) => {

                            setCloudinaryBackground(response.secure_url)
                            setCloudinaryPublicId(response.public_id)
                            setCloudinaryLoading(false)
                        })
                }
            } catch (error) {
                console.log(error)
                setCloudinaryLoading(false)
                toast.error(error as string)
            }
        }
    }

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

        setCloudinaryBackground(null)
    }

    return (
        <section className='w-full flex flex-col gap-y-5'>
            <h2 className='text-[1rem] text-sym_gray-700'>Hero Section:</h2>
            <div className="flex flex-col gap-y-10">

                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">Header</label>
                        <input
                            // {...register('title')}
                            type="text"
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                            placeholder='Header'
                        />
                    </div>
                    {/* {errors.title && <small className="text-red-500">{errors.title.message}</small>} */}
                </div>

                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">Sub-header</label>
                        <input
                            // {...register('title')}
                            type="text"
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                            placeholder='Sub-header'
                        />
                    </div>
                    {/* {errors.title && <small className="text-red-500">{errors.title.message}</small>} */}
                </div>

                <div className="flex flex-col gap-y-2">
                    <>
                        {
                            cloudinaryError && (
                                <ErrorComponent error={cloudinaryError} />
                            )
                        }
                        {
                            !cloudinaryError && cloudinaryLoading && (
                                <div className='w-full h-[120px] flex justify-center items-center'>
                                    <Fallback color='#6366f1' />
                                </div>
                            )
                        }
                        {
                            !cloudinaryError && !cloudinaryLoading && cloudinaryBackground && (
                                <div className="group flex flex-col gap-y-2">

                                    <label className='text-[0.8rem]' htmlFor="background upload">{'Image (16:9 / 1920x1080 px for best results)'}</label>
                                    <div className='relative h-[120px] rounded-[5px] overflow-hidden'>
                                        <img src={cloudinaryBackground} alt="product" className='h-full w-full object-cover' />
                                        <button type='button' onClick={handleResetUploadImage} className='absolute top-2 right-2 w-[30px] h-[30px] flex justify-center items-center rounded-full bg-indigo-500 text-[#ffffff] hover:bg-[#10100e] active:bg-indigo-500'>
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                </div>
                            )

                        }
                        {
                            !cloudinaryError && !cloudinaryLoading && !cloudinaryBackground && (
                                <div className="group flex flex-col gap-y-2">
                                    <label className='text-[0.8rem]' htmlFor="background upload">{'Image (16:9 / 1920x1080 px for best results)'}</label>
                                    <button onClick={handleFileButtonClick} name='background upload' className='h-[120px] flex flex-col justify-center items-center gap-y-2 border border-sym_gray-600 border-dashed rounded-[5px] group-hover:border-indigo-500 group-hover:text-indigo-500 transition-color duration-200'>
                                        <i className="fa-solid fa-cloud-arrow-up fa-xl"></i>
                                        Upload image
                                    </button>
                                    <input type='file' ref={fileInputRef} onChange={handleFileUpload} className='hidden' />
                                </div>
                            )

                        }
                    </>
                </div>

            </div>
        </section>
    )
}

export default HeroSectionPanel