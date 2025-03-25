import type { CfProperties, D1Database, ExecutionContext, KVNamespace, R2Bucket, Request } from "@cloudflare/workers-types";

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
