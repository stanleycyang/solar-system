interface ControlsProps {
  isPaused: boolean;
  onPauseToggle: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  showOrbits: boolean;
  onOrbitsToggle: () => void;
}

export default function Controls({
  isPaused,
  onPauseToggle,
  speed,
  onSpeedChange,
  showOrbits,
  onOrbitsToggle,
}: ControlsProps) {
  return (
    <div className='controls'>
      <button onClick={onPauseToggle}>{isPaused ? "Play" : "Pause"}</button>
      <div className='speed-control'>
        <label>Speed: </label>
        <input
          type='range'
          min='0.1'
          max='10'
          step='0.1'
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        />
        <span>{speed}x</span>
      </div>
      <button onClick={onOrbitsToggle}>
        {showOrbits ? "Hide Orbits" : "Show Orbits"}
      </button>
    </div>
  );
}
