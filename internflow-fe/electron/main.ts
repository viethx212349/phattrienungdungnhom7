import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Fix GPU crash trên một số máy Windows
app.disableHardwareAcceleration()
app.commandLine.appendSwitch('no-sandbox')

// Thư mục chứa output build của Electron main process
process.env.APP_ROOT = path.join(__dirname, '..')

// Biến môi trường dùng bởi vite-plugin-electron
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  console.log("Creating window...");
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    icon: path.join(process.env.VITE_PUBLIC!, 'favicon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      // Bảo mật: tắt nodeIntegration trong renderer
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Giao diện đẹp hơn: ẩn menu bar mặc định
    autoHideMenuBar: true,
    show: false,
  })

  win.on('ready-to-show', () => {
    console.log("Window ready to show");
    win?.show();
  })

  win.webContents.on('did-fail-load', (_, code, desc) => {
    console.error("Failed to load:", code, desc);
  })

  // Mở DevTools khi ở chế độ dev
  if (VITE_DEV_SERVER_URL) {
    console.log("Loading dev server URL:", VITE_DEV_SERVER_URL);
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    const indexPath = path.join(RENDERER_DIST, 'index.html');
    console.log("Loading production file:", indexPath);
    // Khi đã build production, load file HTML tĩnh
    win.loadFile(indexPath)
    win.webContents.openDevTools()
  }
}

// Thoát app khi tất cả cửa sổ đóng (trừ macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

// macOS: tạo lại cửa sổ khi click icon trên dock
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  console.log("App is ready");

  // IPC: Thoát ứng dụng
  ipcMain.on('app-quit', () => {
    app.quit();
  });

  // IPC: Lấy version ứng dụng
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  createWindow();
})
