import {useState, useRef} from 'react';
import {COLORS} from '../types/configTypes';
import {map} from '../function/canvasDefault';

export function useCanvasHooks(
  size: number[],
  divisor: number,
  COLORS: COLORS,
  initialRange: number[]
) {
  const [pitch, setPitch] = useState<number | null>(null);
  const [mouseHeight, setMouseHeight] = useState<number>(0);
  const {realVoiceColor, targetVoiceColor, closeVoiceColor, currentVoiceColor} =
    COLORS;
  const [ballYCurr, setBallYCurr] = useState<number>(size[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rectWidth = 5;
  const CanvasLength = size[1];
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const offset = 5;
  const initialcurrentX = 0;
  const [currentX, setCurrentX] = useState(initialcurrentX);
  const [notesLabel, setNotesLabel] = useState<string[]>();
  const [freqLabel, setFreqLabel] = useState<string[]>();
  const [pitchDiff, setPitchDiff] = useState<number[]>([0, 100]);
  function updateBallY(value: number | null): void {
    if (value === null) {
      value = 0;
    }
    if (value <= initialRange[0]) {
      setBallYCurr(size[0]);
    } else if (value > initialRange[1]) {
      setBallYCurr(0);
    } else {
      setBallYCurr(map(value, initialRange[0], initialRange[1], size[0], -1));
    }
  }

  const updateCanvasHeight = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasHeight(rect.height);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const y = event.clientY - rect.top;
      const heightPercentage = (y / rect.height) * 100;
      setMouseHeight(heightPercentage);
    }
  };

  return {
    pitch,
    setPitch,
    mouseHeight,
    setMouseHeight,
    realVoiceColor,
    targetVoiceColor,
    closeVoiceColor,
    currentVoiceColor,
    ballYCurr,
    setBallYCurr,
    canvasRef,
    rectWidth,
    CanvasLength,
    canvasHeight,
    setCanvasHeight,
    showNotes,
    setShowNotes,
    updateBallY,
    offset,
    currentX,
    setCurrentX,
    initialcurrentX,
    notesLabel,
    setNotesLabel,
    freqLabel,
    setFreqLabel,
    pitchDiff,
    setPitchDiff,
    updateCanvasHeight,
    handleMouseMove,
  };
}
