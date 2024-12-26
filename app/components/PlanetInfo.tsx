import { PlanetConfig } from "../types";

interface PlanetInfoProps {
  planet: PlanetConfig;
  onClose: () => void;
}

export default function PlanetInfo({ planet, onClose }: PlanetInfoProps) {
  return (
    <div className='planet-info'>
      <button className='close-button' onClick={onClose}>
        ×
      </button>
      <h2>{planet.name.charAt(0).toUpperCase() + planet.name.slice(1)}</h2>
      <div className='info-grid'>
        <div>
          <h3>Diameter</h3>
          <p>{planet.info.diameter}</p>
        </div>
        <div>
          <h3>Day Length</h3>
          <p>{planet.info.dayLength}</p>
        </div>
        <div>
          <h3>Year Length</h3>
          <p>{planet.info.yearLength}</p>
        </div>
        <div>
          <h3>Temperature</h3>
          <p>{planet.info.temperature}</p>
        </div>
      </div>
      <p className='description'>{planet.info.description}</p>
    </div>
  );
}
