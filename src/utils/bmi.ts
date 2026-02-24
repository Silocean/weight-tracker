export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese'

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 24) return 'normal'
  if (bmi < 28) return 'overweight'
  return 'obese'
}

export const BMI_LABELS: Record<BMICategory, string> = {
  underweight: '偏瘦',
  normal: '正常',
  overweight: '偏胖',
  obese: '肥胖',
}

export const BMI_COLORS: Record<BMICategory, string> = {
  underweight: '#60a5fa',
  normal: '#34d399',
  overweight: '#fbbf24',
  obese: '#f87171',
}
