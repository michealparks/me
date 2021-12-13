/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Lego1: THREE.Mesh
    Lego2: THREE.Mesh
    Lego3: THREE.Mesh
    Lego4: THREE.Mesh
    Lego5: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
    ['Material.001']: THREE.MeshStandardMaterial
    ['Material.002']: THREE.MeshStandardMaterial
    ['Material.003']: THREE.MeshStandardMaterial
    ['Material.004']: THREE.MeshStandardMaterial
  }
}

export default function Model({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/lego.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        name="Lego1"
        castShadow
        receiveShadow
        geometry={nodes.Lego1.geometry}
        material={materials.Material}
        userData={{ name: 'Lego1' }}
      />
      <mesh
        name="Lego2"
        castShadow
        receiveShadow
        geometry={nodes.Lego2.geometry}
        material={materials['Material.001']}
        userData={{ name: 'Lego2' }}
      />
      <mesh
        name="Lego3"
        castShadow
        receiveShadow
        geometry={nodes.Lego3.geometry}
        material={materials['Material.002']}
        userData={{ name: 'Lego3' }}
      />
      <mesh
        name="Lego4"
        castShadow
        receiveShadow
        geometry={nodes.Lego4.geometry}
        material={materials['Material.003']}
        userData={{ name: 'Lego4' }}
      />
      <mesh
        name="Lego5"
        castShadow
        receiveShadow
        geometry={nodes.Lego5.geometry}
        material={materials['Material.004']}
        userData={{ name: 'Lego5' }}
      />
    </group>
  )
}

useGLTF.preload('/lego.glb')