import { Dispatch, SetStateAction, useRef, useState, type ReactNode } from 'react'
import axios from 'axios'

import { generateSignature, postToCloudinary } from '@/utils/functions'

import ErrorComponent from '@/components/common/ErrorComponent'
import Fallback from '@/components/common/Fallback'
import { toast } from 'react-toastify'
import { fullSpectrumColors } from '@/utils/lists'
import { Switch } from '@/components/common/Switch'

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME
const CloudinaryAPIKEY = import.meta.env.VITE_CLOUDINARY_APIKEY

export default function TopbarSectionPanel({ setTopBackground }: { setTopBackground: Dispatch<SetStateAction<string>> }): ReactNode {

    const [clickedAllowTransparency, setClickedAllowTransparency] = useState<boolean>(true)

    function handleOpenAllowTransparency() {
        if (!clickedAllowTransparency) {
            //dispatch backend action
            setTopBackground('#10100e')
            setClickedAllowTransparency(true)
            return
        }
        setClickedAllowTransparency(false)
    }

    const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string>('')
    const [cloudinaryLogo, setCloudinaryLogo] = useState<string | null>(null)
    const [cloudinaryLoading, setCloudinaryLoading] = useState<boolean>(false)
    const [cloudinaryError, setCloudinaryError] = useState<string | null>(null)
    const [compress, _setCompress] = useState<number>(1)

    //* Input file ref, hidden and accesible through the button that triggers handleFileButtonClick method.
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    //* Method triggered by fileInputRef, from the button and pointing to the hidden input.text, triggers onChange event.
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
                                .then(async (response) => {
                                    setCloudinaryLogo(response.secure_url)
                                    setCloudinaryPublicId(response.public_id)

                                    // const newHeroConfiguration = {
                                    //     header,
                                    //     subHeader,
                                    //     compressImage: clickedCompressImage,
                                    //     image: response.secure_url,
                                    //     image_public_id: response.public_id
                                    // }

                                    // await dispatch(updateUIConfigurationAsync({
                                    //     id: id as string, newConfiguration: {
                                    //         ...currConfig,
                                    //         home: {
                                    //             ...currConfig.home,
                                    //             hero: newHeroConfiguration
                                    //         }
                                    //     }
                                    // }))

                                    setCloudinaryLoading(false)

                                })
                        }
                    })
                } else {
                    formData.append('file', file)
                    formData.append('upload_preset', 'marketplace')
                    postToCloudinary(formData, setCloudinaryError)
                        .then((response) => {

                            setCloudinaryLogo(response.secure_url)
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

            // const newHeroConfiguration = {
            //     header,
            //     subHeader,
            //     compressImage: clickedCompressImage,
            //     image: '',
            //     image_public_id: ''
            // }

            // await dispatch(updateUIConfigurationAsync({
            //     id: id as string, newConfiguration: {
            //         ...currConfig,
            //         home: {
            //             ...currConfig.home,
            //             hero: newHeroConfiguration
            //         }
            //     }
            // }))

        } catch (error) {
            console.error('There was an error deleting this image: ', error)
        }

        setCloudinaryLogo(null)
    }

    return (
        <section className='w-full flex flex-col gap-y-5'>
            <h2 className='text-[1rem] text-sym_gray-700'>Topbar Section:</h2>
            <div className="flex flex-col gap-y-10">

                <div className="flex flex-col gap-y-2">
                    <div className="flex items-center justify-between gap-x-2">
                        <p>Make the top navbar transparent</p>
                        <Switch clicked={clickedAllowTransparency} handleClick={handleOpenAllowTransparency} />
                    </div>
                </div>

                <div className="group flex flex-col gap-y-2">
                    <label className='text-[0.8rem]' htmlFor="topbar color">{'Topbar background color'}</label>
                    <div className="flex flex-col w-[200px]">
                        <div className="flex flex-wrap">
                            {
                                fullSpectrumColors.map((color, i) => (
                                    <button onClick={() => { setTopBackground(color.replace('bg-[', '').replace(']', '')); setClickedAllowTransparency(false) }} key={i + '-' + color} className={`w-10 h-10 border ${color.replaceAll('"', '')}`} />
                                ))
                            }
                        </div>
                    </div>
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
                            !cloudinaryError && !cloudinaryLoading && cloudinaryLogo && (
                                <div className="group flex flex-col gap-y-2">

                                    <label className='text-[0.8rem]' htmlFor="background upload">{'Image (16:9 / 1920x1080 px for best results)'}</label>
                                    <div className='relative h-[120px] rounded-[5px] overflow-hidden'>
                                        <img src={cloudinaryLogo} alt="product" className='h-full w-full object-cover' />
                                        <button type='button' onClick={handleResetUploadImage} className='absolute top-2 right-2 w-[30px] h-[30px] flex justify-center items-center rounded-full bg-indigo-500 text-[#ffffff] hover:bg-[#10100e] active:bg-indigo-500'>
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                </div>
                            )

                        }
                        {
                            !cloudinaryError && !cloudinaryLoading && !cloudinaryLogo && (
                                <div className="group flex flex-col gap-y-2">
                                    <label className='text-[0.8rem]' htmlFor="background upload">{'Logo (300x60 px for best results)'}</label>
                                    <button onClick={handleFileButtonClick} name='background upload' className='h-[120px] w-[200px] flex flex-col justify-center items-center gap-y-2 border border-sym_gray-600 border-dashed rounded-[5px] group-hover:border-indigo-500 group-hover:text-indigo-500 transition-color duration-200'>
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
