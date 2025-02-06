import { useContext, useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

import { EditContext } from "../context/EditContext";
import { Controls } from "../App";

const JUMP_FORCE = 20;
const MOVEMENT_SPEED = 3;
const MAX_VEL = 10;
const offset = {
  x: 160,
  y: 10,
  z: 100,
};

const Rtanny = (props) => {
  const groupRef = useRef();
  const bodyRef = useRef();
  const rtannyRef = useRef();
  const isOnLandRef = useRef(false);

  const [animation, setAnimation] = useState("Idle");
  const { scene, animations } = useGLTF(`/models/rtanny.glb`);
  const { actions } = useAnimations(animations, groupRef);
  const { isEditMode, selectedId } = useContext(EditContext);

  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
    }
  });

  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const isKeyPressed =
    leftPressed || rightPressed || backPressed || forwardPressed;

  useFrame(({ camera }) => {
    if (isEditMode || selectedId) {
      return;
    }

    const { x, y, z } = groupRef.current.children[0].position;
    const realX = offset.x + x;
    const realY = offset.y + y;
    const realZ = offset.z + z;

    camera.position.x = realX;
    camera.position.y = realY + 40; // +40, +60 안 해주면 르탄이 몸 안에 카메라 위치
    camera.position.z = realZ + 60;

    camera.lookAt(realX, realY, realZ);

    const impulse = { x: 0, y: 0, z: 0 }; // 르탄이에게 주는 힘 정도
    const linvel = bodyRef.current.linvel(); // 르탄이의 물리 엔진이 받고 있는 리니어한 속도 값
    let changeRotation = false;

    if (jumpPressed && isOnLandRef.current) {
      impulse.y += JUMP_FORCE;
    }

    if (rightPressed && linvel.x < MAX_VEL) {
      impulse.x += MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (leftPressed && linvel.x > -MAX_VEL) {
      impulse.x -= MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (backPressed && linvel.z < MAX_VEL) {
      impulse.z += MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (forwardPressed && linvel.z > -MAX_VEL) {
      impulse.z -= MOVEMENT_SPEED;
      changeRotation = true;
    }

    bodyRef.current.applyImpulse(impulse, true);
    if (changeRotation) {
      const angle = Math.atan2(linvel.x, linvel.z);
      rtannyRef.current.rotation.y = angle;
    }

    if (isKeyPressed) {
      setAnimation("Walk");
    } else {
      setAnimation("Idle");
    }
  });

  useEffect(() => {
    actions[animation].reset().play();

    return () => (actions[animation] ? actions[animation].fadeOut() : null);
  }, [animation]);

  return (
    <group ref={groupRef} position={[offset.x, offset.y, offset.z]}>
      <RigidBody
        {...props}
        ref={bodyRef}
        lockRotations
        colliders={false}
        onCollisionEnter={(e) => {
          if (e.other.rigidBodyObject.name === "land") {
            isOnLandRef.current = true;
          }
        }}
        onCollisionExit={(e) => {
          if (e.other.rigidBodyObject.name === "land") {
            isOnLandRef.current = false;
          }
        }}
      >
        <group ref={rtannyRef}>
          <primitive object={scene} />
          <CapsuleCollider args={[1, 0.7]} position={[0, 1.5, 0]} />
        </group>
      </RigidBody>
    </group>
  );
};

export default Rtanny;
