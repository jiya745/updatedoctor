import React from 'react'
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Experience } from "../components/Experience";

const DoctorClinic = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Loader/>
      <Canvas shadows camera={{ position: [-100, -10, 40], fov: 42 }} gl={{ preserveDrawingBuffer: true }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
    </div>
  )
}

export default DoctorClinic