/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef, useEffect } from 'react'
import { useGLTF, Merged } from '@react-three/drei'
import { utils } from '../utils'
import { physics } from '../physics'
import { BODYSHAPE_BOX, BODYTYPE_DYNAMIC } from '../constants'

type GLTFResult = {
  nodes: {
    Cube001: THREE.Mesh
    Cube001_1: THREE.Mesh
    Cube001_2: THREE.Mesh
    Right_Stick: THREE.Mesh
    Left_Stick: THREE.Mesh
    Pad: THREE.Mesh
    Body001: THREE.Mesh
    Body002: THREE.Mesh
    Body003: THREE.Mesh
    Body004: THREE.Mesh
    Screen: THREE.Mesh
    Body005: THREE.Mesh
    Body006: THREE.Mesh
    BoundingBox: THREE.Mesh
  }
  materials: {
    Body: THREE.MeshStandardMaterial
    ['Body Black']: THREE.MeshStandardMaterial
    ['Body White']: THREE.MeshStandardMaterial
    Glass: THREE.MeshPhysicalMaterial
  }
}

export default function Model() {
  const { nodes, materials } = useGLTF('/assets/glb/switch.glb') as GLTFResult
  const switchRef = useRef<THREE.Group>()

  useEffect(() => {
    const sw = switchRef.current
    const transform = new Float32Array(10)
    utils.setRandomTransform(sw, transform)
    utils.getSize(new THREE.Mesh(nodes.BoundingBox.geometry), transform)

    physics.add(sw, {
      id: sw.id,
      name: sw.name,
      type: BODYTYPE_DYNAMIC,
      shape: BODYSHAPE_BOX,
      transform,
      mass: 1,
      linearDamping: 0,
      angularDamping: 0,
      friction: 0.3,
      restitution: 0.9
    })
  }, [])

  return (
    <group ref={switchRef}>
      <Merged castShadow receiveShadow meshes={[
        nodes.Cube001,
        nodes.Cube001_1,
        nodes.Cube001_2,
        nodes.Right_Stick,
        nodes.Left_Stick,
        nodes.Pad,
        nodes.Body001,
        nodes.Body002,
        nodes.Body003,
        nodes.Body004,
        nodes.Body005,
        nodes.Body006,
        nodes.Screen,
      ]}>
        {(Node1, Node2, Node3, RightStick, LeftStick, Pad, Screen, B1, B2, B3, B4, B5, B6) => (
          <>
            <Node1 material={materials.Body} />
            <Node2 material={materials['Body Black']} />
            <Node3 material={nodes.Cube001_2.material} />
            <RightStick material={nodes.Right_Stick.material} />
            <LeftStick material={nodes.Left_Stick.material} />
            <Pad material={nodes.Pad.material} />
            <Screen material={materials.Glass} />
            <B1 material={nodes.Body001.material} />
            <B2 material={nodes.Body002.material} />
            <B3 material={nodes.Body003.material} />
            <B4 material={nodes.Body004.material} />
            <B5 material={nodes.Body005.material} />
            <B6 material={nodes.Body006.material} />
          </>
        )}
      </Merged>
    </group>
  )
}

useGLTF.preload('/assets/glb/switch.glb')