import api from "./api";
import type { Message } from "../types";

export const chatService = {
  async chatVideo(videoId: string, question: string): Promise<Message> {
    const response = await api.post<Message>(
      `/videos/${videoId}/chat`,
      {
        question,
      }
    );

    return response.data;
  },

  streamResponse(
    text: string,
    onToken: (text: string, finished: boolean) => void,
    delayMs = 15
  ) {
    let cancelled = false;

    let accumulated = "";

    const tokens = text.match(/.{1,3}/g) || [text];

    let index = 0;

    const interval = setInterval(() => {
      if (cancelled) {
        clearInterval(interval);
        return;
      }

      if (index >= tokens.length) {
        clearInterval(interval);
        onToken(accumulated, true);
        return;
      }

      accumulated += tokens[index];

      onToken(accumulated, false);

      index++;
    }, delayMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  },
};