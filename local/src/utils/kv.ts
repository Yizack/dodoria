import { $fetch } from "ofetch";
import { useLocalConfig } from "./config";
import type { KVNamespacePutOptions } from "@cloudflare/workers-types";

const { cloudflareAccount, cloudflareAuthorization, cloudflareKVId } = useLocalConfig();

export const getKV = async <T>(key: string) => {
  return $fetch<{ value: T }>(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccount}/storage/kv/namespaces/${cloudflareKVId}/values/${key}`, {
    responseType: "json",
    headers: {
      "Authorization": `Bearer ${cloudflareAuthorization}`,
      "Content-Type": "application/json"
    }
  });
};

export const putKV = async (key: string, value: unknown, options?: KVNamespacePutOptions) => {
  return $fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccount}/storage/kv/namespaces/${cloudflareKVId}/values/${key}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${cloudflareAuthorization}`,
      "Content-Type": "application/json"
    },
    query: {
      expiration_ttl: options?.expirationTtl,
      expiration: options?.expiration
    },
    body: {
      value,
      metadata: options?.metadata
    }
  });
};
