import { Readable, Writable } from "node:stream";
import type { ReadableStream } from "node:stream/web";
import ffmpeg from "fluent-ffmpeg";

export const mp3ToOgg = async (audioStream: globalThis.ReadableStream) => {
  const readable = Readable.fromWeb(audioStream as ReadableStream);
  const chunks: Buffer[] = [];
  let codecData: {
    format: string;
    audio: string;
    audio_details: string[];
    video: string;
    video_details: string[];
    duration: string;
  } | null = null;
  const writable = new Writable({
    write (chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });

  return new Promise<OggConversion>((resolve, reject) => {
    ffmpeg(readable)
      .inputOptions(["-analyzeduration", "2147483647", "-probesize", "2147483647"])
      .toFormat("ogg")
      .on("codecData", (data) => {
        codecData = data;
      })
      .on("error", (error) => {
        reject(error);
      })
      .on("end", () => {
        const buffer = Buffer.concat(chunks);
        const blob = new Blob([buffer], { type: "audio/ogg" });
        resolve({
          blob,
          codecData
        });
      }).pipe(writable, { end: true });
  });
};
