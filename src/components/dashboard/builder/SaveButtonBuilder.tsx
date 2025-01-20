import { type ReactNode } from 'react'

export default function SaveButtonBuilder({ handleSaveConfiguration }: { handleSaveConfiguration: () => Promise<void> }): ReactNode {
    return (
        <div className="w-full flex justify-start gap-x-2">
            <button className='w-[120px] h-10 bg-[#10100e] hover:bg-sym_gray-700 active:bg-[#10100e] transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                <i className="fa-regular fa-eye"></i>
                Preview
            </button>
            <button onClick={handleSaveConfiguration} className='w-[120px] h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                <i className="fa-solid fa-floppy-disk"></i>
                Save
            </button>
        </div>
    )
}
