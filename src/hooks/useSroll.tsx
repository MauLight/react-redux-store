import { useEffect, useState } from "react";


function useScroll() {
    const [yPosition, setYPosition] = useState<number>(0)

    useEffect(() => {
        const handleScroll = () => {
            setYPosition(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return yPosition
}

export default useScroll