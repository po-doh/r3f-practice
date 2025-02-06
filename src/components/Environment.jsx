import { Fragment, Suspense, useContext, useRef } from "react";
import { OrbitControls, useHelper } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { DirectionalLightHelper } from "three";

import { EditContext } from "../context/EditContext";
import ZooMap from "./ZooMap";
import Animal from "./Animal";
import Dino from "./Dino";
import Rtanny from "./Rtanny";
import {
  BrightnessContrast,
  DepthOfField,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const START_Y = 20;

const Environment = () => {
  const lightRef = useRef();
  const { isEditMode, objects, onObjectClicked, onPointerMove } =
    useContext(EditContext);

  useHelper(lightRef, DirectionalLightHelper);
  useFrame(({ camera }) => {
    if (isEditMode) {
      camera.position.x = 0;
      camera.position.y = 400;
      camera.position.z = 0;
    }
  });

  return (
    <>
      {isEditMode ? (
        <gridHelper
          args={[500, 100]}
          position={[0, START_Y, 0]}
          onPointerMove={onPointerMove}
        />
      ) : null}
      <ambientLight intensity={3} />
      <directionalLight
        castShadow
        ref={lightRef}
        intensity={3}
        position={[162, 10, 100]}
        target-position={[160, 0, 100]}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-right={100}
        shadow-camera-left={-100}
        shadow-mapsize={[5000, 5000]}
      />
      <OrbitControls />

      <Suspense>
        {/* 초기에 로딩되지 않고 다시 로딩 됐을때 비동기로 보이게 해줌 */}
        <Physics gravity={[0, -9.81, 0]}>
          <RigidBody name="land" friction={3} type="fixed" colliders="trimesh">
            <ZooMap />
          </RigidBody>
          {objects.map(({ id, ...object }) => {
            return (
              <Fragment key={id}>
                {object.type === "animal" ? (
                  <Animal objectId={id} onClick={onObjectClicked} {...object} />
                ) : (
                  <Dino objectId={id} onClick={onObjectClicked} {...object} />
                )}
              </Fragment>
            );
          })}
          <Rtanny />
        </Physics>
      </Suspense>

      <EffectComposer>
        <BrightnessContrast brightness={-0.07} contrast={0.1} />

        {isEditMode ? (
          <Noise premultiply blendFunction={BlendFunction.ADD} />
        ) : null}
      </EffectComposer>
    </>
  );
};

export default Environment;
