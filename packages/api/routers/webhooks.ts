import type { WebhookEvent } from "@repo/auth/server";
import { Hono } from "hono";
import { Webhook } from "svix";

import {
  webhookHonoService,
  userHonoService,
  orgHonoService,
} from "../services";

const app = new Hono()
  .use(webhookHonoService.middleware("webhookService"))
  .use(userHonoService.middleware("userService"))
  .use(orgHonoService.middleware("orgService"))
  .post("/clerk", async (c) => {
    const svixId = c.req.header("svix-id");
    const svixTimestamp = c.req.header("svix-timestamp");
    const svixSignature = c.req.header("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return c.json("Error occurred -- missing svix headers", 400);
    }
    const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!CLERK_WEBHOOK_SECRET) {
      return c.json(
        "please set CLERK_WEBHOOK_SECRET in your env variables.",
        400,
      );
    }
    const body = await c.req.text();

    const webhook = new Webhook(CLERK_WEBHOOK_SECRET);

    let event: WebhookEvent | undefined;

    try {
      event = webhook.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (error) {
      return c.json("Cannot verify webhook", 400);
    }

    const eventType = event.type;
    const userService = c.var.userService;
    const orgService = c.var.orgService;

    try {
      let response;

      switch (eventType) {
        case "user.created": {
          const { id, email_addresses, image_url, first_name, last_name } =
            event.data;
          response = await userService.createUser({
            clerkId: id,
            email: email_addresses[0].email_address,
            avatarUrl: image_url ?? null,
            name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
          });
          break;
        }
        case "user.updated": {
          const { id, email_addresses, image_url, first_name, last_name } =
            event.data;
          response = await userService.updateUser(id, {
            email: email_addresses[0].email_address,
            avatarUrl: image_url ?? null,
            name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
          });
          break;
        }
        case "user.deleted": {
          const { id } = event.data;
          if (id) {
            response = await userService.deleteUser(id);
          }
          break;
        }
        case "organization.created": {
          const { id, name, slug, members_count, image_url } = event.data;
          response = await orgService.createOrganization({
            id,
            name,
            slug,
            membersCount: members_count ?? null,
            imgUrl: image_url ?? null,
          });
          break;
        }
        case "organization.updated": {
          const { id, name, slug, image_url } = event.data;
          response = await orgService.updateOrganization(id, {
            name,
            slug,
            imgUrl: image_url ?? null,
          });
          break;
        }
        case "organizationMembership.created":
        case "organizationMembership.deleted": {
          const { organization } = event.data;
          response = await orgService.updateOrganization(organization.id, {
            membersCount: organization.members_count,
          });
          break;
        }
        default: {
          return c.json(`Unhandled event type: ${eventType}`, 400);
        }
      }

      if (!response) {
        return c.json("No response from service", 500);
      }

      return c.json("Webhook successfully handled", 200);
    } catch (err) {
      console.error(err);
      return c.json("Webhook not handled correctly.", 500);
    }
  });

export default app;
