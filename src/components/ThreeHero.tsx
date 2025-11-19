'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows, Html, Text3D, Center } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import * as THREE from 'three';

function FloatingShape({ position, color, geometry, speed = 1 }: any) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        mesh.current.rotation.x += delta * 0.2 * speed;
        mesh.current.rotation.y += delta * 0.3 * speed;
        if (hovered) {
            mesh.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
        } else {
            mesh.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh
                ref={mesh}
                position={position}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {geometry === 'box' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
                {geometry === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
                {geometry === 'torus' && <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />}
                {geometry === 'octahedron' && <octahedronGeometry args={[1.2]} />}
                <meshStandardMaterial
                    color={color}
                    roughness={0.1}
                    metalness={0.8}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>
        </Float>
    );
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#4f46e5" />

            <FloatingShape position={[-4, 2, -2]} color="#3b82f6" geometry="torus" speed={1.2} />
            <FloatingShape position={[4, -2, -3]} color="#8b5cf6" geometry="octahedron" speed={0.8} />
            <FloatingShape position={[-3, -3, 0]} color="#ec4899" geometry="sphere" speed={1.5} />
            <FloatingShape position={[5, 3, -5]} color="#10b981" geometry="box" speed={1} />

            <Environment preset="city" />
            <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </>
    );
}

export default function ThreeHero() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="relative w-full h-[80vh] bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <Scene />
                </Canvas>
            </div>

            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                <div className="pointer-events-auto text-center px-4 w-full max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
                            Neighbour<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Care</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
                            The future of local services. Connect with trusted professionals in an immersive way.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full shadow-2xl flex items-center max-w-2xl mx-auto"
                    >
                        <Search className="w-6 h-6 text-gray-300 ml-4" />
                        <input
                            type="text"
                            placeholder="What do you need help with?"
                            className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-300 w-full px-4 py-3 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Link href={`/listings?q=${searchTerm}`}>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 font-semibold transition-all flex items-center gap-2">
                                Search
                            </button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12 flex justify-center gap-4"
                    >
                        {['Home Repair', 'Cleaning', 'Gardening', 'Moving'].map((cat) => (
                            <Link key={cat} href={`/listings?category=${cat}`}>
                                <button className="bg-white/5 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white px-6 py-2 rounded-full text-sm font-medium transition-all">
                                    {cat}
                                </button>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
