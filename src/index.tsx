import { App, Route, Response, useRoute, serve, RouteGroup, Middleware } from "react-serve-js";
import { db } from "./db";
import { desc, eq, count } from "drizzle-orm";
import { InsertTodo, todos } from "./db/schema";
import fs from "fs";
import path from "path";
const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

function Backend() {
  return (
    <App port={6969} parseBody={true} >
      <Route path="/" method="GET">
        {async () => {
          // Render html file in public folder
          const { res } = useRoute();
          // <Response html={html} /> is not working for some reason so we have to manually send using the express hooks.
          // Not sure why its not working but i dont really care too much about it since they provide the express hooks for us.
          const html = fs.readFileSync(path.join(process.cwd(), "src", "public", "index.html"), "utf8");
          res.setHeader("Content-Type", "text/html");
          res.send(html);
        }}
      </Route>
      <RouteGroup prefix="/todos">
        <Route path="/" method="GET">
          {async () => {
            const { query } = useRoute();
            // Parse query params (they come as strings)
            const page = parseInt(query.page as string) || 1;
            const limit = parseInt(query.limit as string) || 10;

            // Get total count for pagination metadata
            const [{ totalCount }] = await db.select({ totalCount: count() }).from(todos);
            
            // Get paginated todos
            const todosResult = await db.query.todos.findMany({
              offset: (page - 1) * limit,
              limit: limit,
              orderBy: [desc(todos.createdAt)],
            });

            // Return with pagination metadata
            return <Response json={{
              data: todosResult,
              pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasNext: page < Math.ceil(totalCount / limit),
                hasPrev: page > 1,
              }
            }} />;
          }}
        </Route>
        <Route path="/:id" method="GET">
          {async () => {
            // Use the route hooks to get the params
            const { params } = useRoute();
            const todo = await db.query.todos.findFirst({ where: eq(todos.id, params.id) });
            if (!todo) {
              return <Response status={404} json={{ error: "Todo not found" }} />;
            }

            return <Response json={todo} />;
          }}
        </Route>
        <Route path="/" method="POST">
          {async () => {
            // Use the route hooks to get the body
            const { body } = useRoute();
            if (!body.title || !body.description) {
              return <Response status={400} json={{ error: "Title and description are required" }} />;
            }
            const todo = await db.insert(todos).values({
              title: body.title,
              description: body.description,
            });
            return <Response json={todo} />;
          }}
        </Route>  
        <Route path="/:id" method="PUT">
          {async () => {
            const { params } = useRoute();
            const { body } = useRoute();
            
            // Allow partial updates to only update fields that are provided
            const updateData: Partial<InsertTodo> = {
              title: body.title,
              description: body.description,
              completed: body.completed
            };
            


            const todo = await db.update(todos).set(updateData).where(eq(todos.id, params.id)).returning();
            if (!todo || todo.length === 0) {
              return <Response status={404} json={{ error: "Todo not found" }} />;
            }
            return <Response json={todo[0]} />;
          }}
        </Route>
        <Route path="/:id" method="DELETE">
          {async () => {
            const { params } = useRoute();
            const todo = await db.delete(todos).where(eq(todos.id, params.id));
            if (!todo) {
              return <Response status={404} json={{ error: "Todo not found" }} />;
            }
            return <Response json={{ message: "Todo deleted successfully" }} />;
          }}
        </Route>
      </RouteGroup>
      
    </App>
  );
}

serve(<Backend />);
