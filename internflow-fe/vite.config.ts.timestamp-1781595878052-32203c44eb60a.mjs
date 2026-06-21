// vite.config.ts
import { defineConfig } from "file:///E:/vscode/phattrienungdung/internflowwindow/phattrienungdungnhom7-monorepo/internflow-fe/node_modules/vite/dist/node/index.js";
import react from "file:///E:/vscode/phattrienungdung/internflowwindow/phattrienungdungnhom7-monorepo/internflow-fe/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///E:/vscode/phattrienungdung/internflowwindow/phattrienungdungnhom7-monorepo/internflow-fe/node_modules/@tailwindcss/vite/dist/index.mjs";
import electron from "file:///E:/vscode/phattrienungdung/internflowwindow/phattrienungdungnhom7-monorepo/internflow-fe/node_modules/vite-plugin-electron/dist/simple.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        // Electron main process entry point
        entry: "electron/main.ts"
      },
      preload: {
        // Electron preload script entry point
        input: "electron/preload.ts"
      },
      // Polyfill Electron & Node.js API cho Renderer process 
      renderer: {}
    })
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx2c2NvZGVcXFxccGhhdHRyaWVudW5nZHVuZ1xcXFxpbnRlcm5mbG93d2luZG93XFxcXHBoYXR0cmllbnVuZ2R1bmduaG9tNy1tb25vcmVwb1xcXFxpbnRlcm5mbG93LWZlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx2c2NvZGVcXFxccGhhdHRyaWVudW5nZHVuZ1xcXFxpbnRlcm5mbG93d2luZG93XFxcXHBoYXR0cmllbnVuZ2R1bmduaG9tNy1tb25vcmVwb1xcXFxpbnRlcm5mbG93LWZlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi92c2NvZGUvcGhhdHRyaWVudW5nZHVuZy9pbnRlcm5mbG93d2luZG93L3BoYXR0cmllbnVuZ2R1bmduaG9tNy1tb25vcmVwby9pbnRlcm5mbG93LWZlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnXHJcbmltcG9ydCBlbGVjdHJvbiBmcm9tICd2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICB0YWlsd2luZGNzcygpLFxyXG4gICAgZWxlY3Ryb24oe1xyXG4gICAgICBtYWluOiB7XHJcbiAgICAgICAgLy8gRWxlY3Ryb24gbWFpbiBwcm9jZXNzIGVudHJ5IHBvaW50XHJcbiAgICAgICAgZW50cnk6ICdlbGVjdHJvbi9tYWluLnRzJyxcclxuICAgICAgfSxcclxuICAgICAgcHJlbG9hZDoge1xyXG4gICAgICAgIC8vIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0IGVudHJ5IHBvaW50XHJcbiAgICAgICAgaW5wdXQ6ICdlbGVjdHJvbi9wcmVsb2FkLnRzJyxcclxuICAgICAgfSxcclxuICAgICAgLy8gUG9seWZpbGwgRWxlY3Ryb24gJiBOb2RlLmpzIEFQSSBjaG8gUmVuZGVyZXIgcHJvY2VzcyBcclxuICAgICAgcmVuZGVyZXI6IHt9LFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBc2MsU0FBUyxvQkFBb0I7QUFDbmUsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sY0FBYztBQUVyQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUE7QUFBQSxRQUVKLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxTQUFTO0FBQUE7QUFBQSxRQUVQLE9BQU87QUFBQSxNQUNUO0FBQUE7QUFBQSxNQUVBLFVBQVUsQ0FBQztBQUFBLElBQ2IsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
