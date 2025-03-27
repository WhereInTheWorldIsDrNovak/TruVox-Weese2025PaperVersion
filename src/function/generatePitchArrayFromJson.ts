function parseTimeToSeconds(timeString: string): number {
  const parts = timeString.split(':');
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  const seconds = Number(parts[2]);
  const frames = Number(parts[3]);
  const frameDurationInSeconds = frames / 100;

  return hours * 3600 + minutes * 60 + seconds + frameDurationInSeconds;
}

function generatePitchArrayFromJson(
  maxMilliseconds: number,
  jsonData: any[]
): number[] {
  const SECONDS_PER_FRAME = 0.01;
  const CANVAS_WIDTH = 1400;
  const divisorLocal =
    (SECONDS_PER_FRAME / (maxMilliseconds / 1000)) * CANVAS_WIDTH; // If the canvas is CANVAS_WIDTH "units" wide, then this equation finds how many "units" are in one frame according to the maximum time displayed on the canvas
  const pitchArray: number[] = [];
  const data = jsonData;
  let previousTimeInSeconds = 0;
  let previousPitch = 0;

  for (let i = 0; i < data.length; i++) {
    const currentTimeInSeconds = parseTimeToSeconds(data[i].time);
    const timeDifference = currentTimeInSeconds - previousTimeInSeconds;

    for (let j = 0; j < Math.round(timeDifference * 100); j++) {
      // The Math.round() accounts for rounding errors that may have occured in parseTimeToSeconds when converting frames to seconds
      pitchArray.push(previousPitch);
    }

    previousTimeInSeconds = currentTimeInSeconds;
    previousPitch = data[i].pitch;
  }

  const endTimeInSeconds = parseTimeToSeconds(data[data.length - 1].time);
  const endTimeDifference = endTimeInSeconds - previousTimeInSeconds;
  for (let j = 0; j < endTimeDifference * 100; j++) {
    pitchArray.push(previousPitch);
  }
  const extendedArray: number[] = [];
  pitchArray.forEach(pitch => {
    for (let i = 0; i < divisorLocal; i++) {
      extendedArray.push(pitch);
    }
  });

  while (extendedArray.length > 1400) {
    extendedArray.pop();
  }
  while (extendedArray.length < 1400) {
    extendedArray.push(0);
  }

  return extendedArray;
}

export default generatePitchArrayFromJson;
