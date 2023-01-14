export default class Chat {
  constructor(client, characterId, continueBody) {
    this.characterId = characterId;
    this.externalId = continueBody.external_id;

    this.client = client;

    const ai = continueBody.participants.find(
      (participant) => participant.is_human === false,
    );
    this.aiId = ai.user.username;
  }

  async fetchHistory() {
    const body = await fetch(
      `https://beta.character.ai/chat/history/msgs/user/?history_external_id=${this.externalId}`,
      { method: "GET", headers: this.client.getHeaders() },
    );

    return await body.json();
  }

  async sendAndAwaitResponse({mensaje, singleReply}) {
    const payload = {
      history_external_id: this.externalId,
      character_external_id: this.characterId,
      text: mensaje,
      tgt: this.aiId,
      ranking_method: "random",
      faux_chat: false,
      staging: false,
      model_server_address: null,
      override_prefix: null,
      override_rank: null,
      rank_candidates: null,
      filter_candidates: null,
      prefix_limit: null,
      prefix_token_limit: null,
      livetune_coeff: null,
      stream_params: null,
      enable_tti: true,
      initial_timeout: null,
      insert_beginning: null,
      translate_candidates: null,
      stream_every_n_steps: 16,
      chunks_to_pad: 8,
      is_proactive: false,
    };

    console.log(mensaje);

    const body = await fetch("https://beta.character.ai/chat/streaming/",
      {
        method: "POST",
        headers: this.client.getHeaders(),
        body: JSON.stringify(payload)
      }
    );

    const replies = [];
    const response = await body.text();

    for (const line of response.split("\n")) {
      if (line.startsWith("{")) {
        replies.push(JSON.parse(line));
        continue;
      }

      const start = line.indexOf(" {");
      if (start < 0) continue;
      replies.push(JSON.parse(line.slice(start - 1)));
    }

    if (!singleReply) return replies;
    // Returns what's seen in the chat window of the CharacterAI website
    else {
      try {
        return replies.pop().replies.shift().text;
      } catch (e) {
        return "Error: sin respuesta de CharacterAI";
      }
    }
  }
}
