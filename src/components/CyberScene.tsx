
import { Canvas } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  OrbitControls,
  Stars,
  Sparkles,
  Torus,
} from "@react-three/drei";

function HolographicCore() {
  return (
    <group>
      {/* Central energy sphere */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.7}>
        <mesh>
          <icosahedronGeometry args={[1.15, 4]} />
          <MeshDistortMaterial
            color="#00F5A0"
            emissive="#00F5A0"
            emissiveIntensity={0.7}
            wireframe
            distort={0.32}
            speed={2}
            roughness={0.15}
          />
        </mesh>

        <mesh scale={0.72}>
          <icosahedronGeometry args={[1, 3]} />
          <meshBasicMaterial
            color="#A855F7"
            wireframe
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>

      {/* Neon orbit rings */}
      <Torus args={[1.65, 0.012, 12, 120]} rotation={[1.1, 0.3, 0]}>
        <meshBasicMaterial color="#FF2E88" />
      </Torus>

      <Torus args={[1.9, 0.009, 12, 120]} rotation={[0.5, 1.2, 0]}>
        <meshBasicMaterial color="#00D9FF" />
      </Torus>

      <Torus args={[2.15, 0.008, 12, 120]} rotation={[1.5, 0.7, 0]}>
        <meshBasicMaterial color="#A855F7" />
      </Torus>

      <Sparkles
        count={100}
        scale={5}
        size={2.5}
        speed={0.5}
        color="#00F5A0"
      />
    </group>
  );
}

export default function CyberScene() {
  return (
    <div className="cyber-scene">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 4]} color="#00F5A0" intensity={25} />
        <pointLight position={[-3, -2, 2]} color="#FF2E88" intensity={18} />
        <pointLight position={[0, 3, -3]} color="#A855F7" intensity={20} />

        <Stars
          radius={80}
          depth={45}
          count={1800}
          factor={3}
          saturation={0.8}
          fade
          speed={1}
        />

        <HolographicCore />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.65}
        />
      </Canvas>
    </div>
  );
}
