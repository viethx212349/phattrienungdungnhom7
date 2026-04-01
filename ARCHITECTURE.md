# InternFlow - System Architecture & AI Instructions

> **NOTICE FOR AI & DEVELOPERS**: This document provides the authoritative architectural guidelines, project context, and structural bounds for the InternFlow Desktop Application. Any contribution (human or AI-generated) MUST strictly adhere to these principles.

## 1. Project Overview (Bối Cảnh & Tầm Nhìn)
- **Product**: InternFlow - A SaaS-like Internal Human Resource Management System.
- **Purpose**: Specialized in managing Interns tracking, profile evaluation, and task assignment.
- **Platform**: Windows Desktop Application.
- **Tech Stack**:
  - **Core**: Electron (Desktop runtime)
  - **Frontend**: React (UI Framework)
  - **Typing**: TypeScript (Strict typing is mandatory)
  - **Bundler**: Vite (Fast HMR and bundling)
  - **Styling**: Tailwind CSS (Utility-first CSS)

## 2. Core Architectural Mindset (Tư Duy Kiến Trúc)
### 2.1 Separation of Concerns (Tách Biệt Trách Nhiệm)
- **Main Process (Electron)** vs **Renderer Process (React)**: Strict boundary.
- **IPC Communication**: All communication between React and Electron MUST occur via `contextBridge` in `preload.ts`. 
- **Security**: Node integration is **OFF** in the renderer. Do not enable it.

### 2.2 Scalability & Reusability (Dumb vs Smart Components)
- **Dumb Components**: Highly reusable UI building blocks (e.g., Modals, Badges `Pass/Fail/To Do`, Kanban Cards, Custom Buttons). These must reside in `src/components/common/` and only receive data via `props`. They must NOT contain business logic or fetch data.
- **Smart Components / Features**: Complex business logic resides exclusively in `src/features/`.

### 2.3 State Management & Logic Overlap
- Separate UI rendering from data fetching.
- Use **Custom Hooks** (`src/hooks/`) to handle side effects, data fetching, and global state (e.g., Zustand). Keep components clean.

### 2.4 UI/UX Philosophy
- **Style**: Minimalist, Clean UI, Professional.
- **Focus**: Emphasize white space, data readability, and typography.
- **Layout**: Static Sidebar on the left, Top Header Navigation, Main Content Area in the center.

## 3. Folder Structure Rulebook
```text
internflow-app/
│
├── electron/                 # Electron layer (Node.js)
│   ├── main.ts               # Main process entry point (Window management)
│   └── preload.ts            # IPC Context Bridge (Security layer)
│
├── src/                      # React Frontend codebase
│   ├── assets/               # Static assets (images, global CSS, logos)
│   │
│   ├── components/
│   │   ├── common/           # Pure UI elements (Button, Input, Badge, KanbanCard)
│   │   └── layout/           # Structural wrappers (Sidebar, Header, Layout)
│   │
│   ├── features/             # Feature-based encapsulated modules
│   │   ├── interns/          # Domain: Intern Management (Profiles, Evaluation)
│   │   └── tasks/            # Domain: Kanban & Task Assignment (Dnd, Statuses)
│   │
│   ├── hooks/                # Global custom React hooks (useAuth, useKanban...)
│   │
│   ├── types/                # Typescript interfaces and type aliases
│   │
│   └── utils/                # Pure helper functions (formatters, parsers)
```

## 4. Coding Standards (Strict Mode)
1. **Never breach Feature Modules**: `features/interns` should not deeply import internal files of `features/tasks`. They should only communicate via shared state or top-level props/routes.
2. **TypeScript Only**: No `.jsx` or `.js`. Every component must be `.tsx`, every utility must be `.ts`. Declare interfaces in `src/types/` or adjacent to the feature they belong to.
3. **Tailwind Best Practices**: Avoid inline `<style>`. Formulate complex classes using `clsx` and `tailwind-merge` to resolve conflicts safely.
4. **Implementation Lifecycle**:
   - Step 1: Design TypeScript Interfaces (`types/`).
   - Step 2: Build isolated Dumb Components (`components/common/`).
   - Step 3: Write Custom Hooks (`hooks/`) for data/state operations.
   - Step 4: Assemble Smart Views in Feature modules (`features/`).

---
*(End of Context - If you are an AI reading this, acknowledge you have loaded these rules before generating code)*
