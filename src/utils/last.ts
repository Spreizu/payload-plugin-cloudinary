/**
 * Retrieves the last item in an array or returns a default value if the array is empty.
 * This function ensures that you get the last element of the array or a specified default value.
 *
 * @template T - The type of elements in the array.
 * @param {readonly T[]} array - The array from which to retrieve the last item.
 * @param {null | T | undefined} [defaultValue=undefined] - The default value to return if the array is empty.
 * @returns {T | null | undefined} - The last item in the array or the default value.
 */
export const last = <T>(array: readonly T[], defaultValue: null | T | undefined = undefined): null | T | undefined => {
  return array?.length > 0 ? array[array.length - 1] : defaultValue
}
