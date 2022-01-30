<h1 align="center">with-properties</h1>

<p align="center">
custom elements base class factory with properties mapped to observed attributes
</p>

<p align="center">
   <a href="#install">        🔧 <strong>Install</strong></a>
 · <a href="#example">        🧩 <strong>Example</strong></a>
 · <a href="#api">            📜 <strong>API docs</strong></a>
 · <a href="https://github.com/stagas/with-properties/releases"> 🔥 <strong>Releases</strong></a>
 · <a href="#contribute">     💪🏼 <strong>Contribute</strong></a>
 · <a href="https://github.com/stagas/with-properties/issues">   🖐️ <strong>Help</strong></a>
</p>

***

## Install

```sh
$ npm i with-properties
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

*   [withProperties](#withproperties)
    *   [Parameters](#parameters)

### withProperties

[src/index.ts:61-99](https://github.com/stagas/with-properties/blob/277e44260244869a3c7582b1a6b65521ab039b55/src/index.ts#L61-L99 "Source code on GitHub")

Creates a base class extending another class and mixins a property
accessors class that is added to the `observedAttributes` list with
key names normalized so that the prop is **camelCased** and the attribute
is **kebab-cased**. It does not try to normalize values, that is left
as the responsibility of the props class, so everything passed here
are the attribute values which can be either `string` or `null`.
Inheritance works as expected, extended classes will contain all
of the parent classes' mixined properties.

If the props class includes a static property `schema`, then it will
be used as the basis for the accessors, otherwise a new instance of
the props class will be created when this function is called that
will be used only for inspecting the keys and for intersecting
the interfaces with the class object (so that TS/intellisense works
properly).

```ts
class Foo extends withProperties(
  HTMLElement,
  class {
    fooFoo?: string
    barBar?: string
  }
) {}

customElements.define('x-foo', Foo)

const el = new Foo()

expect(el.fooFoo).toBeUndefined()
el.setAttribute('foo-foo', 'some value')
expect(el.fooFoo).toEqual('some value')

expect(el.barBar).toBeUndefined()
el.setAttribute('bar-bar', 'some other value')
expect(el.barBar).toEqual('some other value')

// example with schema:
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
```

#### Parameters

*   `parent` **any** The parent constructor to extend (usually `HTMLElement`)
*   `propsClass` **{: C, schema: M?}** A "props" class to create the properties from

Returns **[Constructor](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)\<any>** A base constructor to be extended from

## Contribute

[Fork](https://github.com/stagas/with-properties/fork) or
[edit](https://github.dev/stagas/with-properties) and submit a PR.

All contributions are welcome!

## License

MIT © 2021
[stagas](https://github.com/stagas)
