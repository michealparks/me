<script>
let state = 'before'

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
      audioLoader.load( 'infinity_keyboard.wav', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.play();
      });
    }
  })

  window.AFRAME.registerComponent('grid', {
    init () {
      const { data, el } = this
  
      el.setObject3D('mesh', new THREE.GridHelper( 5e3, 5e3, 0xffffff, 0xffffff ))
    }
  })

  window.AFRAME.registerComponent('edge-box', {
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
  /**
   * We use IIFE (immediately-invoked function expression) to only allocate one
   * vector or euler and not re-create on every tick to save memory.
   */
  tick: (function () {
    var position = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();

    return function () {
      const { object3D } = this.el
      object3D.getWorldPosition(position)
      object3D.getWorldQuaternion(quaternion)
      console.log(object3D.position, object3D.rotation)
      // position and rotation now contain vector and quaternion in world space.

      object3D.position.z -= 0.05

    };
  })()
});
}

const init = () => {
  state = 'during'
  register()
}
</script>

{#if state !== "before"}
  <a-scene
    fog="type: linear; color: #222; far: 100"
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
    <a-entity edge-box />
    <a-entity grid />
    <a-entity
      edge-box="type: plane; width: 4; height: 4;"
      position="0 0 -4"
      rotation="-90 0 0"
    />
    <a-entity
      camera
      id="camera"
      position="0 1.6 0"
      rotation="0 0 0"
      rotation-reader
    />
    <a-sky color="#222"></a-sky>
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