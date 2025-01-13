import { useEffect, useRef, useState, type ReactNode } from 'react'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

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

function BuilderCard({ card, onDrop }: { card: { id: number, title: string, node: ReactNode }, onDrop: (source: number, target: number) => void }) {
    const { id, title, node } = card
    const [dragging, setDragging] = useState<boolean>(false)
    const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false)
    const ref = useRef(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const cleanup: CleanupFn = combine(
            draggable({
                element,
                getInitialData() { return card },
                onDragStart: () => setDragging(true),
                onDrop: () => setDragging(false)
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
        <li ref={ref} className={`group relative w-[700px] h-[200px] flex justify-start items-center border border-sym_gray-400 rounded-[5px] cursor-grab active:cursor-grabbing ${dragging ? 'bg-indigo-500 opacity-50' : 'bg-[#ffffff]'}`} data-test-id={id} >
            <div className='z-10 absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                <p className='text-[1.5rem]'>{title}</p>
            </div>
            {node}
            <div className={`absolute hidden group-hover:flex  bg-indigo-500 opacity-20 transition-all duration-200 w-full h-full`}></div>
        </li>
    )
}

function DragAndDropList() {
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
        <ul className='w-[1000px] flex flex-col justify-center items-center gap-y-1 p-5 bg-[#ffffff] rounded-[5px]'>
            {tasks.map((task, i) => (
                <BuilderCard key={task.id + '-' + i} card={task} onDrop={handleDropElement} />
            ))}
        </ul>
    )
}

export default function Builder(): ReactNode {
    return (
        <div className='h-screen w-full flex flex-col justify-center gap-y-5 items-center'>
            <h1>Builder</h1>
            <DragAndDropList />
            <DashboardSidebar titles={['Builder', '', '']} />
        </div>
    )
}


