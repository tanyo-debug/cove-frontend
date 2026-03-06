/**
 * Mock API layer simulating async backend calls.
 * Returns realistic data with artificial delays to mimic network latency.
 */
import type { ImageItem, FaceCluster, IndexingStatus } from '@/store/useAppStore';

// Generate realistic mock images using picsum
const generateMockImages = (count: number): ImageItem[] => {
  const tags = ['nature', 'portrait', 'city', 'beach', 'mountain', 'sunset', 'food', 'travel', 'architecture', 'animal'];
  const dates = ['2024-01-15', '2024-02-20', '2024-03-10', '2024-04-05', '2024-05-18', '2024-06-22', '2024-07-30', '2024-08-14', '2024-09-03', '2024-10-25', '2024-11-11', '2024-12-01'];

  return Array.from({ length: count }, (_, i) => {
    const seed = i + 1;
    const w = 300 + (i % 5) * 50;
    const h = 200 + (i % 4) * 50;
    return {
      id: `img-${seed}`,
      src: `https://picsum.photos/seed/${seed}/${w * 3}/${h * 3}`,
      thumbnail: `https://picsum.photos/seed/${seed}/${w}/${h}`,
      width: w,
      height: h,
      date: dates[i % dates.length],
      tags: [tags[i % tags.length], tags[(i + 3) % tags.length]],
    };
  });
};

const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack', 'Karen', 'Leo'];

const generateMockClusters = (count: number): FaceCluster[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `cluster-${i + 1}`,
    name: firstNames[i % firstNames.length],
    previewUrl: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    imageCount: Math.floor(Math.random() * 500) + 10,
    confidence: Math.round((0.7 + Math.random() * 0.3) * 100) / 100,
    faces: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, j) => `img-${i * 20 + j + 1}`),
  }));
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Fetch paginated images from the local index */
export async function fetchImages(page = 0, pageSize = 200): Promise<ImageItem[]> {
  await delay(300 + Math.random() * 200);
  const all = generateMockImages(1000);
  return all.slice(page * pageSize, (page + 1) * pageSize);
}

/** Fetch face clusters */
export async function fetchClusters(): Promise<FaceCluster[]> {
  await delay(400);
  return generateMockClusters(12);
}

/** Perform semantic search using CLIP embeddings */
export async function searchImages(query: string): Promise<ImageItem[]> {
  await delay(600 + Math.random() * 400);
  const all = generateMockImages(1000);
  // Simulate relevance filtering
  const count = Math.floor(Math.random() * 40) + 10;
  return all.sort(() => Math.random() - 0.5).slice(0, count);
}

/** Get current indexing status */
export async function getIndexingStatus(): Promise<IndexingStatus> {
  await delay(100);
  return {
    isIndexing: true,
    stage: 'embedding',
    progress: 67,
    processed: 67432,
    total: 100000,
  };
}
