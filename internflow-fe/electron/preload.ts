import { contextBridge, ipcRenderer } from 'electron'

// Expose các API an toàn cho renderer process thông qua contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  // IPC communication
  send: (channel: string, ...args: unknown[]) => {
    ipcRenderer.send(channel, ...args)
  },
  on: (channel: string, listener: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => listener(...args))
  },
  invoke: (channel: string, ...args: unknown[]) => {
    return ipcRenderer.invoke(channel, ...args)
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  },

  // App controls
  quitApp: () => {
    ipcRenderer.send('app-quit')
  },
  getAppVersion: () => {
    return ipcRenderer.invoke('get-app-version')
  },

  // Platform info
  platform: process.platform,
})
