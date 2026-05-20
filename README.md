# Mi Boleta · ¿Y si sí me lo gané?

Frontend de la práctica individual para administrar boletas, rifas, loterías y sorteos. Consume la API REST de `mi-boleta-api` y está construido con **Clean Architecture** estricta.

---

## Stack

- **Next.js 16 (App Router)** + **React 19** + **TypeScript** estricto
- **Tailwind CSS v4** con design tokens propios (`brand`, `gold`, `ink`)
- **Zustand** + `persist` para sesión, **TanStack Query v5** para estado servidor
- **React Hook Form** + **Zod** para formularios y validación
- **Axios** con interceptores (inyección de token y manejo global de 401)
- **Vitest** + **React Testing Library** para tests

---

## Estructura — Clean Architecture

```
src/
├── domain/              # Núcleo: entidades, value objects, repositorios (interfaces), errores
│   ├── entities/        # Ticket, User
│   ├── repositories/    # AuthRepository, TicketRepository, AdminTicketRepository
│   ├── value-objects/   # PaginationMeta, PaginatedResult<T>
│   └── errors/          # DomainError + subclases
│
├── application/         # Casos de uso, ports
│   ├── ports/           # TokenStorage, SessionStorage
│   └── usecases/        # RegisterUser, LoginUser, LogoutUser, GetCurrentSession,
│                        # ListTickets, GetTicketById, CreateTicket, UpdateTicket,
│                        # DeleteTicket, ListAllTicketsAdmin
│
├── infrastructure/      # Adapters concretos
│   ├── config/          # env.ts (NEXT_PUBLIC_API_BASE_URL)
│   ├── http/            # httpClient (axios + interceptores), errors, mappers, types
│   ├── repositories/    # HttpAuthRepository, HttpTicketRepository, HttpAdminTicketRepository
│   ├── storage/         # LocalTokenStorage, LocalSessionStorage
│   └── di/              # container.ts (composition root)
│
├── presentation/        # React (UI)
│   ├── providers/       # AppProviders, QueryProvider, ThemeProvider, ToastProvider
│   ├── stores/          # authStore (Zustand)
│   ├── hooks/           # useAuth, useTickets, useAdminTickets, useDebouncedValue
│   ├── guards/          # RequireAuth, RequireAdmin
│   ├── lib/             # cn, formatters, validation/* (schemas Zod)
│   └── components/
│       ├── ui/          # Button, Input, Textarea, Select, Label, FieldError,
│       │                # Badge, Modal, Spinner, Card, EmptyState, Alert, Skeleton
│       ├── forms/       # LoginForm, RegisterForm, TicketForm
│       ├── tickets/     # TicketCard, TicketFilters, Pagination, TicketCardSkeleton
│       ├── dashboard/   # StatCard
│       └── layout/      # Container, Logo, Navbar, ProtectedShell, PageHeader, ThemeToggle
│
└── app/                 # Next.js App Router (capa de entrega)
    ├── layout.tsx       # html lang="es", providers, fuentes
    ├── page.tsx         # redirige a /dashboard o /login
    ├── not-found.tsx    # 404
    ├── (auth)/          # layout centrado · /login · /register
    └── (app)/           # layout con RequireAuth + Navbar
        ├── dashboard/
        ├── tickets/     # /tickets, /tickets/new, /tickets/[id], /tickets/[id]/edit
        └── admin/       # layout con RequireAdmin · /admin
```

**Regla de dependencias** (estricta):

- `domain/` no importa nada de las otras capas.
- `application/` solo importa de `domain/`.
- `infrastructure/` implementa interfaces de `domain/` + `application/`.
- `presentation/` usa `application/` y `domain/` y consume el `container` de `infrastructure/di`.
- `app/` solo importa de `presentation/`.

---

## Requisitos previos

- Node.js **20.x** o superior
- npm 10+
- La API `mi-boleta-api` corriendo (por defecto en `http://localhost:4000`)

---

## Setup local

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Variables de entorno** — copia `.env.example` a `.env.local`:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
   ```

3. **Arrancar en desarrollo**

   ```bash
   npm run dev
   ```

   App disponible en `http://localhost:3000`.

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Modo desarrollo con hot reload |
| `npm run build` | Build de producción |
| `npm start` | Servir el build de producción |
| `npm run lint` | ESLint (Next.js + reglas de React 19) |
| `npm run typecheck` | TypeScript estricto sin emitir |
| `npm test` | Vitest en modo watch |
| `npm run test:run` | Vitest en modo CI (corre y termina) |

---

## Características

### Autenticación y persistencia
- Registro de usuario con validación cliente (nombre 2-80, email válido, contraseña ≥ 8, confirmación).
- Login con JWT. Token y usuario persistidos en `localStorage` mediante Zustand `persist`.
- La sesión sobrevive a refrescos. Logout limpia token, sesión y caché de TanStack Query.
- Interceptor de Axios inyecta `Authorization: Bearer <token>` y, en 401, limpia la sesión y redirige a `/login` automáticamente.

### CRUD de boletas
- Listado con búsqueda debounced (350 ms), filtros por estado y tipo de juego, y paginación.
- Crear, ver, editar y eliminar — la lista se invalida y refresca automáticamente vía TanStack Query.
- Modal de confirmación antes de eliminar.
- Formulario completo con los 8 campos del modelo (`title`, `gameType`, `gameNumber`, `gameDate`, `amount`, `place`, `status`, `notes`).

### Dashboard
- 4 tarjetas de KPIs: total, próximos sorteos, pendientes, ganados.
- Lista de **próximos sorteos** ordenados por fecha y de **boletas pendientes**.
- Conteos derivados en cliente — se actualizan al instante cuando creas o eliminas.

### Página de administrador
- Ruta `/admin` protegida por `RequireAdmin`. Un usuario `user` es redirigido a `/dashboard` con toast de error.
- Tabla responsive (collapsa a cards en mobile) con datos del dueño.
- Filtros combinables: búsqueda (q), estado, tipo de juego, `userId`, paginación.

### Validaciones y errores
- Validación cliente con Zod que **espeja exactamente** los mensajes del backend.
- Errores por campo (`<FieldError>`), `aria-invalid` y `aria-describedby` para accesibilidad.
- Errores del backend mostrados como `<Alert>` arriba del formulario.
- Submits deshabilitados durante la mutación con spinner.

### Diseño y UX
- Paleta "premium lottery": violeta profundo + dorado, dark mode por defecto.
- Glass-morphism en navbar/tarjetas auth, gradientes sutiles, animaciones de entrada.
- Mobile-first: cards en grid responsive, navbar con menú hamburguesa, tabla admin que se convierte en lista en mobile.
- Estados explícitos: loading (skeletons), empty (con CTA), error (con botón reintentar).
- Toggle dark/light persistido (`useSyncExternalStore`).

### Routing y protección
- `/` redirige según sesión, `/login` y `/register` redirigen a `/dashboard` si ya hay sesión.
- `(app)/layout.tsx` envuelto en `<RequireAuth>`.
- `(app)/admin/layout.tsx` envuelto en `<RequireAdmin>`.
- 404 personalizado (`not-found.tsx`).

---

## Tests

- 5 archivos de test, 19 casos:
  - **Application**: `LoginUser`, `CreateTicket` (con repos mockeados).
  - **Validación**: schemas Zod de auth y tickets (límites, enums, fechas, contraseña).
  - **Infrastructure**: `mapApiError` (mapea HTTP → domain errors).

```bash
npm run test:run
```

---

## Despliegue (Vercel)

1. Sube el repo a GitHub.
2. En vercel.com → Import project → selecciona el repo.
3. En *Environment Variables* añade:
   - `NEXT_PUBLIC_API_BASE_URL` apuntando a la URL pública de la API (p. ej. Render).
4. Deploy. Cada push a `main` re-despliega.

> El backend ya tiene `cors()` abierto; en producción se recomienda restringirlo al origen del frontend.

---

## Convenciones

- Sin `any` indiscriminado, ESLint y TypeScript en modo estricto.
- Imports absolutos con alias `@/*` apuntando a `src/*`.
- Mensajes de error en español (consistentes con la API).
- Comentarios solo donde el "por qué" no es obvio.
