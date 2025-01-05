import { createServer } from "node:http";
import { createServerAdapter } from "@whatwg-node/server";
import { AutoRouter } from "itty-router";
import { Kick } from "./kick";

const router = AutoRouter();

router.get("/bans/:channel", async (req) => {
  const { channel } = req.params;
  if (!channel) return Response.json({ success: false, error: "Missing channel" }, { status: 400 });
  const bans = await Kick.getBans(channel);
  return Response.json(bans);
});

router.all("*", () =>
  Response.json({ success: false, error: "Route not found" }, { status: 404 })
);

const ittyServer = createServerAdapter(router.fetch);
const httpServer = createServer(ittyServer);

export const startApiServer = () => {
  httpServer.listen(3031);
  console.info("API Server running on http://localhost:3031");
};
