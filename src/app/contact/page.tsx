'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ThreeSceneWrapper from '@/components/ThreeSceneWrapper';
import Navbar from '@/components/Navbar';

function InteractiveParticles() {
    const count = 500;
    const mesh = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Mouse interaction
            const mouseX = (state.mouse.x * window.innerWidth) / 50;
            const mouseY = (state.mouse.y * window.innerHeight) / 50;

            particle.mx += (mouseX - particle.mx) * 0.05;
            particle.my += (mouseY - particle.my) * 0.05;

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshPhongMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.5} />
        </instancedMesh>
    );
}

export default function ContactPage() {
    return (
        <main className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
            <Navbar />
            <div className="absolute inset-0 z-0">
                <ThreeSceneWrapper cameraPosition={[0, 0, 20]}>
                    <InteractiveParticles />
                </ThreeSceneWrapper>
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-24 flex justify-center items-center h-screen">
                <div className="bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
                    <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                        Get in Touch
                    </h1>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                            <input type="text" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <input type="email" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                            <textarea className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 h-32" placeholder="How can we help?"></textarea>
                        </div>
                        <button type="button" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
