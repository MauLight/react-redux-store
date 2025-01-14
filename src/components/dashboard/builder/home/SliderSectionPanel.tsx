import { useEffect, useRef, useState, type ReactNode } from 'react'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'

import CustomDropdown from '@/components/common/CustomDropdown'

interface SliderImgProps {
    id: number
    node: ReactNode
}

const initialElements = [
    {
        id: 1,
        node: <section className='relative w-full h-full'>
            <div className='absolute -right-2 -top-1 z-10 w-[20px] h-[20px] flex justify-center items-center rounded-full bg-[#10100e] hover:bg-red-500 transition-color duration-200'>
                <i className="fa-solid fa-xmark text-[#ffffff]"></i>
            </div>
            <img className='h-full w-full object-cover grayscale opacity-50' src="https://res.cloudinary.com/maulight/image/upload/v1736786410/gsdwd31smgtmacjjv3ml.png" alt="placeholder" />
        </section>
    },
    {
        id: 2,
        node: <section className='relative w-full h-full'>
            <div className='absolute -right-2 -top-1 z-10 w-[20px] h-[20px] flex justify-center items-center rounded-full bg-[#10100e] hover:bg-red-500 transition-color duration-200'>
                <i className="fa-solid fa-xmark text-[#ffffff]"></i>
            </div>
            <img className='h-full w-full object-cover grayscale opacity-50' src="https://res.cloudinary.com/maulight/image/upload/v1736786410/gsdwd31smgtmacjjv3ml.png" alt="placeholder" />
        </section>
    },
    {
        id: 3,
        node: <section className='relative w-full h-full'>
            <div className='absolute -right-2 -top-1 z-10 w-[20px] h-[20px] flex justify-center items-center rounded-full bg-[#10100e] hover:bg-red-500 transition-color duration-200'>
                <i className="fa-solid fa-xmark text-[#ffffff]"></i>
            </div>
            <img className='h-full w-full object-cover grayscale opacity-50' src="https://res.cloudinary.com/maulight/image/upload/v1736786410/gsdwd31smgtmacjjv3ml.png" alt="placeholder" />
        </section>
    },
    {
        id: 4,
        node: <section className='relative w-full h-full'>
            <div className='absolute -right-2 -top-1 z-10 w-[20px] h-[20px] flex justify-center items-center rounded-full bg-[#10100e] hover:bg-red-500 transition-color duration-200'>
                <i className="fa-solid fa-xmark text-[#ffffff]"></i>
            </div>
            <img className='h-full w-full object-cover grayscale opacity-50' src="https://res.cloudinary.com/maulight/image/upload/v1736786410/gsdwd31smgtmacjjv3ml.png" alt="placeholder" />
        </section>
    },
]

function BuilderCard({ card, onDrop }: { card: { id: number, node: ReactNode }, onDrop: (source: number, target: number) => void }) {
    const { id, node } = card
    const [dragging, setDragging] = useState<boolean>(false)
    const [_isDraggedOver, setIsDraggedOver] = useState<boolean>(false)
    const cardRef = useRef(null)

    useEffect(() => {
        const element = cardRef.current
        if (!element) return

        const cleanup: CleanupFn = combine(
            draggable({
                element,
                getInitialData() { return card },
                onDragStart: () => setDragging(true),
                onDrop: () => setDragging(false),
            }),
            dropTargetForElements({
                element,
                getData() { return card },
                onDragEnter: () => setIsDraggedOver(true),
                onDragLeave: () => setIsDraggedOver(false),
                onDrop: ({ source, self }) => {
                    onDrop(source.data.id as number, self.data.id as number)
                    setIsDraggedOver(false)
                }
            })
        )

        return cleanup
    }, [])

    return (
        <li ref={cardRef} className={`group relative w-[120px] h-[120px] flex justify-start items-center border border-sym_gray-400 rounded-[5px] cursor-grab active:cursor-grabbing ${dragging ? 'bg-indigo-500 opacity-50' : 'bg-[#ffffff]'}`} data-test-id={id} >
            {node}
            <div className={`absolute hidden group-hover:flex  bg-indigo-500 opacity-20 transition-all duration-200 w-full h-full`}></div>
        </li>
    )
}

function SliderSectionPanel(): ReactNode {
    const [selectedCollection, setSelectedCollection] = useState<string>('')
    const [selectedSorting, setSelectedSorting] = useState<string>('')

    //const [sliderList, setSliderList] = useState<Array<string>>([])

    const [sliderImgs, setSliderImgs] = useState<SliderImgProps[]>(initialElements)

    function handleDropElement(source: number, target: number) {

        const sourceIndex = sliderImgs.findIndex(sliderImg => sliderImg.id === source)
        const targetIndex = sliderImgs.findIndex(sliderImg => sliderImg.id === target)

        if (sourceIndex === -1 || targetIndex === -1) return

        const updatedSliderImgs: SliderImgProps[] = [...sliderImgs]
        const temp = updatedSliderImgs[sourceIndex]
        updatedSliderImgs[sourceIndex] = updatedSliderImgs[targetIndex]
        updatedSliderImgs[targetIndex] = temp
        setSliderImgs(updatedSliderImgs)
    }

    return (
        <section className='w-full flex flex-col gap-y-5'>
            <h2 className='text-[1rem] text-sym_gray-700'>Slider Section:</h2>
            <div className="flex flex-col gap-y-10">

                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="Saved sliders">Saved Sliders</label>
                        <CustomDropdown
                            id='Saved sliders'
                            defaultValue='Slider 1'
                            value={selectedCollection}
                            setValue={setSelectedCollection}
                            list={['Slider 1', 'Slider 2', 'Slider 3']}
                        />
                    </div>
                    {/* {errors.title && <small className="text-red-500">{errors.title.message}</small>} */}
                </div>

                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">{'Slider speed: (higher values equal faster motion)'}</label>
                        <CustomDropdown
                            defaultValue='Recommended'
                            value={selectedSorting}
                            setValue={setSelectedSorting}
                            list={['0', '1', '3', '4', '5']}
                        />
                    </div>
                    {/* {errors.title && <small className="text-red-500">{errors.title.message}</small>} */}
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className='text-[0.8rem]' htmlFor="description">Slider order:</label>
                    <ul className="w-full flex flex-wrap gap-2 p-2 border rounded-[5px] overflow-scroll">
                        <div>
                            <button className='h-[120px] w-[120px] flex flex-col justify-center items-center gap-y-2 border border-sym_gray-400 border-dashed rounded-[5px] text-[0.9rem]'>
                                <i className="fa-solid fa-cloud-arrow-up fa-xl"></i>
                                Upload image
                            </button>
                            {/* <input type='file' ref={fileInputRef} onChange={handleFileUpload} className='hidden' /> */}
                        </div>
                        {
                            sliderImgs.map((elem, i) => (
                                <BuilderCard key={`${elem.id}-${i}`} card={elem} onDrop={handleDropElement} />
                            ))
                        }
                    </ul>
                </div>

            </div>
        </section>
    )
}

export default SliderSectionPanel