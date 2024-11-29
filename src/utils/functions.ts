export const degToRad = (deg: number) => deg * Math.PI / 180
export const randRange = (min: number, max: number) => Math.random() * (max - min) + min

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const fadeIn = (direction: string, delay: number) => {
  return {
    hidden: {
      y: direction === 'top' ? 10 : direction === 'down' ? -10 : 0,
      opacity: 0,
      x: direction === 'left' ? 10 : direction === 'right' ? -10 : 0
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.5,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  }
}
