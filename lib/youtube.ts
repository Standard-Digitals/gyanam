export function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  const videoId = match ? match[1] : '';
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}
