"use client";
import { useEffect, useRef, useState } from "react";
import PlanetInfo from "./PlanetInfo";
import Controls from "./Controls";

interface PlanetConfig {
  name: string;
  orbitRadius: number;
  speed: number;
  info: {
    diameter: string;
    dayLength: string;
    yearLength: string;
    temperature: string;
    description: string;
  };
}

const getScaleFactor = () => {
  // Get the viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const viewportSize = Math.min(viewportWidth, viewportHeight);

  // Calculate the maximum orbit size that will fit
  // Using 780 as the largest orbit radius from our base orbits
  // Multiply by 2 for diameter, and add padding
  const maxOrbitDiameter = 780 * 2;
  const padding = 40; // Padding from viewport edges

  // Calculate scale that will make the largest orbit fit with padding
  const scale = (viewportSize - padding) / maxOrbitDiameter;

  // Clamp the scale between reasonable minimum and maximum values
  return Math.min(Math.max(scale, 0.3), 1.2);
};

const getBaseOrbits = () => [
  {
    name: "mercury",
    orbitRadius: 120,
    speed: 4.1,
    info: {
      diameter: "4,879 km",
      dayLength: "176 Earth days",
      yearLength: "88 Earth days",
      temperature: "-180°C to 430°C",
      description: "The smallest and innermost planet in the Solar System.",
    },
  },
  {
    name: "venus",
    orbitRadius: 170,
    speed: 1.6,
    info: {
      diameter: "12,104 km",
      dayLength: "243 Earth days",
      yearLength: "225 Earth days",
      temperature: "462°C",
      description:
        "Often called Earth's sister planet due to their similar size.",
    },
  },
  {
    name: "earth",
    orbitRadius: 220,
    speed: 1,
    info: {
      diameter: "12,742 km",
      dayLength: "24 hours",
      yearLength: "365.25 days",
      temperature: "15°C (average)",
      description: "Our home planet and the only known planet with life.",
    },
  },
  {
    name: "mars",
    orbitRadius: 280,
    speed: 0.5,
    info: {
      diameter: "6,779 km",
      dayLength: "24 hours 37 minutes",
      yearLength: "687 Earth days",
      temperature: "-63°C (average)",
      description: "The Red Planet, named after the Roman god of war.",
    },
  },
  {
    name: "jupiter",
    orbitRadius: 380,
    speed: 0.08,
    info: {
      diameter: "139,820 km",
      dayLength: "10 hours",
      yearLength: "12 Earth years",
      temperature: "-110°C (cloud top)",
      description: "The largest planet in our solar system.",
    },
  },
  {
    name: "saturn",
    orbitRadius: 480,
    speed: 0.03,
    info: {
      diameter: "116,460 km",
      dayLength: "10.7 hours",
      yearLength: "29.5 Earth years",
      temperature: "-140°C",
      description: "Known for its spectacular ring system.",
    },
  },
  {
    name: "uranus",
    orbitRadius: 580,
    speed: 0.01,
    info: {
      diameter: "50,724 km",
      dayLength: "17 hours",
      yearLength: "84 Earth years",
      temperature: "-195°C",
      description: "The coldest of the gas giants, tilted on its side.",
    },
  },
  {
    name: "neptune",
    orbitRadius: 680,
    speed: 0.006,
    info: {
      diameter: "49,244 km",
      dayLength: "16 hours",
      yearLength: "165 Earth years",
      temperature: "-200°C",
      description: "The windiest planet, with speeds up to 2,100 km/h.",
    },
  },
  {
    name: "pluto",
    orbitRadius: 780,
    speed: 0.004,
    info: {
      diameter: "2,377 km",
      dayLength: "153 hours",
      yearLength: "248 Earth years",
      temperature: "-230°C",
      description: "A dwarf planet in the Kuiper Belt.",
    },
  },
];

export default function SolarSystem() {
  const animationFrameRef = useRef<number | null>(null);
  const [planets, setPlanets] = useState<PlanetConfig[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const scaleFactor = getScaleFactor();
      const baseOrbits = getBaseOrbits();

      // Apply scale factor to orbit radiuses
      setPlanets(
        baseOrbits.map((planet) => ({
          ...planet,
          orbitRadius: planet.orbitRadius * scaleFactor,
        }))
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!planets.length) return;

    const animate = () => {
      if (!isPaused) {
        planets.forEach(({ name, speed: baseSpeed, orbitRadius }) => {
          const planet = document.querySelector(`.${name}`) as HTMLElement;
          if (planet) {
            const currentRotation = parseFloat(planet.dataset.rotation || "0");
            const newRotation = currentRotation + baseSpeed * animationSpeed;
            planet.dataset.rotation = newRotation.toString();

            const angle = (newRotation * Math.PI) / 180;
            const x = Math.cos(angle) * orbitRadius;
            const y = Math.sin(angle) * orbitRadius;

            planet.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [planets, isPaused, animationSpeed]);

  const handleSpeedChange = (newSpeed: number) => {
    setAnimationSpeed(newSpeed);
    setSpeed(newSpeed);
  };

  if (!planets.length) return null;

  return (
    <div className='solar-system-container'>
      <div className='solar-system'>
        <div className='sun' />
        {planets.map(({ name, orbitRadius }) => (
          <div
            key={name}
            className={`orbit ${!showOrbits ? "orbit-hidden" : ""}`}
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

      <Controls
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused(!isPaused)}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        showOrbits={showOrbits}
        onOrbitsToggle={() => setShowOrbits(!showOrbits)}
      />
    </div>
  );
}
