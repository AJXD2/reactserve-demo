# 📝 Todo App with ReactServe

A modern, full-stack todo application built with **ReactServe** (JSX for APIs), **Drizzle ORM**, **SQLite**, and **DaisyUI**. Features a beautiful responsive UI with dark mode, pagination, and complete CRUD operations.

## ✨ Features

- ✅ **Full CRUD operations** - Create, read, update, and delete todos
- 📄 **Pagination** - Navigate through large lists of todos efficiently
- ✔️ **Completed state** - Mark todos as complete/incomplete with visual feedback
- 🌓 **Dark/Light mode** - Theme toggle with localStorage persistence
- 🎨 **Modern UI** - Built with DaisyUI and Tailwind CSS
- 📱 **Responsive design** - Works on desktop and mobile
- 🔔 **Toast notifications** - User feedback for all actions
- 🗄️ **SQLite database** - Local database with Drizzle ORM

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed

### Installation

1. **Install dependencies:**

```bash
bun install
```

2. **Setup database:**

```bash
bun db:push
```

3. **Seed test data (optional):**

```bash
bun db:seed
```

This creates 50 sample todos for testing pagination.

4. **Start development server:**

```bash
bun dev
```

Visit **http://localhost:6969** to see the app! 🎉

## 📚 API Endpoints

### Todos

- `GET /todos` - Get paginated todos
  - Query params: `?page=1&limit=10`
  - Response includes pagination metadata
- `GET /todos/:id` - Get single todo by ID
- `POST /todos` - Create new todo
  - Body: `{ title: string, description: string }`
- `PUT /todos/:id` - Update todo (partial updates supported)
  - Body: `{ title?, description?, completed? }`
- `DELETE /todos/:id` - Delete todo

### Users (Demo endpoints)

- `GET /users` - List all users
- `GET /users/:id` - Get user by ID

## 📁 Project Structure

```
src/
  ├── index.tsx          # Main API routes and server
  ├── db/
  │   ├── index.ts       # Database connection
  │   └── schema.ts      # Database schema (todos table)
  └── public/
      └── index.html     # Frontend UI
scripts/
  └── seed-todos.ts      # Database seeding script
```

## 🛠️ Scripts

- `bun dev` - Start development server with hot reload
- `bun start` - Start production server
- `bun build` - Build TypeScript
- `bun typecheck` - Run TypeScript type checking
- `bun db:push` - Push database schema changes
- `bun db:generate` - Generate SQL migrations
- `bun db:studio` - Open Drizzle Studio (database GUI)
- `bun db:seed` - Seed database with test todos

## 🛠️ Tech Stack

**Runtime:**
- [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime

**Backend:**
- [ReactServe](https://www.npmjs.com/package/react-serve-js) - JSX-based API framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- SQLite - Lightweight database
- TypeScript - Type safety

**Frontend:**
- Vanilla JavaScript - No framework needed for this demo
- [DaisyUI](https://daisyui.com/) - Tailwind CSS component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## 💡 Key Implementation Notes

- **Pagination**: Backend returns paginated data with metadata (total, pages, hasNext, hasPrev)
- **Partial updates**: PUT endpoint supports updating any combination of fields
- **Theme persistence**: User's theme preference saved to localStorage
- **No framework frontend**: Demonstrates clean vanilla JS implementation

## 📝 License

MIT
