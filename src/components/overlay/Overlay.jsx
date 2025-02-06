import { useContext } from "react";

import { EditContext } from "../../context/EditContext";

import CloseIcon from "../icons/CloseIcon";
import EditIcon from "../icons/EditIcon";
import RotateRight from "../icons/RotateRight";
import RotateLeft from "../icons/RotateLeft";

const Overlay = () => {
  const { isEditMode, selectedId, setIsEditMode, setSelectedId, rotate } =
    useContext(EditContext);

  return (
    <div className="overlay">
      {isEditMode && selectedId ? (
        <>
          <RotateLeft onClick={() => rotate("left")} />
          <RotateRight onClick={() => rotate("right")} />
        </>
      ) : null}
      {selectedId ? <CloseIcon onClick={() => setSelectedId(null)} /> : null}
      <EditIcon
        onClick={() => {
          setIsEditMode((prev) => !prev);
        }}
      />
    </div>
  );
};

export default Overlay;
