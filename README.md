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

[src/index.ts:80-125](https://github.com/stagas/with-properties/blob/5a91d02224849e70d3b3850ad5370d0810e3884a/src/index.ts#L80-L125 "Source code on GitHub")

```js
class Foo extends withProperties(
  HTMLElement,
  class {
    string? = String
    number? = Number
    boolean = Boolean
    implicitString = 'string'
    implicitNumber = 123
    implicitBoolean = true
    somethingElse? = new Uint8Array(1)
  }
) {}
```

#### Parameters

*   `parent` **C** The parent constructor to extend (usually `HTMLElement`)
*   `propsClass` **[Constructor](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)\<P>** A "props" class to create the properties from

Returns **any** A base constructor to be extended from

## Contribute

[Fork](https://github.com/stagas/with-properties/fork) or
[edit](https://github.dev/stagas/with-properties) and submit a PR.

All contributions are welcome!

## License

MIT © 2021
[stagas](https://github.com/stagas)
