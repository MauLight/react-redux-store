import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { animatedGradient, animatedGradientText } from '@/utils/styles'
import FadeinContainer from '@/components/common/FadeinContainer'
import SymetriaLogo from '@/components/common/SymetriaLogo'
import { Agent } from '@/utils/classes'
import { randRange } from '@/utils/functions'
import { ReactTyped } from "react-typed"
import Multistep from '@/components/landing/Multistep'
import EmailClient from '@/components/landing/EmailClient'

const childVariants = {
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', bounce: 0.2, visualDuration: 1 }
    },
    hidden: {
        y: 100,
        opacity: 0
    }
}

function Symetria() {

    const [width] = useState(1584)
    const [height] = useState(800)

    const agents: Agent[] = []

    //* Number of iterations equals number of dots on screen.
    for (let i = 0; i < 100; i++) {
        const x = randRange(0, width)
        const y = randRange(0, height)
        agents.push(new Agent(x, y))
    }

    useEffect(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        const render = () => {
            ctx.clearRect(0, 0, width, height)

            for (let i = 0; i < agents.length; i++) {
                const agent = agents[i]

                for (let j = i + 1; j < agents.length; j++) {
                    const other = agents[j]
                    const dist = agent.pos.getDistance(other.pos)

                    //* Number indicates the max distance between two points to hold a line between them.
                    if (dist > 250) continue

                    ctx.lineWidth = 1 - dist / 200
                    ctx.beginPath()
                    ctx.moveTo(agent.pos.x, agent.pos.y)
                    ctx.lineTo(other.pos.x, other.pos.y)
                    ctx.stroke()
                    ctx.strokeStyle = '#6366F1'
                }
            }

            agents.forEach(agent => {
                agent.update()
                agent.draw(ctx)
                agent.bounce(width, height)
            })
        }

        const loop = () => {
            render()
            requestAnimationFrame(loop)
        }
        loop()
        return () => ctx.clearRect(0, 0, width, height)
    })

    return (
        <main className="relative w-[1584px] h-[800px] flex flex-col bg-[#10100e]">
            <div className="w-full h-full grid grid-cols-9 z-20">
                <div></div>
                <section className="col-span-7 grid grid-cols-5 justify-center items-center gap-x-10">
                    <div></div>
                    <SymetriaLogo />
                    <div className='col-span-2'>
                        <ReactTyped className={`font-title ${animatedGradientText} text-[3.5rem] uppercase font-semibold tracking-tight`} startWhenVisible strings={['Symetria']} typeSpeed={50} />
                        <div className='flex flex-col gap-y-10 z-20'>
                            <h1 className={`text-[2rem] text-balance tracking-normal leading-8 text-sym_gray-50`}>If you can imagine it, you can make it real.</h1>
                            <div className="flex items-center gap-x-3">
                                <img src="https://res.cloudinary.com/maulight/image/upload/v1738652966/dnegritgu1jhievndntb.png" alt="react" className='w-[40px] h-[40px] object-cover' />
                                <div className='flex justify-center items-center rounded-[12px] py-2 px-5 bg-sym_gray-100 glass'>
                                    <p className={`text-[1rem] px-2 text-balance font-light leading-tight text-sym_gray-50`}>{'Define your online presence with superb design and software that delivers real results.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div></div>
            </div>

            <div className='absolute top-0 left-0 w-full h-full z-10 bg-radial from-transparent  to-[#10100e]'></div>
            <div className='absolute top-0 left-0 w-full h-full z-10 bg-radial from-transparent  to-[#10100e]'></div>
            <div className='absolute top-0 left-0 w-full h-full z-10 bg-radial from-transparent  to-[#10100e]'></div>
            <div className='z-0'>
                <canvas className='absolute top-0 right-0 z-0 opacity-60' width={width} height={height} id='animation' />
            </div>
        </main>
    )
}

export default function Landing(): ReactNode {
    return (
        <div className='w-full min-h-screen flex flex-col justify-center items-center gap-y-20 bg-sym_gray-800'>

            <Symetria />

            <div className='w-full h-[200px] flex justify-center items-start pt-10'>
                <i className="fa-solid fa-caret-down fa-2xl text-sym_gray-50 animate-pulse"></i>
            </div>

            <div className='flex flex-col gap-y-10'>
                <div className='w-full grid grid-cols-5 bg-[#10100e]'>
                    <div className="col-span-2"></div>
                    <div className="col-span-1 flex flex-col gap-y-10">
                        <h1 className='text-sym_gray-50 text-balance text-[1.5rem]'>
                            If you’re building the next version of your software, you don’t just want it to be faster and more efficient—you want it to stand out.
                        </h1>
                    </div>
                    <div className="col-span-2"></div>
                </div>
                <div className='w-full grid grid-cols-5 bg-[#10100e]'>
                    <div></div>
                    <div></div>
                    <h1 className='col-span-2 text-sym_gray-50 text-balance text-[1.5rem]'>
                        You want an experience that’s <b className={animatedGradientText}>elegant, eye-catching</b>, and <b className={animatedGradientText}>seamless</b>.
                    </h1>
                </div>

            </div>

            <div className='w-full h-[200px]'></div>

            <div className='w-[1400px]'>
                <FadeinContainer>
                    <>
                        {
                            Array.from({ length: 4 }).map((_, i) => (
                                <LandingCard key={i} />
                            ))
                        }
                    </>
                </FadeinContainer>
            </div>



            <div className='w-full h-[700px] bg-[#10100e]'></div>

            <div className="w-full min-h-screen border border-white flex flex-col justify-center items-center gap-y-10 py-10">
                <Multistep />
                <EmailClient />
            </div>
        </div>
    )
}

function LandingCard() {
    return (
        <motion.div variants={childVariants} key={1} className={`w-1/3 h-[300px] p-[2px] ${animatedGradient} rounded-[12px]`}>
            <div className='relative w-full h-full flex flex-col justify-end rounded-[10px] gap-y-10 pb-10 px-10 bg-[#10100e]'>
                <i className="fa-solid fa-eye fa-2xl text-indigo-500"></i>
                <div className='flex flex-col gap-y-1'>
                    <h1 className='text-[#ffffff] text-[2.2rem]'>Title</h1>
                    <p className='text-[#ffffff] text-[1.2rem] text-balance'>this is a longer text that is a description of the item.</p>
                </div>
                <img className='absolute top-0 left-0 w-full h-full object-cover grayscale opacity-10' src="https://res.cloudinary.com/maulight/image/upload/v1738651384/ehks0q9uamkyn4mendiw.jpg" alt="" />
            </div>

        </motion.div>
    )
}