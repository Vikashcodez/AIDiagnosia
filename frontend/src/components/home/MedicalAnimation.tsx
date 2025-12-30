
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function MedicalAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Try-catch block to handle WebGL initialization errors
    try {
      // Create scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      
      // Check for WebGL support
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ 
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        });
      } catch (e) {
        console.error("WebGL initialization failed:", e);
        setError(true);
        return;
      }
      
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      containerRef.current.appendChild(renderer.domElement);
      
      // Set background color
      renderer.setClearColor(0xffffff, 0);

      // Create a group for all medical objects
      const doctorGroup = new THREE.Group();
      
      // Doctor body (lab coat)
      const bodyGeometry = new THREE.CylinderGeometry(0.7, 0.5, 2, 32);
      const labCoatMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf0f0ff, 
        shininess: 30 
      });
      const body = new THREE.Mesh(bodyGeometry, labCoatMaterial);
      doctorGroup.add(body);
      
      // Doctor head
      const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const skinMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffdbac,
        shininess: 20
      });
      const head = new THREE.Mesh(headGeometry, skinMaterial);
      head.position.y = 1.4;
      doctorGroup.add(head);
      
      // Doctor hair (purple to match the image)
      const hairGeometry = new THREE.SphereGeometry(0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8);
      const hairMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x9b87f5, // Purple hair color to match the image
        shininess: 10 
      });
      const hair = new THREE.Mesh(hairGeometry, hairMaterial);
      hair.position.y = 1.5;
      hair.rotation.x = Math.PI;
      doctorGroup.add(hair);
      
      // Stethoscope around neck
      const stethoscopeGeometry = new THREE.TorusGeometry(0.4, 0.03, 16, 32, Math.PI);
      const stethoscopeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x444444, 
        shininess: 50 
      });
      const stethoscope = new THREE.Mesh(stethoscopeGeometry, stethoscopeMaterial);
      stethoscope.position.y = 0.7;
      stethoscope.rotation.x = Math.PI / 2;
      doctorGroup.add(stethoscope);

      // Blue scrubs under lab coat
      const scrubsGeometry = new THREE.CylinderGeometry(0.4, 0.3, 1.8, 32);
      const scrubsMaterial = new THREE.MeshPhongMaterial({
        color: 0x0EA5E9, // Bright blue for scrubs
        shininess: 30
      });
      const scrubs = new THREE.Mesh(scrubsGeometry, scrubsMaterial);
      scrubs.position.y = -0.05;
      doctorGroup.add(scrubs);

      // Create medical icons floating around the doctor
      const iconColors = {
        heartRate: 0x9b29f7, // Purple heart icon
        shield: 0x4FD1C5,    // Teal shield icon
        plus: 0x9b29f7,      // Purple plus icon
        ivDrip: 0x4FD1C5     // Teal IV bag icon
      };
      
      const icons = [
        // Heart rate icon (left)
        { 
          geometry: new THREE.TorusGeometry(0.4, 0.08, 16, 24), 
          position: { x: -1.3, y: 0.7, z: 0.2 }, 
          color: iconColors.heartRate,
          scale: 1
        },
        // Shield icon (bottom left)
        { 
          geometry: new THREE.CircleGeometry(0.4, 32), 
          position: { x: -0.9, y: -0.5, z: 0.5 }, 
          color: iconColors.shield,
          scale: 0.8
        },
        // Plus icon (top right)
        { 
          geometry: new THREE.BoxGeometry(0.6, 0.15, 0.15), 
          position: { x: 1.2, y: 1.0, z: 0.3 }, 
          color: iconColors.plus,
          scale: 1
        },
        // IV bag icon (right)
        { 
          geometry: new THREE.BoxGeometry(0.5, 0.7, 0.1), 
          position: { x: 1.5, y: 0.0, z: 0.0 }, 
          color: iconColors.ivDrip,
          scale: 0.8
        }
      ];
      
      // Create the floating icons
      icons.forEach((icon, index) => {
        const geometry = icon.geometry;
        
        const material = new THREE.MeshPhongMaterial({ 
          color: icon.color, 
          transparent: true,
          opacity: 0.9,
          shininess: 80
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(icon.position.x, icon.position.y, icon.position.z);
        mesh.scale.set(icon.scale, icon.scale, icon.scale);
        
        // Add cross for plus icon
        if (index === 2) {
          const crossGeometry = new THREE.BoxGeometry(0.15, 0.6, 0.15);
          const crossMesh = new THREE.Mesh(crossGeometry, material);
          mesh.add(crossMesh);
        }
        
        // Store original position for animation
        mesh.userData = { 
          originalY: icon.position.y,
          speed: 0.5 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2
        };
        
        doctorGroup.add(mesh);
      });

      // Add doctor to scene
      doctorGroup.position.set(0, -0.5, -3);
      scene.add(doctorGroup);

      // Set up lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 2);
      scene.add(directionalLight);
      
      const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
      backLight.position.set(-1, 1, -1);
      scene.add(backLight);

      // Position camera
      camera.position.z = 5;

      // Animation loop
      let frame = 0;
      const animate = () => {
        frame += 0.01;
        
        // Gently rotate the doctor group
        doctorGroup.rotation.y = Math.sin(frame * 0.2) * 0.15;
        
        // Make doctor slightly breathe
        if (body.scale) {
          body.scale.y = 1 + Math.sin(frame) * 0.02;
        }
        
        // Animate each floating icon
        doctorGroup.children.forEach(child => {
          if (child.userData && child.userData.originalY !== undefined) {
            // Float up and down
            child.position.y = child.userData.originalY + 
              Math.sin(frame * child.userData.speed + child.userData.phase) * 0.1;
            
            // Gentle rotation
            child.rotation.y += 0.01;
            child.rotation.x += 0.005;
          }
        });
        
        renderer.render(scene, camera);
        const animationId = requestAnimationFrame(animate);
        
        // Store the animation ID for cleanup
        return animationId;
      };
      
      const animationId = animate();

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current) return;
        
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        if (containerRef.current && renderer.domElement) {
          try {
            containerRef.current.removeChild(renderer.domElement);
          } catch (e) {
            console.error("Error cleaning up renderer:", e);
          }
        }
        // Dispose of geometries and materials to prevent memory leaks
        scene.traverse(object => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            } else if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            }
          }
        });
      };
    } catch (e) {
      console.error("Error in 3D animation:", e);
      setError(true);
      return;
    }
  }, []);

  // If there's an error, notify parent component
  if (error) {
    // Use setTimeout to ensure this happens in the next tick after rendering
    setTimeout(() => {
      const errorEvent = new Event('error');
      if (containerRef.current) {
        containerRef.current.dispatchEvent(errorEvent);
      }
    }, 0);
    
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-medical-500 text-xl">Loading alternative view...</div>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full min-h-[400px]" />;
}
