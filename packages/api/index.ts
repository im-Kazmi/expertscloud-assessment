import { Hono } from "hono";

// routers
import task from "./routers/task";
import webhooks from "./routers/webhooks";
import project from "./routers/project";
import { prettyJSON } from "hono/pretty-json";

const app = new Hono().basePath("/api").use(prettyJSON());

const routes = app
  .route("/task", task)
  .route("/project", project)
  .route("/webhooks", webhooks);

export type AppType = typeof routes;

export { app };
export * from "hono/client";
