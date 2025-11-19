'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import ThreeSceneWrapper from '@/components/ThreeSceneWrapper';
import Navbar from '@/components/Navbar';

function ConnectionGlobe() {
    const ref = useRef<THREE.Points>(null!);

    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);

        const x = 2 * Math.sin(theta) * Math.cos(phi);
        const y = 2 * Math.sin(theta) * Math.sin(phi);
        const z = 2 * Math.cos(theta);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ffa0e0"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export default function AboutPage() {
    return (
        <main className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
            <Navbar />
            <div className="absolute inset-0 z-0">
                <ThreeSceneWrapper cameraPosition={[0, 0, 5]}>
                    <ConnectionGlobe />
                </ThreeSceneWrapper>
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-screen">
                <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-white/10">
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                        About NeighbourCare
                    </h1>
                    <p className="text-lg text-gray-300 mb-4">
                        We are dedicated to connecting neighbors with trusted local professionals.
                        Our mission is to build a stronger, more reliable community where help is just a click away.
                    </p>
                    <p className="text-lg text-gray-300">
                        Founded in 2024, we have helped thousands of households find the right person for the job.
                    </p>
                </div>
                <div>
                    {/* 3D Globe is in the background, this space is left open for visuals */}
                </div>
            </div>
        </main>
    );
}
