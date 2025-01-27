import { Switch } from '@/components/common/Switch'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { updateUIConfigurationAsync } from '@/features/ui/uiSlice'
import { AppDispatch } from '@/store/store'
import { StoreProps } from '@/utils/types'
import { useEffect, useState, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const templates = [
    {
        id: '66dff979-33f5-4e16-ba66-811119d22698',
        title: 'Classic'
    },
    {
        id: 'fe9dacfa-44f6-4266-92b2-67ef3c8e8384',
        title: 'Modern'
    },
    {
        id: 'e39b8a75-c66d-488c-aed5-b12303153a8e',
        title: 'Technical'
    },
]

export default function Settings(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const currUI = useSelector((state: StoreProps) => state.ui.currUI)

    const [clickedCompressImage, setClickedCompressImage] = useState<boolean>(false)
    const [clickedAllowInvitees, setClickedAllowInvitees] = useState<boolean>(false)
    const [navState, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })


    const handleClickCompressImage = async (): Promise<void> => {
        setClickedCompressImage(!clickedCompressImage)
    }

    const handleClickAllowInvitees = async (): Promise<void> => {
        setClickedAllowInvitees(!clickedAllowInvitees)
    }

    const handleChooseTemplate = async (templateId: string): Promise<void> => {
        console.log(templateId)

        // await dispatch(updateUIConfigurationAsync({
        //     id: currUI.id, newConfiguration: {
        //         ...currUI,
        //         global: {
        //             ...currUI.global,
        //             ui: {
        //                 ...currUI.global.ui,
        //                 currentTemplate: templateId
        //             }
        //         }

        //     }
        // }))
    }

    useEffect(() => {

    }, [])

    return (
        <div className='w-full h-screen flex justify-start pl-[425px] items-center'>
            <div className="w-[1100px] min-h-[700px] flex flex-col gap-y-10 rounded-[10px] bg-[#ffffff] p-10">
                {
                    navState.one && (
                        <div className="w-full h-full flex flex-col gap-y-10">
                            <h1 className='text-[1rem] sm:text-[1.2rem] text-balance leading-tight'>
                                Choose a UI Template:
                            </h1>
                            <div className="grid grid-cols-3 gap-5">
                                {
                                    templates.map((temp) => (
                                        <button onClick={() => { handleChooseTemplate(temp.id) }} className='flex flex-col justify-center items-center gap-y-1' key={temp.id}>
                                            <div className='w-full h-[280px] border hover:border-indigo-500'></div>
                                            <p>{temp.title}</p>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                {
                    navState.two && (
                        <div className="w-full h-full flex flex-col gap-y-10">
                            <h1 className='text-[1rem] sm:text-[1.2rem] text-balance leading-tight'>
                                Global settings:
                            </h1>
                            <div className="w-1/2 flex flex-col gap-y-5">
                                <div className="flex items-center justify-between gap-x-2">
                                    <p>Compress images before Upload</p>
                                    <Switch clicked={clickedCompressImage} handleClick={handleClickCompressImage} />
                                </div>
                                <div className="flex items-center justify-between gap-x-2">
                                    <p>Allow users to checkout as invitees</p>
                                    <Switch clicked={clickedAllowInvitees} handleClick={handleClickAllowInvitees} />
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <DashboardSidebar state={navState} setState={setNavState} titles={['UI Settings', 'Global Settings', 'Account Settings']} />
        </div>
    )
}
