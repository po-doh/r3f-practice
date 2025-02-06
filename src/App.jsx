import { useMemo } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { EditProvider } from "./context/EditContext";
import Environment from "./components/Environment";
import Overlay from "./components/overlay/Overlay";
import "./App.css";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

function App() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  return (
    <KeyboardControls map={map}>
      <EditProvider>
        <Canvas shadows camera={{ fov: 50, position: [160, 40, 150] }}>
          <Environment />
        </Canvas>
        <Overlay />
      </EditProvider>
    </KeyboardControls>
  );
}

export default App;
