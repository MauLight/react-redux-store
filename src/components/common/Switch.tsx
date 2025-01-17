import { type ReactElement } from 'react'

export const Switch = ({ clicked, handleClick }: { clicked: boolean, handleClick: () => void }): ReactElement => {
  return (
    <div onClick={handleClick} className={`relative w-[50px] h-6 flex ${clicked ? 'pl-[27px] bg-indigo-500' : 'pr-[28px] bg-[#10100e]'} items-center px-[1px] border rounded-full transition-all duration-200 cursor-pointer`}>
      <div className="w-[20px] h-[20px] bg-[#ffffff] rounded-full"></div>
    </div>
  )
}
