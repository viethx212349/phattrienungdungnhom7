// Type declarations for Electron APIs exposed via preload script

export interface ElectronAPI {
  send: (channel: string, ...args: unknown[]) => void
  on: (channel: string, listener: (...args: unknown[]) => void) => void
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
  removeAllListeners: (channel: string) => void
  quitApp: () => void
  getAppVersion: () => Promise<string>
  platform: NodeJS.Platform
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
