# AeroMath

A sleek, minimal, and highly responsive web application designed for quick math practice on both desktop and mobile.

## Features

- **Double-Sided Ranges**: Set custom minimum and maximum bounds (1–20) for both numbers.
- **Selective Operations**: Toggle addition (+), subtraction (–), multiplication (×), and division (÷) individually.
- **Even Distribution**: Specially balanced division generator that ensures an equal probability of encountering divisors, eliminating statistical bias toward smaller numbers.
- **Instant Feedback**: The input border glows green and automatically proceeds to the next question when correct, and shakes red on incorrect submissions.
- **Score tracking**: Tracks correct answers, incorrect attempts, and accuracy percentages.
- **Keyboard Friendly**: Full keyboard use supported (automatic focus on load, `Enter` to submit, `Esc` to toggle settings).

---

## How to Run Locally

You can open and run this application on your computer using one of two methods:

### Method 1: Open Directly (Easiest)
Since the app uses vanilla HTML, CSS, and JavaScript, you can open it directly in any browser:
- Double-click the `index.html` file in your file explorer, **or**
- Run the following command in your terminal:
  ```bash
  open index.html
  ```

### Method 2: Run a Local Server
If you prefer running it via a local development server:
1. Open your terminal in the project directory.
2. Start Python's built-in server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser and navigate to: **[http://localhost:8000](http://localhost:8000)**
4. To stop the local server, go back to your terminal window and press **`Ctrl + C`**.
