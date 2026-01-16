import { AllTypes } from './DITA'

export type KeysOfUnion<T> = T extends T ? keyof T: never;
export type KeysOfUnionWithOmit<T, O extends string | number | symbol> = T extends T ? keyof Omit<T, O>: never;
export type ValueOf<T> = T[keyof T];

export function recursively(e: AllTypes, f: (e: AllTypes) => void) {
  if (e[':@']) { // exclude text nodes
    f(e)
    const name = e[':@'].elementName  as keyof typeof e
    const children = e[name] as unknown as AllTypes[]
    for (const c of children) {
      recursively(c, f)
    }
  }
}

export function cleanTopicId(fullId: string) {
  const lastSlash = fullId.lastIndexOf('/')
  if (lastSlash >= 0) {
    return fullId.substring(lastSlash + 1)
  }
  const lastHash = fullId.lastIndexOf('#')
  if (lastHash >= 0) {
    return fullId.substring(lastHash + 1)
  }
  return fullId
}