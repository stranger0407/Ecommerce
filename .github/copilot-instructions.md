# Mahalaxmi Ecommerce - Copilot Instructions

## Architecture Overview
Full-stack ecommerce platform for servers/computers with a **Spring Boot 3.2.1 (Java 21)** backend and **React 18 + TypeScript + Vite** frontend.

### Backend Structure (`backend/`)
- **Controllers** (`controller/`): REST endpoints under `/api/*` - use `@RequiredArgsConstructor` for DI
- **Services** (`service/`): Business logic with `@Transactional` for write ops, `@Transactional(readOnly = true)` for reads
- **Entities** (`entity/`): JPA entities with Lombok (`@Data`, `@Builder`), Jakarta validation annotations
- **DTOs** (`dto/`): Data transfer objects for API responses - use `ModelMapper` for entity↔DTO conversion
- **Repositories** (`repository/`): Spring Data JPA interfaces

### Frontend Structure (`frontend/src/`)
- **State**: Zustand stores in `store/` - `authStore.ts` (auth state), `cartStore.ts` (cart state)
- **API**: Centralized Axios client in `lib/api.ts` with JWT interceptors
- **Services**: API service wrappers in `services/` matching backend endpoints
- **Types**: TypeScript interfaces in `types/index.ts` mirroring backend DTOs

## Key Patterns

### Authentication Flow
- JWT-based auth with token stored in `localStorage` under key `token`
- Frontend auto-attaches `Authorization: Bearer {token}` via Axios interceptor in [lib/api.ts](frontend/src/lib/api.ts)
- Backend filter chain: `JwtAuthenticationFilter` → `SecurityConfig`
- Public endpoints: `/api/auth/**`, `/api/products/**`, `/api/categories/**`
- Protected endpoints require valid JWT; admin routes use `@PreAuthorize("hasRole('ADMIN')")`

### Entity Conventions
- All entities use `@EntityListeners(AuditingEntityListener.class)` for `createdAt`/`updatedAt`
- User roles: `CUSTOMER` (default), `ADMIN` - defined in `entity/Role.java` enum
- Product types: `SERVER`, `DESKTOP_COMPUTER`, `LAPTOP`, `WORKSTATION`, `COMPONENT`

### API Response Patterns
- Paginated endpoints return `Page<T>` (Spring) / `PageResponse<T>` (frontend type)
- Single resources return entity DTOs wrapped in `ResponseEntity`
- Validation errors return 400 with binding error details (configured in `application.yml`)

## Development Commands

### Backend
```bash
cd backend
mvn spring-boot:run          # Start on http://localhost:8080
mvn clean install            # Build JAR
```

### Frontend
```bash
cd frontend
npm run dev                  # Start on http://localhost:5173
npm run build                # Production build (tsc + vite)
npm run lint                 # ESLint check
```

## Database
- MySQL 8.0+ on `localhost:3306/mahalaxmi_ecommerce` (auto-created)
- Default credentials: `root/root` (see [application.yml](backend/src/main/resources/application.yml))
- Schema auto-updated via `hibernate.ddl-auto: update`
- Sample data seeded by [DataInitializer.java](backend/src/main/java/com/mahalaxmi/ecommerce/config/DataInitializer.java) on empty DB

## Adding New Features

### New Backend Endpoint
1. Create/update DTO in `dto/` with validation annotations
2. Add repository method in `repository/` (follow Spring Data naming conventions)
3. Implement service method in `service/` with appropriate `@Transactional`
4. Add controller method with Javadoc, use `@Valid` for request bodies

### New Frontend Page
1. Add TypeScript types to `types/index.ts` matching backend DTOs
2. Create service method in `services/` using `api.get/post/put/delete`
3. Create page component in `pages/` with proper typing
4. Add route in [App.tsx](frontend/src/App.tsx) - wrap with `<ProtectedRoute>` if auth required

## CORS Configuration
Allowed origins configured in [SecurityConfig.java](backend/src/main/java/com/mahalaxmi/ecommerce/config/SecurityConfig.java):
- `localhost:5173-5176` (Vite dev servers)
- `localhost:3000`

Update `corsConfigurationSource()` when adding new frontend origins.
