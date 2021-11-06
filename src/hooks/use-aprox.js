import { useCallback } from "react";

const useAprox = () => {
  const aprox = useCallback((data) => {
    data = data.map(n => parseInt(n));
    const n = data.length;
    const sumX = n * (n + 1) / 2;
    const sumY = data.reduce((perv, curr) => perv + curr);
    const arrX2 = data.map((y, x) => Math.pow(x + 1, 2));
    const sumX2 = arrX2.reduce((prev, curr) => prev + curr);
    const arrXY = data.map((y, x) => (x + 1) * y);
    const sumXY = arrXY.reduce((prev, curr) => prev + curr);

    const a = (n * sumXY - sumX * sumY) / (n * sumX2 - Math.pow(sumX, 2));
    const b = (sumY - a * sumX) / n;

    return {a, b}
  }, []);
  
  return {
    aprox
  }
}

export default useAprox;