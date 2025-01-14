import { type ReactNode } from 'react'

function HeroSectionPanel(): ReactNode {
    return (
        <section className='w-full flex flex-col gap-y-5'>
            <h2 className='text-[1rem] text-sym_gray-700'>Hero Section:</h2>
            <div className="flex flex-col gap-y-10">

                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">Header</label>
                        <input
                            // {...register('title')}
                            type="text"
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                            placeholder='Header'
                        />
                    </div>
                    {/* {errors.title && <small className="text-red-500">{errors.title.message}</small>} */}
                </div>

                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                        <label className='text-[0.8rem]' htmlFor="description">Sub-header</label>
                        <input
                            // {...register('title')}
                            type="text"
                            className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                            placeholder='Sub-header'
                        />
                    </div>
                    {/* {errors.title && <small className="text-red-500">{errors.title.message}</small>} */}
                </div>

                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-2">
                        <label className='text-[0.8rem]' htmlFor="description">{'Image (16:9 / 1920x1080 px for best results)'}</label>
                        <button className='h-[120px] flex flex-col justify-center items-center gap-y-2 border border-sym_gray-400 border-dashed rounded-[5px]'>
                            <i className="fa-solid fa-cloud-arrow-up fa-xl"></i>
                            Upload image
                        </button>
                        {/* <input type='file' ref={fileInputRef} onChange={handleFileUpload} className='hidden' /> */}
                    </div>
                    {/* {errors.title && <small className="text-red-500">{errors.title.message}</small>} */}
                </div>

            </div>
        </section>
    )
}

export default HeroSectionPanel