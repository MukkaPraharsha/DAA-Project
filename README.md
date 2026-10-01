# 🔬 Sort Lab — Sorting Algorithm Visualizer

> A mini-project that lets you **see** how sorting algorithms work. Build an array, pick one or more algorithms, and watch every comparison and swap happen in real time, with a plain-English explanation of each step.

Built with **HTML + CSS + vanilla JavaScript only** — no frameworks, no libraries, no backend. It runs completely in the browser.



## 1. 📖 About the Project

**Sort Lab** is an interactive visualizer for sorting algorithms. Instead of only reading code or theory, you can watch each algorithm work on an array, bar by bar, and read exactly what it is doing at every step (for example: *"Comparing index 3 (42) and index 4 (7) → 42 > 7, swap needed"*).

You can run **one algorithm** in a full-size view, or select **two or more** and let them **race** on the same array to compare how many comparisons and writes each one needs.

---

## 2. 🎯 Why I Built This

- Sorting algorithms are a core topic in Data Structures & Algorithms (DSA), and they are easy to forget when only memorised.
- Seeing the algorithm move step by step makes the logic much easier to understand and explain in interviews.
- It is a good front-end project that practises DOM manipulation, the Canvas API, and animation using only JavaScript.

---

## 3. ✨ Features

- **Three ways to create an array**
  - 🎲 **Random** – choose the size (5 to 60) and generate random values.
  - ✍️ **Manual** – type your own comma-separated numbers.
  - 📦 **Preset** – Already sorted, Reverse sorted, Nearly sorted, or Few unique values (many duplicates).
- **9 sorting algorithms** – Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Radix, Counting.
- **Single view** – large bar chart on a canvas, with colors showing what is happening.
- **Step-by-step explanation box** – a sentence describing the current step.
- **Live array display** – the actual array values, with the active elements highlighted and marked with arrows.
- **Full step log** – a scrollable list of *all* steps; the current one is highlighted.
- **Race mode** – select 2+ algorithms to run them side by side on the same array.
- **Leaderboard** – ranks algorithms by finishing time, with comparisons, writes, and steps.
- **Playback controls** – Start, Pause/Resume, Step once, Reset.
- **Speed slider** – from slow step-by-step to fast.
- **Live stats bar** – array size, comparisons, swaps/writes, current step, elapsed time.
- **Complexity reference table** – best, average, worst time and space, and stability; the row of the running algorithm is highlighted.
- **Responsive, modern dark UI** – gradient bars, glowing accents, works on desktop and mobile.

---

## 4. 🛠 Tech Stack

| Technology | Used for |
|---|---|
| **HTML5** | Page structure (panels, buttons, canvas, tables) |
| **CSS3** | Dark theme, gradients, layout (Flexbox + Grid), responsive design |
| **JavaScript (ES6)** | Algorithms, step recording, UI logic, animation |
| **Canvas API** | Drawing the gradient-filled bars |
| **requestAnimationFrame** | Smooth animation loop |
| **Google Fonts** | Space Grotesk, Inter, JetBrains Mono |

No npm, no build step, no external JS libraries.

---

## 5. 📁 Project Structure

```
sort-lab/
│
├── index.html     # Page layout and all the UI elements
├── style.css      # All styling (colors, layout, gradients, responsive rules)
├── script.js      # All logic (algorithms, drawing, controls, race mode)
└── README.md      # This file
```

**What each file does:**

| File | Responsibility |
|---|---|
| `index.html` | Defines the 3 steps (Build array → Choose algorithm → Run), stats bar, single stage, race stage, leaderboard, and complexity table. |
| `style.css` | Contains design tokens (CSS variables), the dark background with grid, panel/button/chip styles, bar legend, step log, race cards, and mobile rules. |
| `script.js` | Stores algorithm info, records every step of each algorithm, draws bars on canvas, handles input modes, and runs the playback loops. |

---

## 6. ▶️ How to Run (Step by Step)

### Option A — Simplest (just open the file)

1. Download or clone the project folder.
2. Make sure `index.html`, `style.css`, and `script.js` are **in the same folder**.
3. Double-click **`index.html`**. It opens in your default browser.
4. That's it — the app is ready to use.

> 💡 You need an internet connection the first time so the Google Fonts can load. If you are offline, the app still works but uses fallback fonts.

### Option B — Using VS Code Live Server

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Open the project folder in VS Code (**File → Open Folder**).
3. Go to the Extensions tab and install **Live Server**.
4. Right-click `index.html` → **Open with Live Server**.
5. The browser opens and refreshes automatically whenever you save a file.

### Option C — Using Python's built-in server

1. Open a terminal inside the project folder.
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser.

### Cloning from GitHub

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```
Then use any option above.

---

## 7. 🧭 How to Use the App (Step by Step)

### Step 1 — Build the array

Pick one of the three modes at the top of the first panel:

**🎲 Random**
1. Move the **Array size** slider (5 to 60).
2. Click **Generate**.
3. Random values between **1 and 99** appear as bars.

**✍️ Manual**
1. Click the **Manual** tab.
2. Type numbers separated by commas, e.g. `42, 7, 88, 15, 63, 3, 91`.
3. Click **Apply**.
4. You must enter **at least two valid numbers**, otherwise a hint message tells you to fix the input.

**📦 Preset**
1. Click the **Preset** tab.
2. Choose a pattern:
   - *Already sorted* – best case for some algorithms.
   - *Reverse sorted* – worst case for many algorithms.
   - *Nearly sorted* – sorted with a few random swaps.
   - *Few unique values* – many duplicate numbers.
3. Choose the size and click **Generate**.

A small hint under the panel always tells you how many values you have.

### Step 2 — Choose algorithm(s)

- Click the **chips** (rounded buttons) to select algorithms.
- **One chip selected** → full-size single view with detailed explanation.
- **Two or more chips selected** → race mode, side by side.
- At least one algorithm must always stay selected.
- You cannot change the selection while an animation is running — pause or reset first.

### Step 3 — Run it

1. Set the **Speed** slider (label shows *step-by-step*, *slow*, *medium*, or *fast*).
2. Click **▶ Start visualization** to run automatically.
3. Use **Pause / Resume** to stop and continue anytime.
4. Use **Step ▸ once** to move forward **one single step** at a time (only in single-algorithm mode). Best for learning and presenting.
5. Click **Reset** to go back to the beginning with the same array.

### Step 4 — Read what is happening

In single mode, check these areas while it runs:

- **Bars** – colors show compare / swap / pivot / sorted.
- **Step box** – a sentence explaining the current step.
- **Current array** – actual values with arrows (↑ compare, ↔ swap, P pivot).
- **All steps log** – every step listed; the current one is highlighted and the list auto-scrolls.
- **Stats bar** – comparisons, swaps/writes, step count, elapsed time.

When finished, the final **Sorted array** is printed below.

### Step 5 — Compare algorithms (Race)

1. Select two or more chips.
2. Click **Start**.
3. Each algorithm gets its own card with a mini bar chart, comparison count, write count, and step count.
4. When everything finishes, a **Results — fastest to finish** table appears with ranks.

---

## 8. 🧮 Algorithms Included

Short, simple explanation of each one as implemented in this project:

| # | Algorithm | Idea in one line |
|---|---|---|
| 1 | **Bubble Sort** | Repeatedly compare neighbours and swap if out of order; the largest value "bubbles" to the end each pass. Stops early if a pass has no swaps. |
| 2 | **Selection Sort** | Find the smallest value in the unsorted part and put it at the front. Repeat. |
| 3 | **Insertion Sort** | Take one value at a time and insert it into the correct place in the already-sorted left part (like sorting playing cards). |
| 4 | **Merge Sort** | Divide the array into halves, sort each half, then merge them. Uses divide and conquer. |
| 5 | **Quick Sort** | Choose a pivot (last element here), put smaller values on the left and bigger on the right, then repeat on both sides. |
| 6 | **Heap Sort** | Build a max-heap, then repeatedly move the largest value to the end and fix the heap. |
| 7 | **Shell Sort** | Insertion sort with a "gap" that shrinks (n/2, n/4 … 1), so far-apart elements move early. |
| 8 | **Radix Sort** | Sort numbers digit by digit (ones, tens, hundreds…) using counting. Not comparison-based. |
| 9 | **Counting Sort** | Count how many times each value appears, then rebuild the sorted array from the counts. Not comparison-based. |

---

## 9. ⏱ Complexity Table

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Shell Sort | O(n log n) | O(n^1.3) | O(n²) | O(1) | No |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n+k) | Yes |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(n+k) | Yes |

**Quick glossary**
- **n** = number of elements, **k** = range of values (counting) or number of digits (radix).
- **Stable** = equal values keep their original relative order.
- **Space** = extra memory the algorithm needs.

---

## 10. ⚙️ How the Code Works (Step by Step)

This is the most important part to understand (and to explain in a viva or interview).

### The core idea: "record first, play later"

Instead of animating while sorting, the project works in **two phases**:

1. **Record phase** – the algorithm runs completely and, at every important moment, saves a **step** (a snapshot) into a list.
2. **Playback phase** – the app plays through that list one step at a time and draws each snapshot.

Because of this, we can **pause, resume, step once, show the full step log, and count comparisons** easily — all from the same list.

### Step 1 — Algorithm data (`ALGOS`)

An object that stores each algorithm's name and its complexity values (best, average, worst, space, stable). The chips and the complexity table are **created automatically from this object**, so adding a new algorithm only needs one more entry.

### Step 2 — Recording steps (`rec` function)

```js
function rec(steps, type, arr, i, j, desc){
  steps.push({type, arr:arr.slice(), i, j, desc});
}
```

Each step stores:

| Field | Meaning |
|---|---|
| `type` | `compare`, `swap`, `pivot`, or `mark` (marked as sorted) |
| `arr` | A **copy** of the array at that moment (`slice()` makes the copy) |
| `i`, `j` | The two indexes involved |
| `desc` | A human-readable sentence explaining the step |

### Step 3 — One function per algorithm

`bubbleSort`, `selectionSort`, `insertionSort`, `mergeSort`, `quickSort`, `heapSort`, `shellSort`, `radixSort`, `countingSort`.

Each one:
1. Copies the input array (so the original is never changed).
2. Runs the normal algorithm.
3. Calls `rec(...)` whenever it compares, swaps/writes, picks a pivot, or finalises an element.
4. Returns the list of steps.

All of them are linked in the `BUILD` object, so the app can call `BUILD[key](baseArray)` using the selected algorithm's key.

### Step 4 — State variables

Variables such as `baseArray`, `selected`, `playing`, `singleSteps`, `singleIdx`, `races` store the current session: the array, the chosen algorithms, whether it is playing, the recorded steps, and the current step number.

### Step 5 — Building the UI from data

`Object.entries(ALGOS).forEach(...)` creates a **chip** for each algorithm (with a colored dot) and a **row** in the complexity table. Clicking a chip adds/removes it from the `selected` set and resets playback.

### Step 6 — Creating the array

- `randArr(n)` → n random integers from 1 to 99.
- `setArray(arr, hint)` → saves the array as `baseArray`, updates the hint text, resets playback, and draws it.
- Manual mode uses `split(',')` and `parseInt`, and filters out invalid values.
- Presets use `sort()` (sorted / reverse), a few random swaps (nearly sorted), or a limited set of values (few unique).

### Step 7 — Drawing bars on Canvas (`drawBars`)

For every value in the array:
1. Bar **height** = `(value / maxValue) × usable height`.
2. Bar **width** is calculated from the canvas width and the number of elements.
3. The color depends on state: sorted → green, pivot → purple, compare → yellow, swap → red, otherwise idle (slate, or a unique color per algorithm in race mode).
4. A **linear gradient** (top lighter → bottom darker) fills each bar.
5. The value label is drawn above the bar when the bars are wide enough.
6. `devicePixelRatio` is used so the drawing stays sharp on high-resolution screens.

### Step 8 — Showing the explanation

- `updateStepUI` shows the badge (🟨 COMPARE, 🟥 SWAP/WRITE, 🟪 PIVOT, 🟩 SORTED) plus the description.
- `renderLiveArray` draws each number in a small cell and puts arrows underneath the active elements.
- `buildStepLog` / `markLogRow` create the full list and highlight the current row.

### Step 9 — Playback loops (`tickSingle` and `tickRace`)

Both use `requestAnimationFrame`:

1. Check if `playing` is true.
2. Check if enough time (`speedDelay()`) has passed since the last step.
3. If yes → render the next step and move the index forward.
4. If there are no more steps → finish (show the final sorted array / leaderboard).
5. Otherwise schedule the next frame.

`speedDelay()` turns the slider into a delay: roughly **900 ms per step at the slowest** down to a minimum of **15 ms** at the fastest.

### Step 10 — Buttons

| Button | What it does |
|---|---|
| **Start** | Generates steps (if not already) and starts the loop |
| **Pause / Resume** | Toggles `playing` and restarts the loop on resume |
| **Step ▸ once** | Renders exactly one step (single mode only) |
| **Reset** | Cancels animation, clears steps and stats, redraws the original array |

### Step 11 — Leaderboard

When all racing algorithms are done, results are sorted by `finishTime` and written into the table with comparisons, writes, number of steps, and time.

### Step 12 — Responsive redraw

On window resize, the canvas is redrawn (when not playing) so the bars always fit the screen.

---

## 11. 🎨 Color Legend

| Color | Meaning |
|---|---|
| 🔵 Slate / blue-grey | Unsorted (idle) |
| 🟨 Yellow / amber | Elements being **compared** |
| 🟥 Red / pink | Elements being **swapped or written** |
| 🟪 Purple | **Pivot** (Quick Sort) |
| 🟩 Green | Element is in its **final sorted position** |

---

## 12. 🏁 Race Mode Explained

- When **2 or more** algorithms are selected, the single view hides and the **race grid** appears.
- Every algorithm runs on an **identical copy** of the same array, so the comparison is fair.
- All algorithms advance at the **same step rate**, so one that needs fewer total steps finishes earlier.
- Each card shows the algorithm name, its rank (after finishing), comparisons, writes, step progress, and elapsed time.
- A finished card turns green.
- Try the **Reverse sorted** preset with Bubble vs Merge Sort, or **Already sorted** with Bubble vs Insertion, to see how input type changes the result.
