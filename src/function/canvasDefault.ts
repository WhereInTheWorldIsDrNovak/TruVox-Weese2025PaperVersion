export const adjustCanvasScale = (
  canvas: HTMLCanvasElement,
  originalCanvasWidth = 1000
) => {
  const screenWidth = window.innerWidth;
  const scale = (screenWidth * 0.6) / originalCanvasWidth;
  if (canvas) {
    canvas.style.transform = `scale(${scale})`;
    canvas.style.transformOrigin = 'top left';
  }
};
export function map(
  value: number | null,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number {
  if (value === null) {
    value = 0;
  }
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
export function frequencyToNote(
  frequency: number,
  fxmin: number,
  fxmax: number
): string {
  const A4 = 440;
  let semitonesAboveC0 = 12 * (Math.log(frequency / A4) / Math.log(2));
  semitonesAboveC0 += 9; // A4 is the 9th semitone starting from C0
  semitonesAboveC0 += 12 * 4; // A4 is the A in the 4th octave

  if (frequency < fxmin || frequency > fxmax) return ''; // If the frequency is out of range, the note is not displayed

  const octave = Math.floor(semitonesAboveC0 / 12);
  const noteIndex = Math.floor(semitonesAboveC0 % 12);
  const notes = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const note = notes[noteIndex];

  return note + octave;
}

export const drawBackground = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  fxmax: number,
  fxmin: number,
  showNotes: boolean,
  dashedLineColor: string
) => {
  const canvas = canvasRef.current;
  function adjustCanvasScale() {
    // Get the width of the browser window
    const screenWidth = window.innerWidth;
    // Assume the original width of the canvas is 1000px
    const originalCanvasWidth = 1000;
    // Calculate the zoom ratio when occupying 80% of the window width
    const scale = (screenWidth * 0.6) / originalCanvasWidth;
    // Apply scaling
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.transform = `scale(${scale})`;
      canvas.style.transformOrigin = 'top left';
    }
  }
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gridSpacing = 50;
      ctx.strokeStyle = dashedLineColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // // Draw vertical line in the middle
      // var middleX = canvas.width / 2; // Calculate the middle x coordinate
      // ctx.beginPath();
      // ctx.moveTo(middleX, 0); // Start at the top middle of the canvas
      // ctx.lineTo(middleX, canvas.height); // Draw to the bottom middle of the canvas
      // ctx.stroke(); // Render the line

      // ctx.fillStyle = "#000";
      // ctx.font = "12px Arial";
      // for (var y = 0; y <= canvas.height; y += gridSpacing) {
      //   // Map current y value to frequency range
      //   var frequency = map(y, 0, canvas.height, fxmax, fxmin);
      //   // Determines whether to display frequencies or notes based on the current state
      //   var label = showNotes
      //     ? frequencyToNote(frequency, fxmin, fxmax)
      //     :(Math.round(frequency / 10) * 10).toString();
      //   // Make sure the label is not empty
      //   if (label) {
      //     ctx.fillText(label, 5, y+12);
      //   }
      // }
      // var y = canvas.height;
      // var frequency = map(y, 0, canvas.height, fxmax, fxmin);
      //   // Determines whether to display frequencies or notes based on the current state
      //   var label = showNotes
      //     ? frequencyToNote(frequency, fxmin, fxmax)
      //     // : frequency.toFixed(2);
      //     :(Math.round(frequency / 10) * 10).toString();
      //   // Make sure the label is not empty
      //   if (label) {
      //     ctx.fillText(label, 5, y);
      //   }
      adjustCanvasScale();
      window.addEventListener('resize', adjustCanvasScale);
    }
  }
};

export function generateNotesAndFrequencies(
  fxmin: number,
  fxmax: number
): {notes: string[]; frequencies: string[]} {
  const notes: string[] = [];
  const frequencies: string[] = [];
  const numValues = 9;

  for (let i = 0; i < numValues; i++) {
    const frequency = Math.round(
      fxmax - (i * (fxmax - fxmin)) / (numValues - 1)
    );
    const note = frequencyToNote(frequency, fxmin, fxmax);
    const frequency_10 = Math.round(frequency / 10) * 10;
    frequencies.push(frequency_10.toString());
    notes.push(note);
  }

  return {notes, frequencies};
}
