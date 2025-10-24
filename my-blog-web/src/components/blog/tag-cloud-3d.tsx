'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import type { Tag } from '@/types';

interface TagCloud3DProps {
  tags: Tag[];
  className?: string;
}

interface TagSphereProps {
  tag: Tag;
  index: number;
  total: number;
}

function TagSphere({ tag, index, total }: TagSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // 计算球面位置
  const phi = Math.acos(1 - 2 * index / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  
  const position = useMemo(() => [
    Math.cos(theta) * Math.sin(phi),
    Math.cos(phi),
    Math.sin(theta) * Math.sin(phi)
  ], [theta, phi]);

  // 根据文章数量计算大小
  const scale = useMemo(() => {
    const minScale = 0.3;
    const maxScale = 1.2;
    const maxCount = Math.max(...Array.from({ length: total }, (_, i) => i + 1));
    return minScale + (tag.articleCount / maxCount) * (maxScale - minScale);
  }, [tag.articleCount, total]);

  useFrame(() => {
    if (meshRef.current) {
      // 缓慢旋转
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.x += 0.0005;
      
      // 悬停时放大
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={position as [number, number, number]}>
      {/* 标签球体 */}
      <Sphere 
        ref={meshRef} 
        args={[scale * 0.1, 16, 16]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => window.open(`/tags/${tag.slug}`, '_blank')}
      >
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : tag.color} 
          transparent 
          opacity={hovered ? 0.9 : 0.8}
          roughness={0.3}
          metalness={hovered ? 0.3 : 0.1}
        />
      </Sphere>
    </group>
  );
}

function TagCloudScene({ tags }: { tags: Tag[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // 整体缓慢旋转
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.6} />
      
      {/* 方向光 */}
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      {/* 点光源 */}
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#ff6b6b" />
      
      {/* 标签组 */}
      <group ref={groupRef}>
        {tags.map((tag, index) => (
          <TagSphere 
            key={tag.id} 
            tag={tag} 
            index={index} 
            total={tags.length} 
          />
        ))}
      </group>
      
      {/* 轨道控制器 */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
}

export function TagCloud3D({ tags, className }: TagCloud3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`relative w-full h-96 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden ${className}`}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <TagCloudScene tags={tags} />
      </Canvas>
      
      {/* 交互提示 */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        拖拽旋转视角 • 点击标签查看详情
      </div>
      
      {/* 标签统计 */}
      <div className="absolute top-4 right-4 text-sm text-muted-foreground bg-background/80 px-2 py-1 rounded">
        共 {tags.length} 个标签
      </div>
      
      {/* 标签名称显示 */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded max-w-32">
        <div className="space-y-1">
          {tags.slice(0, 5).map((tag) => (
            <div key={tag.id} className="flex items-center space-x-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: tag.color }}
              />
              <span>{tag.name}</span>
            </div>
          ))}
          {tags.length > 5 && (
            <div className="text-center text-muted-foreground">
              +{tags.length - 5} 更多
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
