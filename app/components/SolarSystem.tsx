"use client";
import { useEffect, useRef, useState } from "react";

interface PlanetConfig {
  name: string;
  orbitRadius: number;
  speed: number;
}

const getScaleFactor = () => {
  // Scale orbit sizes based on viewport
  const viewportSize = Math.min(window.innerWidth, window.innerHeight);
  return viewportSize / 1000; // Base scale on 1000px viewport
};

const getBaseOrbits = () => [
  { name: "mercury", orbitRadius: 70, speed: 4.1 },
  { name: "venus", orbitRadius: 100, speed: 1.6 },
  { name: "earth", orbitRadius: 145, speed: 1 },
  { name: "mars", orbitRadius: 190, speed: 0.5 },
  { name: "jupiter", orbitRadius: 280, speed: 0.08 },
  { name: "saturn", orbitRadius: 350, speed: 0.03 },
  { name: "uranus", orbitRadius: 410, speed: 0.01 },
  { name: "neptune", orbitRadius: 460, speed: 0.006 },
  { name: "pluto", orbitRadius: 500, speed: 0.004 },
];

export default function SolarSystem() {
  const animationFrameRef = useRef<number | null>(null);
  const [planets, setPlanets] = useState<PlanetConfig[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const scaleFactor = getScaleFactor();
      const baseOrbits = getBaseOrbits();
      setPlanets(
        baseOrbits.map((planet) => ({
          ...planet,
          orbitRadius: planet.orbitRadius * scaleFactor,
        }))
      );
    };

    handleResize(); // Initial setup
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!planets.length) return;

    const animate = () => {
      planets.forEach(({ name, speed, orbitRadius }) => {
        const planet = document.querySelector(`.${name}`) as HTMLElement;
        if (planet) {
          const currentRotation = parseFloat(planet.dataset.rotation || "0");
          const newRotation = currentRotation + speed;
          planet.dataset.rotation = newRotation.toString();

          const angle = (newRotation * Math.PI) / 180;
          const x = Math.cos(angle) * orbitRadius;
          const y = Math.sin(angle) * orbitRadius;

          planet.style.transform = `translate(${x}px, ${y}px)`;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [planets]);

  if (!planets.length) return null;

  return (
    <div className='solar-system'>
      <div className='sun' />
      {planets.map(({ name, orbitRadius }) => (
        <div
          key={name}
          className='orbit'
          style={{
            width: `${orbitRadius * 2}px`,
            height: `${orbitRadius * 2}px`,
          }}
        >
          <div className={`planet ${name}`} data-rotation='0'>
            {name === "saturn" && <div className='saturn-rings' />}
          </div>
        </div>
      ))}
    </div>
  );
}
