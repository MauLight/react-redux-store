import { useState, type ReactNode } from 'react'

import CustomDropdown from '@/components/common/CustomDropdown'
import { Link } from 'react-router-dom'

export default function CollectionSectionPanel(): ReactNode {
    const [selectedCollection, setSelectedCollection] = useState<string>('')
    const [selectedSorting, setSelectedSorting] = useState<string>('')

    return (
        <section className='w-full flex flex-col gap-y-5'>
            <h2 className='text-[1rem] text-sym_gray-700'>Collection Section:</h2>
            <div className="flex flex-col gap-y-10">

                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">Collection</label>
                        <CustomDropdown
                            defaultValue='Collection 1'
                            value={selectedCollection}
                            setValue={setSelectedCollection}
                            list={['Collection 1', 'Collection 2', 'Collection 3']}
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
                    <Link to={'/admin/collections'} className='text-[0.9rem] underline text-indigo-500'>Edit collection</Link>

                </div>

            </div>
        </section>
    )
}
