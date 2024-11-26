import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Sky, AdaptiveEvents, useTexture } from '@react-three/drei'

const Background = props => {

    const {gl} = useThree();
  
    const texture = useTexture('/universe3.jpg')
    const formatted = new THREE.WebGLCubeRenderTarget(texture.image.height).fromEquirectangularTexture(gl, texture)
    return(
      <primitive attach="background" object={formatted.texture} />
    )
  }

  const Box=()=>{
  const texture = useTexture('/earthTexture.jpg')
  useFrame(()=>{

  })
    return(
        <mesh>
        <boxGeometry/>
        <meshStandardMaterial map={texture}/>
      </mesh>
    )
  }
  const Sphere=()=>{
    const ref= useRef()
    useFrame(()=>{
        ref.current.rotation.y += 0.01
    })
    const texture = useTexture('/earthTexture.jpg')
    return(
        <mesh ref={ref}>
        <sphereGeometry/>
        <meshStandardMaterial map={texture}/>
      </mesh>
    )
  }
export default function App() {
  const sphereTouch = useRef()
  return (
    <div style={{height: '100vh'}}>
    <Canvas resize={{scroll: false}} gl={{ preserveDrawingBuffer: true }} >
        <Background/>
      {/* Environment Setup */}
          <ambientLight intensity={0.2} name="ambientLight" color={"#ffffff"}/>
          <pointLight position={[80,80,80]} intensity={0.5} />
          <AdaptiveEvents /> 
      {/* Till Here */}
      <Sphere/>
      <OrbitControls  minDistance={3} maxDistance={50}/>
    </Canvas>
    </div>
  )
}

// */}
//       {/* <Sphere position={[0,0,2]} />
//       <Box position={[0,0,-4]} />
//       <Circle position={[0,0,6]}/>
//       <OrbitControls  minDistance={3} maxDistance={50}/>