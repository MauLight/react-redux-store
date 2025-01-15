import { KeyboardEvent, useEffect, useState, type ReactNode } from 'react'


interface AddTagsComponentProps {
    tags: Array<string>
    handleDeleteTag: (tag: string) => void
    handleAddTag: (tag: string) => void
    generatedTags: Array<string>
    wasSubmitted: boolean
    handleGenerateTagsWithGemini: () => void
}

function AddTagsComponent({
    tags,
    wasSubmitted,
    handleAddTag,
    generatedTags,
    handleDeleteTag,
    handleGenerateTagsWithGemini
}: AddTagsComponentProps): ReactNode {

    const [newTag, setNewTag] = useState<string>('')
    const [suggestedTags, setSuggestedTags] = useState<string[]>([])

    function handleAddTagFromInput(e: KeyboardEvent<HTMLInputElement>): void {
        if (e.key === 'Enter' && newTag !== '') {
            handleAddTag(newTag)
            setNewTag('')
        }
    }

    function handletriggerGenerationOnFocus() {
        if (!generatedTags.length) handleGenerateTagsWithGemini()
    }

    useEffect(() => {
        if (generatedTags.length) {
            setSuggestedTags(generatedTags)
        }
    }, [generatedTags])

    useEffect(() => {
        if (wasSubmitted) {
            setSuggestedTags([])
        }
    }, [wasSubmitted])

    return (
        <section className="flex flex-col gap-y-1 mb-2">
            <div className="w-full flex items-center justify-between gap-x-2">
                <label className='text-[0.8rem]' htmlFor="tags">Tags</label>
                <div className="flex">
                    {
                        suggestedTags.length > 0 && (
                            <p className='text-[0.8rem] text-indigo-500 italic'>Suggested:</p>
                        )
                    }
                </div>
                <div className="flex flex-wrap items-center mb-1">
                    {
                        suggestedTags.length > 0 &&
                        suggestedTags.map((tag, i) => (
                            <button onClick={() => { handleAddTag(tag) }} type='button' key={tag + i} className='px-2 shrink-0 text-indigo-500 hover:text-indigo-400 text-[0.8rem] italic'>{tag}
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        ))
                    }
                </div>
            </div>
            <div className="relative">
                <div className="absolute h-full w-1/2 flex flex-wrap items-center justify-end pr-2 gap-x-2 gap-y-1 top-0 right-0">
                    {
                        tags.length > 0 && tags.map((tag, i) => (
                            <div key={tag + i} className='flex items-center justify-center text-[#ffffff] bg-indigo-500 px-1 h-5 border rounded-full border-indigo-500 text-[0.8rem]'>
                                <p className='flex items-center justify-center text-[#ffffff] bg-indigo-500 px-2 h-5 border rounded-full border-indigo-500 text-[0.8rem]'>{tag}</p>
                                <i onClick={() => { handleDeleteTag(tag) }} className="fa-solid fa-xmark text-[#ffffff] hover:text-[#10100e] active:text-[#ffffff]"></i>
                            </div>
                        ))
                    }
                </div>
                <input
                    onFocus={handletriggerGenerationOnFocus}
                    value={newTag}
                    onChange={({ target }) => { setNewTag(target.value) }}
                    onKeyDown={handleAddTagFromInput}
                    type="text"
                    className={`w-1/2 h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                    placeholder='Tags'
                />
            </div>
        </section>
    )
}

export default AddTagsComponent