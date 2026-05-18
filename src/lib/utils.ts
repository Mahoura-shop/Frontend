import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPersianDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return iso
  return date.toLocaleDateString("fa-IR", { year: "numeric", month: "short", day: "numeric" })
}

export function formatIncome(amount: number): string {
  const billion = 1_000_000_000
  const million = 1_000_000
  const thousand = 1_000

  let value: number
  let unit: string

  if (Math.abs(amount) >= billion) {
    value = amount / billion
    unit = "میلیارد ریال"
  } else if (Math.abs(amount) >= million) {
    value = amount / million
    unit = "میلیون ریال"
  } else if (Math.abs(amount) >= thousand) {
    value = amount / thousand
    unit = "هزار ریال"
  } else {
    return `${amount} ریال`
  }

  const rounded = Math.round(value * 10) / 10
  const display = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1)
  return `${display} ${unit}`
}
