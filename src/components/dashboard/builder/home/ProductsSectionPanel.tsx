import { useState, type ReactNode } from 'react'

import CustomDropdown from '@/components/common/CustomDropdown'
import { Link } from 'react-router-dom'

function ProductsSectionPanel(): ReactNode {
    const [selectedCollection, setSelectedCollection] = useState<string>('')
    const [selectedSorting, setSelectedSorting] = useState<string>('')

    return (
        <section className='w-full flex flex-col gap-y-5'>
            <h2 className='text-[1rem] text-sym_gray-700'>Products Section:</h2>
            <div className="flex flex-col gap-y-10">

                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">Items per row</label>
                        <CustomDropdown
                            defaultValue='3'
                            value={selectedCollection}
                            setValue={setSelectedCollection}
                            list={['2', '3', '4', '5']}
                        />
                    </div>
                    {/* {errors.title && <small className="text-red-500">{errors.title.message}</small>} */}
                </div>

                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">Default sorting:</label>
                        <CustomDropdown
                            defaultValue='Recommended'
                            value={selectedSorting}
                            setValue={setSelectedSorting}
                            list={['Recommended', 'Price (lower to high)', 'Price (high to lower)', 'Title (A to Z)', 'Title (Z to A)']}
                        />
                    </div>
                    {/* {errors.title && <small className="text-red-500">{errors.title.message}</small>} */}
                </div>

                <div className="flex flex-col gap-y-2">
                    <Link to={'/admin/products'} className='text-[0.9rem] underline text-indigo-500'>Edit products</Link>

                </div>

            </div>
        </section>
    )
}

export default ProductsSectionPanel
