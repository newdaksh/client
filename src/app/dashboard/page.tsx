'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import ThreeSceneWrapper from '@/components/ThreeSceneWrapper';
import Navbar from '@/components/Navbar';

const data = [
    { label: 'Mon', value: 5, color: '#ef4444' },
    { label: 'Tue', value: 8, color: '#f97316' },
    { label: 'Wed', value: 3, color: '#eab308' },
    { label: 'Thu', value: 12, color: '#22c55e' },
    { label: 'Fri', value: 7, color: '#3b82f6' },
    { label: 'Sat', value: 15, color: '#a855f7' },
    { label: 'Sun', value: 10, color: '#ec4899' },
];

function Bar({ value, label, color, position }: { value: number, label: string, color: string, position: [number, number, number] }) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (hovered) {
            mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, value * 0.2 + 0.5, 0.1);
        } else {
            mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, value * 0.2, 0.1);
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={mesh}
                position={[0, value * 0.1, 0]}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <boxGeometry args={[0.5, 1, 0.5]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
            </mesh>
            <Text
                position={[0, -0.5, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="top"
            >
                {label}
            </Text>
        </group>
    );
}

export default function DashboardPage() {
    return (
        <main className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
            <Navbar />
            <div className="absolute inset-0 z-0">
                <ThreeSceneWrapper cameraPosition={[0, 2, 8]}>
                    {data.map((item, index) => (
                        <Bar
                            key={index}
                            value={item.value}
                            label={item.label}
                            color={item.color}
                            position={[(index - 3) * 1.2, 0, 0]}
                        />
                    ))}
                    <gridHelper args={[20, 20, 0x444444, 0x222222]} position={[0, -1, 0]} />
                </ThreeSceneWrapper>
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-24 pointer-events-none">
                <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                    Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Spent</h3>
                        <p className="text-3xl font-bold text-white">$1,245.00</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Active Requests</h3>
                        <p className="text-3xl font-bold text-white">3</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Completed Jobs</h3>
                        <p className="text-3xl font-bold text-white">12</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
