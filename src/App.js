import './App.css';
import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import {CubeCamera, Html} from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Suspense } from 'react';
import { OrbitControls, Stars, useHelper } from "@react-three/drei";
import { CubeTextureLoader, RGBFormat, sRGBEncoding } from 'three';
import { WebGLCubeRenderTarget, DirectionalLightHelper, Raycaster, Vector3, Color } from 'three';
import PeriodicText from "./periodic_text.png"

const Model = () => {
  const gltf = useLoader(GLTFLoader,'/periodic_logo5.glb')
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
      // ref={ref1}
      />
      <directionalLight 
      position={[-4,3,-10]} 
      intensity={1} 
      // ref={ref2}
      />
      {/* <spotLight intensity={1} position={[2, 0, 0]} /> */}
    </>
  )
}

const HTMLContent = () => {
  return(
    <group position={[-20, 0, 0]}>
      <Html>
        <div className="prdtxt">
          <img src={PeriodicText} alt={"periodic"}/>
        </div>
      </Html>
    </group>
    
  )
}

const ModelContent = () => {
  const { viewport } = useThree()
  const moveModel = useRef()
  
  useFrame(({ mouse }) => {
    
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2
    moveModel.current.rotation.x = Math.PI / 2;
    moveModel.current.position.set(x*0.01, y*0.01, 0.4)
  })
  return (
    <>
      <group ref={moveModel}>
        <Model />
      </group>
    </>
  );
}
function App() {
  return (
    <div id={"maindiv"}>
      <Canvas
        onCreated={
          state => {
            state.camera.position.set(5,0, 15)
            state.camera.lookAt(0, 0, 0)
          }
        }
        color
        shadows
        camera={
        {position: [2,2,15], fov: 50, scale: 0.5}}
      >
        <mesh receiveShadow>
          <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
          <meshPhongMaterial attach="material" color="#292929" />
        </mesh>
        <OrbitControls 
          minDistance={4} 
          maxDistance={20} 
          maxPolarAngle={Math.PI / 1.5} 
          minPolarAngle={Math.PI/3} 
          minAzimuthAngle={-Math.PI/16} 
          maxAzimuthAngle={Math.PI/16} 
          autoRotate 
          enableZoom 
          autoRotateSpeed={0.2} 
          enableDamping 
          dampingFactor={0.02}
          />
          <ambientLight intensity={3} color={new Color('grey')}/>
          <spotLight  
          intensity={0.5} 
          position={[-10, -10, 2000000]} 
          angle={Math.PI/2} 
          penumbra={0} 
          shadow-mapSize-width={4096} 
          shadow-mapSize-height={4096} 
          castShadow 
          color={new Color('white')} 
          decay={30}
        />
        
        {/* <Background /> */}
        {/* <Light/> */}
        {/* <HTMLContent />  */}
        
        <Suspense fallback={null}>
          <ModelContent />
        </Suspense> 
        
      </Canvas>
    </div>
   
  );
}

export default App;
