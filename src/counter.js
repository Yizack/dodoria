export class Counter {
  constructor(state) {
    this.state = state;
  }

  async fetch() {
    let value = (await this.state.storage.get("value")) || 0;
    ++value;
    await this.state.storage.put("value", value);
    return new Response(value);
  }
}
