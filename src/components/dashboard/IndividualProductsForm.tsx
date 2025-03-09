import { Dispatch, SetStateAction, useEffect, useState, type ReactNode } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import AddTagsComponent from './products/AddTagsComponent'
import { generateWithGemini } from '@/gemini/gemini'
import { ReactTyped } from 'react-typed'
import { motion } from 'framer-motion'
import { animatedGradientText } from '@/utils/styles'
import { toast } from 'react-toastify'
interface IndividualProductFormProps {
    register: UseFormRegister<{
        weight?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        length?: number | undefined;
        discount?: number | undefined;
        title: string;
        brand: string;
        description: string;
        price: number;
        quantity: number;
    }>
    setValue: UseFormSetValue<{
        weight?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        length?: number | undefined;
        discount?: number | undefined;
        title: string;
        brand: string;
        description: string;
        price: number;
        quantity: number;
    }>
    errors: FieldErrors<{

        title: string
        brand: string
        description: string
        weight: number | undefined
        height: number | undefined
        width: number | undefined
        length: number | undefined
        price: number | undefined
        discount: number | undefined
        quantity: number
    }>
    priceWithDiscount: number
    descriptionAdded: [string]
    valuesForDescription: [string, string | undefined]
    tags: Array<string>
    setTags: Dispatch<SetStateAction<Array<string>>>
    wasSubmitted: boolean
}

function IndividualProductForm({
    tags,
    errors,
    setTags,
    register,
    setValue,
    wasSubmitted,
    descriptionAdded,
    priceWithDiscount,
    valuesForDescription,
}: IndividualProductFormProps): ReactNode {

    const [isTypingDone, setIsTypingDone] = useState(false)
    const [generatedDescription, setGeneratedDescription] = useState<string>('')
    const [generatedTags, setGeneratedTags] = useState<Array<string>>([])

    const handleTypingEnd = () => {
        setIsTypingDone(true)
    }

    function handleAddTag(tag: string) {
        const wasAdded = tags.find((addedTag) => addedTag === tag)
        if (wasAdded) return
        setTags([...tags, tag])
    }

    function handleDeleteTag(tagToDelete: string) {
        const newTags = tags.filter((tag) => tag !== tagToDelete)
        setTags(newTags)
    }

    async function handleGenerateDescriptionWithGemini(): Promise<string | null> {

        if (valuesForDescription[0].length && valuesForDescription[1] && valuesForDescription[1].length) {
            const prompt = `Use this title for a product (${valuesForDescription[0]}) and this brand name (${valuesForDescription[1]}) to come up with a description for the product with an emphazis in key characteristics suitable for selling the product, answer with only the description and use a maximum of 200 characters.`
            const generation = await generateWithGemini(prompt)
            setGeneratedDescription(generation)
            return generation
        } else if (valuesForDescription[0].length) {
            const prompt = `Use this title for a product (${valuesForDescription[0]}) to come up with a description for the product with an emphazis in key characteristics suitable for selling the product, answer with only the description and use a maximum of 200 characters.`
            const generation = await generateWithGemini(prompt)
            setGeneratedDescription(generation)
            return generation
        } else {
            toast.error('Please add a Title and Brand before generating text.')
        }

        return null
    }

    async function handleGenerateTagsWithGemini() {

        if (descriptionAdded[0].length) {
            const prompt = `Use this product description (${descriptionAdded[0]}) to come up with 5 categories for the product to be used as tags, but answer with only the categories separated by commas.`
            const generation = await generateWithGemini(prompt)
            const generatedList = generation.split(',')
            setGeneratedTags(generatedList.map(tag => tag.trim()))
            return
        }
    }

    useEffect(() => {
        if (generatedDescription.length) {
            setValue('description', generatedDescription)
        }
    }, [generatedDescription])

    useEffect(() => {
        if (wasSubmitted) {
            setGeneratedDescription('')
            setGeneratedTags([])
        }
    }, [wasSubmitted])

    return (
        <div className='w-2/3 h-full min-h-[436px] flex flex-col gap-y-7 pr-5'>
            <div className="flex gap-x-2">
                <div className="w-full flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="title">Title</label>
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
                        <label className='text-[0.8rem]' htmlFor="brand">Brand</label>
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

            <div className="relative flex flex-col gap-y-2">
                <div className="relative flex flex-col gap-y-1">
                    <div className="group relative flex gap-x-2 items-center">
                        <label className='group relative text-[0.8rem] z-10' htmlFor="description">Description
                        </label>
                        <i onClick={handleGenerateDescriptionWithGemini} className={`fa-solid fa-brain group ${animatedGradientText} hover:bg-gray-100 cursor-pointer`} />
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className='hidden absolute top-2 left-[88px] w-[130px] z-50 group-hover:flex transition-all duration-200 bg-white shadow-md border border-gray-100 rounded-[6px] p-2'>
                            <p className={`text-[0.8rem] font-normal ${animatedGradientText}`}>Generate with A.I.</p>
                        </motion.div>
                    </div>
                    <textarea
                        {...register('description')}
                        className={`z-10 w-full h-20 text-[0.9rem] ${isTypingDone ? '' : 'text-white'} bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.description !== undefined ? 'ring-1 ring-red-500' : ''}`}
                        placeholder='Write your description here...'
                        onBlur={handleGenerateTagsWithGemini}
                    />
                    {
                        !isTypingDone && generatedDescription !== '' && (
                            <>
                                <ReactTyped
                                    className='z-10 absolute top-8 left-2 h-20 line-clamp-2 text-[0.9rem] w-[520px]'
                                    typeSpeed={10}
                                    showCursor={false}
                                    onComplete={handleTypingEnd}
                                    strings={[generatedDescription]}
                                />
                            </>
                        )
                    }
                </div>
                {errors.description && <small className="text-red-500">{errors.description.message}</small>}
            </div>

            <div className="flex flex-col gap-y-2">
                <AddTagsComponent
                    tags={tags}
                    wasSubmitted={wasSubmitted}
                    handleAddTag={handleAddTag}
                    generatedTags={generatedTags}
                    handleDeleteTag={handleDeleteTag}
                    handleGenerateTagsWithGemini={handleGenerateTagsWithGemini}
                />
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
            <div className="flex flex-col gap-y-2">
                <div className="flex gap-x-2">
                    <div className="w-full flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="price">Price</label>
                            <input
                                {...register('price')}
                                className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.price !== undefined ? 'ring-1 ring-red-500' : ''}`}
                                placeholder='Price'
                            />
                        </div>

                    </div>

                    <div className="w-full flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="discount">{'Discount (optional)'}</label>
                            <input
                                {...register('discount')}
                                className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                            />
                        </div>

                    </div>

                    <div className="w-full flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="quantity">Quantity</label>
                            <input
                                {...register('quantity')}
                                className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.quantity !== undefined ? 'ring-1 ring-red-500' : ''}`}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-y-1">
                    {errors.price && <small className="text-red-500">{errors.price.message}</small>}
                    {errors.discount && <small className="text-red-500">{errors.discount.message}</small>}
                    {errors.quantity && <small className="text-red-500">{errors.quantity.message}</small>}
                </div>
            </div>

            <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-1">
                    <label className='text-[0.8rem]' htmlFor="priceWithDiscount">Price with discount</label>
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