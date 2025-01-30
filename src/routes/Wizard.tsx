import { DecodedProps } from '@/utils/types'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/functions'
import CustomDropdownWithCreate from '@/components/common/CustomDropdownWithCreate'
import { digitalProducts, handcraftedProducts, physicalProducts, services, subscriptionProducts } from '@/utils/lists'

const productOrServiceList = ['Products', 'Services', 'Subscriptions']
const typesOfProductsList = ['Physical Products', 'Digital Products', 'Handcrafted Products']

export default function Wizard(): ReactNode {
    //const dispatch: AppDispatch = useDispatch()
    const admin = localStorage.getItem('marketplace-admin') ? JSON.parse(localStorage.getItem('marketplace-admin') as string) : {}
    const navigate = useNavigate()
    const [step, setStep] = useState<number>(1)
    const [welcomeText, setWelcomeText] = useState<{ text: boolean, button: boolean }>({
        text: false,
        button: false
    })

    //* Dropdown state
    const [productOrService, setProductOrService] = useState<string>('')
    const [typesOfProducts, setTypesOfProducts] = useState<string>('')
    const [product, setProduct] = useState<string>('')
    const [typesOfService, setTypesOfService] = useState<string>('')
    const [typesOfSubscription, setTypesOfSubscription] = useState<string>('')

    const [stepTwoIsready, setStepTwoIsReady] = useState<boolean>(false)

    function handleNextStep() {
        switch (step) {
            case 1: {
                setStep(2)
                break
            }
            case 2: {
                setStep(3)
                break
            }
            default: {
                setStep(1)
            }
        }
    }

    function handlePrevStep() {
        switch (step) {
            case 1: {
                setStep(1)
                break
            }
            case 2: {
                setStep(1)
                break
            }
            case 3: {
                setStep(2)
                break
            }
            default: {
                setStep(1)
            }
        }
    }

    useLayoutEffect(() => {
        if (!Object.keys(admin).length) {
            navigate('/admin/builder')
        } else {
            const decoded: DecodedProps = jwtDecode(admin.token)
            if (!decoded.wizard) {
                navigate('/admin/builder')
            }
        }
    }, [])

    useEffect(() => {
        if (step === 1 && !welcomeText.text) {
            setTimeout(() => {
                setWelcomeText({
                    ...welcomeText,
                    text: true
                })
            }, 1000)
        }
    }, [])

    useEffect(() => {
        if (step === 1 && welcomeText.text) {
            setTimeout(() => {
                setWelcomeText({
                    ...welcomeText,
                    button: true
                })
            }, 1000)
        }
    }, [welcomeText])

    useEffect(() => {
        if (product !== '' || typesOfService !== '' || typesOfSubscription !== '') {
            setStepTwoIsReady(true)
        }
    }, [product])

    useEffect(() => {
        setTypesOfProducts('')
        setTypesOfService('')
        setTypesOfSubscription('')
        setProduct('')
    }, [productOrService])

    useEffect(() => {
        setProduct('')
    }, [typesOfProducts])

    return (
        <main className='h-screen w-full flex flex-col justify-center gap-y-5 items-center'>
            <main className={`flex flex-col ${step === 1 ? 'h-[290px]' : ''} w-[1100px] gap-y-1 p-10 bg-[#ffffff] rounded-[5px] transition-all duration-200`}>
                {
                    step === 1 && (
                        <div className='flex flex-col gap-y-20'>
                            <div className='flex flex-col gap-y-2'>
                                <motion.h1
                                    variants={fadeIn('top', 0.2)}
                                    initial={'hidden'}
                                    whileInView={'show'}
                                    className='text-[1.5rem]'>Welcome to <b className='text-indigo-500'>Symetria</b> Marketplace.</motion.h1>
                                {
                                    welcomeText.text && (
                                        <motion.p
                                            variants={fadeIn('top', 0.2)}
                                            initial={'hidden'}
                                            whileInView={'show'}
                                            className='text-balance'
                                        >Please take a moment to configure your marketplace to get it up and running. We promise it won't take more than a couple of minutes, but it'll be worth it, we promise.
                                        </motion.p>
                                    )
                                }
                            </div>
                            {
                                welcomeText.button && (
                                    <motion.div
                                        variants={fadeIn('top', 0.2)}
                                        initial={'hidden'}
                                        whileInView={'show'}
                                        className="w-full flex justify-end gap-x-2"
                                    >
                                        <button onClick={handleNextStep} className='w-[120px] h-10 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-3 rounded-[10px]'>
                                            Next
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    </motion.div>
                                )
                            }
                        </div>
                    )
                }
                {
                    step === 2 && (
                        <div className='flex flex-col gap-y-20'>
                            <div className='flex flex-col gap-y-2'>
                                <motion.h1
                                    variants={fadeIn('top', 0.2)}
                                    initial={'hidden'}
                                    whileInView={'show'}
                                    className='text-[1.5rem]'>1. Your business</motion.h1>
                                {
                                    welcomeText.text && (
                                        <motion.p
                                            variants={fadeIn('top', 0.2)}
                                            initial={'hidden'}
                                            whileInView={'show'}
                                            className='text-balance'
                                        >To give you a personalized marketplace experience, we need to know a bit about your business. From the dropdown below, which type is closest to your business?
                                        </motion.p>
                                    )
                                }
                                <motion.div
                                    className='w-[200px] mt-5'
                                    variants={fadeIn('top', 0.2)}
                                    initial={'hidden'}
                                    whileInView={'show'}
                                >
                                    <CustomDropdownWithCreate
                                        value={productOrService}
                                        setValue={setProductOrService}
                                        list={productOrServiceList}
                                    />
                                </motion.div>

                                <div className="flex flex-col gap-y-5 mt-10">
                                    {
                                        productOrService === 'Products' ? (
                                            <div className='flex flex-col gap-y-2'>
                                                <motion.p
                                                    variants={fadeIn('top', 0.2)}
                                                    initial={'hidden'}
                                                    whileInView={'show'}
                                                    className='text-balance'
                                                >From the following list, which type of product is closest to the ones you which to sell?
                                                </motion.p>
                                                <motion.div
                                                    className='w-[200px] mt-5'
                                                    variants={fadeIn('top', 0.2)}
                                                    initial={'hidden'}
                                                    whileInView={'show'}
                                                >
                                                    <CustomDropdownWithCreate
                                                        value={typesOfProducts}
                                                        setValue={setTypesOfProducts}
                                                        list={typesOfProductsList}
                                                    />
                                                </motion.div>
                                            </div>
                                        )
                                            :
                                            productOrService === 'Services' ? (
                                                <div className='flex flex-col gap-y-2'>
                                                    <motion.p
                                                        variants={fadeIn('top', 0.2)}
                                                        initial={'hidden'}
                                                        whileInView={'show'}
                                                        className='text-balance'
                                                    >From the following list, which type of service is closest to the one you which to sell?
                                                    </motion.p>
                                                    <motion.div
                                                        className='w-[600px] mt-5'
                                                        variants={fadeIn('top', 0.2)}
                                                        initial={'hidden'}
                                                        whileInView={'show'}
                                                    >
                                                        <CustomDropdownWithCreate
                                                            value={typesOfService}
                                                            setValue={setTypesOfService}
                                                            list={services.map(service => `${service.category} (${service.examples})`)}
                                                        />
                                                    </motion.div>
                                                </div>
                                            )
                                                :
                                                productOrService === 'Subscriptions' ? (
                                                    <div className='flex flex-col gap-y-2'>
                                                        <motion.p
                                                            variants={fadeIn('top', 0.2)}
                                                            initial={'hidden'}
                                                            whileInView={'show'}
                                                            className='text-balance'
                                                        >From the following list, which type of subscription product is closest to the one you which to sell?
                                                        </motion.p>
                                                        <motion.div
                                                            className='w-[600px] mt-5'
                                                            variants={fadeIn('top', 0.2)}
                                                            initial={'hidden'}
                                                            whileInView={'show'}
                                                        >
                                                            <CustomDropdownWithCreate
                                                                value={typesOfSubscription}
                                                                setValue={setTypesOfSubscription}
                                                                list={subscriptionProducts.map(subscription => `${subscription.category} (${subscription.examples})`)}
                                                            />
                                                        </motion.div>
                                                    </div>
                                                )
                                                    :
                                                    null
                                    }
                                </div>

                                <div className="flex flex-col gap-y-5 mt-10">
                                    {
                                        productOrService === 'Products' && typesOfProducts === typesOfProductsList[0] && (
                                            <div className='flex flex-col gap-y-2'>
                                                <motion.p
                                                    variants={fadeIn('top', 0.2)}
                                                    initial={'hidden'}
                                                    whileInView={'show'}
                                                    className='text-balance'
                                                >From the following list, which type of category of product is closest to yours?
                                                </motion.p>
                                                <motion.div
                                                    className='w-[600px] mt-5'
                                                    variants={fadeIn('top', 0.2)}
                                                    initial={'hidden'}
                                                    whileInView={'show'}
                                                >
                                                    <CustomDropdownWithCreate
                                                        value={product}
                                                        setValue={setProduct}
                                                        list={physicalProducts.map(product => `${product.category} (${product.examples})`)}
                                                    />
                                                </motion.div>
                                            </div>
                                        )
                                    }
                                    {
                                        productOrService === 'Products' && typesOfProducts === typesOfProductsList[1] && (
                                            <div className='flex flex-col gap-y-2'>
                                                <motion.p
                                                    variants={fadeIn('top', 0.2)}
                                                    initial={'hidden'}
                                                    whileInView={'show'}
                                                    className='text-balance'
                                                >From the following list, which type of category of product is closest to yours?
                                                </motion.p>
                                                <motion.div
                                                    className='w-[600px] mt-5'
                                                    variants={fadeIn('top', 0.2)}
                                                    initial={'hidden'}
                                                    whileInView={'show'}
                                                >
                                                    <CustomDropdownWithCreate
                                                        value={product}
                                                        setValue={setProduct}
                                                        list={digitalProducts.map(product => `${product.category} (${product.examples})`)}
                                                    />
                                                </motion.div>
                                            </div>
                                        )
                                    }
                                    {
                                        productOrService === 'Products' && typesOfProducts === typesOfProductsList[2] && (
                                            <div className='flex flex-col gap-y-2'>
                                                <motion.p
                                                    variants={fadeIn('top', 0.2)}
                                                    initial={'hidden'}
                                                    whileInView={'show'}
                                                    className='text-balance'
                                                >From the following list, which type of category of product is closest to yours?
                                                </motion.p>
                                                <motion.div
                                                    className='w-[600px] mt-5'
                                                    variants={fadeIn('top', 0.2)}
                                                    initial={'hidden'}
                                                    whileInView={'show'}
                                                >
                                                    <CustomDropdownWithCreate
                                                        value={product}
                                                        setValue={setProduct}
                                                        list={handcraftedProducts.map(product => `${product.category} (${product.examples})`)}
                                                    />
                                                </motion.div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>

                            <motion.div
                                variants={fadeIn('top', 0.2)}
                                initial={'hidden'}
                                whileInView={'show'}
                                className="w-full flex justify-end gap-x-2"
                            >
                                <button onClick={handlePrevStep} className='w-[120px] h-10 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-3 rounded-[10px]'>
                                    Previous
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                {
                                    stepTwoIsready && (
                                        <button onClick={handleNextStep} className='w-[120px] h-10 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-3 rounded-[10px]'>
                                            Next
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    )
                                }
                            </motion.div>

                        </div>
                    )
                }
            </main>
        </main>
    )
}
