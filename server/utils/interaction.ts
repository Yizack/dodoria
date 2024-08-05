/**
 * Discord interactions manager
 */
import { InteractionResponseType, InteractionType } from "discord-interactions";

const API = {
  BASE: "https://discord.com/api/v10"
};

class JsonResponse extends Response {
  constructor (body, init) {
    const jsonBody = JSON.stringify(body);
    const options = init || {
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    };
    super(jsonBody, options);
  }
}

class JsonRequest extends Request {
  constructor (url, body, init, authorization) {
    console.info(body);
    const options = {
      ...init,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": authorization
      }
    };
    body ? options.body = JSON.stringify(body) : null;
    super(url, options);
  }
}

class JsonFileRequest extends Request {
  constructor (url, body, init) {
    const formData = new FormData();
    const { files } = body;
    console.info(body);
    if (files) {
      files.forEach((file, i) => {
        formData.append(`files[${i}]`, file.file, file.name);
      });
    }
    delete body.files;
    formData.append("payload_json", JSON.stringify(body));
    const options = {
      ...init,
      body: formData
    };
    super(url, options);
  }
}

const toDiscord = (body) => {
  return new JsonResponse(body);
};

const toDiscordEndpoint = (endpoint, body, method, authorization) => {
  const endpointURL = `${API.BASE}${endpoint}`;
  if (!body.files) {
    return fetch(new JsonRequest(endpointURL, body, { method }, authorization));
  }
  else {
    return fetch(new JsonFileRequest(endpointURL, body, { method }, authorization));
  }
};

const pong = () => {
  return toDiscord({
    type: InteractionResponseType.PONG
  });
};

export const create = (type: number, func?: () => void) => {
  switch (type) {
    case InteractionType.PING:
      return pong();
    case InteractionType.APPLICATION_COMMAND:
      if (func) return func();
  }
};

export const reply = (content: any, options?: any) => {
  return toDiscord({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: content,
      embeds: options?.embeds,
      components: options?.components
    }
  });
};

export const deferReply = (options?: any) => {
  return toDiscord({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: options?.flags
    }
  });
};

export const deferUpdate = (content, options) => {
  const followupEndpoint = `/webhooks/${options.application_id}/${options.token}`;
  return toDiscordEndpoint(followupEndpoint, {
    type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
    content: content,
    embeds: options?.embeds,
    components: options?.components,
    files: options?.files
  }, "POST");
};

export const error = (message, code) => {
  return toDiscord({ error: message }, { status: code });
};

export const getGuild = async (id, token) => {
  const response = await fetch(`${API.BASE}/guilds/${id}`, {
    headers: {
      Authorization: `Bot ${token}`
    }
  });
  const data = await response.json();
  return data;
};