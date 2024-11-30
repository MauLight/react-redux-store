import { ReactNode, type ReactElement } from 'react'

export const Banner = ({ children }: { children: ReactNode }): ReactElement => {

  return (
    <div className="relative w-full h-full min-h-[900px] flex flex-col items-center overflow-hidden">
      {
        children
      }
    </div>
  )
}