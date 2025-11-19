'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';

interface ThreeSceneWrapperProps {
    children: React.ReactNode;
    cameraPosition?: [number, number, number];
    fov?: number;
    className?: string;
}

export default function ThreeSceneWrapper({
    children,
    cameraPosition = [0, 0, 5],
    fov = 75,
    className = "absolute inset-0 w-full h-full"
}: ThreeSceneWrapperProps) {
    return (
        <div className={className}>
            <Canvas camera={{ position: cameraPosition, fov }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {children}
            </Canvas>
        </div>
    );
}
