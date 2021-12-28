import * as THREE from 'three'
import { Canvas, addAfterEffect } from '@react-three/fiber'
import { PresentationControls, ContactShadows, AdaptiveEvents, AdaptiveDpr } from '@react-three/drei'
import Legos from './Models/Legos'
import Switch from './Models/Switch'
import Synth from './Models/Synth'
import Plant from './Models/Plant'
import Portrait from './Models/Portrait'
import Name from './Models/Name'
import Lights from './Lights'
import Effects from './Effects'
import { physics } from './physics'
import { useEffect, useState } from 'react'
import Interface from './Interface'

const bg = new THREE.Color('#020207')

const App = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        physics.init()
      ])
      physics.setGravity(new THREE.Vector3(0, 0, 0))
      setReady(true)
    }

    init()
  }, [setReady])

  addAfterEffect(() => {
    if (ready) physics.update()
  })

  return (
    <>
      <div className='w-screen h-screen'>
        <Canvas
          shadows
          mode='concurrent'
          performance={{ min: 0.75 }}
          dpr={Math.min(1.5, window.devicePixelRatio)}
          gl={{ alpha: false, antialias: false }}
          onCreated={({ gl }) => {
            gl.setClearColor(bg)
          }}
        >
          <fog attach="fog" args={[bg, 4, 15]} />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Effects />
          <Lights />
          <PresentationControls
            snap
            global
            speed={0.8}
            zoom={1}
            rotation={[Math.PI / 3, -Math.PI / 20, 0]}
            config={{ mass: 1, tension: 100, friction: 26 }}
          >
            <Name />
            <Legos />
            <Switch />
            <Synth />
            <Plant />
            <Portrait />
          </PresentationControls>
        </Canvas>
        <Interface />
      </div>
    </>
  )
}

export default App
