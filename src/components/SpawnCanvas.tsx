import { useEffect, useRef } from "react"

type Props = {
  shapeColor: string,
  bgColor: string
}

const SpawnCanvas = ({ shapeColor, bgColor }: Props) => {
  const canvasRef = useRef<any>(null)
  const canvasContext = useRef<any>(null)
  let timeStamp: number | null = null
  const animatedObjects: { ySpeed: number, xSpeed: number, x: number, y: number, rad: number }[] = []

  useEffect(() => {
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight * 0.8
    canvasContext.current = canvasRef.current.getContext('2d')
    canvasContext.current!.globalCompositeOperation = "lighten";
    createObjects()
    draw()
    update()
  }, [shapeColor, bgColor])


  const draw = () => {
    const canvas = canvasContext.current
    canvas.clearRect(0, 0, window.innerWidth, window.innerHeight)
    for (let i = 0; i < animatedObjects.length; i++) {
      canvas.beginPath();
      canvas.arc(animatedObjects[i].x, animatedObjects[i].y, animatedObjects[i].rad, 0, 2 * Math.PI, false);
      const gradient = canvas.createRadialGradient(animatedObjects[i].x, animatedObjects[i].y, 1, animatedObjects[i].x, animatedObjects[i].y, animatedObjects[i].rad * 0.8)
      gradient.addColorStop(0, shapeColor)
      gradient.addColorStop(1, 'transparent')
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
      for (let i = 0; i < 70; i++) {
        const newObject = {
          x: Math.floor(canvasContext.current.canvas.width * Math.random()),
          y: Math.floor(canvasContext.current.canvas.height * Math.random()),
          rad: window.innerHeight > window.innerWidth ? Math.round(canvasContext.current.canvas.width / 4) : Math.round(canvasContext.current.canvas.height / 3),
          xSpeed: Math.random() < 0.5 ? -1 : 1,
          ySpeed: Math.random() < 0.5 ? -1 : 1
        }
        animatedObjects.push(newObject)
      }
    }
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

export default SpawnCanvas