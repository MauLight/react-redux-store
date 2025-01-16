import { Dispatch, SetStateAction, useEffect, useRef, useState, type ReactNode } from 'react'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import Hamburger from 'hamburger-react'
import HeroSectionPanel from './HeroSectionPanel'
import CollectionSectionPanel from './CollectionSectionPanel'
import SliderSectionPanel from './SliderSectionPanel'
import ProductsSectionPanel from './ProductsSectionPanel'

interface TaskProps {
    id: number
    title: string
    node: ReactNode
}

function HeroSection() {
    return (
        <section className='w-full h-full'>
            <img className='h-full w-full object-cover grayscale' src="https://res.cloudinary.com/maulight/image/upload/v1736786410/gsdwd31smgtmacjjv3ml.png" alt="placeholder" />
        </section>
    )
}

function SliderSection() {
    return (
        <section className='w-full h-full'>
            <img className='h-full w-full object-cover grayscale opacity-40' src="https://res.cloudinary.com/maulight/image/upload/v1736788543/ce3wdamtrbel1rmjrnor.jpg" alt="placeholder" />
        </section>
    )
}

function CollectionSection() {
    return (
        <section className='w-full h-full'>
            <img className='h-full w-full object-cover grayscale opacity-40' src="https://res.cloudinary.com/maulight/image/upload/v1736788358/fvjmag3uqhidxgzyhcol.png" alt="placeholder" />
        </section>
    )
}

function ProductsSection() {
    return (
        <section className='w-full h-full flex flex-wrap'>
            {
                Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className='border w-1/4 h-1/2'>
                        <img className='w-full h-full object-cover grayscale' src="https://res.cloudinary.com/maulight/image/upload/v1736786410/gsdwd31smgtmacjjv3ml.png" alt="placeholder" />
                    </div>
                ))
            }
        </section>
    )
}

const initialElements = [
    {
        id: 1,
        node: <HeroSection />,
        title: 'Hero Section',
    },
    {
        id: 2,
        node: <SliderSection />,
        title: 'Slider Section',
    },
    {
        id: 3,
        node: <CollectionSection />,
        title: 'Collection Section',
    },
    {
        id: 4,
        node: <ProductsSection />,
        title: 'Products Section',
    },
]

function BuilderCard({ card, onDrop, setCurrPanel }: { card: { id: number, title: string, node: ReactNode }, onDrop: (source: number, target: number) => void, setCurrPanel: Dispatch<SetStateAction<number>> }) {
    const { id, title, node } = card
    const [dragging, setDragging] = useState<boolean>(false)
    const [_isDraggedOver, setIsDraggedOver] = useState<boolean>(false)
    const ref = useRef(null)

    function handleCurrPanel(panel: string) {
        switch (panel) {
            case 'Hero Section':
                setCurrPanel(1)
                break
            case 'Slider Section':
                setCurrPanel(2)
                break
            case 'Collection Section':
                setCurrPanel(3)
                break
            case 'Products Section':
                setCurrPanel(4)
                break
            default:
                setCurrPanel(1)
        }
    }

    useEffect(() => {
        const element = ref.current
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
        <li onClick={() => { handleCurrPanel(title) }} ref={ref} className={`group relative w-full h-[170px] flex justify-start items-center border border-sym_gray-400 rounded-[5px] overflow-hidden cursor-grab active:cursor-grabbing ${dragging ? 'bg-indigo-500 opacity-50' : 'bg-[#ffffff]'}`} data-test-id={id} >
            <div className='z-10 absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                <p className='text-[1.5rem]'>{title}</p>
            </div>
            {node}
            <div className={`absolute hidden group-hover:flex  bg-indigo-500 opacity-20 transition-all duration-200 w-full h-full`}></div>
        </li>
    )
}

function DragAndDropList({ setCurrPanel }: { setCurrPanel: Dispatch<SetStateAction<number>> }) {

    const [tasks, setTasks] = useState<TaskProps[]>(initialElements)

    function handleDropElement(source: number, target: number) {
        const sourceIndex = tasks.findIndex(task => task.id === source)
        const targetIndex = tasks.findIndex(task => task.id === target)

        if (sourceIndex === -1 || targetIndex === -1) return

        const updatedTasks: TaskProps[] = [...tasks]
        const temp = updatedTasks[sourceIndex]
        updatedTasks[sourceIndex] = updatedTasks[targetIndex]
        updatedTasks[targetIndex] = temp
        setTasks(updatedTasks)
    }

    return (
        <ul className='w-full col-span-4 flex flex-col gap-y-1 border p-3 rounded-[5px] shadow-xl shadow-sym-gray-50'>
            <div className='h-[30px] w-full flex justify-end items-center bg-[#10100e]'>
                <Hamburger size={10} color='#ffffff' />
            </div>
            {tasks.map((task, i) => (
                <BuilderCard key={task.id + '-' + i} card={task} onDrop={handleDropElement} setCurrPanel={setCurrPanel} />
            ))}
            <div className='h-[40px] w-full bg-[#10100e]'></div>
        </ul>
    )
}

function DragAndDropPanel({ currPanel }: { currPanel: number }) {
    return (
        <section className='col-span-3 flex flex-col items-start justify-between gap-y-5'>
            <div className='flex flex-col gap-y-10'>
                <div>
                    <h1 className='text-[1.2rem]'>Home Builder:</h1>
                    <p className='text-[0.9rem] text-sym_gray-600 text-balance'>
                        In this section you can rearrange the block components of your application. Drag and drop the components in the desired order, click to enter a specific section.
                    </p>
                </div>
                {
                    currPanel === 1 && (
                        <HeroSectionPanel />
                    )
                }
                {
                    currPanel === 2 && (
                        <SliderSectionPanel />
                    )
                }
                {
                    currPanel === 3 && (
                        <CollectionSectionPanel />
                    )
                }
                {
                    currPanel === 4 && (
                        <ProductsSectionPanel />
                    )
                }
            </div>
            <div className="w-full flex justify-start gap-x-2">
                <button className='w-[120px] h-10 bg-[#10100e] hover:bg-sym_gray-700 active:bg-[#10100e] transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                    <i className="fa-regular fa-eye"></i>
                    Preview
                </button>
                <button className='w-[120px] h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                    <i className="fa-solid fa-floppy-disk"></i>
                    Save
                </button>
            </div>
        </section>
    )
}

function HomeSection(): ReactNode {
    const [currPanel, setCurrPanel] = useState<number>(1)

    return (
        <main className='grid grid-cols-7 gap-x-5 w-[1100px] gap-y-1 py-5 px-10 bg-[#ffffff] rounded-[5px]'>
            <DragAndDropPanel currPanel={currPanel} />
            <DragAndDropList setCurrPanel={setCurrPanel} />
        </main>
    )
}

export default HomeSection
