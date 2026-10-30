const UNSAFE_TEXT_CONTROLS = /[\u202A-\u202E\u2066-\u2069\u200B\u200C\u200D\uFEFF]/

export function containsUnsafeTextControl(value: string) {
  return UNSAFE_TEXT_CONTROLS.test(value)
}
