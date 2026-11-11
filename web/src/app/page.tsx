"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AccountMenu } from "@/components/auth-provider";
import CircuitLab from "@/components/circuit-lab";
import { hasLessonVideo, LessonVideo } from "@/components/lesson-video";
import IntuitionWidget from "@/components/intuition-widget";
import MathBlock from "@/components/math";
import { course, parseContent } from "@/lib/course";
import type { Lesson } from "@/lib/course";
import { notebookMarkdown, sanitizeNotebook } from "@/lib/notebook";
import type { Notebook } from "@/lib/notebook";
import {
  useNotebook,
  NotebookSyncNotice,
} from "@/components/notebook-provider";
import { api } from "@/services/api";

const STAGES = [
  "Intuition",
  "Predict",
  "Experiment",
  "Formalize",
  "Code it",
  "Reflect",
];
function download(name: string, text: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}
function Paragraphs({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <p key={i}>
          {line
            .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
            .map((part, j) =>
              part.startsWith("**") ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : part.startsWith("`") ? (
                <code key={j}>{part.slice(1, -1)}</code>
              ) : (
                part
              ),
            )}
        </p>
      ))}
    </>
  );
}
type Feedback = {
  message?: string;
  stdout?: string;
  stderr?: string;
  error?: string;
  markdown?: string;
  passed?: boolean;
  success?: boolean;
  figures?: string[];
  /** Where to show the result: next to the worked example, or below the exercise. */
  source?: "example";
};

/** Output of a run, shown where it was requested and scrolled into view. */
function FeedbackPanel({ feedback, busy }: { feedback: Feedback; busy: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  const text = [feedback.error, feedback.message, feedback.markdown].filter(
    Boolean,
  ) as string[];
  const hasOutput = Boolean(
    text.length || feedback.stdout || feedback.stderr || feedback.figures?.length,
  );
  useEffect(() => {
    if (busy || hasOutput)
      panel.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [busy, hasOutput]);
  if (!busy && !hasOutput) return null;
  return (
    <div ref={panel} aria-live="polite">
      {busy && <p role="status">Running…</p>}
      {(text.length > 0 || feedback.stdout || feedback.stderr) && (
        <div className="explanation-card">
          <Paragraphs lines={text} />
          {feedback.stdout && <pre>{feedback.stdout}</pre>}
          {feedback.stderr && <pre>{feedback.stderr}</pre>}
        </div>
      )}
      {feedback.figures?.map((figure, i) => (
        <img
          key={i}
          src={`data:image/png;base64,${figure}`}
          alt={`Qiskit output figure ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [lessons, setLessons] = useState<Lesson[]>(course.lessons);
  const [brand, setBrand] = useState(course.brand);
  const { notebook, setNotebook, ready, owner, status } = useNotebook();
  const activeOwner = useRef(owner);
  activeOwner.current = owner;
  const [view, setView] = useState(() =>
    notebook.completed_lessons.length || notebook.learning_stage ? "course" : "map",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [choice, setChoice] = useState<number | undefined>(undefined);
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [feedback, setFeedback] = useState<Feedback>({});
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState("");
  const index = Math.min(notebook.selected_lesson, lessons.length - 1);
  const lesson = lessons[index];
  const stage = notebook.learning_stage;
  const answer = notebook.quiz_answers[lesson.id];
  const code = notebook.code_attempts[lesson.id] ?? lesson.code_task.starter;

  useEffect(() => {
    setFeedback({});
    setNotice("");
    setBusy(false);
  }, [owner]);
  useEffect(() => setChoice(undefined), [lesson.id]);
  const go = (next: string) => {
    setView(next);
    setMenuOpen(false);
  };
  const done = new Set(notebook.completed_lessons);
  const completedCount = lessons.filter((l) => done.has(l.id)).length;
  const nextIndex = Math.max(
    0,
    lessons.findIndex((l) => !done.has(l.id)),
  );
  const syncLine =
    status === "saved"
      ? "Saved to your account"
      : status === "saving" || status === "pending"
        ? "Saving…"
        : "Saved in this browser";

  const patch = (update: Partial<Notebook>) =>
    setNotebook((current) => ({ ...current, ...update }));
  const text = (
    field: "notes" | "reflections" | "code_attempts",
    value: string,
  ) =>
    setNotebook((current) => ({
      ...current,
      [field]: { ...current[field], [lesson.id]: value },
    }));
  const move = (next: number) => {
    patch({
      learning_stage: next,
      lesson_max_stage: {
        ...notebook.lesson_max_stage,
        [lesson.id]: Math.max(next, notebook.lesson_max_stage[lesson.id] || 0),
      },
    });
    setFeedback({});
  };
  const open = (next: number) => {
    patch({ selected_lesson: next, learning_stage: 0 });
    setFeedback({});
    go("course");
  };
  const request = async (
    operation: string,
    body: unknown,
    source?: Feedback["source"],
  ) => {
    setBusy(true);
    setFeedback({ source });
    try {
      const data = await api<Feedback>(operation, body);
      if (activeOwner.current !== owner) return;
      const silent =
        operation === "execute" &&
        data.success &&
        !data.stdout?.trim() &&
        !data.stderr?.trim() &&
        !data.figures?.length;
      setFeedback({
        ...data,
        ...(silent && {
          message:
            "Ran without errors, but nothing was printed. Add `print(qc.draw())` to see your circuit.",
        }),
        source,
      });
      if (data.passed)
        setNotebook((current) => ({
          ...current,
          tasks_passed: Array.from(
            new Set([...current.tasks_passed, lesson.id]),
          ),
        }));
    } catch (error) {
      if (activeOwner.current !== owner) return;
      setFeedback({
        error: error instanceof Error ? error.message : "Request failed",
        source,
      });
    } finally {
      if (activeOwner.current === owner) setBusy(false);
    }
  };
  // A lesson with a video leads with it; the written goals, analogy and intuition (which the
  // video already covers) fold into a "Prefer to read?" section under the Try-it widget.
  const hasVideo = hasLessonVideo(lesson.id);
  const goalsCard = (
    <aside className="goals-card" aria-label="Lesson goals">
      <strong>By the end of this lesson you can</strong>
      <ul>
        {lesson.objectives.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
  const intuitionText = (
    <>
      {lesson.analogy && (
        <aside className="analogy-card" aria-label="Everyday analogy">
          <p className="eyebrow">Picture it like this</p>
          <h3>{lesson.analogy.title}</h3>
          <p>{lesson.analogy.picture}</p>
          <p>
            <strong>What it gets right: </strong>
            {lesson.analogy.captures}
          </p>
          <details>
            <summary>Where does this analogy break? Think first, then open.</summary>
            <p>{lesson.analogy.breaks}</p>
          </details>
        </aside>
      )}
      <Paragraphs lines={lesson.intuition} />
    </>
  );
  const feedbackLink = `https://github.com/MeylinLeonario/qiskit-intuition-organization/issues/new?${new URLSearchParams({ title: `[Feedback] ${lesson.title}`, body: `Page: ${view}\nLesson: ${lesson.title}\nStage: ${STAGES[stage]}\n\nWhat happened?\n` })}`;

  if (!ready)
    return <main className="course-loading">Opening your notebook…</main>;
  return (
    <div
      className={`site-shell ${notebook.reading_mode === "plain" ? "plain-reading" : ""}`}
    >
      <header className="mobile-bar">
        <strong>
          {view === "course"
            ? `Lesson ${index + 1} of ${lessons.length}`
            : { map: "Course map", notebook: "My notebook", glossary: "Glossary", author: "Content Studio" }[view]}
        </strong>
        <button
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>
      <aside id="site-menu" className={`site-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="site-brand">
          <strong>{brand.name}</strong>
          <small>{brand.tagline}</small>
        </div>
        <AccountMenu />
        <nav aria-label="Primary navigation">
          {[
            ["map", "Course map"],
            ["course", "Current lesson"],
            ["notebook", "My notebook"],
            ["glossary", "Glossary"],
            ["author", "Content Studio"],
          ].map(([id, title]) => (
            <button
              key={id}
              aria-current={view === id ? "page" : undefined}
              className={view === id ? "active" : ""}
              onClick={() => go(id)}
            >
              {title}
            </button>
          ))}
          <Link href="/playground">Playground & code coach</Link>
        </nav>
        <label className="sidebar-lesson">
          Current lesson
          <select value={index} onChange={(e) => open(Number(e.target.value))}>
            {lessons.map((item, i) => (
              <option key={item.id} value={i}>
                {i + 1}. {item.title}
              </option>
            ))}
          </select>
        </label>
        <div className="sidebar-progress">
          <span>Course progress</span>
          <progress
            value={
              notebook.completed_lessons.filter((id) =>
                lessons.some((l) => l.id === id),
              ).length
            }
            max={lessons.length}
          />
          <small>
            {
              notebook.completed_lessons.filter((id) =>
                lessons.some((l) => l.id === id),
              ).length
            }{" "}
            of {lessons.length} lessons completed
          </small>
          <small className="sync-line">{syncLine}</small>
        </div>
        <label>
          <input
            type="checkbox"
            checked={notebook.reading_mode === "plain"}
            onChange={(e) =>
              patch({ reading_mode: e.target.checked ? "plain" : "notebook" })
            }
          />{" "}
          Easy reading
        </label>
        <a href={feedbackLink} target="_blank" rel="noreferrer">
          Report feedback
        </a>
      </aside>
      <main className="course-main">
        {!["guest", "saved", "saving", "pending"].includes(status) && (
          <NotebookSyncNotice />
        )}
        {notice && (
          <p role="status" className="explanation-card">
            {notice}
          </p>
        )}
        {view === "course" && (
          <>
            <header>
              <p className="eyebrow">
                Lesson {index + 1} · {lesson.duration}
              </p>
              <h1>{lesson.title}</h1>
              <p>{lesson.summary}</p>
              {stage === 0 && !hasVideo && goalsCard}
            </header>
            <nav className="course-stages" aria-label="Lesson stages">
              {STAGES.map((name, i) => (
                <button
                  key={name}
                  aria-current={stage === i ? "step" : undefined}
                  className={stage === i ? "primary" : ""}
                  onClick={() => move(i)}
                >
                  {i + 1}. {name}
                </button>
              ))}
            </nav>
            <article className="panel course-lesson">
              <h2>{STAGES[stage]}</h2>
              {stage === 0 && (
                <>
                  <LessonVideo lessonId={lesson.id} />
                  {!hasVideo && intuitionText}
                  <p className="widget-caption">
                    <strong>Try it: </strong>
                    {lesson.widget.caption}
                  </p>
                  <IntuitionWidget
                    key={`${lesson.id}-intuition`}
                    widget={lesson.widget}
                    preset={lesson.preset}
                  />
                  {hasVideo && (
                    <details className="read-instead">
                      <summary>Prefer to read? The same ideas in text</summary>
                      {goalsCard}
                      {intuitionText}
                    </details>
                  )}
                </>
              )}
              {stage === 1 &&
                (lesson.quiz ? (
                  <>
                    <h3>{lesson.quiz.question}</h3>
                    <fieldset className="course-quiz" disabled={answer !== undefined}>
                      <legend>
                        {answer === undefined
                          ? "Pick the answer you believe, then lock it in"
                          : "Your locked-in prediction"}
                      </legend>
                      {lesson.quiz.options.map((option, i) => {
                        const locked = answer !== undefined;
                        const verdict = !locked
                          ? ""
                          : i === lesson.quiz!.answer
                            ? "right"
                            : i === answer
                              ? "wrong"
                              : "";
                        return (
                          <label key={i} className={`quiz-option ${verdict}`}>
                            <input
                              type="radio"
                              name={`prediction-${lesson.id}`}
                              checked={(locked ? answer : choice) === i}
                              onChange={() => setChoice(i)}
                            />
                            <span>
                              {option}
                              {locked && (i === answer || i === lesson.quiz!.answer) && (
                                <small>{lesson.quiz!.explanations[i]}</small>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </fieldset>
                    {answer === undefined ? (
                      <div className="course-controls">
                        <button
                          className="primary"
                          disabled={choice === undefined}
                          onClick={() =>
                            patch({
                              quiz_answers: {
                                ...notebook.quiz_answers,
                                [lesson.id]: choice!,
                              },
                            })
                          }
                        >
                          Lock in my prediction
                        </button>
                      </div>
                    ) : (
                      <div role="status" className="explanation-card">
                        <p>
                          {answer === lesson.quiz.answer
                            ? "You predicted correctly. Now test it in the experiment."
                            : "Not quite, and that's useful. Keep your guess in mind and see what the experiment shows."}
                        </p>
                        <button
                          onClick={() => {
                            const rest = { ...notebook.quiz_answers };
                            delete rest[lesson.id];
                            patch({ quiz_answers: rest });
                          }}
                        >
                          Try a different prediction
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p>{lesson.checkpoint}</p>
                ))}
              {stage === 2 && (
                <>
                  <Paragraphs lines={lesson.try_this} />
                  <CircuitLab
                    key={`${lesson.id}-experiment`}
                    preset={lesson.preset}
                  />
                </>
              )}
              {stage === 3 && (
                <>
                  <Paragraphs lines={lesson.explanation} />
                  <MathBlock latex={lesson.latex} fallback={lesson.equation} />
                  <p className="explanation-card">
                    <strong>Common mistake: </strong>
                    {lesson.misconception}
                  </p>
                </>
              )}
              {stage === 4 && (
                <>
                  <p>{lesson.qiskit.intro}</p>
                  <pre>{lesson.qiskit.code}</pre>
                  <button
                    disabled={busy}
                    onClick={() =>
                      request("execute", { code: lesson.qiskit.code }, "example")
                    }
                  >
                    Run worked example
                  </button>
                  {feedback.source === "example" && (
                    <FeedbackPanel feedback={feedback} busy={busy} />
                  )}
                  <dl>
                    {lesson.qiskit.notes.map(([term, note], i) => (
                      <div key={i}>
                        <dt>
                          <code>{term}</code>
                        </dt>
                        <dd>{note}</dd>
                      </div>
                    ))}
                  </dl>
                  <h3>Your exercise</h3>
                  <p>{lesson.code_task.prompt}</p>
                  <textarea
                    className="code-editor"
                    aria-label="Exercise code"
                    value={code}
                    maxLength={20000}
                    spellCheck={false}
                    onChange={(e) => text("code_attempts", e.target.value)}
                  />
                  <div className="course-controls">
                    <button
                      className="primary"
                      disabled={busy}
                      onClick={() =>
                        request("course/exercise", {
                          lesson_id: lesson.id,
                          code,
                        })
                      }
                    >
                      Check exercise
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => request("execute", { code })}
                    >
                      Run code
                    </button>
                    <button
                      onClick={() =>
                        text("code_attempts", lesson.code_task.starter)
                      }
                    >
                      Reset starter
                    </button>
                  </div>
                  <details>
                    <summary>Hint</summary>
                    <p>{lesson.code_task.hint}</p>
                  </details>
                  {notebook.tasks_passed.includes(lesson.id) && (
                    <p>Exercise passed.</p>
                  )}
                </>
              )}
              {stage === 5 && (
                <>
                  {lesson.takeaway && (
                    <p className="takeaway">
                      <strong>Remember it as: </strong>
                      {lesson.takeaway}
                    </p>
                  )}
                  <h3>{lesson.checkpoint}</h3>
                  <textarea
                    aria-label="Your reflection"
                    rows={7}
                    maxLength={20000}
                    value={notebook.reflections[lesson.id] || ""}
                    onChange={(e) => text("reflections", e.target.value)}
                  />
                  <div className="course-controls">
                    <button
                      disabled={
                        busy || !notebook.reflections[lesson.id]?.trim()
                      }
                      onClick={() =>
                        request("course/reflect", {
                          lesson_id: lesson.id,
                          text: notebook.reflections[lesson.id],
                        })
                      }
                    >
                      Check my reasoning
                    </button>
                    <button
                      className="primary"
                      disabled={!notebook.reflections[lesson.id]?.trim()}
                      onClick={() => {
                        patch({
                          completed_lessons: Array.from(
                            new Set([...notebook.completed_lessons, lesson.id]),
                          ),
                        });
                        setNotice(
                          "Lesson completed and saved in your notebook.",
                        );
                      }}
                    >
                      Complete lesson
                    </button>
                  </div>
                </>
              )}
              {feedback.source !== "example" && (
                <FeedbackPanel feedback={feedback} busy={busy} />
              )}
            </article>
            <label className="panel course-notes">
              Margin notes
              <textarea
                rows={3}
                maxLength={20000}
                value={notebook.notes[lesson.id] || ""}
                onChange={(e) => text("notes", e.target.value)}
              />
            </label>
            <div className="course-controls">
              <button disabled={stage === 0} onClick={() => move(stage - 1)}>
                Previous step
              </button>
              {stage < 5 ? (
                <button className="primary" onClick={() => move(stage + 1)}>
                  Next: {STAGES[stage + 1]}
                </button>
              ) : (
                <button
                  disabled={index === lessons.length - 1}
                  onClick={() => open(index + 1)}
                >
                  Next lesson
                </button>
              )}
            </div>
          </>
        )}
        {view === "map" && (
          <>
            <p className="eyebrow">
              {completedCount} of {lessons.length} lessons completed
            </p>
            <h1>Course map</h1>
            <p>
              Every lesson follows the same loop: picture it, predict, test it,
              then the math and the Qiskit code. Work in order, or jump to
              anything that interests you.
            </p>
            <div className="course-controls">
              <button className="primary" onClick={() => open(nextIndex)}>
                {completedCount ? "Continue" : "Start"} with lesson{" "}
                {nextIndex + 1}: {lessons[nextIndex].title}
              </button>
            </div>
            {course.units.map((unit) => {
              const unitLessons = lessons
                .map((item, i) => ({ item, i }))
                .filter(({ item }) => item.unit === unit.id);
              if (!unitLessons.length) return null;
              const unitDone = unitLessons.filter(({ item }) =>
                done.has(item.id),
              ).length;
              return (
                <section className="panel unit-card" key={unit.id}>
                  <h2>{unit.title}</h2>
                  <p>
                    {unit.blurb}{" "}
                    <small>
                      {unitDone} of {unitLessons.length} done
                    </small>
                  </p>
                  <ol className="unit-lessons">
                    {unitLessons.map(({ item, i }) => {
                      const started =
                        !done.has(item.id) &&
                        (notebook.lesson_max_stage[item.id] || 0) > 0;
                      return (
                        <li key={item.id}>
                          <button
                            className={done.has(item.id) ? "done" : started ? "started" : ""}
                            onClick={() => open(i)}
                          >
                            <span className="lesson-number">{i + 1}</span>
                            <span className="lesson-name">
                              {item.title}
                              <small>
                                {item.duration}
                                {done.has(item.id)
                                  ? " · done ✓"
                                  : started
                                    ? " · in progress"
                                    : ""}
                              </small>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              );
            })}
          </>
        )}
        {view === "notebook" && (
          <>
            <h1>My notebook</h1>
            <p>
              {owner
                ? "Saved to your account and synced across devices."
                : "Saved in this browser. Sign in to sync across devices."}{" "}
              Download a backup, or restore one you saved earlier.
            </p>
            <div className="course-controls">
              <button
                onClick={() =>
                  download(
                    "quantum-notebook.json",
                    JSON.stringify(notebook, null, 2),
                  )
                }
              >
                Download JSON
              </button>
              <button
                onClick={() =>
                  download(
                    "quantum-notebook.md",
                    notebookMarkdown(notebook),
                    "text/markdown",
                  )
                }
              >
                Download Markdown
              </button>
              <label>
                Restore notebook
                <input
                  type="file"
                  accept=".json"
                  onChange={async (e) => {
                    try {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2000000)
                        throw new Error("Notebook must be smaller than 2 MB.");
                      const data = JSON.parse(await file.text());
                      if (data.version !== 1)
                        throw new Error("Unsupported notebook version.");
                      setNotebook(sanitizeNotebook(data));
                      setNotice("Notebook restored.");
                    } catch (error) {
                      setNotice(
                        error instanceof Error
                          ? error.message
                          : "Invalid notebook",
                      );
                    }
                  }}
                />
              </label>
            </div>
            {(() => {
              const touched = lessons
                .map((item, i) => ({ item, i }))
                .filter(
                  ({ item }) =>
                    done.has(item.id) ||
                    notebook.notes[item.id]?.trim() ||
                    notebook.reflections[item.id]?.trim() ||
                    notebook.code_attempts[item.id] ||
                    notebook.quiz_answers[item.id] !== undefined,
                );
              if (!touched.length)
                return (
                  <p className="panel">
                    Nothing here yet. Your predictions, margin notes, code and
                    explanations collect here as you work through lessons.
                  </p>
                );
              return touched.map(({ item, i }) => {
                const quiz = item.quiz;
                const picked = notebook.quiz_answers[item.id];
                return (
                  <article className="panel notebook-entry" key={item.id}>
                    <h2>
                      <button onClick={() => open(i)}>
                        {i + 1}. {item.title}
                      </button>
                      {done.has(item.id) ? " ✓" : ""}
                    </h2>
                    {quiz && picked !== undefined && (
                      <p>
                        <strong>I predicted:</strong> {quiz.options[picked]}{" "}
                        {picked === quiz.answer ? "✓" : "✗"}
                      </p>
                    )}
                    {notebook.notes[item.id]?.trim() && (
                      <p>
                        <strong>Margin notes:</strong> {notebook.notes[item.id]}
                      </p>
                    )}
                    {notebook.reflections[item.id]?.trim() && (
                      <p>
                        <strong>My explanation:</strong> {notebook.reflections[item.id]}
                      </p>
                    )}
                    {notebook.code_attempts[item.id] && (
                      <pre>{notebook.code_attempts[item.id]}</pre>
                    )}
                  </article>
                );
              });
            })()}
          </>
        )}
        {view === "glossary" && (
          <>
            <h1>Glossary</h1>
            <label className="glossary-search">
              Search {course.glossary.length} terms
              <input
                type="search"
                value={glossaryQuery}
                placeholder="e.g. phase, entangle, oracle"
                onChange={(e) => setGlossaryQuery(e.target.value)}
              />
            </label>
            {course.glossary
              .filter((row) =>
                row.join(" ").toLowerCase().includes(glossaryQuery.trim().toLowerCase()),
              )
              .map(([term, intuition, definition]) => (
                <article className="panel glossary-entry" key={term}>
                  <h2>{term}</h2>
                  <p>
                    <strong>Picture it: </strong>
                    {intuition}
                  </p>
                  <p>
                    <strong>Precisely: </strong>
                    {definition}
                  </p>
                </article>
              ))}
          </>
        )}
        {view === "author" && (
          <>
            <h1>Content Studio</h1>
            <p>
              Edit a session copy of the course as JSON. Download
              site_content.json and commit it to frontend/site_content.json to
              publish; run python scripts/export_course.py afterward. Exercise
              checks use the published server reference until deployment.
            </p>
            <button
              onClick={() =>
                setEditor(JSON.stringify({ brand, lessons }, null, 2))
              }
            >
              Load current content
            </button>
            <textarea
              className="code-editor"
              aria-label="Course content JSON"
              rows={25}
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
            />
            <div className="course-controls">
              <button
                onClick={() => {
                  try {
                    const data = parseContent(editor);
                    setBrand(data.brand);
                    setLessons(data.lessons);
                    patch({ selected_lesson: 0, learning_stage: 0 });
                    setNotice("Content applied to this session.");
                  } catch (error) {
                    setNotice(
                      error instanceof Error
                        ? error.message
                        : "Invalid content",
                    );
                  }
                }}
              >
                Validate and preview
              </button>
              <button
                onClick={() => {
                  try {
                    const data = parseContent(editor);
                    download(
                      "site_content.json",
                      JSON.stringify(data, null, 2),
                    );
                  } catch (error) {
                    setNotice(
                      error instanceof Error
                        ? error.message
                        : "Invalid content",
                    );
                  }
                }}
              >
                Download site_content.json
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
