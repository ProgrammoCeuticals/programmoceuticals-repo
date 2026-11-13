const fs = require('fs');
let content = fs.readFileSync('/Users/macbookpro/Desktop/ProgrammoCeuticals/school/client/src/data/slidesData.js', 'utf8');

function replaceSlide(id, slideObj) {
  const marker = '    id: ' + id + ',';
  const start = content.indexOf('  {\n' + marker);
  if (start === -1) { console.log('NOT FOUND: id', id); return; }
  let depth = 0, i = start;
  while (i < content.length) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') { depth--; if (depth === 0) break; }
    i++;
  }
  const end = content.indexOf(',', i) + 1;
  const newText = '  ' + JSON.stringify(slideObj, null, 2).split('\n').join('\n  ').trimEnd();
  content = content.slice(0, start) + newText + content.slice(end);
  console.log('Replaced id:', id);
}

// ─── Module 1: Introduction to Programming & Python ───────────────────────

// Slide 3 — Why Learn Python First
replaceSlide(3, {
  id: 3,
  moduleId: 1,
  moduleTitle: "Introduction to Programming & Python",
  title: "Why Learn Python First?",
  type: "lesson",
  content: {
    body: `Choosing your first programming language matters more than most people realise. The language you start with shapes how you think about problems, how quickly you build confidence, and how soon you can build real things. Python is the best first language for most people for concrete, practical reasons.

## The Syntax Is Minimal

Python does not require you to declare variable types, add semicolons at the end of lines, or wrap everything in classes before you can run a single line. You can write a complete, working program in one line. This means you spend your first weeks learning to think like a programmer — not fighting syntax rules.

## The Error Messages Are Helpful

When something goes wrong in Python, the error message tells you exactly what happened and on which line. Compare this to languages like C++ where error messages can be cryptic paragraphs that require years of experience to decode.

## The Community Is Enormous

Python has one of the largest developer communities in the world. Whatever problem you encounter, someone has already solved it and written about it. Stack Overflow, GitHub, YouTube, and countless blogs are full of Python answers.

## It Scales With You

Python is not a language you outgrow. The same language you use to write your first print() statement is used to build Instagram's backend, train machine learning models at Google, and analyse genomic data at research hospitals. You will never need to "graduate" to a different language to do serious work.`,
    diagram: `flowchart LR
    A["Beginner\nDay 1"] --> B["Variables\n& Logic"]
    B --> C["Functions\n& Data"]
    C --> D["OOP &\nModules"]
    D --> E["APIs &\nDatabases"]
    E --> F["Production\nSystems"]
    style A fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b
    style F fill:#3776ab,color:#fff,stroke:#3776ab`,
    diagramCaption: "Python grows with you — from your first print() to production systems",
    callout: {
      type: "tip",
      text: "If you already know another language, Python will feel refreshingly simple. If this is your first language, you are starting in the best possible place.",
    },
    keyPoints: [
      "Python's minimal syntax lets you focus on logic, not language rules",
      "Helpful error messages make debugging faster for beginners",
      "The largest developer community means answers are always available",
      "Python scales from beginner scripts to production systems at major companies",
      "You will never need to switch languages to do serious, professional work",
    ],
  },
});

// Slide 5 — Your First Python Code
replaceSlide(5, {
  id: 5,
  moduleId: 1,
  moduleTitle: "Introduction to Programming & Python",
  title: "Your First Python Code",
  type: "lesson",
  content: {
    body: `The \`print()\` function is the simplest way to produce output in Python. It takes whatever you put inside the parentheses and displays it on the screen. This is how you communicate results, debug problems, and verify that your code is working.

## The print() Function

A **function** is a named action that Python knows how to perform. You call it by writing its name followed by parentheses. Whatever you put inside the parentheses is called an **argument** — the data you are passing to the function.

\`print("Hello")\` tells Python: run the print function, and give it the text "Hello" as its argument.

## Strings

The text inside the quotes is called a **string** — a sequence of characters. Strings must always be wrapped in quotes. You can use single quotes or double quotes, but they must match.

- \`print("Hello")\` — valid
- \`print('Hello')\` — valid
- \`print("Hello')\` — invalid (mismatched quotes)

## Running Multiple Lines

Python runs each line in order. If you have three print() calls, they run one after another and each produces a line of output.`,
    code: `# print() displays output to the screen
print("Hello, Python!")

# You can print numbers too
print(42)
print(3.14)

# You can print multiple values separated by commas
print("My name is", "Alice")
print("The answer is", 42)

# Strings can use single or double quotes
print('Single quotes work too')`,
    language: "python",
    callout: {
      type: "note",
      text: "The parentheses after print are not optional. `print` without parentheses does nothing useful. `print()` with empty parentheses prints a blank line.",
    },
    keyPoints: [
      "print() is a built-in function that displays output on the screen",
      "Text passed to print() must be wrapped in quotes — this is called a string",
      "You can use single or double quotes, but they must match",
      "print() can accept multiple arguments separated by commas",
      "Each print() call produces one line of output",
    ],
    tryIt: "Write a program that prints your full name on one line, your age on the next, and your favourite programming language on the third. Run it and verify the output.",
  },
});

// Slide 6 — Understanding Errors
replaceSlide(6, {
  id: 6,
  moduleId: 1,
  moduleTitle: "Introduction to Programming & Python",
  title: "Understanding Errors",
  type: "lesson",
  content: {
    body: `Every programmer sees errors every single day. Errors are not a sign that you are bad at programming — they are a normal, expected part of the process. The difference between a beginner and an experienced developer is not that one avoids errors. It is that the experienced developer reads them calmly and fixes them faster.

## What an Error Message Tells You

When Python cannot execute a line of code, it stops and prints an error message. The message has three key parts:

1. **The traceback** — shows the sequence of function calls that led to the error
2. **The file and line number** — tells you exactly where the problem is
3. **The error type and message** — tells you what went wrong

## The Most Common Beginner Errors

**SyntaxError** — Python cannot parse the line. Usually a missing quote, bracket, or colon.

**NameError** — You used a variable that has not been defined yet.

**TypeError** — You tried to do something with the wrong type of data, like adding a number to a string.

**IndentationError** — Your indentation is inconsistent. Python uses indentation to define code blocks.

## How to Read an Error

Always read from the bottom up. The last line is the actual error. The lines above it show you the path Python took to get there. Start by fixing the error on the last line, then re-run.`,
    code: `# This code has a deliberate error — run it and read the message
print("Hello, World!"
print("This line never runs")`,
    language: "python",
    callout: {
      type: "warning",
      text: "When you see an error, resist the urge to immediately change things randomly. Read the message first. It almost always tells you exactly what is wrong.",
    },
    sections: [
      {
        heading: "A Real Error Example",
        body: `When you run the code above, Python will show something like:

\`SyntaxError: '(' was never closed\`

This tells you that a parenthesis was opened but never closed. Python found the opening \`(\` on line 2 but never found the matching \`)\`. The fix is to add the closing parenthesis.`,
      },
    ],
    keyPoints: [
      "Errors are normal — every professional developer encounters them daily",
      "Read error messages from the bottom up — the last line is the actual problem",
      "SyntaxError means Python cannot parse the line — check for missing quotes or brackets",
      "NameError means you used a variable before defining it",
      "TypeError means you used the wrong type of data for an operation",
    ],
    tryIt: "Deliberately break the code: remove a closing quote from a print() statement. Run it, read the error, then fix it. Do this three times with different types of errors.",
  },
});

// Slide 7 — How to Practice Python
replaceSlide(7, {
  id: 7,
  moduleId: 1,
  moduleTitle: "Introduction to Programming & Python",
  title: "How to Practice Python",
  type: "lesson",
  content: {
    body: `Learning to program is a physical skill as much as an intellectual one. Reading about programming makes you understand it. Writing code makes you able to do it. These are different things, and only one of them leads to actual competence.

## The Most Important Rule: Type Everything

Never copy and paste code from examples. Type it yourself, character by character. This feels slower, but it forces you to read every character, notice every detail, and build the muscle memory that makes coding feel natural. Developers who copy-paste their way through tutorials consistently struggle when they try to write code from scratch.

## Practice Daily, Not Intensively

Thirty minutes of daily practice builds stronger skills than a six-hour session once a week. Programming is like learning a language or a musical instrument — consistency beats intensity. Your brain consolidates what you learned while you sleep, so daily practice gives your brain more consolidation cycles.

## Break Things on Purpose

Once you understand an example, change it. Remove a line and see what happens. Change a value and predict the output before running it. Add something that should not work and read the error. This deliberate experimentation is how you build deep understanding rather than surface familiarity.

## Build Small Things

The fastest way to learn is to build something you actually want to exist. It does not need to be impressive. A script that prints today's date, a program that asks your name and greets you, a calculator that adds two numbers — these small projects force you to apply what you know and discover what you do not.`,
    callout: {
      type: "tip",
      text: "Keep a learning journal. After each session, write one sentence about what you learned and one question you still have. This forces reflection and helps you track progress.",
    },
    keyPoints: [
      "Type all code yourself — never copy-paste from examples",
      "Practice daily for 20-30 minutes rather than long sessions once a week",
      "Experiment deliberately — change examples and predict what will happen",
      "Build small projects that solve real problems you care about",
      "Reading code and writing code are different skills — you need both",
    ],
    tryIt: "Set a timer for 25 minutes. Write a Python program from scratch that asks the user for their name and age, then prints a personalised greeting. Do not look at any examples.",
  },
});

// Slide 8 — What Comes Next
replaceSlide(8, {
  id: 8,
  moduleId: 1,
  moduleTitle: "Introduction to Programming & Python",
  title: "Module 1 Summary",
  type: "lesson",
  content: {
    body: `You have completed the introduction to Python. Before moving on, make sure you are comfortable with everything covered in this module. The concepts here are the foundation for everything that follows.

## What You Learned

You now understand what programming is at a fundamental level — giving precise instructions to a computer that executes them exactly as written. You know why Python is a strong choice as a first language, how the Python interpreter executes code sequentially, and how to read and respond to error messages.

You have written your first Python programs using \`print()\` and you understand that strings must be wrapped in quotes.

## What Is Coming Next

Module 2 introduces **variables** — the mechanism for storing and reusing data in your programs. Variables are the building blocks of every program you will ever write. Once you understand variables and data types, you can start building programs that remember information and make decisions based on it.`,
    diagram: `flowchart LR
    A["✅ What is\nprogramming"] --> B["✅ What is\nPython"]
    B --> C["✅ How programs\nrun"]
    C --> D["✅ print() and\nstrings"]
    D --> E["✅ Reading\nerrors"]
    E --> F["➡️ Variables &\nData Types"]
    style A fill:#dcfce7,stroke:#16a34a,color:#166534
    style B fill:#dcfce7,stroke:#16a34a,color:#166534
    style C fill:#dcfce7,stroke:#16a34a,color:#166534
    style D fill:#dcfce7,stroke:#16a34a,color:#166534
    style E fill:#dcfce7,stroke:#16a34a,color:#166534
    style F fill:#3776ab,color:#fff,stroke:#3776ab`,
    diagramCaption: "Module 1 complete — you are ready for variables and data types",
    code: `# Module 1 review — everything you now know
# Run this and make sure you understand every line

print("Hello, Python!")          # print() displays output
print("Python runs top to bottom") # sequential execution
print(42)                         # numbers work too
print("Line 1", "Line 2")        # multiple arguments`,
    language: "python",
    keyPoints: [
      "Programming is writing precise instructions that a computer executes exactly",
      "Python executes code sequentially — top to bottom, one line at a time",
      "print() displays output and accepts strings, numbers, and multiple arguments",
      "Error messages tell you the type of error and the line number — read them carefully",
      "Consistent daily practice builds skills faster than occasional long sessions",
    ],
  },
});

// Slide 215 — Trying Python in the REPL
replaceSlide(215, {
  id: 215,
  moduleId: 1,
  moduleTitle: "Introduction to Programming & Python",
  title: "The Python REPL",
  type: "lesson",
  content: {
    body: `The Python REPL (Read-Eval-Print Loop) is an interactive environment where you type one line of Python and see the result immediately. It is the fastest way to test ideas, check syntax, and explore how Python behaves.

## How to Open the REPL

Open your terminal and type \`python\` or \`python3\` and press Enter. You will see a prompt that looks like \`>>>\`. This means Python is ready for your input.

## What the REPL Is Good For

- Testing a single expression quickly
- Checking what a function returns
- Exploring a new library
- Verifying your understanding of a concept

## What the REPL Is Not Good For

The REPL is not where you write programs. It does not save your work, and multi-line code is awkward to write there. Use it for quick experiments, then write your actual programs in \`.py\` files.`,
    code: `# In the REPL, you type one line and see the result immediately
# The >>> is the prompt — you do not type it

# Try these one at a time:
2 + 2
print("Hello")
len("Python")
type(42)
type("hello")
type(3.14)
type(True)`,
    language: "python",
    callout: {
      type: "tip",
      text: "In the REPL, you can type an expression without print() and Python will show you its value. This only works in the REPL — in a .py file, you must use print() to see output.",
    },
    keyPoints: [
      "The REPL lets you run Python one line at a time and see results immediately",
      "Open it by typing python or python3 in your terminal",
      "Use it for quick experiments and testing ideas",
      "Write actual programs in .py files, not in the REPL",
      "type() tells you the data type of any value",
    ],
  },
});

// Slide 216 — A First Error Example
replaceSlide(216, {
  id: 216,
  moduleId: 1,
  moduleTitle: "Introduction to Programming & Python",
  title: "Reading Your First Error",
  type: "lesson",
  content: {
    body: `The code below contains a deliberate syntax error. Run it, read the error message carefully, then fix it. This exercise is more valuable than it looks — learning to read errors quickly is one of the most important skills in programming.

## What to Look For

When you run the broken code, Python will show you:

1. The word \`File\` followed by the filename and line number
2. The line of code that caused the problem
3. A caret (\`^\`) pointing to where Python got confused
4. The error type and a description

## The Fix

The error is a missing closing parenthesis on line 1. Python opened a \`(\` but never found the matching \`)\`. Add the closing parenthesis and run it again.`,
    code: `# This code has a deliberate error
# Run it, read the error, then fix it

print("Hello, World!"
print("I am learning Python")`,
    language: "python",
    callout: {
      type: "note",
      text: "SyntaxError means Python cannot even parse the line — it cannot understand what you wrote. This is always a structural problem: a missing bracket, quote, colon, or parenthesis.",
    },
    keyPoints: [
      "SyntaxError means Python cannot parse the line — check for missing brackets or quotes",
      "The caret (^) in the error output points to where Python got confused",
      "The line number in the error tells you where to look",
      "Fix one error at a time and re-run after each fix",
      "Getting comfortable with errors early makes you a faster developer",
    ],
    tryIt: "After fixing the error above, deliberately introduce three different types of errors one at a time: remove a quote, remove a parenthesis, and misspell 'print'. Read each error message before fixing it.",
  },
});

// Fix missing commas
content = content.replace(/  \}\n\n  \{/g, '  },\n\n  {');
content = content.replace(/  \}\n  \{/g, '  },\n  {');
content = content.replace(/  \}\n\n\n  \{/g, '  },\n\n\n  {');

fs.writeFileSync('/Users/macbookpro/Desktop/ProgrammoCeuticals/school/client/src/data/slidesData.js', content, 'utf8');
console.log('Module 1 rewrite complete');
