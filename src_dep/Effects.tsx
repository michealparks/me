import React from 'react'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { CameraShake } from '@react-three/drei'

const Effects = () => {
  return (
    <EffectComposer multisampling={8}>
      <Bloom
        intensity={0.4} // The bloom intensity.
        height={200} // render height
        luminanceThreshold={0.4} // luminance threshold. Raise this value to mask out darker elements in the scene.
        luminanceSmoothing={0.9} // smoothness of the luminance threshold. Range is [0, 1]
      />
      <Noise opacity={0.06} />
      <Vignette eskil={false} offset={0} darkness={1.3} />
      <CameraShake {...{
        maxYaw: 0.05, // Max amount camera can yaw in either direction
        maxPitch: 0.05, // Max amount camera can pitch in either direction
        maxRoll: 0.05, // Max amount camera can roll in either direction
        yawFrequency: 0.5, // Frequency of the the yaw rotation
        pitchFrequency: 0.5, // Frequency of the pitch rotation
        rollFrequency: 0.5, // Frequency of the roll rotation
        intensity: 0.5, // initial intensity of the shake
        decay: false, // should the intensity decay over time
        decayRate: 0.65, // if decay = true this is the rate at which intensity will reduce at
        additive: false, // this should be used when your scene has orbit controls
      }} />
    </EffectComposer>
  )
}

export default Effects
