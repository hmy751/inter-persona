import { useTexture } from "@react-three/drei";

const InterviewerCard: React.FC<{
  imgUrl: string;
  position: [number, number, number];
  onClick: () => void;
}> = ({ imgUrl, onClick, position }) => {
  const [texture] = useTexture([imgUrl]);

  return (
    <mesh onClick={onClick} position={position}>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

export default InterviewerCard;
