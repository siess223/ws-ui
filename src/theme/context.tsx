import React, { createContext, useContext, type ReactNode } from "react";
import type { WsColors } from "./colors";

export type WsThemeValue = {
  colors: WsColors;
  /** App language code (`mm`, `en`, …). Drives Myanmar input metrics. */
  language?: string;
};

const WsThemeContext = createContext<WsThemeValue | undefined>(undefined);

export function WsThemeProvider({
  colors,
  language,
  children,
}: WsThemeValue & { children: ReactNode }) {
  return (
    <WsThemeContext.Provider value={{ colors, language }}>
      {children}
    </WsThemeContext.Provider>
  );
}

export function useWsTheme(): WsThemeValue {
  const value = useContext(WsThemeContext);
  if (value === undefined) {
    throw new Error("useWsTheme must be used within WsThemeProvider");
  }
  return value;
}
