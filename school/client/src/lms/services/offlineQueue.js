// Offline queue for progress updates
// Stores pending mutations in localStorage and flushes when online

const QUEUE_KEY = 'pc_offline_queue';

const getQueue = () => {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveQueue = (queue) => {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {}
};

export const enqueueProgressUpdate = (lessonId, payload) => {
  const queue = getQueue();
  // Replace existing entry for same lesson if present
  const filtered = queue.filter(item => item.lessonId !== lessonId);
  filtered.push({ lessonId, payload, queuedAt: Date.now() });
  saveQueue(filtered);
};

export const flushProgressQueue = async (updateFn) => {
  const queue = getQueue();
  if (queue.length === 0) return;

  const failed = [];
  for (const item of queue) {
    try {
      await updateFn(item.lessonId, item.payload);
    } catch {
      failed.push(item);
    }
  }
  saveQueue(failed);
};

export const getQueueLength = () => getQueue().length;

// Auto-flush when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    // Dispatch a custom event so components can react
    window.dispatchEvent(new CustomEvent('pc:online'));
  });
}
