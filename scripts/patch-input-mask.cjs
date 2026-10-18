// The assignment requires this legacy package. React 19 removed findDOMNode.
// Our usage renders a native input, so its ref already is the DOM node OR null
// during React's cleanup/Strict Mode cycle. Never call findDOMNode on cleanup.
const fs = require("node:fs");
const path = require("node:path");
const root = path.dirname(
  require.resolve("react-input-mask-next/package.json"),
);
for (const name of [
  "lib/react-input-mask.development.js",
  "lib/react-input-mask.production.min.js",
  "dist/react-input-mask.js",
]) {
  const file = path.join(root, name);
  let text = fs.readFileSync(file, "utf8");
  // Also upgrades installations containing the earlier conditional patch.
  text = text.replace(/([\w$]+)\.findDOMNode\(([\w$]+)\)/g, "$2");
  if (/\.findDOMNode\s*\(/.test(text))
    throw new Error(`Input mask compatibility patch failed: ${name}`);
  fs.writeFileSync(file, text);
}
console.log(
  "React Input Mask Next: native input refs compatible with React 19.",
);
