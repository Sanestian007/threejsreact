import { useEffect, useRef, forwardRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import * as THREE from 'three'
import { OrbitControls, Sky, AdaptiveEvents, useTexture } from '@react-three/drei'
import { BlurPass, Resizer, KernelSize, Resolution } from 'postprocessing'

const Sun=forwardRef(({position, args, texturePath, name, planet=true}, ref)=>{

    const bodyTexture = useTexture(texturePath)
    useFrame((state, delta)=> {
        ref.current.rotation.z += 0.007
        ref.current.rotation.x += 0.007
        ref.current.rotation.y += 0.007
    } )
      return (
          <mesh
            position={position}
            ref={ref}
            scale={1}
          >
            <sphereBufferGeometry args={args} />
            <meshStandardMaterial emissiveMap={bodyTexture} map={bodyTexture} emissive={'yellow'} emissiveIntensity={2} toneMapped={true} />
          </mesh>
        )
  })

  const Earth=forwardRef(({position, args, texturePath, name, planet=true}, ref)=>{

    const earthTexture = useTexture(texturePath)
    const moonTexture = useTexture('/moonTexture.jpg')
    const moonRef = useRef()
    const dayFactor = 24 * 4
    const chnageOfAnlgle = 2*Math.PI/(20*dayFactor)
    const rotateAngle = useRef(0)
    console.log(ref, chnageOfAnlgle, "Check Earth Ref")
    useFrame(()=> {
        rotateAngle.current += chnageOfAnlgle
        if(rotateAngle.current >= 2*Math.PI){
            rotateAngle.current = 0
        }
        ref.current.position.x = 40 * Math.sin(rotateAngle.current)
        ref.current.position.z = 40 * Math.cos(rotateAngle.current)
        ref.current.rotation.y += 2 * Math.PI/dayFactor
        moonRef.current.position.x = ref.current.position.x + 2.5 * Math.sin(rotateAngle.current * 40)
        moonRef.current.position.z = ref.current.position.z + + 2.5 * Math.cos(rotateAngle.current * 40)
        moonRef.current.rotation.y += Math.PI/dayFactor
        // ref.current.rotation.x += 0.01
        // ref.current.rotation.y += 0.01
    })
    // const liveEarth
      return    <>
                    <mesh
                    position={position}
                    ref={ref}
                    scale={1}
                    >
                        <sphereBufferGeometry args={args} />
                        <meshStandardMaterial map={earthTexture}/>
                    </mesh>
                    <mesh
                    position={[position[0]+2.5, position[1], position[2]]}
                    ref={moonRef}
                    scale={1}
                    >
                        <sphereBufferGeometry args={[0.3,32,32]} />
                        <meshStandardMaterial map={moonTexture}/>
                    </mesh>
                </>
  })
  const PlanetBody=forwardRef(({position, args, texturePath, name, planet=true}, ref)=>{

    const bodyTexture = useTexture(texturePath)
    console.log(ref, "Check Sun Ref")
    useFrame(()=> {
        ref.current.rotation.y += 2 * Math.PI/(24*60)
        // ref.current.rotation.x += 0.01
        // ref.current.rotation.y += 0.01
    } )
      return <mesh
            position={position}
            ref={ref}
            scale={1}
          >
            <sphereBufferGeometry args={args} />
            <meshStandardMaterial map={bodyTexture}/>
          </mesh>
  })

const Background = props => {

    const {gl} = useThree();
  
    const texture = useTexture('/universe3.jpg')
    const formatted = new THREE.WebGLCubeRenderTarget(texture.image.height).fromEquirectangularTexture(gl, texture)
    return(
      <primitive attach="background" object={formatted.texture} />
    )
  }


const CanvasHook=()=>{
  useThree(({camera})=>{
    camera.position.set(0,80,0)
  })
  return null
}
// frameloop='demand'
export default function SolarSys() {
  const sunRef = forwardRef()
  console.log(sunRef, "Check sunRef")
  const earthRef = forwardRef()
  return (
    <div style={{height: '100vh'}}>
    <Canvas linear flat resize={{scroll: false}} gl={{ preserveDrawingBuffer: true }} >
      <CanvasHook/>
      {/* Environment Setup */}
      <ambientLight intensity={0.1} name="ambientLight" color={"#ffffff"}/>
      <Background/>
        <pointLight position={[0,0,0]} intensity={0.8} />
        <EffectComposer disableNormalPass>
          {/* <Bloom mipmapBlur luminanceThreshold={1} levels={levels} intensity={intensity * 4} /> */}
          <Bloom
              intensity={4} // The bloom intensity.
              blurPass={undefined} // A blur pass.
              kernelSize={KernelSize.LARGE} // blur kernel size
              luminanceThreshold={1} // luminance threshold. Raise this value to mask out darker elements in the scene.
              luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
              mipmapBlur={true} // Enables or disables mipmap blur.
              resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
              resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
          <ToneMapping />
      </EffectComposer>
        <AdaptiveEvents /> 
      {/* Till Here */}
      <Sun position={[10,0,0]} ref={sunRef} args={[6, 32, 32]} name={'sun'} texturePath={'/sunTexture.jpg'} planet={false}/>
      <Earth position={[-40,0,0]} ref={earthRef} texturePath={'/earthTexture.jpg'} args={[1.5, 40, 40]} name={'earth'}/>
      <OrbitControls  minDistance={3} maxDistance={1000}/>
    </Canvas>
    </div>
  )
}