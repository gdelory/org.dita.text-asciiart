import { AllKeys, AllTypes, NameToType } from "./DITA"
import { KeysOfUnion, KeysOfUnionWithOmit, ValueOf } from "./utils"

/**
 * ============================================================================
 * =                                                                          =
 * =                         Convenient methods                               =
 * =                                                                          =
 * =        This section contains convenient methods to access the DOM.       =
 * =                                                                          =
 * ============================================================================
 */

export function elementsByName<
  T extends ValueOf<NameToType>[],
  N extends KeysOfUnionWithOmit<T[number], ':@'> & keyof NameToType,
  R extends NameToType[N]
>(array: T, name: N) {
  return array.filter(e => (<any>e)[name]) as R[]
}

/**
 * 
 * @param array Content of the element
 * @param name The name of the element to find
 * @returns 
 */
export function firstElementByName<T extends ValueOf<NameToType>[], N extends KeysOfUnion<T[number]> & keyof NameToType, R extends NameToType[N]>(array: T, name: N) {
  return array.find(e => (<any>e)[name]) as R | undefined
}

export function attr<T extends {':@': any}, K extends keyof T[':@']>(e: T, attrName: K) : T[':@'][K]
export function attr<T extends {':@': any}, K extends keyof T[':@']>(e: T, attrName: K, defaultValue: NonNullable<T[':@'][K]>) : NonNullable<T[':@'][K]>
export function attr<T extends {':@': any}, K extends keyof T[':@']>(e: T, attrName: K, defaultValue?: T[':@'][K]) : T[':@'][K] {
  return e[':@'][attrName] || defaultValue
}

/** 
 * Returns the element name
 * @return first key which is not the attributes key, this would be the element name */
export function getElementName(e: AllTypes): AllKeys | undefined {
  // Text nodes don't have attributes, so if ':@' doesn't exist, the main key is #text
  return e[':@']?.elementName || '#text'
}

/** 
 * Returns the content of the element
 */
export function getContent(e: AllTypes): AllTypes[] {
  const contentKey = getElementName(e) as keyof typeof e
  return e[contentKey] as unknown as AllTypes[]
}

export function setContent(e: AllTypes, newContent: AllTypes[]) {
  const contentKey = getElementName(e) as keyof typeof e
  e[contentKey] = (newContent as any)
}