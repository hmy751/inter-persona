import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useState } from "react";

const Camera: React.FC = () => {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    setAspectRatio(window.innerWidth / window.innerHeight);
  }, []);

  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 0, 5]}
      fov={75}
      aspect={aspectRatio}
    />
  );
};

export default Camera;
