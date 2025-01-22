import { Fragment, type ReactElement } from 'react'
import { Transition, TransitionChild, Dialog, DialogPanel } from '@headlessui/react'

interface ModalProps {
  children: ReactElement
  openModal: boolean
  handleOpenModal: () => void
  width?: string
  height?: string
}

export const Modal = ({ width, height, children, openModal, handleOpenModal }: ModalProps): ReactElement => {
  return (
    <Transition appear show={openModal} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleOpenModal}>
        <TransitionChild
          as='div'
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 glass" />
          <div className="fixed inset-0 bg-[#10100e] opacity-90 " />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex lg:min-h-full py-10 w-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className={`${width ? width : 'w-1/2'} ${height ? height : ''} flex flex-col py-10 px-5 border border-gray-200 rounded-xl bg-[#ffffff] overflow-hidden`}>
                {
                  children
                }
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
