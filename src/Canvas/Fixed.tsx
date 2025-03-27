import React, {useEffect, useState} from 'react';
import {map, drawBackground} from '../function/canvasDefault';
import {Col, Row} from 'antd';
import {CONFIG, COLORS, ThemeColors} from '../types/configTypes';

import {useCanvasHooks} from '../hooks/useCanvasHooks'; // variables and functions

import useCanvasRetry from '../hooksUseEffect/useCanvasRetry';
import useCanvasUpdatePitch from '../hooksUseEffect/useCanvasUpdatePitch';
import useCanvasAdjustHeight from '../hooksUseEffect/useCanvasAdjustHeight';
import useCanvasInitializeGetPitch from '../hooksUseEffect/useCanvasInitializeGetPitch';
import useCanvasChangeHzAndNotes from '../hooksUseEffect/useCanvasChangeHzAndNotes';
import useCanvasRedrawBackground from '../hooksUseEffect/useCanvasRedrawBackground';
import useCanvasCurrentPitch from '../hooksUseEffect/useCanvasCurrentPitch';
import useCanvasPitchDiff from '../hooksUseEffect/useCanvasPitchDiff';
import generatePitchArrayFromJson from '../function/generatePitchArrayFromJson';

const CANVAS_WIDTH = 1400;

interface FixedProps {
  size: number[];
  config: CONFIG;
  isPlaying: boolean;
  COLORS: COLORS;
  showNotesPar: boolean;
  playLyricCount: number;
  gender: string;
  syllableCount: string;
  genderName: string;
  onPlayLyricCountChange: (newCount: number) => void;
  setBaseFilenames: (filenames: string[]) => void;
  onAudioSrcChange: (newAudioSrc: string) => void;
  isRetry: boolean;
  setPlayingPause: () => void;
  divisor: number;
  initialRange: number[];
  isListen: number;
  setIsListen: (num: number) => void;
  setMaxLyricCount: (num: number) => void;
  enableAdvFeatures: boolean;
  theme: string;
  themeColors: ThemeColors;
  colorsMode: string;
}

const Fixed: React.FC<FixedProps> = ({
  setMaxLyricCount,
  setIsListen,
  isListen,
  initialRange,
  divisor,
  isRetry,
  setPlayingPause,
  gender,
  genderName,
  onAudioSrcChange,
  setBaseFilenames,
  syllableCount,
  onPlayLyricCountChange,
  config,
  COLORS,
  size,
  playLyricCount,
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

  const [shouldDisabled, setShouldDisabled] = useState<boolean>(false);
  const desiredLength = Math.floor(size[1] / divisor);
  const initialColorChangesFull = new Array(CanvasLength).fill(false);
  const initialBallHistoryFull = new Array(CanvasLength).fill(NaN);
  const [colorChangesFull, setColorChangesFull] = useState<boolean[]>(
    initialColorChangesFull
  );
  const [ballHistoryFull, setBallHistoryFull] = useState<number[]>(
    initialBallHistoryFull
  );
  const resetStatesFull = () => {
    setColorChangesFull([...initialColorChangesFull]);
    setBallHistoryFull([...initialBallHistoryFull]);
    setCurrentX(initialcurrentX);
    setPitchDiff([0]);
  };

  const [pitchArray, setPitchArray] = useState<number[]>([]);
  const [jsonFiles, setJsonFiles] = useState<string[]>([]);
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [pitchHistory, setPitchHistory] = useState<number[]>([0]);
  const [averagePitchDiffsArray, setAveragePitchDiffsArray] = useState<
    number[]
  >([]);
  const [, setAttemptCount] = useState<number>(0);
  const [, setAveragePitchDiff] = useState<number>(0);
  const [isBallStopped, setIsBallStopped] = useState<boolean>(false);
  const [maxMilliseconds, setMaxMilliseconds] = useState<number>(6000); // default maximum on the graph's x-axis, in milliseconds

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

  // update pitchDiff text
  useCanvasPitchDiff(
    canvasRef,
    pitchDiff,
    initialRange,
    enableAdvFeatures,
    themeColors[theme][colorsMode].textColor
  );

  // display current pitch
  useCanvasCurrentPitch(
    canvasRef,
    pitch,
    pitchHistory,
    setPitchHistory,
    initialRange,
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

  // render user curve
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
          showNotes,
          themeColors[theme][colorsMode].dashedLineColor
        );

        for (let i = 0 + offset; i < pitchArray.length; i++) {
          const mappedJsonValue = map(
            pitchArray[i],
            initialRange[0],
            initialRange[1],
            size[0],
            0
          );
          if (colorChangesFull[i]) {
            ctx.fillStyle = closeVoiceColor;
          } else {
            ctx.fillStyle = targetVoiceColor;
          }

          ctx.fillRect(i, mappedJsonValue, rectWidth, rectWidth);
        }

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

        ctx.beginPath();
        ctx.arc(currentX * divisor, ballYCurr, 10, 0, 2 * Math.PI);
        ctx.fillStyle = currentVoiceColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }, [
    COLORS,
    initialRange,
    pitchArray,
    ballHistoryFull,
    showNotes,
    showNotesPar,
  ]);

  // render listen curve
  useEffect(() => {
    resetStatesFull();
    setPlayingPause();
    const canvas = canvasRef.current;
    let animationFrameId: number;

    if (isListen > 1 && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear the canvas before rendering new elements
        const textX = canvas.width - 100;
        const textY = 20;
        ctx.clearRect(0, 0, textX - 5, canvas.height);
        ctx.clearRect(0, textY + 5, canvas.width, canvas.height - (textY + 5));

        drawBackground(
          canvasRef,
          initialRange[1],
          initialRange[0],
          showNotes,
          themeColors[theme][colorsMode].dashedLineColor
        );

        let drawnUntil = 0;
        let lastFrameTime = Date.now();

        const draw = () => {
          const now = Date.now();
          const deltaTime = now - lastFrameTime;
          const elementsPerFrame = deltaTime * (CANVAS_WIDTH / maxMilliseconds); // Controls the speed that the curve lights up. Converts the change in time to a change in "elements" using a conversion factor based on the fact that CANVAS_WIDTH = maxMilliseconds.
          console.log(deltaTime);
          console.log(`Elements Per Frame: ${elementsPerFrame}`);
          for (
            let j = 0;
            j < elementsPerFrame && drawnUntil < pitchArray.length;
            j++, drawnUntil++
          ) {
            const i = drawnUntil;
            const mappedJsonValue = map(
              pitchArray[drawnUntil],
              initialRange[0],
              initialRange[1],
              size[0],
              0
            );
            ctx.fillStyle = closeVoiceColor;
            ctx.fillRect(i, mappedJsonValue, rectWidth + 3, rectWidth + 3);
          }

          if (drawnUntil < pitchArray.length) {
            lastFrameTime = now;
            animationFrameId = requestAnimationFrame(draw);
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        };

        draw();

        return () => {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
        };
      }
    }
  }, [isListen, pitchArray]);

  useEffect(() => {
    setIsListen(1);
  }, [pitchArray]);

  useEffect(() => {
    let url = '';
    if (gender === 'male') {
      url =
        'https://ceas5.uc.edu/transvoice/jsondata/' +
        syllableCount +
        '/' +
        gender +
        '/list.json';
    } else {
      url =
        'https://ceas5.uc.edu/transvoice/jsonDataOm/' +
        gender +
        '/' +
        genderName +
        '/' +
        syllableCount +
        'syllable/list.json';
    }

    if (jsonFiles.length > playLyricCount) {
      const filename = jsonFiles[playLyricCount];

      if (gender === 'male') {
        url =
          'https://ceas5.uc.edu/transvoice/jsondata/' +
          syllableCount +
          '/' +
          gender +
          '/' +
          filename;
      } else {
        url =
          'https://ceas5.uc.edu/transvoice/jsonDataOm/' +
          gender +
          '/' +
          genderName +
          '/' +
          syllableCount +
          'syllable/' +
          filename;
      }
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const pitches = generatePitchArrayFromJson(
            maxMilliseconds,
            data.data
          );
          setPitchArray(pitches);
        })
        .catch(error => {
          console.error('Error fetching the JSON file:', error);
        });
    }
  }, [playLyricCount, jsonFiles]);

  useEffect(() => {
    const longestTimes = localStorage.getItem('humanCurveLongestTimes');
    if (longestTimes) {
      const longestTimeSeconds =
        JSON.parse(longestTimes)[gender][genderName][
          syllableCount + 'syllable'
        ];
      const longestTimeMilliseconds = longestTimeSeconds * 1000;
      setMaxMilliseconds(longestTimeMilliseconds * 1.2); // Adds a little extra space at the end to make up for inaccuracies in canvas curve rendering
    } else {
      (async () => {
        const url =
          'https://ceas5.uc.edu/transvoice/jsonDataOm/precomputedLongestTimes.json';
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const longestTimes = await response.json();
            localStorage.setItem(
              'humanCurveLongestTimes',
              JSON.stringify(longestTimes)
            );
            const longestTimeSeconds =
              longestTimes[gender][genderName][syllableCount + 'syllable'];
            const longestTimeMilliseconds = longestTimeSeconds * 1000;
            setMaxMilliseconds(longestTimeMilliseconds * 1.2);
          }
        } catch (error) {
          console.error('Error fetching JSON data:', error);
        }
      })();
    }
  }, [gender, genderName, syllableCount]);

  useEffect(() => {
    let url = '';
    if (gender === 'male') {
      url =
        'https://ceas5.uc.edu/transvoice/jsondata/' +
        syllableCount +
        '/' +
        gender +
        '/list.json';
    } else {
      url =
        'https://ceas5.uc.edu/transvoice/jsonDataOm/' +
        gender +
        '/' +
        genderName +
        '/' +
        syllableCount +
        'syllable/list.json';
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(async data => {
        setJsonFiles(data.json_files);

        const modifiedArray = data.base_filenames.map((element: any) =>
          element.replaceAll('_', ' ')
        );
        setMaxLyricCount(data.base_filenames.length - 1);
        setBaseFilenames(modifiedArray);

        if (data.base_filenames.length > 0) {
          let url = '';
          if (gender === 'male') {
            url =
              'https://ceas5.uc.edu/transvoice/jsondata/' +
              syllableCount +
              '/' +
              gender +
              '/' +
              data.json_files[0];
          } else {
            url =
              'https://ceas5.uc.edu/transvoice/jsonDataOm/' +
              gender +
              '/' +
              genderName +
              '/' +
              syllableCount +
              'syllable/' +
              data.json_files[0];
          }

          return fetch(url);
        } else {
          throw new Error('No files available');
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(firstFileData => {
        const pitches = generatePitchArrayFromJson(
          maxMilliseconds,
          firstFileData.data
        );
        setPitchArray(pitches);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    onPlayLyricCountChange(0);
  }, [maxMilliseconds]);

  useEffect(() => {
    if (jsonFiles.length > 0) {
      let audioFilename = '';
      let audioUrl = '';
      if (gender === 'male') {
        audioFilename = `${gender}-${jsonFiles[playLyricCount].replace(
          '.json',
          ''
        )}.wav`;
        audioUrl = `https://ceas5.uc.edu/transvoice/audio/${syllableCount}/${gender}/${audioFilename}`;
      } else {
        audioFilename = `${genderName}-${gender}-${jsonFiles[
          playLyricCount
        ].replace('.json', '')}.wav`;
        audioUrl = `https://ceas5.uc.edu/transvoice/audioOm/${gender}/${genderName}/${syllableCount}syllable/${audioFilename}`;
      }
      setAudioSrc(audioUrl);
    }
  }, [syllableCount, gender, playLyricCount, jsonFiles]);

  useEffect(() => {
    onAudioSrcChange(audioSrc);
  }, [audioSrc, onAudioSrcChange]);

  const updateBallHistoryFull = (pitch: number) => {
    const tempHistoryFull = [...ballHistoryFull];
    const ctxdiv = currentX * divisor;
    const tempPitchDiff = [...pitchDiff];

    const ballYtem = map(pitch, initialRange[0], initialRange[1], size[0], -1);
    if (currentX < desiredLength - 1) {
      setShouldDisabled(false);
      tempHistoryFull[ctxdiv] = pitch;
      setColorChangesFull(currentColors => {
        const newColors = [...currentColors];
        const mappedJsonValue = map(
          pitchArray[ctxdiv],
          initialRange[0],
          initialRange[1],
          size[0],
          0
        );
        const difference = Math.abs(mappedJsonValue - ballYtem);
        if (pitch > 1 && pitchArray[ctxdiv] !== 0) {
          tempPitchDiff.push(Math.abs(pitchArray[ctxdiv] - pitch));
        }
        if (difference <= 50 && !isNaN(difference)) {
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
      setIsBallStopped(true);
      if (!shouldDisabled) {
        setPlayingPause();
      }
    }
    setCurrentX(currentX + 1);
    setBallHistoryFull(tempHistoryFull);
    setPitchDiff(tempPitchDiff);
  };

  useEffect(() => {
    if (isPlaying) {
      if (pitch !== null) {
        updateBallHistoryFull(pitch);
      } else {
        updateBallHistoryFull(0);
      }
    }
  }, [pitch, isPlaying]);

  useEffect(() => {
    if (isBallStopped && pitchDiff.length > 0) {
      const sum = pitchDiff.reduce((a, b) => a + b, 0);
      const avgDiff = sum / pitchDiff.length;
      setAveragePitchDiff(avgDiff);

      setAveragePitchDiffsArray(prevArray => [...prevArray.slice(-9), avgDiff]);
      setAttemptCount(prevCount => (prevCount + 1) % 10);
      setIsBallStopped(false);
    }
  }, [isBallStopped]);

  useEffect(() => {
    if (shouldDisabled && isPlaying) {
      resetStatesFull();
      setShouldDisabled(false);
    }
  }, [isPlaying]);

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
                {freqLabel?.map((_, index) => <div></div>) ?? []}
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
                  {/* Since divisor is 10 by default, this equation just converts maxMilliseconds from milliseconds to seconds, then divides that into 11 parts. */}
                  {maxMilliseconds / 1000 / (divisor / 10) > 1
                    ? (
                        (maxMilliseconds / 1000 / (divisor / 10)) *
                        (index / 10)
                      ).toFixed(1)
                    : (
                        (maxMilliseconds / 1000 / (divisor / 10)) *
                        (index / 10)
                      ).toFixed(2)}
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

        {enableAdvFeatures && (
          <div
            style={{
              marginTop: '10vh',
              marginLeft: '60vw',
              position: 'absolute',
            }}
          >
            {averagePitchDiffsArray.map((diff, index) => (
              <h3
                key={index}
                style={{textAlign: 'center', marginBottom: '15px'}}
                className={`text-${theme}`}
              >
                Average Pitch Difference {index + 1}: {diff.toFixed(2)}
              </h3>
            ))}
          </div>
        )}
      </Col>
      <Col span={1}></Col>
    </Row>
  );
};

export default Fixed;
