import { camelCaseToKebab } from 'camelcase-to-kebab'
import { defineAccessors } from 'define-accessors'
import {
  Any,
  Types,
  ValueConstructor,
  PropsType,
  Constructor,
  CustomElementConstructor,
} from './types'

export type { PropsType }

export const getTypes = <T>(schema: T) =>
  new Map<string, ValueConstructor>(
    Object.entries(schema)
      .map(([key, value]) => [
        [key, Types.get(value) ?? Types.get(value?.constructor) ?? Types.get(Any)],
      ])
      .flat() as [string, ValueConstructor][]
  )

export const getProps = <T extends object>(propsClass: Constructor<T>) => {
  const schema = new propsClass()
  const types = getTypes(schema)
  return { schema, types }
}

export const applyProps = <T extends object>(
  target: any,
  data: T,
  schema: T,
  types: Map<string, any>
) => {
  const self = target

  for (const [key, value] of Object.entries(data)) {
    if ([String, Number, Boolean].includes(value)) {
      ;(data as any)[key] = void 0
    }
  }

  defineAccessors(self, schema, <K extends keyof T>(key: K) => ({
    configurable: false,
    enumerable: true,
    get() {
      return data[key]
    },
    set(value: T[K]) {
      const oldValue = data[key]
      const newValue = types.get(key as string)!(value)
      if (!Object.is(oldValue, newValue)) {
        data[key] = newValue
        self.propertyChangedCallback?.(key, oldValue, newValue)
      }
    },
  }))
}

/**
 * ```js
 * class Foo extends withProperties(
 *   HTMLElement,
 *   class {
 *     string? = String
 *     number? = Number
 *     boolean = Boolean
 *     implicitString = 'string'
 *     implicitNumber = 123
 *     implicitBoolean = true
 *     somethingElse? = new Uint8Array(1)
 *   }
 * ) {}
 * ```
 *
 * @param parent The parent constructor to extend (usually `HTMLElement`)
 * @param propsClass A "props" class to create the properties from
 * @returns A base constructor to be extended from
 */
export function withProperties<C extends CustomElementConstructor, P extends object>(
  parent: C,
  propsClass: Constructor<P>
) {
  const { schema, types } = getProps(propsClass)

  const map = new Map<string, string>(
    Object.keys(schema)
      .filter(key => types.get(key) !== Any)
      .map(key => [
        [key, key],
        [key.toLowerCase(), key],
        [camelCaseToKebab(key), key],
      ])
      .flat() as [string, string][]
  )

  const observedAttributes = [...map.keys()]

  const Base = class extends parent {
    static get observedAttributes() {
      return observedAttributes.concat(super.observedAttributes ?? [])
    }

    constructor(...args: any[]) {
      super(...args)
      const self = this
      const data = new propsClass()
      applyProps(self, data, schema, types)
    }

    propertyChangedCallback?<K extends keyof P>(
      name: K,
      oldValue: P[K] | null,
      newValue: P[K] | null
    ): void

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
      if (map.has(name)) (this as any)[map.get(name)!] = newValue
      // TODO: else super... ?
      super.attributeChangedCallback?.(name, oldValue, newValue)
    }
  }

  return Base as typeof Base & Constructor<PropsType<P>>
}

export default withProperties
