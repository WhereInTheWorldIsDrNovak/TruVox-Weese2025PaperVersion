import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {map, drawBackground} from '../function/canvasDefault';
import {Slider, Tooltip, Space} from 'antd';
import {Col, Row, Switch} from 'antd';
import '../CSS/VerticalSlider.css';
import {CONFIG, COLORS, ThemeColors} from '../types/configTypes';
import {useCanvasHooks} from '../hooks/useCanvasHooks';

import * as Tone from 'tone';

import useCanvasRetry from '../hooksUseEffect/useCanvasRetry';
import useCanvasUpdatePitch from '../hooksUseEffect/useCanvasUpdatePitch';
import useCanvasAdjustHeight from '../hooksUseEffect/useCanvasAdjustHeight';
import useCanvasInitializeGetPitch from '../hooksUseEffect/useCanvasInitializeGetPitch';
import useCanvasChangeHzAndNotes from '../hooksUseEffect/useCanvasChangeHzAndNotes';
import useCanvasRedrawBackground from '../hooksUseEffect/useCanvasRedrawBackground';
import useCanvasPitchDiff from '../hooksUseEffect/useCanvasPitchDiff';
import useCanvasCurrentPitch from '../hooksUseEffect/useCanvasCurrentPitch';

const defaultSliderValue = 200;
interface ConstantTxtProps {
  size: number[];
  config: CONFIG;
  COLORS: COLORS;
  isPlaying: boolean;
  showNotesPar: boolean;
  setPlayingPause: () => void;
  isRetry: boolean;
  ballPosition: number;
  divisor: number;
  initialRange: number[];
  handlePitchDiffChange: (e: number[]) => void;
  enableAdvFeatures: boolean;
  theme: string;
  themeColors: ThemeColors;
  colorsMode: string;
}

const ConstantTxt = forwardRef<HTMLDivElement, ConstantTxtProps>(
  (props, ref) => {
    const {
      initialRange,
      divisor,
      ballPosition,
      isRetry,
      setPlayingPause,
      COLORS,
      config,
      isPlaying,
      size,
      showNotesPar,
      handlePitchDiffChange,
      enableAdvFeatures,
      theme,
      themeColors,
      colorsMode,
    } = props;

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

    const ref_volume_slider = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ref_volume_slider.current as HTMLDivElement);
    const [inputValue, setInputValue] = useState(defaultSliderValue);
    const [currentPitchDiffs, setCurrentPitchDiffs] = useState<number[]>([]);
    const [latestAvgPitchDiff, setLatestAvgPitchDiff] = useState<number | null>(
      null
    );

    // Pitch Generator
    const [isPitchPlaying, setIsPitchPlaying] = useState<boolean>(false);
    const [audioPitchVal, setAudioPitchVal] =
      useState<Tone.Unit.Frequency>(defaultSliderValue);
    const [synth, setSynth] = useState<Tone.Synth>();

    // Initialization curve
    const desiredLengthBallNum = Math.floor((size[1] / divisor) * ballPosition);
    const [desiredLengthBall, setDesiredLengthBall] =
      useState<number>(desiredLengthBallNum);
    const [CanvasLengthBall, setCanvasLengthBall] = useState<number>(
      size[1] * ballPosition
    );
    const initialCustomHistoryFull = new Array(CanvasLength).fill(NaN);
    const initialColorChangesFull = new Array(CanvasLength).fill(false);
    const initialBallHistoryFull = new Array(CanvasLengthBall).fill(NaN);
    const [customHistoryFull, setCustomHistoryFull] = useState<number[]>(
      initialCustomHistoryFull
    );
    const [colorChangesFull, setColorChangesFull] = useState<boolean[]>(
      initialColorChangesFull
    );
    const [ballHistoryFull, setBallHistoryFull] = useState<number[]>(
      initialBallHistoryFull
    );

    const sliderRef = useRef<HTMLDivElement>(null);

    const resetStatesFull = () => {
      setCustomHistoryFull([...initialCustomHistoryFull]);
      setColorChangesFull([...initialColorChangesFull]);
      setBallHistoryFull([...initialBallHistoryFull]);
      setPitchDiff([0]);
      setCurrentPitchDiffs([]);
      handlePitchDiffChange([0]);
    };

    const onChangeSlider = (newValue: number) => {
      setInputValue(newValue);
      setAudioPitchVal(newValue);
    };

    useEffect(() => {
      sliderRef.current?.focus();
    }, []);

    const [pitchHistory, setPitchHistory] = useState<number[]>([]);

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

    useEffect(() => {
      setDesiredLengthBall(Math.floor((size[1] / divisor) * ballPosition));
      setCanvasLengthBall(Math.floor(size[1] * ballPosition));
    }, [ballPosition, divisor]);

    useEffect(() => {
      const timer = setTimeout(() => {
        resetStatesFull();
      }, 100);
      return () => clearTimeout(timer);
    }, [desiredLengthBall, CanvasLengthBall]);

    // Rendering balls and customization
    useEffect(() => {
      console.log('Rendering canvas...');
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Clear the canvas
          const textY = 20;
          ctx.clearRect(235, 0, 980, canvas.height);
          ctx.clearRect(0, textY + 3, canvas.width, canvas.height);

          // Draw the background
          drawBackground(
            canvasRef,
            initialRange[1],
            initialRange[0],
            showNotes,
            themeColors[theme][colorsMode].dashedLineColor
          );

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

            ctx.arc(i, mappedValue, 5, 0, 2 * Math.PI);
            ctx.fillStyle = realVoiceColor;
            ctx.fill();
            ctx.closePath();
          }

          // Plot current value
          ctx.beginPath();
          ctx.arc(size[1] * ballPosition, ballYCurr, 10, 0, 2 * Math.PI);
          ctx.fillStyle = currentVoiceColor;
          ctx.fill();
          ctx.closePath();

          for (let i = 0; i < customHistoryFull.length - 40; i++) {
            ctx.beginPath();
            const mappedJsonValue = map(
              customHistoryFull[i],
              initialRange[0],
              initialRange[1],
              size[0],
              0
            );

            if (colorChangesFull[CanvasLength - i]) {
              ctx.fillStyle = closeVoiceColor;
            } else {
              ctx.fillStyle = targetVoiceColor;
            }

            ctx.fillRect(
              CanvasLength - i,
              mappedJsonValue,
              rectWidth,
              rectWidth
            );
            ctx.fill();
            ctx.closePath();
          }
          ctx.stroke();
        }
      }
    }, [COLORS, customHistoryFull, ballYCurr, initialRange]);

    const updateBallHistoryFull = (pitch: number) => {
      const tempHistoryFull = [...ballHistoryFull];
      tempHistoryFull.splice(0, divisor);
      for (let i = 0; i < divisor - 1; i++) {
        tempHistoryFull.push(NaN);
      }
      tempHistoryFull.push(pitch);
      setBallHistoryFull(tempHistoryFull);
      console.log('Updated ball history:', tempHistoryFull);
    };

    const updateCustomHistoryFull = (inputValue: number) => {
      const tempHistoryFull = [...customHistoryFull];
      const tempPitchDiff = [...pitchDiff];

      tempHistoryFull.splice(-divisor, divisor);
      for (let i = 0; i < divisor; i++) {
        tempHistoryFull.unshift(inputValue);
      }
      setCustomHistoryFull(tempHistoryFull);

      setColorChangesFull(currentColors => {
        const newColors = [...currentColors];
        for (let i = 0; i < CanvasLengthBall; i++) {
          const ballYtem = map(
            ballHistoryFull[i],
            initialRange[0],
            initialRange[1],
            size[0],
            -1
          );
          if (!isNaN(ballHistoryFull[i])) {
            const mappedJsonValue = map(
              customHistoryFull[CanvasLength - i],
              initialRange[0],
              initialRange[1],
              size[0],
              0
            );
            const difference = Math.abs(mappedJsonValue - ballYtem);
            if (difference <= 40 && !isNaN(difference)) {
              for (
                let j = i - divisor;
                j <= i + divisor && j < CanvasLengthBall;
                j++
              ) {
                newColors[j] = true;
              }
              i += divisor;
            } else {
              newColors[i] = false;
            }
          } else {
            newColors[i] = newColors[i - 1];
          }
        }

        return newColors;
      });
      if (ballHistoryFull[CanvasLengthBall - 1] > 1) {
        tempPitchDiff.push(
          Math.abs(
            customHistoryFull[CanvasLength - CanvasLengthBall] -
              ballHistoryFull[CanvasLengthBall - 1]
          )
        );
      }
      if (tempPitchDiff.length > 50) {
        tempPitchDiff.shift();
      }
      setPitchDiff(tempPitchDiff);
      setCurrentPitchDiffs(tempPitchDiff);
      handlePitchDiffChange(tempPitchDiff);
      console.log('Updated custom history:', tempHistoryFull);
    };

    // Update custom history when input value changes
    useEffect(() => {
      if (isPlaying) {
        updateCustomHistoryFull(inputValue);
        if (pitch !== null) {
          updateBallHistoryFull(pitch);
        } else {
          updateBallHistoryFull(0);
        }
      }
    }, [isPlaying, pitch]);

    // Calculate and display average pitch difference for every 10 seconds
    useEffect(() => {
      if (isPlaying) {
        const interval = setInterval(() => {
          const validPitchDiffs = currentPitchDiffs.filter(
            diff => !isNaN(diff)
          );
          const sum = validPitchDiffs.reduce((a, b) => a + b, 0);
          const average =
            validPitchDiffs.length > 0 ? sum / validPitchDiffs.length : 0;
          setLatestAvgPitchDiff(average);

          // Reset the current pitch differences for the next 10 seconds
          setCurrentPitchDiffs([]);
          console.log('New average pitch difference:', average);
        }, 40); // 10 seconds

        return () => clearInterval(interval);
      }
    }, [currentPitchDiffs, isPlaying]);

    useEffect(() => {
      if (synth) {
        synth.triggerRelease();
      }
      if (isPitchPlaying) {
        const synthTemp = new Tone.Synth().toDestination();
        setSynth(synthTemp);
        synthTemp?.triggerAttack(audioPitchVal);
      }
    }, [audioPitchVal]);

    useEffect(() => {
      if (!isPitchPlaying) {
        if (synth) {
          synth.triggerRelease();
        }
      } else {
        const synthTemp = new Tone.Synth().toDestination();
        setSynth(synthTemp);
        synthTemp?.triggerAttack(audioPitchVal);
      }
    }, [isPitchPlaying]);

    return (
      <div>
        <Row
          className="canvasMain"
          style={{maxHeight: '27vw', marginBottom: '5vw', maxWidth: '100vw'}}
        >
          <Col span={1}></Col>
          <Col span={21} style={{position: 'relative'}}>
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
                    {freqLabel?.map((_, index) => <div key={index}></div>) ??
                      []}
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
                      {(
                        (15 / (divisor / 4)) *
                        (index / 10 - ballPosition)
                      ).toFixed(1)}
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
          <Col span={2}>
            <Space align="center" size={0} style={{paddingLeft: '5%'}}>
              <div ref={ref_volume_slider}>
                <Slider
                  ref={sliderRef}
                  vertical
                  className="VerticalSlider"
                  min={initialRange[0]}
                  max={initialRange[1]}
                  style={{
                    marginTop: 0,
                    height: canvasHeight,
                    justifySelf: 'right',
                  }}
                  onChange={onChangeSlider}
                  defaultValue={defaultSliderValue}
                  tooltip={{placement: 'top'}}
                />
              </div>
              <Tooltip title="If enabled, a sound will play at the currently selected target pitch value">
                <Switch
                  defaultChecked={isPitchPlaying}
                  onChange={setIsPitchPlaying}
                  checkedChildren="🎵"
                  unCheckedChildren="🎵"
                  style={{rotate: '90deg'}}
                  className={`customSwitch-${theme}`}
                />
              </Tooltip>
            </Space>
          </Col>
        </Row>

        {/* Output the average pitch difference below the canvas */}
        {/* <div style={{ textAlign: 'center', marginTop: '20px'}}>
                <Title level={4}>
                    Average Pitch Difference in the last 10 seconds: {latestAvgPitchDiff !== null ? latestAvgPitchDiff.toFixed(2) : latestAvgPitchDiff}
                </Title>
                        </div>*/}
      </div>
    );
  }
);

export default ConstantTxt;
