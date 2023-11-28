import { useEffect, useRef } from "react"

type Props = {
  shapeColor: string,
  bgColor: string
}

const PlasmaCanvas = ({ shapeColor, bgColor }: Props) => {
  const canvasRef = useRef<any>(null)
  const canvasContext = useRef<any>(null)
  let timeStamp: number | null = null
  const animatedObjects: { ySpeed: number, xSpeed: number, x: number, y: number, rad: number }[] = []
  const easeInOutValues: number[] = []

  useEffect(() => {
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight * 0.8
    canvasContext.current = canvasRef.current.getContext('2d')
    canvasContext.current!.globalCompositeOperation = "lighter";
    if (easeInOutValues.length === 0) {
      for (let i = 0; i <= 1; i += 0.05) {
        easeInOutValues.push(easeInOut(i))
      }
    }
    createObjects()
    draw()
    update()
  }, [shapeColor, bgColor])


  const draw = () => {
    const canvas = canvasContext.current
    canvas.clearRect(0, 0, window.innerWidth, window.innerHeight)
    const rgb = hexToRgb(shapeColor)
    for (let i = 0; i < animatedObjects.length; i++) {
      canvas.beginPath();
      canvas.arc(animatedObjects[i].x, animatedObjects[i].y, animatedObjects[i].rad, 0, 2 * Math.PI, false);
      const gradient = canvas.createRadialGradient(animatedObjects[i].x, animatedObjects[i].y, 1, animatedObjects[i].x, animatedObjects[i].y, animatedObjects[i].rad)
      for (let i = 0; i < easeInOutValues.length - 1; i++) {
        gradient.addColorStop(i / 20, `rgba(${rgb}, ${1 - (easeInOutValues[i])})`)
      }
      canvas.fillStyle = gradient
      canvas.closePath();
      canvas.fill();
    }
  }

  const update = () => {
    for (let i = 0; i < animatedObjects.length; i++) {
      animatedObjects[i].x = Math.round(animatedObjects[i].x + animatedObjects[i].xSpeed)
      animatedObjects[i].y = Math.round(animatedObjects[i].y + animatedObjects[i].ySpeed)
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
    timeStamp = window.requestAnimationFrame(animate)
  }

  const createObjects = () => {
    if (animatedObjects.length === 0) {
      for (let i = 0; i < 30; i++) {
        const newObject = {
          x: Math.floor(canvasContext.current.canvas.width * Math.random()),
          y: Math.floor(canvasContext.current.canvas.height * Math.random()),
          rad: window.innerHeight > window.innerWidth ? Math.round(canvasContext.current.canvas.width / 4) : Math.round(canvasContext.current.canvas.height / 3),
          xSpeed: Math.round((Math.random() - 0.5) * 2),
          ySpeed: Math.round((Math.random() - 0.5) * 2)
        }
        animatedObjects.push(newObject)
      }
    }
  }

  const easeInOut = (value: number) => {
    return value < 0.5 ? 4 * Math.pow(value, 3) : (value - 1) * Math.pow((2 * value - 2), 2) + 1
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      null
  }

  const handleAnimationStop = () => {
    window.cancelAnimationFrame(timeStamp || 0)
    timeStamp = null
  }

  const handleAnimationStart = () => {
    if (timeStamp === null) {
      animate()
    }
  }


  return (
    <div>
      <h2>Plasma</h2>
      <canvas style={{ background: bgColor }} ref={canvasRef} ></canvas>
      <button onClick={() => handleAnimationStart()}>start</button>
      <button onClick={() => handleAnimationStop()}>stop</button>
    </div>
  )
}

export default PlasmaCanvas