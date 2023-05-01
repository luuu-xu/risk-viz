export function getRiskColor( riskRating: number ): string {
  const green = [50, 200, 10]; // RGB value for green
  const yellow = [240, 240, 5]; // RGB value for yellow
  const red = [225, 15, 10]; // RGB value for red
  
  // Interpolate between green and red based on the risk rating
  if (riskRating < 0.5) {
    const color = [
      Math.round(green[0] + (yellow[0] - green[0]) * riskRating),
      Math.round(green[1] + (yellow[1] - green[1]) * riskRating),
      Math.round(green[2] + (yellow[2] - green[2]) * riskRating),
    ];
    // Format the color as a CSS RGB string
    return `rgb(${color.join(',')})`;
  } else {
    const color = [
      Math.round(yellow[0] + (red[0] - yellow[0]) * riskRating),
      Math.round(yellow[1] + (red[1] - yellow[1]) * riskRating),
      Math.round(yellow[2] + (red[2] - yellow[2]) * riskRating),
    ];
    // Format the color as a CSS RGB string
    return `rgb(${color.join(',')})`;
  }
}

export function getRiskGradient(ctx: CanvasRenderingContext2D, bottom: number, top: number) {
  const gradient = ctx.createLinearGradient(0, bottom, 0, top);
  gradient.addColorStop(0, "#32C80A");
  gradient.addColorStop(0.5, "#F0F005");
  gradient.addColorStop(1, "#E10F0A");

  return gradient;
}