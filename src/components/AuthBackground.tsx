// 'use client' directive for Next.js
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { Suspense } from 'react';



export default function AuthBackground() {
    return (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-blue-900 to-black">
            <Canvas className="w-full h-full" camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#4f46e5" />
                <pointLight position={[-10, -10, -5]} intensity={1} color="#ec4899" />

                <Suspense fallback={null}>
                    <group rotation={[0, 0, Math.PI / 4]}>
                        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
                            <mesh>
                                <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
                                <meshStandardMaterial
                                    color="#6366f1"
                                    roughness={0.1}
                                    metalness={0.8}
                                    emissive="#4f46e5"
                                    emissiveIntensity={0.2}
                                    wireframe={false}
                                />
                            </mesh>
                        </Float>

                        <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5} position={[3, -2, -2]}>
                            <mesh>
                                <icosahedronGeometry args={[0.8, 0]} />
                                <meshStandardMaterial
                                    color="#ec4899"
                                    roughness={0.1}
                                    metalness={0.8}
                                    emissive="#ec4899"
                                    emissiveIntensity={0.2}
                                />
                            </mesh>
                        </Float>

                        <Float speed={2.5} rotationIntensity={1} floatIntensity={1} position={[-3, 2, -3]}>
                            <mesh>
                                <octahedronGeometry args={[1, 0]} />
                                <meshStandardMaterial
                                    color="#8b5cf6"
                                    roughness={0.1}
                                    metalness={0.8}
                                    emissive="#8b5cf6"
                                    emissiveIntensity={0.2}
                                />
                            </mesh>
                        </Float>
                    </group>

                    <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                </Suspense>
            </Canvas>
        </div>
    );
}
