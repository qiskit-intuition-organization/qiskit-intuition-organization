import videos from "@/data/videos.json";

const VIDEO_STEMS: Record<string, string> = videos;

// The hand-drawn explainer for a lesson, if it has one. Captions are burned into the video.
// preload="none" keeps the page light: nothing downloads until the learner presses play.
// Narrow screens get the 9:16 phone cut through the <source media> query.
export function LessonVideo({ lessonId }: { lessonId: string }) {
  const stem = VIDEO_STEMS[lessonId];
  if (!stem) return null;
  return (
    <figure className="lesson-video">
      <figcaption className="eyebrow">Watch the explainer</figcaption>
      <video controls playsInline preload="none" poster={`/videos/${stem}.jpg`}>
        <source src={`/videos/${stem}-phone.mp4`} type="video/mp4" media="(max-width: 600px)" />
        <source src={`/videos/${stem}.mp4`} type="video/mp4" />
        Your browser can&apos;t play this video.
      </video>
    </figure>
  );
}
