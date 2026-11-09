# ws-ui

Shared React Native / Expo UI kit for Waansaung apps.

Components ship as TypeScript source (`src/`). Host apps import from `ws-ui` and wrap the tree with `WsThemeProvider` so controls pick up app colors and language (including Myanmar typography metrics).

## Install

```bash
npm install github:siess223/ws-ui
```

Or in `package.json`:

```json
{
  "dependencies": {
    "ws-ui": "github:siess223/ws-ui"
  },
  "scripts": {
    "postinstall": "node ./node_modules/ws-ui/link-types.js"
  }
}
```

`link-types.js` junctions the host app’s peer packages into `ws-ui/node_modules` so TypeScript can resolve `react` / `react-native` from this package’s source tree. Metro does not need those links.

### Peer dependencies

Install matching versions in the host app:

- `react`, `react-native`
- `@expo/vector-icons`
- `expo-image`, `expo-status-bar`
- `react-native-safe-area-context`
- `react-native-keyboard-controller`
- `@shopify/flash-list`
- `@react-native-community/datetimepicker`

### Metro

Point `watchFolders` at the installed package so source HMR works:

```js
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.watchFolders = [path.resolve(projectRoot, "node_modules/ws-ui")];

module.exports = config;
```

## Usage

```tsx
import { WsThemeProvider, WsButton, WsInput } from "ws-ui";

export function AppShell({ colors, language, children }) {
  return (
    <WsThemeProvider colors={colors} language={language}>
      {children}
    </WsThemeProvider>
  );
}

export function Example() {
  return (
    <>
      <WsInput value="" onChangeText={() => {}} placeholder="Search" />
      <WsButton title="Continue" onPress={() => {}} />
    </>
  );
}
```

`colors` should match the `WsColors` shape exported from this package. Pass the active UI language (`en`, `mm`, `zh`, `th`, …) when Myanmar-aware line metrics matter.

## Layout

```text
src/
  index.ts          # public exports
  theme/            # colors, spacing, WsThemeProvider
  tokens/           # shared input / control tokens
  text/             # text helpers
  ws_button/        # one folder per component
  ws_input/
  …
link-types.js       # postinstall helper for the typechecker
```

Naming: folders use `ws_*`; React exports use PascalCase (`WsButton`).

## Local development

Clone next to a host app and temporarily depend with `"ws-ui": "file:../ws-ui"`, or keep `github:siess223/ws-ui` and bump the lockfile after pushing kit changes.
