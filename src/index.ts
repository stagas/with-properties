import { camelCaseToKebab } from 'camelcase-to-kebab'
import { defineAccessors } from 'define-accessors'
import type { Constructor, CustomElement } from './types'

/**
 * Creates a base class extending another class and mixins a property
 * accessors class that is added to the `observedAttributes` list with
 * key names normalized so that the prop is **camelCased** and the attribute
 * is **kebab-cased**. It does not try to normalize values, that is left
 * as the responsibility of the props class, so everything passed here
 * are the attribute values which can be either `string` or `null`.
 * Inheritance works as expected, extended classes will contain all
 * of the parent classes' mixined properties.
 *
 * If the props class includes a static property `schema`, then it will
 * be used as the basis for the accessors, otherwise a new instance of
 * the props class will be created when this function is called that
 * will be used only for inspecting the keys and for intersecting
 * the interfaces with the class object (so that TS/intellisense works
 * properly).
 *
 * ```ts
 * class Foo extends withProperties(
 *   HTMLElement,
 *   class {
 *     fooFoo?: string
 *     barBar?: string
 *   }
 * ) {}
 *
 * customElements.define('x-foo', Foo)
 *
 * const el = new Foo()
 *
 * expect(el.fooFoo).toBeUndefined()
 * el.setAttribute('foo-foo', 'some value')
 * expect(el.fooFoo).toEqual('some value')
 *
 * expect(el.barBar).toBeUndefined()
 * el.setAttribute('bar-bar', 'some other value')
 * expect(el.barBar).toEqual('some other value')
 *
 * // example with schema:
 * class Foo extends withProperties(
 *   HTMLElement,
 *   class {
 *     static schema = {
 *       foo: '',
 *       bar: '',
 *     }
 *     foo = 'some default'
 *   }
 * ) {}
 * ```
 *
 * @param parent The parent constructor to extend (usually `HTMLElement`)
 * @param propsClass A "props" class to create the properties from
 * @returns A base constructor to be extended from
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withProperties<P extends Constructor<any>, M, C>(
  parent: P & { observedAttributes?: string[] },
  propsClass: { new (): C; schema?: M }
): Constructor<InstanceType<P> & M & C & CustomElement> {
  const schema = propsClass.schema ?? new propsClass()

  const map = new Map<string, string>(
    Object.keys(schema)
      .map(key => [
        [key, key],
        [key.toLowerCase(), key],
        [camelCaseToKebab(key), key],
      ])
      .flat() as [string, string][]
  )

  const observedAttributes = [...map.keys()]

  const BaseCustomElement = class extends parent {
    static get observedAttributes() {
      return observedAttributes.concat(super.observedAttributes ?? [])
    }

    constructor() {
      super()

      const data = new propsClass() as Record<string, unknown>

      defineAccessors(this, schema as Record<string, unknown>, key => ({
        configurable: false,
        enumerable: true,
        get() {
          return data[key]
        },
        set(value: never) {
          data[key] = value
        },
      }))
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
      if (map.has(name)) this[map.get(name)!] = newValue
      super.attributeChangedCallback?.(name, oldValue, newValue)
    }
  }

  return BaseCustomElement
}

export default withProperties
