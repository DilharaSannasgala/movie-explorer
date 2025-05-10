export function debounce<F extends (query: string) => void>(
  func: F,
  wait: number
): (query: string) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(query: string) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(query);
    }, wait);
  };
}
