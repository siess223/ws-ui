/**
 * Point ws-ui's node_modules at the app that just installed it.
 * TypeScript resolves `react` from the file location, which sits outside
 * each app. Metro uses disableHierarchicalLookup, so these links are for
 * the typechecker only.
 */
const fs = require("fs");
const path = require("path");

const appModules = path.resolve(process.cwd(), "node_modules");
const destRoot = path.resolve(__dirname, "node_modules");
const names = [
  "react",
  "react-native",
  "expo-image",
  "expo-status-bar",
  "react-native-safe-area-context",
  "react-native-keyboard-controller",
  "@expo/vector-icons",
  "@shopify/flash-list",
  "@react-native-community/datetimepicker",
  "@types/react",
];

fs.mkdirSync(destRoot, { recursive: true });

for (const name of names) {
  const target = path.join(appModules, name);
  const link = path.join(destRoot, name);
  if (!fs.existsSync(target)) continue;
  fs.mkdirSync(path.dirname(link), { recursive: true });
  if (fs.existsSync(link)) continue;
  fs.symlinkSync(target, link, "junction");
}
