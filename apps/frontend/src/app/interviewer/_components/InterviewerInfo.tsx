import { border } from "@chakra-ui/react";
import { Text } from "@react-three/drei";
import { useMemo } from "react";
import { Shape, ShapeGeometry } from "three";

interface Interviewer {
  id: number;
  name: string;
  imgUrl: string;
  mbti: string;
}

const RoundedPlaneGeometry: React.FC<{
  width: number;
  height: number;
  radius: number;
  segments?: number;
}> = ({ width = 1, height = 1, radius = 0.2, segments = 8 }) => {
  const shape = useMemo(() => {
    const shape = new Shape();

    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(
      width / 2,
      -height / 2,
      width / 2,
      -height / 2 + radius
    );
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(
      width / 2,
      height / 2,
      width / 2 - radius,
      height / 2
    );
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(
      -width / 2,
      height / 2,
      -width / 2,
      height / 2 - radius
    );
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(
      -width / 2,
      -height / 2,
      -width / 2 + radius,
      -height / 2
    );

    return shape;
  }, [width, height, radius]);

  const geometry = useMemo(
    () => new ShapeGeometry(shape, segments),
    [shape, segments]
  );

  return <primitive object={geometry} />;
};

const InterviewerInfo: React.FC<{
  selectedInterviewer: Interviewer | null;
}> = ({ selectedInterviewer }) => {
  return (
    <mesh position={[-3, 2.5, 0]}>
      <planeGeometry args={[2.5, 1.5]} />
      <meshBasicMaterial color="white" transparent={true} opacity={0.5} />

      <RoundedPlaneGeometry width={3} height={2} radius={0.5} />
      <meshBasicMaterial color="lightblue" transparent={true} opacity={0.5} />

      <Text position={[0, 0.2, 0]} fontSize={0.5} color="black">
        {selectedInterviewer?.name}
      </Text>
      <Text position={[0, -0.3, 0]} fontSize={0.3} color="black">
        {selectedInterviewer?.mbti}
      </Text>
    </mesh>
  );
};

export default InterviewerInfo;
