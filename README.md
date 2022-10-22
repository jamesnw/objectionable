# Objectionable

When something is mutating your data, and you don't know what it is, find it `objectionable`.

This will setup a deep proxy that will alert you whenever an object is mutated.

```
const x = objectionable({a: {b: [{c: 1}]}});
x.a.b[0].c = 2;
# Set: /x/a/b/0/c to 2
```

## Options:

`setValue` - Boolean, defaults to true

If true, object setting acts as normal. If false, the value won't change, and an error will be thrown on every set.

`reporter` - callback, defaults to console.log of `Set: ${path} to ${value}`

Callback receives the following arguments-

- object- the entire observed object
- prop- the specifc key being set
- path- a `/` separated path to the key
- value- the value being set
