export interface IPitchDetectionConfig {
  fxmin: number;
  fxlow: number;
  fxhigh: number;
  fxmax: number;
  SRATE: number;
}

export async function getPitch(
  config: IPitchDetectionConfig,
  onPitchDetected: (pitch: number | null) => void
): Promise<() => void> {
  try {
    // console.log("Requesting microphone access...");

    // Request access to the microphone
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    // console.log("Microphone access granted.");

    // Initialize AudioContext
    const audioContext = new window.AudioContext();
    const sample_rate = audioContext.sampleRate; // Get Microphone sample rate
    console.log('Mic Sample Rate: ' + sample_rate);
    config.SRATE = sample_rate;
    // console.log("AudioContext created.");

    try {
      // Attempt to load the AudioWorkletProcessor
      await audioContext.audioWorklet.addModule(
        '/transvoice/PitchProcessor.js'
      );
      // console.log("AudioWorklet module loaded successfully.");
    } catch (workletError) {
      // Cleanup in case of AudioWorklet load failure
      // console.log("Failed to load AudioWorklet module:", workletError);
      stream.getTracks().forEach(track => track.stop()); // Stop the stream
      audioContext.close(); // Close the audio context
      throw new Error(
        'Error loading AudioWorklet module. Ensure the file path is correct and accessible.'
      );
    }

    // Create MediaStream source from microphone
    const source = audioContext.createMediaStreamSource(stream);
    // console.log("MediaStreamSource created from microphone.");

    // Create and configure the AudioWorkletNode
    const pitchProcessor = new AudioWorkletNode(
      audioContext,
      'pitch-processor'
    );

    // Send configuration data to the AudioWorkletProcessor
    pitchProcessor.port.postMessage({config});
    // console.log("Configuration data sent to AudioWorkletProcessor.");

    // Listen for pitch data from the processor
    pitchProcessor.port.onmessage = event => {
      const {pitch} = event.data;
      // console.log("Pitch data received:", pitch);
      onPitchDetected(pitch);
    };

    // Connect nodes
    source.connect(pitchProcessor);
    pitchProcessor.connect(audioContext.destination);
    // console.log("Audio nodes connected successfully.");

    // Return cleanup function to disconnect nodes and close audio context
    return () => {
      // console.log("Cleaning up audio connections.");
      pitchProcessor.disconnect();
      source.disconnect();
      audioContext.close();
      console.log('AudioContext closed.');
    };
  } catch (error) {
    // Enhanced error handling with detailed logging
    const err = error as Error;
    // console.error("Error in getPitch:", err);

    if (err.name === 'NotAllowedError') {
      console.error('Microphone access denied by user or browser policy.');
    } else if (err.name === 'NotFoundError') {
      console.error(
        'No microphone device found. Ensure a microphone is connected.'
      );
    } else if (err.name === 'AbortError') {
      console.error(
        'Microphone access was aborted, likely due to a user action.'
      );
    } else if (err.message.includes('AudioWorklet')) {
      console.error(
        'AudioWorklet module loading failed. Check the file path and server configuration.'
      );
    } else {
      console.error('An unexpected error occurred in getPitch:', err);
    }

    onPitchDetected(null);
    return () => {};
  }
}
