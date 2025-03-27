import React, {useState, useEffect} from 'react';
import {getPitch, IPitchDetectionConfig} from '../function/getPitch';
import useAudioRecorder from '../function/AudioRecorder';
import {Button, Statistic, Slider, Typography, Col, Row} from 'antd';
import './';

const {Paragraph} = Typography;
const fontAlign = 'center';
const fontSizePara = 17;

const Assessment: React.FC = () => {
  const [page, setPage] = useState<
    'intro' | 'recording1' | 'recording2' | 'survey' | 'results'
  >('intro');
  const [showRecording, setShowRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false); // State to track recording status
  const [isStopped, setIsStopped] = useState(true); // State to track if the recording has stopped
  const [seconds, setSeconds] = useState<number>(3);
  const [pitch, setPitch] = useState<number | null>(null);
  const [ePitch, setEPitch] = useState<number[] | null>(null);
  const [eMeanPitch, setEMeanPitch] = useState<number | null>(null);
  const [rainbowPitch, setRainbowPitch] = useState<number[] | null>(null);
  const [rainbowMeanPitch, setRainbowMeanPitch] = useState<number | null>(null);
  const {startRecording, stopRecording, recordedAudioURL} = useAudioRecorder();
  const [displayTimer, setDisplayTimer] = useState(false);
  const [recordingIndicator, setRecordingIndicator] = useState(false);

  const marks = {
    0: 'No Effort',
    100: 'A Lot of Effort',
  };

  useEffect(() => {
    // Start the timer interval
    const interval = setInterval(() => {
      if (isRecording && !isStopped) {
        setSeconds(prevSeconds => prevSeconds + 1);
        getPitch(config, handlePitchDetected);
      } else {
        setPitch(null); // Reset the pitch value when not recording
        setSeconds(prevSeconds => prevSeconds - 1);
      }
    }, 1000);

    if (page === 'recording1' && pitch !== null) {
      setEPitch(prevEPitch => (prevEPitch ? [...prevEPitch, pitch] : [pitch]));
    } else if (page === 'recording2' && pitch !== null) {
      setRainbowPitch(prevRainbowPitch =>
        prevRainbowPitch ? [...prevRainbowPitch, pitch] : [pitch]
      );
    }

    // Clear the interval and set recording status when timer hits 0
    if (seconds === 0) {
      setIsRecording(true);
      setRecordingIndicator(true);
      startRecording();
    }
    if (isStopped || (page === 'recording1' && seconds === 5)) {
      stopRecording();
      setRecordingIndicator(false);
      setPitch(null);
      clearInterval(interval);
      if (ePitch !== null) {
        setEMeanPitch(ePitch.reduce((a, b) => a + b, 0) / ePitch.length);
      }
      if (rainbowPitch !== null) {
        setRainbowMeanPitch(
          rainbowPitch.reduce((a, b) => a + b, 0) / rainbowPitch.length
        );
      }
    }
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [seconds, isRecording, isStopped]);

  const handlePitchDetected = (detectedPitch: number | null) => {
    setPitch(detectedPitch);
  };

  const handlePageChange = (
    newPage: 'intro' | 'recording1' | 'recording2' | 'survey' | 'results'
  ) => {
    setSeconds(3); // Reset the timer to 3 seconds
    setIsRecording(false); // Reset the recording status
    setPitch(null);
    setIsStopped(true); // Reset the stopped status
    setDisplayTimer(false); // Hide the timer once page changes
    if (newPage === 'recording1' || newPage === 'recording2') {
      setShowRecording(true);
    } else {
      setShowRecording(false);
    }
    setPage(newPage);
  };

  const startTimer = () => {
    setSeconds(3); // Reset the timer to 3 seconds
    setIsRecording(false); // Reset the recording status
    setPitch(null);
    setIsStopped(false); // Reset the stopped status
    setDisplayTimer(true); // Display the timer once start button is pressed
  };

  const redoTimer = () => {
    setIsRecording(false);
    startTimer();
    setIsStopped(true);
    if (page === 'recording1') {
      setEPitch(null);
    } else if (page === 'recording2') {
      setRainbowPitch(null);
    }
  };

  const handleReplay = () => {
    if (recordedAudioURL) {
      const audioElement = new Audio(recordedAudioURL);
      audioElement.play();
    } else {
      console.error('No audio to replay');
    }
  };

  const stopTimer = () => {
    setIsStopped(true); // Set the stopped status to true
    setPitch(null);
  };

  const config: IPitchDetectionConfig = {
    SRATE: 44100,
    fxmin: 50,
    fxlow: 50 + 50,
    fxhigh: 600 - 200,
    fxmax: 600,
  };

  // Calculate minutes and seconds from total seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format minutes and seconds with leading zeros
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return (
    <div>
      {page === 'intro' && (
        <div style={{width: '100%', textAlign: 'center'}}>
          <Typography>
            <Typography.Title level={2}>
              Welcome to the Assessment Module
            </Typography.Title>
            <Paragraph>
              This module will analyze your voice and give you some basic
              information about it. Press Start to begin.
            </Paragraph>
            <Button onClick={() => handlePageChange('recording1')}>
              Start
            </Button>
          </Typography>
        </div>
      )}

      {showRecording && (
        <div style={{width: '100%', textAlign: 'center'}}>
          <Typography>
            <Typography.Title level={2}>Recording Section</Typography.Title>
            {page === 'recording1' && (
              <div style={{width: '100%', textAlign: 'center'}}>
                <Paragraph
                  style={{textAlign: fontAlign, fontSize: fontSizePara}}
                >
                  Hold an ee sound for five seconds. Press Record to begin
                  recording.
                </Paragraph>
                {!isRecording ? (
                  <div>
                    <Button onClick={startTimer}>Record</Button>
                    <Button onClick={() => handlePageChange('recording2')}>
                      Skip
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button onClick={stopTimer}>Stop</Button>
                    <Button onClick={handleReplay}>Replay</Button>
                    <Button onClick={() => handlePageChange('recording2')}>
                      Continue
                    </Button>
                    <Button onClick={redoTimer}>Redo</Button>
                  </div>
                )}

                {displayTimer && (
                  <div
                    className={`timer-container ${
                      isRecording ? 'recording' : ''
                    }`}
                  >
                    {!isRecording && (
                      <div className="timer">
                        Starting in... {formattedMinutes}:{formattedSeconds}
                      </div>
                    )}
                    {isRecording && recordingIndicator && (
                      <div className="timer">
                        Recording... {formattedMinutes}:{formattedSeconds}
                      </div>
                    )}
                    {isRecording && !recordingIndicator && (
                      <div className="timer">
                        Done... {formattedMinutes}:{formattedSeconds}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {page === 'recording2' && (
              <div style={{width: '100%', textAlign: 'center'}}>
                <Paragraph
                  style={{textAlign: fontAlign, fontSize: fontSizePara}}
                >
                  Read the following text out loud. Press Record to begin
                  recording, and press Stop when you are finished. <br />|{' '}
                  {'\t'}
                  <i>
                    "The rainbow is a division of white light into many
                    beautiful colors. These take the shape of a long round arch,
                    with its path high above, and its two ends apparently beyond
                    the horizon"
                  </i>
                </Paragraph>
                {!isRecording ? (
                  <div>
                    <Button onClick={startTimer}>Record</Button>
                  </div>
                ) : (
                  <div>
                    <Button onClick={stopTimer}>Stop</Button>
                    <Button onClick={handleReplay}>Replay</Button>
                    <Button onClick={() => handlePageChange('survey')}>
                      Continue
                    </Button>
                    <Button onClick={redoTimer}>Redo</Button>
                  </div>
                )}

                {displayTimer && (
                  <div
                    className={`timer-container ${
                      isRecording ? 'recording' : ''
                    }`}
                  >
                    {!isRecording && (
                      <div className="timer">
                        Starting in... {formattedMinutes}:{formattedSeconds}
                      </div>
                    )}
                    {isRecording && recordingIndicator && (
                      <div className="timer">
                        Recording... {formattedMinutes}:{formattedSeconds}
                      </div>
                    )}
                    {isRecording && !recordingIndicator && (
                      <div className="timer">
                        Done... {formattedMinutes}:{formattedSeconds}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Typography>
        </div>
      )}

      {page === 'survey' && (
        <div style={{width: '100%', textAlign: 'center'}}>
          <Typography>
            <Typography.Title level={2}>Survey Section</Typography.Title>
            <Paragraph style={{textAlign: fontAlign, fontSize: fontSizePara}}>
              Rate the physical vocal effort needed to create your target voice:
            </Paragraph>
            <div style={{width: '75%', margin: '0 auto'}}>
              <Slider
                marks={marks}
                defaultValue={0} // Set default value (0 for "Very Easy")
                tooltip={{formatter: null}}
              />
            </div>
            <br />
            <br />
            <Paragraph style={{textAlign: fontAlign, fontSize: fontSizePara}}>
              Rate the cognitive vocal effort needed to create your target
              voice:
            </Paragraph>
            <div style={{width: '75%', margin: '0 auto'}}>
              <Slider
                marks={marks}
                defaultValue={0} // Set default value (0 for "Very Easy")
                tooltip={{formatter: null}}
              />
              <br />
              <br />
            </div>
            <Button onClick={() => handlePageChange('results')}>
              Finish Assessment
            </Button>
          </Typography>
        </div>
      )}

      {page === 'results' && (
        <div style={{width: '100%', textAlign: 'center'}}>
          <Typography>
            <Typography.Title level={2}>Results Section</Typography.Title>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Mean Pitch eee"
                  value={eMeanPitch?.toFixed(1) + ' Hz' ?? undefined}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Mean Pitch Rainbow Passage"
                  value={rainbowMeanPitch?.toFixed(1) + ' Hz' ?? undefined}
                />
              </Col>
            </Row>
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Assessment;
