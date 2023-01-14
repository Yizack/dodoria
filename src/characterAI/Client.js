import Chat from "./Chat.js";

export default class CharacterAI {
  async fetchCategories() {
    const body = await fetch(
      "https://beta.character.ai/chat/character/categories/",
      { method: "GET" }
    );

    const categories = await body.json();

    if (!Array.isArray(categories))
      throw new Error("Received invalid data from API");

    return categories;
  }

  async fetchUserConfig() {
    const body = await fetch(
      "https://beta.character.ai/chat/config/",
      { method: "GET", headers: this.getHeaders() }
    );

    const response = await body.json();

    return response.config;
  }

  async fetchUser() {
    const body = await fetch(
      "https://beta.character.ai/chat/user/",
      { method: "GET", headers: this.getHeaders() }
    );

    const response = await body.json();

    return response.user;
  }

  async fetchFeatured() {
    const body = await fetch(
      "https://beta.character.ai/chat/characters/featured/",
      { method: "GET", headers: this.getHeaders() }
    );

    const response = await body.json();

    return response.featured_characters;
  }

  async fetchCharactersByCategories(
    curated = false
  ) {
    const url = `https://beta.character.ai/chat/${
      curated ? "curated_categories" : "categories"
    }/characters/`;

    const body = await fetch(url,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    const property = curated
      ? "characters_by_curated_category"
      : "characters_by_category";

    let response = await body.json();

    return response[property];
  }

  async fetchCharaterInfo(characterId) {
    const body = await fetch(
      "https://beta.character.ai/chat/character/info/",
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ external_id: characterId })
      }
    );

    let response = await body.json();

    return response.character;
  }

  async continueOrCreateChat(characterId) {
    let body = await fetch("https://beta.character.ai/chat/history/continue/",
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          character_external_id: characterId,
          history_external_id: null,
        })
      }
    );

    let input = await body.json();

    if (input.status === "No Such History") {
      const body = await fetch(
        "https://beta.character.ai/chat/history/create/",
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({
            character_external_id: characterId,
            history_external_id: null,
          })
        }
      );

      input = await body.json();
    }

    return new Chat(this, characterId, input);
  }

  getHeaders(headers, contentType = "application/json") {
    return {
      ...headers,
      "Content-Type": contentType,
      Authorization: "Token 92018679c9136fea48d5fdb9c96324de17471bf2",
    };
  }

}
