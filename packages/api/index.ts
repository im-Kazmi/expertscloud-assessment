import { Hono } from "hono";

// routers
// import product from "./routers/product";
import { prettyJSON } from "hono/pretty-json";

const app = new Hono().basePath("/api").use(prettyJSON());

// make sure use route not get
const routes = app.get("/products", async (c) => {
  return c.json("just test");
});

export type AppType = typeof routes;

export { app };
export * from "hono/client";
