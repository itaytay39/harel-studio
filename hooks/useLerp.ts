export const useLerp = (current: number, target: number, factor: number): number => {
  return current + (target - current) * factor
}
