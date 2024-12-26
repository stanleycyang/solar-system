export interface PlanetConfig {
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
