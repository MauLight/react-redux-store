import { useEffect, useState } from 'react'
import random from 'canvas-sketch-util/random'

export default function SymetriaLogo(): JSX.Element {

    const [width] = useState<number>(720)
    const [height] = useState<number>(480)

    useEffect(() => {

        const typeCanvas = document.createElement('canvas')
        const typeContext = typeCanvas.getContext('2d') as CanvasRenderingContext2D

        const cell = 10
        const cols = Math.floor(width / cell)
        const rows = Math.floor(height / cell)
        const numCells = cols * rows

        typeCanvas.width = cols * 2
        typeCanvas.height = rows * 2

        const canvas = document.getElementById('canvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        const render = () => {
            typeContext.clearRect(0, 0, width, height)
            typeContext.fillStyle = '#10100e'
            typeContext.fillRect(0, 0, cols, rows)

            const fontSize = cols - 16

            typeContext.fillStyle = '#fff'
            typeContext.font = `${fontSize}px CodeNext-SemiBold`
            typeContext.textBaseline = 'top'
            //typeContext.textAlign = 'center'

            const text = '<|>'
            const metrics = typeContext.measureText(text)

            function getGlyph(value: number): string {
                if (value < 50) return ''
                if (value < 100) return '.'
                if (value < 150) return '-'
                if (value < 200) return '+'

                const glyphs = '_= /'.split('')

                return random.pick(glyphs)
            }

            const mx = metrics.actualBoundingBoxLeft * -1
            const my = metrics.actualBoundingBoxAscent * -1
            const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
            const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

            const tx = (cols - mw) * 0.5 - mx
            const ty = (rows - mh) * 0.5 - my

            typeContext.save()
            typeContext.translate(tx, ty)

            typeContext.beginPath()
            typeContext.rect(mx, my, mw, mh)
            typeContext.strokeStyle = '#fff'
            typeContext.stroke()

            typeContext.fillText(text, 0, 0)
            typeContext.restore()

            const typeData = typeContext.getImageData(0, 0, cols, rows).data
            //ctx.drawImage(typeCanvas, 0, 0)

            ctx.fillRect(0, 0, width, height)
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'

            for (let i = 0; i < numCells; i++) {
                const col = i % cols
                const row = Math.floor(i / cols)

                const x = col * cell
                const y = row * cell

                const r = typeData[i * 4 + 0]
                const g = typeData[i * 4 + 1]
                const b = typeData[i * 4 + 2]
                const a = typeData[i * 4 + 3]

                const glyph = getGlyph(r)

                ctx.font = `${cell * 2}px CodeNext-SemiBold`
                if (Math.random() < 0.1) ctx.font = `${cell * 6}px CodeNext-SemiBold`

                ctx.fillStyle = `rgb(${r} ${g} ${b}/${a})`

                ctx.save()
                ctx.translate(x, y)
                ctx.translate(cell * 0.5, cell * 0.5)
                ctx.fillText(glyph, 0, 0)
                ctx.restore()
            }


        }

        // const loop = () => {
        //     render()
        //     requestAnimationFrame(loop)
        // }
        render()
        return () => typeContext.clearRect(0, 0, width, height)
    })

    return (
        <div className='flex justify-end items-center z-20 border border-white'>
            <canvas width={width} height={height} id='canvas'></canvas>
        </div>
    )
}
