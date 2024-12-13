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
            } else {
                toast.error('There was an error with your request.')
            }
        } else {
            toast.error('This is not a valid JSON.')
            return
        }
    }

    return (
        <form onSubmit={handleSubmitJSON} className="col-span-3 h-[700px] flex flex-col gap-y-5 bg-[#ffffff] py-10 px-10 overflow-y-scroll border-r border-sym_gray-400">
            <h1 className='text-[2rem] text-balance leading-tight uppercase'>Add your JSON file here:</h1>
            <CodeMirror className='w-full h-[500px] border rounded-[10px] p-2 outline-0 bg-[#282c34] overflow-y-scroll' value={data} theme='dark' extensions={[javascript({ jsx: true })]} onChange={(value) => setData(value)} />
            <button type='submit' className='h-10 bg-[#10100e] text-[#ffffff]'>Submit</button>
        </form>
    )
}
