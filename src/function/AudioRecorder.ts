import {useState} from 'react';

/**
 * Custom hook for recording audio using the browser's MediaRecorder API.
 * @returns An object containing functions to start and stop recording, as well as the URL of the recorded audio.
 */
const useAudioRecorder = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedAudioURL, setRecordedAudioURL] = useState<string | null>(null);

  /**
   * Starts recording audio using the browser's MediaRecorder API.
   * @throws {Error} If there is an error accessing the microphone.
   */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const recorder = new MediaRecorder(stream);

      setAudioStream(stream);
      setMediaRecorder(recorder);

      const chunks: Blob[] = [];
      recorder.ondataavailable = e => chunks.push(e.data as Blob);
      recorder.onstop = () => {
        const blob = new Blob(chunks, {type: 'audio/webm'});
        const url = URL.createObjectURL(blob);
        setRecordedAudioURL(url);
      };

      recorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  /**
   * Stops recording audio and releases the microphone.
   */
  const stopRecording = () => {
    if (mediaRecorder && audioStream) {
      mediaRecorder.stop();
      audioStream.getTracks().forEach(track => track.stop());
    }
  };

  return {
    startRecording,
    stopRecording,
    recordedAudioURL, // URL of the recorded audio to play the recording
  };
};

export default useAudioRecorder;
