/**
 * Checks if the given value is an object (and not an array).
 * This function ensures that the value is a plain object and not an array or other type.
 *
 * @param {unknown} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is an object, false otherwise.
 */
export const isObject = <T = object>(value: unknown): value is T => {
  return !!value && value.constructor === Object
}
