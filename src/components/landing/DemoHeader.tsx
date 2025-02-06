import { useMotionTemplate, useMotionValue, useScroll, useTransform } from "framer-motion"
import { useEffect } from "react"
import { motion } from 'framer-motion'

function clamp(number: number, min: number, max: number) {
    return Math.min(Math.max(number, min), max)
}

function useBoundedScroll(bounds: number) {
    const { scrollY } = useScroll()
    const scrollYBounded = useMotionValue(0)
    const scrollYBoundedProgress = useTransform(scrollYBounded, [0, bounds], [0, 1])

    useEffect(() => {
        return scrollY.on('change', (current) => {
            const previous = scrollY.getPrevious()
            const diff = previous ? current - previous : current
            const newScrollYBounded = scrollYBounded.get() + diff
            scrollYBounded.set(clamp(newScrollYBounded, 0, bounds))
        })
    }, [bounds, scrollY, scrollYBounded])

    return { scrollYBounded, scrollYBoundedProgress }
}

export default function DemoHeader() {

    const { scrollYBoundedProgress } = useBoundedScroll(180)
    const height = useTransform(scrollYBoundedProgress, [0, 1], [120, 60])
    const opacity = useTransform(scrollYBoundedProgress, [0, 1], [1, 0])
    const scale = useTransform(scrollYBoundedProgress, [0, 1], [1, 0.9])
    const blurBg = useTransform(scrollYBoundedProgress, [0, 1], [1, 0.1])

    return (
        <main className="mx-auto relative flex w-full max-w-3xl flex-1 overflow-hidden text-slate-600 bg-[#fff] rounded-[12px]">
            <section className="z-0 flex-1 h-screen overflow-y-scroll">
                <motion.header
                    style={{
                        height,
                        backgroundColor: useMotionTemplate`rgb(255 255 255/${blurBg})`
                    }}
                    className="absolute top-0 inset-x-0 flex h-20 border-b border-gray-300 backdrop-blur-md">
                    <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-8">
                        <motion.p
                            style={{ scale }}
                            className="flex origin-left items-center text-xl font-semibold uppercase">
                            <span className="-ml-1.5 inline-block -rotate-90 text-[10px] leading-[0]">
                                The
                            </span>
                            <span className="-ml-1 text-2xl tracking-[-.075em]">
                                Daily Bugle
                            </span>
                        </motion.p>
                        <motion.nav style={{ opacity }} className="flex space-x-4 text-xs font-medium text-slate-400">
                            <a href="#">News</a>
                            <a href="#">Sports</a>
                            <a href="#">Culture</a>
                        </motion.nav>
                    </div>
                </motion.header>

                <main className="px-8 pt-28">
                    <h1 className="h-10 w-4/5 rounded bg-slate-200 text-2xl font-bold" />
                    <div className="mt-8 space-y-6">
                        {[...Array(2).keys()].map((i) => (
                            <div key={i} className="space-y-2 text-sm">
                                <p className="h-4 w-5/6 rounded bg-slate-200" />
                                <p className="h-4 rounded bg-slate-200" />
                                <p className="h-4 w-4/6 rounded bg-slate-200" />
                            </div>
                        ))}
                        <div className="h-64 rounded bg-slate-200"></div>
                        {[...Array(90).keys()].map((i) => (
                            <div key={i} className="space-y-2 text-sm">
                                <p className="h-4 w-5/6 rounded bg-slate-200" />
                                <p className="h-4 rounded bg-slate-200" />
                                <p className="h-4 w-4/6 rounded bg-slate-200" />
                            </div>
                        ))}
                    </div>
                </main>
            </section>
        </main>
    )
}