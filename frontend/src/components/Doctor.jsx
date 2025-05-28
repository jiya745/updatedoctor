import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useGraph } from '@react-three/fiber'
import { Html, useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { Listing } from '../services/listing'
import * as THREE from "three";
import { welcome } from '../../constants/welcome'

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

const morphTargetSmoothing = 0.5;
const smoothMorphTarget = true;

export function Doctor(props) {
  const [audioPlay, setAudioPlay] = useState(false);
  const [animation, setAnimation] = useState("Idle");
  const [start, setStart] = useState(false);

  const { scene } = useGLTF('/models/doctor-main.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone);

  const audioRef = useRef(null);
  const lipsyncRef = useRef([]);
  const listingRef = useRef(null);


  const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  const { animations: angryAnimation } = useFBX(
    "/animations/Angry Gesture.fbx"
  );
  const { animations: greetingAnimation } = useFBX(
    "/animations/Standing Greeting.fbx"
  );

  idleAnimation[0].name = "Idle";
  angryAnimation[0].name = "Angry";
  greetingAnimation[0].name = "Greeting";

 
  const group = useRef();
  const { actions } = useAnimations(
    [idleAnimation[0], angryAnimation[0], greetingAnimation[0]],
    group
  );







  const handlePlayAudio = async (src, data,type="ongoing") => {
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(src);
    lipsyncRef.current = data;

    audioRef.current.play().then(() => console.log("Audio played!"))
    .catch(err => console.log("Error playing audio:", err?.message || err));

    
    props.setStatus("Speaking...");

    if(type == "ongoing"){
      setAnimation("Angry");
      setTimeout(() => setAnimation("Idle"),1000);
    }else{
      setAnimation("Greeting");
      setTimeout(() => setAnimation("Idle"),4000);
    }

    audioRef.current.addEventListener("ended", () => {
      setAudioPlay(false);
      audioRef.current = null;
      lipsyncRef.current = [];
      setAnimation("Idle");
      props.setStatus("Listening...");

      Object.values(corresponding).forEach((value) => {
        if (!smoothMorphTarget) {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[value]
          ] = 0;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
          ] = 0;
        } else {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[value]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[value]
            ],
            0,
            morphTargetSmoothing
          );

          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
            ],
            0,
            morphTargetSmoothing
          );
        }
      });
    });
  };


  const handleIntrupt = async () => {
    if (audioRef.current) {
      console.log("stop")
      audioRef.current.pause();
      audioRef.current = null;
      lipsyncRef.current = [];
      setAudioPlay(false);
      props.setStatus("Listening...");

      Object.values(corresponding).forEach((value) => {
        if (!smoothMorphTarget) {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[value]
          ] = 0;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
          ] = 0;
        } else {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[value]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[value]
            ],
            0,
            morphTargetSmoothing
          );

          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
            ],
            0,
            morphTargetSmoothing
          );
        }
      });

    }
  }



  useFrame(() => {
    if (!audioRef.current) return
    const currentAudioTime = audioRef.current.currentTime;
    if (audioRef.current.paused || audioRef.current.ended) {
      // setAnimation("Idle");
      return;
    }

    Object.values(corresponding).forEach((value) => {
      if (!smoothMorphTarget) {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = 0;
      } else {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );

        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );
      }
    });

    for (let i = 0; i < lipsyncRef.current.length; i++) {
      const mouthCue = lipsyncRef.current[i];
      if (
        currentAudioTime >= mouthCue.start &&
        currentAudioTime <= mouthCue.end
      ) {
        if (!smoothMorphTarget) {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = 1;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = 1;
        } else {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
            ],
            1,
            morphTargetSmoothing
          );
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
            ],
            1,
            morphTargetSmoothing
          );
        }

        break;
      }
    }
  });




  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation]);


  // useEffect(() => {
  //   setTimeout(() => handlePlayAudio(welcome.src,welcome.data,"intial_message"),2000)
  // },[]);

  // start listing
  useEffect(() => {
    if (listingRef.current) return;
    listingRef.current = new Listing(handlePlayAudio, handleIntrupt,props.setStatus);
  }, []);




  return (
    <>
      <group {...props} dispose={null} ref={group}>
        <primitive object={nodes.Hips} />
        <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
        <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
        <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
        <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
        <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
        <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
        <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
        <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
        <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
      </group>
      {
        !start && 
        <Html position={[0, -2, 0]}>
          <button onClick={() => {setStart(true);handlePlayAudio(welcome.src,welcome.data,"intial_message")}} style={{borderRadius: "5px",background: "red",color: "white",border: "none",cursor: "pointer",padding: "8px 15px"}}>Start</button>
        </Html>
      }
    </>
  )
}

useGLTF.preload('/models/doctor-main.glb')
