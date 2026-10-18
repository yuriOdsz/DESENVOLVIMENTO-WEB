// The assignment requires this legacy package. React 19 removed findDOMNode.
// Our usage renders a native input, so its forwarded ref already is the DOM node.
const fs = require("node:fs");
const path = require("node:path");
const root = path.dirname(
  require.resolve("react-input-mask-next/package.json"),
);
for (const name of [
  "react-input-mask.development.js",
  "react-input-mask.production.min.js",
]) {
  const file = path.join(root, "lib", name);
  let text = fs.readFileSync(file, "utf8");
  if (text.includes("nodeType === 1")) continue;
  text = text.replace(
    /([\w$]+)\.findDOMNode\(([\w$]+)\)/g,
    "($2 && $2.nodeType === 1 ? $2 : $1.findDOMNode($2))",
  );
  if (!text.includes("nodeType === 1"))
    throw new Error(`Input mask compatibility patch failed: ${name}`);
  fs.writeFileSync(file, text);
}
console.log(
  "React Input Mask Next: native input refs compatible with React 19.",
);
