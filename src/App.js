import './App.css';
import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import {CubeCamera, Html} from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Suspense } from 'react';
import { OrbitControls, Stars, useHelper } from "@react-three/drei";
import { CubeTextureLoader, RGBFormat, sRGBEncoding } from 'three';
import { WebGLCubeRenderTarget, DirectionalLightHelper } from 'three';

const Model = () => {
  const gltf = useLoader(GLTFLoader,'/periodic_logo5.glb')
  // const cubeRenderTarget = new WebGLCubeRenderTarget(4096)
  // const cubeCamera = new CubeCamera(1, 1000, cubeRenderTarget);
  // cubeCamera.position.set(0, 0, 0);
  // gltf.scene.add(cubeCamera)
  
  return <primitive object={gltf.scene} dispose={null}/>
}

function Background() {
  const {scene} = useThree();
  const loader = new CubeTextureLoader();
  const texture = loader.load([
    "/skybox/px.png",
    "/skybox/nx.png",
    "/skybox/py.png",
    "/skybox/ny.png",
    "/skybox/pz.png",
    "/skybox/nz.png",
  ]);
  texture.encoding = sRGBEncoding
  scene.background = texture
  return null
}

const Light = () => {
  const ref1 = useRef();
  const ref2 = useRef();
  useHelper(ref1, DirectionalLightHelper, 1)
  useHelper(ref2, DirectionalLightHelper, 2)
  return (
    <>
      <ambientLight intensity={1.5}/>
      <directionalLight
      castShadow
      position={[1,2,1]} 
      intensity={1} 
      ref={ref1}
      />
      <directionalLight position={[-2,3,2]} intensity={1} ref={ref2}/>
      <spotLight intensity={1} position={[2, 0, 0]} />
    </>
  )
}

const HTMLContent = () => {
  return (
    <>
      <group>
        <Model></Model>
      </group>
    </>
  );
}
function App() {
  return (
    <div id={"maindiv"}>
      <Canvas
      
          color
          camera={{position: [5,5,5], fov: 30}}>
        <OrbitControls />
        <Background />
        <Light/>
        <Suspense fallback={null}>
          <Model />
        </Suspense> 
      </Canvas>
    </div>
   
  );
}

export default App;
