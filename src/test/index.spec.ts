import { withProperties } from '../'

const create = (Ctor: CustomElementConstructor) => {
  const randTag = 'x-' + ((Math.random() * 10e6) | 0).toString(36)
  customElements.define(randTag, Ctor)
  return randTag
}

describe('withProps', () => {
  it('creates a base class that mixins a given props instance', () => {
    class Foo extends withProperties(
      HTMLElement,
      class {
        foo?: string
        bar?: string
      }
    ) {}

    create(Foo)

    const el = new Foo()

    expect(el.foo).toBeUndefined()
    el.setAttribute('foo', 'some value')
    expect(el.foo).toEqual('some value')

    expect(el.bar).toBeUndefined()
    el.setAttribute('bar', 'some other value')
    expect(el.bar).toEqual('some other value')
  })

  it('converts kebab-case attribute names to propCase camelCased ones', () => {
    class Foo extends withProperties(
      HTMLElement,
      class {
        fooFoo?: string
        barBar?: string
      }
    ) {}

    create(Foo)

    const el = new Foo()

    expect(el.fooFoo).toBeUndefined()
    el.setAttribute('foo-foo', 'some value')
    expect(el.fooFoo).toEqual('some value')

    expect(el.barBar).toBeUndefined()
    el.setAttribute('bar-bar', 'some other value')
    expect(el.barBar).toEqual('some other value')
  })

  it('works with inheritance', () => {
    class Foo extends withProperties(
      HTMLElement,
      class {
        foo?: string
      }
    ) {}

    class Bar extends withProperties(
      Foo,
      class {
        bar?: string
      }
    ) {}

    create(Bar)

    const el = new Bar()

    expect(el.foo).toBeUndefined()
    el.setAttribute('foo', 'some value')
    expect(el.foo).toEqual('some value')

    expect(el.bar).toBeUndefined()
    el.setAttribute('bar', 'some other value')
    expect(el.bar).toEqual('some other value')
  })

  it('uses `schema` static props class property when detected', () => {
    class Foo extends withProperties(
      HTMLElement,
      class {
        static schema = {
          foo: '',
          bar: '',
        }
        foo = 'some default'
      }
    ) {}

    create(Foo)

    const el = new Foo()

    expect(el.foo).toEqual('some default')
    el.setAttribute('foo', 'some value')
    expect(el.foo).toEqual('some value')

    expect(el.bar).toBeUndefined()
    el.setAttribute('bar', 'some other value')
    expect(el.bar).toEqual('some other value')
  })
})
