import type { CfProperties, Request, ExecutionContext, R2Bucket, D1Database, KVNamespace } from "@cloudflare/workers-types";

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      request: Request;
      env: {
        DB: D1Database;
        BLOB: R2Bucket;
        CDN: R2Bucket;
        EDUCAR: KVNamespace;
      };
      context: ExecutionContext;
    };
  }
}
