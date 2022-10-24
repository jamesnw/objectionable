# Objectionable

When something is mutating your data, and you don't know what it is, find it `objectionable`.

This will setup a deep proxy that will alert you whenever an object is mutated.

```ts
let objected = objectionable([{ a: [0, { b: [{ c: 1 }] }] }]);
objected[0].a[1].b[0].c = 2;
// Console.log >> "Set: /0/a/1/b/0/c to 2";
```

Check tests to see all covered cases. Some highlights-

- new key added
- editing existing value
- deep nesting, including mixed arrays and objects
- new value added to array
- length changed on array (implicitly and explicitly)

## Get started

1. Install:

```bash
npm install objectionable
pnpm add objectionable
yarn add objectionable
```

2. Import into your project:

```ts
import objectionable from "objectionable";
```

3. Wrap any assignments to the value you want to track with `objectionable`.

```ts
let observed = objectionable(newValue);
```

Any mutations to `observed` will be reported.

4. Fix the issue, and uninstall objectionable.

## Features:

1. No dependencies
1. Designed for temporary troubleshooting
1. 100% test coverage
1. Handles deeply nested array and objects
1. Helpful for troubleshooting React, Vue and Svelte reactivity issues.

## Options:

`setValue` - Boolean, defaults to true

If true, object setting acts as normal. If false, the value won't change, and an error will be thrown on every set.

`reporter` - callback, defaults to console.log of `Set: ${path} to ${value}`

Callback receives the following arguments-

- `object`- the entire observed object
- `prop`- the specific key being set
- `path`- a `/` separated path to the key
- `value`- the value being set

Example callback, which would throw an error when a specific key is changed-

```ts
const callback: ObjectionableReporterCallback = function (
  object,
  property,
  path,
  value
) {
  if (path === "deep/path/set") {
    throw new Error(`${path} set to ${value}`);
  }
};
```

# Other options

- Roll your own recursive proxy.
  - Certainly less overhead, but there are fair number of edge cases you may miss. For example, most StackOverflow solutions don't handle arrays.
- https://github.com/samvv/js-proxy-deep or https://github.com/qiwi/deep-proxy
  - Allows for more use cases of proxies, but requires more setup to solve this particular use.

# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.
