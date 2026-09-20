import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000";

function App() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [angleMode, setAngleMode] = useState("DEG");
  const [saving, setSaving] = useState(false);

  const add = (value) => {
    setDisplay((old) => old + value);
    setResult("");
  };

  const clear = () => {
    setDisplay("");
    setResult("");
  };

  const backspace = () => {
    setDisplay((old) => old.slice(0, -1));
    setResult("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const factorial = (number) => {
    if (number < 0 || !Number.isInteger(number)) {
      throw new Error("Invalid factorial");
    }

    let answer = 1;

    for (let i = 2; i <= number; i++) {
      answer *= i;
    }

    return answer;
  };

  const convertAngle = (value) => {
    return angleMode === "DEG"
      ? (value * Math.PI) / 180
      : value;
  };

  const calculateExpression = (expression) => {
    let exp = expression
      .replace(/π/g, "Math.PI")
      .replace(/\^/g, "**")
      .replace(/√/g, "Math.sqrt");

    exp = exp.replace(/\be\b/g, "Math.E");

    exp = exp.replace(
      /sin\(([^()]*)\)/g,
      (_, value) =>
        `Math.sin(${convertAngle(Number(value))})`
    );

    exp = exp.replace(
      /cos\(([^()]*)\)/g,
      (_, value) =>
        `Math.cos(${convertAngle(Number(value))})`
    );

    exp = exp.replace(
      /tan\(([^()]*)\)/g,
      (_, value) =>
        `Math.tan(${convertAngle(Number(value))})`
    );

    exp = exp.replace(
      /log\(([^()]*)\)/g,
      "Math.log10($1)"
    );

    exp = exp.replace(
      /ln\(([^()]*)\)/g,
      "Math.log($1)"
    );

    exp = exp.replace(
      /(\d+)!/g,
      (_, value) => `factorial(${value})`
    );

    if (!/^[0-9+\-*/().,\sA-Za-z_*!]+$/.test(exp)) {
      throw new Error("Invalid expression");
    }

    const answer = Function(
      "Math",
      "factorial",
      `"use strict"; return (${exp})`
    )(Math, factorial);

    if (!Number.isFinite(answer)) {
      throw new Error("Invalid calculation");
    }

    return Number.isInteger(answer)
      ? answer
      : Number(answer.toFixed(10));
  };

  const calculate = async () => {
    if (!display.trim()) {
      return;
    }

    try {
      const expression = display;
      const answer = calculateExpression(expression);

      setResult(String(answer));

      setHistory((old) => [
        {
          expression,
          answer,
        },
        ...old,
      ]);

      setSaving(true);

      try {
        const response = await axios.post(
          `${API_URL}/calculate`,
          {
            expression,
            result: answer,
          }
        );

        console.log(
          "Saved to database:",
          response.data
        );
      } catch (error) {
        console.error(
          "Database save failed:",
          error.response?.data || error.message
        );
      } finally {
        setSaving(false);
      }
    } catch (error) {
      console.error(error);
      setResult("Error");
    }
  };

  const scientific = (functionName) => {
    if (functionName === "sqrt") {
      add("√(");
    } else if (functionName === "sin") {
      add("sin(");
    } else if (functionName === "cos") {
      add("cos(");
    } else if (functionName === "tan") {
      add("tan(");
    } else if (functionName === "log") {
      add("log(");
    } else if (functionName === "ln") {
      add("ln(");
    }
  };

  const handleKeyDown = (event) => {
    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "+",
      "-",
      "*",
      "/",
      ".",
      "(",
      ")",
      "^",
      "Enter",
      "Backspace",
      "Escape",
    ];

    if (!allowedKeys.includes(event.key)) {
      return;
    }

    if (event.key === "Enter") {
      calculate();
    } else if (event.key === "Backspace") {
      backspace();
    } else if (event.key === "Escape") {
      clear();
    } else {
      add(event.key);
    }
  };

  return (
    <div
      className="app"
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >

      {/* CALCULATOR */}
      <main className="calculator">

        <header className="top">

          <div className="brand">

            <div className="brand-icon">
              Σ
            </div>

            <div>
              <h1>Smart Calculator</h1>

              <p>
                Free Online Scientific Calculator
              </p>
            </div>

          </div>

          <button
            className="mode"
            onClick={() =>
              setAngleMode((old) =>
                old === "DEG" ? "RAD" : "DEG"
              )
            }
          >
            {angleMode}
          </button>

        </header>


        {/* DISPLAY */}

        <section className="screen">

          <div className="screen-label">
            {saving
              ? "Saving..."
              : "CALCULATION"}
          </div>

          <div className="expression">
            {display || "0"}
          </div>

          <div className="answer">
            {result || "0"}
          </div>

        </section>


        {/* SCIENTIFIC BUTTONS */}

        <section className="scientific-buttons">

          <button onClick={() => scientific("sin")}>
            sin
          </button>

          <button onClick={() => scientific("cos")}>
            cos
          </button>

          <button onClick={() => scientific("tan")}>
            tan
          </button>

          <button onClick={() => scientific("log")}>
            log
          </button>

          <button onClick={() => scientific("ln")}>
            ln
          </button>

          <button onClick={() => scientific("sqrt")}>
            √
          </button>

          <button onClick={() => add("^")}>
            xʸ
          </button>

          <button onClick={() => add("!")}>
            x!
          </button>

          <button onClick={() => add("π")}>
            π
          </button>

          <button onClick={() => add("e")}>
            e
          </button>

          <button onClick={() => add("(")}>
            (
          </button>

          <button onClick={() => add(")")}>
            )
          </button>

        </section>


        {/* MAIN BUTTONS */}

        <section className="buttons">

          <button
            className="clear"
            onClick={clear}
          >
            AC
          </button>

          <button onClick={backspace}>
            DEL
          </button>

          <button onClick={() => add("/")}>
            ÷
          </button>

          <button onClick={() => add("*")}>
            ×
          </button>

          <button onClick={() => add("7")}>
            7
          </button>

          <button onClick={() => add("8")}>
            8
          </button>

          <button onClick={() => add("9")}>
            9
          </button>

          <button onClick={() => add("-")}>
            −
          </button>

          <button onClick={() => add("4")}>
            4
          </button>

          <button onClick={() => add("5")}>
            5
          </button>

          <button onClick={() => add("6")}>
            6
          </button>

          <button onClick={() => add("+")}>
            +
          </button>

          <button onClick={() => add("1")}>
            1
          </button>

          <button onClick={() => add("2")}>
            2
          </button>

          <button onClick={() => add("3")}>
            3
          </button>

          <button
            className="equals"
            onClick={calculate}
          >
            =
          </button>

          <button onClick={() => add("0")}>
            0
          </button>

          <button onClick={() => add(".")}>
            .
          </button>

        </section>

      </main>



      {/* HISTORY */}

      <aside className="history">

        <div className="history-header">

          <div>

            <span className="history-icon">
              ◷
            </span>

            <div>

              <h2>
                History
              </h2>

              <p>
                Recent calculations
              </p>

            </div>

          </div>

          {history.length > 0 && (
            <button
              className="clear-history"
              onClick={clearHistory}
            >
              Clear
            </button>
          )}

        </div>


        <div className="history-list">

          {history.length === 0 ? (

            <div className="empty-history">

              <div className="empty-icon">
                ∑
              </div>

              <h3>
                No calculations yet
              </h3>

              <p>
                Your calculations will
                appear here.
              </p>

            </div>

          ) : (

            history.map((item, index) => (

              <div
                className="history-item"
                key={index}
              >

                <div className="history-expression">
                  {item.expression}
                </div>

                <div className="history-result">
                  = {item.answer}
                </div>

              </div>

            ))

          )}

        </div>

      </aside>

    </div>
  );
}

export default App;