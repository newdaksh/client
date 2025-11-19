'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, ScrollControls, Scroll, useScroll, Sparkles, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

const services = [
    { title: 'Plumbing', description: 'Expert leak repairs and pipe installations', color: '#3b82f6', icon: '💧' },
    { title: 'Electrical', description: 'Safe wiring and electrical maintenance', color: '#eab308', icon: '⚡' },
    { title: 'Cleaning', description: 'Deep cleaning for homes and offices', color: '#22c55e', icon: '✨' },
    { title: 'Moving', description: 'Hassle-free relocation services', color: '#f97316', icon: '📦' },
    { title: 'Gardening', description: 'Beautiful landscape design and care', color: '#10b981', icon: '🌿' },
];

function ServiceItem({ index, title, description, color, icon, onNavigate }: { index: number, title: string, description: string, color: string, icon: string, onNavigate: (path: string) => void }) {
    const mesh = useRef<THREE.Mesh>(null!);
    const group = useRef<THREE.Group>(null!);
    const scroll = useScroll();
    const [hovered, setHover] = useState(false);
    const { width } = useThree((state) => state.viewport);

    useFrame((state, delta) => {
        const offset = index * 4;
        const scrollOffset = scroll.offset * (services.length * 4);

        group.current.position.y = offset - scrollOffset;

        mesh.current.rotation.x += delta * 0.2;
        mesh.current.rotation.y += delta * 0.3;

        const targetScale = hovered ? 1.1 : 1;
        mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    });

    return (
        <group ref={group}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh
                    ref={mesh}
                    position={[width / 4, 0, 0]}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
                    onClick={() => onNavigate(`/listings?category=${title}`)}
                >
                    <icosahedronGeometry args={[1.5, 0]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={4}
                        thickness={0.5}
                        chromaticAberration={0.1}
                        anisotropy={0.1}
                        distortion={0.1}
                        distortionScale={0.1}
                        temporalDistortion={0.2}
                        color={color}
                    />
                </mesh>
            </Float>

            <group position={[width / 4, -2, 0]}>
                <Text
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="top"
                // font="/fonts/Inter-Bold.ttf" // Commented out to use default font if custom font missing
                >
                    {icon}
                </Text>
            </group>
        </group>
    );
}

function Scene({ onNavigate }: { onNavigate: (path: string) => void }) {
    return (
        <>
            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="purple" />

            <Environment preset="city" />
            <Sparkles count={100} scale={10} size={4} speed={0.4} opacity={0.5} color="#ffffff" />

            <ScrollControls pages={services.length} damping={0.3}>
                {services.map((service, i) => (
                    <ServiceItem key={i} index={i} {...service} onNavigate={onNavigate} />
                ))}

                <Scroll html style={{ width: '100%', height: '100%' }}>
                    {services.map((service, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            top: `${i * 100}vh`,
                            left: '10%',
                            height: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            pointerEvents: 'none'
                        }}>
                            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">{service.title}</h1>
                            <p className="text-2xl text-gray-200 max-w-md drop-shadow-md">{service.description}</p>
                            <button
                                className="mt-8 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition-all pointer-events-auto w-fit"
                                onClick={() => onNavigate(`/listings?category=${service.title}`)}
                            >
                                View {service.title} Services
                            </button>
                        </div>
                    ))}
                </Scroll>
            </ScrollControls>
        </>
    );
}

export default function ServicesPage() {
    const router = useRouter();
    const handleNavigate = (path: string) => {
        router.push(path);
    };

    return (
        <main className="relative h-screen w-full bg-gray-900 overflow-hidden">
            <div className="absolute top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
                <Scene onNavigate={handleNavigate} />
            </Canvas>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce pointer-events-none">
                <p className="text-sm">Scroll to explore</p>
                <svg className="w-6 h-6 mx-auto mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </main>
    );
}
