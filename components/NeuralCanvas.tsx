"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const nodes = 68;
    const positions = new Float32Array(nodes * 3);
    const colors = new Float32Array(nodes * 3);
    const colorA = new THREE.Color("#556B2F");
    const colorB = new THREE.Color("#D2B48C");

    for (let i = 0; i < nodes; i += 1) {
      const radius = 4 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = colorA.clone().lerp(colorB, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const points = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
      }),
    );
    group.add(points);

    const linePositions: number[] = [];
    for (let i = 0; i < nodes; i += 1) {
      for (let j = i + 1; j < nodes; j += 1) {
        const ax = positions[i * 3];
        const ay = positions[i * 3 + 1];
        const az = positions[i * 3 + 2];
        const bx = positions[j * 3];
        const by = positions[j * 3 + 1];
        const bz = positions[j * 3 + 2];
        const distance = Math.hypot(ax - bx, ay - by, az - bz);

        if (distance < 2.75) {
          linePositions.push(ax, ay, az, bx, by, bz);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: 0x6b7b3f,
        transparent: true,
        opacity: 0.18,
      }),
    );
    group.add(lines);

    const torus = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.25, 0.045, 180, 8, 2, 3),
      new THREE.MeshBasicMaterial({ color: 0xd2b48c, transparent: true, opacity: 0.35 }),
    );
    group.add(torus);

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const pointer = new THREE.Vector2(0, 0);
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    let frame = 0;
    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      if (!prefersReducedMotion) {
        group.rotation.y += 0.0025 + pointer.x * 0.0008;
        group.rotation.x += (pointer.y * 0.18 - group.rotation.x) * 0.025;
        torus.rotation.x += 0.006;
        torus.rotation.z -= 0.004;
      }
      renderer.render(scene, camera);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    mount.addEventListener("pointermove", onPointerMove);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeChild(renderer.domElement);
      pointGeometry.dispose();
      lineGeometry.dispose();
      (points.material as THREE.Material).dispose();
      (lines.material as THREE.Material).dispose();
      torus.geometry.dispose();
      (torus.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
