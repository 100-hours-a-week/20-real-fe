export const ErrorTags = {
  AUTH: 'auth',
  API: 'api',
  AI: 'ai',
} as const;

export type ErrorTag = (typeof ErrorTags)[keyof typeof ErrorTags];

export function convertTagsToRecord(tags: ErrorTag[]): Record<string, string> {
  return tags.reduce(
    (acc, tag) => {
      acc[tag] = 'true';
      return acc;
    },
    {} as Record<string, string>,
  );
}
