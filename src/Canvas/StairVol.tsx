import React, {useEffect, useState} from 'react';
import {map, drawBackground} from '../function/canvasDefault';
import {Col, Row, Slider} from 'antd';

import {CONFIG, COLORS, ThemeColors} from '../types/configTypes'; // types
import {useCanvasHooks} from '../hooks/useCanvasHooks'; // variables and functions
import {useTemString} from '../hooks/useTemString';

import useCanvasRetry from '../hooksUseEffect/useCanvasRetry';
import useCanvasUpdatePitch from '../hooksUseEffect/useCanvasUpdatePitch';
import useCanvasAdjustHeight from '../hooksUseEffect/useCanvasAdjustHeight';
import useCanvasInitializeGetPitch from '../hooksUseEffect/useCanvasInitializeGetPitch';
import useCanvasChangeHzAndNotes from '../hooksUseEffect/useCanvasChangeHzAndNotes';
import useCanvasRedrawBackground from '../hooksUseEffect/useCanvasRedrawBackground';
import useCanvasPitchDiff from '../hooksUseEffect/useCanvasPitchDiff';
import useCanvasCurrentPitch from '../hooksUseEffect/useCanvasCurrentPitch';

interface StairProps {
  size: number[];
  config: CONFIG;
  COLORS: COLORS;
  isPlaying: boolean;
  showNotesPar: boolean;
  playLyricCount: number;
  isRetry: boolean;
  setPlayingPause: () => void;
  txtShow: string;
  divisor: number;
  initialRange: number[];
  setMaxLyricCount: (num: number) => void;
  setShowNotesPar: (boo: boolean) => void;
  enableAdvFeatures: boolean;
  theme: string;
  themeColors: ThemeColors;
  colorsMode: string;

  volume: number;
  historyMode: string;
  LAMP_COLORS: string[];
}

const Stair: React.FC<StairProps> = ({
  volume,
  historyMode,
  LAMP_COLORS,
  setMaxLyricCount,
  initialRange,
  divisor,
  txtShow,
  isRetry,
  setPlayingPause,
  playLyricCount,
  config,
  COLORS,
  size,
  isPlaying,
  showNotesPar,
  enableAdvFeatures,
  theme,
  themeColors,
  colorsMode,
}) => {
  const {
    pitch,
    setPitch,
    realVoiceColor,
    targetVoiceColor,
    closeVoiceColor,
    currentVoiceColor,
    ballYCurr,
    canvasRef,
    rectWidth,
    CanvasLength,
    canvasHeight,
    setCanvasHeight,
    showNotes,
    setShowNotes,
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
    updateBallY,
    updateCanvasHeight,
    handleMouseMove,
  } = useCanvasHooks(size, divisor, COLORS, initialRange);

  const {syllablesString} = useTemString(theme);

  const [inputValue, setInputValue] = useState<number[]>([110, 200]);
  const desiredLength = Math.floor(size[1] / divisor);
  const [pitchHistory, setPitchHistory] = useState<number[]>([0]);
  // Initialization curve
  const initialColorChangesFull = new Array(CanvasLength).fill(false);
  const initialBallHistoryFull = new Array(CanvasLength).fill(NaN);
  const [colorChangesFull, setColorChangesFull] = useState<boolean[]>(
    initialColorChangesFull
  );
  const [ballHistoryFull, setBallHistoryFull] = useState<number[]>(
    initialBallHistoryFull
  );
  const [ballSizeHistoryFull, setBallSizeHistoryFull] = useState<number[]>(
    initialBallHistoryFull
  );
  const resetStatesFull = () => {
    setColorChangesFull([...initialColorChangesFull]);
    setBallHistoryFull([...initialBallHistoryFull]);
    setCurrentX(initialcurrentX);
    setBallSizeHistoryFull([...initialBallHistoryFull]);
    setPitchDiff([0]);
  };
  const initialPitchArrayCus = new Array(desiredLength).fill(NaN);
  const [pitchArrayCus, setPitchArrayCus] =
    useState<number[]>(initialPitchArrayCus);
  const [shouldDisabled, setShouldDisabled] = useState<boolean>(false);

  // +++++++++++++++++++++++++++++++++++++++++++++++++
  // Setting the stair curve
  const onChange = (newValue: number[]) => {
    setInputValue(newValue);
  };
  const updatePitchArrayCus = () => {
    const partLength = Math.floor(CanvasLength / 5);
    const lastPartStart = partLength * 4;
    const midValue = (inputValue[0] + inputValue[1]) / 2;

    const updatedArray = new Array(CanvasLength)
      .fill(inputValue[0], 0, partLength)
      .fill(midValue, partLength, 2 * partLength)
      .fill(inputValue[1], 2 * partLength, 3 * partLength)
      .fill(midValue, 3 * partLength, 4 * partLength)
      .fill(inputValue[0], lastPartStart, CanvasLength);

    setPitchArrayCus(updatedArray);
  };
  useEffect(() => {
    updatePitchArrayCus();
  }, [inputValue]);

  // +++++++++++++++++++++++++++++++++++++++++++++++++
  // Hooks useEffect parts \\

  // initialize get pitch function + pause + draw background
  useCanvasInitializeGetPitch(
    config,
    setPitch,
    updateCanvasHeight,
    setPlayingPause,
    canvasRef,
    initialRange,
    showNotes,
    themeColors[theme][colorsMode].dashedLineColor
  );

  // set canvas size for different resolutions
  useCanvasAdjustHeight(canvasRef, setCanvasHeight);

  // store current pitch
  useCanvasUpdatePitch(isPlaying, pitch, updateBallY);

  // display current pitch
  useCanvasCurrentPitch(
    canvasRef,
    pitch,
    pitchHistory,
    setPitchHistory,
    initialRange,
    themeColors[theme][colorsMode].textColor
  );

  // update pitchDiff text
  useCanvasPitchDiff(
    canvasRef,
    pitchDiff,
    initialRange,
    enableAdvFeatures,
    themeColors[theme][colorsMode].textColor
  );

  // change Notes and hz display
  useCanvasChangeHzAndNotes(
    setShowNotes,
    showNotes,
    showNotesPar,
    canvasRef,
    initialRange,
    setNotesLabel,
    setFreqLabel,
    canvasHeight,
    themeColors[theme][colorsMode].dashedLineColor
  );

  // retry
  useCanvasRetry(isRetry, divisor, setPlayingPause, resetStatesFull);

  // redraw background when hz or notes changed
  useCanvasRedrawBackground(
    canvasRef,
    showNotesPar,
    initialRange,
    themeColors[theme][colorsMode].dashedLineColor
  );

  // +++++++++++++++++++++++++++++++++++++++++++++++++
  // Unique useEffect parts \\

  // initialize max lyric and stair array
  useEffect(() => {
    setMaxLyricCount(5);
    updatePitchArrayCus();
  }, []);

  // draw two curves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const textY = 20;
        ctx.clearRect(235, 0, 980, canvas.height);
        ctx.clearRect(0, textY + 3, canvas.width, canvas.height);

        drawBackground(
          canvasRef,
          initialRange[1],
          initialRange[0],
          showNotesPar,
          themeColors[theme][colorsMode].dashedLineColor
        );

        // stair
        for (let i = 0 + offset; i < pitchArrayCus.length; i++) {
          const mappedJsonValue = map(
            pitchArrayCus[i],
            initialRange[0],
            initialRange[1],
            size[0],
            0
          );
          // Set fill color based on condition
          if (colorChangesFull[i]) {
            ctx.fillStyle = closeVoiceColor;
          } else {
            ctx.fillStyle = targetVoiceColor;
          }
          // Draw a rectangle
          ctx.fillRect(i, mappedJsonValue, rectWidth, rectWidth);
        }

        let temTxtShow = false;
        if (txtShow === 'false') {
          temTxtShow = false;
        } else {
          temTxtShow = true;
        }

        if (temTxtShow) {
          const fraction = size[1] / 5;
          const heights = [
            inputValue[0],
            (inputValue[0] + inputValue[1]) / 2,
            inputValue[1],
            (inputValue[0] + inputValue[1]) / 2,
            inputValue[0],
          ];
          ctx.fillStyle = themeColors[theme][colorsMode].textColor;
          ctx.font = '16px Arial';
          for (let j = 0; j <= 4; j++) {
            const xPosition = fraction * (j + 1) - fraction / 2;
            const yPosition = map(
              heights[j] + 5,
              initialRange[0],
              initialRange[1],
              size[0],
              0
            );
            ctx.fillText(
              syllablesString[playLyricCount][j],
              xPosition,
              yPosition
            );
          }
        }

        // Draw the ball's historical positions
        for (let i = 0; i < ballHistoryFull.length; i++) {
          ctx.beginPath();
          const mappedValue = map(
            ballHistoryFull[i],
            initialRange[0],
            initialRange[1],
            size[0],
            -1
          );

          let ballSize;
          if (historyMode === 'Size' || historyMode === 'Mixed') {
            if (ballSizeHistoryFull[i] < -80) {
              ballSize = 3;
            } else if (ballSizeHistoryFull[i] > -50) {
              ballSize = 7;
            } else {
              ballSize = 5;
            }
          } else {
            ballSize = 5;
          }

          let ballColor;
          if (historyMode === 'Color' || historyMode === 'Mixed') {
            if (ballSizeHistoryFull[i] < -80) {
              ballColor = LAMP_COLORS[0];
            } else if (ballSizeHistoryFull[i] > -50) {
              ballColor = LAMP_COLORS[2];
            } else {
              ballColor = LAMP_COLORS[1];
            }
          } else {
            ballColor = realVoiceColor;
          }

          ctx.arc(i, mappedValue, ballSize, 0, 2 * Math.PI);
          ctx.fillStyle = ballColor;
          ctx.fill();
          ctx.closePath();
        }

        // Plot current value
        ctx.beginPath();
        ctx.arc(currentX * divisor, ballYCurr, 10, 0, 2 * Math.PI);
        ctx.fillStyle = currentVoiceColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }, [
    COLORS,
    txtShow,
    pitchArrayCus,
    initialRange,
    ballHistoryFull,
    playLyricCount,
    showNotesPar,
  ]);

  // next button
  useEffect(() => {
    setPlayingPause();
    resetStatesFull();
  }, [playLyricCount]);

  // Update ball history
  const updateBallHistoryFull = (pitch: number, volumeValue: number) => {
    const tempHistoryFull = [...ballHistoryFull];
    const tempPitchDiff = [...pitchDiff];
    const ctxdiv = currentX * divisor;
    const ballYtem = map(pitch, initialRange[0], initialRange[1], size[0], -1);
    const tempSizeHistoryFull = [...ballSizeHistoryFull];

    if (currentX < desiredLength - 1) {
      setShouldDisabled(false);
      tempHistoryFull[ctxdiv] = pitch;
      tempSizeHistoryFull[ctxdiv] = volumeValue;
      setColorChangesFull(currentColors => {
        const newColors = [...currentColors];
        const mappedJsonValue = map(
          pitchArrayCus[ctxdiv],
          initialRange[0],
          initialRange[1],
          size[0],
          0
        );
        const difference = Math.abs(mappedJsonValue - ballYtem);
        const difference_threshold =
          canvasHeight * (25 / (initialRange[1] - initialRange[0]));
        if (pitch > 1) {
          tempPitchDiff.push(Math.abs(pitchArrayCus[ctxdiv] - pitch));
        }
        if (difference <= difference_threshold && !isNaN(difference)) {
          for (
            let j = ctxdiv - divisor;
            j <= ctxdiv + divisor && j < CanvasLength;
            j++
          ) {
            newColors[j] = true;
          }
        }
        return newColors;
      });
    } else {
      setShouldDisabled(true);
      if (!shouldDisabled) {
        setPlayingPause();
      }
    }
    setCurrentX(currentX + 1);
    setBallHistoryFull(tempHistoryFull);
    setBallSizeHistoryFull(tempSizeHistoryFull);
    setPitchDiff(tempPitchDiff);
  };
  useEffect(() => {
    // Only update ballHistory at currentX position
    if (isPlaying) {
      if (pitch !== null) {
        updateBallHistoryFull(pitch, volume);
        // updateBallSizeHistoryFull(volume);
      } else {
        updateBallHistoryFull(0, 0);
        // updateBallSizeHistoryFull(0);
      }
    }
  }, [pitch, isPlaying]);

  // restart
  useEffect(() => {
    if (shouldDisabled && isPlaying) {
      resetStatesFull();
      setShouldDisabled(false);
    }
  }, [isPlaying]);

  // color
  //   const updateBallSizeHistoryFull = (volumeVal: number) => {
  //     let tempHistoryFull = [...ballSizeHistoryFull];
  //     tempHistoryFull.splice(0, divisor);
  //     for (let i = 0; i < divisor - 1; i++) {
  //         tempHistoryFull.push(NaN);
  //     }
  //     tempHistoryFull.push(volumeVal);
  //     setBallSizeHistoryFull(tempHistoryFull);
  // };

  return (
    <Row style={{maxHeight: '27vw', marginBottom: '5vw', maxWidth: '100vw'}}>
      <Col span={1}></Col>
      <Col span={22}>
        <div className="yAxisArea" style={{height: canvasHeight}}>
          <Row style={{height: canvasHeight}}>
            <Col span={8}>
              {showNotesPar ? (
                <div
                  style={{height: canvasHeight}}
                  className={`yAxisLabel yAxisLabel-${theme}`}
                >
                  Pitch (Notes)
                </div>
              ) : (
                <div
                  style={{height: canvasHeight}}
                  className={`yAxisLabel yAxisLabel-${theme}`}
                >
                  Pitch (Hz)
                </div>
              )}
            </Col>
            <Col span={8}>
              <div
                className={`yAxisNumbers yAxisNumbers-${theme}`}
                style={{height: canvasHeight * 1.039}}
              >
                {showNotesPar
                  ? notesLabel?.map((note, index) => (
                      <div key={index}>{note}</div>
                    )) ?? []
                  : freqLabel?.map((freq, index) => (
                      <div key={index}>{freq}</div>
                    )) ?? []}
              </div>
            </Col>
            <Col span={8}>
              <div
                className={`yAxisLines yAxisLines-${theme}`}
                style={{height: canvasHeight}}
              >
                {freqLabel?.map(() => <div></div>) ?? []}
              </div>
            </Col>
          </Row>
        </div>

        <div style={{height: canvasHeight}}>
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            id="pitchCanvas"
            className={`pitchCanvas-${theme}`}
            width={size[1]}
            height={size[0]}
            style={{border: '1px solid #000'}}
          ></canvas>
          <div
            className="XAxisNum"
            style={{
              top: canvasHeight,
              width: canvasHeight * 3.486,
            }}
          >
            {[...Array(11)].map((_, index) => (
              <div key={index} style={{position: 'relative'}}>
                <div className={`timeMarkerLine timeMarkerLine-${theme}`} />
                <span className={`timeMarkerNum timeMarkerNum-${theme}`}>
                  {((15 / (divisor / 4)) * (index / 10)).toFixed(1)}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              top: canvasHeight * 1.12,
              width: canvasHeight * 3.486,
            }}
            className={`XAxis XAxis-${theme}`}
          >
            <div>Time (Seconds)</div>
          </div>
        </div>
      </Col>
      <Col span={1}>
        <div>
          <Slider
            vertical
            range
            min={initialRange[0]}
            max={initialRange[1]}
            style={{marginTop: 0, height: canvasHeight}}
            onChange={onChange}
            defaultValue={inputValue}
          />
        </div>
      </Col>
    </Row>
  );
};

export default Stair;
