<script>
import { onMount } from 'svelte'

let state = 'before'

onMount(() => {
 
})

const register = () => {
  if (window.AFRAME === undefined) return setTimeout(register, 100)

  window.AFRAME.registerComponent('audio', {
    init () {
      const listener = new THREE.AudioListener();
      document.querySelector('#camera').object3D.add( listener )

      // create a global audio source
      const sound = new THREE.Audio( listener );

      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load( 'infinity_keyboard.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.play();
      });
    }
  })

  window.AFRAME.registerComponent('grid', {
    schema: {
      color: { default: '#fff' },
      size: { default: 5e3 }
    },
  
    init () {
      const { data, el } = this
      const { size, color } = data

      this.grid = new THREE.GridHelper( size, size, color, color )
  
      el.setObject3D('mesh', this.grid)
    }
  })

  window.AFRAME.registerComponent('edges', {
    schema: {
      width: { default: 1, min: 0 },
      height: { default: 1, min: 0 },
      depth: { default: 1, min: 0  },
      type: { default: 'box' }
    },

    init () {
      const { data, el } = this

      let geo

      switch (data.type) {
        case 'box': 
          geo = new THREE.BoxBufferGeometry(data.width, data.height, data.depth)
          break
        case 'plane':
          geo = new THREE.PlaneBufferGeometry(data.width, data.height)
          break
      }

      this.geometry = new THREE.EdgesGeometry(geo)
      this.material = new THREE.LineBasicMaterial({ color: 0xffffff })
      this.mesh = new THREE.LineSegments(this.geometry, this.material, { color: 0xffffff })

      el.setObject3D('mesh', this.mesh)
    }
  })

  AFRAME.registerComponent('rotation-reader', {
    init () {
      this.car = document.querySelector('#car').object3D
      this.sun = document.querySelector('#sun').object3D
      this.sky = document.querySelector('#sky').object3D
      this.mountainLeft = document.querySelector('#mountain-left').object3D
      this.mountainRight = document.querySelector('#mountain-right').object3D

      console.log(this.mountainLeft)
    },

    tick () {
      const { object3D } = this.el

      object3D.position.z -= 0.1
      this.car.position.z = object3D.position.z - 7
      this.sun.position.z = object3D.position.z - 400
      this.mountainLeft.position.z = object3D.position.z - 350
      this.mountainRight.position.z = object3D.position.z - 350
      this.sky.position.z = object3D.position.z
    }
  })

  AFRAME.registerComponent('toon', {
    schema: {
      color: { default: '' }
    },

    init () {
      console.log(this.data.color)
      this.material = new THREE.MeshToonMaterial({ color: this.data.color })
      this.el.object3D.children[0].material = this.material
    },
  })

  AFRAME.registerComponent('gradient-material', {
    init () {
      this.material = this.el.object3D.children[0].material = new THREE.ShaderMaterial({
        uniforms: {
          topColor: { value: new THREE.Color(0x000) },
          bottomColor: { value: new THREE.Color(0x5C6BC0) },
          offset: { value: 33 },
          exponent: { value: 0.6 }
        },
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        side: THREE.BackSide
      });
    },

    update () {
      // Update `this.material`.
    },

    vertexShader: `
      varying vec3 vWorldPosition;

			void main() {

				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
				vWorldPosition = worldPosition.xyz;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
    `,
    fragmentShader: `
      uniform vec3 topColor;
			uniform vec3 bottomColor;
			uniform float offset;
			uniform float exponent;

			varying vec3 vWorldPosition;

			void main() {

				float h = normalize( vWorldPosition + offset ).y;
				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

			}
    `,
  });
}

const init = () => {
  state = 'during'
  register()
}
</script>

{#if state !== "before"}
  <a-scene
    light="defaultLightsEnabled: false"
    vr-mode-ui="enabled: false"
    device-orientation-permission-ui="enabled: false"
    renderer="
      antialias: true;
      foveationLevel: 2;
      maxCanvasWidth: 3840;
      maxCanvasHeight: 2160;
    "
  >
    <a-entity audio />
    <a-entity
      camera
      id="camera"
      position="-5 3 0"
      rotation="0 -15 0"
      rotation-reader
    />

    <a-entity light="type: hemisphere; color: #fff" position="0.6 1 0.6"></a-entity>
    <a-entity light="type: directional; color: #FFF; intensity: 0.6" position="-30 50 50"></a-entity>

    <a-entity id="ground" grid="color: #AB47BC;" />
    <a-plane position="0 -1 0" rotation="-90 0 0" width="5e3" height="5e3" color="#222"></a-plane>

    <a-entity
      id="car"
      gltf-model="BasicCar.glb"
      rotation="0 180 0"
    />

    <a-entity
      id="mountain-left"
      gltf-model="LowPolyTerrain1.glb"
      scale="3 5 3"
      position="-90 -1 -350"
    />

    <a-entity
      id="mountain-right"
      gltf-model="LowPolyTerrain1.glb"
      scale="3 5 3"
      position="90 -1 -350"
    />

    <a-sphere id="sun" toon="color: #FF5722;" radius="50" position="0 5 -400"></a-sphere>

    <a-sky id="sky" gradient-material segments-height="10" segments-width="10"></a-sky>
  </a-scene>
{/if}

<button on:click={init}>
  Enough with the yammering! Let me ride off into the sunset already!
</button>

<style>
  button {
    color: white;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 10px;
    margin: 10px 0;
    background: var(--lighting-shadow-bg);
    box-shadow: var(--lighting-shadow);
    cursor: pointer;
  }
</style>