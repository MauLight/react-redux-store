import { useState, type ReactNode } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { postProductsAsync } from '@/features/products/productsSlice'

import { toast } from 'react-toastify'

export default function ProductsByJSON(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const [data, setData] = useState<string>('')

    async function handleSubmitJSON(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault()

        if (/^[\],:{}\s]*$/.test(data.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            const { payload } = await dispatch(postProductsAsync({ products: data }))
            if (payload) {
                toast.success(payload.message)
                setData('')
            } else {
                toast.error('There was an error with your request.')
            }
        } else {
            toast.error('This is not a valid JSON.')
            return
        }
    }

    return (
        <form onSubmit={handleSubmitJSON} className="col-span-1 h-[700px] flex flex-col gap-y-5 bg-[#ffffff] py-10 px-4 md:px-10 overflow-y-scroll rounded-[10px] border border-gray-200">
            <h1 className='text-[1rem] sm:text-[1.2rem] text-balance leading-tight'>Add JSON file here:</h1>
            <CodeMirror className='w-full h-[500px] border rounded-[10px] p-2 outline-0 bg-[#282c34] overflow-y-scroll' value={data} theme='dark' extensions={[javascript({ jsx: true })]} onChange={(value) => setData(value)} />
            <div className="flex justify-end">
                <button type="submit" className='w-[150px] h-10 bg-[#10100e] text-[#ffffff] mt-2 rounded-[10px]'>Submit</button>
            </div>
        </form>
    )
}
