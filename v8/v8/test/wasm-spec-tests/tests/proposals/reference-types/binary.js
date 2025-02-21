
'use strict';

let externrefs = {};
let externsym = Symbol("externref");
function externref(s) {
  if (! (s in externrefs)) externrefs[s] = {[externsym]: s};
  return externrefs[s];
}
function is_externref(x) {
  return (x !== null && externsym in x) ? 1 : 0;
}
function is_funcref(x) {
  return typeof x === "function" ? 1 : 0;
}
function eq_externref(x, y) {
  return x === y ? 1 : 0;
}
function eq_funcref(x, y) {
  return x === y ? 1 : 0;
}

let spectest = {
  externref: externref,
  is_externref: is_externref,
  is_funcref: is_funcref,
  eq_externref: eq_externref,
  eq_funcref: eq_funcref,
  print: console.log.bind(console),
  print_i32: console.log.bind(console),
  print_i32_f32: console.log.bind(console),
  print_f64_f64: console.log.bind(console),
  print_f32: console.log.bind(console),
  print_f64: console.log.bind(console),
  global_i32: 666,
  global_f32: 666,
  global_f64: 666,
  table: new WebAssembly.Table({initial: 10, maximum: 20, element: 'anyfunc'}),
  memory: new WebAssembly.Memory({initial: 1, maximum: 2})
};

let handler = {
  get(target, prop) {
    return (prop in target) ?  target[prop] : {};
  }
};
let registry = new Proxy({spectest}, handler);

function register(name, instance) {
  registry[name] = instance.exports;
}

function module(bytes, valid = true) {
  let buffer = new ArrayBuffer(bytes.length);
  let view = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; ++i) {
    view[i] = bytes.charCodeAt(i);
  }
  let validated;
  try {
    validated = WebAssembly.validate(buffer);
  } catch (e) {
    throw new Error("Wasm validate throws");
  }
  if (validated !== valid) {
    throw new Error("Wasm validate failure" + (valid ? "" : " expected"));
  }
  return new WebAssembly.Module(buffer);
}

function instance(bytes, imports = registry) {
  return new WebAssembly.Instance(module(bytes), imports);
}

function call(instance, name, args) {
  return instance.exports[name](...args);
}

function get(instance, name) {
  let v = instance.exports[name];
  return (v instanceof WebAssembly.Global) ? v.value : v;
}

function exports(instance) {
  return {module: instance.exports, spectest: spectest};
}

function run(action) {
  action();
}

function assert_malformed(bytes) {
  try { module(bytes, false) } catch (e) {
    if (e instanceof WebAssembly.CompileError) return;
  }
  throw new Error("Wasm decoding failure expected");
}

function assert_invalid(bytes) {
  try { module(bytes, false) } catch (e) {
    if (e instanceof WebAssembly.CompileError) return;
  }
  throw new Error("Wasm validation failure expected");
}

function assert_unlinkable(bytes) {
  let mod = module(bytes);
  try { new WebAssembly.Instance(mod, registry) } catch (e) {
    if (e instanceof WebAssembly.LinkError) return;
  }
  throw new Error("Wasm linking failure expected");
}

function assert_uninstantiable(bytes) {
  let mod = module(bytes);
  try { new WebAssembly.Instance(mod, registry) } catch (e) {
    if (e instanceof WebAssembly.RuntimeError) return;
  }
  throw new Error("Wasm trap expected");
}

function assert_trap(action) {
  try { action() } catch (e) {
    if (e instanceof WebAssembly.RuntimeError) return;
  }
  throw new Error("Wasm trap expected");
}

let StackOverflow;
try { (function f() { 1 + f() })() } catch (e) { StackOverflow = e.constructor }

function assert_exhaustion(action) {
  try { action() } catch (e) {
    if (e instanceof StackOverflow) return;
  }
  throw new Error("Wasm resource exhaustion expected");
}

function assert_return(action, ...expected) {
  let actual = action();
  if (actual === undefined) {
    actual = [];
  } else if (!Array.isArray(actual)) {
    actual = [actual];
  }
  if (actual.length !== expected.length) {
    throw new Error(expected.length + " value(s) expected, got " + actual.length);
  }
  for (let i = 0; i < actual.length; ++i) {
    switch (expected[i]) {
      case "nan:canonical":
      case "nan:arithmetic":
      case "nan:any":
        // Note that JS can't reliably distinguish different NaN values,
        // so there's no good way to test that it's a canonical NaN.
        if (!Number.isNaN(actual[i])) {
          throw new Error("Wasm return value NaN expected, got " + actual[i]);
        };
        return;
      case "ref.func":
        if (typeof actual[i] !== "function") {
          throw new Error("Wasm function return value expected, got " + actual[i]);
        };
        return;
      case "ref.extern":
        if (actual[i] === null) {
          throw new Error("Wasm reference return value expected, got " + actual[i]);
        };
        return;
      default:
        if (!Object.is(actual[i], expected[i])) {
          throw new Error("Wasm return value " + expected[i] + " expected, got " + actual[i]);
        };
    }
  }
}

// binary.wast:1
let $1 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00");

// binary.wast:2
let $2 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00");

// binary.wast:3
let $3 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00");
let $M1 = $3;

// binary.wast:4
let $4 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00");
let $M2 = $4;

// binary.wast:6
assert_malformed("");

// binary.wast:7
assert_malformed("\x01");

// binary.wast:8
assert_malformed("\x00\x61\x73");

// binary.wast:9
assert_malformed("\x61\x73\x6d\x00");

// binary.wast:10
assert_malformed("\x6d\x73\x61\x00");

// binary.wast:11
assert_malformed("\x6d\x73\x61\x00\x01\x00\x00\x00");

// binary.wast:12
assert_malformed("\x6d\x73\x61\x00\x00\x00\x00\x01");

// binary.wast:13
assert_malformed("\x61\x73\x6d\x01\x00\x00\x00\x00");

// binary.wast:14
assert_malformed("\x77\x61\x73\x6d\x01\x00\x00\x00");

// binary.wast:15
assert_malformed("\x7f\x61\x73\x6d\x01\x00\x00\x00");

// binary.wast:16
assert_malformed("\x80\x61\x73\x6d\x01\x00\x00\x00");

// binary.wast:17
assert_malformed("\x82\x61\x73\x6d\x01\x00\x00\x00");

// binary.wast:18
assert_malformed("\xff\x61\x73\x6d\x01\x00\x00\x00");

// binary.wast:21
assert_malformed("\x00\x00\x00\x01\x6d\x73\x61\x00");

// binary.wast:24
assert_malformed("\x61\x00\x6d\x73\x00\x01\x00\x00");

// binary.wast:25
assert_malformed("\x73\x6d\x00\x61\x00\x00\x01\x00");

// binary.wast:28
assert_malformed("\x00\x41\x53\x4d\x01\x00\x00\x00");

// binary.wast:31
assert_malformed("\x00\x81\xa2\x94\x01\x00\x00\x00");

// binary.wast:34
assert_malformed("\xef\xbb\xbf\x00\x61\x73\x6d\x01\x00\x00\x00");

// binary.wast:37
assert_malformed("\x00\x61\x73\x6d");

// binary.wast:38
assert_malformed("\x00\x61\x73\x6d\x01");

// binary.wast:39
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00");

// binary.wast:40
assert_malformed("\x00\x61\x73\x6d\x00\x00\x00\x00");

// binary.wast:41
assert_malformed("\x00\x61\x73\x6d\x0d\x00\x00\x00");

// binary.wast:42
assert_malformed("\x00\x61\x73\x6d\x0e\x00\x00\x00");

// binary.wast:43
assert_malformed("\x00\x61\x73\x6d\x00\x01\x00\x00");

// binary.wast:44
assert_malformed("\x00\x61\x73\x6d\x00\x00\x01\x00");

// binary.wast:45
assert_malformed("\x00\x61\x73\x6d\x00\x00\x00\x01");

// binary.wast:48
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x0d\x00");

// binary.wast:49
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x7f\x00");

// binary.wast:50
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x80\x00\x01\x00");

// binary.wast:51
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x81\x00\x01\x00");

// binary.wast:52
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\xff\x00\x01\x00");

// binary.wast:55
let $5 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x04\x01\x00\x82\x00");

// binary.wast:60
let $6 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x07\x01\x00\x82\x80\x80\x80\x00");

// binary.wast:67
let $7 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x07\x01\x7f\x00\x41\x80\x00\x0b");

// binary.wast:74
let $8 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x07\x01\x7f\x00\x41\xff\x7f\x0b");

// binary.wast:81
let $9 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0a\x01\x7f\x00\x41\x80\x80\x80\x80\x00\x0b");

// binary.wast:88
let $10 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0a\x01\x7f\x00\x41\xff\xff\xff\xff\x7f\x0b");

// binary.wast:96
let $11 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x07\x01\x7e\x00\x42\x80\x00\x0b");

// binary.wast:103
let $12 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x07\x01\x7e\x00\x42\xff\x7f\x0b");

// binary.wast:110
let $13 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x00\x0b");

// binary.wast:117
let $14 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\xff\xff\xff\xff\xff\xff\xff\xff\xff\x7f\x0b");

// binary.wast:125
let $15 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x03\x01\x00\x00\x0b\x06\x01\x00\x41\x00\x0b\x00");

// binary.wast:134
let $16 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x04\x04\x01\x70\x00\x00\x09\x06\x01\x00\x41\x00\x0b\x00");

// binary.wast:144
let $17 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x03\x01\x00\x00\x0b\x07\x01\x80\x00\x41\x00\x0b\x00");

// binary.wast:154
let $18 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x04\x04\x01\x70\x00\x00\x09\x09\x01\x02\x80\x00\x41\x00\x0b\x00\x00");

// binary.wast:164
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x08\x01\x00\x82\x80\x80\x80\x80\x00");

// binary.wast:174
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0b\x01\x7f\x00\x41\x80\x80\x80\x80\x80\x00\x0b");

// binary.wast:184
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0b\x01\x7f\x00\x41\xff\xff\xff\xff\xff\x7f\x0b");

// binary.wast:195
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x10\x01\x7e\x00\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x80\x00\x0b");

// binary.wast:205
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x10\x01\x7e\x00\x42\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x7f\x0b");

// binary.wast:217
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x07\x01\x00\x82\x80\x80\x80\x70");

// binary.wast:225
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x07\x01\x00\x82\x80\x80\x80\x40");

// binary.wast:235
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0a\x01\x7f\x00\x41\x80\x80\x80\x80\x70\x0b");

// binary.wast:245
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0a\x01\x7f\x00\x41\xff\xff\xff\xff\x0f\x0b");

// binary.wast:255
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0a\x01\x7f\x00\x41\x80\x80\x80\x80\x1f\x0b");

// binary.wast:265
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0a\x01\x7f\x00\x41\xff\xff\xff\xff\x4f\x0b");

// binary.wast:276
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x7e\x0b");

// binary.wast:286
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\xff\xff\xff\xff\xff\xff\xff\xff\xff\x01\x0b");

// binary.wast:296
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x02\x0b");

// binary.wast:306
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\xff\xff\xff\xff\xff\xff\xff\xff\xff\x41\x0b");

// binary.wast:317
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x7e\x0b");

// binary.wast:327
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\xff\xff\xff\xff\xff\xff\xff\xff\xff\x01\x0b");

// binary.wast:337
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x02\x0b");

// binary.wast:347
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\xff\xff\xff\xff\xff\xff\xff\xff\xff\x41\x0b");

// binary.wast:360
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x08\x01\x00\x82\x80\x80\x80\x80\x00");

// binary.wast:368
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x11\x01\x0f\x01\x01\x7f\x41\x00\x28\x02\x82\x80\x80\x80\x80\x00\x1a\x0b");

// binary.wast:387
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x11\x01\x0f\x01\x01\x7f\x41\x00\x28\x82\x80\x80\x80\x80\x00\x00\x1a\x0b");

// binary.wast:406
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x12\x01\x10\x01\x01\x7f\x41\x00\x41\x03\x36\x82\x80\x80\x80\x80\x00\x03\x0b");

// binary.wast:425
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x12\x01\x10\x01\x01\x7f\x41\x00\x41\x03\x36\x02\x82\x80\x80\x80\x80\x00\x0b");

// binary.wast:446
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0b\x01\x7f\x00\x41\x80\x80\x80\x80\x80\x00\x0b");

// binary.wast:456
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0b\x01\x7f\x00\x41\xff\xff\xff\xff\xff\x7f\x0b");

// binary.wast:467
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x10\x01\x7e\x00\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x80\x00\x0b");

// binary.wast:477
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x10\x01\x7e\x00\x42\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x7f\x0b");

// binary.wast:489
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x07\x01\x00\x82\x80\x80\x80\x70");

// binary.wast:497
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x07\x01\x00\x82\x80\x80\x80\x40");

// binary.wast:505
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x10\x01\x0e\x01\x01\x7f\x41\x00\x28\x02\x82\x80\x80\x80\x10\x1a\x0b");

// binary.wast:524
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x10\x01\x0e\x01\x01\x7f\x41\x00\x28\x02\x82\x80\x80\x80\x40\x1a\x0b");

// binary.wast:543
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x10\x01\x0e\x01\x01\x7f\x41\x00\x28\x82\x80\x80\x80\x10\x00\x1a\x0b");

// binary.wast:561
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x10\x01\x0e\x01\x01\x7f\x41\x00\x28\x82\x80\x80\x80\x40\x00\x1a\x0b");

// binary.wast:580
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x11\x01\x0f\x01\x01\x7f\x41\x00\x41\x03\x36\x82\x80\x80\x80\x10\x03\x0b");

// binary.wast:599
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x11\x01\x0f\x01\x01\x7f\x41\x00\x41\x03\x36\x82\x80\x80\x80\x40\x03\x0b");

// binary.wast:618
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x11\x01\x0f\x01\x01\x7f\x41\x00\x41\x03\x36\x03\x82\x80\x80\x80\x10\x0b");

// binary.wast:637
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x01\x0a\x11\x01\x0f\x01\x01\x7f\x41\x00\x41\x03\x36\x02\x82\x80\x80\x80\x40\x0b");

// binary.wast:659
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0a\x01\x7f\x00\x41\x80\x80\x80\x80\x70\x0b");

// binary.wast:669
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0a\x01\x7f\x00\x41\xff\xff\xff\xff\x0f\x0b");

// binary.wast:679
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0a\x01\x7f\x00\x41\x80\x80\x80\x80\x1f\x0b");

// binary.wast:689
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0a\x01\x7f\x00\x41\xff\xff\xff\xff\x4f\x0b");

// binary.wast:700
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x7e\x0b");

// binary.wast:710
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\xff\xff\xff\xff\xff\xff\xff\xff\xff\x01\x0b");

// binary.wast:720
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x02\x0b");

// binary.wast:730
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0f\x01\x7e\x00\x42\xff\xff\xff\xff\xff\xff\xff\xff\xff\x41\x0b");

// binary.wast:742
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x09\x01\x07\x00\x41\x00\x40\x01\x1a\x0b");

// binary.wast:762
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x0a\x01\x08\x00\x41\x00\x40\x80\x00\x1a\x0b");

// binary.wast:782
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x0b\x01\x09\x00\x41\x00\x40\x80\x80\x00\x1a\x0b");

// binary.wast:801
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x0c\x01\x0a\x00\x41\x00\x40\x80\x80\x80\x00\x1a\x0b");

// binary.wast:820
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x0d\x01\x0b\x00\x41\x00\x40\x80\x80\x80\x80\x00\x1a\x0b");

// binary.wast:840
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x07\x01\x05\x00\x3f\x01\x1a\x0b");

// binary.wast:859
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x08\x01\x06\x00\x3f\x80\x00\x1a\x0b");

// binary.wast:878
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x09\x01\x07\x00\x3f\x80\x80\x00\x1a\x0b");

// binary.wast:896
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x0a\x01\x08\x00\x3f\x80\x80\x80\x00\x1a\x0b");

// binary.wast:914
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x0b\x01\x09\x00\x3f\x80\x80\x80\x80\x00\x1a\x0b");

// binary.wast:933
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x0a\x0c\x01\x0a\x02\xff\xff\xff\xff\x0f\x7f\x02\x7e\x0b");

// binary.wast:950
let $19 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x0a\x0a\x01\x08\x03\x00\x7f\x00\x7e\x02\x7d\x0b");

// binary.wast:965
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x03\x02\x00\x00");

// binary.wast:975
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x0a\x04\x01\x02\x00\x0b");

// binary.wast:984
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x03\x02\x00\x00\x0a\x04\x01\x02\x00\x0b");

// binary.wast:995
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x0a\x07\x02\x02\x00\x0b\x02\x00\x0b");

// binary.wast:1006
let $20 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x03\x01\x00");

// binary.wast:1012
let $21 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x0a\x01\x00");

// binary.wast:1018
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x0c\x01\x03\x0b\x05\x02\x01\x00\x01\x00");

// binary.wast:1028
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x0c\x01\x01\x0b\x05\x02\x01\x00\x01\x00");

// binary.wast:1038
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x0e\x01\x0c\x00\x41\x00\x41\x00\x41\x00\xfc\x08\x00\x00\x0b\x0b\x03\x01\x01\x00");

// binary.wast:1060
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x05\x03\x01\x00\x00\x0a\x07\x01\x05\x00\xfc\x09\x00\x0b\x0b\x03\x01\x01\x00");

// binary.wast:1079
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x04\x04\x01\x70\x00\x00\x05\x03\x01\x00\x00\x09\x07\x01\x05\x70\x01\xd3\x00\x0b\x0a\x04\x01\x02\x00\x0b");

// binary.wast:1105
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x04\x04\x01\x70\x00\x00\x05\x03\x01\x00\x00\x09\x07\x01\x05\x7f\x01\xd2\x00\x0b\x0a\x04\x01\x02\x00\x0b");

// binary.wast:1131
let $22 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x04\x04\x01\x70\x00\x00\x05\x03\x01\x00\x00\x09\x07\x01\x05\x70\x01\xd2\x00\x0b\x0a\x04\x01\x02\x00\x0b");

// binary.wast:1155
let $23 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x04\x04\x01\x70\x00\x00\x05\x03\x01\x00\x00\x09\x07\x01\x05\x70\x01\xd0\x70\x0b\x0a\x04\x01\x02\x00\x0b");

// binary.wast:1180
let $24 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x01\x00");

// binary.wast:1186
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x07\x02\x60\x00\x00");

// binary.wast:1197
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x07\x01\x60\x00\x00\x60\x00\x00");

// binary.wast:1208
let $25 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x05\x01\x60\x01\x7f\x00\x02\x01\x00");

// binary.wast:1216
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x02\x04\x01\x00\x00\x04");

// binary.wast:1226
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x02\x05\x01\x00\x00\x04\x00");

// binary.wast:1237
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x02\x04\x01\x00\x00\x05");

// binary.wast:1247
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x02\x05\x01\x00\x00\x05\x00");

// binary.wast:1258
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x02\x04\x01\x00\x00\x80");

// binary.wast:1268
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x02\x05\x01\x00\x00\x80\x00");

// binary.wast:1281
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x05\x01\x60\x01\x7f\x00\x02\x16\x02\x08\x73\x70\x65\x63\x74\x65\x73\x74\x09\x70\x72\x69\x6e\x74\x5f\x69\x33\x32\x00\x00");

// binary.wast:1300
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x09\x02\x60\x01\x7f\x00\x60\x01\x7d\x00\x02\x2b\x01\x08\x73\x70\x65\x63\x74\x65\x73\x74\x09\x70\x72\x69\x6e\x74\x5f\x69\x33\x32\x00\x00\x08\x73\x70\x65\x63\x74\x65\x73\x74\x09\x70\x72\x69\x6e\x74\x5f\x66\x33\x32\x00\x01");

// binary.wast:1325
let $26 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x04\x01\x00");

// binary.wast:1331
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x04\x01\x01");

// binary.wast:1341
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x03\x01\x70\x02");

// binary.wast:1350
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x04\x01\x70\x02\x00");

// binary.wast:1360
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x06\x01\x70\x81\x00\x00\x00");

// binary.wast:1372
let $27 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x01\x00");

// binary.wast:1378
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x01\x01");

// binary.wast:1388
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x02\x01\x02");

// binary.wast:1396
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x03\x01\x02\x00");

// binary.wast:1405
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x05\x01\x81\x00\x00\x00");

// binary.wast:1414
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x05\x01\x81\x01\x00\x00");

// binary.wast:1425
let $28 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x01\x00");

// binary.wast:1431
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x06\x02\x7f\x00\x41\x00\x0b");

// binary.wast:1442
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x06\x0b\x01\x7f\x00\x41\x00\x0b\x7f\x00\x41\x00\x0b");

// binary.wast:1453
let $29 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x03\x02\x00\x00\x07\x01\x00\x0a\x07\x02\x02\x00\x0b\x02\x00\x0b");

// binary.wast:1465
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x03\x02\x00\x00\x07\x06\x02\x02\x66\x31\x00\x00\x0a\x07\x02\x02\x00\x0b\x02\x00\x0b");

// binary.wast:1486
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x03\x02\x00\x00\x07\x0b\x01\x02\x66\x31\x00\x00\x02\x66\x32\x00\x01\x0a\x07\x02\x02\x00\x0b\x02\x00\x0b");

// binary.wast:1507
let $30 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x04\x04\x01\x70\x00\x01\x09\x01\x00\x0a\x04\x01\x02\x00\x0b");

// binary.wast:1520
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x04\x04\x01\x70\x00\x01\x09\x07\x02\x00\x41\x00\x0b\x01\x00\x0a\x04\x01\x02\x00\x0b");

// binary.wast:1538
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x04\x04\x01\x70\x00\x01\x09\x0d\x01\x00\x41\x00\x0b\x01\x00\x00\x41\x00\x0b\x01\x00\x0a\x04\x01\x02\x00\x0b");

// binary.wast:1556
let $31 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x03\x01\x00\x01\x0b\x01\x00");

// binary.wast:1564
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x03\x01\x00\x01\x0b\x07\x02\x00\x41\x00\x0b\x01\x61");

// binary.wast:1577
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x03\x01\x00\x01\x0b\x0d\x01\x00\x41\x00\x0b\x01\x61\x00\x41\x01\x0b\x01\x62");

// binary.wast:1590
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x03\x01\x00\x01\x0b\x0c\x01\x00\x41\x03\x0b\x07\x61\x62\x63\x64\x65\x66");

// binary.wast:1604
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x05\x03\x01\x00\x01\x0b\x0c\x01\x00\x41\x00\x0b\x05\x61\x62\x63\x64\x65\x66");

// binary.wast:1618
let $32 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x0a\x11\x01\x0f\x00\x02\x40\x41\x01\x04\x40\x41\x01\x0e\x00\x02\x0b\x0b\x0b");

// binary.wast:1635
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x0a\x12\x01\x11\x00\x02\x40\x41\x01\x04\x40\x41\x01\x0e\x01\x00\x01\x02\x0b\x0b\x0b");

// binary.wast:1657
let $33 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x08\x01\x00\x0a\x04\x01\x02\x00\x0b");

// binary.wast:1670
assert_malformed("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x04\x01\x60\x00\x00\x03\x02\x01\x00\x08\x01\x00\x08\x01\x00\x0a\x04\x01\x02\x00\x0b");
