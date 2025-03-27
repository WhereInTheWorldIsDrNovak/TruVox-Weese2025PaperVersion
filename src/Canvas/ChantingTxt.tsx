import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {map, drawBackground} from '../function/canvasDefault';
import {
  Slider,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Tooltip,
  Switch,
} from 'antd';
import '../CSS/VerticalSlider.css';
import {useCanvasHooks} from '../hooks/useCanvasHooks';

import * as Tone from 'tone';

import useCanvasCurrentPitch from '../hooksUseEffect/useCanvasCurrentPitch';
import useCanvasRetry from '../hooksUseEffect/useCanvasRetry';
import useCanvasUpdatePitch from '../hooksUseEffect/useCanvasUpdatePitch';
import useCanvasAdjustHeight from '../hooksUseEffect/useCanvasAdjustHeight';
import useCanvasInitializeGetPitch from '../hooksUseEffect/useCanvasInitializeGetPitch';
import useCanvasChangeHzAndNotes from '../hooksUseEffect/useCanvasChangeHzAndNotes';
import useCanvasRedrawBackground from '../hooksUseEffect/useCanvasRedrawBackground';
import useCanvasPitchDiff from '../hooksUseEffect/useCanvasPitchDiff';
import {useTemString} from '../hooks/useTemString';
import {COLORS, ThemeColors} from '../types/configTypes';

const {Title} = Typography;

const defaultSliderValue = 200;
interface ChantingTxtProps {
  initialRange: number[];
  divisor: number;
  ballPosition: number;
  isRetry: boolean;
  type: 'Level 1' | 'Level 3' | 'Level 2' | 'Level 4';
  setPlayingPause: () => void;
  COLORS: COLORS;
  showNotesPar: boolean;
  size: number[];
  config: {
    SRATE: number;
    fxmin: number;
    fxlow: number;
    fxhigh: number;
    fxmax: number;
  };
  isPlaying: boolean;
  showBall: boolean;
  chantingStep: number;
  setChantingStep: (step: number) => void;
  setChantingActualPitch: (pitch: number[]) => void;
  setChantingMeanPitch: (meanPitch: number | null) => void;
  setCurrentSentenceIndex: (index: number) => void;
  enableAdvFeatures: boolean;
  theme: string;
  themeColors: ThemeColors;
  colorsMode: string;
}

const ChantingTxt = forwardRef<HTMLDivElement, ChantingTxtProps>(
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
      showBall,
      type,
      chantingStep,
      setChantingStep,
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

    const ref4 = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ref4.current as HTMLDivElement);
    const [inputValue, setInputValue] = useState(defaultSliderValue); // Initialize target pitch at 200 Hz

    const [chantingActualPitch, setChantingActualPitch] = useState<number[]>(
      []
    );
    const [chantingMeanPitch, setChantingMeanPitch] = useState<number | null>(
      null
    );
    const [currentSentenceIndex] = useState(1);

    // Pitch Generator
    const [isPitchPlaying, setIsPitchPlaying] = useState<boolean>(false);
    const [audioPitchVal, setAudioPitchVal] =
      useState<Tone.Unit.Frequency>(defaultSliderValue); // Set Tone to low pitch val
    const [synth, setSynth] = useState<Tone.Synth>();

    // Initialization curve
    const [CanvasLengthBall] = useState<number>(size[1] * ballPosition);
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
    const resetStatesFull = () => {
      setCustomHistoryFull([...initialCustomHistoryFull]);
      setColorChangesFull([...initialColorChangesFull]);
      setBallHistoryFull([...initialBallHistoryFull]);
      setPitchDiff([0]);
    };

    const [pitchHistory, setPitchHistory] = useState<number[]>([]);

    const onChangeSlider = (newValue: number) => {
      setInputValue(newValue);
      setAudioPitchVal(newValue);
    };
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
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Clear the canvas
          ctx.clearRect(235, 0, 980, canvas.height);
          ctx.clearRect(0, 20 + 3, canvas.width, canvas.height);

          // Draw the background
          drawBackground(
            canvasRef,
            initialRange[1],
            initialRange[0],
            showNotes,
            themeColors[theme][colorsMode].dashedLineColor
          );

          // Draw the target pitch line
          ctx.beginPath();
          const targetY = map(
            inputValue,
            initialRange[0],
            initialRange[1],
            size[0],
            -1
          );
          ctx.moveTo(0, targetY);
          ctx.lineTo(size[1], targetY);
          ctx.strokeStyle = targetVoiceColor;
          ctx.stroke();
          ctx.closePath();

          if (showBall && chantingStep !== 3) {
            // New: Draw the ball's historical positions
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
          }

          for (let i = 0; i < customHistoryFull.length - 40; i++) {
            ctx.beginPath();
            const mappedJsonValue = map(
              customHistoryFull[i],
              initialRange[0],
              initialRange[1],
              size[0],
              0
            );
            ctx.fillStyle =
              chantingStep !== 3 && colorChangesFull[CanvasLength - i]
                ? closeVoiceColor
                : targetVoiceColor;

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
    }, [
      COLORS,
      customHistoryFull,
      ballYCurr,
      initialRange,
      inputValue,
      showBall,
      chantingStep,
    ]);

    const updateBallHistoryFull = (pitch: number) => {
      const tempHistoryFull = [...ballHistoryFull];
      tempHistoryFull.splice(0, divisor);
      for (let i = 0; i < divisor - 1; i++) {
        tempHistoryFull.push(NaN);
      }
      tempHistoryFull.push(pitch);
      setBallHistoryFull(tempHistoryFull);
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
          const userPitchHz = ballHistoryFull[i];
          if (!isNaN(userPitchHz)) {
            const targetPitchHz = customHistoryFull[CanvasLength - i];
            const differenceHz = Math.abs(userPitchHz - targetPitchHz);
            if (differenceHz <= 10 && !isNaN(differenceHz)) {
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
      if (tempPitchDiff.length > 150) {
        tempPitchDiff.shift();
      }
      setPitchDiff(tempPitchDiff);
    };

    // Update custom history when input value changes
    useEffect(() => {
      if (isPlaying) {
        updateCustomHistoryFull(inputValue);
        if (pitch !== null) {
          updateBallHistoryFull(pitch);
          // Update the actual pitch array for the chanting exercise
          setChantingActualPitch(prevPitches => [...prevPitches, pitch]);
        }
      }
    }, [isPlaying, pitch]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Clear the canvas
          ctx.clearRect(235, 0, 980, canvas.height);
          ctx.clearRect(0, 20 + 3, canvas.width, canvas.height);

          // Draw the background
          drawBackground(
            canvasRef,
            initialRange[1],
            initialRange[0],
            showNotes,
            themeColors[theme][colorsMode].dashedLineColor
          );

          // Draw the target pitch line
          ctx.beginPath();
          const targetY = map(
            inputValue,
            initialRange[0],
            initialRange[1],
            size[0],
            -1
          );
          ctx.moveTo(0, targetY);
          ctx.lineTo(size[1], targetY);
          ctx.strokeStyle = targetVoiceColor;
          ctx.stroke();
          ctx.closePath();

          if (showBall && chantingStep !== 3) {
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
          }

          for (let i = 0; i < customHistoryFull.length - 40; i++) {
            ctx.beginPath();
            const mappedJsonValue = map(
              customHistoryFull[i],
              initialRange[0],
              initialRange[1],
              size[0],
              0
            );
            ctx.fillStyle =
              chantingStep !== 3 && colorChangesFull[CanvasLength - i]
                ? closeVoiceColor
                : targetVoiceColor;

            ctx.fillRect(
              CanvasLength - i,
              mappedJsonValue,
              rectWidth,
              rectWidth
            );
            ctx.fill();
            ctx.closePath();
          }

          // Display "Recording, feedback hidden..." during step 3
          if (chantingStep === 3) {
            ctx.font = '24px Arial';
            ctx.fillStyle = 'blue';
            ctx.fillText(
              'Recording, feedback hidden...',
              canvas.width / 2 - 120,
              canvas.height / 2 - 15
            );
          }

          ctx.stroke();
        }
      }
    }, [
      COLORS,
      customHistoryFull,
      ballYCurr,
      initialRange,
      inputValue,
      showBall,
      chantingStep,
    ]);

    useEffect(() => {
      if (isPlaying && chantingStep !== 3) {
        updateCustomHistoryFull(inputValue);
        if (pitch !== null) {
          updateBallHistoryFull(pitch);
          // Update the actual pitch array for the chanting exercise
          setChantingActualPitch(prevPitches => [...prevPitches, pitch]);
        } else {
          updateBallHistoryFull(0);
          setChantingActualPitch(prevPitches => [...prevPitches, 0]);
        }
      }
    }, [isPlaying, pitch, chantingStep]);

    // Check if the target pitch has been maintained for the required duration
    useEffect(() => {
      if (chantingStep === 1 && chantingActualPitch.length > 50) {
        const recentPitches = chantingActualPitch.slice(-50); // Last 2 seconds of pitches
        const closeEnoughPitches = recentPitches.filter(
          p => Math.abs(p - inputValue) < 10
        ); // Within 10 Hz of target
        if (closeEnoughPitches.length > 33) {
          setChantingStep(2); // Advance to step 2 if in step 1
        }
      }
    }, [chantingActualPitch, chantingStep]);

    const {
      mVoicedSentences,
      nVoicedSentences,
      mVoicedVoicelessSentences,
      nVoicedVoicelessSentences,
    } = useTemString(theme);

    const sentences = {
      'M-Voiced': mVoicedSentences,
      'N-Voiced': nVoicedSentences,
      'M-Voiceless': mVoicedVoicelessSentences,
      'N-Voiceless': nVoicedVoicelessSentences,
    };

    const calculateMeanPitch = (
      pitches: number[],
      targetPitch: number,
      minPitch: number,
      maxPitch: number
    ) => {
      const validPitches = pitches.filter(
        pitch =>
          pitch > minPitch &&
          pitch < maxPitch &&
          pitch !== targetPitch &&
          pitch !== 0
      );
      const sum = validPitches.reduce((a, b) => a + b, 0);
      return validPitches.length > 0 ? sum / validPitches.length : 0;
    };

    useEffect(() => {
      if (chantingStep === 4) {
        const meanPitchValue = calculateMeanPitch(
          chantingActualPitch,
          inputValue,
          initialRange[0],
          initialRange[1]
        );
        setChantingMeanPitch(meanPitchValue);
        // Stop the ball movement and reset the canvas
        setPlayingPause();
        resetStatesFull();
      }
    }, [chantingStep]);

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
      if (!isPitchPlaying || isPlaying) {
        if (synth) {
          synth.triggerRelease();
          setIsPitchPlaying(false);
        }
      } else {
        const synthTemp = new Tone.Synth().toDestination();
        setSynth(synthTemp);
        synthTemp?.triggerAttack(audioPitchVal);
      }
    }, [isPitchPlaying, isPlaying]);

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
              <div>
                <Slider
                  vertical
                  className={`VerticalSlider VerticalSlider-${theme}`}
                  min={initialRange[0]}
                  max={initialRange[1]}
                  style={{
                    marginTop: 0,
                    height: canvasHeight,
                    justifySelf: 'right',
                  }}
                  onChange={onChangeSlider}
                  defaultValue={200}
                  tooltip={{placement: 'top'}}
                />
              </div>
              <Tooltip title="If enabled, a sound will play at the target pitch for each step">
                <Switch
                  defaultChecked={isPitchPlaying}
                  onChange={setIsPitchPlaying}
                  disabled={isPlaying}
                  checked={!isPlaying && isPitchPlaying}
                  checkedChildren="🎵"
                  unCheckedChildren="🎵"
                  style={{rotate: '90deg'}}
                  className={`customSwitch-${theme}`}
                />
              </Tooltip>
            </Space>
          </Col>
        </Row>

        {chantingStep === 1 && (
          <div
            style={{
              textAlign: 'center',
              paddingTop: '20px',
              marginBottom: '-15px',
              marginTop: '-0.3rem',
            }}
          >
            <Title level={3} className={`text-${theme}`}>
              Hum at the Target Pitch.
            </Title>
            <div
              style={{
                paddingLeft: '120px',
                paddingTop: '10px',
              }}
            >
              {sentences[type as keyof typeof sentences] &&
                sentences[type as keyof typeof sentences][
                  currentSentenceIndex
                ] && (
                  <Title level={5} className={`text-${theme}`}>
                    {
                      sentences[type as keyof typeof sentences][
                        currentSentenceIndex
                      ]
                    }
                  </Title>
                )}
            </div>
          </div>
        )}

        {chantingStep === 2 && (
          <div
            style={{
              paddingTop: '17px',
              marginBottom: '-110px',
              textAlign: 'center',
            }}
          >
            <Title
              level={4}
              className={`text-${theme}`}
              style={{marginTop: '-0.1rem'}}
            >
              Great! Now say the following phrase while maintaining the target
              pitch:
            </Title>
            {sentences[type as keyof typeof sentences] &&
              sentences[type as keyof typeof sentences][
                currentSentenceIndex
              ] && (
                <div
                  style={{
                    paddingLeft: '120px',
                    paddingTop: '10px',
                    fontSize: '250px',
                  }}
                >
                  <Title
                    level={2}
                    style={{fontSize: '21vh'}}
                    className={`text-${theme}`}
                  >
                    {
                      sentences[type as keyof typeof sentences][
                        currentSentenceIndex
                      ]
                    }
                  </Title>
                </div>
              )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '60px',
                marginBottom: '4.5vh',
                marginLeft: '32vh',
              }}
            >
              <Button
                style={{width: '12vh', marginLeft: '5vh'}}
                onClick={() => setChantingStep(3)}
                className={`customButton-${theme}`}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {chantingStep === 3 && (
          <div
            style={{
              paddingTop: '15px',
              marginBottom: '-2vh',
              textAlign: 'center',
              marginTop: '-0.3rem',
            }}
          >
            <Title level={4} className={`text-${theme}`}>
              Speak the same phrase at your normal pace at the same pitch.
            </Title>

            {sentences[type as keyof typeof sentences] &&
              sentences[type as keyof typeof sentences][
                currentSentenceIndex
              ] && (
                <div
                  style={{
                    paddingLeft: '650px',
                    paddingTop: '10px',
                    marginBottom: '20px',
                  }}
                >
                  <Title level={4} className={`text-${theme}`}>
                    {
                      sentences[type as keyof typeof sentences][
                        currentSentenceIndex
                      ]
                    }
                  </Title>
                </div>
              )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '62px',
                marginLeft: '35vh',
              }}
            >
              <Button
                style={{
                  marginBottom: '-130px',
                  textAlign: 'center',
                  width: '20vh',
                }}
                onClick={() => setChantingStep(4)}
                className={`customButton-${theme}`}
              >
                Finish Exercise
              </Button>
            </div>
          </div>
        )}

        {chantingStep === 4 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              paddingTop: '20px',
              marginBottom: '28px',
              marginTop: '-0.3rem',
            }}
          >
            <Title level={4} className={`text-${theme}`}>
              Well done! Your mean pitch was {chantingMeanPitch?.toFixed(2)} Hz.
            </Title>
          </div>
        )}
      </div>
    );
  }
);

export default ChantingTxt;
