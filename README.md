# ReactServe Todo Demo

Just another todo app but this one uses ReactServe which lets you write APIs with JSX. Pretty neat.

## What it does

- CRUD
- Pagination
- Dark mode toggle because why not
- Looks decent thanks to DaisyUI

## How to run this thing

You need Bun installed. Get it from [bun.sh](https://bun.sh/).

```bash
# Install deps
bun install

# Setup the database
bun db:push

# Add some fake todos to test with (optional but recommended)
bun db:seed

# Run it
bun dev
```

Go to http://localhost:6969 and you're good.

## API Routes

If you want to use just the API:

**Todos:**
- `GET /todos?page=1&limit=10` - Get todos (paginated)
- `GET /todos/:id` - Get one todo
- `POST /todos` - Create todo (needs `title` and `description`)
- `PUT /todos/:id` - Update todo (any field works)
- `DELETE /todos/:id` - Delete todo

## What's in here

- `src/index.tsx` - All the API routes
- `src/db/` - Database stuff (Drizzle + SQLite)
- `src/public/index.html` - The UI (plain HTML/JS, no fancy framework)
- `scripts/seed-todos.ts` - Script to fill database with test data

## Commands

```bash
bun dev          # Run with hot reload
bun start        # Run without hot reload
bun build        # Build it
bun db:push      # Update database schema
bun db:studio    # Open database GUI
bun db:seed      # Add 50 test todos
```

## Tech used

- Bun - runs everything
- ReactServe - JSX for APIs (kinda weird, kinda cool)
- Drizzle - database ORM
- SQLite - the database
- DaisyUI - makes it look nice
- No frontend framework - just vanilla JS

That's all folks.
