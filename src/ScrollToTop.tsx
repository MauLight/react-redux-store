import React, { type ReactElement, useEffect } from 'react'
import { useLocation } from 'react-router'

const ScrollToTop = (props: { children: React.ReactNode }): ReactElement => {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return <>{props.children}</>
}

export default ScrollToTop
