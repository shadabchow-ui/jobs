export function buildPageModel<T>(data: T, meta: { title: string; description: string }) {
  return {
    data,
    meta: {
      title: meta.title,
      description: meta.description,
      canonical: null as string | null,
    },
  };
}
