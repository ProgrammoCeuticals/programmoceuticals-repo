const fs = require('fs');
let content = fs.readFileSync('/Users/macbookpro/Desktop/ProgrammoCeuticals/school/client/src/data/slidesData.js', 'utf8');

function replaceSlide(id, newSlideText) {
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
  content = content.slice(0, start) + newSlideText + content.slice(end);
  console.log('Replaced id:', id);
}

const slide1 = {
  id: 1,
  moduleId: 1,
  moduleTitle: "Introduction to Programming & Python",
  title: "What Is Programming?",
  type: "lesson",
  content: {
    body: `Programming is the act of writing precise, step-by-step instructions that a computer can execute. A computer does exactly what you tell it — nothing more, nothing less. It does not guess, it does not assume, and it does not forgive mistakes. This precision is both the challenge and the power of programming.

Think of it like giving directions to someone who has never been to your city and takes every instruction completely literally. If you say "turn left at the big tree", they will be confused. But if you say "at the junction, turn left", they will do it perfectly every time.

## Why Programming Matters

Every app on your phone, every website you visit, every automated email you receive — all of it is the result of someone writing instructions for a computer. Programming is the skill that lets you build things that work at scale, run without you being present, and solve problems for thousands of people at once.

## What a Program Actually Is

A program is a sequence of instructions stored in a file. When you run it, the computer reads each instruction from top to bottom and executes it. If an instruction fails, the program stops and reports an error. This top-to-bottom, one-at-a-time execution model is the foundation of everything you will learn.

## Why Python Is a Great Starting Point

Python was designed with readability as a core principle. Its creator, Guido van Rossum, wanted a language that reads almost like English. Compare printing "Hello" in Java versus Python:

- Java: \`System.out.println("Hello");\`
- Python: \`print("Hello")\`

Python removes the ceremony and lets you focus on the logic. That is why it is the most popular first language in universities, bootcamps, and self-taught developer communities worldwide.`,
    code: `# Your first Python program
# The hash symbol starts a comment — Python ignores it
# Comments explain what your code does

print("Hello, World!")
print("Programming is just giving instructions.")
print("Python executes them one line at a time.")`,
    language: "python",
    callout: {
      type: "tip",
      text: "Run the code above. Change the text inside the quotes and run it again. This is how you learn — by experimenting, not just reading.",
    },
    keyPoints: [
      "A program is a sequence of instructions a computer executes exactly as written",
      "Python reads and runs code from top to bottom, one line at a time",
      "If any line has an error, Python stops and tells you what went wrong",
      "Python's simple syntax lets you focus on logic rather than language rules",
      "print() is the most basic way to show output — you will use it constantly",
    ],
    tryIt: "Write a program that prints your name, your city, and one thing you want to build with Python. Use three separate print() calls.",
  },
};

const slide2 = {
  id: 2,
  moduleId: 1,
  moduleTitle: "Introduction to Programming & Python",
  title: "What Is Python?",
  type: "lesson",
  content: {
    body: `Python is a general-purpose, high-level programming language created by Guido van Rossum and first released in 1991. It has grown to become one of the most widely used languages in the world, consistently ranking in the top 3 across every major developer survey.

## What Makes Python Different

Most programming languages require you to manage a lot of technical details — declaring variable types, managing memory, writing boilerplate code just to get started. Python removes most of this friction. You can write a working program in three lines that would take thirty lines in Java or C++.

This is not because Python is a toy language. It is because Python was designed to be **expressive** — to let you say what you mean with minimal noise.

## Where Python Is Used

**Web development** — Django and FastAPI power production web services at companies like Instagram, Pinterest, and Dropbox.

**Data science and machine learning** — pandas, NumPy, scikit-learn, and TensorFlow are all Python libraries. Python is the dominant language in AI research.

**Automation and scripting** — Python is the go-to language for automating repetitive tasks, processing files, and building internal tools.

**Backend systems** — APIs, microservices, data pipelines, and server-side logic are all common Python use cases.

## Python's Core Traits

Python enforces readable code through indentation — the structure of your code is visible in how it is formatted. There are no curly braces to forget, no semicolons to miss. The language guides you toward writing code that other people can read.`,
    diagram: `flowchart TD
    A[Python Code] --> B[Python Interpreter]
    B --> C{What does it do?}
    C --> D[Web Apps\nDjango / FastAPI]
    C --> E[Data Science\npandas / NumPy]
    C --> F[Automation\nScripts / Tools]
    C --> G[Machine Learning\nTensorFlow / PyTorch]
    C --> H[APIs & Backend\nREST / Microservices]
    style A fill:#3776ab,color:#fff,stroke:#3776ab
    style B fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b`,
    diagramCaption: "Python is a single language that powers multiple industries simultaneously",
    callout: {
      type: "note",
      text: "Python is not just a beginner language. The same language you are learning today is used by Google, NASA, Netflix, and thousands of startups in production systems.",
    },
    keyPoints: [
      "Python was created in 1991 and is now one of the top 3 most used languages globally",
      "It is the dominant language for data science, machine learning, and AI",
      "Django and FastAPI are widely used Python web frameworks in production",
      "Python's readable syntax means less time fighting the language, more time solving problems",
      "The same skills apply across web, data, automation, and backend work",
    ],
  },
};

const slide4 = {
  id: 4,
  moduleId: 1,
  moduleTitle: "Introduction to Programming & Python",
  title: "How Programs Run",
  type: "lesson",
  content: {
    body: `When you run a Python file, the Python interpreter takes over. It reads your code from the very first line and works its way down, executing each instruction in sequence. This is called **sequential execution** and it is the default behaviour of every Python program.

## The Execution Model

Python does not read the whole file first and then run it. It reads and executes one line at a time. This means if line 5 has an error, lines 1 through 4 will have already run before Python stops.

## What Happens When There Is an Error

When Python encounters something it cannot execute — a typo, a missing variable, an invalid operation — it immediately stops and prints an error message. The message tells you the **type of error** and the **line number** where it occurred. This is not a failure; it is Python helping you find the problem.

## The Python Interpreter vs Compiled Languages

In languages like C or Java, your code is compiled into machine code before it runs. Python is **interpreted** — the interpreter reads and executes your source code directly. This makes Python slower than compiled languages for some tasks, but it makes development much faster because you can run code immediately without a compilation step.`,
    diagram: `flowchart TD
    A([" python script.py"]) --> B["Read line 1"]
    B --> C{"Valid syntax?"}
    C -->|Yes| D["Execute instruction"]
    C -->|No| E["SyntaxError\nStop and report line number"]
    D --> F{"More lines?"}
    F -->|Yes| G["Read next line"]
    G --> C
    F -->|No| H(["Program complete"])
    style A fill:#3776ab,color:#fff,stroke:#3776ab
    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b
    style H fill:#dcfce7,stroke:#16a34a,color:#166534`,
    diagramCaption: "Python reads and executes your code one line at a time, stopping immediately if it finds an error",
    callout: {
      type: "warning",
      text: "Python stops at the FIRST error it finds. If you have errors on lines 3 and 7, you will only see the line 3 error until you fix it. Fix errors one at a time, from top to bottom.",
    },
    keyPoints: [
      "Python executes code sequentially — top to bottom, one line at a time",
      "Execution stops immediately when an error is encountered",
      "The error message shows the type of error and the line number",
      "Lines before the error have already executed when Python stops",
      "Python is interpreted, not compiled — you can run code immediately",
    ],
    tryIt: "Write a program with 3 print() statements. Then deliberately introduce a typo on line 2 (remove a closing quote). Run it and read the error message carefully.",
  },
};

// Convert slide objects to JS source strings
function slideToSource(slide) {
  return '  ' + JSON.stringify(slide, null, 2).replace(/^/gm, '').replace(/\n/g, '\n  ').trimEnd();
}

replaceSlide(1, slideToSource(slide1));
replaceSlide(2, slideToSource(slide2));
replaceSlide(4, slideToSource(slide4));

// Fix missing commas
content = content.replace(/  \}\n\n  \{/g, '  },\n\n  {');
content = content.replace(/  \}\n  \{/g, '  },\n  {');

fs.writeFileSync('/Users/macbookpro/Desktop/ProgrammoCeuticals/school/client/src/data/slidesData.js', content, 'utf8');
console.log('Done — slides 1, 2, 4 rewritten as lesson articles');
