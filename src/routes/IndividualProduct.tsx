import { memo, useEffect, useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { getProductById, getProductsByTagsAsync } from '@/features/products/productsSlice'
import { motion } from 'framer-motion'

import ProductDescription from '@/components/common/ProductDescription'
import { ProductProps, StoreProps } from '@/utils/types'
import ErrorComponent from '@/components/common/ErrorComponent'
import { useNavigate } from 'react-router-dom'

function IndividualProduct({ id }: { id: string | undefined }): ReactNode {
    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch()
    const { currentTemplate, uiIsLoading, uiHasError } = useSelector((state: StoreProps) => state.ui)

    const product = useSelector((state: StoreProps) => state.inventory.individualProduct)
    const { productsAreLoading, productsHasError } = useSelector((state: StoreProps) => state.inventory)

    const [similarProducts, setSimilarProducts] = useState<ProductProps[]>([])

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id))
            async function getProductsByTag() {
                try {
                    const { payload } = await dispatch(getProductsByTagsAsync(id as string))
                    if (payload.similarProducts) setSimilarProducts(payload.similarProducts)
                } catch (error) {
                    console.log(error)
                }
            }

            getProductsByTag()

        }
    }, [id])

    return (
        <>
            {
                uiHasError && (
                    <ErrorComponent />
                )
            }
            {
                !uiHasError && !uiIsLoading && Object.keys(currentTemplate).length > 0 && (
                    <div className='relative w-screen h-screen flex justify-center items-center sm:max-lg:pt-[350px] bg-gray-100'>
                        <div className="w-[1440px] flex justify-center pt-[80px] z-20">
                            <div>
                                {
                                    productsHasError && (
                                        <ErrorComponent />
                                    )
                                }
                                {
                                    !productsHasError && product !== undefined && (
                                        <div className='h-auto flex'>
                                            <ProductDescription key={product.id} product={product} isLoading={productsAreLoading} />
                                            <div className="h-full flex flex-col bg-[#fff]">
                                                {
                                                    similarProducts.length > 0 && !productsAreLoading ? similarProducts.map((product, i) => (
                                                        <motion.button
                                                            onClick={() => { navigate(`/product/${product.id}`) }}
                                                            initial={{ scale: 1, opacity: 0 }}
                                                            animate={{ opacity: 1, transition: { duration: 0.8 } }}
                                                            whileHover={{ scale: 1.02 }}
                                                            transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                                                            key={`id-${product.id}-${i}`} className="relative group w-[180px] h-[180px] glass bg-[#fff]">
                                                            <img className="h-full object-cover z-0" src={product.images[0].image} alt={product.title} />
                                                            <div className="absolute top-0 left-0 w-full h-full bg-radial from-20% from-transparent to-[#10100e] opacity-20"></div>
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                whileHover={{ opacity: 0.5 }}
                                                                transition={{ duration: 0.5 }}
                                                                className="absolute hidden group-hover:flex justify-center items-center top-0 left-0 w-full h-full bg-[#10100e] opacity-20 transition-all duration-200">
                                                                <p className="text-[#fff]">{product.title}</p>
                                                            </motion.div>
                                                        </motion.button>
                                                    ))
                                                        :
                                                        (
                                                            <div className='w-[180px] h-[180px] glass bg-[#fff] animate-pulse'></div>
                                                        )
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className='absolute w-full h-full object-cover' src="https://res.cloudinary.com/maulight/image/upload/v1740158140/wkbgeohyeplwr8sjc0tc.jpg" alt="" />
                    </div>
                )
            }
        </>
    )
}

function areEqual(prevProps: { id: string | undefined }, nextProps: { id: string | undefined }) {
    return prevProps.id === nextProps.id
}

export default memo(IndividualProduct, areEqual)
