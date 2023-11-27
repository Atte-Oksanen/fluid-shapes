import { useEffect, useRef } from "react"

type Props = {
  shapeColor: string,
  bgColor: string
}

const Canvas = ({ shapeColor, bgColor }: Props) => {
  const canvasRef = useRef<any>(null)
  const canvasContext = useRef<any>(null)
  const noiseRef = useRef<any>(null)
  const animatedObjects: { ySpeed: number, xSpeed: number, x: number, y: number, rad: number }[] = []

  useEffect(() => {
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight / 2
    canvasContext.current = canvasRef.current.getContext('2d')
    canvasContext.current!.globalCompositeOperation = "lighter";
    createObjects()
    animate()
  }, [])

  useEffect(() => {
    const canvas = noiseRef.current
    const x = 0;
    const y = 0;
    const width = canvas.width;
    const height = canvas.height;
    const alpha = 15;
    const g = canvas.getContext("2d", { willReadFrequently: true }),
      imageData = g.createImageData(width, height),
      pixels = imageData.data,
      n = pixels.length
    let i = 0;
    while (i < n) {
      const rand = (Math.random() * 256)
      pixels[i++] = rand;
      pixels[i++] = rand;
      pixels[i++] = rand;
      pixels[i++] = alpha;
    }
    g.putImageData(imageData, x, y);

  }, [])

  const draw = () => {
    const canvas = canvasContext.current
    canvas.clearRect(0, 0, window.innerWidth, window.innerHeight)
    for (let i = 0; i < animatedObjects.length; i++) {
      canvas.beginPath();
      canvas.arc(animatedObjects[i].x, animatedObjects[i].y, animatedObjects[i].rad, 0, 2 * Math.PI, false);
      const gradient = canvas.createRadialGradient(animatedObjects[i].x, animatedObjects[i].y, 1, animatedObjects[i].x, animatedObjects[i].y, animatedObjects[i].rad)
      gradient.addColorStop(0, shapeColor)
      gradient.addColorStop(1, 'transparent')
      canvas.shadowColor = shapeColor
      canvas.shadowBlur = animatedObjects[i].rad
      canvas.fillStyle = gradient
      canvas.closePath();
      canvas.fill();
    }
  }

  const update = () => {
    for (let i = 0; i < animatedObjects.length; i++) {
      animatedObjects[i].x += animatedObjects[i].xSpeed
      animatedObjects[i].y += animatedObjects[i].ySpeed
      if (animatedObjects[i].x >= canvasContext.current.canvas.width || animatedObjects[i].x <= 0) {
        animatedObjects[i].xSpeed = -animatedObjects[i].xSpeed
      }
      if (animatedObjects[i].y >= canvasContext.current.canvas.height || animatedObjects[i].y <= 0) {
        animatedObjects[i].ySpeed = -animatedObjects[i].ySpeed
      }
    }
  }

  const animate = () => {
    draw()
    update()
    requestAnimationFrame(animate)
  }

  const createObjects = () => {
    for (let i = 0; i < 15; i++) {
      const newObject = {
        x: canvasContext.current.canvas.width * Math.random(),
        y: canvasContext.current.canvas.height * Math.random(),
        rad: window.innerHeight > window.innerWidth ? Math.round(canvasContext.current.canvas.width / 4) : Math.round(canvasContext.current.canvas.height / 3),
        xSpeed: 1 * (Math.random() - 0.5) * 2,
        ySpeed: 1 * (Math.random() - 0.5) * 2
      }
      animatedObjects.push(newObject)
    }
  }


  return (
    <div style={{ display: "grid", gridTemplateColumns: '1fr', gridTemplateRows: '1fr', width: '100%', height: '100%', overflow: 'hidden' }}>
      <canvas style={{ background: bgColor, gridArea: '1/1/2/2' }} ref={canvasRef} ></canvas>
      <canvas height={window.innerHeight / 2} width={window.innerWidth} ref={noiseRef} style={{ gridArea: '1/1/2/2' }} ></canvas>
    </div >
  )
}

export default Canvas