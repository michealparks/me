import * as THREE from 'three'
import type { GLTF } from 'three-stdlib'
import { useEffect, useRef } from 'react'
import { useGLTF, Merged } from '@react-three/drei'
import { utils } from '../utils'
import { physics } from '../physics'
import { BODYSHAPE_BOX, BODYTYPE_DYNAMIC } from '../constants'

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh
    Cube001: THREE.Mesh
    Cube002: THREE.Mesh
    Cube003: THREE.Mesh
    Cube004: THREE.Mesh
    Cube005: THREE.Mesh
    Cube006: THREE.Mesh
    Cube007: THREE.Mesh
    Cube011: THREE.Mesh
    Cube012: THREE.Mesh
    Cube014: THREE.Mesh
    Cylinder: THREE.Mesh
    Cylinder001: THREE.Mesh
    Cylinder002: THREE.Mesh
    Cylinder003: THREE.Mesh
    BoundingBox: THREE.Mesh
  }
  materials: {
    ['Black Paint']: THREE.MeshStandardMaterial
    ['White Key']: THREE.MeshStandardMaterial
    Wood: THREE.MeshStandardMaterial
    ['Black Key']: THREE.MeshStandardMaterial
    Button: THREE.MeshStandardMaterial
  }
}

const url = new URL('../assets/glb/synth.glb', import.meta.url).href

export default function Model() {
  const { nodes, materials } = useGLTF(url) as GLTFResult
  const synthRef = useRef<THREE.Group>()

  useEffect(() => {
    const synth = synthRef.current
    const transform = new Float32Array(10)
    utils.setRandomTransform(synth, transform)
    utils.getSize(new THREE.Mesh(nodes.BoundingBox.geometry), transform)

    physics.add(synth, {
      id: synth.id,
      name: synth.name,
      type: BODYTYPE_DYNAMIC,
      shape: BODYSHAPE_BOX,
      transform,
      mass: 1,
      linearDamping: 0,
      angularDamping: 0,
      friction: 0.3,
      restitution: 0.9
    })

    utils.setRandomTorque(synth.id, 0.05)
  }, [])

  return (
    <group ref={synthRef}>
      <Merged castShadow receiveShadow meshes={[
        nodes.Cube,
        nodes.Cube001,
        nodes.Cube002,
        nodes.Cube003,
        nodes.Cube004,
        nodes.Cube005,
        nodes.Cube006,
        nodes.Cube007,
        nodes.Cube011,
        nodes.Cube012,
        nodes.Cube014,
        nodes.Cylinder,
        nodes.Cylinder001,
        nodes.Cylinder002,
        nodes.Cylinder003,
      ]}>
        {(C, C1, C2, C3, C4, C5, C6, C7, C11, C12, C14, Cylinder, Cylinder1, Cylinder2, Cylinder3) => (
          <>
            <C material={materials['Black Paint']} />
            <C1 material={materials['White Key']} />
            <C2 material={materials.Wood} />
            <C3 material={nodes.Cube003.material} />
            <C4 material={nodes.Cube004.material} />
            <C5 material={nodes.Cube005.material} />
            <C6 material={nodes.Cube006.material} />
            <C7 material={nodes.Cube007.material} />
            <C11 material={nodes.Cube011.material} />
            <C12 material={nodes.Cube011.material} />
            <C14 material={nodes.Cube014.material} />
            <Cylinder material={nodes.Cylinder.material} />
            <Cylinder1 material={nodes.Cylinder001.material} />
            <Cylinder2 material={nodes.Cylinder002.material} />
            <Cylinder3 material={nodes.Cylinder003.material} />
          </>
        )}
      </Merged>
    </group>
  )
}

useGLTF.preload(url)
