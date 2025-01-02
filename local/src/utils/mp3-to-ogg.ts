import { Readable, Writable } from "node:stream";
import type { ReadableStream } from "node:stream/web";
import ffmpeg from "fluent-ffmpeg";
import { parseBlob } from "music-metadata";

export const mp3ToOgg = async (audioStream: globalThis.ReadableStream) => {
  const readable = Readable.fromWeb(audioStream as ReadableStream);
  const chunks: Buffer[] = [];
  const writable = new Writable({
    write (chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });

  return new Promise<OggConversion>((resolve, reject) => {
    ffmpeg(readable)
      .toFormat("ogg")
      .on("error", (error) => {
        reject(error);
      })
      .on("end", async () => {
        const buffer = Buffer.concat(chunks);
        const blob = new Blob([buffer], { type: "audio/ogg" });
        const metadata = await parseBlob(blob);
        resolve({
          blob,
          metadata: {
            duration: metadata.format.duration || null
          }
        });
      }).pipe(writable, { end: true });
  });
};
