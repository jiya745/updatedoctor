import { Environment, Html, OrbitControls, useTexture, Gltf, useGLTF, useFaceControls, CameraControls, PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Room } from "./Room";
import { Doctor } from "./Doctor";

export const Experience = ({setMessage,setStarted}) => {
  const [status, setStatus] = useState("Connecting...");
  
  return (
    <>
      <CameraManager />
      <Html position={[0, 2.7, 0]}>
        <div className="status-box">
          {status}
        </div>
      </Html>
      <Doctor position={[-20, -60, 31]} scale={38} rotation={[0, -1.5, 0]} setStatus={setStatus} setMessage={setMessage} setStarted={setStarted}/>
      {/* <Room position={[0, -2, 2]} scale={1} rotation={[0, 0.24, 0]} /> */}
      {/* <Environment preset="sunset" /> */}
    </>
  );
};

const CameraManager = () => {
  const controls = useRef();



  const position = controls?.current?.getPosition();
  const zoom = controls.current?.camera.zoom;
  
  useEffect(() => {
    setInterval(() => {console.log(position, zoom);},1000)
  },[])

  return (
    <CameraControls
      ref={controls}
      minZoom={1}
      maxZoom={3}
      polarRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
      azimuthRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
      mouseButtons={{
        left: 1, //ACTION.ROTATE
        wheel: 16, //ACTION.ZOOM
      }}
      touches={{
        one: 32, //ACTION.TOUCH_ROTATE
        two: 512, //ACTION.TOUCH_ZOOM
      }}
    />
  );
};
