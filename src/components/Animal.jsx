import { useContext, useEffect, useMemo, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import { SkeletonUtils } from "three-stdlib";

import { EditContext } from "../context/EditContext";

const Animal = ({ name, objectId, position, onClick, ...props }) => {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(`/models/animals/${name}.glb`); // 같은 모델은 하나의 씬만 리턴함
  const clone = useMemo(() => {
    // 씬을 복제해서 동일한 모델이어도 여러 개 씬을 반환하도록 함
    return SkeletonUtils.clone(scene);
  }, [scene]);

  const { actions } = useAnimations(animations, groupRef);

  const { isEditMode, selectedId, draggedPosition } = useContext(EditContext);
  const isSelectedId = objectId === selectedId;

  useFrame(({ camera }) => {
    if (isSelectedId) {
      const [offsetX, offsetY, offsetZ] = position;
      const { x, y, z } = groupRef.current.children[0].position;
      const realX = offsetX + x;
      const realY = offsetY + y;
      const realZ = offsetZ + z;
      camera.lookAt(realX, realY, realZ);
      camera.position.lerp(new Vector3(realX, realY + 10, realZ + 20), 0.01);
    }
  });

  useEffect(() => {
    actions["Idle"].reset().play();
  }, []);

  return (
    <>
      {isEditMode ? (
        <group
          {...props}
          ref={groupRef}
          position={isSelectedId ? draggedPosition : position}
          scale={[3, 3, 3]}
          onClick={onClick(objectId)}
        >
          <mesh>
            <boxGeometry args={[3, 1, 4]} />
            <meshBasicMaterial transparent opacity={0.7} color="green" />
          </mesh>
          <primitive object={clone}></primitive>
        </group>
      ) : (
        <group ref={groupRef} position={position}>
          <RigidBody lockRotations colliders={"hull"}>
            <group {...props} onClick={onClick(objectId)}>
              <primitive object={clone}></primitive>
            </group>
          </RigidBody>
        </group>
      )}
    </>
  );
};

export default Animal;
