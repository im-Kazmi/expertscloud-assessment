import { prisma, Prisma } from "@repo/database";
import { BaseService } from "./base-service";
import { Context } from "hono";
import { Webhook } from "svix";
import type { WebhookEvent } from "@repo/auth/server";
import { orgService, userService } from ".";

export class WebhookService extends BaseService {
  async handleClerk(c: Context) {
    const svixId = c.req.header("svix-id");
    const svixTimestamp = c.req.header("svix-timestamp");
    const svixSignature = c.req.header("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return c.json("Error occured -- no svix headers", 400);
    }

    const body = await c.req.text();

    const webhook = new Webhook("whsec_Urgi9cWNT60kwLhlUbt1ec3uktKNwPGy");

    let event: WebhookEvent | undefined;

    try {
      event = webhook.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (error) {
      return new Response("Error occured", {
        status: 400,
      });
    }

    const { id } = event.data;
    const eventType = event.type;

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
          const {
            name,
            slug,
            has_image,
            image_url,
            members_count,
            updated_at,
            created_by,
            admin_delete_enabled,
            public_metadata,
            id,
            max_allowed_memberships,
          } = event.data;

          response = await orgService.createOrganization({
            id: id,
            name,
            slug,
            membersCount: members_count ?? null,
            imgUrl: image_url ?? null,
          });
          break;
        }
        case "organization.updated": {
          const {
            name,
            slug,
            has_image,
            image_url,
            members_count,
            admin_delete_enabled,
            public_metadata,
            id,
            max_allowed_memberships,
          } = event.data;

          response = await orgService.updateOrganization(id, {
            name,
            slug,
            imgUrl: image_url ?? null,
          });
          break;
        }
        case "organizationMembership.created": {
          const { organization, permissions, role, id } = event.data;

          response = await orgService.updateOrganization(organization.id, {
            membersCount: organization.members_count,
          });
          break;
        }
        case "organizationMembership.deleted": {
          const { organization, permissions, role, id } = event.data;

          response = await orgService.updateOrganization(organization.id, {
            membersCount: organization.members_count,
          });
          break;
        }
        default: {
          break;
        }
      }

      return c.json("Everything is perfect. webhook successuly handled.", 200);
    } catch (err) {
      return c.json(" webhook not handled correctly.", 400);
    }
  }
}
