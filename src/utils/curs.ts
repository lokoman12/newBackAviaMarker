export function curs(tCurs: number) {
    const rad2deg = 57.29577951308232087679815481410517033240547246656442;
    const result = tCurs * rad2deg;
    if (result < 0) {
      return result + 360;
    }
    if (result > 360) {
      return result - 360;
    }
    return result;
  }