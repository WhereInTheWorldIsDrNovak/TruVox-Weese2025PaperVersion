import React, {useState, useEffect} from 'react';
import {IPitchDetectionConfig} from '../function/getPitch';
import useInitializeGetPitch from '../hooksUseEffect/useInitializeGetPitch';
import useAudioRecorder from '../function/AudioRecorder';
import {
  Button,
  Statistic,
  Slider,
  Typography,
  Col,
  Row,
  message,
  Upload,
  UploadFile,
} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import '../CSS/Timer.css';
import fxauto from '../function/fxauto.js';

interface AssessmentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: () => void;
  handleCancel: () => void;
  theme: string;
  enableAdvFeatures: boolean;
  setEnableAdvFeatures: (bool: boolean) => void;
}

const {Paragraph} = Typography;
const fontAlign = 'center';
interface AssessmentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: () => void;
  handleCancel: () => void;
  theme: string;
  enableAdvFeatures: boolean;
  setEnableAdvFeatures: (bool: boolean) => void;
}

const Assessment: React.FC<AssessmentProps> = ({theme, enableAdvFeatures}) => {
  const [page, setPage] = useState<
    | 'intro'
    | 'recording1'
    | 'recording2'
    | 'survey'
    | 'results'
    | 'assessment'
    | 'newPage'
  >('intro');
  const [showRecording, setShowRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [seconds, setSeconds] = useState<number>(3);
  const [pitch, setPitch] = useState<number | null>(null);
  const [ePitch, setEPitch] = useState<number[]>([]);
  const [eMeanPitch, setEMeanPitch] = useState<number | null>(null);
  const [rainbowPitch, setRainbowPitch] = useState<number[]>([]);
  const [rainbowMeanPitch, setRainbowMeanPitch] = useState<number | null>(null);
  const {startRecording, stopRecording, recordedAudioURL} = useAudioRecorder();
  const [displayTimer, setDisplayTimer] = useState(false);
  const [recordingIndicator, setRecordingIndicator] = useState(false);
  const [, setUploading] = useState(false);
  const [, setFile] = useState<UploadFile | null>(null);

  // State to store mean pitches and overall mean pitch
  const [meanPitches, setMeanPitches] = useState<number[]>([]);
  const [overallMeanPitch, setOverallMeanPitch] = useState<number | null>(null);

  const [pitchValues] = useState<number[]>([]);
  const [, setMeanPitch] = useState<number | null>(null);

  const config: IPitchDetectionConfig = {
    SRATE: 44100,
    fxmin: 50,
    fxlow: 50 + 50,
    fxhigh: 600 - 200,
    fxmax: 600,
  };

  useEffect(() => {
    if (pitchValues.length > 0) {
      const sum = pitchValues.reduce((acc, cur) => acc + cur, 0);
      const mean = sum / pitchValues.length;
      setMeanPitch(mean);
    }
  }, [pitchValues]);

  const handleFileChange = async (info: any) => {
    const uploadedFile = info.file.originFileObj;
    if (!uploadedFile) {
      message.error('Please select a valid audio file.');
      return;
    }

    const isValidFileType = [
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'audio/x-wav',
    ].includes(uploadedFile.type);
    const fileExtension = uploadedFile.name
      .slice(uploadedFile.name.lastIndexOf('.'))
      .toLowerCase();
    const validExtensions = ['.mp3', '.wav', '.mp4'];

    if (!isValidFileType || !validExtensions.includes(fileExtension)) {
      message.error(`${uploadedFile.name} is not a valid audio file.`);
      return;
    }

    setFile(uploadedFile);
    setUploading(true);

    try {
      await processAudioFile(uploadedFile);
    } catch (error) {
      console.error(error);
      message.error('Error processing the audio file');
    } finally {
      setUploading(false);
    }
  };

  // Initialize fxauto values to our config
  const fxCalc = new fxauto(
    config.fxmin,
    config.fxlow,
    config.fxhigh,
    config.fxmax,
    config.SRATE
  );

  const processAudioFile = async (file: File) => {
    if (!file) {
      message.error('Invalid file');
      return;
    }

    const audioContext = new AudioContext();
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onload = async event => {
      const audioData = event.target?.result as ArrayBuffer;
      const audioBuffer = await audioContext.decodeAudioData(audioData);

      const sampleRate = audioBuffer.sampleRate;
      console.log('File Sample Rate: ' + sampleRate);
      const duration = audioBuffer.duration;
      const interval = 15; // seconds
      const totalIntervals = Math.ceil(duration / interval);
      const newMeanPitches: number[] = [];

      // Cuts file into invervals
      for (let i = 0; i < totalIntervals; i++) {
        const startTime = i * interval;
        const endTime = Math.min(startTime + interval, duration);

        const startSample = Math.floor(sampleRate * startTime);
        const endSample = Math.floor(sampleRate * endTime);

        const samples = audioBuffer
          .getChannelData(0)
          .slice(startSample, endSample);

        const pitch = await getMeanPitchFromSamples(samples, sampleRate);
        console.log("Interval '" + i + "' Pitch: " + pitch);
        if (pitch !== null) {
          newMeanPitches.push(pitch);
        }
      }

      setMeanPitches(newMeanPitches); // Store mean pitch values for each 10-sec interval

      // Average the pitch for the 10s intervals
      if (newMeanPitches.length > 0) {
        const totalSum = newMeanPitches.reduce((a, b) => a + b, 0);
        const overallMean = totalSum / newMeanPitches.length;
        console.log(
          "Average Pitch of file '" + file.name + "': " + overallMean
        );
        setOverallMeanPitch(overallMean);
      } else {
        setOverallMeanPitch(null);
      }

      message.success('Pitch values calculated successfully');
    };
  };

  const getMeanPitchFromSamples = async (
    samples: Float32Array,
    sampleRate: number
  ): Promise<number | null> => {
    const bufferSize = sampleRate / 100; // 100 pitch samples per second, consistent with PRAAT
    const pitches: number[] = [];

    for (let i = 0; i < samples.length - bufferSize; i += bufferSize) {
      const sampleSlice = samples.slice(i, i + bufferSize);

      const fxest = fxCalc.CalculateFx(sampleSlice, bufferSize); // Same autocorrelation function used in getPitch (getPitch streams from mic)

      if (
        fxest.en > 0 &&
        fxest.fx > thresholdLowFrequency &&
        fxest.fx < thresholdHighFrequency
      ) {
        if (fxest.fx < 1) {
          const randomtem = Math.random();
          pitches.push(randomtem);
        } else {
          pitches.push(fxest.fx);
        }
      }
    }

    // Calculate mean pitch
    if (pitches.length > 0) {
      const sum = pitches.reduce((a, b) => a + b, 0);
      return sum / pitches.length;
    } else {
      return null; // Return null if no pitch is detected
    }
  };

  const marks = {
    0: 'No Effort',
    100: 'A Lot of Effort',
  };

  // Get Pitch Function
  useInitializeGetPitch(config, setPitch);

  const thresholdLowFrequency = 75; // Pitch samples below this threshold will be dropped (consistent with PRAAT)
  const thresholdHighFrequency = 600; // Pitch samples above this threshold willl be dropped (consistent with PRAAT)
  const countdown = 0; // Number of seconds for countdown (or 0 for no countdown)

  useEffect(() => {
    if (isRecording && !isStopped) {
      console.log('pitch: ' + pitch);

      if (
        page === 'recording1' &&
        pitch !== null &&
        pitch > thresholdLowFrequency &&
        pitch < thresholdHighFrequency
      ) {
        setEPitch(prevEPitch => {
          return prevEPitch ? [...prevEPitch, pitch] : [pitch];
        });
      } else if (
        page === 'recording2' &&
        pitch !== null &&
        pitch > thresholdLowFrequency &&
        pitch < thresholdHighFrequency
      ) {
        setRainbowPitch(prevRainbowPitch => {
          return prevRainbowPitch ? [...prevRainbowPitch, pitch] : [pitch];
        });
      }
    } else {
      //console.log("Pitch collection stopped...")
    }
  }, [pitch]);

  useEffect(() => {
    console.log('Timer: ' + seconds);

    // TIME LOOP
    const interval = setInterval(() => {
      if (isRecording && !isStopped) {
        setSeconds(prevSeconds => prevSeconds + 1);
      } else if (!isStopped) {
        setSeconds(prevSeconds => prevSeconds - 1);
      }
    }, 1000);

    if (seconds === 0 && !isRecording && !isStopped) {
      beginRecording();
    }

    // terminate E pitch after 10 seconds
    if (page === 'recording1' && seconds === 10) {
      endRecording();
    }

    // END CHECK
    if (isStopped && !isRecording) {
      // When finished recording, calculate average

      if (ePitch !== null) {
        // Do threshold filter here?
        setEMeanPitch(ePitch.reduce((a, b) => a + b, 0) / ePitch.length);
        console.log('E Pitch Avg: ' + eMeanPitch);
      }
      if (rainbowPitch !== null) {
        // Do threshold filter here?
        setRainbowMeanPitch(
          rainbowPitch.reduce((a, b) => a + b, 0) / rainbowPitch.length
        );
        console.log('Rainbow Pitch Avg: ' + rainbowMeanPitch);
      }
    }

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [seconds, isRecording, isStopped]); // useEffect will re-run whenever 'seconds', 'isStopped' or 'isRecording' changes

  const handlePageChange = (
    newPage: 'intro' | 'recording1' | 'recording2' | 'survey' | 'results'
  ) => {
    // If playback is still playing, pauses it
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0; // Reset the previous audio
    }

    setIsRecording(false); // Reset the recording status
    setIsStopped(true); // Reset the stopped status
    setSeconds(countdown); // Reset the timer to 3 seconds
    setDisplayTimer(true); // Hide the timer once page changes
    if (newPage === 'recording1' || newPage === 'recording2') {
      setShowRecording(true);
    } else {
      setShowRecording(false);
    }
    setPage(newPage);
  };

  const startTimer = () => {
    // If playback is still playing, pauses it
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0; // Reset the previous audio
    }

    clearData(); // Clears the array if needed
    setIsRecording(false); // Reset the recording status
    setIsStopped(false); // Reset the stopped status

    if (countdown) {
      setSeconds(countdown);
    } else {
      setSeconds(0);
    }

    setDisplayTimer(true); // Display the timer once start button is pressed
  };

  // Clears the ePitch and rainbowPitch when rerecording starts or when clearAll is true
  const clearData = (clearAll = false) => {
    if (ePitch !== null && (clearAll || page === 'recording1')) {
      setEMeanPitch(null);
      ePitch.length = 0;
      console.log('ePitch Cleared...');
    }
    if (rainbowPitch !== null && (clearAll || page === 'recording2')) {
      setRainbowMeanPitch(null);
      rainbowPitch.length = 0;
      console.log('RainbowPitch Cleared...');
    }
  };

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  const handlePlayback = (audioURL: string | null) => {
    if (audioURL) {
      // If there's already an audio element, pause it before playing a new one
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }

      // Create a new audio instance for the specific audio URL and play it
      const newAudio = new Audio(audioURL);
      setAudioElement(newAudio);
      newAudio.play();

      // Optional: Set up an event listener to handle when the audio ends
      newAudio.onended = () => {
        setAudioElement(null); // Clear the reference to prevent memory leaks
      };
    } else {
      alert('No audio to replay');
      console.error('No audio to replay');
    }
  };

  // Begin Recording
  const beginRecording = () => {
    console.log('Recording Start');
    setIsStopped(false);
    setRecordingIndicator(true);
    setIsRecording(true);
    startRecording();
  };

  // Ends the recording
  const endRecording = () => {
    console.log('Recording Stop');
    setIsStopped(true);
    setRecordingIndicator(false);
    stopRecording();
  };

  // Clear data and restart assesment
  const restartAssesment = () => {
    clearData(true);
    handlePageChange('intro');
  };

  // Calculate minutes and seconds from total seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return (
    <div
      style={{
        width: '100%',
        height: '5rem',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
      }}
    >
      {/* Introduction Section */}
      {page === 'intro' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography>
            <Paragraph
              className={`customColorfulText-${theme}`}
              style={{
                textAlign: fontAlign,
                fontSize: '35px',
                width: '30%',
                margin: '0 auto',
                marginBottom: '50px',
                color: 'rgb(36, 36, 131)',
              }}
            >
              To begin your voice assessment, record your voice reading the
              transcript prompts on the next pages.
            </Paragraph>

            <div
              style={{
                display: enableAdvFeatures ? 'flex' : 'grid',
                justifyContent: enableAdvFeatures ? 'left' : 'center',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {/* Begin button */}
              <Button
                onClick={() => handlePageChange('recording1')}
                className={`customGradientButton customGradientButton-${theme}`}
                style={{
                  marginLeft: enableAdvFeatures ? '75vh' : '0',
                }}
              >
                Begin
              </Button>

              {/* Upload button */}
              {enableAdvFeatures && (
                <Upload
                  onChange={handleFileChange}
                  accept=".mp3,.wav,.mp4"
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    className={`customGradientButton customGradientButton-${theme}`}
                    style={{
                      width: '200px',
                      marginRight: '75vh',
                    }}
                  >
                    Upload Audio
                  </Button>
                </Upload>
              )}
            </div>

            {/* Display Mean Pitches and Overall Mean Pitch */}
            {meanPitches.length > 0 && (
              <div style={{marginTop: '20px', textAlign: 'center'}}>
                <Typography.Title level={4}>
                  Mean Pitch Values per 10-Second Intervals:
                </Typography.Title>
                <ul style={{listStyleType: 'none', padding: 0}}>
                  {meanPitches.map((pitch, index) => (
                    <li key={index}>
                      <Typography.Text>
                        Interval {index + 1}: {pitch.toFixed(2)} Hz
                      </Typography.Text>
                    </li>
                  ))}
                </ul>
                <Typography.Title level={4}>
                  Overall Mean Pitch: {overallMeanPitch?.toFixed(2)} Hz
                </Typography.Title>
              </div>
            )}
          </Typography>
        </div>
      )}

      {showRecording && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography>
            {page === 'recording1' && (
              <div>
                <Paragraph
                  className={`customColorfulText-${theme}`}
                  style={{
                    textAlign: fontAlign,
                    fontSize: '35px',
                    width: '40%',
                    margin: '0 auto',
                    marginBottom: '50px',
                    color: 'rgb(36, 36, 131)',
                  }}
                >
                  Hold an ee sound for five seconds. Press Record to begin
                  recording, and press Stop when you are finished.
                </Paragraph>
                {!isRecording ? (
                  <div style={{textAlign: 'center'}}>
                    <Button
                      onClick={startTimer}
                      className={`customGradientButton customGradientButton-${theme}`}
                      style={{
                        marginTop: '50px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        width: '140px',
                        marginBottom: '20px',
                        letterSpacing: '2px',
                      }}
                    >
                      Record
                    </Button>
                    <Button
                      onClick={() => handlePageChange('recording2')}
                      className={`customGradientButton customGradientButton-${theme}`}
                      style={{
                        marginTop: '50px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        width: '140px',
                        marginBottom: '20px',
                        letterSpacing: '2px',
                      }}
                    >
                      Skip
                    </Button>
                  </div>
                ) : (
                  <div style={{textAlign: 'center'}}>
                    {recordingIndicator ? (
                      <Button
                        onClick={endRecording}
                        className={`customGradientButton customGradientButton-${theme}`}
                        style={{
                          marginTop: '50px',
                          border: '1.5px solid rgb(41, 41, 130)',
                          borderRadius: '20px',
                          fontSize: '14px',
                          background:
                            'linear-gradient(to left, #5A82E1, #2f2a5a)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          width: '100px',
                          textAlign: 'center',
                          margin: '0 auto',
                          marginBottom: '20px',
                          letterSpacing: '2px',
                          fontWeight: 'bold',
                          paddingTop: '2px',
                        }}
                      >
                        Stop
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => handlePlayback(recordedAudioURL)}
                          className={`customGradientButton customGradientButton-${theme}`}
                          style={{
                            marginTop: '50px',
                            border: '1.5px solid rgb(41, 41, 130)',
                            borderRadius: '20px',
                            fontSize: '14px',
                            background:
                              'linear-gradient(to left, #5A82E1, #2f2a5a)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            width: '100px',
                            textAlign: 'center',
                            margin: '0 auto',
                            marginBottom: '20px',
                            letterSpacing: '2px',
                            fontWeight: 'bold',
                            paddingTop: '2px',
                          }}
                        >
                          Playback
                        </Button>
                        <Button
                          onClick={() => handlePageChange('recording2')}
                          className={`customGradientButton customGradientButton-${theme}`}
                          style={{
                            marginTop: '50px',
                            border: '1.5px solid rgb(41, 41, 130)',
                            borderRadius: '20px',
                            fontSize: '14px',
                            background:
                              'linear-gradient(to left, #5A82E1, #2f2a5a)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            width: '110px',
                            textAlign: 'center',
                            margin: '0 auto',
                            marginBottom: '20px',
                            letterSpacing: '2px',
                            fontWeight: 'bold',
                            paddingTop: '2px',
                          }}
                        >
                          Continue
                        </Button>
                        <Button
                          onClick={startTimer}
                          className={`customGradientButton customGradientButton-${theme}`}
                          style={{
                            marginTop: '50px',
                            border: '1.5px solid rgb(41, 41, 130)',
                            borderRadius: '20px',
                            fontSize: '14px',
                            background:
                              'linear-gradient(to left, #5A82E1, #2f2a5a)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            width: '100px',
                            textAlign: 'center',
                            margin: '0 auto',
                            marginBottom: '20px',
                            letterSpacing: '2px',
                            fontWeight: 'bold',
                            paddingTop: '2px',
                          }}
                        >
                          Re-record
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {displayTimer && (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'rgb(36, 36, 131)',
                      fontSize: '0.18rem',
                    }}
                  >
                    {isRecording && recordingIndicator && (
                      <div className={`customColorfulText-${theme}`}>
                        Recording... {formattedMinutes}:{formattedSeconds}
                      </div>
                    )}
                    {isRecording && !recordingIndicator && (
                      <div className={`customColorfulText-${theme}`}>
                        Done... {formattedMinutes}:{formattedSeconds}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {page === 'recording2' && (
              <div>
                <Paragraph
                  className={`customColorfulText-${theme}`}
                  style={{
                    textAlign: fontAlign,
                    fontSize: '25px',
                    width: '30%',
                    margin: '0 auto',
                    marginBottom: '-20px',
                    marginTop: '0',
                    color: 'rgb(36, 36, 131)',
                  }}
                >
                  Read the following text out loud. Press Record to begin
                  recording, and press Stop when you are finished. <br />
                  <i>
                    "The rainbow is a division of white light into many
                    beautiful colors. These take the shape of a long round arch,
                    with its path high above, and its two ends apparently beyond
                    the horizon"
                  </i>
                </Paragraph>
                {!isRecording ? (
                  <div style={{textAlign: 'center', marginBottom: '20px'}}>
                    <Button
                      onClick={startTimer}
                      className={`customGradientButton customGradientButton-${theme}`}
                      style={{
                        border: '1.5px solid rgb(41, 41, 130)',
                        borderRadius: '20px',
                        fontSize: '14px',
                        background:
                          'linear-gradient(to left, #5A82E1, #2f2a5a)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        width: '140px',
                        textAlign: 'center',
                        margin: '0 auto',
                        marginTop: '50px',
                        marginBottom: '20px',
                        letterSpacing: '2px',
                        fontWeight: 'bold',
                        paddingTop: '2px',
                      }}
                    >
                      Record
                    </Button>
                    <Button
                      onClick={() => handlePageChange('survey')}
                      className={`customGradientButton customGradientButton-${theme}`}
                      style={{
                        marginTop: '50px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        width: '140px',
                        marginBottom: '20px',
                        letterSpacing: '2px',
                      }}
                    >
                      Skip
                    </Button>
                  </div>
                ) : (
                  <div style={{textAlign: 'center'}}>
                    {recordingIndicator ? (
                      <Button
                        onClick={endRecording}
                        className={`customGradientButton customGradientButton-${theme}`}
                        style={{
                          marginTop: '50px',
                          border: '1.5px solid rgb(41, 41, 130)',
                          borderRadius: '20px',
                          fontSize: '14px',
                          background:
                            'linear-gradient(to left, #5A82E1, #2f2a5a)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          width: '100px',
                          textAlign: 'center',
                          margin: '0 auto',
                          marginBottom: '20px',
                          letterSpacing: '2px',
                          fontWeight: 'bold',
                          paddingTop: '2px',
                        }}
                      >
                        Stop
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => handlePlayback(recordedAudioURL)}
                          className={`customGradientButton customGradientButton-${theme}`}
                          style={{
                            marginTop: '50px',
                            border: '1.5px solid rgb(41, 41, 130)',
                            borderRadius: '20px',
                            fontSize: '14px',
                            background:
                              'linear-gradient(to left, #5A82E1, #2f2a5a)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            width: '100px',
                            textAlign: 'center',
                            margin: '0 auto',
                            marginBottom: '20px',
                            letterSpacing: '2px',
                            fontWeight: 'bold',
                            paddingTop: '2px',
                          }}
                        >
                          Playback
                        </Button>
                        <Button
                          onClick={() => handlePageChange('survey')}
                          className={`customGradientButton customGradientButton-${theme}`}
                          style={{
                            marginTop: '50px',
                            border: '1.5px solid rgb(41, 41, 130)',
                            borderRadius: '20px',
                            fontSize: '14px',
                            background:
                              'linear-gradient(to left, #5A82E1, #2f2a5a)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            width: '110px',
                            textAlign: 'center',
                            margin: '0 auto',
                            marginBottom: '20px',
                            letterSpacing: '2px',
                            fontWeight: 'bold',
                            paddingTop: '2px',
                          }}
                        >
                          Continue
                        </Button>
                        <Button
                          onClick={startTimer}
                          className={`customGradientButton customGradientButton-${theme}`}
                          style={{
                            marginTop: '50px',
                            border: '1.5px solid rgb(41, 41, 130)',
                            borderRadius: '20px',
                            fontSize: '14px',
                            background:
                              'linear-gradient(to left, #5A82E1, #2f2a5a)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            width: '100px',
                            textAlign: 'center',
                            margin: '0 auto',
                            marginBottom: '20px',
                            letterSpacing: '2px',
                            fontWeight: 'bold',
                            paddingTop: '2px',
                          }}
                        >
                          Re-record
                        </Button>
                      </>
                    )}
                  </div>
                )}
                {displayTimer && (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'rgb(36, 36, 131)',
                      fontSize: '0.15rem',
                    }}
                  >
                    {isRecording && recordingIndicator && (
                      <div className={`customColorfulText-${theme}`}>
                        Recording... {formattedMinutes}:{formattedSeconds}
                      </div>
                    )}
                    {isRecording && !recordingIndicator && (
                      <div className={`customColorfulText-${theme}`}>
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography>
            <Typography.Title
              level={2}
              className={`customColorfulText-${theme}`}
              style={{
                textAlign: fontAlign,
                fontSize: '30px',
                width: '50%',
                margin: '0 auto',
                marginBottom: '-40px',
                marginTop: '40px',
                color: 'rgb(36, 36, 131)',
              }}
            >
              Survey Section
            </Typography.Title>
            <Paragraph
              className={`customColorfulText-${theme}`}
              style={{
                textAlign: fontAlign,
                fontSize: '20px',
                maxWidth: '80%',
                margin: '0 auto',
                marginBottom: '30px',
                marginTop: '70px',
                color: 'rgb(36, 36, 131)',
              }}
            >
              Rate the physical vocal effort needed to create your target voice:
            </Paragraph>
            <div
              style={{width: '75%', margin: '0 auto'}}
              className={`customSlider-${theme}`}
            >
              <Slider
                marks={marks}
                defaultValue={0}
                tooltip={{formatter: null}}
              />
            </div>
            <br />
            <br />
            <Paragraph
              className={`customColorfulText-${theme}`}
              style={{
                textAlign: fontAlign,
                fontSize: '20px',
                maxWidth: '80%',
                margin: '0 auto',
                marginBottom: '30px',
                marginTop: '-20px',
                color: 'rgb(36, 36, 131)',
              }}
            >
              Rate the cognitive vocal effort needed to create your target
              voice:
            </Paragraph>
            <div style={{width: '75%', margin: '0 auto'}}>
              <Slider
                className={`customSlider-${theme}`}
                marks={marks}
                defaultValue={0}
                tooltip={{formatter: null}}
              />
              <br />
              <br />
            </div>
            <div style={{textAlign: 'center'}}>
              <Button
                onClick={() => handlePageChange('results')}
                className={`customGradientButton customGradientButton-${theme}`}
                style={{
                  marginTop: '10px',
                  border: '1.5px solid rgb(41, 41, 130)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  background: 'linear-gradient(to left, #5A82E1, #2f2a5a)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  width: '185px',
                  textAlign: 'center',
                  margin: '0 auto',
                  marginBottom: '90px',
                  letterSpacing: '2px',
                  fontWeight: 'bold',
                  paddingTop: '2px',
                }}
              >
                Finish Assessment
              </Button>
            </div>
          </Typography>
        </div>
      )}

      {page === 'results' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography>
            <Typography.Title
              level={2}
              className={`customColorfulText-${theme}`}
              style={{
                textAlign: fontAlign,
                fontSize: '40px',
                maxWidth: '80%',
                margin: '0 auto',
                marginBottom: '90px',
                marginTop: '-20px',
                color: 'rgb(36, 36, 131)',
              }}
            >
              Results
            </Typography.Title>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Mean Pitch eee"
                  value={
                    eMeanPitch
                      ? eMeanPitch.toFixed(1) + ' Hz'
                      : 'Not Enough Data'
                  }
                  className={`customStatistic-${theme}`}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Mean Pitch Rainbow Passage"
                  value={
                    rainbowMeanPitch
                      ? rainbowMeanPitch.toFixed(1) + ' Hz'
                      : 'Not Enough Data'
                  }
                  className={`customStatistic-${theme}`}
                  style={{
                    textAlign: fontAlign,
                    fontSize: '20px',
                    maxWidth: '80%',
                    margin: '0 auto',
                    marginBottom: '30px',
                    marginTop: '-20px',
                  }}
                />
              </Col>
            </Row>
            <div style={{textAlign: 'center'}}>
              <Button
                onClick={() => restartAssesment()}
                className={`customGradientButton-${theme}`}
                style={{
                  marginTop: '10px',
                  border: '1.5px solid rgb(41, 41, 130)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  background: 'linear-gradient(to left, #5A82E1, #2f2a5a)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  width: '185px',
                  textAlign: 'center',
                  margin: '0 auto',
                  marginBottom: '90px',
                  letterSpacing: '2px',
                  fontWeight: 'bold',
                  paddingTop: '2px',
                }}
              >
                Restart Assessment
              </Button>
            </div>
          </Typography>
        </div>
      )}

      {/* Bottom Section */}
      <div
        className={`customSection customSection-${theme}`}
        style={{
          padding: '0px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          <Typography.Title
            level={2}
            className={`customColorfulText-${theme}`}
            style={{
              textDecoration: 'underline',
              textDecorationSkipInk: 'auto',
              textUnderlineOffset: '10px',
              color: '#8778AA',
            }}
          >
            Assessment
          </Typography.Title>
          <Typography.Paragraph
            className={`customColorfulText-${theme}`}
            style={{
              fontSize: '20px',
              maxWidth: '750px',
              margin: '0 auto',
              color: '#6E6E73',
              lineHeight: '40px',
            }}
          >
            Using the assessment feature regularly will help you track your
            progress in achieving your desired voice. This function provides
            valuable feedback and allows you to adjust your practice as needed.
            Complete the assessment at your convenience to see how your vocal
            qualities are improving over time.
          </Typography.Paragraph>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
