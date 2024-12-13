import { postProductsAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { useState, type ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { toast } from 'react-toastify'

export default function Dashboard(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const [data, setData] = useState<string>('')

    function handleSubmitJSON(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault()
        //const products: string = JSON.stringify(data)


        if (/^[\],:{}\s]*$/.test(data.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            const response = dispatch(postProductsAsync({ products: data }))
            toast.success('JSON posted succesfully.')
        } else {
            toast.error('This is not a valid JSON.')
            return
        }
    }

    return (
        <section className='w-screen h-screen flex justify-center items-center py-10'>
            <form onSubmit={handleSubmitJSON} className="w-[50rem] min-h-[20rem] h-[700px] flex flex-col gap-y-5 bg-[#ffffff] pt-5 pb-2 px-5 rounded-[10px] overflow-y-scroll">
                <h1>Add you JSON file here:</h1>
                <CodeMirror className='w-full h-[500px] border rounded-[10px] p-2 outline-0 bg-[#282c34] overflow-y-scroll' value={data} theme='dark' extensions={[javascript({ jsx: true })]} onChange={(value) => setData(value)} />
                <button type='submit' className='h-10 bg-[#10100e] text-[#ffffff]'>Submit</button>
            </form>
        </section>
    )
}
