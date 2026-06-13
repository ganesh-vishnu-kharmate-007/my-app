# Focus Timer ("FocusFlow")

A React + TypeScript build task. It's a real, useful tool and **covers every topic on its own**:

> React setup · `useState` · `useEffect` · `useCallback` · `useMemo` · `useRef` · `useContext` · React Router · data fetching (`fetch` + async/await) · reusable components · `localStorage` · meaningful TypeScript

Broken into ordered **steps** so it can be done (or graded) incrementally. A coverage checklist at the end confirms every topic is exercised.

Suggested time: **7–10 hours**.

**Ground rules (this is the "React setup" topic):**

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm install react-router-dom
npm install tailwindcss @tailwindcss/vite
npm run dev
```

Then add the Tailwind plugin to `vite.config.ts` and `@import "tailwindcss";` at the top of your CSS entry (Tailwind v4 setup).

Tailwind is fine and encouraged for styling. **No** component/UI kits (e.g. MUI, shadcn) and **no** state-management libraries (no Redux/Zustand/Jotai) — state must be plain React (`useState`/`useContext`). For the API step, a small HTTP client like `axios` is allowed if you prefer it, but it's not required or expected — the built-in `fetch` is perfectly fine. No `any`. The point is the fundamentals.

---

## How to work and submit

- **Create your own repository on Bitbucket** and push your work there.
- **Add this question file to the repo** (commit it at the root, e.g. `TASK.md`) so the requirements live alongside your code.
- **Commit at the end of every step.** Each step should be its own commit with a clear message (e.g. `Step 4: add TimerSettingsContext`). We look at the commit history to see how you worked, not just the final result — small, meaningful commits matter.
- **You are done at Step 9.** When Step 9 is committed and pushed, the task is complete (the Bonus TS challenge is optional). Share the Bitbucket repo link to submit.

---

## What you're building

**The simple version:** it's hard to focus for a long time. A popular trick is to work in short bursts — focus for 25 minutes, then take a 5-minute break, then repeat. You're building a little clock that runs those bursts for someone: it counts down, tells them when to work and when to rest, and dings when each part is over so they don't have to watch it.

A user can start the timer, pause it, reset it, or skip ahead. After a few rounds of work it gives them a longer break as a reward. The app quietly keeps score of how many focus sessions they've finished, shows them their history (*"you focused 6 times today"*), and lets them change how long each part lasts. Close it and reopen it, and their settings and history are still there.

**Why it's worth building:** a timer looks easy but it's the cleanest way to learn the parts of React that trip people up — keeping something ticking accurately, cleaning it up so it doesn't keep running in the background, and remembering a value (the ticking clock) without making the screen redraw every second. These are real bugs you'll hit on the job, in a friendly package.

Under the hood it's a few pages — a Timer page, a History/stats page, and a Settings page — with settings and session history shared across all of them via context and saved to `localStorage`.

### Step 0 — Project setup
Fresh Vite `react-ts` project, install `react-router-dom`, strict mode on.
> Covers: **React setup**

### Step 1 — Model the data in TypeScript
- `type Mode = 'work' | 'shortBreak' | 'longBreak'`
- A `Settings` interface with `Record<Mode, number>` durations (seconds) plus `sessionsBeforeLongBreak: number`.
- A `Session` interface for history: `id: string`, `mode: Mode`, `completedAt: string`.
> Covers: **TypeScript** (unions, `Record`, interfaces)

### Step 2 — Build reusable UI primitives
Typed reusable components: `Button`, `TimerDisplay`, `ProgressBar` (or ring), and `StatCard`. Used across multiple pages.
> Covers: **Reusable components**, **TypeScript** (typed props)

### Step 3 — Persist with a generic hook
Write a generic custom hook used for settings and history:
```ts
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
```
- Reads the initial value from storage (falling back to `initialValue`), writes back on change inside a `useEffect`, and survives empty/corrupt JSON without crashing.
> Covers: **useEffect**, **localStorage**, **TypeScript** (generics)

### Step 4 — Share state with Context
Settings and session history are read/written from several pages, so lift them into context.
- Create a `TimerSettingsContext` + provider holding `settings` and `history` (both backed by `useLocalStorage`), exposing `updateSettings`, `addSession`, and `clearHistory` — each wrapped in `useCallback`.
- Default context value is `undefined`; write a typed `useTimerSettings()` hook (using `useContext`) that throws a clear error if used outside the provider.
> Covers: **useContext**, **useState**, **useCallback**, **TypeScript** (typed context, "throw if no provider" pattern)

### Step 5 — Routing and app shell
Set up React Router with a shared layout (nav bar + `<Outlet />`) wrapped by the provider. Routes:
- `/` — Timer
- `/history` — session history + stats
- `/settings` — edit durations
- `*` — NotFound
Use `<NavLink>` for nav.
> Covers: **React Router** (routes, nested layout/`Outlet`)

### Step 6 — Timer page: countdown, interval via ref, effect cleanup
This is the heart of the task.
- `useState` for `secondsLeft`, `isRunning`, `mode`.
- Hold the `setInterval` ID in `useRef<number | null>(null)` — a mutable value that must **not** trigger re-renders, so it does not belong in state.
- A `useEffect` starts the interval when running, and its **cleanup function clears the interval**; it re-runs when `isRunning`/`mode` change. Guarantee only one interval ever runs (no double-speed timer after Start/Pause/Start).
- Hold an `<audio>` element in `useRef<HTMLAudioElement>(null)` to play a sound at phase end (or flash the screen).
- Read durations from context (Step 4), so changing settings affects the timer.
> Covers: **useState**, **useRef**, **useEffect** (with cleanup)

### Step 7 — Controls + derived display
- `start`, `pause`, `reset`, `skip`, each wrapped in `useCallback`, passed to your `Button` components.
- Phase cycling: work → short break → repeat, with a long break after every Nth completed work session (from settings). On completing a work phase, call `addSession` from context.
- `useMemo` for the formatted `MM:SS` string and the progress percentage feeding the `ProgressBar`.
- A separate `useEffect` updates `document.title` to show remaining time (e.g. `23:14 – Work`).
> Covers: **useCallback**, **useMemo**, more **useEffect**

### Step 8 — History and Settings pages
- **History** (`/history`): list sessions from context; `useMemo` derives a "sessions today" / "this week" stat shown in `StatCard`s; a Clear button calls `clearHistory`.
- **Settings** (`/settings`): a form (controlled `useState`) to edit durations and `sessionsBeforeLongBreak`, saving via `updateSettings`.
> Covers: more **useMemo**, **useState**, reuse of context + reusable components

### Step 9 — Break-time quote (calling an API)
When a break starts, fetch a short motivational quote from a real API and show it on the break screen, so the rest is a little nicer.
- Use a free, no-key endpoint such as `https://api.quotable.io/random` which returns `{ "content": "...", "author": "..." }` (or any equivalent quotes API).
- Write a small reusable async hook — `useFetch<T>(url)` returning `{ data, loading, error }` — typed with a generic. Type the response shape explicitly (no `any`).
- **Handle every state**, which is the real lesson: show a subtle "loading…" while it fetches, the quote + author on success, and on failure **fall back gracefully** to a hardcoded quote from a small local list rather than showing an error — a nice example of degrading politely instead of breaking.
- Trigger the fetch when the mode changes to a break (`useEffect`), and **cancel the in-flight request with an `AbortController`** if the user skips the break before it returns, so you never update state after the phase has moved on.
> Covers: **data fetching** (`fetch`, async/await, loading/error/fallback handling, `AbortController` cleanup), **TypeScript** (generic fetch hook, typed response), more **useEffect**

### Bonus TS challenge
Extract a custom `useInterval(callback: () => void, delay: number | null)` hook (passing `null` pauses it) using a ref to always call the latest callback. Type it cleanly.

---

## Coverage checklist
- [ ] React setup
- [ ] useState
- [ ] useEffect
- [ ] useCallback
- [ ] useMemo
- [ ] useRef
- [ ] useContext
- [ ] React Router
- [ ] data fetching (`fetch`, loading/error/fallback, `AbortController`)
- [ ] reusable components
- [ ] localStorage
- [ ] TypeScript (unions, `Record`, interfaces, generics, typed context, typed refs, no `any`)

## Stretch goals
Reflect the current mode in the URL · sessions-per-day bar chart · desktop notification on phase end · keyboard shortcuts (space to start/pause).

---

## Rule

**No `any`.** Type everything properly — props, event handlers, hooks, refs, route params, the context value, and the custom hook's generics. Use of `any` (or `as any`) is not acceptable.
