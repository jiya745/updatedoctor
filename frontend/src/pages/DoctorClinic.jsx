import React, { useState, useRef, useEffect } from 'react'
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Experience } from "../components/Experience";

const DoctorClinic = () => {
  const [message, setMessage] = useState([]);
  const [started,setStarted] = useState(false);

  const transcriptionRef = useRef(null);

  useEffect(() => {
    if (transcriptionRef.current) {
      transcriptionRef.current.scrollTop = transcriptionRef.current.scrollHeight;
    }
  }, [message]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className='bg-black/70 backdrop-blur-md absolute top-0 left-0 bottom-0 w-[25rem] z-50 shadow-2xl border-r border-white/10'>
        <div className='bg-gradient-to-r from-blue-600/80 to-purple-600/80 p-4 border-b border-white/10'>
          <div className='flex items-center justify-between'>
            <h2 className='text-white text-xl font-semibold tracking-wide'>Medical Consultation</h2>
            {
              started && 
              <a href='/?feedback=1' className='py-2 px-4 rounded-md text-white bg-red-500 cursor-pointer'>End Session</a>
            }
          </div>
          <p className='text-white/70 text-sm mt-1'>{new Date().toLocaleDateString()}</p>
        </div>
        <div 
          ref={transcriptionRef}
          className='overflow-y-auto h-[calc(100vh-8rem)] px-6 py-4'
        >
          {message.map((msg, index) => (
            <div 
              key={index} 
              className='mb-6 group hover:bg-white/5 transition-all duration-300 rounded-lg p-3'
            >
              <div className='flex items-center mb-2'>
                <span className={`text-sm font-medium ${
                  msg.role === "Doctor" ? "text-blue-400" : "text-purple-400"
                }`}>
                  {msg.role === "Doctor" ? "Health Sphere" : "Patient"}
                </span>
                <span className='text-white/40 text-xs ml-2'>
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <p className='text-white/90 leading-relaxed'>{msg.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Loader/>
      <Canvas shadows camera={{ position: [-100, -10, 40], fov: 42 }} gl={{ preserveDrawingBuffer: true }}>
        <color attach="background" args={["#ececec"]} />
        <Experience setMessage={setMessage} setStarted={setStarted}/>
      </Canvas>
    </div>
  )
}

export default DoctorClinic