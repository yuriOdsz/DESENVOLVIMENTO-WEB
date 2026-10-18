// Exercise the actual dependency ref callback, including React 19 cleanup.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.dirname(
  require.resolve("react-input-mask-next/package.json"),
);
const source = fs.readFileSync(
  path.join(root, "lib/react-input-mask.development.js"),
  "utf8",
);
const callback = source.match(
  /ref: function ref\(_ref\) \{([\s\S]*?)\n    \},/,
);
assert.ok(callback, "Dependency input ref callback must be present");
const node = { nodeType: 1, tagName: "INPUT" };
for (const forwarded of ["callback", "object"]) {
  const received = [];
  const inputRef = { current: null };
  const forwardedRef =
    forwarded === "callback"
      ? (value) => received.push(value)
      : { current: null };
  const context = {
    inputRef,
    forwardedRef,
    isFunction: (value) => typeof value === "function",
  };
  // No reactDom provided: the callback must work without findDOMNode.
  const ref = vm.runInNewContext(
    `(function(_ref) {${callback[1]}\n})`,
    context,
  );
  for (const value of [node, null, node, null]) {
    ref(value);
    assert.equal(inputRef.current, value);
    assert.equal(
      forwarded === "callback" ? received.at(-1) : forwardedRef.current,
      value,
    );
  }
}
for (const file of [
  "lib/react-input-mask.development.js",
  "lib/react-input-mask.production.min.js",
  "dist/react-input-mask.js",
]) {
  assert.doesNotMatch(
    fs.readFileSync(path.join(root, file), "utf8"),
    /\.findDOMNode\s*\(/,
  );
}
console.log(
  "Máscaras OK: montagem, limpeza, remontagem e refs encaminhadas sem findDOMNode.",
);
