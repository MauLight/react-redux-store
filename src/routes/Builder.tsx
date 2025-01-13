import { useEffect, useRef, useState, type ReactNode } from 'react'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'


const initialElements = [
    {
        id: 1,
        title: 'Hero Section',
    },
    {
        id: 2,
        title: 'Slider Section',
    },
    {
        id: 3,
        title: 'Collection Section',
    },
    {
        id: 4,
        title: 'Products Section',
    },
]

function BuilderCard({ card, onDrop }: { card: { id: number, title: string }, onDrop: (source: number, target: number) => void }) {
    const { id, title } = card
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
        <li ref={ref} className={`w-[400px] h-[80px] flex justify-start items-center px-5 border border-indigo-500 rounded-[5px] cursor-grab active:cursor-grabbing ${dragging ? 'bg-indigo-500 opacity-50' : 'bg-[#ffffff]'}`} data-test-id={id} >
            <p>{title}</p>
        </li>
    )
}

function DragAndDropList() {
    const [tasks, setTasks] = useState<{ id: number; title: string }[]>(initialElements)

    function handleDropElement(source: number, target: number) {
        const sourceIndex = tasks.findIndex(task => task.id === source)
        const targetIndex = tasks.findIndex(task => task.id === target)

        if (sourceIndex === -1 || targetIndex === -1) return

        const updatedTasks: { id: number; title: string }[] = [...tasks]
        const temp = updatedTasks[sourceIndex]
        updatedTasks[sourceIndex] = updatedTasks[targetIndex]
        updatedTasks[targetIndex] = temp
        setTasks(updatedTasks)
    }

    return (
        <ul className='w-full flex flex-col justify-center items-center gap-y-1'>
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
        </div>
    )
}


