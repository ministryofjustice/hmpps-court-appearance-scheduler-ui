import config from '../config'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0]!.toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str?: string | null): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence?: string | null): string =>
  isBlank(sentence) ? '' : sentence!.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string | null): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0]?.[0]}. ${array.reverse()[0]}`
}

export const getQueryEntries = (query: object | undefined | null, keys: string[]) =>
  query ? Object.entries(query).filter(([key]) => keys.includes(key)) : []

/* eslint-disable no-param-reassign */
export const mergeObjects = <T extends Record<string, unknown>>(destination: T, source: Partial<T>) => {
  Object.entries(source).forEach(([key, value]) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (!destination[key]) {
        // @ts-expect-error set up object for future recursive writes
        destination[key] = {}
      }
      mergeObjects(destination[key] as Record<string, unknown>, value)
    } else {
      // @ts-expect-error unexpected types
      destination[key] = value
    }
  })
}

export const prisonerProfileBacklink = (originalUrl: string, personIdentifier: string, suffix: string = '') => {
  const searchParams = new URLSearchParams({
    service: 'external-movements',
    redirectPath: `/prisoner/${personIdentifier}${suffix}`,
    returnPath: `/${originalUrl.split('/').slice(1).join('/')}`,
  })
  return `${config.serviceUrls.prisonerProfile}/save-backlink?${searchParams.toString()}`
}
