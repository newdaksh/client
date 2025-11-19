'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Box, Flower, Droplets, Zap, Wrench } from 'lucide-react';
import * as THREE from 'three';

// --- 3D Shapes Component ---
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
                {geometry === 'box' && <boxGeometry args={[1.2, 1.2, 1.2]} />}
                {geometry === 'sphere' && <sphereGeometry args={[0.8, 32, 32]} />}
                {geometry === 'torus' && <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />}
                {geometry === 'octahedron' && <octahedronGeometry args={[1]} />}
                {geometry === 'cone' && <coneGeometry args={[0.8, 1.5, 32]} />}
                {geometry === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />}
                <meshStandardMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.8}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>
        </Float>
    );
}

// --- Category Configuration ---
const categoryConfig: Record<string, any> = {
    'Home Repair': {
        title: 'Masterful Home Repairs',
        subtitle: 'From quick fixes to major renovations, we get it done.',
        gradient: 'from-slate-900 to-slate-800',
        shapes: [
            { pos: [-4, 2, -2], color: '#3b82f6', geo: 'torus' }, // Blue Torus
            { pos: [4, -2, -3], color: '#94a3b8', geo: 'box' },   // Grey Box
            { pos: [-3, -3, 0], color: '#ef4444', geo: 'octahedron' }, // Red Octahedron
            { pos: [5, 3, -5], color: '#f59e0b', geo: 'cone' },    // Orange Cone
        ],
        icon: <Wrench className="w-12 h-12 text-blue-400" />,
        features: [
            { title: 'Plumbing', desc: 'Leaks, drains, and pipes.' },
            { title: 'Carpentry', desc: 'Custom woodwork and repairs.' },
            { title: 'Painting', desc: 'Interior and exterior freshness.' },
        ]
    },
    'Cleaning': {
        title: 'Spotless Cleaning Services',
        subtitle: 'Experience the joy of a sparkling clean home.',
        gradient: 'from-cyan-900 to-blue-900',
        shapes: [
            { pos: [-4, 2, -2], color: '#22d3ee', geo: 'sphere' }, // Cyan Sphere (Bubble)
            { pos: [4, -2, -3], color: '#ffffff', geo: 'sphere' }, // White Sphere (Bubble)
            { pos: [-3, -3, 0], color: '#a5f3fc', geo: 'octahedron' }, // Light Cyan Sparkle
            { pos: [5, 3, -5], color: '#0891b2', geo: 'torus' },   // Blue Torus
        ],
        icon: <Sparkles className="w-12 h-12 text-cyan-400" />,
        features: [
            { title: 'Deep Clean', desc: 'Thorough top-to-bottom cleaning.' },
            { title: 'Maid Service', desc: 'Regular scheduled maintenance.' },
            { title: 'Sanitization', desc: 'Germ-free living spaces.' },
        ]
    },
    'Moving': {
        title: 'Stress-Free Moving',
        subtitle: 'Pack, ship, and settle in with ease.',
        gradient: 'from-orange-900 to-amber-900',
        shapes: [
            { pos: [-4, 2, -2], color: '#f97316', geo: 'box' },    // Orange Box
            { pos: [4, -2, -3], color: '#d97706', geo: 'box' },    // Amber Box
            { pos: [-3, -3, 0], color: '#78350f', geo: 'box' },    // Brown Box
            { pos: [5, 3, -5], color: '#fbbf24', geo: 'cylinder' }, // Yellow Cylinder (Tape?)
        ],
        icon: <Box className="w-12 h-12 text-orange-400" />,
        features: [
            { title: 'Packing', desc: 'Secure packing for all items.' },
            { title: 'Transport', desc: 'Safe and timely delivery.' },
            { title: 'Unpacking', desc: 'Get settled in your new home.' },
        ]
    },
    'Gardening': {
        title: 'Beautiful Gardens',
        subtitle: 'Cultivate your personal paradise.',
        gradient: 'from-green-900 to-emerald-900',
        shapes: [
            { pos: [-4, 2, -2], color: '#22c55e', geo: 'octahedron' }, // Green Leaf-ish
            { pos: [4, -2, -3], color: '#10b981', geo: 'sphere' },     // Emerald Sphere
            { pos: [-3, -3, 0], color: '#ec4899', geo: 'torus' },      // Pink Flower-ish
            { pos: [5, 3, -5], color: '#facc15', geo: 'sphere' },      // Yellow Sun-ish
        ],
        icon: <Flower className="w-12 h-12 text-green-400" />,
        features: [
            { title: 'Landscaping', desc: 'Design your dream garden.' },
            { title: 'Lawn Care', desc: 'Mowing, trimming, and edging.' },
            { title: 'Planting', desc: 'Seasonal flowers and trees.' },
        ]
    },
    'Plumbing': {
        title: 'Expert Plumbing',
        subtitle: 'Flowing smoothly, fixing quickly.',
        gradient: 'from-blue-950 to-indigo-950',
        shapes: [
            { pos: [-4, 2, -2], color: '#3b82f6', geo: 'cylinder' }, // Blue Pipe
            { pos: [4, -2, -3], color: '#6366f1', geo: 'torus' },    // Indigo Joint
            { pos: [-3, -3, 0], color: '#93c5fd', geo: 'sphere' },   // Light Blue Drop
            { pos: [5, 3, -5], color: '#1e40af', geo: 'cylinder' },  // Dark Blue Pipe
        ],
        icon: <Droplets className="w-12 h-12 text-blue-400" />,
        features: [
            { title: 'Repairs', desc: 'Fix leaks and clogs fast.' },
            { title: 'Installations', desc: 'New fixtures and appliances.' },
            { title: 'Maintenance', desc: 'Prevent future issues.' },
        ]
    },
    'Electrical': {
        title: 'Safe Electrical Work',
        subtitle: 'Powering your home safely and efficiently.',
        gradient: 'from-yellow-950 to-amber-950',
        shapes: [
            { pos: [-4, 2, -2], color: '#eab308', geo: 'octahedron' }, // Yellow Spark
            { pos: [4, -2, -3], color: '#f59e0b', geo: 'cone' },       // Amber Cone
            { pos: [-3, -3, 0], color: '#a855f7', geo: 'torus' },      // Purple Energy
            { pos: [5, 3, -5], color: '#fbbf24', geo: 'octahedron' },  // Gold Spark
        ],
        icon: <Zap className="w-12 h-12 text-yellow-400" />,
        features: [
            { title: 'Wiring', desc: 'Safe and code-compliant wiring.' },
            { title: 'Lighting', desc: 'Indoor and outdoor lighting.' },
            { title: 'Repairs', desc: 'Troubleshooting and fixes.' },
        ]
    },
};

function Scene({ config }: { config: any }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} color={config.shapes[0].color} />

            {config.shapes.map((shape: any, i: number) => (
                <FloatingShape
                    key={i}
                    position={shape.pos}
                    color={shape.color}
                    geometry={shape.geo}
                    speed={1 + i * 0.1}
                />
            ))}

            <Environment preset="city" />
            <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </>
    );
}

export default function CategoryHero({ category }: { category: string }) {
    const config = categoryConfig[category];

    if (!config) return null;

    const scrollToListings = () => {
        const element = document.getElementById('listings-grid');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white mb-12">
            {/* 3D Hero Section */}
            <div className={`relative w-full h-[60vh] bg-gradient-to-br ${config.gradient} overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-2xl`}>
                <div className="absolute inset-0 z-0">
                    <Canvas>
                        <Scene config={config} />
                    </Canvas>
                </div>

                {/* Overlay Content */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                    <div className="pointer-events-auto text-center px-4 w-full max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
                                    {config.icon}
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
                                {config.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
                                {config.subtitle}
                            </p>
                            <motion.button
                                onClick={scrollToListings}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-slate-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-colors flex items-center mx-auto gap-2 cursor-pointer"
                            >
                                Find a Pro <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {config.features.map((feature: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 text-center"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
