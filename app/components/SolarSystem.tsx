"use client";
import { useEffect, useRef } from "react";

interface PlanetConfig {
  name: string;
  orbitRadius: number;
  speed: number;
}

const planets: PlanetConfig[] = [
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

  useEffect(() => {
    const animate = () => {
      planets.forEach(({ name, speed, orbitRadius }) => {
        const planet = document.querySelector(`.${name}`) as HTMLElement;
        if (planet) {
          const currentRotation = parseFloat(planet.dataset.rotation || "0");
          const newRotation = currentRotation + speed;
          planet.dataset.rotation = newRotation.toString();

          // Calculate x and y position on the orbit
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
  }, []);

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
