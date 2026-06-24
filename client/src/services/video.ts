import api from "./api";
import type { Video } from "../types";

export const videoService = {
  async importVideo(youtubeUrl: string): Promise<Video> {
    const response = await api.post<Video>("/videos/import", {
      url: youtubeUrl,
    });

    return response.data;
  },

  async getVideos(): Promise<Video[]> {
    const response = await api.get<Video[]>("/videos");

    return response.data;
  },

  async getVideoById(videoId: string): Promise<Video> {
    const response = await api.get<Video>(`/videos/${videoId}`);

    return response.data;
  },

  async searchVideo(videoId: string, query: string) {
    const response = await api.get(`/videos/${videoId}/search`, {
      params: {
        query,
      },
    });

    return response.data;
  },

  
};
