import React, { Suspense } from 'react'
import { Color } from 'three'
import { Canvas, addAfterEffect } from '@react-three/fiber'
import { PresentationControls, AdaptiveEvents, AdaptiveDpr } from '@react-three/drei'
import Legos from './Models/Legos'
import Switch from './Models/Switch'
import Synth from './Models/Synth'
import Plant from './Models/Plant'
import Portrait from './Models/Portrait'
import Name from './Models/Name'
import Lights from './Lights'
import Effects from './Effects'
import { physics } from './physics'
import Interface from './Interface'

const bg = new Color('#020207')

const App = () => {
  addAfterEffect(() => {
    physics.update()
  })

  return (
    <>
      <div className='w-screen h-screen'>
        <Canvas
          shadows
          performance={{ min: 0.75 }}
          dpr={1.25}
          gl={{ alpha: false, antialias: false }}
          onCreated={({ gl }) => gl.setClearColor(bg)}
        >
          <fog attach='fog' args={[bg, 4, 15]} />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Effects />
          <PresentationControls
            snap
            global
            speed={0.8}
            zoom={1}
            rotation={[Math.PI / 3, -Math.PI / 20, 0]}
            config={{ mass: 1, tension: 100, friction: 26 }}
          >
            <Lights />

            <Suspense fallback={null}><Name /></Suspense>
            <Suspense fallback={null}><Portrait /></Suspense>
            <Suspense fallback={null}><Legos /></Suspense>
            <Suspense fallback={null}><Synth /></Suspense>
            <Suspense fallback={null}><Switch /></Suspense>
            <Suspense fallback={null}><Plant /></Suspense>
          </PresentationControls>
        </Canvas>
        <Interface />
      </div>
    </>
  )
}

export default App
