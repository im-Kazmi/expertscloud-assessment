import { Hono } from "hono";

// routers
import task from "./routers/task";
import webhooks from "./routers/webhooks";
import { prettyJSON } from "hono/pretty-json";

const app = new Hono().basePath("/api").use(prettyJSON());

const routes = app.route("task", task).route("webhook", webhooks);

export type AppType = typeof routes;

export { app };
export * from "hono/client";
