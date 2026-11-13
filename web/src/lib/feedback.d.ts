export const FEEDBACK_KINDS: string[];
export const MIN_LENGTH: number;
export const MAX_LENGTH: number;
export type FeedbackPayload = {
  kind: string;
  message: string;
  email?: string;
  page: string;
  lesson_id: string;
  stage: string;
};
/** Exactly one of `payload` and `error` is set. */
export function buildFeedback(input: {
  kind: string;
  message: string;
  email?: string;
  page?: string;
  lessonId?: string;
  stage?: string;
}): { payload?: FeedbackPayload; error?: string };
