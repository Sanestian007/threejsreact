import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Sky, AdaptiveEvents } from '@react-three/drei'

const Sphere=(props)=> {
  const ref = useRef()
  const reverseRef = useRef(false)
  
  useFrame((state, delta) =>{
    const displacement = 0.1//delta
    if(ref.current.position.z >= 4.5){
      reverseRef.current = true
    }
    if(ref.current.position.z <= -1){
      reverseRef.current = false
    }
    if(reverseRef.current){
      let a = ref.current.position.z
      if(a - displacement < -1 )
        ref.current.position.z = -1
      else
        ref.current.position.z -= displacement
    }
    else if(ref.current.position.z < 4.5){
      let a = ref.current.position.z
      if(a + displacement > 4.5 )
        ref.current.position.z = 4.5
      else
        ref.current.position.z += displacement
    }
  })
  return (
    <mesh
      {...props}
      ref={ref}
      scale={1}
      >
      <sphereBufferGeometry args={[1.5,32,32]} />
      <meshStandardMaterial  />
    </mesh>
  )
}

const Circle=(props)=> {
  const ref = useRef()
  console.log(ref, "Check ref")
  // useFrame((state, delta) => (ref.current.rotation.x -= delta))
  return (
    <mesh
      {...props}
      ref={ref}>
      <circleGeometry args={[1.5,50]} />
      <meshStandardMaterial  side={THREE.DoubleSide}/>
    </mesh>
  )
}
const SmallSphere=(props)=> {
  const ref = useRef()
  console.log(ref, "Check ref")
  // useFrame((state, delta) => (ref.current.rotation.x -= delta))
  return (
    <mesh
      {...props}
      ref={ref}
      scale={1}>
      <sphereBufferGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial  side={THREE.DoubleSide}/>
    </mesh>
  )
}



const Box=(props)=> {
  const ref = useRef()
  // useFrame((state, delta) => (ref.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={ref}
      scale={1}>
      <boxGeometry args={[3,3,3]} />
      <meshStandardMaterial  />
    </mesh>
  )
}

const AxisHead=({x, y, z, position, color})=>{

return <mesh position={position}
        scale={1}>
        <boxGeometry args={[x, y, z]}/>
        <meshBasicMaterial color={color}/>
       </mesh>
}

const CanvasHook=()=>{
  useThree(({camera})=>{
    camera.position.set(0,-10,0)
  })
  return null
}
// frameloop='demand'
export default function App() {
  const sphereTouch = useRef()
  return (
    <div style={{height: '100vh'}}>
    <Canvas resize={{scroll: false}} gl={{ preserveDrawingBuffer: true }} >
      <CanvasHook/>
      {/* Environment Setup */}
          <ambientLight intensity={0.20} name="ambientLight" color={"#ffffff"}/>
          <pointLight position={[80,80,80]} intensity={0.5} />
          <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
          <AdaptiveEvents /> 
      {/* Till Here */}
      <Box position={[0,0,-4]} />
      <Circle position={[0,0,6]}/>
      <Sphere position={[0,0,2]} />
      {/* <AxisHead x={3} y={0.2} z={0.2} position={[1.5,0,0]} color={'green'}/>
      <AxisHead x={0.2} y={3} z={0.2} position={[0,1.5,0]} color={'blue'}/>
      <AxisHead x={0.2} y={0.2} z={3} position={[0,0,1.5]} color={'red'}/>  */}
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