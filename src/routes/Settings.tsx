import { memo, useEffect, useReducer, useState, type ReactNode } from 'react'
import DashboardSidebarReducer from '@/components/dashboard/DashboardSidebarReducer'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { getAllTemplatesAsync, getTemplateByIdAsync, updateCurrentTemplateAsync, updateUIConfigurationAsync } from '@/features/ui/uiSlice'

import { StoreProps } from '@/utils/types'
import { Switch } from '@/components/common/Switch'
import { Modal } from '@/components/common/Modal'
import { motion } from 'motion/react'

interface NavState {
    one: boolean
    two: boolean
    three: boolean
}

const initialState: NavState = {
    one: true,
    two: false,
    three: false
}

type NavAction =
    | { type: 'TOGGLE_ONE' }
    | { type: 'TOGGLE_TWO' }
    | { type: 'TOGGLE_THREE' }

export const navReducer = (state: NavState, action: NavAction): NavState => {
    switch (action.type) {
        case 'TOGGLE_ONE':
            return { one: true, two: false, three: false }
        case 'TOGGLE_TWO':
            return { one: false, two: true, three: false }
        case 'TOGGLE_THREE':
            return { one: false, two: false, three: true }
        default:
            return state
    }
}

function Settings(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const { id, currConfig, templates } = useSelector((state: StoreProps) => state.ui)

    const [chosenTemplate, setChosenTemplate] = useState<string | null>(null)
    const [status, setStatus] = useState<string>('')
    const [AIModal, setOpenAIModal] = useState<boolean>(false)
    const [clickedAllowAI, setClickedAllowAI] = useState<boolean>(false)
    const [clickedCompressImage, setClickedCompressImage] = useState<boolean>(false)
    const [clickedAllowInvitees, setClickedAllowInvitees] = useState<boolean>(false)

    const [navState, dispatchNav] = useReducer(navReducer, initialState)

    const handleOpenAISuggestions = () => {
        if (clickedAllowAI) {
            handleAllowAI()
            setClickedAllowAI(false)
            return
        }
        setOpenAIModal(!AIModal)
    }

    async function handleAllowAI() {

        const { payload } = await dispatch(updateUIConfigurationAsync({
            id: id as string, newConfiguration: {
                ...currConfig,
                global: {
                    ...currConfig.global,
                    allowAI: !clickedAllowAI
                }
            }
        }))

        if (payload.updatedUI) {
            setClickedAllowAI(!clickedAllowAI)
            setOpenAIModal(false)
        }

    }

    const handleClickCompressImage = async (): Promise<void> => {
        const { payload } = await dispatch(updateUIConfigurationAsync({
            id: id as string, newConfiguration: {
                ...currConfig,
                global: {
                    ...currConfig.global,
                    compress: clickedCompressImage
                }
            }
        }))

        if (payload.updatedUI) {
            setClickedCompressImage(!clickedCompressImage)
        }
    }

    const handleClickAllowInvitees = async (): Promise<void> => {
        const { payload } = await dispatch(updateUIConfigurationAsync({
            id: id as string, newConfiguration: {
                ...currConfig,
                global: {
                    ...currConfig.global,
                    invitees: !clickedAllowInvitees
                }
            }
        }))

        if (payload.updatedUI) {
            setClickedAllowInvitees(!clickedAllowInvitees)
        }
    }

    const handleChooseTemplate = async (templateId: string): Promise<void> => {
        try {
            const { payload } = await dispatch(updateCurrentTemplateAsync({
                uiId: id as string,
                templateId
            }))
            if (payload.updatedUI) {
                setChosenTemplate(templateId)
                setStatus('chosen')
                await dispatch(getTemplateByIdAsync(payload.updatedUI.currentTemplate))
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function getAllTemplates() {
            try {
                await dispatch(getAllTemplatesAsync())
            } catch (error) {
                console.log(error)
            }
        }

        if (!templates.length) {
            getAllTemplates()
        }

    }, [])

    useEffect(() => {
        if (currConfig) {
            setClickedAllowAI(currConfig.global.allowAI)
            setClickedAllowInvitees(currConfig.global.invitees)
            setClickedCompressImage(currConfig.global.compress)
        }
    }, [])

    return (

        <div className='w-full h-screen flex justify-start pl-[425px] items-start pt-[130px]'>
            <div className="w-[1100px] flex flex-col gap-y-10 rounded-[10px] bg-[#ffffff] p-10">
                {
                    navState.one && (
                        <div className="w-full h-full flex flex-col gap-y-10">
                            <h1 className='text-[1rem] sm:text-[1.2rem] text-balance leading-tight'>
                                Choose a UI Template:
                            </h1>
                            <div className="grid grid-cols-3 gap-5">
                                {
                                    templates.map((temp) => (
                                        <motion.div

                                            className='relative'
                                            animate={status}
                                            key={temp.id}
                                        >
                                            {
                                                chosenTemplate === temp.id && (
                                                    <motion.div
                                                        initial={{ scale: 1 }}
                                                        variants={{
                                                            chosen: {
                                                                scale: 1.05
                                                            },
                                                            hover: {
                                                                scale: 1
                                                            }
                                                        }}
                                                        transition={{
                                                            duration: 0.2,

                                                            type: 'tween',
                                                            ease: 'circOut'
                                                        }}
                                                        className="absolute inset-0 bg-indigo-500 rounded-[10px]">
                                                    </motion.div>
                                                )
                                            }

                                            <motion.button
                                                initial={{ scale: 1 }}
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ duration: 0.5 }}
                                                onClick={() => { handleChooseTemplate(temp.id) }}
                                                className='group flex flex-col justify-center items-center gap-y-1 rounded-[10px] overflow-hidden'>
                                                <div className={`relative w-full h-[380px] rounded-[10px] overflow-hidden `}>
                                                    <img className={`h-full object-cover group-hover:scale-105 transition-all duration-200`} src={temp.preview} alt="layout" />
                                                </div>
                                                <p className={`capitalize z-10 ${chosenTemplate === temp.id ? 'text-[#fff]' : 'group-hover:text-indigo-500'}`}>{temp.title}</p>
                                            </motion.button>
                                        </motion.div>
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
                                    <p>Allow AI suggestions</p>
                                    <Switch clicked={clickedAllowAI} handleClick={handleOpenAISuggestions} />
                                </div>
                                <div className="flex items-center justify-between gap-x-2">
                                    <p>Compress images before upload</p>
                                    <Switch clicked={clickedCompressImage} handleClick={handleClickCompressImage} />
                                </div>
                                <div className="flex items-center justify-between gap-x-2">
                                    <p>Allow users to checkout as invitees</p>
                                    <Switch clicked={clickedAllowInvitees} handleClick={handleClickAllowInvitees} />
                                </div>
                            </div>
                            <Modal openModal={AIModal} handleOpenModal={handleOpenAISuggestions}>
                                <>
                                    <p className='text-balance'>Turning AI Suggestions on may incurr in <b>additional fees</b> once the free quota for the service is reached, are you sure you want to continue?</p>
                                    <div className="w-full flex justify-end gap-x-2 mt-10">
                                        <button onClick={handleOpenAISuggestions} className='w-[120px] h-10 bg-[#10100e] hover:bg-red-500 active:bg-[#10100e] transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                            <i className="fa-solid fa-ban"></i>
                                            Cancel
                                        </button>
                                        <button onClick={handleAllowAI} className='w-[120px] h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                            <i className="fa-solid fa-floppy-disk"></i>
                                            Confirm
                                        </button>

                                    </div>
                                </>
                            </Modal>
                        </div>
                    )
                }
            </div>
            <DashboardSidebarReducer state={navState} dispatcher={dispatchNav} titles={['UI Settings', 'Global Settings']} />
        </div>
    )
}

export default memo(Settings)
