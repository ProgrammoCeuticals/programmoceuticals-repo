export const slidesData = [
  // =========================
  // Python Module 1: Introduction to Programming & Python
  // =========================

  {
    "id": 1,
    "moduleId": 1,
    "moduleTitle": "Introduction to Programming & Python",
    "title": "What Is Programming?",
    "type": "lesson",
    "content": {
      "body": "Programming is the act of writing precise, step-by-step instructions that a computer can execute. A computer does exactly what you tell it — nothing more, nothing less. It does not guess, it does not assume, and it does not forgive mistakes. This precision is both the challenge and the power of programming.\n\nThink of it like giving directions to someone who has never been to your city and takes every instruction completely literally. If you say \"turn left at the big tree\", they will be confused. But if you say \"at the junction, turn left\", they will do it perfectly every time.\n\n## Why Programming Matters\n\nEvery app on your phone, every website you visit, every automated email you receive — all of it is the result of someone writing instructions for a computer. Programming is the skill that lets you build things that work at scale, run without you being present, and solve problems for thousands of people at once.\n\n## What a Program Actually Is\n\nA program is a sequence of instructions stored in a file. When you run it, the computer reads each instruction from top to bottom and executes it. If an instruction fails, the program stops and reports an error. This top-to-bottom, one-at-a-time execution model is the foundation of everything you will learn.\n\n## Why Python Is a Great Starting Point\n\nPython was designed with readability as a core principle. Its creator, Guido van Rossum, wanted a language that reads almost like English. Compare printing \"Hello\" in Java versus Python:\n\n- Java: `System.out.println(\"Hello\");`\n- Python: `print(\"Hello\")`\n\nPython removes the ceremony and lets you focus on the logic. That is why it is the most popular first language in universities, bootcamps, and self-taught developer communities worldwide.",
      "code": "# Your first Python program\n# The hash symbol starts a comment — Python ignores it\n# Comments explain what your code does\n\nprint(\"Hello, World!\")\nprint(\"Programming is just giving instructions.\")\nprint(\"Python executes them one line at a time.\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Run the code above. Change the text inside the quotes and run it again. This is how you learn — by experimenting, not just reading."
      },
      "keyPoints": [
        "A program is a sequence of instructions a computer executes exactly as written",
        "Python reads and runs code from top to bottom, one line at a time",
        "If any line has an error, Python stops and tells you what went wrong",
        "Python's simple syntax lets you focus on logic rather than language rules",
        "print() is the most basic way to show output — you will use it constantly"
      ],
      "tryIt": "Write a program that prints your name, your city, and one thing you want to build with Python. Use three separate print() calls."
    }
  },

  {
    "id": 2,
    "moduleId": 1,
    "moduleTitle": "Introduction to Programming & Python",
    "title": "What Is Python?",
    "type": "lesson",
    "content": {
      "body": "Python is a general-purpose, high-level programming language created by Guido van Rossum and first released in 1991. It has grown to become one of the most widely used languages in the world, consistently ranking in the top 3 across every major developer survey.\n\n## What Makes Python Different\n\nMost programming languages require you to manage a lot of technical details — declaring variable types, managing memory, writing boilerplate code just to get started. Python removes most of this friction. You can write a working program in three lines that would take thirty lines in Java or C++.\n\nThis is not because Python is a toy language. It is because Python was designed to be **expressive** — to let you say what you mean with minimal noise.\n\n## Where Python Is Used\n\n**Web development** — Django and FastAPI power production web services at companies like Instagram, Pinterest, and Dropbox.\n\n**Data science and machine learning** — pandas, NumPy, scikit-learn, and TensorFlow are all Python libraries. Python is the dominant language in AI research.\n\n**Automation and scripting** — Python is the go-to language for automating repetitive tasks, processing files, and building internal tools.\n\n**Backend systems** — APIs, microservices, data pipelines, and server-side logic are all common Python use cases.\n\n## Python's Core Traits\n\nPython enforces readable code through indentation — the structure of your code is visible in how it is formatted. There are no curly braces to forget, no semicolons to miss. The language guides you toward writing code that other people can read.",
      "diagram": "flowchart TD\n    A[Python Code] --> B[Python Interpreter]\n    B --> C{What does it do?}\n    C --> D[Web Apps\nDjango / FastAPI]\n    C --> E[Data Science\npandas / NumPy]\n    C --> F[Automation\nScripts / Tools]\n    C --> G[Machine Learning\nTensorFlow / PyTorch]\n    C --> H[APIs & Backend\nREST / Microservices]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "Python is a single language that powers multiple industries simultaneously",
      "callout": {
        "type": "note",
        "text": "Python is not just a beginner language. The same language you are learning today is used by Google, NASA, Netflix, and thousands of startups in production systems."
      },
      "keyPoints": [
        "Python was created in 1991 and is now one of the top 3 most used languages globally",
        "It is the dominant language for data science, machine learning, and AI",
        "Django and FastAPI are widely used Python web frameworks in production",
        "Python's readable syntax means less time fighting the language, more time solving problems",
        "The same skills apply across web, data, automation, and backend work"
      ]
    }
  },

  {
    "id": 3,
    "moduleId": 1,
    "moduleTitle": "Introduction to Programming & Python",
    "title": "Why Learn Python First?",
    "type": "lesson",
    "content": {
      "body": "Choosing your first programming language matters more than most people realise. The language you start with shapes how you think about problems, how quickly you build confidence, and how soon you can build real things. Python is the best first language for most people for concrete, practical reasons.\n\n## The Syntax Is Minimal\n\nPython does not require you to declare variable types, add semicolons at the end of lines, or wrap everything in classes before you can run a single line. You can write a complete, working program in one line. This means you spend your first weeks learning to think like a programmer — not fighting syntax rules.\n\n## The Error Messages Are Helpful\n\nWhen something goes wrong in Python, the error message tells you exactly what happened and on which line. Compare this to languages like C++ where error messages can be cryptic paragraphs that require years of experience to decode.\n\n## The Community Is Enormous\n\nPython has one of the largest developer communities in the world. Whatever problem you encounter, someone has already solved it and written about it. Stack Overflow, GitHub, YouTube, and countless blogs are full of Python answers.\n\n## It Scales With You\n\nPython is not a language you outgrow. The same language you use to write your first print() statement is used to build Instagram's backend, train machine learning models at Google, and analyse genomic data at research hospitals. You will never need to \"graduate\" to a different language to do serious work.",
      "diagram": "flowchart LR\n    A[\"Beginner\nDay 1\"] --> B[\"Variables\n& Logic\"]\n    B --> C[\"Functions\n& Data\"]\n    C --> D[\"OOP &\nModules\"]\n    D --> E[\"APIs &\nDatabases\"]\n    E --> F[\"Production\nSystems\"]\n    style A fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style F fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Python grows with you — from your first print() to production systems",
      "callout": {
        "type": "tip",
        "text": "If you already know another language, Python will feel refreshingly simple. If this is your first language, you are starting in the best possible place."
      },
      "keyPoints": [
        "Python's minimal syntax lets you focus on logic, not language rules",
        "Helpful error messages make debugging faster for beginners",
        "The largest developer community means answers are always available",
        "Python scales from beginner scripts to production systems at major companies",
        "You will never need to switch languages to do serious, professional work"
      ]
    }
  },

  {
    "id": 4,
    "moduleId": 1,
    "moduleTitle": "Introduction to Programming & Python",
    "title": "How Programs Run",
    "type": "lesson",
    "content": {
      "body": "When you run a Python file, the Python interpreter takes over. It reads your code from the very first line and works its way down, executing each instruction in sequence. This is called **sequential execution** and it is the default behaviour of every Python program.\n\n## The Execution Model\n\nPython does not read the whole file first and then run it. It reads and executes one line at a time. This means if line 5 has an error, lines 1 through 4 will have already run before Python stops.\n\n## What Happens When There Is an Error\n\nWhen Python encounters something it cannot execute — a typo, a missing variable, an invalid operation — it immediately stops and prints an error message. The message tells you the **type of error** and the **line number** where it occurred. This is not a failure; it is Python helping you find the problem.\n\n## The Python Interpreter vs Compiled Languages\n\nIn languages like C or Java, your code is compiled into machine code before it runs. Python is **interpreted** — the interpreter reads and executes your source code directly. This makes Python slower than compiled languages for some tasks, but it makes development much faster because you can run code immediately without a compilation step.",
      "diagram": "flowchart TD\n    A([\" python script.py\"]) --> B[\"Read line 1\"]\n    B --> C{\"Valid syntax?\"}\n    C -->|Yes| D[\"Execute instruction\"]\n    C -->|No| E[\"SyntaxError\nStop and report line number\"]\n    D --> F{\"More lines?\"}\n    F -->|Yes| G[\"Read next line\"]\n    G --> C\n    F -->|No| H([\"Program complete\"])\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Python reads and executes your code one line at a time, stopping immediately if it finds an error",
      "callout": {
        "type": "warning",
        "text": "Python stops at the FIRST error it finds. If you have errors on lines 3 and 7, you will only see the line 3 error until you fix it. Fix errors one at a time, from top to bottom."
      },
      "keyPoints": [
        "Python executes code sequentially — top to bottom, one line at a time",
        "Execution stops immediately when an error is encountered",
        "The error message shows the type of error and the line number",
        "Lines before the error have already executed when Python stops",
        "Python is interpreted, not compiled — you can run code immediately"
      ],
      "tryIt": "Write a program with 3 print() statements. Then deliberately introduce a typo on line 2 (remove a closing quote). Run it and read the error message carefully."
    }
  },

  {
    "id": 5,
    "moduleId": 1,
    "moduleTitle": "Introduction to Programming & Python",
    "title": "Your First Python Code",
    "type": "lesson",
    "content": {
      "body": "The `print()` function is the simplest way to produce output in Python. It takes whatever you put inside the parentheses and displays it on the screen. This is how you communicate results, debug problems, and verify that your code is working.\n\n## The print() Function\n\nA **function** is a named action that Python knows how to perform. You call it by writing its name followed by parentheses. Whatever you put inside the parentheses is called an **argument** — the data you are passing to the function.\n\n`print(\"Hello\")` tells Python: run the print function, and give it the text \"Hello\" as its argument.\n\n## Strings\n\nThe text inside the quotes is called a **string** — a sequence of characters. Strings must always be wrapped in quotes. You can use single quotes or double quotes, but they must match.\n\n- `print(\"Hello\")` — valid\n- `print('Hello')` — valid\n- `print(\"Hello')` — invalid (mismatched quotes)\n\n## Running Multiple Lines\n\nPython runs each line in order. If you have three print() calls, they run one after another and each produces a line of output.",
      "code": "# print() displays output to the screen\nprint(\"Hello, Python!\")\n\n# You can print numbers too\nprint(42)\nprint(3.14)\n\n# You can print multiple values separated by commas\nprint(\"My name is\", \"Alice\")\nprint(\"The answer is\", 42)\n\n# Strings can use single or double quotes\nprint('Single quotes work too')",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The parentheses after print are not optional. `print` without parentheses does nothing useful. `print()` with empty parentheses prints a blank line."
      },
      "keyPoints": [
        "print() is a built-in function that displays output on the screen",
        "Text passed to print() must be wrapped in quotes — this is called a string",
        "You can use single or double quotes, but they must match",
        "print() can accept multiple arguments separated by commas",
        "Each print() call produces one line of output"
      ],
      "tryIt": "Write a program that prints your full name on one line, your age on the next, and your favourite programming language on the third. Run it and verify the output.",
      "diagram": "flowchart TD\n    A[\"print(\\\"Hello\\\")\"] --> B[\"Python Interpreter\"]\n    B --> C[\"Hello\"]\n    D[\"print(42)\"] --> B\n    B --> E[\"42\"]\n    F[\"print(\\\"a\\\", \\\"b\\\")\"] --> B\n    B --> G[\"a b\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "print() sends any value to the screen — strings, numbers, or multiple arguments"
    }
  },

  {
    "id": 6,
    "moduleId": 1,
    "moduleTitle": "Introduction to Programming & Python",
    "title": "Understanding Errors",
    "type": "lesson",
    "content": {
      "body": "Every programmer sees errors every single day. Errors are not a sign that you are bad at programming — they are a normal, expected part of the process. The difference between a beginner and an experienced developer is not that one avoids errors. It is that the experienced developer reads them calmly and fixes them faster.\n\n## What an Error Message Tells You\n\nWhen Python cannot execute a line of code, it stops and prints an error message. The message has three key parts:\n\n1. **The traceback** — shows the sequence of function calls that led to the error\n2. **The file and line number** — tells you exactly where the problem is\n3. **The error type and message** — tells you what went wrong\n\n## The Most Common Beginner Errors\n\n**SyntaxError** — Python cannot parse the line. Usually a missing quote, bracket, or colon.\n\n**NameError** — You used a variable that has not been defined yet.\n\n**TypeError** — You tried to do something with the wrong type of data, like adding a number to a string.\n\n**IndentationError** — Your indentation is inconsistent. Python uses indentation to define code blocks.\n\n## How to Read an Error\n\nAlways read from the bottom up. The last line is the actual error. The lines above it show you the path Python took to get there. Start by fixing the error on the last line, then re-run.",
      "code": "# This code has a deliberate error — run it and read the message\nprint(\"Hello, World!\"\nprint(\"This line never runs\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "When you see an error, resist the urge to immediately change things randomly. Read the message first. It almost always tells you exactly what is wrong."
      },
      "sections": [
        {
          "heading": "A Real Error Example",
          "body": "When you run the code above, Python will show something like:\n\n`SyntaxError: '(' was never closed`\n\nThis tells you that a parenthesis was opened but never closed. Python found the opening `(` on line 2 but never found the matching `)`. The fix is to add the closing parenthesis."
        }
      ],
      "keyPoints": [
        "Errors are normal — every professional developer encounters them daily",
        "Read error messages from the bottom up — the last line is the actual problem",
        "SyntaxError means Python cannot parse the line — check for missing quotes or brackets",
        "NameError means you used a variable before defining it",
        "TypeError means you used the wrong type of data for an operation"
      ],
      "tryIt": "Deliberately break the code: remove a closing quote from a print() statement. Run it, read the error, then fix it. Do this three times with different types of errors.",
      "diagram": "flowchart TD\n    A[\"Python runs code\"] --> B{\"Can it parse\nthe line?\"}\n    B -->|\"No\"| C[\"SyntaxError\nmissing quote/bracket\"]\n    B -->|\"Yes\"| D{\"Variable\ndefined?\"}\n    D -->|\"No\"| E[\"NameError\nundefined variable\"]\n    D -->|\"Yes\"| F{\"Correct\ntype?\"}\n    F -->|\"No\"| G[\"TypeError\nwrong type\"]\n    F -->|\"Yes\"| H[\"✅ Runs OK\"]\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style A fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Python checks syntax first, then names, then types — read errors from the bottom up"
    }
  },

  {
    "id": 7,
    "moduleId": 1,
    "moduleTitle": "Introduction to Programming & Python",
    "title": "How to Practice Python",
    "type": "lesson",
    "content": {
      "body": "Learning to program is a physical skill as much as an intellectual one. Reading about programming makes you understand it. Writing code makes you able to do it. These are different things, and only one of them leads to actual competence.\n\n## The Most Important Rule: Type Everything\n\nNever copy and paste code from examples. Type it yourself, character by character. This feels slower, but it forces you to read every character, notice every detail, and build the muscle memory that makes coding feel natural. Developers who copy-paste their way through tutorials consistently struggle when they try to write code from scratch.\n\n## Practice Daily, Not Intensively\n\nThirty minutes of daily practice builds stronger skills than a six-hour session once a week. Programming is like learning a language or a musical instrument — consistency beats intensity. Your brain consolidates what you learned while you sleep, so daily practice gives your brain more consolidation cycles.\n\n## Break Things on Purpose\n\nOnce you understand an example, change it. Remove a line and see what happens. Change a value and predict the output before running it. Add something that should not work and read the error. This deliberate experimentation is how you build deep understanding rather than surface familiarity.\n\n## Build Small Things\n\nThe fastest way to learn is to build something you actually want to exist. It does not need to be impressive. A script that prints today's date, a program that asks your name and greets you, a calculator that adds two numbers — these small projects force you to apply what you know and discover what you do not.",
      "callout": {
        "type": "tip",
        "text": "Keep a learning journal. After each session, write one sentence about what you learned and one question you still have. This forces reflection and helps you track progress."
      },
      "keyPoints": [
        "Type all code yourself — never copy-paste from examples",
        "Practice daily for 20-30 minutes rather than long sessions once a week",
        "Experiment deliberately — change examples and predict what will happen",
        "Build small projects that solve real problems you care about",
        "Reading code and writing code are different skills — you need both"
      ],
      "tryIt": "Set a timer for 25 minutes. Write a Python program from scratch that asks the user for their name and age, then prints a personalised greeting. Do not look at any examples."
    }
  },

  {
    "id": 10,
    "moduleId": 1,
    "moduleTitle": "Introduction to Programming & Python",
    "title": "Module 1 Summary",
    "type": "lesson",
    "content": {
      "body": "You have completed the introduction to Python. Before moving on, make sure you are comfortable with everything covered in this module. The concepts here are the foundation for everything that follows.\n\n## What You Learned\n\nYou now understand what programming is at a fundamental level — giving precise instructions to a computer that executes them exactly as written. You know why Python is a strong choice as a first language, how the Python interpreter executes code sequentially, and how to read and respond to error messages.\n\nYou have written your first Python programs using `print()` and you understand that strings must be wrapped in quotes.\n\n## What Is Coming Next\n\nModule 2 introduces **variables** — the mechanism for storing and reusing data in your programs. Variables are the building blocks of every program you will ever write. Once you understand variables and data types, you can start building programs that remember information and make decisions based on it.",
      "diagram": "flowchart LR\n    A[\"✅ What is\nprogramming\"] --> B[\"✅ What is\nPython\"]\n    B --> C[\"✅ How programs\nrun\"]\n    C --> D[\"✅ print() and\nstrings\"]\n    D --> E[\"✅ Reading\nerrors\"]\n    E --> F[\"➡️ Variables &\nData Types\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 1 complete — you are ready for variables and data types",
      "code": "# Module 1 review — everything you now know\n# Run this and make sure you understand every line\n\nprint(\"Hello, Python!\")          # print() displays output\nprint(\"Python runs top to bottom\") # sequential execution\nprint(42)                         # numbers work too\nprint(\"Line 1\", \"Line 2\")        # multiple arguments",
      "language": "python",
      "keyPoints": [
        "Programming is writing precise instructions that a computer executes exactly",
        "Python executes code sequentially — top to bottom, one line at a time",
        "print() displays output and accepts strings, numbers, and multiple arguments",
        "Error messages tell you the type of error and the line number — read them carefully",
        "Consistent daily practice builds skills faster than occasional long sessions"
      ],
      "callout": {
        "type": "tip",
        "text": "Before moving to Module 2, make sure you can write a print() statement from memory, explain what a SyntaxError and NameError mean, and describe what the Python interpreter does with your code. These are the foundations everything else builds on."
      },
      "tryIt": "Without looking at any examples, write a program from memory that: prints your name, prints the result of 10 * 7, and prints 'Python' repeated 3 times using the * operator. If you can do all three without help, you are ready for Module 2."
    }
  },
  // =========================
  // Python Module 2: Variables, Data Types & Input
  // =========================

  {
    "id": 11,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "What Is a Variable?",
    "type": "lesson",
    "content": {
      "body": "A variable is a named container that holds a value. When you create a variable, Python reserves a space in memory, gives it the name you chose, and stores your value there. You can then use that name anywhere in your program to access or change the value.\n\n## The Assignment Operator\n\nThe `=` sign in Python does not mean \"equals\" the way it does in mathematics. It means **assign** — put the value on the right into the container named on the left.\n\n```\nname = \"Alice\"\n```\n\nThis reads as: create a container called `name` and store the string `\"Alice\"` in it.\n\n## Variables Can Change\n\nThe word \"variable\" comes from \"vary\" — the value can change. You can assign a new value to an existing variable at any time. The old value is replaced.\n\n## Naming Rules\n\nPython has strict rules for variable names:\n- Must start with a letter or underscore, never a number\n- Can contain letters, numbers, and underscores\n- Cannot be a Python keyword like `if`, `for`, or `while`\n- Case-sensitive — `name` and `Name` are two different variables",
      "diagram": "flowchart LR\n    A[\"name = 'Alice'\"] --> B[(\"Memory\nname → 'Alice'\")]\n    C[\"age = 25\"] --> D[(\"Memory\nage → 25\")]\n    E[\"name = 'Bob'\"] --> F[(\"Memory\nname → 'Bob'\")]\n    B -.->|\"reassigned\"| F\n    style B fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style D fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style F fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Variables point to values in memory. Reassigning a variable replaces the old value.",
      "code": "# Creating variables\nname = \"Alice\"\nage = 25\ncity = \"Lagos\"\n\n# Using variables\nprint(name)\nprint(age)\nprint(city)\n\n# Reassigning — the old value is replaced\nname = \"Bob\"\nprint(name)  # Bob\n\n# Variables can be used in expressions\nnext_year = age + 1\nprint(next_year)",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Do not confuse = (assignment) with == (comparison). `name = 'Alice'` stores a value. `name == 'Alice'` checks if the value matches. Using = when you mean == is one of the most common beginner bugs."
      },
      "keyPoints": [
        "A variable is a named container that stores a value in memory",
        "The = operator assigns a value — it does not check equality",
        "Variable names are case-sensitive: name and Name are different variables",
        "You can reassign a variable at any time — the old value is replaced",
        "Variable names must start with a letter or underscore, never a number"
      ],
      "tryIt": "Create three variables: your first name, your age, and your favourite colour. Print each one. Then change your age to next year's value and print it again."
    }
  },

  {
    "id": 12,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Creating Variables in Python",
    "type": "lesson",
    "content": {
      "body": "Creating a variable in Python is simpler than in most other languages. You do not need to declare the type, use a keyword like `var` or `let`, or end the line with a semicolon. You just write the name, the `=` sign, and the value.\n\n## Dynamic Typing\n\nPython uses **dynamic typing** — it figures out the type of a variable automatically based on the value you assign. When you write `age = 25`, Python sees the number 25 and knows this is an integer. When you write `name = \"Alice\"`, Python sees the quotes and knows this is a string.\n\nThis is different from statically typed languages like Java or C++ where you must declare the type explicitly:\n\n- Java: `String name = \"Alice\";`\n- Python: `name = \"Alice\"`\n\nDynamic typing makes Python faster to write, but it also means you need to be aware of what type a variable holds at any given moment.\n\n## Multiple Assignment\n\nPython lets you assign multiple variables on a single line, and also assign the same value to multiple variables at once. These are useful shortcuts but use them only when they improve readability.\n\n## Good Naming Habits\n\nThe name you choose for a variable should describe what it contains. A variable named `x` tells the reader nothing. A variable named `user_age` is immediately clear. Python's official style guide (PEP 8) recommends `snake_case` for variable names — all lowercase with underscores between words.",
      "code": "# Basic variable creation\nname = \"Alice\"\nage = 25\nis_student = True\nprice = 9.99\n\n# Python figures out the type automatically\nprint(type(name))      # <class 'str'>\nprint(type(age))       # <class 'int'>\nprint(type(price))     # <class 'float'>\nprint(type(is_student)) # <class 'bool'>\n\n# Multiple assignment on one line\nx, y, z = 1, 2, 3\nprint(x, y, z)\n\n# Assign the same value to multiple variables\na = b = c = 0\nprint(a, b, c)",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use `type()` whenever you are unsure what type a variable holds. It is one of the most useful debugging tools for beginners."
      },
      "keyPoints": [
        "Python variables are created with a simple name = value assignment — no type declaration needed",
        "Dynamic typing means Python determines the type from the value automatically",
        "Use snake_case for variable names — all lowercase with underscores between words",
        "type() returns the data type of any variable or value",
        "Multiple variables can be assigned on one line: x, y, z = 1, 2, 3"
      ],
      "tryIt": "Create five variables: your name (string), age (int), height in metres (float), whether you are a student (bool), and your city (string). Print each one along with its type using type().",
      "diagram": "flowchart LR\n    A[\"name = \\\"Alice\\\"\"] --> B[\"Memory\"]\n    C[\"age = 25\"] --> B\n    D[\"price = 9.99\"] --> B\n    E[\"is_student = True\"] --> B\n    B --> F[\"name → str\"]\n    B --> G[\"age → int\"]\n    B --> H[\"price → float\"]\n    B --> I[\"is_student → bool\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Python infers the type from the value — no type declaration needed"
    }
  },

  {
    "id": 13,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Naming Conventions",
    "type": "lesson",
    "content": {
      "body": "How you name your variables is as important as what they store. A well-named variable makes code self-documenting — a reader can understand what it holds without needing a comment. A poorly named variable forces everyone (including future you) to trace through the code to figure out what it means.\n\nDifferent programming languages and communities have adopted different naming styles. Understanding all of them makes you able to read code from any language and write Python the correct way.\n\n## snake_case — The Python Standard\n\nAll lowercase letters with underscores between words. This is the official Python style defined in PEP 8 — Python's style guide. Use it for **variables**, **functions**, and **module names**.\n\n```python\nuser_name = \"Alice\"\ntotal_price = 99.99\nis_logged_in = True\nmax_retry_count = 3\n```\n\nThe underscore acts as a space, making multi-word names readable without ambiguity.\n\n## PascalCase — For Classes Only\n\nEach word starts with a capital letter, no separators. Also called UpperCamelCase. In Python, this is used **exclusively for class names**.\n\n```python\nclass UserAccount:\nclass BankTransaction:\nclass HttpRequestHandler:\n```\n\n## camelCase — JavaScript and Java\n\nThe first word is lowercase, each subsequent word starts with a capital. This is the standard for variables and functions in JavaScript, Java, and many other languages. You will see it constantly when working with APIs and JSON data. **Do not use it for Python variables.**\n\n```javascript\n// JavaScript\nconst userName = \"Alice\";\nconst totalPrice = 99.99;\n```\n\n## SCREAMING_SNAKE_CASE — Constants\n\nAll uppercase with underscores. Used in Python and most languages for **constants** — values that are set once and never changed.\n\n```python\nMAX_CONNECTIONS = 100\nAPI_BASE_URL = \"https://api.example.com\"\nDEFAULT_TIMEOUT = 30\n```\n\n## _leading_underscore — Private or Internal\n\nA single leading underscore signals that a variable or method is intended for internal use only. It is a convention, not enforced by Python, but respected by all developers.\n\n```python\n_internal_cache = {}\nself._password_hash = hash(password)\n```\n\n## What to Avoid\n\nBad names are one of the most common sources of confusion in codebases. Avoid:\n- Single letters like `x`, `d`, `n` (except loop counters `i`, `j`)\n- Abbreviations like `usrNm`, `ttlPrc`\n- Numbered names like `data1`, `data2`\n- Misleading names like `temp` for something permanent",
      "diagram": "flowchart TD\n    A[\"Naming Conventions\"] --> B[\"snake_case\nuser_name, total_price\"]\n    A --> C[\"PascalCase\nUserAccount, BankTransaction\"]\n    A --> D[\"camelCase\nuserName, totalPrice\"]\n    A --> E[\"SCREAMING_SNAKE_CASE\nMAX_CONNECTIONS, API_URL\"]\n    A --> F[\"_leading_underscore\n_cache, _password_hash\"]\n    B --> G[\"Python variables\nfunctions, modules\"]\n    C --> H[\"Python classes\nonly\"]\n    D --> I[\"JavaScript, Java\nnot Python variables\"]\n    E --> J[\"Constants\nall languages\"]\n    F --> K[\"Private/internal\nPython convention\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style C fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style D fill:#e2e8f0,color:#1a1a2e,stroke:#94a3b8\n    style E fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style F fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "Each naming convention has a specific purpose — use the right one for the right context",
      "code": "# snake_case — Python variables and functions\nuser_name = \"Alice\"\ntotal_price = 49.99\nis_active = True\nmax_login_attempts = 3\n\n# SCREAMING_SNAKE_CASE — constants\nMAX_CONNECTIONS = 100\nDEFAULT_TIMEOUT = 30\nAPI_VERSION = \"v2\"\n\n# PascalCase — class names (covered in Module 14)\n# class UserAccount:\n# class BankTransaction:\n\n# _leading_underscore — internal/private\n_cache = {}\n_helper_value = 42\n\n# What NOT to do\nx = \"Alice\"           # What is x?\nd = {}                # What is d?\nusrNm = \"Alice\"       # Abbreviation — hard to read\ndata2 = []            # Numbered — what is data1?\n\n# What TO do instead\ncurrent_user = \"Alice\"\nuser_registry = {}\nuser_name = \"Alice\"\npending_items = []",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "When you see camelCase keys in JSON data from an API (like `firstName`, `totalAmount`), convert them to snake_case when storing in Python variables (`first_name`, `total_amount`). This keeps your Python code consistent with PEP 8 even when the data source uses a different convention."
      },
      "keyPoints": [
        "snake_case is the Python standard for variables, functions, and modules",
        "PascalCase is used exclusively for class names in Python",
        "camelCase is for JavaScript and Java — do not use it for Python variables",
        "SCREAMING_SNAKE_CASE signals a constant — a value that should never change",
        "A leading underscore signals internal/private use — respected by convention"
      ],
      "tryIt": "Rewrite these poorly named variables using the correct Python convention: `usrAge = 25`, `FIRST_NAME = 'Alice'`, `totalCost = 99.99`, `MaxRetries = 3`, `d = {}`. What convention should each one use and why?"
    }
  },

  {
    "id": 14,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Basic Data Types",
    "type": "lesson",
    "content": {
      "body": "Every value in Python has a **type**. The type determines what operations you can perform on it, how it is stored in memory, and how Python interprets it. Understanding types is not optional — type mismatches are one of the most common sources of bugs in Python programs.\n\n## The Four Core Types\n\n**int** (integer) — whole numbers, positive or negative, with no decimal point. Used for counting, indexing, and any situation where fractions do not make sense. `age = 25`, `score = 100`, `year = 2025`.\n\n**float** (floating point) — numbers with a decimal point. Used for measurements, prices, percentages, and any value that can be fractional. `price = 9.99`, `height = 1.75`, `pi = 3.14159`.\n\n**str** (string) — text. Any sequence of characters wrapped in single or double quotes. `name = \"Alice\"`, `city = 'Lagos'`, `message = \"Hello, World!\"`.\n\n**bool** (boolean) — either `True` or `False`. Used for conditions, flags, and any yes/no decision. Note the capital letters — `true` and `false` (lowercase) are not valid Python booleans.\n\n## Why Types Matter\n\nPython will not let you mix incompatible types without explicit conversion. You cannot add a string and a number directly. You cannot compare a boolean and a string meaningfully. Knowing the type of your data prevents entire categories of bugs.",
      "diagram": "flowchart TD\n    A[\"Python Values\"] --> B[\"int\n42, -7, 0\"]\n    A --> C[\"float\n3.14, -0.5, 9.99\"]\n    A --> D[\"str\n'hello', 'Lagos'\"]\n    A --> E[\"bool\nTrue, False\"]\n    B --> F[\"Counting\nIndexing\nMath\"]\n    C --> G[\"Measurements\nPrices\nScientific\"]\n    D --> H[\"Text\nNames\nMessages\"]\n    E --> I[\"Conditions\nFlags\nDecisions\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style C fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style D fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style E fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "The four core Python types and their typical use cases",
      "code": "# The four core data types\nage = 25          # int\nprice = 9.99      # float\nname = \"Alice\"    # str\nis_active = True  # bool\n\n# Check the type of any value\nprint(type(age))       # <class 'int'>\nprint(type(price))     # <class 'float'>\nprint(type(name))      # <class 'str'>\nprint(type(is_active)) # <class 'bool'>\n\n# Types affect what operations work\nprint(age + 5)         # 30 — int math works\nprint(price * 2)       # 19.98 — float math works\nprint(name + \"!\")      # Alice! — string concatenation works\nprint(not is_active)   # False — boolean negation works",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Boolean values in Python are `True` and `False` with capital first letters. Writing `true` or `false` in lowercase will cause a NameError — Python will think you are referring to a variable that does not exist."
      },
      "keyPoints": [
        "Every Python value has a type: int, float, str, or bool are the four core types",
        "int is for whole numbers, float is for decimals, str is for text, bool is for True/False",
        "type() returns the type of any value — use it when you are unsure",
        "Python will not automatically mix incompatible types — you must convert explicitly",
        "True and False must be capitalised — lowercase true and false are not valid"
      ],
      "tryIt": "Create one variable of each type. Print each variable and its type. Then try adding an int and a float together — what type is the result?"
    }
  },

  {
    "id": 15,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Numbers in Python",
    "type": "lesson",
    "content": {
      "body": "Python handles numbers naturally and intuitively. You can perform all standard arithmetic operations, and Python follows the same order of operations you learned in mathematics — multiplication and division before addition and subtraction, with parentheses overriding everything.\n\n## Integers vs Floats\n\nThe key difference between `int` and `float` is the decimal point. `10` is an int. `10.0` is a float. When you mix them in an operation, Python automatically promotes the result to a float to avoid losing precision.\n\n## Integer Division\n\nPython has two division operators:\n- `/` always returns a float, even if the result is a whole number\n- `//` (floor division) returns an integer, rounding down to the nearest whole number\n\n## The Modulus Operator\n\nThe `%` operator returns the **remainder** after division. This is more useful than it sounds — it is the standard way to check if a number is even or odd, to wrap values around a range, and to implement cyclic behaviour.\n\n## Large Numbers\n\nPython integers have no size limit. You can work with numbers as large as your computer's memory allows. This is different from languages like C where integers overflow at a fixed size.",
      "code": "# Basic arithmetic\nprint(10 + 3)   # 13\nprint(10 - 3)   # 7\nprint(10 * 3)   # 30\nprint(10 / 3)   # 3.3333... (always float)\nprint(10 // 3)  # 3 (floor division — drops remainder)\nprint(10 % 3)   # 1 (remainder)\nprint(2 ** 10)  # 1024 (exponentiation)\n\n# Mixing int and float\nprint(10 + 3.0)  # 13.0 — result is float\n\n# Checking even or odd with modulus\nnumber = 42\nif number % 2 == 0:\n    print(f\"{number} is even\")\nelse:\n    print(f\"{number} is odd\")\n\n# Large numbers work fine\nprint(2 ** 100)",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The `/` operator always returns a float in Python 3. `10 / 2` gives `5.0`, not `5`. If you need an integer result, use `//` instead."
      },
      "keyPoints": [
        "Python supports +, -, *, /, //, %, and ** (exponentiation) for numbers",
        "/ always returns a float — use // for integer (floor) division",
        "% returns the remainder — use it to check even/odd or wrap values",
        "Mixing int and float in an operation always produces a float",
        "Python integers have no size limit — they grow as large as needed"
      ],
      "tryIt": "Calculate the number of minutes in a year. Then use floor division and modulus to find how many full weeks are in 100 days and how many days are left over.",
      "diagram": "flowchart TD\n    A[\"Number Operators\"] --> B[\"+ - * **\nBasic arithmetic\"]\n    A --> C[\"/ Division\nalways float\"]\n    A --> D[\"// Floor division\ndrops remainder\"]\n    A --> E[\"% Modulus\nremainder only\"]\n    C --> F[\"10 / 2 → 5.0\"]\n    D --> G[\"10 // 3 → 3\"]\n    E --> H[\"10 % 3 → 1\"]\n    H --> I[\"Even/odd check\nn % 2 == 0\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "/ always returns float; // and % work together — quotient and remainder"
    }
  },

  {
    "id": 16,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Strings in Python",
    "type": "lesson",
    "content": {
      "body": "A string is a sequence of characters. In Python, strings are one of the most versatile and frequently used data types. You will use them for names, messages, file paths, API responses, user input, and almost everything that involves text.\n\n## Creating Strings\n\nStrings can be wrapped in single quotes, double quotes, or triple quotes. Single and double quotes are interchangeable — use whichever makes your code more readable. Triple quotes (```\"\"\"...\"\"\"```) allow strings to span multiple lines.\n\n## String Concatenation\n\nYou can join strings together using the `+` operator. This is called concatenation. However, for anything more complex than joining two strings, f-strings are cleaner and more readable.\n\n## f-Strings — The Modern Way\n\nf-strings (formatted string literals) let you embed variables and expressions directly inside a string. Prefix the string with `f` and put variable names inside curly braces `{}`. This is the preferred way to build strings in modern Python.\n\n## Strings Are Immutable\n\nOnce a string is created, it cannot be changed. Operations that appear to modify a string actually create a new string. This is important to understand when you start working with string methods.",
      "code": "# Creating strings\nname = \"Alice\"\ncity = 'Lagos'\nmessage = \"\"\"This string\nspans multiple lines.\"\"\"\n\n# Concatenation (joining strings)\ngreeting = \"Hello, \" + name\nprint(greeting)\n\n# f-strings — the modern, preferred way\nage = 30\nprint(f\"My name is {name} and I am {age} years old.\")\nprint(f\"Next year I will be {age + 1}.\")\n\n# String length\nprint(len(name))   # 5\n\n# Accessing characters by index\nprint(name[0])     # A (first character)\nprint(name[-1])    # e (last character)\n\n# Strings are immutable — this creates a new string\nupper_name = name.upper()\nprint(upper_name)  # ALICE\nprint(name)        # Alice — unchanged",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Always prefer f-strings over concatenation with `+`. `f'Hello, {name}'` is cleaner, faster, and handles non-string types automatically. Concatenation with `+` requires all values to already be strings."
      },
      "keyPoints": [
        "Strings are sequences of characters wrapped in single, double, or triple quotes",
        "f-strings embed variables directly: f'Hello, {name}' is the modern standard",
        "len() returns the number of characters in a string",
        "Strings are indexed from 0 — name[0] is the first character, name[-1] is the last",
        "Strings are immutable — operations create new strings, they do not modify the original"
      ],
      "tryIt": "Create variables for your first name, last name, and birth year. Use an f-string to print a sentence like: 'My name is Alice Smith and I was born in 1995.' Then print the length of your full name."
    }
  },

  {
    "id": 20,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Booleans Explained",
    "type": "lesson",
    "content": {
      "body": "A boolean is the simplest possible data type — it can only be one of two values: `True` or `False`. Despite their simplicity, booleans are the foundation of all decision-making in programming. Every `if` statement, every loop condition, every filter — all of them ultimately depend on a boolean value.\n\n## Where Booleans Come From\n\nBooleans are produced by **comparison expressions**. When you write `age >= 18`, Python evaluates it and produces either `True` or `False`. You can store this result in a variable, use it directly in an `if` statement, or combine it with other booleans using logical operators.\n\n## Truthy and Falsy Values\n\nPython has a concept called **truthiness** — almost any value can be used where a boolean is expected. Python treats certain values as `False` (called **falsy**): `0`, `0.0`, `\"\"` (empty string), `[]` (empty list), `{}` (empty dict), and `None`. Everything else is treated as `True` (called **truthy**).\n\nThis means you can write `if name:` instead of `if name != \"\":` — they mean the same thing.\n\n## Logical Operators\n\nThree operators combine or modify booleans:\n- `and` — both conditions must be True\n- `or` — at least one condition must be True\n- `not` — flips True to False and vice versa",
      "diagram": "flowchart TD\n    A[\"Expression\nage >= 18\"] --> B{\"Evaluate\"}\n    B -->|\"True\"| C[\"Execute\nif block\"]\n    B -->|\"False\"| D[\"Skip\nif block\"]\n    E[\"and\"] --> F[\"Both must be True\"]\n    G[\"or\"] --> H[\"At least one True\"]\n    I[\"not\"] --> J[\"Flip the result\"]\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "Boolean expressions evaluate to True or False and control which code runs",
      "code": "# Boolean values\nis_adult = True\nis_banned = False\n\n# Comparison expressions produce booleans\nage = 20\nprint(age >= 18)    # True\nprint(age == 21)    # False\nprint(age != 21)    # True\n\n# Logical operators\nprint(age >= 18 and not is_banned)  # True\nprint(age < 18 or is_adult)         # True\n\n# Truthy and falsy\nprint(bool(0))      # False\nprint(bool(\"\"))     # False\nprint(bool([]))     # False\nprint(bool(42))     # True\nprint(bool(\"hi\"))   # True\n\n# Using truthiness in conditions\nname = \"Alice\"\nif name:\n    print(f\"Hello, {name}\")  # runs because name is truthy",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Do not write `if is_active == True:` — write `if is_active:` instead. The `== True` comparison is redundant and considered poor style in Python."
      },
      "keyPoints": [
        "Booleans have exactly two values: True and False (capitalised)",
        "Comparison operators (==, !=, >, <, >=, <=) produce boolean results",
        "and requires both conditions to be True; or requires at least one",
        "not flips a boolean: not True is False, not False is True",
        "Falsy values: 0, 0.0, empty string, empty list, empty dict, None"
      ],
      "tryIt": "Write expressions that check: whether a number is between 1 and 100 (inclusive), whether a string is not empty, and whether a user is an adult AND not banned. Print the result of each."
    }
  },

  {
    "id": 21,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Getting User Input",
    "type": "lesson",
    "content": {
      "body": "Programs that only produce fixed output are limited. Real programs interact with users — they ask questions, receive answers, and respond accordingly. The `input()` function is how Python collects data from the person running the program.\n\n## How input() Works\n\nWhen Python reaches an `input()` call, it pauses execution, displays the prompt text you provide, and waits. The user types something and presses Enter. Python then resumes, and the value the user typed is returned as a string and stored in your variable.\n\nThe prompt is optional but always include it — a program that just freezes waiting for input with no explanation is confusing.\n\n## The Most Important Rule About input()\n\n**input() always returns a string.** No matter what the user types — a number, a date, a single letter — Python gives it back to you as a string. If you need a number, you must convert it explicitly using `int()` or `float()`.\n\nThis is the source of one of the most common beginner bugs: trying to do arithmetic with input without converting it first.\n\n## Building Interactive Programs\n\nCombining `input()` with variables and `print()` lets you build programs that feel alive — they respond to the specific person running them rather than always doing the same thing.",
      "diagram": "flowchart LR\n    A([\"User types\n'Alice'\"]) --> B[\"input('Enter name: ')\"]\n    B --> C[\"Returns string\n'Alice'\"]\n    C --> D[\"name = 'Alice'\"]\n    D --> E[\"print(f'Hello, {name}')\"]\n    E --> F([\"Output:\nHello, Alice\"])\n    style A fill:#f0f4f8,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "input() pauses the program, collects the user's text, and returns it as a string",
      "code": "# Basic input\nname = input(\"Enter your name: \")\nprint(f\"Hello, {name}!\")\n\n# input() always returns a string\nage_str = input(\"Enter your age: \")\nprint(type(age_str))   # <class 'str'>\n\n# Convert to int before doing math\nage = int(age_str)\nprint(f\"Next year you will be {age + 1}\")\n\n# You can do it in one line\nscore = float(input(\"Enter your score: \"))\nprint(f\"Your score is {score}\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "input() always returns a string. If you try to add a number to the result of input() without converting it first, Python will raise a TypeError. Always convert with int() or float() when you expect a number."
      },
      "keyPoints": [
        "input() pauses the program and waits for the user to type something and press Enter",
        "Always include a prompt string so the user knows what to type",
        "input() always returns a string — regardless of what the user typed",
        "Use int() to convert to an integer, float() to convert to a decimal",
        "Combining input() with variables lets you build interactive programs"
      ],
      "tryIt": "Write a program that asks for the user's name and birth year, then calculates and prints their age. Remember to convert the birth year from string to int before doing the calculation."
    }
  },

  {
    "id": 22,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Type Conversion",
    "type": "lesson",
    "content": {
      "body": "Type conversion is the process of changing a value from one type to another. In Python, this happens constantly — user input arrives as strings, numbers need to become text for display, and booleans need to be derived from other values. Knowing how and when to convert types is an essential everyday skill.\n\n## Why Conversion Is Necessary\n\nPython does not automatically convert between types when it would change the meaning of your data. If you have the string `\"25\"` and want to add 5 to it, Python will not guess that you meant the number 25. You must tell it explicitly.\n\nThe most common situation is user input — `input()` always returns a string, so any numeric input must be converted before you can do arithmetic with it.\n\n## The Four Conversion Functions\n\n**int(value)** — converts to a whole number. Works on floats (truncates the decimal) and numeric strings. Fails on non-numeric strings.\n\n**float(value)** — converts to a decimal number. Works on integers and numeric strings. Fails on non-numeric strings.\n\n**str(value)** — converts anything to its string representation. Always works — every Python value has a string form.\n\n**bool(value)** — converts to True or False using Python's truthiness rules. Zero, empty strings, empty collections, and None become False. Everything else becomes True.\n\n## When Conversion Fails\n\nIf you try to convert a string that does not represent a valid number, Python raises a `ValueError`. For example, `int(\"hello\")` will crash. Later in the course you will learn to handle this gracefully with `try/except`.",
      "diagram": "flowchart TD\n    A[\"str '25'\"] -->|\"int('25')\"| B[\"int 25\"]\n    A -->|\"float('25')\"| C[\"float 25.0\"]\n    B -->|\"str(25)\"| A\n    B -->|\"float(25)\"| C\n    C -->|\"int(25.9)\"| D[\"int 25\ntruncated\"]\n    E[\"Any value\"] -->|\"bool(value)\"| F{\"Truthy?\"}\n    F -->|\"Yes\"| G[\"True\"]\n    F -->|\"No\"| H[\"False\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style C fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Type conversion paths — str, int, float, and bool can all be converted between each other",
      "code": "# int() — convert to integer\nprint(int(\"25\"))      # 25\nprint(int(9.99))      # 9 (truncates, does not round)\nprint(int(True))      # 1\nprint(int(False))     # 0\n\n# float() — convert to decimal\nprint(float(\"3.14\"))  # 3.14\nprint(float(10))      # 10.0\n\n# str() — convert to string\nprint(str(42))        # \"42\"\nprint(str(3.14))      # \"3.14\"\nprint(str(True))      # \"True\"\n\n# bool() — convert to boolean\nprint(bool(0))        # False\nprint(bool(\"\"))       # False\nprint(bool(42))       # True\nprint(bool(\"hello\"))  # True\n\n# Real-world example: converting user input\nage = int(input(\"Enter your age: \"))\nprint(f\"In 10 years you will be {age + 10}\")",
      "language": "python",
      "callouts": [
        {
          "type": "warning",
          "text": "int() truncates floats — it does not round. int(9.99) gives 9, not 10. If you need rounding, use round(9.99) which gives 10."
        },
        {
          "type": "note",
          "text": "int('hello') raises a ValueError because 'hello' cannot be interpreted as a number. You will learn to handle this safely with try/except in Module 11."
        }
      ],
      "keyPoints": [
        "int() converts to a whole number — truncates floats, fails on non-numeric strings",
        "float() converts to a decimal — works on integers and numeric strings",
        "str() converts anything to its string form — always succeeds",
        "bool() converts using truthiness rules — 0, empty string, None become False",
        "Converting an invalid string to a number raises ValueError"
      ],
      "tryIt": "Ask the user for a price and a quantity. Convert both to the appropriate types, calculate the total cost, and print it formatted to 2 decimal places using an f-string like f'{total:.2f}'.",
      "callout": {
        "type": "warning",
        "text": "int() truncates floats — it does not round. int(9.99) gives 9, not 10. Use round(9.99) to get 10. Also, int('hello') raises a ValueError — always validate string input with isdigit() or use try/except before converting."
      }
    }
  },

  {
    "id": 25,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Every beginner makes the same mistakes. This is not a sign of weakness — it is a predictable part of learning. The goal of this lesson is to show you these mistakes before you make them, so when you do encounter them, you recognise them immediately and fix them in seconds rather than spending an hour confused.\n\n## Mistake 1 — Using a Variable Before Assigning It\n\nPython cannot use a variable that has not been given a value yet. Trying to do so raises a `NameError`.\n\n## Mistake 2 — Forgetting to Convert input()\n\n`input()` always returns a string. Doing arithmetic on it without converting first raises a `TypeError`.\n\n## Mistake 3 — Mixing Strings and Numbers with +\n\nThe `+` operator means addition for numbers and concatenation for strings. Mixing the two raises a `TypeError`. Use an f-string instead.\n\n## Mistake 4 — Using = Instead of ==\n\n`=` assigns a value. `==` compares two values. Using `=` inside a condition is a syntax error in Python (unlike some other languages where it silently does the wrong thing).\n\n## Mistake 5 — Unclear Variable Names\n\nA variable named `x` or `d` tells the reader nothing. This does not cause an error, but it makes your code impossible to understand and maintain.\n\n## Mistake 6 — Assuming int() Rounds\n\n`int()` truncates — it drops the decimal part entirely. `int(9.99)` gives `9`, not `10`. Use `round()` when you need rounding.",
      "code": "# Mistake 1 — NameError: using before assigning\n# print(score)  # NameError: name 'score' is not defined\nscore = 0\nprint(score)    # Fix: assign before use\n\n# Mistake 2 — TypeError: arithmetic on string input\nage_str = input(\"Enter age: \")\n# print(age_str + 1)  # TypeError!\nage = int(age_str)\nprint(age + 1)        # Fix: convert first\n\n# Mistake 3 — TypeError: mixing str and int with +\nname = \"Alice\"\nage = 30\n# print(\"Age: \" + age)   # TypeError!\nprint(f\"Age: {age}\")     # Fix: use f-string\n\n# Mistake 4 — = vs ==\nx = 10\nif x == 10:             # Correct: comparison\n    print(\"x is 10\")\n\n# Mistake 5 — unclear names\n# d = 86400  # What is d?\nseconds_per_day = 86400  # Fix: descriptive name\n\n# Mistake 6 — int() truncates, does not round\nprint(int(9.99))    # 9 — not what you might expect\nprint(round(9.99))  # 10 — use round() instead",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "When you get an error you do not understand, read the last line of the error message first. It names the error type (NameError, TypeError, ValueError) and describes exactly what went wrong. The error type alone usually tells you which of these six mistakes you made."
      },
      "keyPoints": [
        "NameError — you used a variable before assigning it a value",
        "TypeError from input() — you forgot to convert the string to int or float",
        "TypeError from + — you tried to concatenate a string and a number; use f-strings",
        "= assigns a value; == compares two values — never confuse them",
        "int() truncates decimals — use round() when you need proper rounding"
      ],
      "tryIt": "Deliberately trigger each of the six mistakes above one at a time. Read the error message for each, then fix it. This builds the muscle memory to recognise and fix errors quickly."
    }
  },

  {
    "id": 26,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Module 2 Summary",
    "type": "lesson",
    "content": {
      "body": "You have completed Module 2. You now have the fundamental building blocks that every Python program is made of — variables to store data, types to understand what kind of data you have, and input to collect data from users.\n\n## What You Learned\n\n**Variables** are named containers in memory. You create them with `=`, read them by name, and can reassign them at any time. Names should be descriptive and follow `snake_case` convention.\n\n**Data types** determine what operations are valid on a value. The four core types are `int` (whole numbers), `float` (decimals), `str` (text), and `bool` (True/False). Use `type()` to check the type of any value.\n\n**Type conversion** lets you move between types explicitly. `int()`, `float()`, `str()`, and `bool()` are the four conversion functions. Remember that `input()` always returns a string and must be converted before arithmetic.\n\n**f-strings** are the modern way to embed variables in text. `f\"Hello, {name}\"` is cleaner and more powerful than concatenation with `+`.\n\n## What Is Coming Next\n\nModule 3 introduces **operators and expressions** — the tools that let you compute new values, compare data, and combine conditions. With operators, your programs stop being static sequences of assignments and start making decisions based on data.",
      "diagram": "flowchart LR\n    A[\"✅ Variables\n& Assignment\"] --> B[\"✅ Data Types\nint float str bool\"]\n    B --> C[\"✅ Type\nConversion\"]\n    C --> D[\"✅ User\nInput\"]\n    D --> E[\"✅ f-Strings\"]\n    E --> F[\"➡️ Operators &\nExpressions\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 2 complete — you are ready for operators and expressions",
      "code": "# Module 2 in one program — everything you now know\n\n# Variables and types\nname = input(\"What is your name? \")\nbirth_year = int(input(\"What year were you born? \"))\nheight = float(input(\"Your height in metres? \"))\n\n# Calculations\ncurrent_year = 2025\nage = current_year - birth_year\n\n# f-strings for output\nprint(f\"Hello, {name}!\")\nprint(f\"You are approximately {age} years old.\")\nprint(f\"Your height is {height}m.\")\nprint(f\"Are you an adult? {age >= 18}\")\n\n# Type checking\nprint(f\"name is a {type(name).__name__}\")\nprint(f\"age is a {type(age).__name__}\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Before moving on, make sure you can write the program above from memory without looking at any examples. If you can do that, you genuinely understand Module 2."
      },
      "keyPoints": [
        "Variables store values in memory — use descriptive snake_case names",
        "The four core types are int, float, str, and bool",
        "input() always returns a string — convert with int() or float() for arithmetic",
        "f-strings are the preferred way to embed variables in text",
        "type() tells you the type of any value — use it when debugging"
      ],
      "tryIt": "Without looking at any examples, write a program from memory that: asks for a name and birth year, calculates their age, and prints a summary using an f-string. If you can do that without help, you are ready for Module 3."
    }
  },
  {
    "id": 19,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "Checking String Content",
    "type": "lesson",
    "content": {
      "body": "Python provides a set of string methods that return `True` or `False` based on what the string contains. These are invaluable for validating user input — checking that an age field contains only digits, that a name contains only letters, or that an email address has the right format.\n\n## The is* Methods\n\nThese methods check the composition of the entire string:\n\n- **isdigit()** — `True` if every character is a digit (0–9)\n- **isalpha()** — `True` if every character is a letter\n- **isalnum()** — `True` if every character is a letter or digit (no spaces or symbols)\n- **isspace()** — `True` if the string contains only whitespace\n- **isupper()** — `True` if all letters are uppercase\n- **islower()** — `True` if all letters are lowercase\n\nAll of these return `False` on an empty string.\n\n## Membership and Position Checks\n\nThe `in` operator checks whether a substring exists anywhere in a string. It is the most readable way to search for content.\n\n**startswith(prefix)** and **endswith(suffix)** check the beginning and end of a string. Both accept a tuple of options, so you can check multiple possibilities at once.\n\n## Combining Checks for Validation\n\nReal validation usually combines multiple checks. A valid username might need to be alphanumeric, between 3 and 20 characters, and not start with a digit. You build this by combining `isalnum()`, `len()`, and `isdigit()` on the first character.",
      "code": "# is* methods\nprint(\"12345\".isdigit())    # True\nprint(\"hello\".isalpha())    # True\nprint(\"hello123\".isalnum()) # True\nprint(\"   \".isspace())      # True\n\n# in operator\nemail = \"alice@example.com\"\nprint(\"@\" in email)         # True\nprint(\".com\" in email)      # True\n\n# startswith and endswith\nfilename = \"report_2025.pdf\"\nprint(filename.endswith(\".pdf\"))          # True\nprint(filename.startswith(\"report\"))      # True\nprint(filename.endswith((\".pdf\", \".docx\")))  # True\n\n# Validation example\ndef validate_username(username):\n    if len(username) < 3 or len(username) > 20:\n        return \"Must be 3-20 characters\"\n    if not username.isalnum():\n        return \"Letters and digits only\"\n    if username[0].isdigit():\n        return \"Cannot start with a digit\"\n    return \"Valid\"\n\nprint(validate_username(\"alice123\"))   # Valid\nprint(validate_username(\"1alice\"))     # Cannot start with digit",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "isdigit() is the right way to check if a string can safely be converted to int. Check  before calling int() — if True, the conversion is safe and will not raise a ValueError."
      },
      "keyPoints": [
        "isdigit() returns True if every character is a digit — use it before converting to int",
        "isalpha() checks for letters only; isalnum() checks for letters and digits",
        "The in operator checks if a substring exists anywhere in a string",
        "startswith() and endswith() accept a tuple to check multiple options at once",
        "Combine multiple checks to build robust input validation"
      ],
      "tryIt": "Write a function that validates a password. It should be at least 8 characters, contain at least one digit, and not be all lowercase. Return a specific message for each failure.",
      "diagram": "flowchart TD\n    A[\"String checks\"] --> B[\"isdigit()\n'123' → True\"]\n    A --> C[\"isalpha()\n'abc' → True\"]\n    A --> D[\"isalnum()\n'abc123' → True\"]\n    A --> E[\"in operator\n'@' in email\"]\n    A --> F[\"startswith()\nendswith()\"]\n    B --> G[\"Safe to\nint() convert\"]\n    E --> H[\"Substring\nsearch\"]\n    F --> I[\"Prefix/suffix\nvalidation\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "is* methods check the entire string; in and startswith/endswith check parts of it"
    }
  },

  // =========================
  // Python Module 3: Operators & Expressions
  // =========================

  {
    "id": 28,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Arithmetic Operators",
    "type": "lesson",
    "content": {
      "body": "Arithmetic operators perform mathematical calculations on numbers. Python supports all the standard operations you learned in school, plus a few that are specific to programming and extremely useful in practice.\n\n## The Seven Arithmetic Operators\n\n**Addition (+)** adds two values. Works on integers and floats. Also works on strings — adding two strings joins them together.\n\n**Subtraction (-)** finds the difference between two values. Can produce negative results.\n\n**Multiplication (*)** multiplies two values. Also works on strings — `\"ha\" * 3` produces `\"hahaha\"`.\n\n**Division (/)** divides two values and **always returns a float**, even if the result is a whole number. `10 / 2` gives `5.0`, not `5`.\n\n**Floor Division (//)** divides and rounds down to the nearest whole number. `10 // 3` gives `3` because 3.33 rounds down to 3.\n\n**Modulus (%)** returns the **remainder** after division. `10 % 3` gives `1` because 10 divided by 3 is 3 with a remainder of 1. This is the standard way to check if a number is even or odd.\n\n**Exponentiation (**)** raises a number to a power. `2 ** 10` gives `1024`. Python integers have no size limit, so very large powers work without overflow.\n\n## Integer vs Float Results\n\nWhen you mix an integer and a float in any arithmetic operation, Python always returns a float. `10 + 3.0` gives `13.0`. This is called **type promotion** — Python promotes the result to the more precise type to avoid losing information.",
      "diagram": "flowchart TD\n    A[\"Arithmetic Operators\"] --> B[\"+ Addition\n3 + 2 = 5\"]\n    A --> C[\"- Subtraction\n10 - 4 = 6\"]\n    A --> D[\"* Multiplication\n3 * 4 = 12\"]\n    A --> E[\"/ Division\n10 / 4 = 2.5 float\"]\n    A --> F[\"// Floor Division\n10 // 3 = 3 int\"]\n    A --> G[\"% Modulus\n10 % 3 = 1 remainder\"]\n    A --> H[\"** Exponent\n2 ** 8 = 256\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style F fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style G fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "The seven arithmetic operators — note that / always returns a float",
      "code": "# Basic arithmetic\nprint(10 + 3)    # 13\nprint(10 - 3)    # 7\nprint(10 * 3)    # 30\n\n# Division always returns float\nprint(10 / 2)    # 5.0 — not 5!\nprint(10 / 3)    # 3.3333...\n\n# Floor division — integer result, rounds down\nprint(10 // 3)   # 3\nprint(-10 // 3)  # -4 (rounds DOWN, not toward zero)\n\n# Modulus — remainder after division\nprint(10 % 3)    # 1\nprint(15 % 5)    # 0 (divides evenly)\n\n# Check even or odd using modulus\nnumber = 42\nprint(number % 2 == 0)   # True — even\n\n# Exponentiation\nprint(2 ** 10)   # 1024\nprint(9 ** 0.5)  # 3.0 (square root)\n\n# Mixing int and float — result is always float\nprint(10 + 3.0)  # 13.0",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "The `/` operator always returns a float in Python 3. `10 / 2` gives `5.0`, not `5`. If you need an integer result, use `//`. This surprises many beginners who expect whole-number division to return a whole number."
      },
      "keyPoints": [
        "/ always returns a float — use // when you need an integer result",
        "// is floor division — it rounds DOWN to the nearest integer, even for negatives",
        "% returns the remainder — use it to check even/odd or wrap values in a range",
        "** is exponentiation — 2 ** 10 gives 1024",
        "Mixing int and float in any operation always produces a float"
      ],
      "tryIt": "Write a program that takes a number of seconds as input and converts it to hours, minutes, and remaining seconds. Use // for whole hours and minutes, and % for the remainders. For example, 3661 seconds = 1 hour, 1 minute, 1 second."
    }
  },

  {
    "id": 29,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Arithmetic in Practice",
    "type": "lesson",
    "content": {
      "body": "Knowing the operators is one thing. Knowing when and how to apply them to real problems is another. This lesson shows arithmetic operators in practical contexts — the kinds of calculations you will write in real programs.\n\n## Calculating Percentages\n\nPercentages appear constantly in programming — discounts, tax rates, scores, progress bars. The pattern is always the same: multiply by the rate, divide by 100. Or more cleanly, multiply by the decimal form of the percentage.\n\n## Time Conversion\n\nConverting between time units is a classic use of floor division and modulus working together. Floor division gives you the whole units, modulus gives you the remainder.\n\n## Rounding and Precision\n\nPython's built-in `round()` function rounds to a specified number of decimal places. For financial calculations, always round at the final step — rounding intermediate values accumulates errors.\n\n## Augmented Assignment\n\nWhen you want to update a variable using arithmetic, Python provides shorthand operators that combine the operation and assignment in one step. These are called **augmented assignment operators** and they make counter and accumulator patterns much cleaner.",
      "code": "# Percentage calculations\nprice = 5000\ndiscount_rate = 0.15          # 15%\ndiscount = price * discount_rate\nfinal_price = price - discount\nprint(f\"Original: {price}\")\nprint(f\"Discount: {discount:.2f}\")\nprint(f\"Final:    {final_price:.2f}\")\n\n# Time conversion using // and %\ntotal_seconds = 3661\nhours = total_seconds // 3600\nremaining = total_seconds % 3600\nminutes = remaining // 60\nseconds = remaining % 60\nprint(f\"{hours}h {minutes}m {seconds}s\")  # 1h 1m 1s\n\n# Rounding\nresult = 10 / 3\nprint(round(result, 2))       # 3.33\nprint(round(result, 4))       # 3.3333\n\n# Augmented assignment operators\nscore = 0\nscore += 10    # same as score = score + 10\nscore += 5\nscore *= 2     # same as score = score * 2\nprint(score)   # 30\n\n# Accumulating a total\nprices = [29.99, 14.50, 8.75]\ntotal = 0\nfor p in prices:\n    total += p\nprint(f\"Total: {total:.2f}\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "The augmented assignment operators (+=, -=, *=, /=, //=, %=, **=) are not just shortcuts — they communicate intent. `score += 10` reads as 'increase score by 10', which is clearer than `score = score + 10`."
      },
      "keyPoints": [
        "Percentages: multiply by the decimal rate (0.15 for 15%) rather than dividing by 100",
        "Time conversion: use // for whole units and % for the remainder",
        "round(value, decimal_places) rounds to a specified precision",
        "Augmented assignment (+=, -=, *=) updates a variable in place",
        "Always round at the final step — rounding intermediate values accumulates errors"
      ],
      "tryIt": "Write a program that calculates a restaurant bill. Ask for the meal cost, add 7.5% tax, then add a 15% tip on the original amount. Print each component and the total, all formatted to 2 decimal places."
    }
  },

  {
    "id": 30,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Assignment Operators",
    "type": "lesson",
    "content": {
      "body": "You already know the basic assignment operator `=` — it stores a value in a variable. Python also provides **augmented assignment operators** that combine an arithmetic operation with assignment in a single step. These are not just shortcuts; they express intent more clearly and are used constantly in real Python code.\n\n## How Augmented Assignment Works\n\nWhen you write `x += 5`, Python expands it to `x = x + 5`. It reads the current value of `x`, adds `5` to it, and stores the result back in `x`. The variable must already exist before you can use an augmented assignment on it.\n\n## The Full Set\n\n- `=` — basic assignment: store a value\n- `+=` — add and assign: `x += 3` means `x = x + 3`\n- `-=` — subtract and assign: `x -= 3` means `x = x - 3`\n- `*=` — multiply and assign: `x *= 2` means `x = x * 2`\n- `/=` — divide and assign: `x /= 2` means `x = x / 2` (result is float)\n- `//=` — floor divide and assign: `x //= 2` means `x = x // 2`\n- `%=` — modulus and assign: `x %= 3` means `x = x % 3`\n- `**=` — exponentiate and assign: `x **= 2` means `x = x ** 2`\n\n## When to Use Them\n\nUse augmented assignment whenever you are updating a variable based on its current value. Counters, accumulators, running totals, and score tracking are the most common patterns. They make the update intent explicit and reduce the chance of typos.",
      "diagram": "flowchart LR\n    A[\"x = 10\"] --> B[\"x += 5\"]\n    B --> C[\"x = x + 5\"]\n    C --> D[\"x = 10 + 5\"]\n    D --> E[\"x = 15\"]\n    style A fill:#f0f4f8,stroke:#3776ab\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "Augmented assignment expands to a read-modify-write operation on the variable",
      "code": "# Basic assignment\nx = 10\n\n# Augmented assignment operators\nx += 5     # x = 10 + 5 = 15\nprint(x)   # 15\n\nx -= 3     # x = 15 - 3 = 12\nprint(x)   # 12\n\nx *= 2     # x = 12 * 2 = 24\nprint(x)   # 24\n\nx /= 4     # x = 24 / 4 = 6.0 (float!)\nprint(x)   # 6.0\n\nx //= 2    # x = 6.0 // 2 = 3.0\nprint(x)   # 3.0\n\nx **= 3    # x = 3.0 ** 3 = 27.0\nprint(x)   # 27.0\n\n# Common patterns\nscore = 0\nscore += 10    # player scores\nscore += 5     # bonus\nscore -= 2     # penalty\nprint(f\"Final score: {score}\")   # 13\n\n# Running total\nitems = [12.50, 8.99, 24.00, 3.75]\ntotal = 0\nfor item in items:\n    total += item\nprint(f\"Total: {total:.2f}\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The variable must exist before you use an augmented assignment. Writing `score += 10` when `score` has never been defined raises a NameError. Always initialise your variable first: `score = 0`."
      },
      "keyPoints": [
        "Augmented assignment combines an operation and assignment: x += 5 means x = x + 5",
        "The variable must already exist before using augmented assignment",
        "/= always produces a float result, just like the / operator",
        "Use augmented assignment for counters, accumulators, and running totals",
        "All seven arithmetic operators have an augmented assignment form"
      ],
      "tryIt": "Write a program that simulates a simple bank account. Start with a balance of 1000. Make three deposits and two withdrawals using += and -=. Print the balance after each transaction and the final balance."
    }
  },

  {
    "id": 31,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Assignment Operators in Practice",
    "type": "lesson",
    "content": {
      "body": "Assignment operators shine in programs that track changing state — scores, balances, counts, totals. This lesson shows three practical patterns you will use constantly as a Python developer.\n\n## Pattern 1 — Counters\n\nA counter tracks how many times something happens. Initialise it to zero, then increment it with `+= 1` each time the event occurs. This is one of the most common patterns in all of programming.\n\n## Pattern 2 — Accumulators\n\nAn accumulator builds up a total by adding values one at a time. Initialise to zero (or an empty string for text), then use `+=` inside a loop to add each new value. The result after the loop is the accumulated total.\n\n## Pattern 3 — State Tracking\n\nSome programs need to track a value that changes based on events — a game score that goes up and down, a stock price that fluctuates, a temperature that rises and falls. Augmented assignment makes each change explicit and readable.\n\n## Readable vs Verbose\n\nCompare these two ways of incrementing a counter:\n\n- Verbose: `count = count + 1`\n- Readable: `count += 1`\n\nBoth do the same thing. The augmented form is preferred because it is shorter, communicates intent clearly, and reduces the chance of a typo where you accidentally write the wrong variable name on one side.",
      "code": "# Pattern 1 — Counter\nvowels = 0\ntext = \"Hello, World!\"\nfor char in text.lower():\n    if char in \"aeiou\":\n        vowels += 1\nprint(f\"Vowels: {vowels}\")   # 3\n\n# Pattern 2 — Accumulator\nnumbers = [4, 7, 2, 9, 1, 5]\ntotal = 0\nfor n in numbers:\n    total += n\naverage = total / len(numbers)\nprint(f\"Total: {total}, Average: {average:.1f}\")\n\n# Pattern 3 — State tracking (game score)\nscore = 0\nlives = 3\n\nscore += 100   # enemy defeated\nscore += 50    # bonus collected\nscore -= 25    # penalty\nlives -= 1     # lost a life\n\nprint(f\"Score: {score}, Lives: {lives}\")\n\n# String accumulator\nwords = [\"Python\", \"is\", \"powerful\"]\nsentence = \"\"\nfor word in words:\n    sentence += word + \" \"\nprint(sentence.strip())   # Python is powerful",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Always initialise your accumulator before the loop. Writing `total += n` when `total` has never been defined raises a NameError. The pattern is always: initialise to zero (or empty), then accumulate inside the loop."
      },
      "keyPoints": [
        "Counter pattern: initialise to 0, use += 1 each time the event occurs",
        "Accumulator pattern: initialise to 0, use += inside a loop to build a total",
        "State tracking: use += and -= to update a value based on events",
        "Always initialise the variable before using augmented assignment on it",
        "Augmented assignment is preferred over verbose x = x + 1 for clarity"
      ],
      "tryIt": "Write a program that counts the number of words in a sentence entered by the user, counts how many words are longer than 4 characters, and calculates the average word length. Use counters and accumulators."
    }
  },

  {
    "id": 32,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Comparison Operators",
    "type": "lesson",
    "content": {
      "body": "Comparison operators compare two values and always produce a boolean result — either `True` or `False`. They are the foundation of every decision in your program. Every `if` statement, every loop condition, every filter depends on a comparison expression.\n\n## The Six Comparison Operators\n\n**Equal (==)** checks whether two values are the same. This is one of the most important operators to understand correctly — it is completely different from the assignment operator `=`.\n\n**Not equal (!=)** checks whether two values are different. Returns `True` when the values do not match.\n\n**Greater than (>)** returns `True` when the left value is strictly larger than the right.\n\n**Less than (<)** returns `True` when the left value is strictly smaller than the right.\n\n**Greater than or equal (>=)** returns `True` when the left value is larger than or equal to the right. This includes the case where both values are equal.\n\n**Less than or equal (<=)** returns `True` when the left value is smaller than or equal to the right.\n\n## Comparing Different Types\n\nPython can compare numbers of different types — integers and floats compare naturally. However, comparing a string to a number raises a `TypeError` in most cases. Always make sure you are comparing compatible types.\n\n## Chaining Comparisons\n\nPython allows you to chain comparisons in a way that reads naturally: `0 < age < 120` checks that age is between 0 and 120. This is unique to Python and much cleaner than writing `age > 0 and age < 120`.",
      "diagram": "flowchart TD\n    A[\"Comparison\nExpression\"] --> B{\"Evaluate\"}\n    B -->|\"True\"| C[\"Boolean: True\"]\n    B -->|\"False\"| D[\"Boolean: False\"]\n    E[\"== Equal\"] --> A\n    F[\"!= Not equal\"] --> A\n    G[\"> Greater than\"] --> A\n    H[\"< Less than\"] --> A\n    I[\">= Greater or equal\"] --> A\n    J[\"<= Less or equal\"] --> A\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style A fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "All comparison operators evaluate to True or False — they never produce a number",
      "code": "age = 25\nscore = 85\nname = \"Alice\"\n\n# Equal and not equal\nprint(age == 25)       # True\nprint(age == 30)       # False\nprint(age != 30)       # True\nprint(name == \"Alice\") # True\nprint(name == \"alice\") # False — case sensitive!\n\n# Greater and less than\nprint(score > 80)      # True\nprint(score < 80)      # False\nprint(score >= 85)     # True\nprint(score <= 85)     # True\n\n# Chaining comparisons — Pythonic and readable\nprint(0 < age < 100)   # True\nprint(80 <= score <= 100)  # True\n\n# Comparing strings — alphabetical order\nprint(\"apple\" < \"banana\")  # True\nprint(\"z\" > \"a\")           # True\n\n# Store comparison result in a variable\nis_passing = score >= 50\nprint(f\"Passing: {is_passing}\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never confuse `=` (assignment) with `==` (comparison). Writing `if age = 18:` is a SyntaxError in Python. Writing `age = 18` inside a condition assigns the value instead of checking it. This is one of the most common bugs across all programming languages."
      },
      "keyPoints": [
        "Comparison operators always return True or False — never a number",
        "== checks equality; = assigns a value — never confuse them",
        "String comparison is case-sensitive: 'Alice' != 'alice'",
        "Python supports chained comparisons: 0 < age < 100 is valid and readable",
        "Store comparison results in variables to make complex conditions more readable"
      ],
      "tryIt": "Write a program that asks for a test score (0-100). Use comparison operators to check: whether it is a passing grade (>= 50), whether it is a distinction (>= 75), and whether it is a perfect score (== 100). Print a message for each check."
    }
  },

  {
    "id": 33,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Comparison in Practice",
    "type": "lesson",
    "content": {
      "body": "Knowing the six comparison operators is only the first step. The real skill is applying them to solve actual problems — validating user input, making decisions based on data, and writing conditions that are clear and correct.\n\n## Comparisons Inside if Statements\n\nEvery `if` statement evaluates a comparison expression. The block runs when the expression is `True` and is skipped when it is `False`. You can chain multiple conditions using `elif` to handle several cases cleanly.\n\n```python\nscore = 72\n\nif score >= 90:\n    print(\"A\")\nelif score >= 75:\n    print(\"B\")\nelif score >= 50:\n    print(\"C\")\nelse:\n    print(\"Fail\")\n```\n\nEach condition is checked in order. The first one that is `True` runs its block, and the rest are skipped.\n\n## String Comparisons\n\nStrings compare alphabetically using Unicode values. This means uppercase letters come before lowercase ones — `\"Z\" < \"a\"` is `True`. When comparing user input, always normalise the case first using `.lower()` or `.upper()` to avoid subtle bugs.\n\n## Comparing with Variables\n\nComparisons become most useful when one or both sides are variables. This lets the same code handle different inputs and produce different results — the foundation of dynamic programs.\n\n## Storing Comparison Results\n\nA comparison expression is just a value — you can store it in a variable, pass it to a function, or use it in a list. This makes complex conditions easier to read and reuse.\n\n```python\nis_adult = age >= 18\nis_passing = score >= 50\ncan_proceed = is_adult and is_passing\n```",
      "diagram": "flowchart LR\n    A[\"User Input\"] --> B[\"Normalise\n.lower()\"]\n    B --> C{\"Compare\"}\n    C -->|\"True\"| D[\"Run block\"]\n    C -->|\"False\"| E[\"Skip / elif\"]\n    E --> F{\"Next condition\"}\n    F -->|\"True\"| G[\"Run block\"]\n    F -->|\"False\"| H[\"else block\"]\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "if/elif/else chains evaluate conditions top-to-bottom and run the first True branch",
      "code": "# Grade classifier\nscore = int(input(\"Enter your score (0-100): \"))\n\nif score < 0 or score > 100:\n    print(\"Invalid score\")\nelif score >= 90:\n    print(\"Grade: A — Excellent!\")\nelif score >= 75:\n    print(\"Grade: B — Good work\")\nelif score >= 50:\n    print(\"Grade: C — Passing\")\nelse:\n    print(\"Grade: F — Please resit\")\n\n# Case-insensitive string comparison\nanswer = input(\"Are you a student? (yes/no): \")\nif answer.lower() == \"yes\":\n    print(\"Student discount applied\")\nelse:\n    print(\"Full price applies\")\n\n# Storing results for reuse\nage = int(input(\"Enter your age: \"))\nis_adult = age >= 18\nis_senior = age >= 65\nprint(f\"Adult: {is_adult}, Senior: {is_senior}\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Always call `.lower()` before comparing strings from user input. `answer == 'yes'` fails for 'Yes', 'YES', or 'Y'. Use `answer.lower() == 'yes'` to handle all variations, or `answer.strip().lower()` to also remove accidental whitespace."
      },
      "keyPoints": [
        "if/elif/else chains evaluate top-to-bottom — only the first True branch runs",
        "String comparison is case-sensitive — normalise with .lower() before comparing user input",
        "Comparison results are values — store them in variables to simplify complex conditions",
        "Validate input ranges with comparisons before using the value in logic",
        "Chaining elif is cleaner than nested if statements for mutually exclusive conditions"
      ],
      "tryIt": "Write a program that reads a username from input. Check: whether it is empty (length == 0), whether it is too short (length < 3), whether it is too long (length > 20), and whether it contains the word 'admin' (use .lower()). Print a specific message for each case, or 'Username accepted' if all checks pass."
    }
  },

  {
    "id": 34,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Logical Operators",
    "type": "lesson",
    "content": {
      "body": "Logical operators combine multiple boolean expressions into a single result. They let you express conditions like \"the user is an adult **and** has an account\" or \"the input is empty **or** too long\" — conditions that real programs need constantly.\n\nPython has three logical operators: `and`, `or`, and `not`. They work on boolean values (`True`/`False`) and return a boolean result.\n\n## and\n\n`and` returns `True` only when **both** sides are `True`. If either side is `False`, the whole expression is `False`.\n\n```\nTrue  and True   → True\nTrue  and False  → False\nFalse and True   → False\nFalse and False  → False\n```\n\nUse `and` when all conditions must be satisfied simultaneously.\n\n## or\n\n`or` returns `True` when **at least one** side is `True`. It only returns `False` when both sides are `False`.\n\n```\nTrue  or True   → True\nTrue  or False  → True\nFalse or True   → True\nFalse or False  → False\n```\n\nUse `or` when any one of several conditions is enough.\n\n## not\n\n`not` flips a boolean value. `not True` becomes `False`, and `not False` becomes `True`. It is a unary operator — it takes only one operand.\n\n## Short-Circuit Evaluation\n\nPython evaluates logical expressions lazily. With `and`, if the left side is `False`, Python skips the right side entirely — the result is already determined. With `or`, if the left side is `True`, the right side is skipped. This matters when the right side has a side effect or could raise an error.\n\n## Operator Precedence\n\nWhen mixing logical operators, `not` binds tightest, then `and`, then `or`. Use parentheses to make complex conditions explicit and readable.",
      "diagram": "flowchart TD\n    A[\"A and B\"] -->|\"both True\"| T1[\"True\"]\n    A -->|\"either False\"| F1[\"False\"]\n    B[\"A or B\"] -->|\"either True\"| T2[\"True\"]\n    B -->|\"both False\"| F2[\"False\"]\n    C[\"not A\"] -->|\"A is True\"| F3[\"False\"]\n    C -->|\"A is False\"| T3[\"True\"]\n    style T1 fill:#dcfce7,stroke:#16a34a,color:#166534\n    style T2 fill:#dcfce7,stroke:#16a34a,color:#166534\n    style T3 fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F1 fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style F2 fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style F3 fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "and requires both True; or requires at least one True; not flips the value",
      "code": "age = 20\nhas_id = True\nis_banned = False\nbalance = 0\n\n# and — all conditions must be True\ncan_enter = age >= 18 and has_id\nprint(f\"Can enter: {can_enter}\")       # True\n\n# or — at least one condition must be True\nneeds_help = balance == 0 or balance < 10\nprint(f\"Needs help: {needs_help}\")     # True\n\n# not — flip a boolean\nprint(f\"Not banned: {not is_banned}\")  # True\n\n# Combining all three\ncan_buy = age >= 18 and not is_banned and balance > 0\nprint(f\"Can buy: {can_buy}\")           # False (balance is 0)\n\n# Short-circuit: second condition skipped if first is False\nitems = []\n# Safe — len() never called if items is None\ndata = None\nhas_items = data is not None and len(data) > 0\nprint(f\"Has items: {has_items}\")       # False\n\n# Precedence: not > and > or\n# Use parentheses to be explicit\nresult = (age >= 18 and has_id) or is_banned\nprint(result)  # True",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Operator precedence can produce surprising results. `not True or False` evaluates as `(not True) or False` → `False or False` → `False`, not `not (True or False)` → `not True` → `False`. Both happen to give `False` here, but the difference matters in other cases. When in doubt, use parentheses."
      },
      "keyPoints": [
        "`and` returns True only when both operands are True",
        "`or` returns True when at least one operand is True",
        "`not` flips a boolean — `not True` is `False` and vice versa",
        "Short-circuit evaluation skips the right side when the result is already determined",
        "Precedence order: `not` > `and` > `or` — use parentheses for clarity"
      ],
      "tryIt": "Write a program that reads a password from input. Use logical operators to check all three rules at once: the password must be at least 8 characters long, must not equal 'password', and must not equal '12345678'. Print 'Strong password' if all three conditions pass, otherwise print 'Weak password'."
    }
  },

  {
    "id": 35,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Logical Operators in Practice",
    "type": "lesson",
    "content": {
      "body": "Logical operators become powerful when applied to real validation and decision problems. The key is learning to translate plain-English requirements into boolean expressions — a skill you will use in every program you write.\n\n## Translating Requirements into Logic\n\nStart with the requirement in plain English, then map each condition to a comparison, and combine them with `and`/`or`/`not`.\n\n| Requirement | Expression |\n|---|---|\n| Must be 18 or older and have ID | `age >= 18 and has_id` |\n| Username empty or too short | `len(name) == 0 or len(name) < 3` |\n| Not already registered | `not is_registered` |\n| Score in valid range | `0 <= score <= 100` |\n\n## Input Validation Pattern\n\nA common pattern is to collect all failure conditions with `or` and reject early, then proceed with the happy path:\n\n```python\nif len(username) < 3 or len(username) > 20:\n    print(\"Username must be 3–20 characters\")\nelif not username.isalnum():\n    print(\"Letters and numbers only\")\nelse:\n    print(\"Username accepted\")\n```\n\n## Avoiding Common Mistakes\n\nA frequent error is writing `if x == 1 or 2:` expecting it to check whether x is 1 or 2. Python reads this as `if (x == 1) or 2:` — and since `2` is truthy, this is always `True`. The correct form is `if x == 1 or x == 2:`.\n\nSimilarly, `if not x == 1 or x == 2:` is `if (not x == 1) or x == 2:`, not `if not (x == 1 or x == 2):`. Parentheses resolve the ambiguity.",
      "diagram": "flowchart TD\n    A[\"Read Input\"] --> B{\"len < 3\nor len > 20?\"}\n    B -->|\"True\"| C[\"Reject:\nLength error\"]\n    B -->|\"False\"| D{\"not\nisalnum?\"}\n    D -->|\"True\"| E[\"Reject:\nInvalid chars\"]\n    D -->|\"False\"| F[\"Accept ✓\"]\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Early rejection with or keeps validation logic flat and readable",
      "code": "# Full registration validator\ndef validate_user(username, age, password):\n    # Username checks\n    if len(username) < 3 or len(username) > 20:\n        return \"Username must be 3–20 characters\"\n    if not username.isalnum():\n        return \"Username: letters and numbers only\"\n\n    # Age check\n    if not (age >= 13 and age <= 120):\n        return \"Age must be between 13 and 120\"\n\n    # Password checks\n    if len(password) < 8 or password == \"password\" or password == \"12345678\":\n        return \"Password is too weak\"\n\n    return \"Registration successful\"\n\nprint(validate_user(\"Al\", 25, \"securepass1\"))     # too short\nprint(validate_user(\"Alice\", 10, \"securepass1\"))  # too young\nprint(validate_user(\"Alice\", 25, \"password\"))     # weak password\nprint(validate_user(\"Alice\", 25, \"securepass1\"))  # success\n\n# Common mistake — always write full comparisons with or\nx = 2\nprint(x == 1 or x == 2)   # True  ✅\nprint(x == 1 or 2)         # True  ❌ always True — 2 is truthy",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "`if x == 1 or 2:` does NOT check whether x is 1 or 2. Python evaluates it as `(x == 1) or 2`, and since `2` is always truthy, the condition is always `True`. Always write the full comparison on each side: `if x == 1 or x == 2:`."
      },
      "keyPoints": [
        "Translate plain-English requirements into comparisons, then combine with and/or/not",
        "Use or to collect failure conditions and reject early — keeps logic flat",
        "not (condition) is clearer than restructuring the condition — use parentheses",
        "`x == 1 or 2` is always True — always write `x == 1 or x == 2`",
        "Break complex validation into named boolean variables to improve readability"
      ],
      "tryIt": "Write a validate_age(age) function that returns True only if age is an integer, is greater than 0, and is less than or equal to 120. Test it with values: -1, 0, 17, 25, 120, 121, and a string. Print the result for each."
    }
  },

  {
    "id": 36,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Operator Precedence",
    "type": "lesson",
    "content": {
      "body": "When an expression contains multiple operators, Python must decide which to evaluate first. This ordering is called **operator precedence**. Getting it wrong produces results that look correct but are subtly broken — one of the most common sources of logic bugs.\n\n## The Precedence Hierarchy\n\nFrom highest (evaluated first) to lowest (evaluated last):\n\n| Priority | Operators | Example |\n|---|---|---|\n| 1 | `()` Parentheses | `(2 + 3) * 4` → 20 |\n| 2 | `**` Exponentiation | `2 ** 3` → 8 |\n| 3 | `+x`, `-x` Unary | `-5` |\n| 4 | `*`, `/`, `//`, `%` | `10 / 2 * 3` → 15 |\n| 5 | `+`, `-` Addition | `2 + 3 - 1` → 4 |\n| 6 | `==`, `!=`, `<`, `>`, `<=`, `>=` | `x > 0` |\n| 7 | `not` | `not True` |\n| 8 | `and` | `a and b` |\n| 9 | `or` | `a or b` |\n\n## Arithmetic Before Comparison, Comparison Before Logic\n\nThis three-level hierarchy is the most important pattern to internalise. Python always finishes all arithmetic first, then evaluates comparisons, then combines them with logical operators.\n\n```python\nx = 5\nresult = x + 1 > 3 and x * 2 < 20\n# Step 1 (arithmetic): 6 > 3 and 10 < 20\n# Step 2 (comparison): True and True\n# Step 3 (logical):    True\n```\n\n## When to Use Parentheses\n\nYou do not need to memorise the full table. The practical rule is: **use parentheses whenever the intent is not immediately obvious**. Parentheses cost nothing and prevent bugs.",
      "diagram": "flowchart TD\n    A[\"Full Expression\"] --> B[\"1. Arithmetic\n* / // % + -\"]\n    B --> C[\"2. Comparisons\n== != < > <= >=\"]\n    C --> D[\"3. not\"]\n    D --> E[\"4. and\"]\n    E --> F[\"5. or\"]\n    F --> G[\"Final Boolean\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#f97316,stroke:#c2410c,color:#fff\n    style E fill:#f97316,stroke:#c2410c,color:#fff\n    style F fill:#f97316,stroke:#c2410c,color:#fff\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Arithmetic resolves first, then comparisons, then logical operators — left to right within each level",
      "code": "# Arithmetic before comparison\nprint(2 + 3 > 4)        # (2+3) > 4 → 5 > 4 → True\nprint(10 - 4 * 2 == 2)  # 10 - 8 == 2 → True\n\n# Comparison before logical\nage = 20\nhas_id = True\nprint(age >= 18 and has_id)   # True and True → True\n\n# not before and before or\na, b, c = True, False, True\nprint(not a or b and c)       # (not True) or (False and True)\n                               # False or False → False\nprint(not (a or b) and c)     # not True and True → False and True → False\n\n# Surprising without parentheses\nx = 5\nprint(x > 2 or x > 10 and x < 4)\n# and binds tighter: x > 2 or (x > 10 and x < 4)\n# True or False → True\n\n# Made explicit with parentheses\nprint((x > 2 or x > 10) and x < 4)\n# True and False → False  ← very different result!",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "You do not need to memorise the full precedence table. Memorise the three levels that matter most: arithmetic first, then comparisons, then logical (`not` > `and` > `or`). For everything else, add parentheses — they make your intent explicit and your code easier to review."
      },
      "keyPoints": [
        "Arithmetic operators evaluate before comparison operators",
        "Comparison operators evaluate before logical operators",
        "Among logical operators: `not` > `and` > `or`",
        "Parentheses override all precedence rules and always evaluate first",
        "When in doubt, add parentheses — they clarify intent and prevent bugs"
      ],
      "tryIt": "Without running the code, work out the result of each expression, then verify in Python: `2 + 3 * 4`, `(2 + 3) * 4`, `not False and True`, `not (False and True)`, `5 > 3 and 2 < 1 or 4 == 4`. For the last one, add parentheses to make it evaluate the `or` first instead."
    }
  },

  {
    "id": 37,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "String Operators",
    "type": "lesson",
    "content": {
      "body": "Python lets you use operators directly on strings — not just on numbers. Four operators work with strings: `+` for joining, `*` for repeating, and `in`/`not in` for membership testing. These cover a surprising amount of real string work without needing any methods.\n\n## Concatenation with +\n\nThe `+` operator joins two strings end-to-end. Both operands must be strings — adding a string and a number raises a `TypeError`. Convert numbers to strings with `str()` first.\n\n```python\nfirst = \"Hello\"\nsecond = \"World\"\nprint(first + \", \" + second + \"!\")  # Hello, World!\n```\n\n## Repetition with *\n\nThe `*` operator repeats a string a given number of times. One operand must be a string and the other an integer. This is useful for building separators, padding, and simple patterns.\n\n```python\nprint(\"-\" * 40)   # ----------------------------------------\nprint(\"ha\" * 3)   # hahaha\n```\n\n## Membership with in and not in\n\n`in` checks whether one string appears anywhere inside another. It returns `True` or `False` and is case-sensitive. `not in` is the inverse.\n\n```python\nprint(\"cat\" in \"concatenate\")   # True\nprint(\"CAT\" in \"concatenate\")   # False — case sensitive\nprint(\"xyz\" not in \"hello\")     # True\n```\n\n## Comparison Operators on Strings\n\nThe six comparison operators also work on strings, comparing them alphabetically by Unicode value. This means `\"apple\" < \"banana\"` is `True`, and `\"Z\" < \"a\"` is also `True` because uppercase letters have lower Unicode values than lowercase ones.",
      "diagram": "flowchart LR\n    A[\"String Operators\"] --> B[\"+ Concatenation\n'Hi' + ' ' + 'there'\"]\n    A --> C[\"* Repetition\n'-' * 20\"]\n    A --> D[\"in Membership\n'cat' in 'concatenate'\"]\n    A --> E[\"not in\n'xyz' not in 'hello'\"]\n    B --> F[\"'Hi there'\"]\n    C --> G[\"'--------------------'\"]\n    D --> H[\"True\"]\n    E --> I[\"True\"]\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#dcfce7,stroke:#16a34a,color:#166534\n    style A fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Four operators work directly on strings — no methods needed",
      "code": "# Concatenation\nfirst = \"Python\"\nversion = 3\nprint(first + \" \" + str(version))   # Python 3\nprint(\"Hello\" + \", \" + \"World!\")    # Hello, World!\n\n# Repetition — useful for formatting\nprint(\"=\" * 30)\nprint(\"  REPORT CARD  \".center(30))\nprint(\"=\" * 30)\n\n# Membership testing\nemail = \"user@example.com\"\nprint(\"@\" in email)           # True  — looks like an email\nprint(\".com\" in email)        # True\nprint(\"admin\" in email)       # False\n\n# Case-sensitive — always normalise before checking\nkeyword = \"Python\"\nsentence = \"I love python programming\"\nprint(keyword in sentence)            # False\nprint(keyword.lower() in sentence)    # True\n\n# not in for validation\nbanned = [\"spam\", \"scam\", \"free money\"]\nmessage = \"Click here for free money\"\nflagged = any(word in message.lower() for word in banned)\nprint(f\"Flagged: {flagged}\")          # True",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "`'Score: ' + score` raises a TypeError if `score` is an integer. Python does not auto-convert types in concatenation. Use `str(score)` to convert, or use an f-string: `f'Score: {score}'` — f-strings handle the conversion automatically and are generally preferred."
      },
      "keyPoints": [
        "`+` joins strings — both sides must be strings, use str() to convert numbers",
        "`*` repeats a string — one side must be a string, the other an integer",
        "`in` returns True if the left string appears anywhere in the right string",
        "All string operators are case-sensitive — normalise with .lower() when needed",
        "f-strings are usually cleaner than concatenation for building strings with variables"
      ],
      "tryIt": "Write a program that reads a sentence from input. Use `in` to check whether it contains the word 'python' (case-insensitive). Then use `*` to print a separator line the same length as the sentence. Finally, use `+` to build and print a response: 'Found: python' or 'Not found'."
    }
  },

  {
    "id": 38,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Type Conversion",
    "type": "lesson",
    "content": {
      "body": "Every value in Python has a type. Operators and functions often require specific types — you cannot add a string to an integer, and `input()` always returns a string even when the user types a number. Type conversion is how you move values between types so your expressions work correctly.\n\n## Explicit Conversion Functions\n\nPython provides four built-in functions for explicit type conversion:\n\n**`int(x)`** converts to an integer. It truncates floats (drops the decimal, does not round) and parses strings that contain a whole number. Raises `ValueError` if the string is not a valid integer.\n\n**`float(x)`** converts to a floating-point number. Accepts integers and strings like `\"3.14\"` or `\"2\"`. Raises `ValueError` for non-numeric strings.\n\n**`str(x)`** converts any value to its string representation. Always succeeds — every Python object has a string form.\n\n**`bool(x)`** converts to `True` or `False`. The rules for what is falsy are worth memorising: `0`, `0.0`, `\"\"` (empty string), `None`, and empty collections are all `False`. Everything else is `True`.\n\n## Implicit Conversion\n\nPython does very little implicit conversion. Unlike JavaScript, it will not silently coerce a string to a number. This strictness prevents a whole class of subtle bugs — but it means you must convert explicitly when types need to change.\n\n## The input() Pattern\n\nBecause `input()` always returns a string, converting immediately at the point of input is the standard pattern:\n\n```python\nage = int(input(\"Enter your age: \"))\nprice = float(input(\"Enter price: \"))\n```\n\nWrap in `try/except` when the input might not be a valid number.",
      "diagram": "flowchart TD\n    A[\"Any Value\"] --> B[\"int()\"]\n    A --> C[\"float()\"]\n    A --> D[\"str()\"]\n    A --> E[\"bool()\"]\n    B --> F[\"Whole number\ntruncates float\"]\n    C --> G[\"Decimal number\"]\n    D --> H[\"Always succeeds\"]\n    E --> I[\"False: 0, '', None\nTrue: everything else\"]\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style G fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#3776ab,color:#fff,stroke:#3776ab\n    style A fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "str() always succeeds; int() and float() raise ValueError for invalid strings",
      "code": "# int() — truncates, does not round\nprint(int(3.9))        # 3  (not 4!)\nprint(int(\"42\"))       # 42\nprint(int(\"  10  \"))   # 10 — strips whitespace\n\n# float()\nprint(float(\"3.14\"))   # 3.14\nprint(float(5))        # 5.0\n\n# str()\nscore = 95\nprint(\"Score: \" + str(score))   # Score: 95\nprint(str(True))                 # 'True'\nprint(str(None))                 # 'None'\n\n# bool() — falsy values\nprint(bool(0))     # False\nprint(bool(\"\"))    # False\nprint(bool(None))  # False\nprint(bool(0.0))   # False\nprint(bool(\"0\"))   # True  — non-empty string!\nprint(bool(-1))    # True  — any non-zero number\n\n# Safe input conversion\nraw = input(\"Enter a number: \")\ntry:\n    number = int(raw)\n    print(f\"Double: {number * 2}\")\nexcept ValueError:\n    print(f\"'{raw}' is not a valid integer\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "`int(3.9)` gives `3`, not `4`. `int()` truncates toward zero — it does not round. Use `round(3.9)` to get `4`, or `math.floor()`/`math.ceil()` for explicit floor and ceiling. Also note: `bool('0')` is `True` because `'0'` is a non-empty string — only the empty string `''` is falsy."
      },
      "keyPoints": [
        "`input()` always returns a string — convert with `int()` or `float()` immediately",
        "`int()` truncates floats toward zero — it does not round",
        "`str()` always succeeds and works on any Python value",
        "Falsy values: `0`, `0.0`, `''`, `None`, empty collections — everything else is truthy",
        "Wrap `int()`/`float()` in `try/except ValueError` when converting user input"
      ],
      "tryIt": "Write a program that reads two numbers from input (as strings), converts them to floats, and prints their sum, difference, product, and quotient. Handle the case where the user enters something that is not a number by catching `ValueError` and printing a helpful error message."
    }
  },

  {
    "id": 39,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "Module 3 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered every major operator category in Python and the rules that govern how they interact. You now have the tools to write expressions that compute values, compare data, combine conditions, and convert between types.\n\n## What You Learned\n\n**Operators and expressions** — an operator acts on one or more operands to produce a new value. Every expression evaluates to exactly one value.\n\n**Arithmetic operators** — `+`, `-`, `*`, `/`, `//`, `%`, `**` perform mathematical operations. Floor division and modulo are especially useful for integer arithmetic and cycle detection.\n\n**Assignment operators** — `=`, `+=`, `-=`, `*=`, `/=` and others update variables in place. Augmented assignment is shorter and clearer than writing `x = x + 1`.\n\n**Comparison operators** — `==`, `!=`, `<`, `>`, `<=`, `>=` compare two values and always return a boolean. Python supports chained comparisons like `0 < age < 120`.\n\n**Logical operators** — `and`, `or`, `not` combine boolean expressions. Short-circuit evaluation means the right side is skipped when the result is already determined.\n\n**Operator precedence** — arithmetic evaluates before comparisons, comparisons before logical operators. Among logical operators: `not` > `and` > `or`. Parentheses override everything.\n\n**String operators** — `+` concatenates, `*` repeats, `in`/`not in` test membership. All are case-sensitive.\n\n**Type conversion** — `int()`, `float()`, `str()`, `bool()` convert between types explicitly. `input()` always returns a string — convert immediately and wrap in `try/except` for safety.\n\n## The Bigger Picture\n\nOperators are the vocabulary of expressions, and expressions are the building blocks of every statement you will write. The next module puts them to work inside control flow — `if`, `elif`, `else`, and loops — where the boolean expressions you have practised here become the conditions that drive program behaviour.",
      "diagram": "flowchart TD\n    A[\"Operators &\nExpressions\"] --> B[\"Arithmetic\n+ - * / // % **\"]\n    A --> C[\"Assignment\n= += -= *= /=\"]\n    A --> D[\"Comparison\n== != < > <= >=\"]\n    A --> E[\"Logical\nand or not\"]\n    A --> F[\"String\n+ * in not in\"]\n    A --> G[\"Type Conversion\nint float str bool\"]\n    D --> H[\"Boolean Result\"]\n    E --> H\n    H --> I[\"Control Flow\n(next module)\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style I fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "All operator categories feed into boolean expressions, which drive control flow in the next module",
      "code": "# Everything from Module 3 in one program\nraw_score = input(\"Enter your score (0-100): \")\n\ntry:\n    score = int(raw_score)\nexcept ValueError:\n    print(f\"'{raw_score}' is not a valid number\")\n    exit()\n\n# Comparison + logical + precedence\nif not (0 <= score <= 100):\n    print(\"Score out of range\")\nelif score >= 90:\n    grade = \"A\"\nelif score >= 75:\n    grade = \"B\"\nelif score >= 50:\n    grade = \"C\"\nelse:\n    grade = \"F\"\n\n# String operators + type conversion\nlabel = \"Grade: \" + grade + \" (\" + str(score) + \"/100)\"\nprint(\"=\" * len(label))\nprint(label)\nprint(\"=\" * len(label))\n\n# Augmented assignment\nbonus = 0\nif grade in (\"A\", \"B\"):\n    bonus += 10\nprint(f\"Bonus points: {bonus}\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The most important habits from this module: always use `==` not `=` in conditions, always normalise string case before comparing, always convert `input()` results before doing arithmetic, and always add parentheses when mixing `and`/`or` in the same expression."
      },
      "keyPoints": [
        "Arithmetic → Comparison → Logical is the evaluation order to internalise",
        "`==` checks equality; `=` assigns — confusing them is a SyntaxError or logic bug",
        "`input()` always returns a string — convert with `int()`/`float()` and catch `ValueError`",
        "String operators `+`, `*`, `in` are case-sensitive — use `.lower()` for user input",
        "Parentheses cost nothing and prevent entire categories of precedence bugs"
      ],
      "tryIt": "Build a small calculator: read two numbers and an operator (+, -, *, /) from input. Use comparison operators to select the right operation, handle division by zero with a check, and print the result formatted as '10 + 5 = 15'. Use string operators to build the output line."
    }
  },
  // =========================
  // Python Module 4: Control Flow (if / elif / else)
  // =========================

  {
    "id": 40,
    "moduleId": 4,
    "moduleTitle": "Control Flow & Conditionals",
    "title": "What Is Control Flow?",
    "type": "lesson",
    "content": {
      "body": "Every program you have written so far runs the same way every time — top to bottom, one line after another, no matter what. That changes now. **Control flow** is the ability to make your program take different paths depending on data.\n\nWithout control flow, a program is just a fixed recipe. With control flow, it becomes a decision-making system that responds to input, handles different cases, and behaves differently based on what it finds.\n\n## The Three Control Flow Tools\n\nPython gives you three tools for controlling which code runs:\n\n**Conditionals** (`if`/`elif`/`else`) — run a block of code only when a condition is true. This is the subject of this module.\n\n**Loops** (`for`, `while`) — repeat a block of code multiple times. Covered in Module 5.\n\n**Functions** — package a block of code so it can be called from anywhere. Covered in Module 6.\n\n## How a Conditional Works\n\nA conditional asks a yes/no question — a boolean expression that evaluates to `True` or `False`. Based on the answer, Python runs one block of code or another. The block that does not match is skipped entirely.\n\n```\nIs the user logged in?\n  Yes → show dashboard\n  No  → show login page\n```\n\nThis is the fundamental pattern behind every login system, every form validator, every game, and every application that responds differently to different inputs.\n\n## Why This Changes Everything\n\nBefore control flow, your programs could only produce one fixed output. After this module, your programs will be able to handle multiple cases, validate input, make decisions, and respond to the real world.",
      "diagram": "flowchart TD\n    A[\"Program starts\"] --> B[\"Evaluate condition\"]\n    B -->|\"True\"| C[\"Run this block\"]\n    B -->|\"False\"| D[\"Skip / run else block\"]\n    C --> E[\"Continue program\"]\n    D --> E\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style E fill:#e2e8f0,stroke:#94a3b8,color:#1a1a1a",
      "diagramCaption": "A conditional evaluates a boolean expression and runs exactly one of two paths",
      "code": "# Without control flow — always the same output\nprint(\"Hello, user\")\n\n# With control flow — responds to data\nis_logged_in = True\n\nif is_logged_in:\n    print(\"Welcome back!\")\nelse:\n    print(\"Please log in\")\n\n# Change is_logged_in to False and run again\n# The program takes a completely different path",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Control flow does not change the order Python reads your code — it still reads top to bottom. What changes is which lines actually execute. Lines inside a block that does not match are read but skipped."
      },
      "keyPoints": [
        "Control flow lets a program take different paths based on data",
        "Without control flow, a program produces the same output every time",
        "Conditionals (if/elif/else) are the first and most fundamental control flow tool",
        "A condition is a boolean expression — it always evaluates to True or False",
        "Python still reads top to bottom — control flow determines which lines execute"
      ],
      "tryIt": "Write a program that stores a temperature value. Use an if/else to print 'Hot' if the temperature is above 30, or 'Cool' otherwise. Run it with several different values and confirm the correct branch runs each time."
    }
  },

  {
    "id": 41,
    "moduleId": 4,
    "moduleTitle": "Control Flow & Conditionals",
    "title": "The if Statement",
    "type": "lesson",
    "content": {
      "body": "The `if` statement is the most fundamental decision-making tool in Python. It runs a block of code only when a condition is `True`. If the condition is `False`, the block is skipped entirely and the program continues from the next unindented line.\n\n## Syntax\n\n```python\nif condition:\n    # code to run when condition is True\n```\n\nThree things are required:\n1. The keyword `if`\n2. A boolean expression (the condition)\n3. A colon `:` at the end of the line\n4. An indented block below it (4 spaces by convention)\n\n## The Condition\n\nThe condition can be any expression that evaluates to `True` or `False`. This includes comparison expressions (`age >= 18`), boolean variables (`is_active`), membership tests (`\"@\" in email`), and logical combinations (`age >= 18 and has_id`).\n\n## What Happens When the Condition Is False\n\nNothing. The indented block is skipped and Python moves to the next line at the same indentation level as the `if`. There is no error — the code simply does not run.\n\n## The if Statement Is Not a Loop\n\nA common misconception is that `if` repeats. It does not. The block runs at most once — either it runs (condition is `True`) or it does not (condition is `False`). Repetition is handled by loops, which come in Module 5.",
      "diagram": "flowchart TD\n    A[\"if condition:\"] --> B{\"condition\nTrue or False?\"}\n    B -->|\"True\"| C[\"Run indented\nblock\"]\n    B -->|\"False\"| D[\"Skip block\nentirely\"]\n    C --> E[\"Continue from\nnext unindented line\"]\n    D --> E\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#e2e8f0,stroke:#94a3b8,color:#1a1a1a",
      "diagramCaption": "The if block runs once if True, is skipped if False — execution always continues after",
      "code": "age = 20\n\n# Basic if — runs only when condition is True\nif age >= 18:\n    print(\"You are an adult\")\n    print(\"You can vote\")\n\nprint(\"This always runs\")  # outside the if block\n\n# Condition is False — block is skipped\nscore = 40\nif score >= 50:\n    print(\"Passed\")   # this does NOT run\n\nprint(\"Program continues\")  # this runs regardless\n\n# Any boolean expression works as a condition\nusername = \"alice\"\nif username:           # non-empty string is truthy\n    print(f\"Hello, {username}\")\n\nitems = []\nif not items:          # empty list is falsy\n    print(\"Your cart is empty\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never forget the colon at the end of the `if` line. `if age >= 18` without `:` raises a `SyntaxError` immediately. The colon tells Python that a block is about to start — it is required on every `if`, `elif`, `else`, `for`, `while`, and `def` line."
      },
      "keyPoints": [
        "The if block runs only when the condition evaluates to True",
        "A colon : is required at the end of every if line",
        "The block must be indented — 4 spaces is the Python standard",
        "When the condition is False, the block is silently skipped — no error",
        "Code after the if block (at the same indentation level) always runs"
      ],
      "tryIt": "Write a program that reads a number from input. Use an if statement to print 'Positive' if the number is greater than 0, 'Negative' if it is less than 0, and 'Zero' if it equals 0. Use three separate if statements (not elif — that comes next)."
    }
  },

  {
    "id": 42,
    "moduleId": 4,
    "moduleTitle": "Control Flow & Conditionals",
    "title": "The else Statement",
    "type": "lesson",
    "content": {
      "body": "A standalone `if` either runs its block or skips it. But often you need to do something in both cases — one action when the condition is `True`, a different action when it is `False`. That is what `else` is for.\n\n## Syntax\n\n```python\nif condition:\n    # runs when condition is True\nelse:\n    # runs when condition is False\n```\n\n`else` has no condition of its own. It is the catch-all — it runs whenever the `if` condition is `False`. Exactly one of the two blocks always runs, and the other is always skipped.\n\n## Guaranteed Coverage\n\nThe `if`/`else` structure guarantees that every possible case is handled. There is no situation where neither block runs, and no situation where both blocks run. This makes it the right tool whenever you have exactly two mutually exclusive outcomes.\n\n## else Does Not Stand Alone\n\n`else` cannot exist without an `if`. It must always be paired with one, at the same indentation level, with no code between them. Placing code between the `if` block and the `else` raises a `SyntaxError`.\n\n## When to Use else vs a Second if\n\nUse `else` when the two cases are mutually exclusive and exhaustive — when one must be true and the other must be false. Use a second `if` when the two conditions are independent and both could potentially be true at the same time.",
      "diagram": "flowchart TD\n    A[\"if condition:\"] --> B{\"True or False?\"}\n    B -->|\"True\"| C[\"if block runs\"]\n    B -->|\"False\"| D[\"else block runs\"]\n    C --> E[\"Continue\"]\n    D --> E\n    F[\"One block ALWAYS runs\nOne block NEVER runs\"] --> B\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style F fill:#e2e8f0,stroke:#94a3b8,color:#1a1a1a",
      "diagramCaption": "if/else guarantees exactly one branch always runs — no gaps, no overlaps",
      "code": "# Two-way decision — exactly one branch runs\nscore = 45\n\nif score >= 50:\n    print(\"Passed\")\nelse:\n    print(\"Failed\")\n\n# Real-world: login check\nis_logged_in = False\n\nif is_logged_in:\n    print(\"Welcome back!\")\nelse:\n    print(\"Please log in to continue\")\n\n# else vs second if — know the difference\nage = 20\nhas_id = True\n\n# Correct: mutually exclusive — use if/else\nif age >= 18:\n    print(\"Adult\")\nelse:\n    print(\"Minor\")\n\n# Independent conditions — use separate ifs\nif age >= 18:\n    print(\"Old enough\")\nif has_id:\n    print(\"Has ID\")   # both can print — they are independent",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "`else` has no condition — it never takes one. Writing `else age < 18:` is a `SyntaxError`. If you need to check a specific condition for the second branch, use `elif` instead (covered next). `else` is always unconditional — it is the fallback for everything the `if` did not catch."
      },
      "keyPoints": [
        "else runs when the if condition is False — it has no condition of its own",
        "Exactly one of the two blocks always runs — if/else has no gaps or overlaps",
        "else must be paired with an if at the same indentation level",
        "Use if/else for mutually exclusive outcomes; use two ifs for independent conditions",
        "else cannot take a condition — use elif if you need to check something specific"
      ],
      "tryIt": "Write a program that reads a username from input. If the username equals 'admin', print 'Welcome, administrator'. Otherwise print 'Welcome, guest'. Then extend it: if the username is empty, print 'Please enter a username' instead of the welcome message."
    }
  },

  {
    "id": 43,
    "moduleId": 4,
    "moduleTitle": "Control Flow & Conditionals",
    "title": "The elif Statement",
    "type": "lesson",
    "content": {
      "body": "`if`/`else` handles two cases. When you have three or more mutually exclusive cases, you need `elif` — short for \"else if\". It lets you chain multiple conditions in sequence without nesting, keeping your code flat and readable.\n\n## Syntax\n\n```python\nif condition_1:\n    # runs if condition_1 is True\nelif condition_2:\n    # runs if condition_1 is False AND condition_2 is True\nelif condition_3:\n    # runs if condition_1 and condition_2 are False AND condition_3 is True\nelse:\n    # runs if all conditions above are False\n```\n\n## How Python Evaluates the Chain\n\nPython checks conditions strictly top to bottom. The moment it finds one that is `True`, it runs that block and **skips all remaining elif and else branches** — even if a later condition would also be `True`. This means order matters.\n\n## Order Matters\n\nConsider a grade classifier. If you put `score >= 50` before `score >= 75`, a score of 80 would match the first condition and print \"C\" — never reaching the \"B\" branch. Always order conditions from most specific (highest threshold) to least specific.\n\n## else Is Optional\n\nYou can use `elif` without a final `else`. If no condition matches and there is no `else`, nothing runs. This is fine when \"do nothing\" is a valid outcome.",
      "diagram": "flowchart TD\n    A[\"if condition_1\"] -->|\"True\"| B[\"Run block 1\nstop\"]\n    A -->|\"False\"| C[\"elif condition_2\"]\n    C -->|\"True\"| D[\"Run block 2\nstop\"]\n    C -->|\"False\"| E[\"elif condition_3\"]\n    E -->|\"True\"| F[\"Run block 3\nstop\"]\n    E -->|\"False\"| G[\"else block\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "Python stops at the first True condition — remaining branches are never evaluated",
      "code": "# Grade classifier — order matters!\nscore = 82\n\nif score >= 90:\n    grade = \"A\"\nelif score >= 75:\n    grade = \"B\"\nelif score >= 50:\n    grade = \"C\"\nelse:\n    grade = \"F\"\n\nprint(f\"Grade: {grade}\")   # Grade: B\n\n# Why order matters — broken version\nscore2 = 82\nif score2 >= 50:           # matches first — stops here!\n    print(\"C\")\nelif score2 >= 75:         # never reached\n    print(\"B\")\n\n# Multiple elif — time of day greeter\nhour = 14\n\nif hour < 12:\n    greeting = \"Good morning\"\nelif hour < 17:\n    greeting = \"Good afternoon\"\nelif hour < 21:\n    greeting = \"Good evening\"\nelse:\n    greeting = \"Good night\"\n\nprint(greeting)   # Good afternoon\n\n# elif without else — valid when no match is fine\ncommand = \"quit\"\nif command == \"start\":\n    print(\"Starting...\")\nelif command == \"stop\":\n    print(\"Stopping...\")\nelif command == \"quit\":\n    print(\"Quitting...\")   # this runs",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Order your elif conditions from most specific to least specific. With numeric ranges, always put the highest threshold first. A score of 95 matches `score >= 50`, `score >= 75`, and `score >= 90` — Python runs whichever comes first and ignores the rest. Getting the order wrong produces silent logic bugs with no error message."
      },
      "keyPoints": [
        "elif chains multiple conditions — Python runs the first True branch and skips the rest",
        "Conditions are evaluated strictly top to bottom — order determines the result",
        "Always order from most specific to least specific for numeric range checks",
        "A final else is optional — omit it when no match is a valid outcome",
        "elif is cleaner than nested ifs for mutually exclusive multi-case decisions"
      ],
      "tryIt": "Write a BMI classifier. Read a BMI value from input and print the category: Underweight (< 18.5), Normal (18.5–24.9), Overweight (25–29.9), Obese (>= 30). Then deliberately swap two of the elif conditions and observe how the output changes for a value that falls in the affected range."
    }
  },

  {
    "id": 45,
    "moduleId": 4,
    "moduleTitle": "Control Flow & Conditionals",
    "title": "Indentation in Python",
    "type": "lesson",
    "content": {
      "body": "In most programming languages, code blocks are defined with curly braces `{}`. Python takes a different approach — it uses **indentation**. The amount of whitespace at the start of a line determines which block it belongs to. This is not a style preference — it is enforced by the language.\n\n## The Rule\n\nAny line that follows a colon (`:`) must be indented. All lines at the same indentation level belong to the same block. The block ends when indentation returns to the previous level.\n\n```python\nif condition:\n    line_1   # inside the if block\n    line_2   # inside the if block\nline_3       # outside — back to previous level\n```\n\n## 4 Spaces Is the Standard\n\nPEP 8 — Python's official style guide — specifies 4 spaces per indentation level. Most editors insert 4 spaces automatically when you press Tab. Never mix tabs and spaces — Python 3 raises an `IndentationError` if you do.\n\n## Nested Blocks\n\nEach level of nesting adds another 4 spaces. An `if` inside another `if` is indented 8 spaces. An `if` inside that is 12 spaces. Deep nesting is a signal that the code should be refactored.\n\n## Why Python Does This\n\nIndentation-as-syntax forces readable code. In languages with braces, developers argue about where to put them. In Python, the structure of the code is always visible in how it is formatted — there is no hidden structure.",
      "diagram": "flowchart TD\n    A[\"if condition:\"] --> B[\"    block line 1\n    (4 spaces)\"]\n    B --> C[\"    block line 2\n    (4 spaces)\"]\n    C --> D[\"back to level 0\n(block ended)\"]\n    E[\"if outer:\"] --> F[\"    if inner:\n    (4 spaces)\"]\n    F --> G[\"        nested block\n        (8 spaces)\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#e2e8f0,stroke:#94a3b8,color:#1a1a1a\n    style E fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style G fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Each indentation level is 4 spaces — nesting adds another 4 spaces per level",
      "code": "# Correct indentation — 4 spaces per level\nscore = 72\n\nif score >= 50:\n    print(\"Passed\")          # 4 spaces — inside if\n    if score >= 75:\n        print(\"With merit\")  # 8 spaces — inside nested if\n    print(\"Well done\")       # 4 spaces — back to outer if\nprint(\"Done\")                # 0 spaces — outside everything\n\n# IndentationError examples — these will crash:\n\n# if score >= 50:\n#   print(\"2 spaces\")   # inconsistent — IndentationError\n#   print(\"3 spaces\")   # mixing levels\n\n# if score >= 50:\n#     print(\"ok\")\n#    print(\"3 spaces\")  # wrong level — IndentationError\n\n# Tabs vs spaces — never mix them\n# Use your editor's Tab key — configure it to insert 4 spaces",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Configure your editor to insert 4 spaces when you press Tab — not a tab character. Mixing actual tab characters with spaces causes `TabError: inconsistent use of tabs and spaces in indentation`. VS Code, PyCharm, and most editors have a setting for this. Check the bottom status bar — it should say 'Spaces: 4'."
      },
      "keyPoints": [
        "Python uses indentation to define code blocks — not curly braces",
        "4 spaces per indentation level is the PEP 8 standard",
        "All lines at the same indentation level belong to the same block",
        "Mixing tabs and spaces raises a TabError — configure your editor to use spaces",
        "Deep nesting (more than 2–3 levels) is a signal to refactor"
      ],
      "tryIt": "Take this broken code and fix the indentation: `if True: print('a') print('b') if False: print('c') print('d')` — written all on one line or with wrong indentation. Rewrite it so 'a' and 'b' are inside the first if, 'c' is inside the second if, and 'd' always runs."
    }
  },

  {
    "id": 46,
    "moduleId": 4,
    "moduleTitle": "Control Flow & Conditionals",
    "title": "Nested Conditions",
    "type": "lesson",
    "content": {
      "body": "A nested condition is an `if` statement placed inside another `if` block. It lets you check a more specific condition only after a broader one has already passed. Nesting is valid and sometimes necessary — but it should be used sparingly.\n\n## When Nesting Makes Sense\n\nNest when the inner check only makes sense if the outer check already passed. For example, checking whether a user has a premium subscription only makes sense after confirming they are logged in. Checking the inner condition first would be meaningless.\n\n```python\nif is_logged_in:\n    if is_premium:\n        show_premium_content()\n    else:\n        show_standard_content()\nelse:\n    redirect_to_login()\n```\n\n## The Flat Alternative\n\nMost nested conditions can be rewritten using `and` to combine the conditions into a single flat check. This is usually cleaner and easier to read:\n\n```python\n# Nested\nif age >= 18:\n    if has_id:\n        print(\"Entry allowed\")\n\n# Flat — same logic, less nesting\nif age >= 18 and has_id:\n    print(\"Entry allowed\")\n```\n\n## The Two-Level Rule\n\nAs a practical guideline, avoid going deeper than two levels of nesting. Three or more levels of nested `if` statements are a strong signal that the logic should be broken into separate functions or rewritten using guard clauses.",
      "diagram": "flowchart TD\n    A[\"if outer:\"] -->|\"True\"| B[\"if inner:\"]\n    A -->|\"False\"| C[\"outer else\"]\n    B -->|\"True\"| D[\"inner block\"]\n    B -->|\"False\"| E[\"inner else\"]\n    D --> F[\"Continue\"]\n    E --> F\n    C --> F\n    G[\"Flat alternative:\nif outer and inner:\"] --> D\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Nesting checks a sub-condition only when the outer condition passes — often replaceable with and",
      "code": "# Nested — inner check only valid after outer passes\nage = 20\nhas_id = True\nis_member = True\n\nif age >= 18:\n    if has_id:\n        if is_member:\n            print(\"Member discount applied\")\n        else:\n            print(\"Entry allowed — no discount\")\n    else:\n        print(\"ID required\")\nelse:\n    print(\"Must be 18 or older\")\n\n# Flat rewrite — same logic, much cleaner\nif age >= 18 and has_id and is_member:\n    print(\"Member discount applied\")\nelif age >= 18 and has_id:\n    print(\"Entry allowed — no discount\")\nelif age >= 18:\n    print(\"ID required\")\nelse:\n    print(\"Must be 18 or older\")\n\n# Guard clause pattern — reject early, keep happy path flat\ndef process_order(user, item):\n    if user is None:\n        return \"No user\"\n    if not user.get(\"active\"):\n        return \"Account inactive\"\n    if item is None:\n        return \"No item\"\n    return f\"Order placed for {item}\"",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "The guard clause pattern is the professional alternative to deep nesting. Instead of nesting the happy path deeper and deeper, check each failure condition at the top and return early. The successful case stays at the leftmost indentation level — flat, readable, and easy to follow."
      },
      "keyPoints": [
        "Nest conditions when the inner check only makes sense after the outer check passes",
        "Most two-level nesting can be replaced with and to create a flat condition",
        "Avoid more than two levels of nesting — it signals a need to refactor",
        "Guard clauses check failure conditions early and return, keeping the happy path flat",
        "Flat code is easier to read, test, and debug than deeply nested code"
      ],
      "tryIt": "Write a function process_payment(amount, balance, is_verified) that uses guard clauses: return 'Not verified' if not verified, return 'Insufficient funds' if balance < amount, otherwise return 'Payment successful'. Write it first with nested ifs, then rewrite it using guard clauses and compare the two versions."
    }
  },

  {
    "id": 47,
    "moduleId": 4,
    "moduleTitle": "Control Flow & Conditionals",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Control flow errors are among the most common bugs beginners write — and the most instructive to fix. Most of them produce either a `SyntaxError` (caught immediately) or a silent logic bug (no error, wrong output). The silent ones are harder to find.\n\n## Mistake 1 — Using = Instead of ==\n\n`=` assigns a value. `==` compares two values. Writing `if age = 18:` is a `SyntaxError` in Python. In some other languages it silently assigns and always evaluates to `True` — Python protects you from this, but the habit of using `==` in conditions must be deliberate.\n\n## Mistake 2 — Missing the Colon\n\nEvery `if`, `elif`, and `else` line must end with `:`. Forgetting it raises a `SyntaxError` immediately. This is the single most common first-day error.\n\n## Mistake 3 — Wrong Indentation\n\nCode that should be inside a block but is not indented correctly either raises an `IndentationError` or silently runs outside the block — producing wrong results with no error message.\n\n## Mistake 4 — Wrong elif Order\n\nConditions in an `if`/`elif` chain are checked top to bottom. If a broader condition appears before a narrower one, the narrower one is never reached. This produces no error — just wrong output.\n\n## Mistake 5 — Comparing with or Incorrectly\n\n`if x == 1 or 2:` does not check whether x is 1 or 2. It checks `(x == 1) or 2` — and since `2` is always truthy, the condition is always `True`. Always write `if x == 1 or x == 2:`.",
      "diagram": "flowchart TD\n    A[\"Common Mistakes\"] --> B[\"= instead of ==\nSyntaxError\"]\n    A --> C[\"Missing colon :\nSyntaxError\"]\n    A --> D[\"Wrong indentation\nIndentationError or silent bug\"]\n    A --> E[\"Wrong elif order\nSilent logic bug\"]\n    A --> F[\"if x == 1 or 2\nAlways True — silent bug\"]\n    B --> G[\"Caught immediately\"]\n    C --> G\n    D --> H[\"May be silent ⚠\"]\n    E --> H\n    F --> H\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "SyntaxErrors are caught immediately — silent logic bugs require careful testing to find",
      "code": "# Mistake 1 — = vs ==\nage = 18\n# if age = 18:        # SyntaxError\nif age == 18:         # correct\n    print(\"Adult\")\n\n# Mistake 2 — missing colon\n# if age == 18        # SyntaxError: expected ':'\nif age == 18:         # correct\n    print(\"Adult\")\n\n# Mistake 3 — indentation\nscore = 75\nif score >= 50:\n    print(\"Passed\")\n    print(\"Well done\")   # inside block — correct\nprint(\"Always runs\")     # outside block — correct\n\n# Mistake 4 — wrong elif order (silent bug)\n# WRONG — score 85 prints \"C\" not \"B\"\nif score >= 50:\n    print(\"C\")\nelif score >= 75:      # never reached for score=85\n    print(\"B\")\n\n# CORRECT — most specific first\nif score >= 75:\n    print(\"B\")\nelif score >= 50:\n    print(\"C\")\n\n# Mistake 5 — or with incomplete comparison\nx = 3\nprint(x == 1 or 2)    # True — always! (2 is truthy)\nprint(x == 1 or x == 2)  # False — correct",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Silent logic bugs are far more dangerous than SyntaxErrors. A SyntaxError stops your program immediately and points to the line. A silent bug lets your program run, produce wrong results, and potentially affect real users before anyone notices. Always test your conditionals with values that should hit each branch."
      },
      "keyPoints": [
        "Use == for comparison in conditions — = is assignment and causes a SyntaxError",
        "Every if/elif/else line must end with a colon — forgetting it is the most common first error",
        "Wrong indentation either crashes immediately or silently runs code in the wrong place",
        "Order elif from most specific to least specific — wrong order causes silent logic bugs",
        "`if x == 1 or 2` is always True — always write the full comparison on each side"
      ],
      "tryIt": "Find and fix all five bugs in this code: `if score = 100: print('Perfect') elif score >= 90 print('A') elif score >= 50: print('Pass') elif score >= 75: print('B') else: print('Fail')`. There is one of each mistake type from this lesson."
    }
  },

  {
    "id": 48,
    "moduleId": 4,
    "moduleTitle": "Control Flow & Conditionals",
    "title": "Module 4 Summary",
    "type": "lesson",
    "content": {
      "body": "This module introduced control flow — the ability to make your program take different paths based on data. You now have the tools to write programs that respond to input, handle multiple cases, and make decisions.\n\n## What You Learned\n\n**Control flow** is the mechanism that determines which lines of code actually execute. Without it, every program produces the same output every time.\n\n**The if statement** runs a block only when its condition is `True`. The block is silently skipped when the condition is `False`. Every `if` line ends with a colon and its block is indented 4 spaces.\n\n**The else statement** provides a fallback — it runs when the `if` condition is `False`. Exactly one of the two branches always runs. `else` takes no condition of its own.\n\n**The elif statement** chains multiple conditions. Python checks them top to bottom and runs the first `True` branch, skipping all others. Order from most specific to least specific.\n\n**Boolean expressions** — any expression evaluating to `True` or `False` is a valid condition. Combine with `and`/`or`/`not`, use truthiness directly, and store complex conditions in named variables.\n\n**Indentation** defines block boundaries. 4 spaces per level is the standard. Never mix tabs and spaces.\n\n**Nested conditions** are valid but should be kept shallow. Most nesting can be replaced with `and` or guard clauses.\n\n## What Is Coming Next\n\nModule 5 introduces **loops** — `for` and `while`. Where conditionals run a block at most once, loops run a block repeatedly. Combined with conditionals, loops let you process collections, repeat actions until a condition changes, and build programs that handle real-world data at scale.",
      "diagram": "flowchart TD\n    A[\"✅ Control Flow\nconcept\"] --> B[\"✅ if statement\ncondition + block\"]\n    B --> C[\"✅ else\nfallback branch\"]\n    C --> D[\"✅ elif\nmulti-case chain\"]\n    D --> E[\"✅ Boolean\nexpressions\"]\n    E --> F[\"✅ Indentation\nblock boundaries\"]\n    F --> G[\"✅ Nested\nconditions\"]\n    G --> H[\"➡️ Loops\nfor & while\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 4 complete — conditionals are the foundation for loops and all program logic",
      "code": "# Everything from Module 4 in one program\ndef classify_user(age, balance, is_verified):\n    # Guard clauses — reject invalid cases early\n    if not is_verified:\n        return \"Account not verified\"\n    if age < 13:\n        return \"Too young to register\"\n\n    # elif chain — mutually exclusive tiers\n    if balance >= 1000:\n        tier = \"Premium\"\n    elif balance >= 100:\n        tier = \"Standard\"\n    else:\n        tier = \"Basic\"\n\n    return f\"Age {age} — {tier} account\"\n\nprint(classify_user(25, 500, True))   # Age 25 — Standard account\nprint(classify_user(10, 500, True))   # Too young to register\nprint(classify_user(25, 500, False))  # Account not verified\nprint(classify_user(30, 1500, True))  # Age 30 — Premium account",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The pattern in the code above — guard clauses first, then the main logic — is the professional standard for writing conditionals. It keeps the happy path at the leftmost indentation level and makes each failure case explicit and easy to find."
      },
      "keyPoints": [
        "if/elif/else lets programs take different paths based on boolean expressions",
        "elif chains check top to bottom — first True branch runs, rest are skipped",
        "else is the unconditional fallback — it takes no condition",
        "Indentation defines blocks — 4 spaces per level, never mix tabs and spaces",
        "Guard clauses keep logic flat — check failures early and return, keep the happy path clean"
      ]
    }
  },
  // =========================
  // Python Module 5: Loops (for / while)
  // =========================

  {
    "id": 49,
    "moduleId": 5,
    "moduleTitle": "Loops",
    "title": "What Is a Loop?",
    "type": "lesson",
    "content": {
      "body": "A loop is a control flow structure that repeats a block of code multiple times. Without loops, repeating an action means copying and pasting the same lines — which is fragile, verbose, and impossible when you do not know in advance how many times something needs to run.\n\n## Why Loops Exist\n\nConsider printing the numbers 1 to 100. Without a loop you would need 100 `print()` calls. With a loop, you need two lines. More importantly, loops let you process data of unknown size — a list of users, lines in a file, results from an API — where the number of repetitions is determined at runtime, not when you write the code.\n\n## The Two Loop Types in Python\n\n**`for` loops** iterate over a sequence — a list, a string, a range of numbers, or any iterable. You use a `for` loop when you know what you are iterating over.\n\n**`while` loops** repeat as long as a condition remains `True`. You use a `while` loop when you do not know how many iterations are needed — for example, keep asking for input until the user enters something valid.\n\n## Loop Anatomy\n\nEvery loop has three parts:\n1. **The header** — defines what to iterate over or what condition to check\n2. **The body** — the indented block that runs on each iteration\n3. **The termination** — what causes the loop to stop\n\nUnderstanding termination is critical. A loop that never stops is called an **infinite loop** — it runs forever and freezes your program.",
      "diagram": "flowchart TD\n    A[\"Start loop\"] --> B{\"Condition\nor items left?\"}\n    B -->|\"Yes\"| C[\"Run body\"]\n    C --> D[\"Next iteration\"]\n    D --> B\n    B -->|\"No\"| E[\"Exit loop\"]\n    E --> F[\"Continue program\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Every loop checks a condition, runs the body, then checks again — until the condition is False",
      "code": "# Without a loop — repetitive and fragile\nprint(1)\nprint(2)\nprint(3)\n# ... 97 more lines\n\n# With a for loop — clean and scalable\nfor number in range(1, 101):\n    print(number)\n\n# With a while loop — runs until condition is False\ncount = 1\nwhile count <= 5:\n    print(count)\n    count += 1   # must update — otherwise infinite loop!\n\n# Loops work on any collection\nfruits = [\"apple\", \"banana\", \"cherry\"]\nfor fruit in fruits:\n    print(fruit)",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Every `while` loop must have something inside it that eventually makes the condition `False`. Forgetting to update the variable being checked creates an infinite loop — your program will run forever. If this happens, press Ctrl+C in the terminal to stop it."
      },
      "keyPoints": [
        "Loops repeat a block of code without copying and pasting",
        "for loops iterate over a known sequence — list, string, range, or any iterable",
        "while loops repeat as long as a condition is True — used when iteration count is unknown",
        "Every loop has a header, a body, and a termination condition",
        "A loop that never terminates is an infinite loop — always ensure the condition can become False"
      ],
      "tryIt": "Write a for loop that prints every even number from 2 to 20. Then write a while loop that starts at 100 and keeps halving the value (integer division by 2) until it reaches 0, printing each value. How many iterations does the while loop take?"
    }
  },

  {
    "id": 50,
    "moduleId": 5,
    "moduleTitle": "Loops",
    "title": "The for Loop",
    "type": "lesson",
    "content": {
      "body": "The `for` loop iterates over a sequence, running its body once for each item. On each iteration, the current item is assigned to the loop variable, which you can use inside the body.\n\n## Syntax\n\n```python\nfor variable in iterable:\n    # body — runs once per item\n```\n\nThe `variable` is created automatically by the loop — you do not need to define it beforehand. The `iterable` is anything Python can iterate over: a list, string, tuple, dictionary, range, or file.\n\n## The Loop Variable\n\nThe loop variable holds the current item on each iteration. You can name it anything, but it should describe what each item is — `fruit` for a list of fruits, `user` for a list of users, `line` for lines in a file. Using `i` is acceptable for numeric ranges.\n\n## Iterating Over Different Types\n\n`for` works on any iterable:\n- **List** — each element in order\n- **String** — each character in order\n- **Dictionary** — each key by default (use `.items()` for key-value pairs)\n- **range()** — a sequence of numbers (covered in the next lesson)\n\n## After the Loop\n\nThe loop variable retains its last value after the loop ends. This is occasionally useful but can also be a source of confusion — be aware that the variable persists after the loop body finishes.",
      "diagram": "flowchart TD\n    A[\"for item in iterable:\"] --> B[\"item = first element\"]\n    B --> C[\"Run body with item\"]\n    C --> D{\"More\nitems?\"}\n    D -->|\"Yes\"| E[\"item = next element\"]\n    E --> C\n    D -->|\"No\"| F[\"Loop ends\nitem = last value\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "The loop variable is updated automatically on each iteration — no manual incrementing needed",
      "code": "# Iterating over a list\nfruits = [\"apple\", \"banana\", \"cherry\"]\nfor fruit in fruits:\n    print(fruit.upper())\n\n# Iterating over a string — character by character\nfor char in \"Python\":\n    print(char)\n\n# Iterating over a dictionary\nscores = {\"Alice\": 92, \"Bob\": 78, \"Carol\": 85}\nfor name in scores:           # keys only\n    print(name)\n\nfor name, score in scores.items():   # key-value pairs\n    print(f\"{name}: {score}\")\n\n# Loop variable persists after loop\nfor x in [10, 20, 30]:\n    pass\nprint(x)   # 30 — last value\n\n# Nested for loops\nfor row in range(1, 4):\n    for col in range(1, 4):\n        print(f\"({row},{col})\", end=\" \")\n    print()",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use descriptive loop variable names. `for fruit in fruits` is immediately clear. `for x in fruits` forces the reader to look up what `x` is. The one exception is short numeric loops where `i`, `j`, `k` are universally understood as index counters."
      },
      "keyPoints": [
        "for loops iterate over any iterable — list, string, dict, range, file, and more",
        "The loop variable is assigned automatically on each iteration",
        "Use descriptive loop variable names that describe what each item is",
        "Use .items() to iterate over both keys and values in a dictionary",
        "The loop variable retains its last value after the loop ends"
      ],
      "tryIt": "Write a for loop over a list of five prices. Calculate and print the total, the average, and the most expensive item. Do it all in a single loop pass — do not loop multiple times."
    }
  },

  {
    "id": 51,
    "moduleId": 5,
    "moduleTitle": "Loops",
    "title": "The range() Function",
    "type": "lesson",
    "content": {
      "body": "`range()` generates a sequence of integers on demand. It is the standard way to loop a specific number of times or iterate over numeric sequences without creating a list in memory.\n\n## Three Forms\n\n**`range(stop)`** — generates integers from 0 up to (but not including) `stop`.\n`range(5)` → 0, 1, 2, 3, 4\n\n**`range(start, stop)`** — generates integers from `start` up to (but not including) `stop`.\n`range(1, 6)` → 1, 2, 3, 4, 5\n\n**`range(start, stop, step)`** — generates integers from `start` to `stop` with a custom step.\n`range(0, 10, 2)` → 0, 2, 4, 6, 8\n`range(10, 0, -1)` → 10, 9, 8, 7, 6, 5, 4, 3, 2, 1\n\n## Stop Is Exclusive\n\nThe `stop` value is never included in the sequence. `range(1, 10)` gives 1 through 9, not 10. This is consistent with Python's slicing behaviour and means `range(len(items))` gives valid indices for a list of any length.\n\n## range() Is Lazy\n\n`range()` does not create a list in memory — it generates each number only when needed. `range(1000000)` uses almost no memory. If you need an actual list, wrap it: `list(range(5))`.",
      "diagram": "flowchart LR\n    A[\"range(5)\"] --> B[\"0 1 2 3 4\"]\n    C[\"range(1, 6)\"] --> D[\"1 2 3 4 5\"]\n    E[\"range(0, 10, 2)\"] --> F[\"0 2 4 6 8\"]\n    G[\"range(5, 0, -1)\"] --> H[\"5 4 3 2 1\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "range(stop), range(start, stop), range(start, stop, step) — stop is always exclusive",
      "code": "# range(stop) — 0 to stop-1\nfor i in range(5):\n    print(i)   # 0 1 2 3 4\n\n# range(start, stop) — start to stop-1\nfor i in range(1, 6):\n    print(i)   # 1 2 3 4 5\n\n# range(start, stop, step) — custom increment\nfor i in range(0, 11, 2):\n    print(i)   # 0 2 4 6 8 10\n\n# Countdown with negative step\nfor i in range(5, 0, -1):\n    print(i)   # 5 4 3 2 1\nprint(\"Go!\")\n\n# Loop n times (common pattern)\nn = 3\nfor _ in range(n):   # _ means \"I don't need the value\"\n    print(\"Hello\")\n\n# Access list by index\nitems = [\"a\", \"b\", \"c\", \"d\"]\nfor i in range(len(items)):\n    print(f\"Index {i}: {items[i]}\")\n\n# Convert to list when you need one\nprint(list(range(1, 6)))   # [1, 2, 3, 4, 5]",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Use `_` as the loop variable when you need to repeat something n times but do not need the iteration value. `for _ in range(3): print('hello')` is the idiomatic Python way to say 'do this 3 times'. The underscore signals to readers that the variable is intentionally unused."
      },
      "keyPoints": [
        "range(stop) generates 0 to stop-1; range(start, stop) generates start to stop-1",
        "The stop value is always exclusive — range(1, 10) gives 1 through 9",
        "range(start, stop, step) supports custom increments including negative steps for countdowns",
        "range() is lazy — it generates numbers on demand without storing them in memory",
        "Use _ as the loop variable when you only need to repeat n times and don't need the value"
      ],
      "tryIt": "Use range() to print a multiplication table for 7 (7×1 through 7×12). Then use a negative step to print all odd numbers from 99 down to 1. Finally, use range(len()) to iterate over a list of your choice and print each item with its index."
    }
  },

  {
    "id": 52,
    "moduleId": 5,
    "moduleTitle": "Loops",
    "title": "Looping Over Collections",
    "type": "lesson",
    "content": {
      "body": "The `for` loop works on any Python collection — lists, strings, tuples, dictionaries, and sets. Each type has its own iteration behaviour, and knowing how to loop over each one is an essential everyday skill.\n\n## Lists and Tuples\n\nIterating over a list or tuple gives you each element in order. This is the most common loop pattern in Python.\n\n## Strings\n\nIterating over a string gives you each character one at a time. This is useful for character-level processing — counting vowels, checking for specific characters, or building transformed strings.\n\n## Dictionaries\n\nIterating over a dictionary by default gives you the **keys**. Use `.values()` to get values only, and `.items()` to get key-value pairs as tuples. `.items()` is the most commonly used pattern when you need both.\n\n## Sets\n\nSets are unordered — iterating over a set gives you all elements but in no guaranteed order. Do not rely on iteration order with sets.\n\n## List Comprehensions — The Compact Alternative\n\nFor simple transformations, Python offers **list comprehensions** — a concise way to build a new list from a loop in a single line:\n\n```python\nsquares = [x ** 2 for x in range(1, 6)]\n# [1, 4, 9, 16, 25]\n```\n\nThis is equivalent to a for loop that appends to a list, but more readable and faster.",
      "diagram": "flowchart TD\n    A[\"for loop\"] --> B[\"List / Tuple\neach element in order\"]\n    A --> C[\"String\neach character\"]\n    A --> D[\"Dict keys\nfor k in d\"]\n    A --> E[\"Dict items\nfor k,v in d.items()\"]\n    A --> F[\"Set\neach element\n(unordered)\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#e2e8f0,stroke:#94a3b8,color:#1a1a1a",
      "diagramCaption": "for works on any iterable — behaviour depends on the collection type",
      "code": "# List — elements in order\ncolours = [\"red\", \"green\", \"blue\"]\nfor colour in colours:\n    print(colour)\n\n# String — character by character\nvowels = 0\nfor char in \"Hello, Python!\":\n    if char.lower() in \"aeiou\":\n        vowels += 1\nprint(f\"Vowels: {vowels}\")\n\n# Dictionary — keys, values, items\nscores = {\"Alice\": 92, \"Bob\": 78, \"Carol\": 85}\n\nfor key in scores:                    # keys\n    print(key)\n\nfor value in scores.values():         # values\n    print(value)\n\nfor name, score in scores.items():    # both\n    grade = \"Pass\" if score >= 50 else \"Fail\"\n    print(f\"{name}: {score} — {grade}\")\n\n# List comprehension — compact transformation\nnumbers = [1, 2, 3, 4, 5]\nsquares = [n ** 2 for n in numbers]\nevens = [n for n in numbers if n % 2 == 0]\nprint(squares)   # [1, 4, 9, 16, 25]\nprint(evens)     # [2, 4]",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use `.items()` whenever you need both the key and value from a dictionary — it is cleaner than looking up `d[key]` inside the loop. `for name, score in scores.items()` unpacks each key-value tuple directly into two variables, making the loop body read naturally."
      },
      "keyPoints": [
        "for loops work on lists, tuples, strings, dicts, sets, and any iterable",
        "Iterating a dict gives keys by default — use .values() or .items() for more",
        "String iteration gives one character per iteration",
        "Sets are unordered — do not rely on iteration order",
        "List comprehensions are the concise alternative to build-and-append loops"
      ],
      "tryIt": "Given a dictionary of student names and scores, write a loop that prints only the students who scored 75 or above, formatted as 'Alice: 92 — Merit'. Then use a list comprehension to build a list of just the passing names (score >= 50)."
    }
  },

  {
    "id": 53,
    "moduleId": 5,
    "moduleTitle": "Loops",
    "title": "The while Loop",
    "type": "lesson",
    "content": {
      "body": "The `while` loop repeats its body as long as a condition remains `True`. Unlike `for`, which iterates over a known sequence, `while` is used when you do not know in advance how many iterations are needed.\n\n## Syntax\n\n```python\nwhile condition:\n    # body — runs as long as condition is True\n```\n\nPython checks the condition before each iteration. If it is `True`, the body runs. If it is `False`, the loop exits. If the condition is `False` on the very first check, the body never runs at all.\n\n## When to Use while\n\nThe classic use cases for `while` are:\n- **Input validation** — keep asking until the user enters valid data\n- **Game loops** — keep running until the player quits or loses\n- **Polling** — keep checking until a condition changes\n- **Unknown iteration count** — processing a stream where you do not know the length\n\n## The Update Step\n\nEvery `while` loop must have something inside it that eventually makes the condition `False`. This is usually an increment, a decrement, or a state change. Forgetting the update step creates an infinite loop.\n\n## while True with break\n\nA common pattern is `while True:` — an intentionally infinite loop that you exit explicitly with `break`. This is clean when the exit condition is complex or checked in the middle of the body rather than at the top.",
      "diagram": "flowchart TD\n    A[\"while condition:\"] --> B{\"condition\nTrue?\"}\n    B -->|\"True\"| C[\"Run body\"]\n    C --> D[\"Update state\"]\n    D --> B\n    B -->|\"False\"| E[\"Exit loop\"]\n    F[\"while True:\"] --> G[\"Run body\"]\n    G --> H{\"break\ncondition?\"}\n    H -->|\"Yes\"| I[\"break — exit\"]\n    H -->|\"No\"| G\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#3776ab,color:#fff,stroke:#3776ab\n    style I fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "while checks before each iteration — always ensure the condition can become False",
      "code": "# Basic while — countdown\ncount = 5\nwhile count > 0:\n    print(count)\n    count -= 1   # update — moves toward False\nprint(\"Blast off!\")\n\n# Input validation — keep asking until valid\nwhile True:\n    age = input(\"Enter your age: \")\n    if age.isdigit() and int(age) > 0:\n        age = int(age)\n        break\n    print(\"Please enter a valid age\")\nprint(f\"Age accepted: {age}\")\n\n# Unknown iteration count — find first match\nnumbers = [4, 7, 2, 9, 1, 5, 8]\ntarget = 9\nindex = 0\nwhile index < len(numbers):\n    if numbers[index] == target:\n        print(f\"Found {target} at index {index}\")\n        break\n    index += 1\n\n# while condition is False from the start — body never runs\nx = 10\nwhile x < 5:\n    print(\"This never prints\")\nprint(\"Loop skipped entirely\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "The most common `while` bug is forgetting the update step. If `count` never changes, `while count > 0` is always `True` and the loop runs forever. Before writing a `while` loop, ask yourself: what changes on each iteration that will eventually make the condition `False`?"
      },
      "keyPoints": [
        "while repeats as long as its condition is True — used when iteration count is unknown",
        "Python checks the condition before each iteration — if False from the start, body never runs",
        "Every while loop needs an update step that eventually makes the condition False",
        "while True with break is the clean pattern for loops with complex exit conditions",
        "Classic uses: input validation, game loops, polling, processing unknown-length streams"
      ],
      "tryIt": "Write a number guessing game using a while loop. Generate a target number (you can hardcode it as 42). Keep asking the user to guess. Print 'Too high', 'Too low', or 'Correct!' on each guess. Count the attempts and print the total when they get it right."
    }
  },

  {
    "id": 54,
    "moduleId": 5,
    "moduleTitle": "Loops",
    "title": "break and continue",
    "type": "lesson",
    "content": {
      "body": "`break` and `continue` give you fine-grained control over loop execution. They let you exit a loop early or skip specific iterations without restructuring the entire loop.\n\n## break — Exit the Loop Immediately\n\n`break` stops the loop entirely and jumps to the first line after the loop body. It is used when you have found what you were looking for and there is no point continuing.\n\n```python\nfor item in items:\n    if item == target:\n        print(\"Found it!\")\n        break   # no need to check the rest\n```\n\n## continue — Skip to the Next Iteration\n\n`continue` skips the rest of the current iteration and jumps back to the loop header to check the next item. The loop does not stop — it just skips the current cycle.\n\n```python\nfor number in range(10):\n    if number % 2 == 0:\n        continue   # skip even numbers\n    print(number)  # only odd numbers reach here\n```\n\n## else on a Loop\n\nPython has a rarely-known feature: a `for` or `while` loop can have an `else` clause. The `else` block runs only if the loop completed normally — without hitting a `break`. This is useful for search loops where you want to know if the target was never found.\n\n## Use Sparingly\n\nBoth `break` and `continue` make loops harder to reason about. Use them when they genuinely simplify the logic — not as a substitute for writing a clear condition.",
      "diagram": "flowchart TD\n    A[\"Loop iteration\"] --> B{\"break\ncondition?\"}\n    B -->|\"Yes\"| C[\"break\nExit loop entirely\"]\n    B -->|\"No\"| D{\"continue\ncondition?\"}\n    D -->|\"Yes\"| E[\"continue\nSkip to next iteration\"]\n    D -->|\"No\"| F[\"Run rest of body\"]\n    E --> A\n    F --> A\n    C --> G[\"Code after loop\"]\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style A fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "break exits the loop entirely; continue skips only the current iteration",
      "code": "# break — stop when found\nnames = [\"Alice\", \"Bob\", \"Carol\", \"Dave\"]\nsearch = \"Carol\"\nfor name in names:\n    if name == search:\n        print(f\"Found: {name}\")\n        break\nelse:\n    print(\"Not found\")   # runs only if no break occurred\n\n# continue — skip unwanted items\nfor n in range(1, 11):\n    if n % 2 == 0:\n        continue        # skip even numbers\n    print(n)            # 1 3 5 7 9\n\n# break in while — clean exit pattern\nattempts = 0\nwhile True:\n    guess = input(\"Guess (1-10): \")\n    attempts += 1\n    if guess == \"7\":\n        print(f\"Correct in {attempts} attempts!\")\n        break\n    print(\"Wrong, try again\")\n\n# Nested loops — break only exits the innermost loop\nfor i in range(3):\n    for j in range(3):\n        if j == 1:\n            break        # exits inner loop only\n        print(f\"{i},{j}\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "In nested loops, `break` only exits the innermost loop — not all loops. If you need to exit multiple levels of nesting, use a flag variable (`found = True`) or refactor the nested loops into a function and use `return` to exit completely."
      },
      "keyPoints": [
        "break exits the loop immediately — no more iterations run",
        "continue skips the rest of the current iteration and moves to the next",
        "A loop's else clause runs only if the loop completed without hitting a break",
        "break in nested loops only exits the innermost loop",
        "Use break and continue sparingly — clear conditions are usually more readable"
      ],
      "tryIt": "Write a loop over a list of mixed numbers and strings. Use continue to skip any item that is not an integer. Use break to stop when you find the first number greater than 50. Print each number you process and a final message showing what you found (or 'None found' if break never triggered)."
    }
  },

  {
    "id": 57,
    "moduleId": 5,
    "moduleTitle": "Loops",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Loop bugs are among the most common and most instructive errors beginners encounter. Most fall into a small number of patterns — learning to recognise them saves hours of debugging.\n\n## Mistake 1 — Infinite Loop\n\nForgetting to update the variable being checked in a `while` loop. The condition never becomes `False` and the program runs forever. Always ask: what changes on each iteration?\n\n## Mistake 2 — Off-by-One Error\n\nUsing `range(n)` when you meant `range(1, n+1)`, or `<` when you meant `<=`. These produce loops that run one too many or one too few times. Off-by-one errors are so common they have their own acronym: OBOE.\n\n## Mistake 3 — Modifying a List While Iterating\n\nRemoving or adding items to a list while looping over it causes unpredictable behaviour — items get skipped or the loop crashes. Always iterate over a copy or build a new list instead.\n\n## Mistake 4 — Using the Loop Variable After the Loop\n\nThe loop variable holds its last value after the loop ends. Relying on this is fragile — if the loop never runs (empty list), the variable is undefined and raises a `NameError`.\n\n## Mistake 5 — break Only Exits the Innermost Loop\n\nIn nested loops, `break` only exits the loop it is directly inside. The outer loop continues. Use a flag variable or refactor into a function if you need to exit multiple levels.",
      "diagram": "flowchart TD\n    A[\"Loop Mistakes\"] --> B[\"Infinite loop\nno update step\"]\n    A --> C[\"Off-by-one\nrange(n) vs range(1,n+1)\"]\n    A --> D[\"Modify list\nwhile iterating\"]\n    A --> E[\"Loop var after loop\nmay be undefined\"]\n    A --> F[\"break in nested\nonly exits innermost\"]\n    B --> G[\"Silent — runs forever\"]\n    C --> G2[\"Silent — wrong count\"]\n    D --> G3[\"Silent or crash\"]\n    E --> G4[\"NameError if empty\"]\n    F --> G5[\"Silent — outer continues\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style G2 fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style G3 fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style G4 fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style G5 fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Most loop bugs are silent — they produce wrong output without raising an error",
      "code": "# Mistake 1 — infinite loop (missing update)\n# count = 5\n# while count > 0:\n#     print(count)   # count never changes — runs forever!\n# Fix:\ncount = 5\nwhile count > 0:\n    print(count)\n    count -= 1   # update step\n\n# Mistake 2 — off-by-one\nfor i in range(5):      # 0,1,2,3,4 — misses 5\n    print(i)\nfor i in range(1, 6):   # 1,2,3,4,5 — correct\n    print(i)\n\n# Mistake 3 — modifying list while iterating\nnumbers = [1, 2, 3, 4, 5]\n# WRONG:\n# for n in numbers:\n#     if n % 2 == 0:\n#         numbers.remove(n)   # skips items!\n# CORRECT — iterate over a copy:\nfor n in numbers[:]:\n    if n % 2 == 0:\n        numbers.remove(n)\nprint(numbers)   # [1, 3, 5]\n\n# Mistake 4 — loop var undefined if list is empty\nitems = []\nfor item in items:\n    last = item\n# print(last)   # NameError — loop never ran\nlast = None     # initialise before the loop\nfor item in items:\n    last = item\nprint(last)     # None — safe\n\n# Mistake 5 — break only exits innermost\nfor i in range(3):\n    for j in range(3):\n        if j == 1:\n            break        # exits inner only\n    print(f\"i={i} still running\")  # outer continues",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never modify a list while iterating over it directly. Use `for item in my_list[:]` to iterate over a copy, or build a new list with a list comprehension: `my_list = [x for x in my_list if condition]`. Both are safe and idiomatic."
      },
      "keyPoints": [
        "Infinite loops come from missing update steps in while loops — always check what changes",
        "Off-by-one errors come from range(n) vs range(1, n+1) — verify your start and stop values",
        "Never modify a list while iterating — iterate over a copy with list[:] or use a comprehension",
        "Initialise variables before a loop in case the loop body never runs",
        "break only exits the innermost loop — use a flag or function return for multi-level exit"
      ],
      "tryIt": "Find and fix all five bugs: (1) `i=1; while i<5: print(i)`, (2) `for i in range(10): if i==5: print('found')` — should print for 5,6,7,8,9 too, (3) `nums=[1,2,3]; for n in nums: nums.remove(n)`, (4) rely on loop var from empty list, (5) nested break expecting to exit both loops."
    }
  },

  {
    "id": 58,
    "moduleId": 5,
    "moduleTitle": "Loops",
    "title": "Module 5 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered loops — the mechanism that lets your programs repeat actions, process collections, and handle data of any size. Combined with the conditionals from Module 4, you can now write programs that make decisions and repeat them.\n\n## What You Learned\n\n**Why loops exist** — repeating code without copy-pasting, processing collections of unknown size, and running logic until a condition changes.\n\n**The for loop** — iterates over any iterable. The loop variable is assigned automatically on each iteration. Use descriptive names.\n\n**range()** — generates integer sequences on demand. Three forms: `range(stop)`, `range(start, stop)`, `range(start, stop, step)`. Stop is always exclusive.\n\n**Looping over collections** — lists, strings, dicts, sets all work with `for`. Use `.items()` for dict key-value pairs. List comprehensions are the compact alternative for transformations.\n\n**The while loop** — repeats as long as a condition is `True`. Used when iteration count is unknown. Always include an update step. `while True` with `break` is the clean pattern for complex exit conditions.\n\n**break and continue** — `break` exits the loop entirely; `continue` skips the current iteration. `break` only exits the innermost loop. Use sparingly.\n\n**enumerate() and zip()** — `enumerate()` adds an index to any iteration; `zip()` pairs two sequences in parallel. Both replace manual index tracking.\n\n**Looping over strings** — character-by-character iteration. Build new strings with `''.join()` rather than `+=` concatenation.\n\n## What Is Coming Next\n\nModule 6 introduces **functions** — named, reusable blocks of code. Functions let you package logic, avoid repetition, and build programs from composable pieces. Everything you have learned so far becomes more powerful when wrapped in functions.",
      "diagram": "flowchart TD\n    A[\"✅ for loop\niterable sequences\"] --> B[\"✅ range()\ninteger sequences\"]\n    B --> C[\"✅ Collections\nlist dict str set\"]\n    C --> D[\"✅ while loop\ncondition-based\"]\n    D --> E[\"✅ break / continue\nloop control\"]\n    E --> F[\"✅ enumerate / zip\nindex + parallel\"]\n    F --> G[\"✅ String loops\nchar-by-char\"]\n    G --> H[\"➡️ Functions\nModule 6\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 5 complete — loops + conditionals give you the core of all program logic",
      "code": "# Everything from Module 5 in one program\ndef summarise_scores(scores):\n    if not scores:\n        return \"No scores provided\"\n\n    total = 0\n    highest = scores[0]\n    lowest = scores[0]\n\n    for i, score in enumerate(scores, start=1):\n        total += score\n        if score > highest:\n            highest = score\n        if score < lowest:\n            lowest = score\n\n    average = total / len(scores)\n\n    # Count grades using a loop\n    grades = {\"A\": 0, \"B\": 0, \"C\": 0, \"F\": 0}\n    for score in scores:\n        if score >= 90:\n            grades[\"A\"] += 1\n        elif score >= 75:\n            grades[\"B\"] += 1\n        elif score >= 50:\n            grades[\"C\"] += 1\n        else:\n            grades[\"F\"] += 1\n\n    return {\n        \"count\": len(scores),\n        \"average\": round(average, 1),\n        \"highest\": highest,\n        \"lowest\": lowest,\n        \"grades\": grades,\n    }\n\nresults = summarise_scores([92, 78, 45, 88, 61, 95, 73, 50])\nfor key, value in results.items():\n    print(f\"{key}: {value}\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The program above uses for, enumerate, while-style logic via conditionals, and dict iteration — all in one coherent piece. If you can read and understand every line, you have genuinely mastered Module 5. If any part is unclear, revisit that lesson before moving on."
      },
      "keyPoints": [
        "for loops iterate over any iterable — use descriptive variable names",
        "while loops repeat until a condition is False — always include an update step",
        "range(start, stop, step) — stop is exclusive, step can be negative",
        "enumerate() and zip() replace manual index tracking cleanly",
        "break exits the loop; continue skips the iteration — both only affect the innermost loop"
      ],
      "tryIt": "Without looking at examples, write a program that reads 5 numbers from input using a while loop, stores them in a list, then uses a for loop to calculate and print the sum, average, maximum, and minimum. If you can do this from memory, you are ready for Module 6."
    }
  },
  // =========================
  // Python Module 6: Functions & Scope
  // =========================

  {
    "id": 59,
    "moduleId": 6,
    "moduleTitle": "Functions & Scope",
    "title": "What Is a Function?",
    "type": "lesson",
    "content": {
      "body": "A function is a named, reusable block of code that performs a specific task. Instead of writing the same logic in multiple places, you define it once and call it by name whenever you need it.\n\n## Why Functions Exist\n\nWithout functions, every program is a single long sequence of statements. As programs grow, this becomes unmanageable — the same logic gets duplicated, bugs get fixed in one place but not another, and understanding the code requires reading every line from top to bottom.\n\nFunctions solve this with three principles:\n\n**Don't Repeat Yourself (DRY)** — write logic once, use it everywhere. If the logic needs to change, you change it in one place.\n\n**Abstraction** — a function hides its implementation behind a name. You call `calculate_tax(price)` without needing to know how tax is calculated. This lets you think at a higher level.\n\n**Decomposition** — break a large problem into small, focused functions. Each function does one thing well. This makes code easier to read, test, and debug.\n\n## Functions You Already Know\n\nYou have been using built-in functions throughout this course — `print()`, `input()`, `len()`, `range()`, `int()`, `str()`. These are all functions defined by Python. Now you will learn to define your own.\n\n## The Two Steps\n\nUsing a function always involves two steps:\n1. **Define** it — write the code once using `def`\n2. **Call** it — run it by writing its name followed by parentheses",
      "diagram": "flowchart TD\n    A[\"Define once\ndef greet(name):\"] --> B[\"Function stored\nin memory\"]\n    B --> C[\"Call anywhere\ngreet('Alice')\"]\n    B --> D[\"Call again\ngreet('Bob')\"]\n    B --> E[\"Call again\ngreet('Carol')\"]\n    C --> F[\"Hello, Alice\"]\n    D --> G[\"Hello, Bob\"]\n    E --> H[\"Hello, Carol\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Define once, call many times — functions eliminate repetition and enable reuse",
      "code": "# Without functions — repeated logic\nname1 = \"Alice\"\nprint(f\"Hello, {name1}! Welcome to Python.\")\nprint(f\"Your name has {len(name1)} characters.\")\n\nname2 = \"Bob\"\nprint(f\"Hello, {name2}! Welcome to Python.\")\nprint(f\"Your name has {len(name2)} characters.\")\n\n# With a function — define once, call many times\ndef greet(name):\n    print(f\"Hello, {name}! Welcome to Python.\")\n    print(f\"Your name has {len(name)} characters.\")\n\ngreet(\"Alice\")\ngreet(\"Bob\")\ngreet(\"Carol\")\n\n# Built-in functions you already use\nprint(len(\"Python\"))    # len() is a function\nprint(range(1, 6))      # range() is a function\nprint(int(\"42\"))        # int() is a function",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "A function must be defined before it is called. Python reads files top to bottom — if you call a function before its `def` statement, you get a `NameError`. The convention is to define all functions at the top of the file and put the calling code at the bottom."
      },
      "keyPoints": [
        "Functions are named, reusable blocks of code defined with def",
        "DRY — Don't Repeat Yourself — write logic once and call it from anywhere",
        "Abstraction hides implementation details behind a meaningful name",
        "Decomposition breaks large problems into small, focused functions",
        "A function must be defined before it is called — Python reads top to bottom"
      ],
      "tryIt": "Identify three places in a program you have written where the same logic appears more than once. Refactor each repeated block into a function with a descriptive name. Call each function in place of the repeated code and verify the output is identical."
    }
  },

  {
    "id": 60,
    "moduleId": 6,
    "moduleTitle": "Functions & Scope",
    "title": "Defining and Calling Functions",
    "type": "lesson",
    "content": {
      "body": "Defining a function tells Python what the function does. Calling it tells Python to run it. These are two separate actions — a function definition does nothing on its own until it is called.\n\n## The def Statement\n\n```python\ndef function_name(parameters):\n    \"\"\"Optional docstring.\"\"\"\n    # body\n```\n\nFour things are required:\n1. The keyword `def`\n2. The function name — follows the same snake_case rules as variables\n3. Parentheses — even if there are no parameters\n4. A colon `:` followed by an indented body\n\n## Docstrings\n\nA docstring is a string literal on the first line of the function body. It documents what the function does. It is optional but strongly recommended for any function that is not immediately obvious. Access it with `help(function_name)` or `function_name.__doc__`.\n\n## Calling a Function\n\nCall a function by writing its name followed by parentheses. If the function has parameters, pass the arguments inside the parentheses. The function runs, and when it finishes, execution returns to the line after the call.\n\n## Functions Are Objects\n\nIn Python, functions are first-class objects. You can assign them to variables, pass them as arguments to other functions, and store them in lists. This is a powerful feature covered in depth in later modules.",
      "diagram": "flowchart TD\n    A[\"def greet(name):\"] --> B[\"Function object\ncreated in memory\"]\n    C[\"greet('Alice')\"] --> D[\"name = 'Alice'\"]\n    D --> E[\"Run body\"]\n    E --> F[\"Return to caller\"]\n    F --> G[\"Next line after call\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#e2e8f0,stroke:#94a3b8,color:#1a1a1a",
      "diagramCaption": "def creates the function — calling it runs the body and returns to the caller",
      "code": "# Basic function definition\ndef say_hello():\n    \"\"\"Print a greeting.\"\"\"\n    print(\"Hello, World!\")\n\n# Call it\nsay_hello()   # Hello, World!\nsay_hello()   # Hello, World! (again)\n\n# Function with a parameter\ndef greet(name):\n    \"\"\"Greet a user by name.\"\"\"\n    print(f\"Hello, {name}!\")\n\ngreet(\"Alice\")\ngreet(\"Bob\")\n\n# Function with multiple parameters\ndef describe(name, age, city):\n    \"\"\"Print a description of a person.\"\"\"\n    print(f\"{name} is {age} years old and lives in {city}.\")\n\ndescribe(\"Alice\", 30, \"London\")\ndescribe(\"Bob\", 25, \"Paris\")\n\n# Accessing the docstring\nprint(greet.__doc__)   # Greet a user by name.\n\n# Functions are objects — assign to a variable\nsay = greet\nsay(\"Carol\")   # Hello, Carol!",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Write a docstring for every function you define — even a one-liner. `\"\"\"Calculate the area of a rectangle.\"\"\"` takes five seconds to write and saves minutes of confusion later. Good docstrings describe what the function does, what its parameters mean, and what it returns."
      },
      "keyPoints": [
        "def creates a function object — the body does not run until the function is called",
        "Function names follow snake_case — descriptive verbs work well (calculate, validate, get)",
        "Parentheses are required on both the def line and every call — even with no parameters",
        "Docstrings document what a function does — write one for every non-trivial function",
        "Functions are objects — they can be assigned to variables and passed as arguments"
      ],
      "tryIt": "Write three functions: `square(n)` that prints n squared, `is_even(n)` that prints whether n is even or odd, and `greet_user(name, language)` that prints a greeting in the specified language (support at least 'english' and 'spanish'). Call each function with at least two different sets of arguments."
    }
  },

  {
    "id": 61,
    "moduleId": 6,
    "moduleTitle": "Functions & Scope",
    "title": "Parameters and Arguments",
    "type": "lesson",
    "content": {
      "body": "**Parameters** are the variable names listed in the function definition. **Arguments** are the actual values passed when the function is called. The distinction matters because Python gives you several ways to pass arguments — positional, keyword, and a mix of both.\n\n## Positional Arguments\n\nThe simplest form — arguments are matched to parameters by position. The first argument goes to the first parameter, the second to the second, and so on. Order matters.\n\n## Keyword Arguments\n\nYou can pass arguments by name, in any order. This makes calls with many parameters more readable and less error-prone.\n\n```python\ndescribe(age=30, name=\"Alice\", city=\"London\")\n```\n\n## Mixing Positional and Keyword\n\nYou can mix both — but positional arguments must always come before keyword arguments.\n\n```python\ndescribe(\"Alice\", city=\"London\", age=30)  # valid\ndescribe(name=\"Alice\", 30, \"London\")      # SyntaxError\n```\n\n## Default Parameter Values\n\nParameters can have default values. If the caller does not provide that argument, the default is used. Parameters with defaults must come after parameters without defaults.\n\n```python\ndef greet(name, greeting=\"Hello\"):\n    print(f\"{greeting}, {name}!\")\n```\n\n## Mutable Default Arguments — A Trap\n\nNever use a mutable object (list, dict) as a default parameter value. Python creates the default once when the function is defined — not on each call. All calls share the same object, leading to surprising accumulated state.",
      "diagram": "flowchart LR\n    A[\"def f(a, b, c=10)\"] --> B[\"Positional\nf(1, 2)\"]\n    A --> C[\"Keyword\nf(b=2, a=1)\"]\n    A --> D[\"Mixed\nf(1, c=5, b=2)\"]\n    A --> E[\"Default used\nf(1, 2) → c=10\"]\n    B --> F[\"a=1 b=2 c=10\"]\n    C --> F\n    D --> G[\"a=1 b=2 c=5\"]\n    E --> F\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Positional, keyword, and default arguments give flexible ways to call the same function",
      "code": "# Positional — order matters\ndef describe(name, age, city):\n    print(f\"{name}, {age}, {city}\")\n\ndescribe(\"Alice\", 30, \"London\")   # positional\ndescribe(\"Bob\", 25, \"Paris\")\n\n# Keyword — order does not matter\ndescribe(age=30, city=\"London\", name=\"Alice\")\n\n# Mixed — positional first, then keyword\ndescribe(\"Alice\", city=\"London\", age=30)\n\n# Default parameter values\ndef greet(name, greeting=\"Hello\"):\n    print(f\"{greeting}, {name}!\")\n\ngreet(\"Alice\")              # Hello, Alice!\ngreet(\"Bob\", \"Good morning\") # Good morning, Bob!\ngreet(\"Carol\", greeting=\"Hi\") # Hi, Carol!\n\n# Mutable default — the trap\ndef add_item(item, items=[]):   # WRONG\n    items.append(item)\n    return items\n\nprint(add_item(\"a\"))   # ['a']\nprint(add_item(\"b\"))   # ['a', 'b'] — shared!\n\n# Correct pattern — use None as default\ndef add_item_safe(item, items=None):\n    if items is None:\n        items = []\n    items.append(item)\n    return items",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never use a mutable object (list, dict, set) as a default parameter value. Write `def f(items=None)` and then `if items is None: items = []` inside the body. This creates a fresh list on each call instead of sharing one list across all calls."
      },
      "keyPoints": [
        "Parameters are names in the definition; arguments are values passed at the call",
        "Positional arguments match by order; keyword arguments match by name",
        "Positional arguments must come before keyword arguments in a call",
        "Default values make parameters optional — parameters with defaults come last",
        "Never use mutable objects as default values — use None and create inside the body"
      ],
      "tryIt": "Write a function format_name(first, last, title=None, separator=' ') that returns a formatted full name. If title is provided, prepend it. Use the separator between first and last. Test with: positional only, keyword only, with a title, and with a custom separator like a hyphen."
    }
  },

  {
    "id": 63,
    "moduleId": 6,
    "moduleTitle": "Functions & Scope",
    "title": "Return Values",
    "type": "lesson",
    "content": {
      "body": "A function that only prints output is limited — the result disappears after the call. The `return` statement sends a value back to the caller, where it can be stored, used in an expression, or passed to another function. This is what makes functions composable.\n\n## The return Statement\n\n```python\ndef add(a, b):\n    return a + b\n\nresult = add(3, 4)   # result = 7\n```\n\n`return` immediately exits the function. Any code after a `return` in the same block is unreachable.\n\n## Returning Multiple Values\n\nPython functions can return multiple values as a tuple. The caller can unpack them directly:\n\n```python\ndef min_max(numbers):\n    return min(numbers), max(numbers)\n\nlow, high = min_max([3, 1, 4, 1, 5, 9])\n```\n\n## Functions Without return\n\nA function with no `return` statement (or a bare `return`) implicitly returns `None`. This is fine for functions whose purpose is a side effect — printing, writing to a file, updating state. But if you try to use the result of such a function in an expression, you will get `None` where you expected a value.\n\n## return vs print\n\n`print()` displays a value to the screen — it is a side effect. `return` sends a value back to the caller — it is data. A function that only prints cannot be composed with other functions. A function that returns can be used anywhere a value is expected.",
      "diagram": "flowchart TD\n    A[\"result = add(3, 4)\"] --> B[\"Enter function\na=3, b=4\"]\n    B --> C[\"return a + b\n= 7\"]\n    C --> D[\"Exit function\"]\n    D --> E[\"result = 7\"]\n    F[\"No return\"] --> G[\"Implicitly\nreturns None\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "return sends a value back to the caller — without it the function returns None",
      "code": "# Basic return\ndef add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)          # 7\nprint(add(10, 20))     # 30 — use directly in expression\n\n# Return stops the function immediately\ndef classify(n):\n    if n > 0:\n        return \"positive\"\n    if n < 0:\n        return \"negative\"\n    return \"zero\"      # only reached if n == 0\n\nprint(classify(5))     # positive\nprint(classify(-3))    # negative\nprint(classify(0))     # zero\n\n# Returning multiple values\ndef stats(numbers):\n    return min(numbers), max(numbers), sum(numbers) / len(numbers)\n\nlow, high, avg = stats([4, 7, 2, 9, 1])\nprint(f\"min={low} max={high} avg={avg}\")\n\n# None return — the silent trap\ndef greet(name):\n    print(f\"Hello, {name}\")   # no return\n\nresult = greet(\"Alice\")\nprint(result)   # None — greet() returned nothing\n\n# Composing functions using return values\ndef square(n):\n    return n ** 2\n\ndef sum_of_squares(a, b):\n    return square(a) + square(b)   # uses return value of square()\n\nprint(sum_of_squares(3, 4))   # 25",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "The most common return mistake: writing `print(result)` inside a function instead of `return result`, then trying to use the function's output in an expression. `total = add(3, 4)` works when `add` uses `return`. `total = add(3, 4)` gives `None` when `add` only prints. Always `return` values you intend to use."
      },
      "keyPoints": [
        "return sends a value back to the caller and immediately exits the function",
        "Functions without return implicitly return None",
        "Multiple values can be returned as a tuple and unpacked by the caller",
        "return enables function composition — the output of one function feeds into another",
        "print() is a side effect; return is data — prefer return for reusable functions"
      ],
      "tryIt": "Write a function celsius_to_fahrenheit(c) that returns the converted value. Write a second function describe_temperature(c) that calls the first and returns a string like '100°C is 212°F — Boiling'. Test the chain with 0, 100, -40, and 37. Notice how the second function depends on the first returning a value."
    }
  },

  {
    "id": 64,
    "moduleId": 6,
    "moduleTitle": "Functions & Scope",
    "title": "Scope — Local and Global",
    "type": "lesson",
    "content": {
      "body": "**Scope** determines where a variable is visible and accessible. Python uses a layered scope system — variables defined inside a function are local to that function and invisible outside it. Variables defined at the top level of a file are global and visible everywhere.\n\n## Local Scope\n\nVariables created inside a function exist only for the duration of that function call. They are created when the function is called and destroyed when it returns. Two functions can have local variables with the same name without any conflict.\n\n## Global Scope\n\nVariables defined outside any function are global. They are accessible from anywhere in the file — including inside functions (for reading). However, assigning to a global variable inside a function creates a new local variable with the same name instead of modifying the global.\n\n## The global Keyword\n\nTo modify a global variable from inside a function, use the `global` keyword. This is generally discouraged — it creates hidden dependencies between functions and makes code harder to reason about. Prefer passing values as arguments and returning results.\n\n## The LEGB Rule\n\nPython resolves variable names in this order:\n1. **L**ocal — inside the current function\n2. **E**nclosing — in any enclosing function (for nested functions)\n3. **G**lobal — at the module level\n4. **B**uilt-in — Python's built-in names like `len`, `print`, `range`",
      "diagram": "flowchart TD\n    A[\"LEGB Lookup\"] --> B[\"Local\ncurrent function\"]\n    B -->|\"not found\"| C[\"Enclosing\nouter function\"]\n    C -->|\"not found\"| D[\"Global\nmodule level\"]\n    D -->|\"not found\"| E[\"Built-in\nlen print range\"]\n    E -->|\"not found\"| F[\"NameError\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#e2e8f0,stroke:#94a3b8,color:#1a1a1a\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Python looks up names Local → Enclosing → Global → Built-in — first match wins",
      "code": "# Local scope — x inside function is separate from x outside\nx = \"global\"\n\ndef show():\n    x = \"local\"    # new local variable — does not affect global x\n    print(x)       # local\n\nshow()             # local\nprint(x)           # global — unchanged\n\n# Reading a global from inside a function\ncount = 0\n\ndef get_count():\n    return count   # reading global is fine\n\nprint(get_count())  # 0\n\n# Modifying global — requires global keyword (avoid this)\ndef increment():\n    global count\n    count += 1\n\nincrement()\nprint(count)   # 1\n\n# Better pattern — pass and return instead of global\ndef increment_value(n):\n    return n + 1\n\ncount = increment_value(count)\nprint(count)   # 2\n\n# NameError — local variable used before assignment\ndef broken():\n    print(value)   # NameError — value not defined locally\n    value = 10\n\n# Two functions with same local name — no conflict\ndef func_a():\n    result = \"from A\"\n    return result\n\ndef func_b():\n    result = \"from B\"\n    return result\n\nprint(func_a(), func_b())   # from A  from B",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Avoid using `global` to modify variables from inside functions. It creates invisible dependencies — a function that modifies a global variable is harder to test, harder to reuse, and harder to reason about. Pass the value as an argument and return the modified value instead. This keeps functions self-contained."
      },
      "keyPoints": [
        "Local variables exist only inside the function — created on call, destroyed on return",
        "Global variables are defined at module level and readable from anywhere",
        "Assigning to a name inside a function creates a local variable — it does not modify the global",
        "Use the global keyword to modify a global from inside a function — but prefer not to",
        "Python resolves names in LEGB order: Local → Enclosing → Global → Built-in"
      ],
      "tryIt": "Write a function counter() that uses a local variable to count from 1 to 5 and returns the final count. Then write a second version using a global variable modified with the global keyword. Compare the two — which is easier to test in isolation? Which would break if called from two places simultaneously?"
    }
  },

  {
    "id": 67,
    "moduleId": 6,
    "moduleTitle": "Functions & Scope",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Function bugs are often subtle — the code runs without error but produces wrong results, or works in isolation but breaks when composed with other functions. These are the patterns that trip up beginners most often.\n\n## Mistake 1 — Forgetting to Return\n\nWriting `print(result)` inside a function instead of `return result`. The function appears to work when called alone, but returns `None` when its output is used in an expression or passed to another function.\n\n## Mistake 2 — Mutable Default Argument\n\nUsing a list or dict as a default parameter value. Python creates the default once — all calls share the same object. State accumulates across calls in a way that is invisible and surprising.\n\n## Mistake 3 — Modifying a Global Instead of Returning\n\nUsing `global` to modify a variable from inside a function instead of passing it as an argument and returning the result. This creates hidden dependencies and makes the function impossible to test in isolation.\n\n## Mistake 4 — Calling Without Parentheses\n\nWriting `result = my_function` instead of `result = my_function()`. Without parentheses, you assign the function object itself — not its return value. The code does not crash, it just does the wrong thing silently.\n\n## Mistake 5 — Shadowing Built-ins\n\nNaming a variable or function `list`, `input`, `print`, `sum`, `id`, or any other built-in name. This replaces the built-in with your variable for the rest of the scope, causing confusing errors when you try to use the original.",
      "diagram": "flowchart TD\n    A[\"Function Mistakes\"] --> B[\"No return\nsilently returns None\"]\n    A --> C[\"Mutable default\nshared across calls\"]\n    A --> D[\"global instead\nof return\"]\n    A --> E[\"Call without ()\nassigns function object\"]\n    A --> F[\"Shadow built-in\nlist = [1,2,3]\"]\n    B --> G[\"Silent — wrong value\"]\n    C --> G\n    D --> H[\"Hidden dependency\"]\n    E --> G\n    F --> I[\"NameError later\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style H fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style I fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Most function bugs are silent — the code runs but produces None or wrong values",
      "code": "# Mistake 1 — forgetting return\ndef add(a, b):\n    print(a + b)   # prints but returns None\n\nresult = add(3, 4)\nprint(result)      # None — not 7!\n\n# Fix:\ndef add(a, b):\n    return a + b\n\n# Mistake 2 — mutable default\ndef append_to(item, lst=[]):\n    lst.append(item)\n    return lst\n\nprint(append_to(1))   # [1]\nprint(append_to(2))   # [1, 2] — shared!\n\n# Fix: use None\ndef append_to(item, lst=None):\n    if lst is None: lst = []\n    lst.append(item)\n    return lst\n\n# Mistake 3 — global instead of return\ntotal = 0\ndef add_to_total(n):\n    global total\n    total += n   # hidden side effect\n\n# Fix: pass and return\ndef add_to_total(current, n):\n    return current + n\n\ntotal = add_to_total(total, 5)\n\n# Mistake 4 — missing parentheses\ndef get_name():\n    return \"Alice\"\n\nname = get_name    # function object, not \"Alice\"!\nprint(name)        # <function get_name at 0x...>\nname = get_name()  # correct\n\n# Mistake 5 — shadowing built-ins\n# list = [1, 2, 3]   # now list() is broken!\n# print(list(\"abc\"))  # TypeError\n# Fix: use descriptive names\nnumbers = [1, 2, 3]",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Avoid naming variables `list`, `dict`, `set`, `input`, `print`, `sum`, `id`, `type`, `str`, `int`, `float`, or `len`. These are all built-in names. Overwriting them causes confusing errors that are hard to trace because the code looks correct. Use descriptive names: `numbers`, `user_data`, `name_set`."
      },
      "keyPoints": [
        "Always return values you intend to use — print() is a side effect, not a return value",
        "Never use mutable objects as default parameters — use None and create inside the body",
        "Pass values as arguments and return results instead of using global",
        "Always call functions with parentheses — without them you get the function object",
        "Never shadow built-in names like list, dict, input, print, sum, or len"
      ],
      "tryIt": "Find and fix all five bugs: (1) a function that prints instead of returning, (2) a function with a list default that accumulates state, (3) a function that uses global instead of returning, (4) a call missing parentheses, (5) a variable named `input` that breaks the built-in. Write the fixed version of each."
    }
  },

  {
    "id": 68,
    "moduleId": 6,
    "moduleTitle": "Functions & Scope",
    "title": "Module 6 Summary",
    "type": "lesson",
    "content": {
      "body": "This module introduced functions — the most important tool for writing organised, reusable, and maintainable Python code. Every professional Python program is built from functions, and the habits you build here will shape how you write code for the rest of your career.\n\n## What You Learned\n\n**What functions are** — named, reusable blocks of code. Define once with `def`, call anywhere. The DRY principle: write logic once, use it everywhere.\n\n**Defining and calling** — `def name(params):` creates the function. `name(args)` runs it. Docstrings document what a function does. Functions are objects and can be passed around.\n\n**Parameters and arguments** — positional arguments match by order, keyword arguments match by name. Positional must come before keyword at the call site.\n\n**Default values** — make parameters optional. Use `None` as the default for mutable objects and create them inside the body.\n\n**Return values** — `return` sends data back to the caller and exits the function. Functions without `return` return `None`. Return enables composition — the output of one function feeds into another.\n\n**Scope** — local variables exist only inside their function. Python resolves names in LEGB order. Avoid `global` — pass values as arguments and return results instead.\n\n***args and **kwargs** — collect variable numbers of positional and keyword arguments into a tuple and dict respectively. `*` and `**` also unpack at the call site.\n\n**Lambda** — anonymous single-expression functions. Use as arguments to `sorted()`, `map()`, `filter()`. Use `def` for anything more complex.\n\n## What Is Coming Next\n\nModule 7 introduces **lists and tuples** in depth — indexing, slicing, methods, and the patterns that make Python's sequence types so powerful.",
      "diagram": "flowchart TD\n    A[\"✅ What is\na function?\"] --> B[\"✅ def and\ncalling\"]\n    B --> C[\"✅ Parameters\n& arguments\"]\n    C --> D[\"✅ Default\nvalues\"]\n    D --> E[\"✅ Return\nvalues\"]\n    E --> F[\"✅ Scope\nLEGB\"]\n    F --> G[\"✅ *args\n**kwargs\"]\n    G --> H[\"✅ Lambda\nfunctions\"]\n    H --> I[\"➡️ Lists & Tuples\nModule 7\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 6 complete — functions are the foundation of all organised Python code",
      "code": "# Everything from Module 6 in one program\ndef calculate_order(*items, discount=0, currency=\"$\", **customer):\n    \"\"\"Calculate and display an order summary.\"\"\"\n    if not items:\n        return \"No items in order\"\n\n    subtotal = sum(items)\n    discount_amount = subtotal * (discount / 100)\n    total = subtotal - discount_amount\n\n    # Format output\n    lines = [f\"Customer: {customer.get('name', 'Guest')}\"]\n    lines.append(f\"Items: {len(items)} @ avg {currency}{subtotal/len(items):.2f}\")\n    if discount:\n        lines.append(f\"Discount: {discount}% (-{currency}{discount_amount:.2f})\")\n    lines.append(f\"Total: {currency}{total:.2f}\")\n\n    return \"\\n\".join(lines)\n\nprint(calculate_order(9.99, 14.99, 4.99,\n                      discount=10,\n                      name=\"Alice\",\n                      member=True))\n\n# Compose functions\ndef apply_tax(amount, rate=0.2):\n    return round(amount * (1 + rate), 2)\n\nprices = [9.99, 14.99, 4.99]\nwith_tax = list(map(lambda p: apply_tax(p), prices))\nprint(with_tax)",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Before moving on, make sure you can write a function from memory that takes parameters, uses a default value, and returns a result. If you can also explain the difference between a local and global variable, and when to use lambda vs def, you have genuinely mastered Module 6."
      },
      "keyPoints": [
        "Functions are the primary tool for organising, reusing, and testing code",
        "Always return values you intend to use — functions without return give None",
        "Pass values as arguments and return results — avoid global variables",
        "Use None as default for mutable parameters — create the object inside the body",
        "Lambda is for simple inline functions — use def for anything with a name or complexity"
      ],
      "tryIt": "From memory, write a function process_students(students, passing_score=50) that takes a list of (name, score) tuples and returns a dict with two keys: 'passed' (list of names) and 'failed' (list of names). Use a lambda with sorted() to return the passed list sorted by score descending."
    }
  },
  // =========================
  // Python Module 7: Lists & Tuples
  // =========================

  {
    "id": 69,
    "moduleId": 7,
    "moduleTitle": "Lists & Tuples",
    "title": "What Is a List?",
    "type": "lesson",
    "content": {
      "body": "A list is an ordered, mutable collection of items. It is the most versatile and widely used data structure in Python. Where a variable holds one value, a list holds many — and you can add, remove, and change those values at any time.\n\n## Creating a List\n\nLists are created with square brackets. Items are separated by commas. A list can hold any mix of types — integers, strings, booleans, other lists, or any Python object.\n\n```python\nnumbers = [1, 2, 3, 4, 5]\nnames = [\"Alice\", \"Bob\", \"Carol\"]\nmixed = [1, \"hello\", True, 3.14]\nempty = []\n```\n\n## Key Properties\n\n**Ordered** — items have a fixed position. The first item is always at index 0. The order is preserved unless you explicitly sort or rearrange.\n\n**Mutable** — you can change, add, and remove items after creation. This distinguishes lists from tuples.\n\n**Indexed** — each item has a numeric position starting at 0. Negative indices count from the end: `-1` is the last item, `-2` is second to last.\n\n**Dynamic** — lists grow and shrink automatically. There is no fixed size to declare.\n\n## Nested Lists\n\nA list can contain other lists. This is how you represent grids, tables, and matrices in Python.\n\n```python\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\n```",
      "diagram": "flowchart LR\n    A[\"names = ['Alice','Bob','Carol']\"] --> B[\"Index 0\n'Alice'\"]\n    A --> C[\"Index 1\n'Bob'\"]\n    A --> D[\"Index 2\n'Carol'\"]\n    A --> E[\"Index -1\n'Carol'\"]\n    A --> F[\"Index -2\n'Bob'\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Positive indices count from the start; negative indices count from the end",
      "code": "# Creating lists\nnumbers = [1, 2, 3, 4, 5]\nnames = [\"Alice\", \"Bob\", \"Carol\"]\nmixed = [42, \"hello\", True, 3.14, None]\nempty = []\n\n# Basic properties\nprint(len(numbers))    # 5 — number of items\nprint(type(numbers))   # <class 'list'>\n\n# Indexing — zero-based\nprint(names[0])    # Alice\nprint(names[1])    # Bob\nprint(names[-1])   # Carol — last item\nprint(names[-2])   # Bob — second to last\n\n# Lists can hold any type including other lists\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nprint(matrix[0])       # [1, 2, 3]\nprint(matrix[1][2])    # 6 — row 1, column 2\n\n# Check membership\nprint(\"Alice\" in names)    # True\nprint(\"Dave\" in names)     # False\nprint(\"Dave\" not in names) # True",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "List indices start at 0, not 1. A list with 5 items has valid indices 0, 1, 2, 3, 4. Accessing index 5 raises an `IndexError`. The last valid index is always `len(list) - 1`. Use negative indices (`-1`, `-2`) to access from the end without calculating the length."
      },
      "keyPoints": [
        "Lists are ordered, mutable, indexed collections that can hold any mix of types",
        "Indices start at 0 — the last valid index is len(list) - 1",
        "Negative indices count from the end — -1 is the last item",
        "Lists are dynamic — they grow and shrink automatically",
        "Use `in` and `not in` to check membership without looping"
      ],
      "tryIt": "Create a list of 5 of your favourite films. Print the first, last, and middle item using indexing. Print the total count. Check whether a specific film is in the list using `in`. Then try accessing an index that does not exist and read the IndexError message carefully."
    }
  },

  {
    "id": 70,
    "moduleId": 7,
    "moduleTitle": "Lists & Tuples",
    "title": "Indexing and Slicing",
    "type": "lesson",
    "content": {
      "body": "Indexing retrieves a single item. Slicing retrieves a range of items as a new list. Both use square bracket notation and are among the most frequently used operations in Python.\n\n## Slicing Syntax\n\n```python\nlist[start:stop:step]\n```\n\n- `start` — index to begin from (inclusive, default 0)\n- `stop` — index to stop before (exclusive, default end)\n- `step` — how many positions to advance (default 1)\n\nAll three are optional. `list[:]` returns a shallow copy of the entire list.\n\n## Key Slice Patterns\n\n`items[1:4]` — items at indices 1, 2, 3 (stop is exclusive)\n`items[:3]` — first three items\n`items[2:]` — everything from index 2 to the end\n`items[::2]` — every second item\n`items[::-1]` — reversed copy\n\n## Slices Return New Lists\n\nA slice always returns a new list — it does not modify the original. Assigning to a slice (`items[1:3] = [x, y]`) does modify the original in place.\n\n## Strings Use the Same Syntax\n\nEverything you learn about list slicing applies identically to strings. `\"Python\"[1:4]` gives `\"yth\"`. This consistency is one of Python's strengths.",
      "diagram": "flowchart TD\n    A[\"items = [10,20,30,40,50]\"] --> B[\"items[1:4]\n[20, 30, 40]\"]\n    A --> C[\"items[:3]\n[10, 20, 30]\"]\n    A --> D[\"items[2:]\n[30, 40, 50]\"]\n    A --> E[\"items[::2]\n[10, 30, 50]\"]\n    A --> F[\"items[::-1]\n[50, 40, 30, 20, 10]\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Slicing returns a new list — stop is always exclusive, step controls the stride",
      "code": "items = [10, 20, 30, 40, 50]\n\n# Basic slicing\nprint(items[1:4])    # [20, 30, 40] — stop exclusive\nprint(items[:3])     # [10, 20, 30] — first three\nprint(items[2:])     # [30, 40, 50] — from index 2\nprint(items[:])      # [10, 20, 30, 40, 50] — full copy\n\n# Step\nprint(items[::2])    # [10, 30, 50] — every second\nprint(items[1::2])   # [20, 40] — every second from index 1\nprint(items[::-1])   # [50, 40, 30, 20, 10] — reversed\n\n# Negative indices in slices\nprint(items[-3:])    # [30, 40, 50] — last three\nprint(items[:-2])    # [10, 20, 30] — all but last two\n\n# Slices on strings — identical syntax\ntext = \"Hello, Python!\"\nprint(text[7:13])    # Python\nprint(text[:5])      # Hello\nprint(text[::-1])    # !nohtyP ,olleH\n\n# Assign to a slice — modifies in place\nnums = [1, 2, 3, 4, 5]\nnums[1:3] = [20, 30]\nprint(nums)   # [1, 20, 30, 4, 5]",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The stop index in a slice is always exclusive — `items[1:4]` gives indices 1, 2, 3, not 4. This is consistent with `range(1, 4)` which also excludes 4. Once you internalise this rule it applies everywhere in Python: slices, range(), and string methods all use the same exclusive-stop convention."
      },
      "keyPoints": [
        "Slicing syntax: list[start:stop:step] — all three parts are optional",
        "Stop is always exclusive — items[1:4] gives indices 1, 2, 3",
        "items[::-1] reverses a list or string without modifying the original",
        "Slices return new lists — assigning to a slice modifies the original in place",
        "String slicing uses identical syntax — everything learned here applies to strings"
      ],
      "tryIt": "Given the list [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], use slicing to extract: the first five items, the last three items, every even-indexed item, every odd-indexed item, and the list reversed. Do each in one line without loops."
    }
  },

  {
    "id": 71,
    "moduleId": 7,
    "moduleTitle": "Lists & Tuples",
    "title": "Modifying Lists",
    "type": "lesson",
    "content": {
      "body": "Lists are mutable — you can change their contents after creation. Python provides several ways to modify a list: direct assignment, methods that add or remove items, and operations that combine lists.\n\n## Changing Items\n\nAssign directly to an index to replace an item. Assign to a slice to replace a range of items.\n\n## Adding Items\n\n**`append(item)`** — adds one item to the end. The most common way to build a list incrementally.\n\n**`insert(index, item)`** — inserts an item at a specific position, shifting everything after it right.\n\n**`extend(iterable)`** — adds all items from another iterable to the end. Equivalent to `+=`.\n\n## Removing Items\n\n**`remove(value)`** — removes the first occurrence of a value. Raises `ValueError` if not found.\n\n**`pop(index)`** — removes and returns the item at the given index. Defaults to the last item if no index given.\n\n**`del list[index]`** — deletes an item or slice. Does not return the removed value.\n\n**`clear()`** — removes all items, leaving an empty list.\n\n## Combining Lists\n\nThe `+` operator concatenates two lists into a new list. The `*` operator repeats a list. Neither modifies the originals.",
      "diagram": "flowchart TD\n    A[\"Modify a List\"] --> B[\"Change\nlist[i] = value\"]\n    A --> C[\"Add\nappend / insert / extend\"]\n    A --> D[\"Remove\nremove / pop / del\"]\n    A --> E[\"Combine\n+ concat  * repeat\"]\n    C --> F[\"append — end\ninsert — position\nextend — many\"]\n    D --> G[\"remove — by value\npop — by index\ndel — no return\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "append/insert/extend add items; remove/pop/del remove them — all modify in place",
      "code": "fruits = [\"apple\", \"banana\", \"cherry\"]\n\n# Change an item\nfruits[1] = \"blueberry\"\nprint(fruits)   # ['apple', 'blueberry', 'cherry']\n\n# append — add to end\nfruits.append(\"date\")\nprint(fruits)   # ['apple', 'blueberry', 'cherry', 'date']\n\n# insert — add at position\nfruits.insert(1, \"avocado\")\nprint(fruits)   # ['apple', 'avocado', 'blueberry', 'cherry', 'date']\n\n# extend — add multiple items\nfruits.extend([\"elderberry\", \"fig\"])\nprint(fruits)\n\n# remove — by value (first occurrence)\nfruits.remove(\"avocado\")\n\n# pop — by index, returns the value\nlast = fruits.pop()       # removes last\nsecond = fruits.pop(1)    # removes index 1\nprint(f\"Removed: {last}, {second}\")\n\n# del — no return value\ndel fruits[0]\ndel fruits[1:3]   # delete a slice\n\n# clear — empty the list\nbackup = fruits[:]   # copy first\nfruits.clear()\nprint(fruits)   # []\n\n# Combine lists\na = [1, 2, 3]\nb = [4, 5, 6]\nprint(a + b)    # [1, 2, 3, 4, 5, 6]\nprint(a * 2)    # [1, 2, 3, 1, 2, 3]",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use `append()` to add one item, `extend()` to add many. A common mistake is `list.append([1, 2, 3])` when you meant `list.extend([1, 2, 3])`. `append` adds the list as a single nested item; `extend` unpacks it and adds each element individually."
      },
      "keyPoints": [
        "append() adds one item to the end — the standard way to build a list incrementally",
        "extend() adds all items from an iterable — use it instead of append() for multiple items",
        "remove() deletes by value; pop() deletes by index and returns the value",
        "del removes without returning; clear() empties the entire list",
        "append([1,2,3]) nests the list; extend([1,2,3]) unpacks it — know the difference"
      ],
      "tryIt": "Start with an empty list. Use append() to add five names. Use insert() to add a name at position 2. Use remove() to delete one by value. Use pop() to remove and print the last item. Use extend() to add three more names from another list. Print the final list and its length."
    }
  },

  {
    "id": 74,
    "moduleId": 7,
    "moduleTitle": "Lists & Tuples",
    "title": "List Comprehensions",
    "type": "lesson",
    "content": {
      "body": "A list comprehension is a concise way to build a new list by transforming or filtering an existing iterable. It replaces the common pattern of creating an empty list, looping, and appending — in a single readable line.\n\n## Syntax\n\n```python\n[expression for item in iterable]\n[expression for item in iterable if condition]\n```\n\nThe expression defines what goes into the new list. The optional `if` clause filters which items are included.\n\n## Compared to a Loop\n\n```python\n# Loop version\nsquares = []\nfor n in range(1, 6):\n    squares.append(n ** 2)\n\n# Comprehension version\nsquares = [n ** 2 for n in range(1, 6)]\n```\n\nBoth produce `[1, 4, 9, 16, 25]`. The comprehension is shorter, more readable, and slightly faster.\n\n## Filtering with if\n\nThe `if` clause acts as a filter — only items where the condition is `True` are included in the result.\n\n```python\nevens = [n for n in range(10) if n % 2 == 0]\n```\n\n## Nested Comprehensions\n\nYou can nest comprehensions to flatten or transform nested structures, but keep them readable — if a comprehension requires more than a few seconds to parse, a loop is clearer.",
      "diagram": "flowchart LR\n    A[\"for n in range(5)\"] --> B{\"if n % 2 == 0?\"}\n    B -->|\"True\"| C[\"n ** 2\nadd to result\"]\n    B -->|\"False\"| D[\"skip\"]\n    C --> E[\"[0, 4, 16]\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "expression → filter → new list: comprehensions combine transform and filter in one line",
      "code": "# Basic transformation\nsquares = [n ** 2 for n in range(1, 6)]\nprint(squares)   # [1, 4, 9, 16, 25]\n\n# With filter\nevens = [n for n in range(10) if n % 2 == 0]\nprint(evens)   # [0, 2, 4, 6, 8]\n\n# Transform strings\nnames = [\"alice\", \"bob\", \"carol\"]\nupper = [name.upper() for name in names]\nprint(upper)   # ['ALICE', 'BOB', 'CAROL']\n\n# Filter and transform together\nscores = [45, 82, 91, 38, 76, 55]\npassing = [s for s in scores if s >= 50]\ngrades = [\"Pass\" if s >= 50 else \"Fail\" for s in scores]\nprint(passing)   # [82, 91, 76, 55]\nprint(grades)    # ['Fail', 'Pass', 'Pass', 'Fail', 'Pass', 'Pass']\n\n# From list of dicts\nstudents = [\n    {\"name\": \"Alice\", \"score\": 92},\n    {\"name\": \"Bob\",   \"score\": 45},\n    {\"name\": \"Carol\", \"score\": 78},\n]\npassing_names = [s[\"name\"] for s in students if s[\"score\"] >= 50]\nprint(passing_names)   # ['Alice', 'Carol']\n\n# Flatten nested list\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat = [n for row in matrix for n in row]\nprint(flat)   # [1, 2, 3, 4, 5, 6, 7, 8, 9]",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "List comprehensions are idiomatic Python — use them for simple transformations and filters. The readability rule: if you can read it aloud in one breath and understand it immediately, it is fine as a comprehension. If you need to pause and parse it, write a loop instead. Clarity always beats cleverness."
      },
      "keyPoints": [
        "List comprehensions replace the empty-list + loop + append pattern in one line",
        "Syntax: [expression for item in iterable if condition] — the if clause is optional",
        "The if clause filters — only items where condition is True appear in the result",
        "Comprehensions are slightly faster than equivalent loops due to internal optimisation",
        "Keep comprehensions simple — if they need more than a glance to understand, use a loop"
      ],
      "tryIt": "Using list comprehensions only (no explicit loops): build a list of squares of odd numbers from 1 to 20, extract all names longer than 4 characters from a list of names, convert a list of temperatures in Celsius to Fahrenheit, and extract the 'email' field from a list of user dicts where 'active' is True."
    }
  },
  {
    "id": 75,
    "moduleId": 7,
    "moduleTitle": "Lists & Tuples",
    "title": "What Is a Tuple?",
    "type": "lesson",
    "content": {
      "body": "A tuple is an ordered, immutable sequence. It looks like a list but uses parentheses instead of square brackets — and once created, its contents cannot be changed. No appending, no removing, no reassigning items.\n\n## Creating Tuples\n\n```python\npoint = (3, 7)\nrgb = (255, 128, 0)\nsingle = (42,)   # trailing comma required for single-item tuple\nempty = ()\n```\n\nThe trailing comma for single-item tuples is easy to forget. Without it, `(42)` is just the integer 42 in parentheses — not a tuple.\n\n## Tuple Packing and Unpacking\n\nPython automatically packs multiple values into a tuple when you separate them with commas. Unpacking assigns each element to a separate variable in one line — this is one of Python's most elegant features.\n\n```python\ncoordinates = 3, 7          # packing — no parentheses needed\nx, y = coordinates          # unpacking\na, b, c = 1, 2, 3           # pack and unpack in one line\nfirst, *rest = [1, 2, 3, 4] # starred unpacking\n```\n\n## Tuples Are Hashable\n\nBecause tuples are immutable, they can be used as dictionary keys and added to sets. Lists cannot. This is one of the key practical differences.\n\n## Named Tuples\n\nThe `collections.namedtuple` factory creates tuple subclasses with named fields — giving you the immutability of a tuple with the readability of a class.",
      "diagram": "flowchart TD\n    A[\"Tuple (3, 7)\"] --> B[\"Ordered\nindex 0=3, index 1=7\"]\n    A --> C[\"Immutable\ncannot change items\"]\n    A --> D[\"Hashable\ncan be dict key or set item\"]\n    A --> E[\"Unpackable\nx, y = point\"]\n    B --> F[\"Same indexing\nas lists\"]\n    C --> G[\"TypeError if\nyou try to modify\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Tuples are immutable sequences — ordered and indexable like lists, but cannot be modified",
      "code": "# Creating tuples\npoint = (3, 7)\nrgb = (255, 128, 0)\nsingle = (42,)    # trailing comma required!\nnot_tuple = (42)  # just an int in parentheses\nprint(type(single))    # <class 'tuple'>\nprint(type(not_tuple)) # <class 'int'>\n\n# Indexing and slicing — same as lists\nprint(point[0])    # 3\nprint(rgb[-1])     # 0\nprint(rgb[1:])     # (128, 0)\n\n# Immutability\n# point[0] = 10   # TypeError: tuple does not support item assignment\n\n# Packing and unpacking\nx, y = point\nprint(f\"x={x}, y={y}\")\n\na, b, c = 1, 2, 3\nprint(a, b, c)\n\n# Starred unpacking\nfirst, *rest = [10, 20, 30, 40]\nprint(first)   # 10\nprint(rest)    # [20, 30, 40]\n\n# Swap variables — classic tuple trick\na, b = 5, 10\na, b = b, a\nprint(a, b)    # 10 5\n\n# Tuples as dict keys — lists cannot do this\nlocations = {(0, 0): \"origin\", (1, 0): \"right\", (0, 1): \"up\"}\nprint(locations[(0, 0)])   # origin",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "A single-item tuple requires a trailing comma: `(42,)` not `(42)`. Without the comma, Python treats the parentheses as grouping, not as a tuple literal. This is one of the most common tuple mistakes. Always check `type()` if you are unsure whether you have a tuple or just a parenthesised value."
      },
      "keyPoints": [
        "Tuples are ordered, immutable sequences — created with parentheses or just commas",
        "Single-item tuples require a trailing comma: (42,) not (42)",
        "Tuple unpacking assigns multiple values in one line — x, y = point",
        "Starred unpacking captures remaining items: first, *rest = items",
        "Tuples are hashable — they can be used as dictionary keys; lists cannot"
      ],
      "tryIt": "Create a tuple representing a 3D point (x, y, z). Unpack it into three variables and print each. Use it as a dictionary key mapping coordinates to location names. Try to modify one element and read the TypeError. Then use tuple unpacking to swap two variables without a temporary variable."
    }
  },

  {
    "id": 76,
    "moduleId": 7,
    "moduleTitle": "Lists & Tuples",
    "title": "Lists vs Tuples",
    "type": "lesson",
    "content": {
      "body": "Lists and tuples look similar and share many behaviours — both are ordered, indexed, and iterable. The key difference is mutability. Choosing between them is not just a technical decision — it communicates intent to anyone reading your code.\n\n## When to Use a List\n\nUse a list when the collection is meant to change — items will be added, removed, or reordered over time. A shopping cart, a queue of tasks, a growing log of events — these are lists.\n\n## When to Use a Tuple\n\nUse a tuple when the collection represents a fixed structure that should not change. Coordinates, RGB values, database rows, function return values with multiple parts — these are tuples. The immutability is a signal: \"this data is fixed, do not modify it.\"\n\n## Performance\n\nTuples are slightly faster to create and iterate than lists, and use less memory. For large collections of fixed data, this can matter. For most everyday code, the difference is negligible.\n\n## Semantic Meaning\n\nThe most important reason to choose a tuple over a list is semantic. A list of names suggests a collection that might grow. A tuple of (latitude, longitude) suggests a fixed pair. The type itself communicates the intended use.\n\n## Heterogeneous vs Homogeneous\n\nA common convention: tuples tend to hold heterogeneous data (different types with different meanings — a name, an age, a city), while lists tend to hold homogeneous data (many items of the same type — a list of scores, a list of names).",
      "diagram": "flowchart LR\n    A[\"Sequence needed\"] --> B{\"Will it change?\"}\n    B -->|\"Yes — add/remove/sort\"| C[\"Use a List\n[1, 2, 3]\"]\n    B -->|\"No — fixed structure\"| D[\"Use a Tuple\n(1, 2, 3)\"]\n    C --> E[\"Shopping cart\nTask queue\nGrowing log\"]\n    D --> F[\"Coordinates\nRGB values\nDB row\nReturn values\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Use a list when data changes; use a tuple when data is fixed — the type communicates intent",
      "code": "# List — mutable, homogeneous, grows over time\nscores = [85, 92, 78]\nscores.append(95)\nscores.sort()\nprint(scores)   # [78, 85, 92, 95]\n\n# Tuple — immutable, heterogeneous, fixed structure\nperson = (\"Alice\", 30, \"London\")\nname, age, city = person\nprint(f\"{name} is {age} in {city}\")\n\n# Tuple as return value — multiple values from a function\ndef min_max(numbers):\n    return min(numbers), max(numbers)   # returns a tuple\n\nlow, high = min_max([4, 7, 2, 9, 1])\nprint(f\"Range: {low} to {high}\")\n\n# Tuple as dict key — list cannot do this\ngrid = {}\ngrid[(0, 0)] = \"start\"\ngrid[(3, 4)] = \"end\"\n\n# Converting between them\nmy_list = [1, 2, 3]\nmy_tuple = tuple(my_list)\nback_to_list = list(my_tuple)\n\n# Shared operations\nfor item in (1, 2, 3):   # tuples are iterable\n    print(item)\n\nprint(len(person))        # 3\nprint(\"Alice\" in person)  # True",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "When a function needs to return multiple values, return them as a tuple — Python does this automatically when you separate values with commas. The caller can unpack them directly: `low, high = min_max(numbers)`. This is cleaner than returning a list and more explicit than returning a dict for simple cases."
      },
      "keyPoints": [
        "Use lists for mutable, homogeneous collections that will change over time",
        "Use tuples for fixed structures — coordinates, records, multi-value returns",
        "Tuples communicate intent: this data is fixed and should not be modified",
        "Tuples are slightly faster and use less memory than equivalent lists",
        "Functions returning multiple values return a tuple — unpack directly at the call site"
      ],
      "tryIt": "Write a function get_stats(numbers) that returns a tuple of (min, max, mean, count). Unpack the result into four variables and print each. Then store several (name, score) tuples in a list and sort the list by score using a lambda key. Notice how tuples work naturally as sortable records."
    }
  },

  {
    "id": 77,
    "moduleId": 7,
    "moduleTitle": "Lists & Tuples",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "List and tuple bugs are often silent — the code runs but produces wrong results. Most fall into a small number of patterns that are easy to avoid once you know them.\n\n## Mistake 1 — Confusing Assignment with Copy\n\nAssigning a list to a new variable does not copy it — both variables point to the same list. Modifying one modifies both. Use `.copy()` or `list[:]` to get an independent copy.\n\n## Mistake 2 — sort() Returns None\n\n`list.sort()` sorts in place and returns `None`. Writing `sorted_list = my_list.sort()` gives you `None`. Use `sorted(my_list)` when you need a new sorted list.\n\n## Mistake 3 — IndexError from Off-by-One\n\nAccessing `items[len(items)]` raises `IndexError` — the last valid index is `len(items) - 1`. Use `items[-1]` for the last item.\n\n## Mistake 4 — Forgetting the Trailing Comma in Single-Item Tuples\n\n`(42)` is an integer. `(42,)` is a tuple. The trailing comma is required and easy to forget.\n\n## Mistake 5 — Modifying a List While Iterating\n\nRemoving items from a list while looping over it skips elements silently. Iterate over a copy (`list[:]`) or build a new list with a comprehension.\n\n## Mistake 6 — append vs extend\n\n`list.append([1, 2, 3])` adds the list as a single nested item. `list.extend([1, 2, 3])` adds each element individually. Confusing them produces unexpected nesting.",
      "diagram": "flowchart TD\n    A[\"List Mistakes\"] --> B[\"a = b\nnot a copy — same object\"]\n    A --> C[\"sort() returns None\nnot the sorted list\"]\n    A --> D[\"items[len(items)]\nIndexError\"]\n    A --> E[\"(42) not a tuple\nneed (42,)\"]\n    A --> F[\"Modify while iterating\nskips items silently\"]\n    A --> G[\"append vs extend\nnesting vs flattening\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style G fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Most list bugs are silent — the code runs but produces wrong results",
      "code": "# Mistake 1 — assignment is not a copy\na = [1, 2, 3]\nb = a           # same object!\nb.append(4)\nprint(a)        # [1, 2, 3, 4] — a changed too!\nb = a.copy()    # fix: independent copy\nb.append(5)\nprint(a)        # [1, 2, 3, 4] — unchanged\n\n# Mistake 2 — sort() returns None\nnums = [3, 1, 2]\nresult = nums.sort()\nprint(result)   # None!\nresult = sorted(nums)   # fix\nprint(result)   # [1, 2, 3]\n\n# Mistake 3 — IndexError\nitems = [10, 20, 30]\n# print(items[3])   # IndexError\nprint(items[-1])    # fix: 30\n\n# Mistake 4 — single-item tuple\nnot_tuple = (42)\nis_tuple = (42,)\nprint(type(not_tuple))  # int\nprint(type(is_tuple))   # tuple\n\n# Mistake 5 — modify while iterating\nnums = [1, 2, 3, 4, 5]\nfor n in nums[:]:       # iterate over copy\n    if n % 2 == 0:\n        nums.remove(n)\nprint(nums)   # [1, 3, 5]\n\n# Mistake 6 — append vs extend\nlst = [1, 2]\nlst.append([3, 4])    # [[1, 2, [3, 4]]] — nested!\nlst2 = [1, 2]\nlst2.extend([3, 4])   # [1, 2, 3, 4] — flat\nprint(lst, lst2)",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "List assignment (`b = a`) creates an alias, not a copy. Both variables point to the same list in memory. This is one of the most common sources of subtle bugs — you modify what you think is a separate list and find the original has changed. Always use `.copy()` or `list[:]` when you need independence."
      },
      "keyPoints": [
        "b = a creates an alias — both point to the same list; use .copy() for independence",
        "sort() returns None — use sorted() when you need a new sorted list",
        "Last valid index is len(items) - 1 — use items[-1] for the last item",
        "Single-item tuples need a trailing comma: (42,) not (42)",
        "append() nests a list; extend() flattens it — know which you need"
      ],
      "tryIt": "Find and fix all six bugs: (1) `b = a; b.append(99)` expecting a unchanged, (2) `result = nums.sort()` expecting a sorted list, (3) `items[len(items)]`, (4) `t = (5)` expecting a tuple, (5) removing from a list while iterating directly, (6) `lst.append([10, 20])` expecting a flat list."
    }
  },

  {
    "id": 78,
    "moduleId": 7,
    "moduleTitle": "Lists & Tuples",
    "title": "Module 7 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered Python's two core sequence types — lists and tuples. Together they handle the vast majority of ordered data needs in real programs.\n\n## What You Learned\n\n**Lists** are ordered, mutable, dynamic collections. Create with square brackets. Index from 0, negative indices from the end. Slice with `[start:stop:step]` — stop is always exclusive.\n\n**Modifying lists** — `append()` adds one item, `extend()` adds many, `insert()` adds at a position. `remove()` deletes by value, `pop()` by index. `del` and `clear()` remove without returning.\n\n**List methods** — `count()`, `index()`, `copy()`, `reverse()`, `sort()`. Critical: `sort()` and `reverse()` modify in place and return `None`. Use `sorted()` when you need a new list.\n\n**Sorting and searching** — `sorted(key=, reverse=)` handles almost any sort. `min()`/`max()` accept `key=` too. Use `next((x for x in items if condition), None)` for clean dict searches.\n\n**List comprehensions** — `[expr for item in iterable if condition]` replaces the empty-list + loop + append pattern. Keep them simple enough to read at a glance.\n\n**Tuples** are ordered, immutable sequences. Single-item tuples need a trailing comma: `(42,)`. Tuple unpacking assigns multiple values in one line. Tuples are hashable — usable as dict keys.\n\n**Lists vs Tuples** — use lists for mutable homogeneous collections; use tuples for fixed structures and multi-value returns. The type communicates intent.\n\n## What Is Coming Next\n\nModule 8 introduces **dictionaries and sets** — Python's key-value store and unordered unique-value collection. Dictionaries are the backbone of almost every real Python program.",
      "diagram": "flowchart TD\n    A[\"✅ Lists\nordered mutable\"] --> B[\"✅ Indexing\n& Slicing\"]\n    B --> C[\"✅ Modifying\nappend extend pop\"]\n    C --> D[\"✅ Methods\nsort sorted copy\"]\n    D --> E[\"✅ Sorting &\nSearching\"]\n    E --> F[\"✅ List\nComprehensions\"]\n    F --> G[\"✅ Tuples\nordered immutable\"]\n    G --> H[\"✅ Lists vs\nTuples\"]\n    H --> I[\"➡️ Dicts & Sets\nModule 8\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 7 complete — sequences are the foundation for all data processing in Python",
      "code": "# Everything from Module 7 in one program\ndef analyse_results(raw_scores):\n    if not raw_scores:\n        return None\n\n    scores = sorted(raw_scores, reverse=True)\n    total = sum(scores)\n    average = total / len(scores)\n    passing = [s for s in scores if s >= 50]\n    failing = [s for s in scores if s < 50]\n\n    top3 = scores[:3]\n    bottom3 = scores[-3:]\n\n    stats = (min(scores), max(scores), round(average, 1))\n    low, high, avg = stats\n\n    return {\n        \"total\": len(scores),\n        \"passing\": len(passing),\n        \"failing\": len(failing),\n        \"top_3\": top3,\n        \"bottom_3\": bottom3,\n        \"range\": f\"{low} – {high}\",\n        \"average\": avg,\n    }\n\nresults = analyse_results([85, 42, 91, 78, 55, 63, 38, 97, 72, 49])\nfor key, value in results.items():\n    print(f\"{key}: {value}\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Before moving on, make sure you can explain the difference between sort() and sorted(), between append() and extend(), and between list assignment and list copy. These three distinctions catch out even experienced developers. If you can write the analyse_results() function above from memory, you are ready for Module 8."
      },
      "keyPoints": [
        "Lists are mutable — use append/extend/pop/remove to modify them",
        "sort() modifies in place and returns None — use sorted() for a new list",
        "List comprehensions replace the empty-list + loop + append pattern",
        "Tuples are immutable — use them for fixed structures and multi-value returns",
        "b = a is an alias not a copy — use .copy() or [:] for independence"
      ],
      "tryIt": "From memory, write a function process_scores(scores) that returns a tuple of (passed, failed, average) where passed and failed are lists of scores and average is rounded to 1 decimal. Use a list comprehension for passed and failed. Unpack the result at the call site into three variables."
    }
  },
  // =========================
  // Python Module 8: Dictionaries & Sets
  // =========================

  // =========================
  // Python Module 9: Advanced Data Operations (Comprehensions & Functional Patterns)
  // =========================

  // =========================
  // Python Module 10: Working with Files (Reading & Writing Data)
  // =========================

  // =========================
  // Python Module 11: Errors & Exceptions
  // =========================

  // =========================
  // Python Module 12: Recursion & the Call Stack
  // =========================

  // =========================
  // Python Module 13: Modules & Packages
  // =========================

  // =========================
  // Python Module 14: Object-Oriented Programming (OOP)
  // =========================

  // =========================
  // Python Module 15: Virtual Environments & Tooling
  // =========================

  // =========================
  // Python Module 16: Testing Basics (Writing Reliable Code)
  // =========================

  // =========================
  // Python Module 17: Working with APIs (HTTP & External Data)
  // =========================

  // =========================
  // Python Module 18: Capstone Project (End-to-End Application)
  // =========================

  // =========================
  // Python Module 19: Career Paths & Next Steps
  // =========================

  // =========================
  // Additional Python Code Examples (to deepen practice)
  // =========================

  {
    "id": 8,
    "moduleId": 1,
    "moduleTitle": "Introduction to Programming & Python",
    "title": "The Python REPL",
    "type": "lesson",
    "content": {
      "body": "The Python REPL (Read-Eval-Print Loop) is an interactive environment where you type one line of Python and see the result immediately. It is the fastest way to test ideas, check syntax, and explore how Python behaves.\n\n## How to Open the REPL\n\nOpen your terminal and type `python` or `python3` and press Enter. You will see a prompt that looks like `>>>`. This means Python is ready for your input.\n\n## What the REPL Is Good For\n\n- Testing a single expression quickly\n- Checking what a function returns\n- Exploring a new library\n- Verifying your understanding of a concept\n\n## What the REPL Is Not Good For\n\nThe REPL is not where you write programs. It does not save your work, and multi-line code is awkward to write there. Use it for quick experiments, then write your actual programs in `.py` files.",
      "code": "# In the REPL, you type one line and see the result immediately\n# The >>> is the prompt — you do not type it\n\n# Try these one at a time:\n2 + 2\nprint(\"Hello\")\nlen(\"Python\")\ntype(42)\ntype(\"hello\")\ntype(3.14)\ntype(True)",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "In the REPL, you can type an expression without print() and Python will show you its value. This only works in the REPL — in a .py file, you must use print() to see output."
      },
      "keyPoints": [
        "The REPL lets you run Python one line at a time and see results immediately",
        "Open it by typing python or python3 in your terminal",
        "Use it for quick experiments and testing ideas",
        "Write actual programs in .py files, not in the REPL",
        "type() tells you the data type of any value"
      ],
      "diagram": "flowchart LR\n    A[\"You type\nan expression\"] --> B[\"Read\"]\n    B --> C[\"Eval\n(execute)\"]\n    C --> D[\"Print\n(show result)\"]\n    D --> E[\"Loop\n(>>> prompt again)\"]\n    E --> A\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "REPL = Read → Eval → Print → Loop — instant feedback on every line",
      "tryIt": "Open the Python REPL and try each of these one at a time: `2 ** 8`, `len('Python')`, `type(3.14)`, `'hello'.upper()`, `10 // 3`. Notice how each line immediately shows its result without needing print()."
    }
  },

  {
    "id": 9,
    "moduleId": 1,
    "moduleTitle": "Introduction to Programming & Python",
    "title": "Reading Your First Error",
    "type": "lesson",
    "content": {
      "body": "The code below contains a deliberate syntax error. Run it, read the error message carefully, then fix it. This exercise is more valuable than it looks — learning to read errors quickly is one of the most important skills in programming.\n\n## What to Look For\n\nWhen you run the broken code, Python will show you:\n\n1. The word `File` followed by the filename and line number\n2. The line of code that caused the problem\n3. A caret (`^`) pointing to where Python got confused\n4. The error type and a description\n\n## The Fix\n\nThe error is a missing closing parenthesis on line 1. Python opened a `(` but never found the matching `)`. Add the closing parenthesis and run it again.",
      "code": "# This code has a deliberate error\n# Run it, read the error, then fix it\n\nprint(\"Hello, World!\"\nprint(\"I am learning Python\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "SyntaxError means Python cannot even parse the line — it cannot understand what you wrote. This is always a structural problem: a missing bracket, quote, colon, or parenthesis."
      },
      "keyPoints": [
        "SyntaxError means Python cannot parse the line — check for missing brackets or quotes",
        "The caret (^) in the error output points to where Python got confused",
        "The line number in the error tells you where to look",
        "Fix one error at a time and re-run after each fix",
        "Getting comfortable with errors early makes you a faster developer"
      ],
      "tryIt": "After fixing the error above, deliberately introduce three different types of errors one at a time: remove a quote, remove a parenthesis, and misspell 'print'. Read each error message before fixing it.",
      "diagram": "flowchart TD\n    A[\"SyntaxError output\"] --> B[\"File name\n& line number\"]\n    A --> C[\"The broken\nline of code\"]\n    A --> D[\"^ caret pointing\nto the problem\"]\n    A --> E[\"Error type\n& description\"]\n    E --> F[\"Read this\nfirst\"]\n    D --> G[\"Look here\nsecond\"]\n    B --> H[\"Go to this\nline third\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style G fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style H fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Read error messages bottom-up: error type first, then the caret, then the line number"
    }
  },

  {
    "id": 44,
    "moduleId": 4,
    "moduleTitle": "Control Flow & Conditionals",
    "title": "Boolean Expressions in Conditions",
    "type": "lesson",
    "content": {
      "body": "Any expression that evaluates to `True` or `False` can be used as an `if` condition. You are not limited to simple comparisons — you can combine multiple conditions with `and`/`or`/`not`, use membership tests, check truthiness directly, and store conditions in named variables for clarity.\n\n## Combining Conditions\n\nUse `and` when all conditions must be true simultaneously. Use `or` when any one condition is enough. Use `not` to invert a condition.\n\n```python\nif age >= 18 and has_id:\n    print(\"Entry allowed\")\n\nif balance == 0 or balance < 0:\n    print(\"Insufficient funds\")\n\nif not is_banned:\n    print(\"Welcome\")\n```\n\n## Truthiness in Conditions\n\nPython evaluates any value as truthy or falsy in a boolean context — you do not always need an explicit comparison. This leads to cleaner, more idiomatic code:\n\n| Instead of | Write |\n|---|---|\n| `if name != \"\"` | `if name` |\n| `if items != []` | `if items` |\n| `if count != 0` | `if count` |\n| `if result is not None` | `if result` |\n\n## Storing Conditions in Variables\n\nWhen a condition is complex, store it in a named boolean variable. This makes the `if` line read like plain English and makes the logic easier to test and reuse.\n\n```python\nis_eligible = age >= 18 and not is_banned and balance > 0\nif is_eligible:\n    process_order()\n```",
      "diagram": "flowchart TD\n    A[\"Condition types\"] --> B[\"Comparison\nage >= 18\"]\n    A --> C[\"Logical\nand / or / not\"]\n    A --> D[\"Membership\n'@' in email\"]\n    A --> E[\"Truthiness\nif name:\"]\n    A --> F[\"Named boolean\nis_eligible = ...\"]\n    B --> G[\"if statement\"]\n    C --> G\n    D --> G\n    E --> G\n    F --> G\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Any expression that produces True or False is a valid if condition",
      "code": "age = 22\nhas_id = True\nis_banned = False\nbalance = 50\nusername = \"alice\"\nitems = [1, 2, 3]\n\n# and — all must be True\nif age >= 18 and has_id and not is_banned:\n    print(\"Access granted\")\n\n# or — any one is enough\nif balance < 0 or balance == 0:\n    print(\"Top up required\")\n\n# Truthiness — no explicit comparison needed\nif username:\n    print(f\"Hello, {username}\")\n\nif items:\n    print(f\"You have {len(items)} items\")\n\nif not is_banned:\n    print(\"Account active\")\n\n# Named boolean — readable and reusable\ncan_purchase = age >= 18 and balance > 0 and not is_banned\nif can_purchase:\n    print(\"Purchase approved\")\nelse:\n    print(\"Purchase denied\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Prefer `if name:` over `if name != ''` and `if items:` over `if len(items) > 0`. Python's truthiness rules exist precisely so you can write conditions that read naturally. The explicit comparison adds noise without adding clarity."
      },
      "keyPoints": [
        "Any expression evaluating to True or False is a valid if condition",
        "and requires all conditions True; or requires at least one True",
        "Non-empty strings, non-zero numbers, and non-empty collections are truthy",
        "Empty string, 0, None, and empty collections are falsy",
        "Store complex conditions in named boolean variables to improve readability"
      ],
      "tryIt": "Write a function called can_register(username, age, email) that returns True only if: the username is non-empty, the age is 13 or older, and the email contains '@'. Test it with at least four combinations — one that passes all checks and three that each fail a different check."
    }
  },

  // =========================
  // NEW: Missing Topics — Modules 1-5
  // =========================

  {
    "id": 17,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "f-Strings — The Modern Way to Format Text",
    "type": "lesson",
    "content": {
      "body": "f-strings (formatted string literals) were introduced in Python 3.6 and have become the standard way to build strings that contain variable data. They are faster, more readable, and more powerful than the older approaches they replaced.\n\n## The Basic Syntax\n\nPrefix any string with `f` and place variable names or expressions inside curly braces `{}`. Python evaluates everything inside the braces and inserts the result into the string.\n\n```python\nname = \"Alice\"\nprint(f\"Hello, {name}\")   # Hello, Alice\n```\n\n## Expressions Inside f-Strings\n\nThe curly braces can contain any valid Python expression — not just variable names. You can do arithmetic, call functions, access list items, and more, all directly inside the string.\n\n## Number Formatting\n\nf-strings support format specifiers after a colon inside the braces. These control how numbers are displayed:\n\n- `{value:.2f}` — 2 decimal places\n- `{value:,}` — thousands separator\n- `{value:.0%}` — percentage with no decimals\n- `{value:>10}` — right-align in a field of width 10\n\n## Before f-Strings\n\nPython had two older formatting approaches: the `%` operator and the `.format()` method. You will see these in older code, but f-strings are the modern standard and what you should write going forward.",
      "diagram": "flowchart LR\n    A[\"f-string\"] --> B[\"f'Hello, {name}!'\"]\n    B --> C[\"Prefix: f\"]\n    B --> D[\"Regular text:\nHello, \"]\n    B --> E[\"Expression:\n{name}\"]\n    B --> F[\"Regular text:\n!\"]\n    E --> G[\"Evaluated at\nruntime\"]\n    G --> H[\"Result inserted\ninto string\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style E fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "An f-string evaluates expressions inside {} at runtime and inserts the results",
      "code": "name = \"Alice\"\nage = 30\nprice = 49999.5\nscore = 0.876\n\n# Basic variable embedding\nprint(f\"Hello, {name}!\")\n\n# Expressions inside braces\nprint(f\"Next year: {age + 1}\")\nprint(f\"Uppercase: {name.upper()}\")\nprint(f\"Name length: {len(name)} characters\")\n\n# Number formatting\nprint(f\"Price: {price:.2f}\")        # 49999.50\nprint(f\"Price: {price:,.2f}\")       # 49,999.50\nprint(f\"Score: {score:.1%}\")        # 87.6%\nprint(f\"Age: {age:05d}\")            # 00030 (zero-padded)\n\n# Multi-line f-string\nsummary = (\n    f\"Name:  {name}\n\"\n    f\"Age:   {age}\n\"\n    f\"Score: {score:.1%}\"\n)\nprint(summary)",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "You may see older Python code using `'Hello %s' % name` or `'Hello {}'.format(name)`. Both work but are considered outdated. Always write f-strings in new code — they are faster and far more readable."
      },
      "keyPoints": [
        "Prefix a string with f to make it an f-string: f'Hello, {name}'",
        "Anything inside {} is evaluated as a Python expression at runtime",
        "Format specifiers after a colon control number display: {value:.2f} for 2 decimal places",
        "f-strings can contain arithmetic, function calls, and method calls inside {}",
        "f-strings replaced the older % and .format() approaches — use f-strings in all new code"
      ],
      "tryIt": "Create variables for a product name, price, and discount percentage. Use an f-string to print a receipt line like: 'Python Book: $49.99 (10% off) — You pay: $44.99'. Format the prices to 2 decimal places."
    }
  },

  {
    "id": 23,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "The None Type",
    "type": "lesson",
    "content": {
      "body": "`None` is Python's way of representing the complete absence of a value. It is not zero, not an empty string, not `False` — it is a distinct value that means \"nothing is here\". Every programming language needs a way to express \"no value\", and `None` is Python's answer.\n\n## None Is Its Own Type\n\n`None` has its own type in Python: `NoneType`. There is exactly one `None` value in all of Python — it is a singleton. This means every variable set to `None` points to the same object.\n\n## Where None Appears\n\n**Functions that return nothing** — if a function does not have a `return` statement, it automatically returns `None`. This catches many beginners off guard when they try to use the result of a function that does not return anything.\n\n**Default and placeholder values** — `None` is commonly used to initialise a variable before you have a real value to put in it. It signals \"not set yet\".\n\n**Optional function parameters** — functions often use `None` as a default parameter value to indicate that the argument was not provided.\n\n## Checking for None\n\nAlways use `is None` or `is not None` to check for `None`. Never use `== None`. The reason is subtle but important: `==` calls the object's equality method, which can be overridden. `is` checks identity — whether two names point to the exact same object in memory. Since there is only one `None`, `is` is always correct.",
      "diagram": "flowchart TD\n    A[\"Variable\"] --> B{\"Has a value?\"}\n    B -->|\"Yes\"| C[\"int, float,\nstr, bool, etc.\"]\n    B -->|\"No\"| D[\"None\nNoneType\"]\n    E[\"Function without\nreturn statement\"] --> D\n    F[\"Uninitialised\nplaceholder\"] --> D\n    G[\"Optional parameter\nnot provided\"] --> D\n    style D fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "None represents the absence of a value — it appears in functions, placeholders, and optional parameters",
      "code": "# None is its own type\nprint(type(None))   # <class 'NoneType'>\nprint(None)         # None\n\n# Functions without return give back None\ndef greet(name):\n    print(f\"Hello, {name}\")   # no return statement\n\nresult = greet(\"Alice\")\nprint(result)       # None — the function returned nothing\n\n# Using None as a placeholder\nuser_email = None   # not set yet\nif user_email is None:\n    print(\"No email provided\")\n\n# None as a default parameter\ndef create_user(name, email=None):\n    if email is None:\n        email = f\"{name.lower()}@example.com\"\n    return {\"name\": name, \"email\": email}\n\nprint(create_user(\"Alice\"))\nprint(create_user(\"Bob\", \"bob@gmail.com\"))",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Always use `is None` and `is not None` — never `== None`. Using `==` works most of the time but can fail with custom objects that override equality. `is` is always correct for None checks."
      },
      "keyPoints": [
        "None represents the complete absence of a value — it is not 0, not False, not empty string",
        "None has its own type: NoneType",
        "Functions without a return statement automatically return None",
        "Use None to initialise variables before you have a real value",
        "Always check for None with `is None` or `is not None`, never with `== None`"
      ],
      "tryIt": "Write a function called find_number that takes a list and a target number. Return the index if found, or None if not found. Test it with both a number that exists and one that does not."
    }
  },

  {
    "id": 24,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "None in Practice",
    "type": "lesson",
    "content": {
      "body": "Understanding `None` conceptually is one thing. Knowing how to use it correctly in real code is another. This lesson covers the practical patterns you will encounter and write constantly as a Python developer.\n\n## Pattern 1 — Guard Clauses\n\nBefore using a value that might be `None`, check it first. This is called a **guard clause** — you check for the invalid case at the top and return early, keeping the rest of the function clean.\n\n## Pattern 2 — Safe Defaults with or\n\nThe `or` operator provides a clean way to substitute a default when a value is `None` or falsy. `value or default` returns `value` if it is truthy, otherwise returns `default`.\n\n## Pattern 3 — Returning None to Signal Failure\n\nFunctions that search for something or perform a lookup often return `None` when nothing is found. This is cleaner than raising an exception for an expected \"not found\" case.\n\n## The Most Common None Bug\n\nCalling a method on a variable that holds `None` raises an `AttributeError`. This happens when you forget that a function returns `None` and try to use the result as if it were a real value. Always check the return value before using it.",
      "code": "# Pattern 1 — Guard clause\ndef get_username(user):\n    if user is None:\n        return \"Guest\"\n    return user[\"name\"]\n\nprint(get_username(None))                    # Guest\nprint(get_username({\"name\": \"Alice\"}))       # Alice\n\n# Pattern 2 — Safe default with or\nconfig_timeout = None\ntimeout = config_timeout or 30   # use 30 if None\nprint(timeout)                   # 30\n\nuser_name = \"Bob\"\ndisplay = user_name or \"Anonymous\"\nprint(display)                   # Bob\n\n# Pattern 3 — Return None to signal not found\ndef find_user(users, email):\n    for user in users:\n        if user[\"email\"] == email:\n            return user\n    return None   # not found\n\nusers = [{\"name\": \"Alice\", \"email\": \"alice@example.com\"}]\nresult = find_user(users, \"bob@example.com\")\n\nif result is None:\n    print(\"User not found\")\nelse:\n    print(f\"Found: {result['name']}\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "The most common None bug: `result = some_function()` followed by `result.something()` — if the function returned None, you get `AttributeError: 'NoneType' object has no attribute 'something'`. Always check `if result is not None` before calling methods on a return value."
      },
      "keyPoints": [
        "Use guard clauses to check for None at the top of a function and return early",
        "The `or` operator provides safe defaults: `value or default` returns default when value is None",
        "Returning None from a function signals 'not found' for expected missing cases",
        "Always check `is not None` before calling methods on a value that might be None",
        "AttributeError on NoneType almost always means you forgot to check a return value"
      ],
      "tryIt": "Write a function called get_first_name that takes a full name string or None. If None, return 'Unknown'. If a string, return the first word. Test it with None, a single name, and a full name.",
      "diagram": "flowchart TD\n    A[\"Value might\nbe None\"] --> B{\"is None?\"}\n    B -->|\"Yes\"| C[\"Return early\nor use default\"]\n    B -->|\"No\"| D[\"Safe to use\"]\n    C --> E[\"Guard clause\nreturn 'Guest'\"]\n    C --> F[\"Safe default\nvalue or 30\"]\n    D --> G[\"Call methods\naccess keys\"]\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Always check for None before using a value — guard clauses keep code flat and safe"
    }
  },

  {
    "id": 18,
    "moduleId": 2,
    "moduleTitle": "Variables, Data Types & Input",
    "title": "String Methods — Essential Built-ins",
    "type": "lesson",
    "content": {
      "body": "Strings in Python come with a rich set of built-in methods — functions that belong to the string and are called using dot notation. These methods handle the most common text processing tasks: cleaning input, changing case, searching for substrings, and splitting or joining text.\n\nYou will use these methods in almost every Python program you write. Learning them well saves you from writing loops and conditions to do things Python already knows how to do.\n\n## Cleaning Methods\n\n**strip()** removes whitespace (spaces, tabs, newlines) from both ends of a string. `lstrip()` removes from the left only, `rstrip()` from the right only. This is essential when processing user input or reading from files, where trailing spaces are common.\n\n**lower()** and **upper()** convert all characters to lowercase or uppercase. These are used constantly for case-insensitive comparisons — comparing `email.lower()` ensures \"Alice@Example.COM\" matches \"alice@example.com\".\n\n## Searching Methods\n\n**find(substring)** returns the index of the first occurrence of a substring, or `-1` if not found. **index()** does the same but raises a `ValueError` if not found — use `find()` when absence is expected, `index()` when it must exist.\n\n**count(substring)** returns how many times a substring appears.\n\n## Transforming Methods\n\n**replace(old, new)** returns a new string with all occurrences of `old` replaced by `new`.\n\n**split(separator)** breaks a string into a list of substrings at each separator. If no separator is given, it splits on any whitespace.\n\n**join(iterable)** is the reverse of split — it joins a list of strings into one string, placing the separator between each item.",
      "diagram": "flowchart TD\n    A[\"String Methods\"] --> B[\"Cleaning\nstrip lower upper title\"]\n    A --> C[\"Searching\nfind count in startswith endswith\"]\n    A --> D[\"Transforming\nreplace split join\"]\n    A --> E[\"Checking\nisdigit isalpha isspace\"]\n    B --> F[\"Clean user input\nNormalise for comparison\"]\n    C --> G[\"Validate format\nSearch content\"]\n    D --> H[\"Parse data\nBuild output\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style C fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style D fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style E fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "String methods grouped by purpose — cleaning, searching, transforming, and checking",
      "code": "text = \"  Hello, World!  \"\n\n# Cleaning\nprint(text.strip())          # \"Hello, World!\"\nprint(text.lower())          # \"  hello, world!  \"\nprint(text.upper())          # \"  HELLO, WORLD!  \"\nprint(\"hello world\".title()) # \"Hello World\"\n\n# Searching\nsentence = \"the cat sat on the mat\"\nprint(sentence.find(\"cat\"))      # 4\nprint(sentence.find(\"dog\"))      # -1 (not found)\nprint(sentence.count(\"at\"))      # 3\n\n# Transforming\nprint(sentence.replace(\"cat\", \"dog\"))\n# \"the dog sat on the mat\"\n\ncsv_line = \"Alice,30,Lagos\"\nparts = csv_line.split(\",\")\nprint(parts)   # ['Alice', '30', 'Lagos']\n\nwords = [\"Python\", \"is\", \"great\"]\nprint(\" \".join(words))   # \"Python is great\"\nprint(\"-\".join(words))   # \"Python-is-great\"",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "String methods never modify the original string — they always return a new one. `text.upper()` does not change `text`. You must assign the result: `text = text.upper()` or `upper_text = text.upper()`."
      },
      "keyPoints": [
        "strip() removes whitespace from both ends — essential for cleaning user input",
        "lower() and upper() change case — use lower() for case-insensitive comparisons",
        "find() returns the index of a substring or -1 if not found",
        "split() breaks a string into a list; join() combines a list into a string",
        "String methods return new strings — they never modify the original"
      ],
      "tryIt": "Take the string '  alice.smith@EXAMPLE.COM  '. Clean it with strip(), convert to lowercase, then split on '@' to separate the username from the domain. Print each part separately."
    }
  },

  {
    "id": 19,
    "moduleId": 3,
    "moduleTitle": "Operators & Expressions",
    "title": "What Is an Operator?",
    "type": "lesson",
    "content": {
      "body": "An **operator** is a symbol that performs an action on one or more values. The values it acts on are called **operands**. Together, an operator and its operands form an **expression** — a piece of code that Python evaluates to produce a result.\n\nEvery meaningful line of Python code contains at least one expression. When you write `age + 1`, Python evaluates it and produces a new value. When you write `score >= 50`, Python evaluates it and produces `True` or `False`. Understanding operators is understanding how Python computes things.\n\n## The Three Categories of Operators\n\nPython operators fall into three main categories, each serving a different purpose:\n\n**Arithmetic operators** perform mathematical calculations — addition, subtraction, multiplication, division, and more. They work on numbers and produce numeric results.\n\n**Comparison operators** compare two values and always produce a boolean result — either `True` or `False`. They are the foundation of every decision your program makes.\n\n**Logical operators** combine or modify boolean values. They let you express complex conditions like \"the user is logged in AND has admin rights\" or \"the input is empty OR invalid\".\n\n## Expressions vs Statements\n\nAn **expression** is any piece of code that produces a value. `2 + 3` is an expression — it produces `5`. `age >= 18` is an expression — it produces `True` or `False`.\n\nA **statement** is a complete instruction that does something. `print(2 + 3)` is a statement — it performs an action. The expression `2 + 3` lives inside it.\n\nThis distinction matters because expressions can be nested, combined, and passed as arguments. Statements cannot.",
      "diagram": "flowchart LR\n    A[\"Operand\n10\"] --> C[\"Expression\n10 + 5\"]\n    B[\"Operator\n+\"] --> C\n    D[\"Operand\n5\"] --> C\n    C --> E[\"Result\n15\"]\n    F[\"Operand\nage\"] --> H[\"Expression\nage >= 18\"]\n    G[\"Operator\n>=\"] --> H\n    I[\"Operand\n18\"] --> H\n    H --> J[\"Result\nTrue or False\"]\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b\n    style J fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "An expression combines operands and an operator to produce a result",
      "code": "# Arithmetic expression — produces a number\nresult = 10 + 5\nprint(result)        # 15\n\n# Comparison expression — produces True or False\nage = 20\nis_adult = age >= 18\nprint(is_adult)      # True\n\n# Logical expression — combines booleans\nhas_ticket = True\ncan_enter = is_adult and has_ticket\nprint(can_enter)     # True\n\n# Expressions can be used directly\nprint(10 * 3)        # 30\nprint(100 > 50)      # True\nprint(not False)     # True",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Python evaluates expressions immediately. When you write `print(10 + 5)`, Python first evaluates `10 + 5` to get `15`, then passes `15` to `print()`. The expression is always resolved before it is used."
      },
      "keyPoints": [
        "An operator is a symbol that performs an action on one or more values (operands)",
        "An expression is any code that evaluates to a value — numbers, booleans, strings",
        "Arithmetic operators produce numbers; comparison operators produce True or False",
        "Logical operators combine or modify boolean values",
        "Expressions can be nested, combined, and passed as arguments to functions"
      ],
      "tryIt": "Write three expressions: one that calculates the area of a rectangle (length x width), one that checks if a temperature is above freezing (> 0), and one that checks if a number is both positive and even. Print each result."
    }
  },

  {
    "id": 55,
    "moduleId": 5,
    "moduleTitle": "Loops",
    "title": "enumerate() and zip()",
    "type": "lesson",
    "content": {
      "body": "Two built-in functions make common loop patterns significantly cleaner: `enumerate()` when you need both the index and the value, and `zip()` when you need to loop over two sequences in parallel.\n\n## enumerate() — Index and Value Together\n\nWhen you need the position of each item as well as the item itself, the naive approach is `range(len(items))` and then `items[i]`. `enumerate()` is the cleaner alternative — it yields `(index, value)` pairs directly.\n\n```python\nfor i, name in enumerate(names):\n    print(f\"{i}: {name}\")\n```\n\nBy default the index starts at 0. Pass a second argument to start from a different number: `enumerate(names, start=1)`.\n\n## zip() — Loop Over Two Lists in Parallel\n\n`zip()` pairs up elements from two (or more) iterables by position. It stops when the shortest iterable is exhausted.\n\n```python\nfor name, score in zip(names, scores):\n    print(f\"{name}: {score}\")\n```\n\nThis is far cleaner than maintaining a manual index to access both lists simultaneously.\n\n## Combining Both\n\nYou can combine `enumerate()` and `zip()` — wrap `zip()` in `enumerate()` when you need the index as well as paired values.",
      "diagram": "flowchart LR\n    A[\"enumerate(items)\"] --> B[\"(0, item0)\n(1, item1)\n(2, item2)\"]\n    C[\"zip(a, b)\"] --> D[\"(a0, b0)\n(a1, b1)\n(a2, b2)\"]\n    E[\"enumerate(zip(a,b))\"] --> F[\"(0, (a0,b0))\n(1, (a1,b1))\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "enumerate() adds an index; zip() pairs two sequences — both avoid manual index tracking",
      "code": "names = [\"Alice\", \"Bob\", \"Carol\"]\nscores = [92, 78, 85]\n\n# enumerate() — index + value\nfor i, name in enumerate(names):\n    print(f\"{i}: {name}\")\n# 0: Alice  1: Bob  2: Carol\n\n# Start index at 1\nfor i, name in enumerate(names, start=1):\n    print(f\"{i}. {name}\")\n# 1. Alice  2. Bob  3. Carol\n\n# zip() — parallel iteration\nfor name, score in zip(names, scores):\n    print(f\"{name}: {score}\")\n# Alice: 92  Bob: 78  Carol: 85\n\n# zip stops at shortest — safe with unequal lengths\nextra = [True, False]\nfor name, active in zip(names, extra):\n    print(f\"{name} active: {active}\")\n# Alice: True  Bob: False  (Carol skipped)\n\n# Combine enumerate + zip\nfor i, (name, score) in enumerate(zip(names, scores), start=1):\n    grade = \"Pass\" if score >= 50 else \"Fail\"\n    print(f\"{i}. {name}: {score} — {grade}\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Prefer `enumerate()` over `range(len(items))` whenever you need both index and value. `for i, item in enumerate(items)` is more readable, less error-prone, and works on any iterable — not just lists. `range(len())` is considered unpythonic when `enumerate()` would do the job."
      },
      "keyPoints": [
        "enumerate() yields (index, value) pairs — cleaner than range(len()) for indexed loops",
        "enumerate(items, start=1) starts the index at 1 instead of 0",
        "zip() pairs elements from two or more iterables by position",
        "zip() stops at the shortest iterable — no IndexError on unequal lengths",
        "Combine enumerate(zip(...)) when you need index and paired values simultaneously"
      ],
      "tryIt": "Given two lists — one of product names and one of prices — use zip() to print each product with its price. Then use enumerate(start=1) to add a numbered position. Finally, use zip() to find and print the most expensive product by iterating both lists in parallel."
    }
  },

  {
    "id": 56,
    "moduleId": 5,
    "moduleTitle": "Loops",
    "title": "Looping Over Strings",
    "type": "lesson",
    "content": {
      "body": "Strings are sequences of characters, and Python treats them as iterables. Every loop technique that works on lists also works on strings — `for`, `enumerate()`, `zip()`, and list comprehensions all apply.\n\n## Character-by-Character Iteration\n\nA `for` loop over a string gives you one character per iteration. This is the foundation of character-level string processing — counting, filtering, transforming, and validating.\n\n## Common Patterns\n\n**Counting characters** — loop and increment a counter when the condition matches.\n\n**Building a new string** — start with an empty string and concatenate characters that pass a filter. For performance on large strings, collect into a list and join at the end.\n\n**Checking all characters** — Python's built-in `all()` and `any()` work with generator expressions over strings, giving you a one-line alternative to a loop with a flag.\n\n## Strings Are Immutable\n\nYou cannot modify a string in place by iterating over it. Assigning to `s[i]` raises a `TypeError`. To transform a string, build a new one — either by concatenation, list comprehension, or `str.join()`.\n\n## When to Use a Loop vs a Method\n\nMany character-level operations have built-in string methods that are faster and more readable than manual loops. Use `str.count()`, `str.replace()`, `str.upper()` when they fit. Write a loop when the logic is too specific for a built-in method.",
      "diagram": "flowchart TD\n    A[\"String: 'Python'\"] --> B[\"for char in s\"]\n    B --> C[\"'P' → 'y' → 't' → 'h' → 'o' → 'n'\"]\n    C --> D[\"Count vowels\"]\n    C --> E[\"Filter chars\"]\n    C --> F[\"Build new string\"]\n    C --> G[\"Validate content\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "String iteration gives one character per loop — the basis of all character-level processing",
      "code": "text = \"Hello, Python!\"\n\n# Count vowels\nvowels = 0\nfor char in text:\n    if char.lower() in \"aeiou\":\n        vowels += 1\nprint(f\"Vowels: {vowels}\")\n\n# Build filtered string — collect then join (efficient)\nletters_only = \"\".join(char for char in text if char.isalpha())\nprint(letters_only)   # HelloPython\n\n# enumerate() on a string — index + character\nfor i, char in enumerate(\"abc\"):\n    print(f\"{i}: {char}\")\n\n# Check all/any — no explicit loop needed\npassword = \"Secure123\"\nhas_digit = any(char.isdigit() for char in password)\nhas_upper = any(char.isupper() for char in password)\nall_alnum = all(char.isalnum() for char in password)\nprint(has_digit, has_upper, all_alnum)   # True True True\n\n# Reverse a string using a loop\nword = \"Python\"\nreversed_word = \"\"\nfor char in word:\n    reversed_word = char + reversed_word\nprint(reversed_word)   # nohtyP\n# Pythonic alternative: word[::-1]",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Building a string by concatenation inside a loop (`s += char`) creates a new string object on every iteration — O(n²) for n characters. For large strings, collect characters into a list and use `''.join(chars)` at the end. This is O(n) and significantly faster."
      },
      "keyPoints": [
        "Strings are iterable — for loops give one character per iteration",
        "Strings are immutable — you cannot modify characters in place, build a new string instead",
        "Use ''.join(list) instead of += concatenation in loops for performance",
        "any() and all() with generator expressions replace flag-based loops cleanly",
        "Use built-in string methods (count, replace, upper) when they fit — write loops for custom logic"
      ],
      "tryIt": "Write a function analyse_text(text) that returns a dictionary with four keys: 'vowels' (count), 'consonants' (count), 'digits' (count), and 'spaces' (count). Test it on at least two different strings and verify the counts add up to the total length."
    }
  },

  // =========================
  // NEW: Missing Topics — Modules 6-10
  // =========================

  {
    "id": 62,
    "moduleId": 6,
    "moduleTitle": "Functions & Scope",
    "title": "Default Parameter Values",
    "type": "lesson",
    "content": {
      "body": "Default parameter values make function arguments optional. When a caller does not supply a value for a parameter that has a default, Python uses the default automatically. This lets a single function serve both simple and complex use cases without requiring the caller to specify every argument every time.\n\n## Syntax\n\n```python\ndef connect(host, port=5432, timeout=30, ssl=True):\n    ...\n```\n\nParameters with defaults must always come after parameters without defaults. Putting a defaulted parameter before a required one raises a `SyntaxError`.\n\n## Overriding Defaults\n\nDefaults are just starting values — callers can always override them by passing a different value, either positionally or by keyword.\n\n## Designing Good Defaults\n\nChoose defaults that represent the most common use case. A database connection function might default to port 5432 (PostgreSQL's default), timeout 30 seconds, and SSL enabled. The caller only needs to specify what differs from the common case.\n\n## The None Pattern\n\nWhen the default should be a mutable object or when you need to distinguish between \"not provided\" and a real value, use `None` as the default and handle it inside the function body. This is the standard Python pattern for optional mutable arguments.\n\n```python\ndef process(data, options=None):\n    if options is None:\n        options = {}\n```",
      "diagram": "flowchart TD\n    A[\"def f(a, b=2, c=3)\"] --> B[\"f(10)\na=10 b=2 c=3\"]\n    A --> C[\"f(10, 20)\na=10 b=20 c=3\"]\n    A --> D[\"f(10, c=30)\na=10 b=2 c=30\"]\n    A --> E[\"f(10, 20, 30)\na=10 b=20 c=30\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Defaults fill in missing arguments — callers only specify what differs from the common case",
      "code": "# Database connection with sensible defaults\ndef connect(host, port=5432, timeout=30, ssl=True):\n    print(f\"Connecting to {host}:{port} (timeout={timeout}s, ssl={ssl})\")\n\nconnect(\"localhost\")                        # all defaults\nconnect(\"db.example.com\", port=3306)        # override port\nconnect(\"db.example.com\", 3306, 10, False)  # all positional\nconnect(\"db.example.com\", ssl=False)        # keyword override\n\n# Format a price with optional currency and decimals\ndef format_price(amount, currency=\"$\", decimals=2):\n    return f\"{currency}{amount:.{decimals}f}\"\n\nprint(format_price(9.99))           # $9.99\nprint(format_price(9.99, \"£\"))      # £9.99\nprint(format_price(9.99, \"€\", 0))   # €10\n\n# None pattern for optional mutable argument\ndef build_profile(name, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(\"user\")\n    return {\"name\": name, \"tags\": tags}\n\nprint(build_profile(\"Alice\"))          # fresh list each time\nprint(build_profile(\"Bob\", [\"admin\"])) # caller's list extended",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Design defaults around the most common use case — the caller should only need to specify what is unusual. A function called 50 times with the same port should have that port as the default, not require every caller to pass it explicitly. Good defaults reduce noise at the call site."
      },
      "keyPoints": [
        "Default values make parameters optional — Python uses the default when no argument is passed",
        "Parameters with defaults must come after parameters without defaults",
        "Callers can always override defaults with positional or keyword arguments",
        "Use None as the default for mutable objects — create the object inside the body",
        "Design defaults around the most common use case to minimise required arguments"
      ],
      "tryIt": "Write a function send_email(to, subject, body, cc=None, bcc=None, priority='normal') that prints a formatted email summary. Test it with: just the required args, with cc, with bcc and high priority, and with all arguments. Verify defaults apply correctly when omitted."
    }
  },

  {
    "id": 65,
    "moduleId": 6,
    "moduleTitle": "Functions & Scope",
    "title": "*args and **kwargs",
    "type": "lesson",
    "content": {
      "body": "Sometimes you do not know in advance how many arguments a function will receive. Python provides two special parameter syntaxes for this: `*args` for a variable number of positional arguments, and `**kwargs` for a variable number of keyword arguments.\n\n## *args — Variable Positional Arguments\n\nPrefixing a parameter with `*` collects all extra positional arguments into a tuple. The name `args` is a convention — the `*` is what matters.\n\n```python\ndef add(*args):\n    return sum(args)\n\nadd(1, 2)        # args = (1, 2)\nadd(1, 2, 3, 4)  # args = (1, 2, 3, 4)\n```\n\n## **kwargs — Variable Keyword Arguments\n\nPrefixing a parameter with `**` collects all extra keyword arguments into a dictionary. The name `kwargs` is a convention.\n\n```python\ndef display(**kwargs):\n    for key, value in kwargs.items():\n        print(f\"{key}: {value}\")\n\ndisplay(name=\"Alice\", age=30, city=\"London\")\n```\n\n## Combining All Parameter Types\n\nYou can combine regular parameters, `*args`, and `**kwargs` in one function. The order must be: regular → `*args` → keyword-only → `**kwargs`.\n\n## Unpacking with * and **\n\nThe `*` and `**` operators also work at the call site to unpack a list or dict into arguments — the reverse of collecting them.",
      "diagram": "flowchart LR\n    A[\"f(1, 2, 3, x=4, y=5)\"] --> B[\"Regular params\nmatched first\"]\n    B --> C[\"*args\ncollects remaining\npositional → tuple\"]\n    B --> D[\"**kwargs\ncollects remaining\nkeyword → dict\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "*args collects extra positional args into a tuple; **kwargs collects extra keyword args into a dict",
      "code": "# *args — variable positional arguments\ndef total(*args):\n    return sum(args)\n\nprint(total(1, 2))           # 3\nprint(total(1, 2, 3, 4, 5))  # 15\n\n# **kwargs — variable keyword arguments\ndef display(**kwargs):\n    for key, value in kwargs.items():\n        print(f\"  {key}: {value}\")\n\ndisplay(name=\"Alice\", age=30, city=\"London\")\n\n# Combining regular + *args + **kwargs\ndef log(level, *messages, sep=\" | \", **context):\n    print(f\"[{level}] {sep.join(messages)}\")\n    if context:\n        display(**context)\n\nlog(\"INFO\", \"Server started\", \"Listening on port 8080\",\n    host=\"localhost\", port=8080)\n\n# Unpacking at the call site\ndef add(a, b, c):\n    return a + b + c\n\nnums = [1, 2, 3]\nprint(add(*nums))          # unpack list → positional args\n\nconfig = {\"a\": 1, \"b\": 2, \"c\": 3}\nprint(add(**config))       # unpack dict → keyword args",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The names `args` and `kwargs` are conventions, not requirements. `*numbers` and `**options` are equally valid. What matters is the `*` and `**` prefix. Use descriptive names when the purpose is clear — `*prices`, `**settings` — and fall back to `*args`/`**kwargs` for truly generic functions."
      },
      "keyPoints": [
        "*args collects extra positional arguments into a tuple inside the function",
        "**kwargs collects extra keyword arguments into a dictionary inside the function",
        "Parameter order: regular → *args → keyword-only → **kwargs",
        "* and ** also unpack sequences and dicts at the call site",
        "args and kwargs are conventions — the * and ** are what Python actually requires"
      ],
      "tryIt": "Write a function describe_person(name, *hobbies, **details) that prints the name, lists each hobby, and prints each key-value detail. Call it with: just a name, a name and two hobbies, and a name with hobbies plus age and city as keyword arguments."
    }
  },

  {
    "id": 66,
    "moduleId": 6,
    "moduleTitle": "Functions & Scope",
    "title": "Lambda Functions",
    "type": "lesson",
    "content": {
      "body": "A lambda is a small, anonymous function defined in a single expression. It is not a replacement for `def` — it is a shorthand for simple, throwaway functions that are used once, typically as an argument to another function.\n\n## Syntax\n\n```python\nlambda parameters: expression\n```\n\nA lambda can take any number of parameters but contains exactly one expression. The expression is evaluated and returned automatically — no `return` keyword needed.\n\n## When to Use Lambda\n\nLambdas shine when you need a simple function as an argument to `sorted()`, `map()`, `filter()`, or `min()`/`max()`. Writing a full `def` for a one-liner used in a single place adds noise without adding clarity.\n\n```python\nnames = [\"Alice\", \"Bob\", \"Carol\"]\nsorted(names, key=lambda name: len(name))\n```\n\n## When Not to Use Lambda\n\nIf the function is more than one expression, needs a docstring, is used in more than one place, or has a name that would make the code clearer — use `def` instead. Assigning a lambda to a variable (e.g. f = lambda x: x * 2) is explicitly discouraged by PEP 8; write a proper def instead.\n\n## Lambda vs def\n\n| | lambda | def |\n|---|---|---|\n| Name | Anonymous | Named |\n| Body | Single expression | Multiple statements |\n| Docstring | No | Yes |\n| Reuse | Inline only | Anywhere |",
      "diagram": "flowchart LR\n    A[\"lambda x: x * 2\"] --> B[\"Takes x\"]\n    B --> C[\"Returns x * 2\"]\n    D[\"sorted(items,\nkey=lambda x: x[1])\"] --> E[\"Sort by\nsecond element\"]\n    F[\"map(lambda x: x**2,\n[1,2,3])\"] --> G[\"[1, 4, 9]\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Lambdas are inline functions — most useful as arguments to sorted(), map(), and filter()",
      "code": "# Basic lambda\ndouble = lambda x: x * 2   # PEP 8 discourages this\n# Prefer:\ndef double(x):\n    return x * 2\n\n# Lambda as key for sorted()\nnames = [\"Charlie\", \"Alice\", \"Bob\", \"Dave\"]\nby_length = sorted(names, key=lambda name: len(name))\nprint(by_length)   # ['Bob', 'Dave', 'Alice', 'Charlie']\n\n# Sort list of tuples by second element\nscores = [(\"Alice\", 92), (\"Bob\", 78), (\"Carol\", 85)]\nby_score = sorted(scores, key=lambda pair: pair[1], reverse=True)\nprint(by_score)   # [('Alice', 92), ('Carol', 85), ('Bob', 78)]\n\n# Lambda with map() — apply to every item\nnumbers = [1, 2, 3, 4, 5]\nsquares = list(map(lambda x: x ** 2, numbers))\nprint(squares)   # [1, 4, 9, 16, 25]\n\n# Lambda with filter() — keep matching items\nevens = list(filter(lambda x: x % 2 == 0, numbers))\nprint(evens)   # [2, 4]\n\n# min/max with key\nwords = [\"apple\", \"fig\", \"banana\", \"kiwi\"]\nshortest = min(words, key=lambda w: len(w))\nprint(shortest)   # fig",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use lambda only when the function is simple enough to read in one line and is used in exactly one place. If you find yourself writing `lambda x: x.get('name', '').lower().strip()`, that is complex enough to deserve a named `def`. The test: can a reader understand it instantly without stopping to parse it?"
      },
      "keyPoints": [
        "Lambda is an anonymous single-expression function — no def, no return, no docstring",
        "Use lambda as an argument to sorted(), map(), filter(), min(), max()",
        "Do not assign lambda to a variable — write a def instead (PEP 8)",
        "Lambda body is a single expression — use def for anything more complex",
        "The key= parameter in sorted() is the most common real-world use of lambda"
      ],
      "tryIt": "Given a list of dictionaries representing products with 'name' and 'price' keys, use sorted() with a lambda to sort by price ascending, then by name alphabetically. Then use filter() with a lambda to keep only products under $50. Print both results."
    }
  },

  {
    "id": 73,
    "moduleId": 7,
    "moduleTitle": "Lists & Tuples",
    "title": "Sorting and Searching",
    "type": "lesson",
    "content": {
      "body": "Sorting and searching are two of the most common operations on lists. Python's built-in tools handle both efficiently and with minimal code.\n\n## Sorting with a Key\n\nBoth sort() and sorted() accept a key argument — a function applied to each item before comparison. The item itself is not changed, only the comparison uses the key's result.\n\n```python\nnames = [\"Charlie\", \"Alice\", \"Bob\"]\nnames.sort(key=len)          # sort by length\nnames.sort(key=str.lower)    # case-insensitive\n```\n\nFor complex objects like dictionaries, use a lambda as the key.\n\n## Reverse Sorting\n\nPass reverse=True to sort in descending order. Works with both sort() and sorted().\n\n## Searching\n\nThe in operator performs a linear search — simple and readable for small lists. index(value) returns the position of the first match but raises ValueError if not found.\n\n## Searching in Lists of Dicts\n\nUse next() with a generator expression for a clean one-line search that returns None when nothing matches:\n\n```python\nuser = next((u for u in users if u[\"id\"] == target_id), None)\n```",
      "diagram": "flowchart TD\n    A[\"Sort / Search\"] --> B[\"sort(key=, reverse=)\nin place\"]\n    A --> C[\"sorted(key=, reverse=)\nnew list\"]\n    A --> D[\"in operator\nlinear search\"]\n    A --> E[\"index(value)\nfirst position\"]\n    A --> F[\"min() max(key=)\nextreme items\"]\n    A --> G[\"next() + generator\nsearch dicts\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "sorted() with key= handles almost any sorting need — next() + generator for dict searches",
      "code": "# Sort by key\nnames = [\"Charlie\", \"Alice\", \"Bob\", \"Dave\"]\nprint(sorted(names))                    # alphabetical\nprint(sorted(names, key=len))           # by length\nprint(sorted(names, key=str.lower))     # case-insensitive\nprint(sorted(names, reverse=True))      # reverse alpha\n\n# Sort list of dicts\nstudents = [\n    {\"name\": \"Alice\", \"score\": 92},\n    {\"name\": \"Bob\",   \"score\": 78},\n    {\"name\": \"Carol\", \"score\": 85},\n]\nby_score = sorted(students, key=lambda s: s[\"score\"], reverse=True)\nfor s in by_score:\n    print(f\"{s['name']}: {s['score']}\")\n\n# min and max with key\nlongest = max(names, key=len)\ntop = max(students, key=lambda s: s[\"score\"])\nprint(f\"Longest: {longest}, Top: {top['name']}\")\n\n# Search with next() — None if not found\nfound = next((s for s in students if s[\"name\"] == \"Bob\"), None)\nprint(found if found else \"Not found\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use next((item for item in collection if condition), None) as your go-to pattern for searching a list of dicts. It returns the first match or None if nothing matches — no IndexError, no try/except needed. It is readable, efficient, and handles the empty case gracefully."
      },
      "keyPoints": [
        "sort(key=fn) and sorted(key=fn) sort by a derived value — items themselves are unchanged",
        "reverse=True sorts descending for both sort() and sorted()",
        "Use lambda as the key for sorting dicts or complex objects",
        "min() and max() also accept key= — use them to find extreme items in any collection",
        "next((x for x in items if condition), None) is the clean pattern for searching lists of dicts"
      ],
      "tryIt": "Given a list of product dicts with name, price, and stock keys: sort by price ascending, sort by name case-insensitively, find the most expensive product using max(), find the first out-of-stock product using next(), and print 'All in stock' if none are found."
    }
  },

  {
    "id": 72,
    "moduleId": 7,
    "moduleTitle": "Lists & Tuples",
    "title": "List Methods",
    "type": "lesson",
    "content": {
      "body": "Python lists come with a set of built-in methods that cover the most common operations. Knowing these methods means you rarely need to write manual loops for basic list tasks.\n\n## Essential Methods\n\n**count(value)** — returns how many times a value appears in the list.\n\n**index(value)** — returns the index of the first occurrence. Raises ValueError if not found — use in to check first.\n\n**copy()** — returns a shallow copy. Important when you need to modify a list without affecting the original.\n\n**reverse()** — reverses the list in place. Returns None — it modifies the original, it does not return a new list.\n\n**sort()** — sorts the list in place. Returns None. Accepts key and reverse arguments.\n\n## In-Place vs Returning New\n\nA critical distinction: sort() and reverse() modify the list in place and return None. sorted() and reversed() are built-in functions that return a new object without modifying the original.\n\n```python\nnums = [3, 1, 2]\nnums.sort()          # modifies nums, returns None\nnew = sorted(nums)   # returns new list, nums unchanged\n```\n\n## Useful Built-in Functions for Lists\n\nlen(), sum(), min(), max(), sorted(), reversed(), enumerate(), zip() all work directly on lists.",
      "diagram": "flowchart TD\n    A[\"List Methods\"] --> B[\"count(v)\nhow many times\"]\n    A --> C[\"index(v)\nfirst position\"]\n    A --> D[\"copy()\nshallow copy\"]\n    A --> E[\"reverse()\nin place — None\"]\n    A --> F[\"sort()\nin place — None\"]\n    G[\"Built-in functions\"] --> H[\"sorted()\nnew list\"]\n    G --> I[\"sum / min / max\naggregate\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "sort() and reverse() modify in place and return None — sorted() returns a new list",
      "code": "numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5]\n\n# count and index\nprint(numbers.count(1))    # 2\nprint(numbers.index(4))    # 2\nif 99 in numbers:\n    print(numbers.index(99))\n\n# copy — safe modification\noriginal = [1, 2, 3]\ncopy = original.copy()\ncopy.append(4)\nprint(original)   # [1, 2, 3] — unchanged\nprint(copy)       # [1, 2, 3, 4]\n\n# reverse — in place, returns None\nitems = [\"a\", \"b\", \"c\"]\nitems.reverse()\nprint(items)   # ['c', 'b', 'a']\n\n# sort vs sorted\nnums = [3, 1, 4, 1, 5]\nnew_sorted = sorted(nums)   # new list\nprint(nums)         # [3, 1, 4, 1, 5] — unchanged\nprint(new_sorted)   # [1, 1, 3, 4, 5]\nnums.sort()\nprint(nums)         # [1, 1, 3, 4, 5]\n\n# Built-in aggregates\nscores = [85, 92, 78, 95, 61]\nprint(sum(scores))                    # 511\nprint(min(scores), max(scores))       # 61 95\nprint(sum(scores) / len(scores))      # 82.2",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "sort() returns None, not the sorted list. Writing sorted_list = my_list.sort() gives you None. If you need the sorted version as a new list, use sorted(my_list). If you want to sort in place and do not need the return value, use my_list.sort()."
      },
      "keyPoints": [
        "count() counts occurrences; index() finds the first position — check with in first",
        "copy() returns a shallow copy — use it when modifying without affecting the original",
        "sort() and reverse() modify in place and return None",
        "sorted() and reversed() return new objects without modifying the original",
        "sum(), min(), max(), len() work directly on lists as built-in functions"
      ],
      "tryIt": "Given a list of exam scores, use list methods and built-in functions to: count how many students scored exactly 75, find the index of the highest score, calculate the average, print scores sorted descending, and confirm the original list was not modified by sorted()."
    }
  },

  // =========================
  // NEW: Missing Topics — Modules 11-14
  // =========================

  // =========================
  // NEW: Missing Topics — Modules 15-19
  // =========================

  {
    "id": 1001,
    "moduleId": 8,
    "moduleTitle": "Dictionaries & Sets",
    "title": "What Is a Dictionary?",
    "type": "lesson",
    "content": {
      "body": "A dictionary is Python's key-value store. Instead of accessing data by position like a list, you access it by a meaningful key — a name, an ID, a string. This makes dictionaries the natural structure for representing real-world objects, configuration, and any data where you look things up by name rather than by index.\n\n## Structure\n\nA dictionary maps keys to values. Each key must be unique and immutable (strings, numbers, and tuples are valid keys; lists are not). Values can be anything — strings, numbers, lists, other dicts, functions.\n\n```python\nuser = {\n    \"name\": \"Alice\",\n    \"age\": 30,\n    \"city\": \"London\"\n}\n```\n\n## Why Dictionaries Matter\n\nDictionaries are everywhere in Python. JSON data from APIs arrives as dicts. Function keyword arguments are stored as dicts. Object attributes are stored in a dict. Configuration files parse to dicts. Understanding dicts deeply is one of the highest-leverage skills in Python.\n\n## Keys Must Be Hashable\n\nOnly immutable, hashable objects can be dictionary keys. Strings and numbers are the most common. Tuples work if all their elements are hashable. Lists and dicts cannot be keys — they are mutable and therefore not hashable.\n\n## Dictionaries Are Ordered\n\nSince Python 3.7, dictionaries maintain insertion order. When you iterate over a dict, items come back in the order they were added.",
      "diagram": "flowchart LR\n    A[\"Dictionary\"] --> B[\"'name' → 'Alice'\"]\n    A --> C[\"'age' → 30\"]\n    A --> D[\"'city' → 'London'\"]\n    B --> E[\"Access by key\nuser['name']\"]\n    C --> E\n    D --> E\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Dictionaries map unique keys to values — access by key, not by position",
      "code": "# Creating a dictionary\nuser = {\n    \"name\": \"Alice\",\n    \"age\": 30,\n    \"city\": \"London\",\n    \"active\": True,\n}\n\n# Accessing values by key\nprint(user[\"name\"])    # Alice\nprint(user[\"age\"])     # 30\n\n# Keys can be any hashable type\nscores = {1: \"one\", 2: \"two\", 3: \"three\"}\ncoords = {(0, 0): \"origin\", (1, 0): \"right\"}\n\n# Check membership — checks keys\nprint(\"name\" in user)     # True\nprint(\"email\" in user)    # False\nprint(\"Alice\" in user)    # False — checks keys, not values\n\n# Length\nprint(len(user))   # 4\n\n# Nested dictionaries\ncompany = {\n    \"name\": \"Acme\",\n    \"address\": {\n        \"street\": \"123 Main St\",\n        \"city\": \"London\",\n    },\n    \"employees\": [\"Alice\", \"Bob\"],\n}\nprint(company[\"address\"][\"city\"])   # London",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "`'name' in user` checks whether 'name' is a key — not whether 'Alice' is a value. To check values, use `'Alice' in user.values()`. This distinction matters and catches many beginners off guard."
      },
      "keyPoints": [
        "Dictionaries map unique, hashable keys to values of any type",
        "Access values by key: dict['key'] — raises KeyError if key does not exist",
        "Keys must be immutable — strings, numbers, and tuples are valid; lists are not",
        "in checks keys by default — use .values() to check values",
        "Since Python 3.7, dicts maintain insertion order"
      ],
      "tryIt": "Create a dictionary representing a book with keys: title, author, year, pages, and available (bool). Print each value by key. Check whether 'isbn' is a key. Add a nested 'ratings' dict with keys 'average' and 'count'. Access the average rating."
    }
  },

  {
    "id": 1002,
    "moduleId": 8,
    "moduleTitle": "Dictionaries & Sets",
    "title": "Creating and Accessing Dictionaries",
    "type": "lesson",
    "content": {
      "body": "There are several ways to create dictionaries in Python, and multiple ways to access their values safely. Knowing all of them lets you choose the most readable approach for each situation.\n\n## Creation Methods\n\n**Literal syntax** — the most common, using curly braces with key: value pairs.\n\n**dict() constructor** — useful when keys are valid Python identifiers:\n```python\nuser = dict(name=\"Alice\", age=30)\n```\n\n**dict.fromkeys()** — creates a dict from a list of keys, all with the same default value:\n```python\ndefaults = dict.fromkeys([\"x\", \"y\", \"z\"], 0)\n```\n\n**Dict comprehension** — builds a dict from an iterable in one line:\n```python\nsquares = {n: n**2 for n in range(1, 6)}\n```\n\n## Accessing Values\n\n**Square bracket access** — `dict[\"key\"]` — raises `KeyError` if the key does not exist.\n\n**`.get(key, default)`** — returns the value or a default if the key is missing. Never raises `KeyError`. This is the safe access pattern and should be your default choice.\n\n```python\nage = user.get(\"age\", 0)       # 0 if \"age\" not in user\nemail = user.get(\"email\")      # None if not found\n```\n\n## Nested Access\n\nFor nested dicts, chain the keys. Use `.get()` at each level to avoid `KeyError` on missing intermediate keys.",
      "diagram": "flowchart TD\n    A[\"Create dict\"] --> B[\"Literal {}\nmost common\"]\n    A --> C[\"dict(k=v)\nidentifier keys\"]\n    A --> D[\"fromkeys()\nsame default value\"]\n    A --> E[\"{k:v for k,v}\ncomprehension\"]\n    F[\"Access value\"] --> G[\"dict['key']\nKeyError if missing\"]\n    F --> H[\".get(key, default)\nsafe — never raises\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Use .get() for safe access — it returns a default instead of raising KeyError",
      "code": "# Literal syntax\nuser = {\"name\": \"Alice\", \"age\": 30}\n\n# dict() constructor — keyword arguments\nconfig = dict(host=\"localhost\", port=5432, ssl=True)\n\n# fromkeys — same default for all keys\ncounters = dict.fromkeys([\"a\", \"b\", \"c\"], 0)\nprint(counters)   # {'a': 0, 'b': 0, 'c': 0}\n\n# Dict comprehension\nsquares = {n: n**2 for n in range(1, 6)}\nprint(squares)   # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}\n\n# Filter in comprehension\nscores = {\"Alice\": 92, \"Bob\": 45, \"Carol\": 78}\npassing = {name: s for name, s in scores.items() if s >= 50}\nprint(passing)   # {'Alice': 92, 'Carol': 78}\n\n# Square bracket — raises KeyError\nprint(user[\"name\"])    # Alice\n# print(user[\"email\"]) # KeyError!\n\n# .get() — safe access\nprint(user.get(\"name\"))          # Alice\nprint(user.get(\"email\"))         # None\nprint(user.get(\"email\", \"N/A\"))  # N/A\n\n# Nested access\nprofile = {\"user\": {\"name\": \"Alice\", \"scores\": [92, 85]}}\nprint(profile[\"user\"][\"name\"])              # Alice\nprint(profile.get(\"user\", {}).get(\"age\"))   # None — safe",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Make `.get()` your default way to access dictionary values. `dict['key']` is fine when you are certain the key exists, but `.get(key, default)` is safer and more explicit about what happens when it does not. In production code, unexpected KeyErrors are a common source of crashes."
      },
      "keyPoints": [
        "Four ways to create dicts: literal {}, dict(), fromkeys(), comprehension",
        "Dict comprehensions: {k: v for k, v in iterable if condition}",
        "Square bracket access raises KeyError for missing keys",
        ".get(key, default) returns default instead of raising — use it for safe access",
        "Chain .get() calls for safe nested access: d.get('a', {}).get('b')"
      ],
      "tryIt": "Build a word frequency counter using a dict comprehension: given a sentence, create a dict mapping each unique word to how many times it appears. Then use .get() to safely look up the count of any word, returning 0 if it is not in the dict."
    }
  },

  {
    "id": 1003,
    "moduleId": 8,
    "moduleTitle": "Dictionaries & Sets",
    "title": "Modifying Dictionaries",
    "type": "lesson",
    "content": {
      "body": "Dictionaries are mutable — you can add, update, and remove key-value pairs after creation. Python provides several methods for each operation, with different behaviours for missing keys.\n\n## Adding and Updating\n\nAssign directly to a key. If the key exists, the value is updated. If it does not exist, a new key-value pair is added. There is no separate \"add\" method — assignment handles both.\n\n```python\nuser[\"email\"] = \"alice@example.com\"   # add new key\nuser[\"age\"] = 31                       # update existing key\n```\n\n## update()\n\n`update()` merges another dict (or iterable of key-value pairs) into the current dict. Existing keys are overwritten, new keys are added.\n\n## setdefault()\n\n`setdefault(key, default)` returns the value if the key exists, or inserts the key with the default value and returns it. This is the clean pattern for initialising missing keys without overwriting existing ones.\n\n```python\ncounts.setdefault(\"apple\", 0)\ncounts[\"apple\"] += 1\n```\n\n## Removing Items\n\n**`pop(key, default)`** — removes and returns the value. If the key is missing and no default is given, raises `KeyError`.\n\n**`del dict[key]`** — removes the key. Raises `KeyError` if missing.\n\n**`popitem()`** — removes and returns the last inserted key-value pair as a tuple.\n\n**`clear()`** — removes all items.",
      "diagram": "flowchart TD\n    A[\"Modify Dict\"] --> B[\"dict[k] = v\nadd or update\"]\n    A --> C[\"update(other)\nmerge dicts\"]\n    A --> D[\"setdefault(k, v)\nadd only if missing\"]\n    A --> E[\"pop(k, default)\nremove + return\"]\n    A --> F[\"del dict[k]\nremove no return\"]\n    A --> G[\"clear()\nremove all\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Assignment adds or updates; pop/del remove; setdefault initialises without overwriting",
      "code": "user = {\"name\": \"Alice\", \"age\": 30}\n\n# Add new key\nuser[\"email\"] = \"alice@example.com\"\nprint(user)\n\n# Update existing key\nuser[\"age\"] = 31\nprint(user[\"age\"])   # 31\n\n# update() — merge another dict\nextras = {\"city\": \"London\", \"age\": 32}\nuser.update(extras)\nprint(user[\"age\"])   # 32 — overwritten\nprint(user[\"city\"])  # London — added\n\n# setdefault — add only if missing\nuser.setdefault(\"role\", \"user\")    # adds role=user\nuser.setdefault(\"name\", \"Bob\")     # name already exists — unchanged\nprint(user[\"name\"])   # Alice\nprint(user[\"role\"])   # user\n\n# Counting pattern with setdefault\nwords = [\"apple\", \"banana\", \"apple\", \"cherry\", \"banana\", \"apple\"]\ncounts = {}\nfor word in words:\n    counts.setdefault(word, 0)\n    counts[word] += 1\nprint(counts)   # {'apple': 3, 'banana': 2, 'cherry': 1}\n\n# pop — remove and return\nage = user.pop(\"age\")\nprint(age)   # 32\nmissing = user.pop(\"phone\", \"N/A\")   # safe with default\nprint(missing)   # N/A\n\n# del\ndel user[\"city\"]\n\n# popitem — last inserted pair\nlast = user.popitem()\nprint(last)   # ('role', 'user')",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use `setdefault()` for the counting and grouping pattern. `counts.setdefault(word, 0); counts[word] += 1` is clean and explicit. Alternatively, use `collections.Counter` for counting or `collections.defaultdict` for automatic default values — both are covered in later modules."
      },
      "keyPoints": [
        "dict[key] = value adds a new key or updates an existing one — same syntax for both",
        "update() merges another dict — existing keys are overwritten",
        "setdefault(key, default) inserts only if the key is missing — never overwrites",
        "pop(key, default) removes and returns — use a default to avoid KeyError",
        "del dict[key] removes without returning — raises KeyError if missing"
      ],
      "tryIt": "Build a contact book. Start with an empty dict. Add five contacts using direct assignment. Update one contact's phone number. Use setdefault() to add an 'email' field only to contacts that do not have one. Remove one contact with pop() and print the removed value. Print the final contact book."
    }
  },

  {
    "id": 1004,
    "moduleId": 8,
    "moduleTitle": "Dictionaries & Sets",
    "title": "Dictionary Methods",
    "type": "lesson",
    "content": {
      "body": "Dictionaries have a rich set of methods for accessing, iterating, and transforming their contents. Knowing these methods means you rarely need to write manual loops for common dict operations.\n\n## The Three View Methods\n\n**`.keys()`** — returns a view of all keys. Updates automatically when the dict changes.\n\n**`.values()`** — returns a view of all values.\n\n**`.items()`** — returns a view of all key-value pairs as tuples. This is the most commonly used — it is the standard way to iterate over both keys and values simultaneously.\n\nViews are not lists — they are live windows into the dict. Convert with `list()` if you need a snapshot.\n\n## Copying\n\n**`.copy()`** — returns a shallow copy. Like lists, assignment creates an alias not a copy.\n\n## Merging (Python 3.9+)\n\nThe `|` operator merges two dicts into a new one. `|=` merges in place. These are cleaner than `update()` for one-liners.\n\n```python\nmerged = defaults | overrides\n```\n\n## Checking and Iterating\n\nUse `in` to check keys. Use `.get()` for safe value access. Iterate with `.items()` for both key and value in the loop body.",
      "diagram": "flowchart TD\n    A[\"Dict Methods\"] --> B[\".keys()\nview of all keys\"]\n    A --> C[\".values()\nview of all values\"]\n    A --> D[\".items()\nview of (key,value) pairs\"]\n    A --> E[\".copy()\nshallow copy\"]\n    A --> F[\"| merge operator\nPython 3.9+\"]\n    D --> G[\"for k, v in d.items()\nmost common loop\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": ".items() is the workhorse — use it whenever you need both key and value in a loop",
      "code": "scores = {\"Alice\": 92, \"Bob\": 78, \"Carol\": 85}\n\n# keys, values, items\nprint(list(scores.keys()))    # ['Alice', 'Bob', 'Carol']\nprint(list(scores.values()))  # [92, 78, 85]\nprint(list(scores.items()))   # [('Alice', 92), ('Bob', 78), ('Carol', 85)]\n\n# Iterate with items() — most common pattern\nfor name, score in scores.items():\n    grade = \"Pass\" if score >= 50 else \"Fail\"\n    print(f\"{name}: {score} — {grade}\")\n\n# Views update live\nscores[\"Dave\"] = 70\nprint(list(scores.keys()))   # Dave is now included\n\n# copy — independent dict\noriginal = {\"a\": 1, \"b\": 2}\ncopy = original.copy()\ncopy[\"c\"] = 3\nprint(original)   # {\"a\": 1, \"b\": 2} — unchanged\n\n# Merge with | (Python 3.9+)\ndefaults = {\"timeout\": 30, \"retries\": 3, \"ssl\": True}\noverrides = {\"timeout\": 10, \"ssl\": False}\nconfig = defaults | overrides\nprint(config)   # timeout=10, retries=3, ssl=False\n\n# In-place merge with |=\ndefaults |= {\"debug\": True}\nprint(defaults)\n\n# Sum all values\ntotal = sum(scores.values())\navg = total / len(scores)\nprint(f\"Average: {avg:.1f}\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Always use `.items()` when you need both key and value in a loop — `for name, score in scores.items()` is cleaner and more readable than `for name in scores: score = scores[name]`. The unpacking syntax makes the loop body read naturally."
      },
      "keyPoints": [
        ".keys(), .values(), .items() return live views — convert to list() for a snapshot",
        ".items() is the standard way to iterate over both keys and values",
        ".copy() creates a shallow copy — assignment creates an alias",
        "The | operator merges dicts into a new dict (Python 3.9+)",
        "sum(d.values()), min(d.values()), max(d.values()) work directly on value views"
      ],
      "tryIt": "Given a dict of student names and scores, use .items() to print each student's name, score, and grade. Use .values() to calculate the class average. Use .keys() to check whether a specific student is enrolled. Use | to merge two config dicts where the second overrides the first."
    }
  },

  {
    "id": 1005,
    "moduleId": 8,
    "moduleTitle": "Dictionaries & Sets",
    "title": "Looping Through Dictionaries",
    "type": "lesson",
    "content": {
      "body": "Looping over dictionaries is one of the most common operations in Python. The right loop pattern depends on whether you need keys, values, or both — and whether you need to transform or filter the data.\n\n## The Three Loop Patterns\n\n```python\nfor key in d:                    # keys only\nfor value in d.values():         # values only\nfor key, value in d.items():     # both — most common\n```\n\n## Dict Comprehensions\n\nJust as list comprehensions build lists, dict comprehensions build dicts. The syntax mirrors list comprehensions but uses `{key: value ...}` instead of `[value ...]`.\n\n```python\n{k: v * 2 for k, v in d.items()}          # transform values\n{k: v for k, v in d.items() if v > 50}    # filter\n```\n\n## Grouping with Dicts\n\nA powerful pattern: use a dict to group items from a list by a shared property. Build the dict by iterating the list and appending to lists stored as values.\n\n## Inverting a Dict\n\nSwap keys and values with a comprehension: `{v: k for k, v in d.items()}`. Only works cleanly when values are unique.\n\n## Nested Dict Iteration\n\nFor dicts of dicts, nest the loops or use comprehensions at each level.",
      "diagram": "flowchart TD\n    A[\"Loop patterns\"] --> B[\"for k in d\nkeys only\"]\n    A --> C[\"for v in d.values()\nvalues only\"]\n    A --> D[\"for k,v in d.items()\nboth — standard\"]\n    E[\"Dict comprehension\"] --> F[\"{k: expr for k,v in d.items()}\"]\n    F --> G[\"Transform values\"]\n    F --> H[\"Filter entries\"]\n    F --> I[\"Invert keys/values\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "items() is the standard loop — dict comprehensions transform and filter in one line",
      "code": "scores = {\"Alice\": 92, \"Bob\": 45, \"Carol\": 78, \"Dave\": 61}\n\n# Keys only\nfor name in scores:\n    print(name)\n\n# Values only\ntotal = 0\nfor score in scores.values():\n    total += score\n\n# Both — standard pattern\nfor name, score in scores.items():\n    print(f\"{name}: {score}\")\n\n# Dict comprehension — transform\ndoubled = {name: score * 2 for name, score in scores.items()}\n\n# Dict comprehension — filter\npassing = {name: score for name, score in scores.items() if score >= 50}\nprint(passing)   # {'Alice': 92, 'Carol': 78, 'Dave': 61}\n\n# Grouping pattern\nstudents = [\n    {\"name\": \"Alice\", \"grade\": \"A\"},\n    {\"name\": \"Bob\",   \"grade\": \"B\"},\n    {\"name\": \"Carol\", \"grade\": \"A\"},\n    {\"name\": \"Dave\",  \"grade\": \"B\"},\n]\nby_grade = {}\nfor s in students:\n    by_grade.setdefault(s[\"grade\"], []).append(s[\"name\"])\nprint(by_grade)   # {'A': ['Alice', 'Carol'], 'B': ['Bob', 'Dave']}\n\n# Invert a dict\ncode_to_name = {1: \"Alice\", 2: \"Bob\", 3: \"Carol\"}\nname_to_code = {v: k for k, v in code_to_name.items()}\nprint(name_to_code)   # {'Alice': 1, 'Bob': 2, 'Carol': 3}",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "The grouping pattern — `d.setdefault(key, []).append(value)` — is one of the most useful dict idioms. It groups items from a list into a dict of lists without needing to check whether the key exists first. `collections.defaultdict(list)` is the cleaner alternative covered in later modules."
      },
      "keyPoints": [
        "Three loop patterns: keys only, values only, items() for both",
        "Dict comprehensions: {k: v for k, v in d.items() if condition}",
        "Grouping: setdefault(key, []).append(value) groups items into lists by key",
        "Invert a dict: {v: k for k, v in d.items()} — only safe when values are unique",
        "Nested dicts require nested loops or nested comprehensions"
      ],
      "tryIt": "Given a list of transactions each with 'category' and 'amount' keys, use the grouping pattern to build a dict mapping each category to a list of amounts. Then use a dict comprehension to build a summary dict mapping each category to its total amount."
    }
  },

  {
    "id": 1006,
    "moduleId": 8,
    "moduleTitle": "Dictionaries & Sets",
    "title": "What Is a Set?",
    "type": "lesson",
    "content": {
      "body": "A set is an unordered collection of unique items. It automatically removes duplicates and supports fast membership testing. Sets are the right tool when you care about whether something is present — not where it is or how many times it appears.\n\n## Creating Sets\n\n```python\nfruits = {\"apple\", \"banana\", \"cherry\"}\nempty = set()   # not {} — that creates an empty dict!\nfrom_list = set([1, 2, 2, 3, 3, 3])   # {1, 2, 3}\n```\n\n## Key Properties\n\n**Unordered** — sets have no index. You cannot access items by position.\n\n**Unique** — duplicates are silently removed on creation and when adding.\n\n**Mutable** — you can add and remove items. Frozensets are the immutable variant.\n\n**Hashable elements only** — like dict keys, set elements must be immutable. Strings, numbers, and tuples work. Lists do not.\n\n## Set Operations\n\nSets support the mathematical set operations — union, intersection, difference, and symmetric difference. These are the primary reason to use sets over lists.\n\n## When to Use a Set\n\n- Removing duplicates from a list\n- Fast membership testing (O(1) vs O(n) for lists)\n- Finding common or unique elements between two collections\n- Tracking which items have been seen or processed",
      "diagram": "flowchart TD\n    A[\"Set\"] --> B[\"Unique items\nno duplicates\"]\n    A --> C[\"Unordered\nno index\"]\n    A --> D[\"Fast membership\nO(1) lookup\"]\n    A --> E[\"Set operations\nunion intersection difference\"]\n    B --> F[\"set([1,2,2,3]) → {1,2,3}\"]\n    D --> G[\"'apple' in fruits\ninstant\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Sets guarantee uniqueness and provide O(1) membership testing — ideal for deduplication and lookups",
      "code": "# Creating sets\nfruits = {\"apple\", \"banana\", \"cherry\"}\nnumbers = set([1, 2, 2, 3, 3, 3])\nprint(numbers)   # {1, 2, 3} — duplicates removed\n\nempty = set()    # NOT {} — that's an empty dict\nprint(type(empty))   # <class 'set'>\n\n# Membership — O(1), much faster than list for large data\nprint(\"apple\" in fruits)    # True\nprint(\"grape\" in fruits)    # False\n\n# Add and remove\nfruits.add(\"date\")\nfruits.add(\"apple\")   # already exists — no change\nfruits.discard(\"banana\")   # safe — no error if missing\n# fruits.remove(\"banana\")  # raises KeyError if missing\n\n# Deduplication — most common use\nnames = [\"Alice\", \"Bob\", \"Alice\", \"Carol\", \"Bob\", \"Alice\"]\nunique = list(set(names))\nprint(unique)   # ['Carol', 'Bob', 'Alice'] — order not guaranteed\n\n# Fast lookup vs list\nimport time\nbig_list = list(range(1000000))\nbig_set = set(big_list)\n# 999999 in big_list  — scans up to 1M items\n# 999999 in big_set   — instant hash lookup",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "`{}` creates an empty dict, not an empty set. Always use `set()` for an empty set. This is one of the most common Python gotchas — `type({})` is `dict`, not `set`. Also note that sets are unordered — `list(set(items))` removes duplicates but does not preserve the original order."
      },
      "keyPoints": [
        "Sets are unordered collections of unique, hashable items",
        "Use set() not {} to create an empty set — {} creates an empty dict",
        "Duplicates are silently removed — set([1,2,2,3]) gives {1,2,3}",
        "Membership testing is O(1) — much faster than list for large collections",
        "Use discard() to remove safely — remove() raises KeyError if missing"
      ],
      "tryIt": "Given a list of 20 numbers with many duplicates, use a set to find how many unique values there are. Then given two lists of names (attendees from two events), use set operations to find: who attended both, who attended only the first, and who attended either event."
    }
  },

  {
    "id": 1007,
    "moduleId": 8,
    "moduleTitle": "Dictionaries & Sets",
    "title": "Set Operations",
    "type": "lesson",
    "content": {
      "body": "Sets support the four classical mathematical set operations — union, intersection, difference, and symmetric difference. These let you compare and combine collections in ways that would require complex loops if done manually.\n\n## The Four Operations\n\n**Union (`|` or `.union()`)** — all items from both sets, duplicates removed.\n`{1,2,3} | {2,3,4}` → `{1,2,3,4}`\n\n**Intersection (`&` or `.intersection()`)** — only items present in both sets.\n`{1,2,3} & {2,3,4}` → `{2,3}`\n\n**Difference (`-` or `.difference()`)** — items in the left set but not the right.\n`{1,2,3} - {2,3,4}` → `{1}`\n\n**Symmetric Difference (`^` or `.symmetric_difference()`)** — items in either set but not both.\n`{1,2,3} ^ {2,3,4}` → `{1,4}`\n\n## Subset and Superset\n\n`a.issubset(b)` — True if every element of a is in b.\n`a.issuperset(b)` — True if a contains every element of b.\n`a.isdisjoint(b)` — True if a and b share no elements.\n\n## In-Place Versions\n\nAll operations have in-place equivalents: `|=`, `&=`, `-=`, `^=`. These modify the set directly instead of returning a new one.",
      "diagram": "flowchart LR\n    A[\"A = {1,2,3}\"] --> E[\"Operations\"]\n    B[\"B = {2,3,4}\"] --> E\n    E --> C[\"A | B = {1,2,3,4}\nUnion\"]\n    E --> D[\"A & B = {2,3}\nIntersection\"]\n    E --> F[\"A - B = {1}\nDifference\"]\n    E --> G[\"A ^ B = {1,4}\nSymmetric diff\"]\n    style E fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style G fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Four set operations cover all comparison needs — use operators or method names",
      "code": "a = {1, 2, 3, 4, 5}\nb = {3, 4, 5, 6, 7}\n\n# Union — all items from both\nprint(a | b)          # {1, 2, 3, 4, 5, 6, 7}\nprint(a.union(b))     # same\n\n# Intersection — items in both\nprint(a & b)          # {3, 4, 5}\nprint(a.intersection(b))\n\n# Difference — in a but not b\nprint(a - b)          # {1, 2}\nprint(b - a)          # {6, 7}\n\n# Symmetric difference — in either but not both\nprint(a ^ b)          # {1, 2, 6, 7}\n\n# Subset / superset\nsmall = {3, 4}\nprint(small.issubset(a))     # True\nprint(a.issuperset(small))   # True\nprint(a.isdisjoint({8, 9}))  # True — no overlap\n\n# Real-world: find common and unique users\njan_users = {\"alice\", \"bob\", \"carol\", \"dave\"}\nfeb_users = {\"bob\", \"carol\", \"eve\", \"frank\"}\n\nboth_months = jan_users & feb_users\nprint(f\"Retained: {both_months}\")\n\nnew_in_feb = feb_users - jan_users\nprint(f\"New users: {new_in_feb}\")\n\nchurned = jan_users - feb_users\nprint(f\"Churned: {churned}\")\n\nall_users = jan_users | feb_users\nprint(f\"Total unique: {len(all_users)}\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Set operations are the clean alternative to nested loops for comparing collections. Finding common elements between two lists with a loop is O(n*m). Converting to sets and using `&` is O(n+m). For large collections the performance difference is significant — and the code is far more readable."
      },
      "keyPoints": [
        "Union (|) combines both sets; intersection (&) keeps only shared items",
        "Difference (-) keeps items in left but not right; order matters",
        "Symmetric difference (^) keeps items in either but not both",
        "issubset(), issuperset(), isdisjoint() test relationships between sets",
        "Set operations replace nested loops for comparing collections — cleaner and faster"
      ],
      "tryIt": "Given two lists of tags from two blog posts, convert them to sets and find: tags shared by both posts, tags unique to each post, and all tags across both posts. Then check whether one post's tags are a subset of the other's. Print a summary of each result."
    }
  },

  {
    "id": 1008,
    "moduleId": 8,
    "moduleTitle": "Dictionaries & Sets",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Dict and set bugs are often silent — the code runs but produces wrong results or crashes unexpectedly. These are the patterns that trip up beginners most often.\n\n## Mistake 1 — KeyError on Missing Key\n\nAccessing `dict[\"key\"]` when the key does not exist raises `KeyError`. Always use `.get()` when the key might be absent, or check with `in` first.\n\n## Mistake 2 — Iterating While Modifying\n\nAdding or removing keys from a dict while iterating over it raises `RuntimeError: dictionary changed size during iteration`. Iterate over a copy of the keys instead.\n\n## Mistake 3 — {} Is an Empty Dict, Not a Set\n\n`{}` creates an empty dict. `set()` creates an empty set. This is a silent bug — your code runs but you have the wrong type.\n\n## Mistake 4 — Assuming Dict Order in Old Code\n\nDicts are ordered since Python 3.7. Code written for older Python that assumes arbitrary order may behave differently. Always be explicit if order matters.\n\n## Mistake 5 — Shallow Copy of Nested Dicts\n\n`.copy()` creates a shallow copy — nested dicts inside are still shared. Modifying a nested dict in the copy also modifies the original. Use `copy.deepcopy()` for fully independent copies.\n\n## Mistake 6 — Using a List as a Dict Key\n\nLists are mutable and therefore not hashable. `d[[1,2]] = \"value\"` raises `TypeError`. Use a tuple instead: `d[(1,2)] = \"value\"`.",
      "diagram": "flowchart TD\n    A[\"Dict/Set Mistakes\"] --> B[\"KeyError\nuse .get()\"]\n    A --> C[\"Modify while iterating\nRuntimeError\"]\n    A --> D[\"{} is dict\nnot set\"]\n    A --> E[\"Shallow copy\nnested still shared\"]\n    A --> F[\"List as key\nTypeError\"]\n    B --> G[\"Silent crash\"]\n    C --> G\n    D --> H[\"Wrong type — silent\"]\n    E --> H\n    F --> G\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style H fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "KeyError and RuntimeError crash immediately — wrong type and shallow copy bugs are silent",
      "code": "# Mistake 1 — KeyError\nuser = {\"name\": \"Alice\"}\n# print(user[\"email\"])   # KeyError!\nprint(user.get(\"email\", \"N/A\"))   # safe\n\n# Mistake 2 — modify while iterating\nscores = {\"Alice\": 92, \"Bob\": 45, \"Carol\": 78}\n# for name in scores:\n#     if scores[name] < 50:\n#         del scores[name]   # RuntimeError!\n# Fix: iterate over a copy of keys\nfor name in list(scores.keys()):\n    if scores[name] < 50:\n        del scores[name]\nprint(scores)   # {'Alice': 92, 'Carol': 78}\n\n# Mistake 3 — {} is a dict\nempty = {}\nprint(type(empty))   # dict — not set!\nempty_set = set()\nprint(type(empty_set))   # set\n\n# Mistake 4 — shallow copy of nested dict\noriginal = {\"user\": {\"name\": \"Alice\", \"age\": 30}}\ncopy = original.copy()\ncopy[\"user\"][\"age\"] = 99   # modifies original too!\nprint(original[\"user\"][\"age\"])   # 99 — oops!\n\nimport copy as cp\ndeep = cp.deepcopy(original)\ndeep[\"user\"][\"age\"] = 25\nprint(original[\"user\"][\"age\"])   # 99 — unchanged now\n\n# Mistake 5 — list as dict key\n# d = {[1, 2]: \"value\"}   # TypeError: unhashable type: 'list'\nd = {(1, 2): \"value\"}     # tuple works fine\nprint(d[(1, 2)])",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never modify a dict while iterating over it. `for key in dict` and then `del dict[key]` inside the loop raises `RuntimeError`. The fix is always `for key in list(dict.keys())` — iterating over a snapshot of the keys. The same applies to sets: iterate over `list(my_set)` if you need to remove items during iteration."
      },
      "keyPoints": [
        "Use .get() instead of [] when a key might be missing — avoids KeyError",
        "Never add or remove keys while iterating — iterate over list(d.keys()) instead",
        "{} creates an empty dict — use set() for an empty set",
        ".copy() is shallow — nested dicts are still shared; use copy.deepcopy() for independence",
        "Lists cannot be dict keys — use tuples instead"
      ],
      "tryIt": "Find and fix all five bugs: (1) accessing a missing key with [], (2) deleting from a dict during iteration, (3) creating an empty set with {}, (4) modifying a nested dict in a shallow copy expecting the original to be unchanged, (5) using a list as a dict key."
    }
  },

  {
    "id": 1009,
    "moduleId": 8,
    "moduleTitle": "Dictionaries & Sets",
    "title": "Module 8 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered Python's two most powerful data structures for lookup and uniqueness — dictionaries and sets. Together with lists and tuples from Module 7, you now have the full toolkit for working with collections of data.\n\n## What You Learned\n\n**Dictionaries** map unique, hashable keys to values of any type. Access with `[]` raises `KeyError`; `.get()` is safe. Since Python 3.7, dicts maintain insertion order.\n\n**Creating dicts** — literal `{}`, `dict()`, `fromkeys()`, and dict comprehensions. Dict comprehensions filter and transform in one line.\n\n**Modifying dicts** — assignment adds or updates. `update()` merges. `setdefault()` initialises without overwriting. `pop()` removes and returns.\n\n**Dict methods** — `.keys()`, `.values()`, `.items()` return live views. `.items()` is the standard loop pattern. The `|` operator merges dicts (Python 3.9+).\n\n**Looping** — `for k, v in d.items()` is the workhorse. Dict comprehensions build transformed or filtered dicts. The grouping pattern uses `setdefault(key, []).append(value)`.\n\n**Sets** are unordered collections of unique, hashable items. `set()` not `{}` for empty. `discard()` removes safely. Membership testing is O(1).\n\n**Set operations** — union `|`, intersection `&`, difference `-`, symmetric difference `^`. Cleaner and faster than nested loops for comparing collections.\n\n## What Is Coming Next\n\nModule 9 introduces **string methods in depth** — formatting, parsing, searching, and transforming text. Strings are the most common data type in real programs and Python's string toolkit is extensive.",
      "diagram": "flowchart TD\n    A[\"✅ Dictionaries\nkey-value store\"] --> B[\"✅ Creating\n& Accessing\"]\n    B --> C[\"✅ Modifying\nupdate setdefault pop\"]\n    C --> D[\"✅ Methods\nkeys values items\"]\n    D --> E[\"✅ Looping\nitems() comprehensions\"]\n    E --> F[\"✅ Sets\nunique unordered\"]\n    F --> G[\"✅ Set Operations\n| & - ^\"]\n    G --> H[\"➡️ String Methods\nModule 9\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166634\n    style H fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 8 complete — dicts and sets are the backbone of real Python programs",
      "code": "# Everything from Module 8 in one program\ndef analyse_survey(responses):\n    \"\"\"responses: list of dicts with 'name', 'age', 'tags'\"\"\"\n    if not responses:\n        return {}\n\n    # Group by age bracket\n    brackets = {}\n    all_tags = set()\n    tag_counts = {}\n\n    for r in responses:\n        # Age grouping\n        bracket = \"18-30\" if r[\"age\"] <= 30 else \"31-50\" if r[\"age\"] <= 50 else \"50+\"\n        brackets.setdefault(bracket, []).append(r[\"name\"])\n\n        # Tag aggregation\n        tags = set(r.get(\"tags\", []))\n        all_tags |= tags\n        for tag in tags:\n            tag_counts[tag] = tag_counts.get(tag, 0) + 1\n\n    top_tags = sorted(tag_counts, key=lambda t: tag_counts[t], reverse=True)[:3]\n\n    return {\n        \"total\": len(responses),\n        \"by_bracket\": {k: len(v) for k, v in brackets.items()},\n        \"unique_tags\": len(all_tags),\n        \"top_tags\": top_tags,\n    }\n\ndata = [\n    {\"name\": \"Alice\", \"age\": 28, \"tags\": [\"python\", \"data\"]},\n    {\"name\": \"Bob\",   \"age\": 35, \"tags\": [\"python\", \"web\"]},\n    {\"name\": \"Carol\", \"age\": 22, \"tags\": [\"data\", \"ml\"]},\n    {\"name\": \"Dave\",  \"age\": 45, \"tags\": [\"web\", \"python\"]},\n]\nresult = analyse_survey(data)\nfor k, v in result.items():\n    print(f\"{k}: {v}\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Before moving on, make sure you can explain the difference between [] and .get(), between .copy() and deepcopy(), and between {} (dict) and set(). These three distinctions are tested constantly in real code reviews and interviews."
      },
      "keyPoints": [
        "Use .get() for safe dict access — [] raises KeyError for missing keys",
        "setdefault() initialises without overwriting — the grouping pattern's foundation",
        ".items() is the standard dict loop — use it whenever you need both key and value",
        "Sets guarantee uniqueness and O(1) membership — use them for deduplication and lookups",
        "Set operations (|, &, -, ^) replace nested loops for comparing collections"
      ],
      "tryIt": "From memory, write a function word_stats(text) that returns a dict with: 'unique_words' (count), 'top_5' (list of most frequent words), and 'long_words' (set of words longer than 6 characters). Use a dict for counting, a set for long words, and sorted() with a lambda for the top 5."
    }
  },

  {
    "id": 1010,
    "moduleId": 9,
    "moduleTitle": "Comprehensions & Functional Tools",
    "title": "List Comprehensions in Depth",
    "type": "lesson",
    "content": {
      "body": "You were introduced to list comprehensions in Module 7. This lesson goes deeper — covering nested comprehensions, conditional expressions, and the performance characteristics that make comprehensions the preferred Python idiom for data transformation.\n\n## Full Syntax\n\n```python\n[expression for item in iterable if condition]\n```\n\nThe `if` clause filters which items are processed. The expression transforms each item that passes the filter. Both are optional — you can have just the expression, just the filter, or both.\n\n## Conditional Expression in the Output\n\nThe `if` clause filters items. A conditional expression (ternary) in the output position transforms items differently based on a condition — every item is included, but some get one value and others get another.\n\n```python\n# Filter — only passing scores included\npassing = [s for s in scores if s >= 50]\n\n# Conditional expression — all scores included, labelled\nlabels = [\"Pass\" if s >= 50 else \"Fail\" for s in scores]\n```\n\n## Nested Comprehensions\n\nA comprehension can contain another comprehension. The most common use is flattening a nested list:\n\n```python\nflat = [item for sublist in matrix for item in sublist]\n```\n\nRead left to right: for each sublist in matrix, for each item in sublist, include item.\n\n## Performance\n\nComprehensions are faster than equivalent `for` loops with `append()` because Python optimises them internally. For very large datasets, generator expressions (next lesson) are more memory-efficient.",
      "diagram": "flowchart TD\n    A[\"[expr for x in iterable if cond]\"] --> B[\"iterable\nsource of items\"]\n    B --> C{\"if cond\nfilter\"}\n    C -->|\"True\"| D[\"expr\ntransform\"]\n    C -->|\"False\"| E[\"skip\"]\n    D --> F[\"new list\"]\n    G[\"Conditional expr\nexpr_a if cond else expr_b\"] --> H[\"all items included\ntwo possible outputs\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style H fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "if clause filters items; conditional expression in output position transforms all items",
      "code": "scores = [85, 42, 91, 38, 76, 55, 63]\n\n# Basic transformation\nsquares = [x**2 for x in range(1, 6)]\n\n# Filter only\npassing = [s for s in scores if s >= 50]\nprint(passing)   # [85, 91, 76, 55, 63]\n\n# Conditional expression — all items, two outputs\nlabels = [\"Pass\" if s >= 50 else \"Fail\" for s in scores]\nprint(labels)\n\n# Both filter and transform\nhigh_squares = [x**2 for x in range(1, 11) if x % 2 == 0]\nprint(high_squares)   # [4, 16, 36, 64, 100]\n\n# Nested — flatten matrix\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat = [n for row in matrix for n in row]\nprint(flat)   # [1, 2, 3, 4, 5, 6, 7, 8, 9]\n\n# Nested — all combinations\npairs = [(x, y) for x in [1,2,3] for y in [1,2,3] if x != y]\nprint(pairs)\n\n# From list of dicts\nstudents = [{\"name\": \"Alice\", \"score\": 92}, {\"name\": \"Bob\", \"score\": 45}]\nnames = [s[\"name\"] for s in students if s[\"score\"] >= 50]\nprint(names)   # ['Alice']",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Keep the filter (`if` clause) and the conditional expression (`x if cond else y`) separate in your mind — they do different things. The filter removes items from the output entirely. The conditional expression keeps all items but gives them different values. Mixing them up produces subtle bugs."
      },
      "keyPoints": [
        "if clause at the end filters — items that fail are excluded entirely",
        "Conditional expression in output position transforms — all items are included",
        "Nested comprehensions: [x for sub in outer for x in sub] flattens nested lists",
        "Comprehensions are faster than loop + append due to internal Python optimisation",
        "If a comprehension takes more than a glance to understand, use a loop instead"
      ],
      "tryIt": "Using only list comprehensions: (1) extract all words longer than 4 characters from a sentence, (2) build a list of (word, length) tuples for each word, (3) flatten a 3x3 matrix into a single list, (4) label each number in a list as 'even' or 'odd' using a conditional expression."
    }
  },

  {
    "id": 1011,
    "moduleId": 9,
    "moduleTitle": "Comprehensions & Functional Tools",
    "title": "Dict & Set Comprehensions",
    "type": "lesson",
    "content": {
      "body": "The comprehension syntax extends beyond lists. Dict comprehensions build dictionaries, and set comprehensions build sets — both with the same concise, readable syntax.\n\n## Dict Comprehensions\n\n```python\n{key_expr: value_expr for item in iterable if condition}\n```\n\nThe key and value expressions can be any valid Python expression. The `if` clause is optional.\n\nCommon uses:\n- Transform values while keeping keys\n- Swap keys and values\n- Filter a dict to a subset\n- Build a lookup dict from a list\n\n## Set Comprehensions\n\n```python\n{expression for item in iterable if condition}\n```\n\nIdentical to a list comprehension but with curly braces. The result is a set — duplicates are automatically removed.\n\n## Choosing the Right Comprehension\n\n| Goal | Use |\n|---|---|\n| Build a list | `[expr for x in it]` |\n| Build a dict | `{k: v for x in it}` |\n| Build a set | `{expr for x in it}` |\n| Lazy iteration | `(expr for x in it)` — generator |\n\n## Nested Dict Comprehensions\n\nYou can nest comprehensions inside dict comprehensions for transforming nested structures, but keep them readable.",
      "diagram": "flowchart LR\n    A[\"Source data\"] --> B[\"Dict comprehension\n{k: v for x in it}\"]\n    A --> C[\"Set comprehension\n{expr for x in it}\"]\n    B --> D[\"New dict\nkey-value pairs\"]\n    C --> E[\"New set\nunique values\"]\n    D --> F[\"Transform values\nFilter entries\nInvert keys/values\nBuild lookup\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Dict and set comprehensions use the same pattern as list comprehensions — just different brackets",
      "code": "scores = {\"Alice\": 92, \"Bob\": 45, \"Carol\": 78, \"Dave\": 61}\n\n# Dict comprehension — transform values\ndoubled = {name: score * 2 for name, score in scores.items()}\n\n# Dict comprehension — filter\npassing = {name: s for name, s in scores.items() if s >= 50}\nprint(passing)   # {'Alice': 92, 'Carol': 78, 'Dave': 61}\n\n# Invert keys and values\ninverted = {v: k for k, v in scores.items()}\nprint(inverted)   # {92: 'Alice', 45: 'Bob', ...}\n\n# Build lookup dict from a list\nwords = [\"apple\", \"banana\", \"cherry\"]\nlengths = {word: len(word) for word in words}\nprint(lengths)   # {'apple': 5, 'banana': 6, 'cherry': 6}\n\n# Build from two lists using zip\nkeys = [\"name\", \"age\", \"city\"]\nvalues = [\"Alice\", 30, \"London\"]\nprofile = {k: v for k, v in zip(keys, values)}\nprint(profile)\n\n# Set comprehension — unique first letters\nnames = [\"Alice\", \"Bob\", \"Anna\", \"Carol\", \"Brian\"]\nfirst_letters = {name[0] for name in names}\nprint(first_letters)   # {'A', 'B', 'C'}\n\n# Set comprehension with filter\nlong_words = {w for w in words if len(w) > 5}\nprint(long_words)   # {'banana', 'cherry'}",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "When inverting a dict with `{v: k for k, v in d.items()}`, duplicate values become a problem — only the last key for each value is kept. If your dict has duplicate values, the inversion silently loses data. Check that values are unique before inverting, or handle duplicates explicitly."
      },
      "keyPoints": [
        "Dict comprehension: {key: value for item in iterable if condition}",
        "Set comprehension: {expression for item in iterable if condition}",
        "Dict comprehensions can transform values, filter entries, invert, or build lookups",
        "Set comprehensions automatically deduplicate — useful for extracting unique values",
        "Inverting a dict loses data if values are not unique — check first"
      ],
      "tryIt": "Given a list of product dicts with name and price: (1) build a dict mapping name to price, (2) build a filtered dict of products under $50, (3) build a set of unique price points, (4) invert the name-to-price dict and handle the case where two products have the same price."
    }
  },

  {
    "id": 1012,
    "moduleId": 9,
    "moduleTitle": "Comprehensions & Functional Tools",
    "title": "Generator Expressions",
    "type": "lesson",
    "content": {
      "body": "A generator expression looks like a list comprehension but uses parentheses instead of square brackets. The critical difference: it does not build the entire result in memory. Instead it produces values one at a time, on demand. This makes generators the right choice for large datasets.\n\n## Syntax\n\n```python\n(expression for item in iterable if condition)\n```\n\nThe result is a generator object — a lazy iterator. It produces the next value only when asked.\n\n## Memory Efficiency\n\nA list comprehension over one million items creates a list of one million items in memory immediately. A generator expression over the same data uses almost no memory — it computes each value only when the consumer requests it.\n\n```python\n# List — all 1M values in memory at once\ntotal = sum([x**2 for x in range(1_000_000)])\n\n# Generator — computes one value at a time\ntotal = sum(x**2 for x in range(1_000_000))\n```\n\n## When to Use Generators\n\nUse a generator expression when:\n- You only need to iterate once\n- You are passing directly to a function like `sum()`, `max()`, `any()`, `all()`\n- The dataset is large enough that memory matters\n\nUse a list comprehension when:\n- You need to iterate multiple times\n- You need indexing or slicing\n- You need to know the length\n\n## Generators Are Exhausted\n\nOnce a generator is consumed, it is empty. You cannot reuse it or reset it.",
      "diagram": "flowchart TD\n    A[\"List comprehension\n[x**2 for x in range(1M)]\"] --> B[\"All 1M values\nin memory now\"]\n    C[\"Generator expression\n(x**2 for x in range(1M))\"] --> D[\"Generator object\nno values yet\"]\n    D --> E[\"next() called\"] --> F[\"Compute one value\"]\n    F --> E\n    F --> G[\"sum() consumes\nall values one by one\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Generators produce values on demand — no memory overhead for large datasets",
      "code": "# List vs generator — same result, different memory\nimport sys\n\nlst = [x**2 for x in range(10000)]\ngen = (x**2 for x in range(10000))\n\nprint(sys.getsizeof(lst))   # ~87,624 bytes\nprint(sys.getsizeof(gen))   # ~104 bytes — tiny!\n\n# Generators work directly with aggregation functions\ntotal = sum(x**2 for x in range(1, 101))\nprint(total)   # 338350\n\nmaximum = max(len(word) for word in [\"apple\", \"banana\", \"fig\"])\nprint(maximum)   # 6\n\n# any() and all() with generators — short-circuit\nnumbers = [2, 4, 6, 7, 8]\nhas_odd = any(n % 2 != 0 for n in numbers)   # stops at 7\nall_even = all(n % 2 == 0 for n in numbers)  # stops at 7\nprint(has_odd, all_even)   # True False\n\n# Generators are exhausted after one pass\ngen = (x for x in range(5))\nprint(list(gen))   # [0, 1, 2, 3, 4]\nprint(list(gen))   # [] — exhausted!\n\n# Note: when passing to a function, outer parens can be omitted\ntotal = sum(x**2 for x in range(10))   # not sum((x**2 for x in range(10)))",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "When passing a generator expression as the only argument to a function, you can omit the extra parentheses: `sum(x**2 for x in range(10))` instead of `sum((x**2 for x in range(10)))`. Both work — the single-parentheses form is the idiomatic Python style."
      },
      "keyPoints": [
        "Generator expressions use () instead of [] — they produce values lazily, one at a time",
        "Generators use almost no memory regardless of dataset size",
        "Use generators with sum(), max(), min(), any(), all() for memory-efficient aggregation",
        "Generators are exhausted after one pass — you cannot reuse or reset them",
        "Use a list comprehension when you need indexing, slicing, length, or multiple passes"
      ],
      "tryIt": "Compare memory usage of a list comprehension vs generator expression over range(1_000_000) using sys.getsizeof(). Then use a generator expression with any() to check whether a large list contains any negative numbers — verify it short-circuits by adding a print() inside the expression."
    }
  },

  {
    "id": 1013,
    "moduleId": 9,
    "moduleTitle": "Comprehensions & Functional Tools",
    "title": "map() and filter()",
    "type": "lesson",
    "content": {
      "body": "`map()` and `filter()` are built-in functions that apply a function to an iterable. They come from functional programming and predate comprehensions in Python. Understanding them matters because you will encounter them in existing code, and they are occasionally cleaner than comprehensions for specific patterns.\n\n## map()\n\n`map(function, iterable)` applies a function to every item and returns a lazy iterator of results.\n\n```python\ndoubled = map(lambda x: x * 2, [1, 2, 3, 4])\n```\n\nEquivalent list comprehension: `[x * 2 for x in [1, 2, 3, 4]]`\n\n`map()` can take multiple iterables — the function receives one argument from each:\n```python\nsums = map(lambda x, y: x + y, [1, 2, 3], [10, 20, 30])\n```\n\n## filter()\n\n`filter(function, iterable)` keeps only items where the function returns `True`.\n\n```python\nevens = filter(lambda x: x % 2 == 0, range(10))\n```\n\nEquivalent list comprehension: `[x for x in range(10) if x % 2 == 0]`\n\nPass `None` as the function to filter out falsy values: `filter(None, items)`.\n\n## map() and filter() Return Iterators\n\nLike generators, `map()` and `filter()` are lazy — they produce values on demand. Wrap with `list()` to materialise the result.\n\n## map/filter vs Comprehensions\n\nFor simple cases, comprehensions are generally preferred in modern Python — they are more readable to most developers. Use `map()` when applying an existing named function avoids a redundant lambda.",
      "diagram": "flowchart LR\n    A[\"[1, 2, 3, 4]\"] --> B[\"map(fn, items)\napply fn to each\"]\n    A --> C[\"filter(fn, items)\nkeep where fn is True\"]\n    B --> D[\"[fn(1), fn(2),\nfn(3), fn(4)]\"]\n    C --> E[\"[items where\nfn(item) is True]\"]\n    F[\"map(str, [1,2,3])\"] --> G[\"['1','2','3']\"]\n    H[\"filter(None, [0,'',1,2])\"] --> I[\"[1, 2]\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "map() transforms every item; filter() keeps only items where the function returns True",
      "code": "# map() — apply function to every item\nnumbers = [1, 2, 3, 4, 5]\n\ndoubled = list(map(lambda x: x * 2, numbers))\nprint(doubled)   # [2, 4, 6, 8, 10]\n\n# map with a named function — cleaner than lambda\nwords = [\"hello\", \"world\", \"python\"]\nupper = list(map(str.upper, words))\nprint(upper)   # ['HELLO', 'WORLD', 'PYTHON']\n\n# map with multiple iterables\na = [1, 2, 3]\nb = [10, 20, 30]\nsums = list(map(lambda x, y: x + y, a, b))\nprint(sums)   # [11, 22, 33]\n\n# filter() — keep matching items\nevens = list(filter(lambda x: x % 2 == 0, range(10)))\nprint(evens)   # [0, 2, 4, 6, 8]\n\n# filter with named function\ndef is_positive(n):\n    return n > 0\n\nmixed = [-3, -1, 0, 2, 5, -2, 8]\npositives = list(filter(is_positive, mixed))\nprint(positives)   # [2, 5, 8]\n\n# filter(None) removes falsy values\nitems = [0, 1, \"\", \"hello\", None, [], [1, 2], False, True]\ntruthy = list(filter(None, items))\nprint(truthy)   # [1, 'hello', [1, 2], True]\n\n# Comprehension equivalents — often preferred\ndoubled_c = [x * 2 for x in numbers]\nevens_c = [x for x in range(10) if x % 2 == 0]",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Prefer `map(str.upper, words)` over `map(lambda w: w.upper(), words)` when an existing method or function does the job. The named function version is cleaner and avoids an unnecessary lambda. The rule: if you are writing `lambda x: some_function(x)`, just pass `some_function` directly."
      },
      "keyPoints": [
        "map(fn, iterable) applies fn to every item — returns a lazy iterator",
        "filter(fn, iterable) keeps items where fn returns True — returns a lazy iterator",
        "Both return iterators — wrap with list() to materialise",
        "filter(None, items) removes all falsy values — a useful one-liner",
        "Comprehensions are generally preferred for readability — use map/filter with named functions"
      ],
      "tryIt": "Given a list of strings representing numbers (some invalid like 'abc'), use filter() with str.isdigit to keep only valid ones, then use map() with int to convert them. Chain the two operations. Compare the result to an equivalent list comprehension and decide which is more readable."
    }
  },

  {
    "id": 1014,
    "moduleId": 9,
    "moduleTitle": "Comprehensions & Functional Tools",
    "title": "sorted(), min(), max() with key=",
    "type": "lesson",
    "content": {
      "body": "The `key=` parameter is one of Python's most powerful and underused features. It lets you sort, find minimums, and find maximums based on a derived value — without modifying the original data or writing custom comparison logic.\n\n## How key= Works\n\nThe `key` function is applied to each item before comparison. The item itself is not changed — only the comparison uses the key's result. The original items are returned in the sorted order.\n\n```python\nwords = [\"banana\", \"fig\", \"apple\", \"kiwi\"]\nsorted(words, key=len)   # sort by length, return original words\n```\n\n## Common key= Patterns\n\n**Sort strings case-insensitively:** `key=str.lower`\n\n**Sort by a dict field:** `key=lambda d: d[\"score\"]`\n\n**Sort by multiple criteria:** `key=lambda x: (x[\"grade\"], x[\"name\"])` — tuples compare element by element\n\n**Sort by computed value:** `key=lambda x: abs(x)` — sort by absolute value\n\n## min() and max() with key=\n\nThe same `key=` parameter works with `min()` and `max()`:\n\n```python\nlongest = max(words, key=len)\ncheapest = min(products, key=lambda p: p[\"price\"])\n```\n\n## operator.itemgetter and attrgetter\n\nFor performance-critical code, `operator.itemgetter(\"score\")` is faster than `lambda d: d[\"score\"]` and more explicit. `operator.attrgetter(\"name\")` does the same for object attributes.",
      "diagram": "flowchart TD\n    A[\"sorted(items, key=fn)\"] --> B[\"Apply fn to each item\"]\n    B --> C[\"Compare fn results\"]\n    C --> D[\"Return original items\nin sorted order\"]\n    E[\"key= patterns\"] --> F[\"key=len\nby length\"]\n    E --> G[\"key=str.lower\ncase-insensitive\"]\n    E --> H[\"key=lambda d: d['k']\nby dict field\"]\n    E --> I[\"key=lambda x: (a,b)\nmulti-criteria\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "key= applies a function for comparison only — original items are returned unchanged",
      "code": "from operator import itemgetter\n\nwords = [\"banana\", \"Fig\", \"apple\", \"KIWI\", \"cherry\"]\n\n# Sort by length\nprint(sorted(words, key=len))\n\n# Case-insensitive sort\nprint(sorted(words, key=str.lower))\n\n# Reverse sort\nprint(sorted(words, key=len, reverse=True))\n\n# Sort list of dicts\nstudents = [\n    {\"name\": \"Carol\", \"score\": 85, \"grade\": \"B\"},\n    {\"name\": \"Alice\", \"score\": 92, \"grade\": \"A\"},\n    {\"name\": \"Bob\",   \"score\": 85, \"grade\": \"B\"},\n    {\"name\": \"Dave\",  \"score\": 71, \"grade\": \"C\"},\n]\n\n# By score descending\nby_score = sorted(students, key=lambda s: s[\"score\"], reverse=True)\nprint([s[\"name\"] for s in by_score])   # ['Alice', 'Carol', 'Bob', 'Dave']\n\n# Multi-criteria: grade then name\nby_grade_name = sorted(students, key=lambda s: (s[\"grade\"], s[\"name\"]))\nprint([s[\"name\"] for s in by_grade_name])\n\n# operator.itemgetter — faster than lambda for dict access\nby_score2 = sorted(students, key=itemgetter(\"score\"), reverse=True)\n\n# min and max with key\ncheapest = min(students, key=itemgetter(\"score\"))\nprint(f\"Lowest scorer: {cheapest['name']}\")\n\n# Sort numbers by absolute value\nnums = [-5, 3, -1, 4, -2]\nprint(sorted(nums, key=abs))   # [-1, -2, 3, 4, -5]",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Multi-criteria sorting with tuples is elegant: `key=lambda s: (s['grade'], s['name'])` sorts by grade first, then by name within the same grade. Tuples compare element by element — the first element is the primary sort key, the second is the tiebreaker. Add as many levels as needed."
      },
      "keyPoints": [
        "key= applies a function for comparison only — original items are returned unchanged",
        "key=str.lower for case-insensitive string sorting",
        "key=lambda d: d['field'] for sorting dicts by a specific field",
        "Tuple keys enable multi-criteria sorting: key=lambda x: (primary, secondary)",
        "operator.itemgetter is faster than lambda for dict field access in performance-critical code"
      ],
      "tryIt": "Given a list of employee dicts with name, department, and salary: sort by salary descending, sort by department then salary, find the highest-paid employee using max(), find the lowest-paid in a specific department using min() with a filtered list, and sort names case-insensitively."
    }
  },

  {
    "id": 1015,
    "moduleId": 9,
    "moduleTitle": "Comprehensions & Functional Tools",
    "title": "zip() and enumerate() in Depth",
    "type": "lesson",
    "content": {
      "body": "`zip()` and `enumerate()` were introduced in Module 5. This lesson covers their full capabilities — multiple iterables, unequal lengths, strict mode, and the patterns that make them indispensable in real code.\n\n## zip() in Depth\n\n`zip()` pairs elements from two or more iterables by position. It stops at the shortest iterable by default.\n\n**`zip_longest()`** from `itertools` fills missing values with a default instead of stopping early.\n\n**Unzipping** — `zip(*pairs)` transposes a list of tuples back into separate sequences.\n\n**Three or more iterables** — `zip(a, b, c)` produces tuples of three elements.\n\n**`strict=True`** (Python 3.10+) — raises `ValueError` if iterables have different lengths, catching accidental mismatches.\n\n## enumerate() in Depth\n\n`enumerate(iterable, start=0)` yields `(index, value)` pairs. The `start` parameter shifts the index — useful for 1-based numbering or continuing from a specific position.\n\n**Enumerate a dict** — `enumerate(d.items())` gives `(i, (key, value))` tuples.\n\n**Enumerate with unpacking** — `for i, (name, score) in enumerate(pairs)` unpacks both the index and the tuple in one line.\n\n## Combining zip and enumerate\n\nWrap `zip()` in `enumerate()` when you need the index alongside paired values.",
      "diagram": "flowchart LR\n    A[\"zip(a, b, c)\"] --> B[\"(a0,b0,c0)\n(a1,b1,c1)\n...stops at shortest\"]\n    C[\"zip_longest(a,b)\nfillvalue=None\"] --> D[\"fills missing\nwith default\"]\n    E[\"zip(*pairs)\"] --> F[\"unzip / transpose\"]\n    G[\"enumerate(items,\nstart=1)\"] --> H[\"(1,item0)\n(2,item1)\n...\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "zip() pairs iterables; enumerate() adds an index — both are lazy iterators",
      "code": "from itertools import zip_longest\n\nnames = [\"Alice\", \"Bob\", \"Carol\"]\nscores = [92, 78, 85]\ngrades = [\"A\", \"B\", \"B\"]\n\n# Basic zip — three iterables\nfor name, score, grade in zip(names, scores, grades):\n    print(f\"{name}: {score} ({grade})\")\n\n# zip stops at shortest\nshort = [1, 2]\nlong = [10, 20, 30, 40]\nprint(list(zip(short, long)))   # [(1,10), (2,20)] — stops at 2\n\n# zip_longest — fills missing values\nprint(list(zip_longest(short, long, fillvalue=0)))\n# [(1,10), (2,20), (0,30), (0,40)]\n\n# strict=True — raises if lengths differ (Python 3.10+)\n# list(zip(short, long, strict=True))   # ValueError\n\n# Unzip — transpose\npairs = [(1, \"a\"), (2, \"b\"), (3, \"c\")]\nnumbers, letters = zip(*pairs)\nprint(numbers)   # (1, 2, 3)\nprint(letters)   # ('a', 'b', 'c')\n\n# Build dict from two lists\nkeys = [\"name\", \"age\", \"city\"]\nvalues = [\"Alice\", 30, \"London\"]\nprofile = dict(zip(keys, values))\nprint(profile)\n\n# enumerate with start=1\nfor i, name in enumerate(names, start=1):\n    print(f\"{i}. {name}\")\n\n# enumerate + zip combined\nfor i, (name, score) in enumerate(zip(names, scores), start=1):\n    print(f\"{i}. {name}: {score}\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "`dict(zip(keys, values))` is the cleanest way to build a dict from two parallel lists. It is more readable than a dict comprehension with enumerate and more Pythonic than a manual loop. Use it whenever you have a list of keys and a list of corresponding values that need to be paired."
      },
      "keyPoints": [
        "zip() stops at the shortest iterable — use zip_longest() to fill missing values",
        "zip(*pairs) unzips — transposes a list of tuples into separate sequences",
        "dict(zip(keys, values)) builds a dict from two parallel lists cleanly",
        "enumerate(items, start=1) starts the index at 1 instead of 0",
        "enumerate(zip(a, b)) gives index + paired values in one loop"
      ],
      "tryIt": "Given two lists of equal length (names and scores), use zip() to build a dict. Then use zip_longest() to pair them with a third shorter list of grades, filling missing grades with 'N/A'. Finally, use zip(*pairs) to unzip a list of (x, y) coordinate tuples back into separate x and y lists."
    }
  },

  {
    "id": 1016,
    "moduleId": 9,
    "moduleTitle": "Comprehensions & Functional Tools",
    "title": "functools — reduce() and partial()",
    "type": "lesson",
    "content": {
      "body": "The `functools` module provides higher-order functions — functions that operate on other functions. Two are especially useful: `reduce()` for folding a sequence into a single value, and `partial()` for creating specialised versions of existing functions.\n\n## reduce()\n\n`reduce(function, iterable, initializer)` applies a function cumulatively to items in a sequence, reducing it to a single value. It is the functional equivalent of a running accumulator loop.\n\n```python\nfrom functools import reduce\ntotal = reduce(lambda acc, x: acc + x, [1, 2, 3, 4, 5])\n# ((((1+2)+3)+4)+5) = 15\n```\n\nFor simple cases like sum, product, or max, the built-in functions are clearer. `reduce()` shines for custom accumulation logic — building nested structures, composing functions, or folding with complex state.\n\n## partial()\n\n`partial(function, *args, **kwargs)` creates a new function with some arguments pre-filled. This is called partial application — you fix some arguments and leave others free.\n\n```python\nfrom functools import partial\ndouble = partial(pow, exp=2)   # pow with exp fixed to 2\n```\n\n`partial()` is useful for adapting functions to interfaces that expect a specific signature, creating specialised versions of general functions, and reducing repetition when calling the same function with the same arguments repeatedly.\n\n## lru_cache()\n\n`@functools.lru_cache` memoises a function — caches its return values so repeated calls with the same arguments return instantly. Essential for recursive functions with overlapping subproblems.",
      "diagram": "flowchart TD\n    A[\"reduce(fn, [1,2,3,4])\"] --> B[\"fn(1,2) = 3\"]\n    B --> C[\"fn(3,3) = 6\"]\n    C --> D[\"fn(6,4) = 10\"]\n    D --> E[\"Result: 10\"]\n    F[\"partial(pow, exp=2)\"] --> G[\"New function\nwith exp fixed\"]\n    G --> H[\"double(3) = pow(3,2) = 9\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "reduce() folds a sequence into one value; partial() pre-fills arguments to create specialised functions",
      "code": "from functools import reduce, partial, lru_cache\n\n# reduce() — fold sequence into single value\nnumbers = [1, 2, 3, 4, 5]\ntotal = reduce(lambda acc, x: acc + x, numbers)\nprint(total)   # 15\n\nproduct = reduce(lambda acc, x: acc * x, numbers)\nprint(product)   # 120\n\n# reduce with initializer\ntotal_with_start = reduce(lambda acc, x: acc + x, numbers, 100)\nprint(total_with_start)   # 115\n\n# Build a nested structure with reduce\nkeys = [\"a\", \"b\", \"c\"]\nnested = reduce(lambda acc, k: {k: acc}, reversed(keys), \"value\")\nprint(nested)   # {'a': {'b': {'c': 'value'}}}\n\n# partial() — pre-fill arguments\ndef power(base, exp):\n    return base ** exp\n\nsquare = partial(power, exp=2)\ncube = partial(power, exp=3)\nprint(square(4))   # 16\nprint(cube(3))     # 27\n\n# partial with print — fix sep and end\ndebug_print = partial(print, sep=\" | \", end=\"\n---\n\")\ndebug_print(\"Alice\", 92, \"Pass\")\n\n# lru_cache — memoisation\n@lru_cache(maxsize=None)\ndef fibonacci(n):\n    if n < 2:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(50))   # instant — cached",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "For simple aggregations, prefer built-ins over reduce(): `sum()`, `max()`, `min()`, `all()`, `any()` are clearer and faster. Use `reduce()` when the accumulation logic is genuinely custom — building nested structures, composing functions, or folding with complex state that no built-in covers."
      },
      "keyPoints": [
        "reduce(fn, iterable) folds a sequence into a single value by applying fn cumulatively",
        "partial(fn, **kwargs) creates a new function with some arguments pre-filled",
        "lru_cache memoises function results — essential for recursive functions with repeated subproblems",
        "Prefer sum(), max(), min() over reduce() for simple aggregations",
        "partial() adapts functions to expected signatures without writing wrapper functions"
      ],
      "tryIt": "Use reduce() to find the longest word in a list without using max(). Use partial() to create a specialised version of sorted() that always sorts in reverse order. Apply lru_cache to a recursive function that counts ways to climb n stairs taking 1 or 2 steps at a time."
    }
  },

  {
    "id": 1017,
    "moduleId": 9,
    "moduleTitle": "Comprehensions & Functional Tools",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Comprehension and functional tool bugs are almost always silent — the code runs but produces wrong results. These are the patterns that catch developers off guard.\n\n## Mistake 1 — Confusing Filter and Conditional Expression\n\nThe `if` clause at the end of a comprehension filters items out. A conditional expression (`x if cond else y`) in the output position keeps all items but gives them different values. Mixing them up produces wrong output with no error.\n\n## Mistake 2 — Forgetting list() Around map/filter\n\n`map()` and `filter()` return iterators, not lists. Printing them shows `<map object>`. Wrap with `list()` to materialise, or consume directly in a loop or aggregation function.\n\n## Mistake 3 — Reusing an Exhausted Generator\n\nA generator can only be consumed once. After iterating through it, it is empty. Assigning a generator to a variable and then using it twice gives an empty result the second time — silently.\n\n## Mistake 4 — Mutating the Source Inside a Comprehension\n\nModifying a list while building a comprehension from it produces unpredictable results. Build from the original, assign to a new variable.\n\n## Mistake 5 — Nested Comprehension Order\n\nIn `[x for sub in outer for x in sub]`, the order mirrors nested `for` loops — outer first, inner second. Reversing the order produces a `NameError` or wrong results.\n\n## Mistake 6 — Using reduce() When a Built-in Exists\n\n`reduce(lambda a, b: a + b, nums)` is just `sum(nums)`. Using `reduce()` for cases covered by built-ins adds complexity without benefit.",
      "diagram": "flowchart TD\n    A[\"Comprehension Mistakes\"] --> B[\"Filter vs conditional expr\nsilent wrong output\"]\n    A --> C[\"map/filter not list\nprints object\"]\n    A --> D[\"Exhausted generator\nsilent empty result\"]\n    A --> E[\"Nested order wrong\nNameError or wrong output\"]\n    A --> F[\"reduce for sum/max\nunnecessary complexity\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Most comprehension bugs are silent — test each branch with values that should hit different paths",
      "code": "# Mistake 1 — filter vs conditional expression\nscores = [85, 42, 91, 38, 76]\n\n# Filter — removes items below 50\npassing = [s for s in scores if s >= 50]\nprint(passing)   # [85, 91, 76]\n\n# Conditional expression — labels all items\nlabels = [\"Pass\" if s >= 50 else \"Fail\" for s in scores]\nprint(labels)   # ['Pass', 'Fail', 'Pass', 'Fail', 'Pass']\n\n# Mistake 2 — map/filter return iterators\nresult = map(str.upper, [\"hello\", \"world\"])\nprint(result)        # <map object> — not a list!\nprint(list(result))  # ['HELLO', 'WORLD']\nprint(list(result))  # [] — exhausted!\n\n# Mistake 3 — exhausted generator\ngen = (x**2 for x in range(5))\nprint(list(gen))   # [0, 1, 4, 9, 16]\nprint(list(gen))   # [] — already consumed\n\n# Mistake 4 — nested comprehension order\nmatrix = [[1, 2], [3, 4], [5, 6]]\n# WRONG: for x in sub comes before sub is defined\n# flat = [x for x in sub for sub in matrix]  # NameError\n# CORRECT: outer loop first\nflat = [x for sub in matrix for x in sub]\nprint(flat)   # [1, 2, 3, 4, 5, 6]\n\n# Mistake 5 — reduce when built-in exists\nfrom functools import reduce\nnums = [1, 2, 3, 4, 5]\n# Unnecessary:\ntotal = reduce(lambda a, b: a + b, nums)\n# Clear:\ntotal = sum(nums)",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Generators and map/filter objects are single-use. If you assign one to a variable and consume it (in a loop, list(), sum(), etc.), it is empty afterwards. If you need to iterate multiple times, convert to a list first. This is one of the most confusing silent bugs for developers coming from other languages."
      },
      "keyPoints": [
        "if at the end filters items out; conditional expression in output keeps all items",
        "map() and filter() return iterators — wrap with list() to materialise",
        "Generators and iterators are single-use — convert to list if you need multiple passes",
        "Nested comprehension order: outer loop first, inner loop second — mirrors nested for loops",
        "Use sum(), max(), min(), any(), all() instead of reduce() for standard aggregations"
      ],
      "tryIt": "Find and fix all five bugs: (1) a comprehension using if when a conditional expression was intended, (2) printing a map object directly, (3) consuming a generator twice, (4) a nested comprehension with reversed loop order, (5) reduce() used where sum() would be clearer."
    }
  },

  {
    "id": 1018,
    "moduleId": 9,
    "moduleTitle": "Comprehensions & Functional Tools",
    "title": "Module 9 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered Python's functional and comprehension toolkit — the tools that let you transform, filter, and aggregate data concisely and efficiently.\n\n## What You Learned\n\n**List comprehensions in depth** — `[expr for x in it if cond]`. The `if` clause filters; a conditional expression in the output position transforms. Nested comprehensions flatten structures. Faster than loop + append.\n\n**Dict and set comprehensions** — `{k: v for ...}` and `{expr for ...}`. Dict comprehensions transform, filter, invert, and build lookups. Set comprehensions deduplicate automatically.\n\n**Generator expressions** — `(expr for x in it)`. Lazy, memory-efficient. Single-use. Use with `sum()`, `max()`, `any()`, `all()` for zero-overhead aggregation.\n\n**map() and filter()** — lazy iterators. `map(fn, it)` transforms every item. `filter(fn, it)` keeps matching items. `filter(None, it)` removes falsy values. Prefer comprehensions for readability; use map/filter with named functions.\n\n**sorted(), min(), max() with key=** — the `key=` parameter applies a function for comparison only. Tuple keys enable multi-criteria sorting. `operator.itemgetter` is faster than lambda for dict fields.\n\n**zip() and enumerate()** — `zip()` pairs iterables, stops at shortest. `zip_longest()` fills gaps. `zip(*pairs)` unzips. `enumerate(start=1)` for 1-based indexing.\n\n**functools** — `reduce()` folds sequences. `partial()` pre-fills arguments. `lru_cache` memoises recursive functions.\n\n## What Is Coming Next\n\nModule 10 introduces **error handling** — `try`/`except`/`finally`, custom exceptions, and the patterns that make programs robust against unexpected input and failures.",
      "diagram": "flowchart TD\n    A[\"✅ List comprehensions\nin depth\"] --> B[\"✅ Dict & Set\ncomprehensions\"]\n    B --> C[\"✅ Generator\nexpressions\"]\n    C --> D[\"✅ map() filter()\"]\n    D --> E[\"✅ sorted min max\nkey=\"]\n    E --> F[\"✅ zip() enumerate()\nin depth\"]\n    F --> G[\"✅ functools\nreduce partial cache\"]\n    G --> H[\"➡️ Error Handling\nModule 10\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 9 complete — functional tools and comprehensions are the language of data transformation",
      "code": "# Everything from Module 9 in one program\nfrom functools import reduce, lru_cache\nfrom itertools import zip_longest\n\ndef analyse_cohort(students, passing_score=50):\n    if not students:\n        return {}\n\n    # Dict comprehension — name to score lookup\n    lookup = {s[\"name\"]: s[\"score\"] for s in students}\n\n    # Generator — memory-efficient average\n    avg = sum(s[\"score\"] for s in students) / len(students)\n\n    # Comprehensions — filter and label\n    passed = [s[\"name\"] for s in students if s[\"score\"] >= passing_score]\n    labels = {s[\"name\"]: \"Pass\" if s[\"score\"] >= passing_score else \"Fail\"\n              for s in students}\n\n    # sorted with key\n    ranked = sorted(students, key=lambda s: s[\"score\"], reverse=True)\n    top3 = [s[\"name\"] for s in ranked[:3]]\n\n    # Set comprehension — unique grades\n    unique_grades = {s.get(\"grade\", \"N/A\") for s in students}\n\n    # reduce — product of top 3 scores\n    top_scores = [s[\"score\"] for s in ranked[:3]]\n    score_product = reduce(lambda a, b: a * b, top_scores)\n\n    return {\n        \"average\": round(avg, 1),\n        \"passed\": len(passed),\n        \"top_3\": top3,\n        \"unique_grades\": unique_grades,\n        \"top_score_product\": score_product,\n    }\n\ncohort = [\n    {\"name\": \"Alice\", \"score\": 92, \"grade\": \"A\"},\n    {\"name\": \"Bob\",   \"score\": 45, \"grade\": \"F\"},\n    {\"name\": \"Carol\", \"score\": 78, \"grade\": \"B\"},\n    {\"name\": \"Dave\",  \"score\": 85, \"grade\": \"A\"},\n    {\"name\": \"Eve\",   \"score\": 61, \"grade\": \"C\"},\n]\nfor k, v in analyse_cohort(cohort).items():\n    print(f\"{k}: {v}\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The tools in this module are about expressing intent clearly. A comprehension says 'build this collection from that one'. A generator says 'process this lazily'. key= says 'sort by this derived value'. When you reach for these tools naturally, you are writing idiomatic Python."
      },
      "keyPoints": [
        "Comprehensions are the idiomatic way to build lists, dicts, and sets from iterables",
        "Generator expressions are memory-efficient — use them with sum(), any(), all()",
        "key= in sorted/min/max applies a function for comparison only — original items returned",
        "map() and filter() are lazy — wrap with list() or consume directly",
        "partial() and lru_cache() from functools reduce repetition and add memoisation"
      ],
      "tryIt": "From memory, write a pipeline that: reads a list of raw strings, filters out empty ones with filter(), strips whitespace with map(), converts to lowercase with a comprehension, counts word frequencies with a dict comprehension, and returns the top 5 words sorted by frequency using sorted() with key=."
    }
  },

  {
    "id": 1019,
    "moduleId": 10,
    "moduleTitle": "File Handling",
    "title": "What Is File Handling?",
    "type": "lesson",
    "content": {
      "body": "File handling is how your program reads data from and writes data to persistent storage. Without it, every program starts fresh — no memory of previous runs, no way to save results, no way to process external data. File handling is what connects your code to the real world.\n\n## Why Files Matter\n\nAlmost every real program works with files in some form. Configuration files tell your program how to behave. Log files record what happened. Data files contain the information your program processes. Output files store results for other programs or users to consume.\n\n## What Python Can Do with Files\n\nPython can read and write plain text files, CSV spreadsheets, JSON data, binary files, and more. The built-in `open()` function is the entry point for all file operations.\n\n## The File Lifecycle\n\nEvery file operation follows the same lifecycle:\n1. **Open** — establish a connection to the file\n2. **Read or write** — perform the operation\n3. **Close** — release the connection and flush any buffered data\n\nForgetting to close a file can cause data loss (writes not flushed), resource leaks (file handles left open), and permission errors (file locked). The `with` statement handles closing automatically — it is the standard Python pattern.\n\n## File Modes\n\nWhen opening a file, you specify a mode:\n- `'r'` — read (default)\n- `'w'` — write (creates or overwrites)\n- `'a'` — append (adds to end)\n- `'x'` — exclusive create (fails if file exists)\n- `'b'` — binary mode (add to any of the above)",
      "diagram": "flowchart TD\n    A[\"open(file, mode)\"] --> B[\"File object\"]\n    B --> C[\"Read\nf.read() f.readline()\"]\n    B --> D[\"Write\nf.write()\"]\n    B --> E[\"Close\nf.close()\"]\n    F[\"with open() as f:\"] --> G[\"Auto-closes\non exit\"]\n    G --> C\n    G --> D\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Always use with open() — it guarantees the file is closed even if an error occurs",
      "code": "# Basic file open and close — manual approach\nf = open(\"example.txt\", \"r\")\ncontent = f.read()\nf.close()   # must remember to close!\n\n# with statement — automatic close (preferred)\nwith open(\"example.txt\", \"r\") as f:\n    content = f.read()\n# file is closed here automatically\n\n# File modes\n# 'r'  — read (default, file must exist)\n# 'w'  — write (creates new or overwrites existing)\n# 'a'  — append (adds to end, creates if missing)\n# 'x'  — exclusive create (fails if file exists)\n# 'rb' — read binary\n# 'wb' — write binary\n\n# Check if file exists before reading\nimport os\nif os.path.exists(\"data.txt\"):\n    with open(\"data.txt\", \"r\") as f:\n        print(f.read())\nelse:\n    print(\"File not found\")\n\n# File object properties\nwith open(\"example.txt\", \"r\") as f:\n    print(f.name)     # 'example.txt'\n    print(f.mode)     # 'r'\n    print(f.closed)   # False\nprint(f.closed)       # True — closed after with block",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Always use `with open()` instead of manual `open()` and `close()`. The `with` statement guarantees the file is closed even if an exception occurs inside the block. Manual `close()` is skipped if an error is raised before it — leaving the file open and potentially corrupting buffered writes."
      },
      "keyPoints": [
        "File handling connects programs to persistent storage — config, logs, data, output",
        "Every file operation: open → read/write → close",
        "Always use with open() — it closes the file automatically even on errors",
        "Mode 'r' reads, 'w' writes/overwrites, 'a' appends, 'x' creates exclusively",
        "Forgetting to close causes data loss, resource leaks, and permission errors"
      ],
      "tryIt": "Create a text file called 'notes.txt' using Python's write mode. Write three lines to it. Close it. Open it again in read mode and print the contents. Then open it in append mode and add a fourth line. Read and print the full file again to confirm all four lines are present."
    }
  },

  {
    "id": 1020,
    "moduleId": 10,
    "moduleTitle": "File Handling",
    "title": "Reading Files",
    "type": "lesson",
    "content": {
      "body": "Python provides several methods for reading file contents, each suited to different situations. Choosing the right one depends on file size, whether you need all content at once, and how you plan to process it.\n\n## read()\n\n`f.read()` reads the entire file as a single string. Simple and convenient for small files. For large files, this loads everything into memory at once — use line-by-line reading instead.\n\n`f.read(n)` reads exactly `n` bytes/characters. Useful for binary files or streaming.\n\n## readline()\n\n`f.readline()` reads one line at a time, including the trailing newline character. Returns an empty string when the end of file is reached. Useful when you need to process lines one at a time with full control.\n\n## readlines()\n\n`f.readlines()` reads all lines and returns them as a list of strings. Each string includes the trailing `\\n`. Use `.strip()` to remove it.\n\n## Iterating Directly\n\nThe most memory-efficient and Pythonic way to read a file line by line is to iterate over the file object directly. Python reads one line at a time without loading the whole file.\n\n```python\nwith open(\"data.txt\") as f:\n    for line in f:\n        process(line.strip())\n```\n\n## Encoding\n\nAlways specify `encoding=\"utf-8\"` when reading text files to avoid platform-dependent encoding issues. This is especially important on Windows where the default encoding may not be UTF-8.",
      "diagram": "flowchart TD\n    A[\"Reading methods\"] --> B[\"f.read()\nentire file as string\"]\n    A --> C[\"f.readline()\none line at a time\"]\n    A --> D[\"f.readlines()\nall lines as list\"]\n    A --> E[\"for line in f:\nmost efficient\"]\n    B --> F[\"Small files\nsimple processing\"]\n    E --> G[\"Large files\nline-by-line streaming\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Iterate directly over the file object for large files — reads one line at a time without loading all into memory",
      "code": "# Create a sample file first\nwith open(\"sample.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"Line 1: Hello\\n\")\n    f.write(\"Line 2: World\\n\")\n    f.write(\"Line 3: Python\\n\")\n\n# read() — entire file as one string\nwith open(\"sample.txt\", \"r\", encoding=\"utf-8\") as f:\n    content = f.read()\n    print(repr(content))   # includes \\n characters\n\n# readline() — one line at a time\nwith open(\"sample.txt\", \"r\", encoding=\"utf-8\") as f:\n    first = f.readline()\n    second = f.readline()\n    print(first.strip())    # Line 1: Hello\n    print(second.strip())   # Line 2: World\n\n# readlines() — all lines as a list\nwith open(\"sample.txt\", \"r\", encoding=\"utf-8\") as f:\n    lines = f.readlines()\n    print(lines)   # ['Line 1: Hello\\n', 'Line 2: World\\n', ...]\n\n# Iterate directly — most Pythonic for large files\nwith open(\"sample.txt\", \"r\", encoding=\"utf-8\") as f:\n    for line in f:\n        print(line.strip())\n\n# Process and filter lines\nwith open(\"sample.txt\", \"r\", encoding=\"utf-8\") as f:\n    numbers = [line.strip() for line in f if line.strip()]",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Always specify `encoding='utf-8'` when opening text files. Without it, Python uses the platform default — which is UTF-8 on macOS/Linux but often cp1252 on Windows. Files written on one platform may fail to read on another. Explicit encoding makes your code portable."
      },
      "keyPoints": [
        "read() loads the entire file as a string — fine for small files, avoid for large ones",
        "readline() reads one line including the trailing newline — returns '' at end of file",
        "readlines() returns all lines as a list — each includes the trailing newline",
        "Iterating directly over the file object is the most memory-efficient approach",
        "Always specify encoding='utf-8' for portable text file handling"
      ],
      "tryIt": "Write a program that reads a text file line by line, strips whitespace, skips empty lines, numbers each non-empty line starting from 1, and writes the numbered lines to a new file. Use direct iteration for reading and a list comprehension to filter empty lines."
    }
  },

  {
    "id": 1021,
    "moduleId": 10,
    "moduleTitle": "File Handling",
    "title": "Writing and Appending",
    "type": "lesson",
    "content": {
      "body": "Writing to files lets your program save results, generate reports, log events, and produce output for other programs. Python provides two write modes and two key methods.\n\n## write() vs writelines()\n\n**`f.write(string)`** writes a single string. It does not add a newline automatically — you must include `\\n` explicitly if you want line breaks.\n\n**`f.writelines(iterable)`** writes each string in an iterable. Like `write()`, it does not add newlines between items — include them in the strings themselves.\n\n## Write Mode vs Append Mode\n\n**`'w'` (write)** — creates the file if it does not exist. If it does exist, it is **completely overwritten** — all previous content is lost immediately on open, before any write calls.\n\n**`'a'` (append)** — creates the file if it does not exist. If it does exist, new content is added to the end. Existing content is preserved. This is the safe mode for logging and incremental output.\n\n## Exclusive Create Mode\n\n**`'x'`** — creates a new file and raises `FileExistsError` if the file already exists. Use this when you must not overwrite existing data.\n\n## Flushing\n\nPython buffers writes for performance. Data may not reach disk immediately. `f.flush()` forces the buffer to disk without closing. The `with` statement flushes and closes on exit.",
      "diagram": "flowchart TD\n    A[\"open(file, mode)\"] --> B[\"'w' Write\noverwrite or create\"]\n    A --> C[\"'a' Append\nadd to end or create\"]\n    A --> D[\"'x' Exclusive\nfail if exists\"]\n    B --> E[\"f.write(str)\nsingle string\"]\n    B --> F[\"f.writelines(list)\nmultiple strings\"]\n    C --> G[\"Safe for logs\npreserves existing\"]\n    D --> H[\"Safe create\nno accidental overwrite\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "'w' overwrites immediately on open — use 'a' to preserve existing content",
      "code": "# write() — must include \\n manually\nwith open(\"output.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"First line\\n\")\n    f.write(\"Second line\\n\")\n    f.write(\"Third line\\n\")\n\n# writelines() — write a list of strings\nlines = [\"Alice,92\\n\", \"Bob,78\\n\", \"Carol,85\\n\"]\nwith open(\"scores.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.writelines(lines)\n\n# Append mode — adds to end, preserves existing\nwith open(\"log.txt\", \"a\", encoding=\"utf-8\") as f:\n    f.write(\"2025-01-15 10:30: User logged in\\n\")\n\nwith open(\"log.txt\", \"a\", encoding=\"utf-8\") as f:\n    f.write(\"2025-01-15 10:45: User logged out\\n\")\n\n# Exclusive create — fails if file exists\nimport os\ntry:\n    with open(\"new_file.txt\", \"x\", encoding=\"utf-8\") as f:\n        f.write(\"Created fresh\\n\")\nexcept FileExistsError:\n    print(\"File already exists — not overwritten\")\n\n# Write mode danger — overwrites immediately!\nwith open(\"important.txt\", \"w\") as f:\n    pass   # file is now empty — even without writing!\n\n# Generate report\ndata = [(\"Alice\", 92), (\"Bob\", 78), (\"Carol\", 85)]\nwith open(\"report.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"Score Report\\n\")\n    f.write(\"=\" * 20 + \"\\n\")\n    for name, score in data:\n        f.write(f\"{name}: {score}\\n\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Opening a file with `'w'` destroys all existing content immediately — even before you call `write()`. `with open('data.txt', 'w') as f: pass` empties the file completely. If you need to preserve existing content, use `'a'` (append) or read the content first, modify it, then write it back."
      },
      "keyPoints": [
        "write() writes a string — newlines must be included explicitly",
        "writelines() writes an iterable of strings — no automatic newlines between items",
        "'w' mode overwrites the entire file on open — existing content is lost immediately",
        "'a' mode appends to the end — existing content is always preserved",
        "'x' mode creates exclusively — raises FileExistsError if the file already exists"
      ],
      "tryIt": "Build a simple logger: write a function log(message, filename='app.log') that appends a timestamped line to the log file. Call it 5 times with different messages. Then read and print the log file. Finally, write a separate function clear_log(filename) that safely clears the log only if it exists."
    }
  },

  {
    "id": 1022,
    "moduleId": 10,
    "moduleTitle": "File Handling",
    "title": "The with Statement",
    "type": "lesson",
    "content": {
      "body": "The `with` statement is Python's context manager protocol. For file handling it guarantees the file is closed — even if an exception occurs inside the block. It is not just a convenience; it is the correct way to handle files in Python.\n\n## How It Works\n\nThe `with` statement calls `__enter__()` on entry and `__exit__()` on exit — whether the block completes normally or raises an exception. For file objects, `__exit__()` closes the file and flushes any buffered data.\n\n```python\nwith open(\"file.txt\", \"r\") as f:\n    data = f.read()\n# f is closed here — guaranteed\n```\n\n## Multiple Files in One with Block\n\nPython allows opening multiple files in a single `with` statement, separated by commas. This is cleaner than nesting two `with` blocks.\n\n```python\nwith open(\"input.txt\") as fin, open(\"output.txt\", \"w\") as fout:\n    fout.write(fin.read())\n```\n\n## Why Not Manual close()?\n\nManual `close()` is skipped if an exception is raised before it. The file stays open, buffered writes may be lost, and the file handle leaks. The `with` statement eliminates this entire class of bugs.\n\n## Context Managers Beyond Files\n\nThe `with` statement works with any object that implements the context manager protocol — database connections, network sockets, locks, and more. The pattern is always the same: acquire on entry, release on exit.",
      "diagram": "flowchart TD\n    A[\"with open() as f:\"] --> B[\"__enter__()\nopen file\"]\n    B --> C[\"Execute block\"]\n    C --> D{\"Exception?\"}\n    D -->|\"No\"| E[\"__exit__()\nclose + flush\"]\n    D -->|\"Yes\"| F[\"__exit__()\nclose + flush\nthen re-raise\"]\n    E --> G[\"Continue\"]\n    F --> H[\"Exception propagates\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "with guarantees __exit__ runs — file is always closed whether the block succeeds or fails",
      "code": "# Basic with — file closed automatically\nwith open(\"data.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"Hello, World!\\n\")\n# f.closed is True here\n\n# Exception inside with — file still closed\ntry:\n    with open(\"data.txt\", \"r\", encoding=\"utf-8\") as f:\n        content = f.read()\n        raise ValueError(\"Something went wrong\")\nexcept ValueError:\n    pass\nprint(f.closed)   # True — closed despite the exception\n\n# Multiple files in one with block\nwith open(\"input.txt\", \"w\", encoding=\"utf-8\") as fin:\n    fin.write(\"line1\\nline2\\nline3\\n\")\n\nwith open(\"input.txt\", \"r\", encoding=\"utf-8\") as fin,      open(\"output.txt\", \"w\", encoding=\"utf-8\") as fout:\n    for line in fin:\n        fout.write(line.upper())\n\n# Read the result\nwith open(\"output.txt\", \"r\", encoding=\"utf-8\") as f:\n    print(f.read())\n\n# Context managers beyond files\nimport threading\nlock = threading.Lock()\nwith lock:\n    # lock acquired on entry, released on exit\n    print(\"Thread-safe operation\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use the multi-file `with` syntax for copy operations: `with open(src) as fin, open(dst, 'w') as fout`. It is cleaner than nested `with` blocks and guarantees both files are closed. For very long `with` lines, use a backslash continuation or parentheses to wrap across multiple lines."
      },
      "keyPoints": [
        "with open() guarantees the file is closed even if an exception occurs",
        "Manual close() is skipped on exceptions — with eliminates this bug entirely",
        "Multiple files: with open(a) as fa, open(b) as fb — both closed on exit",
        "The with statement works with any context manager — not just files",
        "f.closed is True after the with block — you can verify this"
      ],
      "tryIt": "Write a file copy function copy_file(src, dst) using a single with statement opening both files. Test it by copying a text file and verifying the contents match. Then deliberately raise an exception inside the with block and confirm both files are closed afterwards by checking .closed on each handle."
    }
  },

  {
    "id": 1023,
    "moduleId": 10,
    "moduleTitle": "File Handling",
    "title": "Working with JSON",
    "type": "lesson",
    "content": {
      "body": "JSON (JavaScript Object Notation) is the universal format for data exchange. APIs return JSON. Configuration files use JSON. Databases export JSON. Python's `json` module makes reading and writing JSON trivial — and maps JSON types directly to Python types.\n\n## JSON ↔ Python Type Mapping\n\n| JSON | Python |\n|---|---|\n| object `{}` | dict |\n| array `[]` | list |\n| string | str |\n| number | int or float |\n| true/false | True/False |\n| null | None |\n\n## The Four Key Functions\n\n**`json.loads(string)`** — parse a JSON string into a Python object (\"load string\")\n\n**`json.dumps(obj)`** — convert a Python object to a JSON string (\"dump string\")\n\n**`json.load(file)`** — read JSON from a file object\n\n**`json.dump(obj, file)`** — write a Python object as JSON to a file object\n\n## Pretty Printing\n\n`json.dumps(obj, indent=2)` formats the output with indentation — essential for human-readable config files and debugging.\n\n## Handling Non-Serialisable Types\n\nNot all Python objects serialise to JSON. `datetime`, custom classes, and `set` raise `TypeError`. Convert them to strings or dicts before serialising, or use a custom encoder.",
      "diagram": "flowchart LR\n    A[\"Python object\ndict list str int\"] --> B[\"json.dumps()\njson.dump()\"]\n    B --> C[\"JSON string\nor file\"]\n    C --> D[\"json.loads()\njson.load()\"]\n    D --> E[\"Python object\ndict list str int\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "json.dumps/dump converts Python to JSON; json.loads/load converts JSON to Python",
      "code": "import json\n\n# Python object to JSON string\ndata = {\n    \"name\": \"Alice\",\n    \"age\": 30,\n    \"scores\": [92, 85, 78],\n    \"active\": True,\n    \"address\": None,\n}\n\njson_str = json.dumps(data)\nprint(json_str)\n\n# Pretty print with indent\npretty = json.dumps(data, indent=2)\nprint(pretty)\n\n# JSON string to Python object\nraw = '{\"name\": \"Bob\", \"age\": 25, \"scores\": [88, 91]}'\nparsed = json.loads(raw)\nprint(parsed[\"name\"])    # Bob\nprint(type(parsed))      # dict\n\n# Write JSON to file\nwith open(\"data.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(data, f, indent=2)\n\n# Read JSON from file\nwith open(\"data.json\", \"r\", encoding=\"utf-8\") as f:\n    loaded = json.load(f)\nprint(loaded[\"scores\"])   # [92, 85, 78]\n\n# Non-serialisable types\nfrom datetime import datetime\nrecord = {\"name\": \"Alice\", \"created\": datetime.now()}\n# json.dumps(record)   # TypeError!\nrecord[\"created\"] = record[\"created\"].isoformat()   # convert first\nprint(json.dumps(record))",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Remember the four functions as two pairs: `loads`/`dumps` work with strings (the 's' stands for string), `load`/`dump` work with file objects. Always use `indent=2` when writing JSON files that humans will read — unindented JSON is valid but nearly impossible to debug."
      },
      "keyPoints": [
        "json.loads() parses a JSON string; json.dumps() converts Python to a JSON string",
        "json.load() reads from a file; json.dump() writes to a file",
        "JSON objects become dicts, arrays become lists, null becomes None, true/false become True/False",
        "Use indent=2 in json.dumps/dump for human-readable output",
        "datetime, set, and custom classes are not JSON-serialisable — convert them first"
      ],
      "tryIt": "Write a simple contact book that saves to and loads from a JSON file. Implement save_contacts(contacts, filename) and load_contacts(filename) functions. Add three contacts as dicts, save them, reload them, add a fourth, and save again. Verify the file contains all four contacts with proper formatting."
    }
  },

  {
    "id": 1024,
    "moduleId": 10,
    "moduleTitle": "File Handling",
    "title": "Working with CSV",
    "type": "lesson",
    "content": {
      "body": "CSV (Comma-Separated Values) is the most common format for tabular data — spreadsheets, database exports, and data science datasets. Python's `csv` module handles the complexities of CSV parsing (quoted fields, embedded commas, different delimiters) that make manual string splitting unreliable.\n\n## Why Not Just split(',')?\n\nCSV fields can contain commas inside quotes: `\"Smith, John\",42,\"London, UK\"`. A naive `split(',')` breaks this into five fields instead of three. The `csv` module handles quoting, escaping, and different line endings correctly.\n\n## csv.reader and csv.writer\n\n**`csv.reader(file)`** — iterates over rows as lists of strings.\n\n**`csv.writer(file)`** — writes rows from lists.\n\n## csv.DictReader and csv.DictWriter\n\n**`csv.DictReader(file)`** — iterates over rows as dicts, using the first row as field names. This is the preferred approach — field names make the code self-documenting.\n\n**`csv.DictWriter(file, fieldnames)`** — writes rows from dicts.\n\n## Common Options\n\n- `delimiter` — change the separator (e.g. `delimiter=';'` for European CSVs)\n- `quotechar` — character used for quoting (default `\"``)\n- `newline=''` — required when opening CSV files on Windows to avoid blank lines",
      "diagram": "flowchart TD\n    A[\"CSV file\"] --> B[\"csv.reader\nrows as lists\"]\n    A --> C[\"csv.DictReader\nrows as dicts\"]\n    D[\"Python data\"] --> E[\"csv.writer\nwrite lists\"]\n    D --> F[\"csv.DictWriter\nwrite dicts\"]\n    C --> G[\"row['name']\nself-documenting\"]\n    B --> H[\"row[0]\nindex-based\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "DictReader and DictWriter are preferred — field names make code self-documenting",
      "code": "import csv\n\n# Write CSV with csv.writer\nrows = [\n    [\"name\", \"age\", \"city\"],\n    [\"Alice\", 30, \"London\"],\n    [\"Bob\", 25, \"Paris\"],\n    [\"Carol\", 35, \"Berlin\"],\n]\nwith open(\"people.csv\", \"w\", newline=\"\", encoding=\"utf-8\") as f:\n    writer = csv.writer(f)\n    writer.writerows(rows)\n\n# Read CSV with csv.reader\nwith open(\"people.csv\", \"r\", encoding=\"utf-8\") as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(row)   # ['Alice', '30', 'London'] — all strings!\n\n# Write CSV with DictWriter — preferred\npeople = [\n    {\"name\": \"Alice\", \"age\": 30, \"city\": \"London\"},\n    {\"name\": \"Bob\",   \"age\": 25, \"city\": \"Paris\"},\n]\nwith open(\"people2.csv\", \"w\", newline=\"\", encoding=\"utf-8\") as f:\n    writer = csv.DictWriter(f, fieldnames=[\"name\", \"age\", \"city\"])\n    writer.writeheader()\n    writer.writerows(people)\n\n# Read CSV with DictReader — preferred\nwith open(\"people2.csv\", \"r\", encoding=\"utf-8\") as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        print(f\"{row['name']} is {row['age']} from {row['city']}\")\n\n# Convert age from string to int\nwith open(\"people2.csv\", \"r\", encoding=\"utf-8\") as f:\n    people = [\n        {**row, \"age\": int(row[\"age\"])}\n        for row in csv.DictReader(f)\n    ]\nprint(people[0][\"age\"] + 1)   # 31 — now an int",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "CSV values are always read as strings — even numbers. `row['age']` gives `'30'`, not `30`. Always convert numeric fields explicitly: `int(row['age'])` or `float(row['price'])`. Also always open CSV files with `newline=''` on Windows — without it, Python adds an extra blank line between each row."
      },
      "keyPoints": [
        "Never use split(',') for CSV — use the csv module to handle quoted fields correctly",
        "DictReader reads rows as dicts using the header row as field names — preferred approach",
        "DictWriter writes dicts — call writeheader() before writerows()",
        "All CSV values are strings — convert numeric fields explicitly with int() or float()",
        "Always open CSV files with newline='' to avoid blank line issues on Windows"
      ],
      "tryIt": "Download or create a CSV file with at least 5 rows of student data (name, score, grade). Use DictReader to read it, convert scores to integers, calculate the class average, find the top scorer, and write a new CSV containing only the passing students (score >= 50) with an added 'status' column."
    }
  },

  {
    "id": 1025,
    "moduleId": 10,
    "moduleTitle": "File Handling",
    "title": "File Paths and os.path",
    "type": "lesson",
    "content": {
      "body": "File paths are how your program locates files on disk. Getting paths wrong is one of the most common sources of file handling bugs — especially when code runs on different operating systems or from different working directories.\n\n## Absolute vs Relative Paths\n\nAn **absolute path** starts from the root of the filesystem: `/Users/alice/data/file.txt` on macOS/Linux, `C:\\Users\\Alice\\data\\file.txt` on Windows.\n\nA **relative path** is relative to the current working directory: `data/file.txt` means \"look in the data folder inside wherever the script is running from\".\n\n## pathlib — The Modern Approach\n\nPython 3.4+ includes `pathlib`, which treats paths as objects rather than strings. It handles OS differences automatically and is the recommended approach for new code.\n\n```python\nfrom pathlib import Path\np = Path(\"data\") / \"file.txt\"   # works on all platforms\n```\n\n## os.path — The Classic Approach\n\n`os.path` provides functions for path manipulation. Still widely used and worth knowing for reading existing code.\n\n## Key Operations\n\n- **Join paths** — `Path(\"data\") / \"file.txt\"` or `os.path.join(\"data\", \"file.txt\")`\n- **Check existence** — `Path(\"file.txt\").exists()`\n- **Get filename** — `Path(\"/data/file.txt\").name` → `\"file.txt\"`\n- **Get directory** — `Path(\"/data/file.txt\").parent` → `Path(\"/data\")`\n- **Get extension** — `Path(\"file.txt\").suffix` → `\".txt\"`\n- **Create directories** — `Path(\"new/dir\").mkdir(parents=True, exist_ok=True)`",
      "diagram": "flowchart TD\n    A[\"File Path\"] --> B[\"Absolute\n/home/user/data/file.txt\"]\n    A --> C[\"Relative\ndata/file.txt\"]\n    D[\"pathlib.Path\"] --> E[\"Path('data') / 'file.txt'\ncross-platform join\"]\n    D --> F[\".exists() .name\n.parent .suffix\"]\n    D --> G[\".mkdir(parents=True)\ncreate directories\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166634",
      "diagramCaption": "Use pathlib.Path for new code — it handles OS differences and is more readable than os.path",
      "code": "from pathlib import Path\nimport os\n\n# pathlib — modern approach\np = Path(\"data\") / \"reports\" / \"summary.txt\"\nprint(p)           # data/reports/summary.txt\nprint(p.name)      # summary.txt\nprint(p.stem)      # summary\nprint(p.suffix)    # .txt\nprint(p.parent)    # data/reports\n\n# Check existence\nif p.exists():\n    print(\"File found\")\nelse:\n    print(\"File not found\")\n\n# Create directories safely\noutput_dir = Path(\"output\") / \"2025\"\noutput_dir.mkdir(parents=True, exist_ok=True)\n\n# Write and read using Path\nconfig = Path(\"config.json\")\nconfig.write_text('{\"debug\": true}', encoding=\"utf-8\")\nprint(config.read_text(encoding=\"utf-8\"))\n\n# List files in a directory\nfor f in Path(\".\").iterdir():\n    if f.is_file() and f.suffix == \".txt\":\n        print(f.name)\n\n# os.path — classic approach (still common in existing code)\npath = os.path.join(\"data\", \"file.txt\")\nprint(os.path.exists(path))\nprint(os.path.basename(path))   # file.txt\nprint(os.path.dirname(path))    # data\nprint(os.path.splitext(path))   # ('data/file', '.txt')\n\n# Current working directory\nprint(Path.cwd())        # pathlib\nprint(os.getcwd())       # os",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Never hardcode path separators. `'data/file.txt'` works on macOS/Linux but `'data\\\\file.txt'` breaks on macOS. Use `Path('data') / 'file.txt'` — the `/` operator on Path objects works correctly on all platforms. This is the single most important habit for writing portable file-handling code."
      },
      "keyPoints": [
        "Absolute paths start from the filesystem root; relative paths start from the working directory",
        "pathlib.Path is the modern approach — use / to join paths cross-platform",
        "Path.exists(), .name, .parent, .suffix cover most path inspection needs",
        "mkdir(parents=True, exist_ok=True) creates nested directories safely",
        "Never hardcode path separators — use Path() / 'subdir' for portability"
      ],
      "tryIt": "Write a function scan_directory(path, extension) that returns a list of all files with the given extension in a directory and all its subdirectories. Use pathlib.Path and the .rglob() method. Test it by scanning for all .txt files in a directory you create with a few nested subdirectories."
    }
  },

  {
    "id": 1026,
    "moduleId": 10,
    "moduleTitle": "File Handling",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "File handling bugs range from immediate crashes to silent data corruption. Most come from a small set of patterns that are easy to avoid once you know them.\n\n## Mistake 1 — Not Using with\n\nManual `open()` without `with` leaves files open if an exception occurs. Buffered writes may be lost. Always use `with open()`.\n\n## Mistake 2 — Opening with 'w' When You Meant 'a'\n\nMode `'w'` destroys all existing content immediately on open — before any write calls. If you meant to add to a file, use `'a'`. This is silent data loss with no error message.\n\n## Mistake 3 — Forgetting to Strip Newlines\n\n`readline()` and iterating over a file include the trailing `\\n`. Comparing `line == \"hello\"` fails when `line` is actually `\"hello\\n\"`. Always call `.strip()` or `.rstrip()` before comparing or processing.\n\n## Mistake 4 — CSV Values Are Always Strings\n\n`csv.reader` and `csv.DictReader` return all values as strings. `row['age'] + 1` raises `TypeError`. Always convert numeric fields explicitly.\n\n## Mistake 5 — Hardcoded Path Separators\n\n`\"data\\\\file.txt\"` breaks on macOS. `\"data/file.txt\"` breaks on some Windows configurations. Use `pathlib.Path` or `os.path.join()` for portable paths.\n\n## Mistake 6 — Reading a Large File with read()\n\n`f.read()` loads the entire file into memory. A 2GB log file crashes your program. Use line-by-line iteration for large files.",
      "diagram": "flowchart TD\n    A[\"File Mistakes\"] --> B[\"No with\nfile stays open\"]\n    A --> C[\"'w' not 'a'\nsilent data loss\"]\n    A --> D[\"No strip()\nnewline in comparison\"]\n    A --> E[\"CSV strings\nTypeError on arithmetic\"]\n    A --> F[\"Hardcoded separator\nbreaks on other OS\"]\n    A --> G[\"read() on large file\nMemoryError\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Silent data loss from 'w' mode and missing strip() are the hardest bugs to notice",
      "code": "# Mistake 1 — no with\n# f = open(\"data.txt\")\n# data = f.read()\n# if something_fails(): ...  # f never closed!\n# Fix:\nwith open(\"data.txt\", \"w\") as f:\n    f.write(\"test\")\n\n# Mistake 2 — 'w' destroys content\nwith open(\"log.txt\", \"w\") as f:\n    f.write(\"Entry 1\\n\")\nwith open(\"log.txt\", \"w\") as f:   # Entry 1 is GONE!\n    f.write(\"Entry 2\\n\")\n# Fix: use 'a'\nwith open(\"log.txt\", \"a\") as f:\n    f.write(\"Entry 3\\n\")\n\n# Mistake 3 — forgetting strip()\nwith open(\"data.txt\", \"w\") as f:\n    f.write(\"hello\\n\")\nwith open(\"data.txt\") as f:\n    line = f.readline()\n    print(line == \"hello\")         # False — it's \"hello\\n\"\n    print(line.strip() == \"hello\") # True\n\n# Mistake 4 — CSV strings\nimport csv, io\ncsv_data = \"name,age\\nAlice,30\\n\"\nreader = csv.DictReader(io.StringIO(csv_data))\nrow = next(reader)\n# print(row[\"age\"] + 1)   # TypeError!\nprint(int(row[\"age\"]) + 1)   # 31\n\n# Mistake 5 — hardcoded separator\n# bad = \"data\\file.txt\"   # breaks on macOS\nfrom pathlib import Path\ngood = Path(\"data\") / \"file.txt\"   # works everywhere\n\n# Mistake 6 — read() on large file\n# with open(\"huge.log\") as f:\n#     content = f.read()   # loads entire file!\n# Fix: iterate line by line\nwith open(\"data.txt\") as f:\n    for line in f:\n        process = line.strip()",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "The 'w' mode data loss bug is particularly dangerous because it is completely silent — no error, no warning, just gone. Before opening any file with 'w', ask yourself: does this file already exist and do I care about its contents? If yes, use 'a' or read-modify-write instead."
      },
      "keyPoints": [
        "Always use with open() — manual close() is skipped on exceptions",
        "'w' destroys existing content immediately on open — use 'a' to preserve",
        "Always strip() lines read from files before comparing or processing",
        "CSV values are always strings — convert numeric fields with int() or float()",
        "Use pathlib.Path for portable paths — never hardcode separators"
      ],
      "tryIt": "Find and fix all six bugs: (1) open without with, (2) 'w' used where 'a' was intended, (3) line comparison without strip(), (4) CSV age used in arithmetic without conversion, (5) hardcoded backslash path separator, (6) f.read() on a file that should be processed line by line."
    }
  },

  {
    "id": 1027,
    "moduleId": 10,
    "moduleTitle": "File Handling",
    "title": "Module 10 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered file handling — the bridge between your Python programs and persistent storage. You can now read, write, and process text files, JSON data, and CSV spreadsheets reliably and portably.\n\n## What You Learned\n\n**File lifecycle** — open → read/write → close. Always use `with open()` to guarantee the file is closed even on exceptions.\n\n**Reading** — `read()` for small files, line-by-line iteration for large ones. `readline()` for one line at a time. Always specify `encoding='utf-8'`. Always `.strip()` lines before processing.\n\n**Writing** — `write()` for single strings, `writelines()` for iterables. Mode `'w'` overwrites immediately; `'a'` appends safely; `'x'` creates exclusively.\n\n**The with statement** — guarantees `__exit__()` runs whether the block succeeds or fails. Open multiple files in one `with` block with commas.\n\n**JSON** — `json.load()`/`json.dump()` for files, `json.loads()`/`json.dumps()` for strings. Use `indent=2` for readable output. Convert non-serialisable types before dumping.\n\n**CSV** — use the `csv` module, never `split(',')`. `DictReader`/`DictWriter` are preferred. All values are strings — convert numeric fields explicitly. Open with `newline=''`.\n\n**Paths** — use `pathlib.Path` for portable, readable path handling. Never hardcode separators. Use `mkdir(parents=True, exist_ok=True)` to create directories safely.\n\n## What Is Coming Next\n\nModule 11 introduces **error handling** — `try`/`except`/`finally`, raising exceptions, and writing robust programs that handle unexpected input and failures gracefully.",
      "diagram": "flowchart TD\n    A[\"✅ File lifecycle\nopen read/write close\"] --> B[\"✅ Reading\nread readline iterate\"]\n    B --> C[\"✅ Writing\nwrite writelines modes\"]\n    C --> D[\"✅ with statement\nauto-close guarantee\"]\n    D --> E[\"✅ JSON\nload dump loads dumps\"]\n    E --> F[\"✅ CSV\nDictReader DictWriter\"]\n    F --> G[\"✅ Paths\npathlib os.path\"]\n    G --> H[\"➡️ Error Handling\nModule 11\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 10 complete — file handling connects your programs to the real world",
      "code": "import json, csv\nfrom pathlib import Path\n\ndef process_student_data(input_csv, output_json, report_txt):\n    \"\"\"Read CSV, analyse, write JSON summary and text report.\"\"\"\n    data_dir = Path(input_csv).parent\n    data_dir.mkdir(parents=True, exist_ok=True)\n\n    # Read CSV\n    students = []\n    with open(input_csv, \"r\", newline=\"\", encoding=\"utf-8\") as f:\n        for row in csv.DictReader(f):\n            students.append({\n                \"name\": row[\"name\"],\n                \"score\": int(row[\"score\"]),\n            })\n\n    if not students:\n        return\n\n    scores = [s[\"score\"] for s in students]\n    summary = {\n        \"total\": len(students),\n        \"average\": round(sum(scores) / len(scores), 1),\n        \"highest\": max(scores),\n        \"lowest\": min(scores),\n        \"passing\": sum(1 for s in scores if s >= 50),\n    }\n\n    # Write JSON summary\n    with open(output_json, \"w\", encoding=\"utf-8\") as f:\n        json.dump(summary, f, indent=2)\n\n    # Write text report\n    with open(report_txt, \"w\", encoding=\"utf-8\") as f:\n        f.write(\"Student Report\\n\" + \"=\" * 30 + \"\\n\")\n        for k, v in summary.items():\n            f.write(f\"{k}: {v}\\n\")\n\n    return summary",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Before moving on, make sure you can write a complete read-process-write pipeline from memory: read a CSV with DictReader, process the data, and write results as both JSON and a text report. If you can do that without looking anything up, you have genuinely mastered Module 10."
      },
      "keyPoints": [
        "Always use with open() — it guarantees the file closes even on exceptions",
        "'w' overwrites immediately — use 'a' to preserve existing content",
        "Always strip() lines and convert CSV numeric fields explicitly",
        "json.load/dump for files, json.loads/dumps for strings — indent=2 for readability",
        "Use pathlib.Path for portable paths — never hardcode separators"
      ],
      "tryIt": "From memory, write a complete pipeline: read a JSON file containing a list of products (name, price, stock), filter out out-of-stock items, calculate the total value of in-stock inventory, and write the results to both a CSV file and a summary JSON file. Use pathlib for all paths."
    }
  },

  {
    "id": 1028,
    "moduleId": 11,
    "moduleTitle": "Error Handling",
    "title": "What Are Exceptions?",
    "type": "lesson",
    "content": {
      "body": "An exception is an event that disrupts the normal flow of a program. When Python encounters an error it cannot handle — dividing by zero, accessing a missing key, opening a file that does not exist — it raises an exception. If nothing catches it, the program crashes and prints a traceback.\n\n## Errors vs Exceptions\n\nIn Python, almost everything that goes wrong is an exception. The distinction between \"errors\" and \"exceptions\" is mostly informal — technically they are all exception objects. `SyntaxError` is raised before the program runs; all others are raised at runtime.\n\n## The Exception Hierarchy\n\nAll exceptions inherit from `BaseException`. Most inherit from `Exception`, which is the base class you should catch and raise in your own code. `SystemExit`, `KeyboardInterrupt`, and `GeneratorExit` inherit directly from `BaseException` — catching `Exception` does not catch these, which is intentional.\n\n## Common Built-in Exceptions\n\n- `ValueError` — right type, wrong value: `int(\"hello\")`\n- `TypeError` — wrong type: `\"hello\" + 5`\n- `KeyError` — missing dict key: `d[\"missing\"]`\n- `IndexError` — index out of range: `items[99]`\n- `AttributeError` — missing attribute: `None.upper()`\n- `FileNotFoundError` — file does not exist\n- `ZeroDivisionError` — division by zero\n- `NameError` — undefined variable\n\n## Why Handle Exceptions?\n\nUnhandled exceptions crash your program. Handled exceptions let you recover gracefully, show helpful messages, log the error, and continue running.",
      "diagram": "flowchart TD\n    A[\"BaseException\"] --> B[\"Exception\nmost errors\"]\n    A --> C[\"SystemExit\nKeyboardInterrupt\nGeneratorExit\"]\n    B --> D[\"ValueError\nTypeError\nKeyError\"]\n    B --> E[\"IndexError\nAttributeError\nNameError\"]\n    B --> F[\"FileNotFoundError\nZeroDivisionError\nIOError\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Catch Exception for most errors — SystemExit and KeyboardInterrupt should not be caught",
      "code": "# Each of these raises a different exception\n# Run them one at a time to see the traceback\n\n# ValueError — right type, wrong value\n# int(\"hello\")\n\n# TypeError — wrong type\n# \"hello\" + 5\n\n# KeyError — missing dict key\n# d = {\"a\": 1}; d[\"b\"]\n\n# IndexError — out of range\n# items = [1, 2, 3]; items[10]\n\n# AttributeError — missing attribute\n# None.upper()\n\n# ZeroDivisionError\n# 10 / 0\n\n# NameError — undefined variable\n# print(undefined_var)\n\n# FileNotFoundError\n# open(\"nonexistent.txt\")\n\n# Reading a traceback — bottom up\n# Traceback (most recent call last):\n#   File \"script.py\", line 3, in <module>\n#     result = 10 / 0\n# ZeroDivisionError: division by zero\n#\n# Read: error type first (ZeroDivisionError)\n# Then: which line caused it (line 3)\n# Then: what the line was (10 / 0)\n\nprint(\"All exceptions inherit from BaseException\")\nprint(issubclass(ValueError, Exception))    # True\nprint(issubclass(KeyError, Exception))      # True\nprint(issubclass(SystemExit, Exception))    # False",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Always read tracebacks from the bottom up. The last line tells you the exception type and message — that is what went wrong. The lines above show the call stack — how the program got there. Fix the bottom line first, then re-run."
      },
      "keyPoints": [
        "Exceptions are objects raised when Python encounters an error it cannot handle",
        "All catchable exceptions inherit from Exception — SystemExit and KeyboardInterrupt do not",
        "Common exceptions: ValueError, TypeError, KeyError, IndexError, AttributeError, FileNotFoundError",
        "Unhandled exceptions crash the program and print a traceback",
        "Read tracebacks bottom-up — the last line is the actual error"
      ],
      "tryIt": "Deliberately trigger six different exception types: ValueError, TypeError, KeyError, IndexError, ZeroDivisionError, and FileNotFoundError. For each one, read the traceback carefully and identify: the exception type, the line number, and the exact cause. Write a one-sentence explanation of each."
    }
  },

  {
    "id": 1029,
    "moduleId": 11,
    "moduleTitle": "Error Handling",
    "title": "try / except",
    "type": "lesson",
    "content": {
      "body": "The `try`/`except` block is how you catch and handle exceptions. Code that might raise an exception goes in the `try` block. Code that handles the exception goes in the `except` block.\n\n## Syntax\n\n```python\ntry:\n    # code that might raise\nexcept ExceptionType:\n    # code that runs if ExceptionType is raised\n```\n\nIf no exception is raised, the `except` block is skipped entirely. If an exception is raised, Python jumps immediately to the matching `except` block — any remaining code in the `try` block is skipped.\n\n## Catching the Exception Object\n\nUse `as e` to capture the exception object. This gives you access to the error message and other details.\n\n```python\nexcept ValueError as e:\n    print(f\"Invalid value: {e}\")\n```\n\n## Catching Exception (Base Class)\n\nCatching `Exception` catches almost all runtime errors. This is a broad catch — use it only as a last resort or at the top level of your program. Prefer catching specific exception types so you handle each case appropriately.\n\n## Never Use Bare except\n\n`except:` without a type catches everything including `SystemExit` and `KeyboardInterrupt`. This prevents the user from stopping the program with Ctrl+C. Always specify at least `except Exception:`.",
      "diagram": "flowchart TD\n    A[\"try block\"] --> B{\"Exception\nraised?\"}\n    B -->|\"No\"| C[\"Skip except\ncontinue normally\"]\n    B -->|\"Yes — matches\"| D[\"except block\nhandle error\"]\n    B -->|\"Yes — no match\"| E[\"Propagate up\ncrash if uncaught\"]\n    D --> F[\"Continue after\ntry/except\"]\n    C --> F\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "try runs normally if no exception — except only runs when a matching exception is raised",
      "code": "# Basic try/except\ntry:\n    number = int(input(\"Enter a number: \"))\n    result = 100 / number\n    print(f\"Result: {result}\")\nexcept ValueError:\n    print(\"That is not a valid number\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero\")\n\n# Capture the exception object with 'as e'\ntry:\n    value = int(\"not a number\")\nexcept ValueError as e:\n    print(f\"Caught: {e}\")   # invalid literal for int()...\n\n# Catching Exception — broad catch\ntry:\n    data = {\"key\": \"value\"}\n    print(data[\"missing\"])\nexcept Exception as e:\n    print(f\"Something went wrong: {type(e).__name__}: {e}\")\n\n# Never use bare except — blocks Ctrl+C\n# try:\n#     ...\n# except:       # catches SystemExit, KeyboardInterrupt!\n#     pass\n\n# Safe input conversion pattern\ndef get_integer(prompt):\n    while True:\n        try:\n            return int(input(prompt))\n        except ValueError:\n            print(\"Please enter a whole number\")\n\n# Exception not raised — except block skipped\ntry:\n    x = int(\"42\")   # valid — no exception\n    print(f\"Got: {x}\")\nexcept ValueError:\n    print(\"This never runs\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never use a bare `except:` without specifying an exception type. It catches `SystemExit` and `KeyboardInterrupt`, which means the user cannot stop your program with Ctrl+C and `sys.exit()` stops working. Always use `except Exception:` at minimum, or better, catch specific exception types."
      },
      "keyPoints": [
        "try block contains code that might raise — except block handles the exception",
        "If no exception is raised, the except block is skipped entirely",
        "Use `as e` to capture the exception object and access its message",
        "Catch specific exception types — broad Exception catches are a last resort",
        "Never use bare except: — it catches SystemExit and KeyboardInterrupt"
      ],
      "tryIt": "Write a safe_divide(a, b) function that catches ZeroDivisionError and returns None instead of crashing. Write a safe_open(filename) function that catches FileNotFoundError and returns an empty string. Write a get_positive_int(prompt) function that keeps asking until the user enters a valid positive integer."
    }
  },

  {
    "id": 1030,
    "moduleId": 11,
    "moduleTitle": "Error Handling",
    "title": "Catching Multiple Exceptions",
    "type": "lesson",
    "content": {
      "body": "A single `try` block can have multiple `except` clauses, each handling a different exception type. Python checks them in order and runs the first one that matches. You can also catch multiple exception types in a single `except` clause using a tuple.\n\n## Multiple except Clauses\n\nEach `except` clause handles one specific exception type. This lets you respond differently to different errors — show a different message, take a different recovery action, or log different information.\n\n```python\ntry:\n    result = process(data)\nexcept ValueError:\n    print(\"Invalid data format\")\nexcept KeyError:\n    print(\"Missing required field\")\nexcept Exception as e:\n    print(f\"Unexpected error: {e}\")\n```\n\n## Catching Multiple Types in One Clause\n\nGroup exception types in a tuple when you want to handle them the same way:\n\n```python\nexcept (ValueError, TypeError) as e:\n    print(f\"Input error: {e}\")\n```\n\n## Order Matters\n\nPython checks `except` clauses top to bottom and runs the first match. More specific exceptions must come before more general ones. If you put `except Exception` first, it catches everything and the specific clauses below it are never reached.\n\n## The except Exception Fallback\n\nA final `except Exception as e` clause acts as a catch-all for anything not handled by the specific clauses above. This is the right place to log unexpected errors.",
      "diagram": "flowchart TD\n    A[\"Exception raised\"] --> B{\"except\nValueError?\"}\n    B -->|\"Match\"| C[\"Handle ValueError\"]\n    B -->|\"No match\"| D{\"except\nKeyError?\"}\n    D -->|\"Match\"| E[\"Handle KeyError\"]\n    D -->|\"No match\"| F{\"except\nException?\"}\n    F -->|\"Match\"| G[\"Handle anything else\"]\n    F -->|\"No match\"| H[\"Propagate — crash\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style H fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "except clauses are checked top to bottom — specific exceptions must come before general ones",
      "code": "# Multiple except clauses — different handling per type\ndef parse_record(data):\n    try:\n        name = data[\"name\"]\n        age = int(data[\"age\"])\n        score = float(data[\"score\"])\n        return {\"name\": name, \"age\": age, \"score\": score}\n    except KeyError as e:\n        print(f\"Missing field: {e}\")\n    except ValueError as e:\n        print(f\"Invalid value: {e}\")\n    except Exception as e:\n        print(f\"Unexpected: {type(e).__name__}: {e}\")\n    return None\n\nprint(parse_record({\"name\": \"Alice\", \"age\": \"30\", \"score\": \"92.5\"}))\nprint(parse_record({\"name\": \"Bob\", \"age\": \"thirty\"}))   # ValueError\nprint(parse_record({\"name\": \"Carol\"}))                   # KeyError\n\n# Catch multiple types in one clause\ndef safe_convert(value):\n    try:\n        return int(value)\n    except (ValueError, TypeError) as e:\n        print(f\"Cannot convert: {e}\")\n        return None\n\nprint(safe_convert(\"42\"))    # 42\nprint(safe_convert(\"abc\"))   # ValueError\nprint(safe_convert(None))    # TypeError\n\n# Order matters — specific before general\ntry:\n    x = int(\"bad\")\nexcept Exception:        # catches everything — ValueError never reached\n    print(\"General\")\nexcept ValueError:       # unreachable!\n    print(\"Specific\")\n\n# Correct order\ntry:\n    x = int(\"bad\")\nexcept ValueError:       # specific first\n    print(\"ValueError caught\")\nexcept Exception:        # fallback\n    print(\"Other error\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Always put specific exception types before general ones. `except Exception` before `except ValueError` means ValueError is never reached — Python matches the first clause that fits. Most linters will warn about unreachable except clauses, but the bug is silent at runtime."
      },
      "keyPoints": [
        "Multiple except clauses handle different exception types differently",
        "except (TypeError, ValueError) catches both types with the same handler",
        "Clauses are checked top to bottom — specific exceptions must come before general ones",
        "A final except Exception clause acts as a catch-all fallback",
        "Unreachable except clauses (general before specific) are silent bugs"
      ],
      "tryIt": "Write a function load_user(data) that parses a dict with name (str), age (int), and email (str containing @). Use separate except clauses for KeyError (missing field), ValueError (invalid age), and a catch-all Exception. Test with: valid data, missing field, invalid age, and a completely wrong input type."
    }
  },

  {
    "id": 1031,
    "moduleId": 11,
    "moduleTitle": "Error Handling",
    "title": "else and finally",
    "type": "lesson",
    "content": {
      "body": "The `try`/`except` block has two optional clauses that give you precise control over what runs in each scenario: `else` and `finally`.\n\n## else\n\nThe `else` clause runs only when the `try` block completes without raising any exception. It is the \"success path\" — code that should only run if everything worked.\n\n```python\ntry:\n    result = int(user_input)\nexcept ValueError:\n    print(\"Invalid input\")\nelse:\n    print(f\"Got: {result}\")   # only runs if no exception\n```\n\nWhy not just put the success code at the end of the `try` block? Because code in `else` is not protected by the `except` clause — if `else` raises an exception, it propagates normally. This makes the intent explicit: the `try` block is the risky part, `else` is the safe success path.\n\n## finally\n\nThe `finally` clause always runs — whether an exception was raised or not, whether it was caught or not. It is the cleanup clause: close connections, release locks, free resources.\n\n```python\ntry:\n    f = open(\"file.txt\")\n    data = f.read()\nexcept FileNotFoundError:\n    print(\"File missing\")\nfinally:\n    f.close()   # always runs\n```\n\n## Full Structure\n\n```python\ntry:      # risky code\nexcept:   # handle errors\nelse:     # success path\nfinally:  # always runs\n```",
      "diagram": "flowchart TD\n    A[\"try block\"] --> B{\"Exception?\"}\n    B -->|\"No\"| C[\"else block\nsuccess path\"]\n    B -->|\"Yes — caught\"| D[\"except block\"]\n    B -->|\"Yes — uncaught\"| E[\"Propagate\"]\n    C --> F[\"finally block\nalways runs\"]\n    D --> F\n    E --> F\n    F --> G[\"Continue or\nre-raise\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "else runs on success only; finally always runs — even if the exception is not caught",
      "code": "# else — success path\ndef parse_age(text):\n    try:\n        age = int(text)\n    except ValueError:\n        print(f\"'{text}' is not a valid age\")\n        return None\n    else:\n        if age < 0 or age > 150:\n            raise ValueError(f\"Age {age} is out of range\")\n        return age\n\nprint(parse_age(\"25\"))    # 25\nprint(parse_age(\"abc\"))   # invalid\nprint(parse_age(\"-5\"))    # raises ValueError from else\n\n# finally — cleanup always runs\ndef read_file(path):\n    f = None\n    try:\n        f = open(path, \"r\", encoding=\"utf-8\")\n        return f.read()\n    except FileNotFoundError:\n        print(f\"File not found: {path}\")\n        return None\n    finally:\n        if f:\n            f.close()\n            print(\"File closed\")   # always prints\n\nread_file(\"existing.txt\")\nread_file(\"missing.txt\")\n\n# finally runs even when exception is not caught\ndef risky():\n    try:\n        raise RuntimeError(\"boom\")\n    finally:\n        print(\"finally ran\")   # prints before crash\n\ntry:\n    risky()\nexcept RuntimeError:\n    print(\"caught outside\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "In practice, `finally` for file handling is replaced by `with open()` — the context manager does the same thing more cleanly. Use `finally` for resources that do not have a context manager: database connections you manage manually, network sockets, or locks. For everything else, prefer `with`."
      },
      "keyPoints": [
        "else runs only when the try block completes without any exception",
        "Code in else is not protected by except — exceptions there propagate normally",
        "finally always runs — whether an exception was raised, caught, or not caught",
        "finally is for cleanup: closing connections, releasing locks, freeing resources",
        "with statements replace finally for most resource cleanup — prefer with when available"
      ],
      "tryIt": "Write a function connect_and_query(host, query) that uses try/except/else/finally. In try: simulate a connection (raise ConnectionError if host is empty). In except: print the error. In else: print the query result. In finally: always print 'Connection closed'. Test with a valid host and an empty host."
    }
  },

  {
    "id": 1032,
    "moduleId": 11,
    "moduleTitle": "Error Handling",
    "title": "Raising Exceptions",
    "type": "lesson",
    "content": {
      "body": "You are not limited to catching exceptions — you can raise them yourself. Raising exceptions is how you signal that something has gone wrong in your own code, enforce preconditions, and communicate errors to callers.\n\n## raise\n\n`raise ExceptionType(\"message\")` raises an exception immediately. Execution stops at that point and Python looks for a matching `except` clause up the call stack.\n\n```python\ndef set_age(age):\n    if age < 0:\n        raise ValueError(f\"Age cannot be negative: {age}\")\n    self.age = age\n```\n\n## Choosing the Right Exception Type\n\nUse the most specific built-in exception that fits:\n- `ValueError` — right type, wrong value\n- `TypeError` — wrong type entirely\n- `RuntimeError` — something went wrong at runtime with no more specific type\n- `NotImplementedError` — method exists but is not implemented yet\n- `PermissionError` — operation not allowed\n\n## Re-raising\n\nInside an `except` block, bare `raise` re-raises the current exception without modifying it. This is useful when you want to log the error but still let it propagate.\n\n```python\nexcept Exception as e:\n    log_error(e)\n    raise   # re-raise unchanged\n```\n\n## raise from None\n\n`raise NewException(\"msg\") from None` suppresses the original exception context — useful when you want to present a clean error without exposing internal implementation details.",
      "diagram": "flowchart TD\n    A[\"raise ValueError('msg')\"] --> B[\"Exception object\ncreated\"]\n    B --> C[\"Unwind call stack\"]\n    C --> D{\"except clause\nfound?\"}\n    D -->|\"Yes\"| E[\"Handle it\"]\n    D -->|\"No\"| F[\"Program crashes\ntraceback printed\"]\n    G[\"bare raise\"] --> H[\"Re-raise current\nexception unchanged\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style H fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "raise signals an error to the caller — choose the most specific built-in exception type",
      "code": "# Basic raise\ndef divide(a, b):\n    if not isinstance(a, (int, float)):\n        raise TypeError(f\"Expected number, got {type(a).__name__}\")\n    if b == 0:\n        raise ValueError(\"Denominator cannot be zero\")\n    return a / b\n\ntry:\n    print(divide(10, 2))    # 5.0\n    print(divide(10, 0))    # ValueError\nexcept (TypeError, ValueError) as e:\n    print(f\"Error: {e}\")\n\n# NotImplementedError — placeholder\nclass Shape:\n    def area(self):\n        raise NotImplementedError(\"Subclasses must implement area()\")\n\n# Re-raise — log then propagate\nimport logging\ndef process(data):\n    try:\n        return int(data)\n    except ValueError as e:\n        logging.error(f\"Failed to process: {e}\")\n        raise   # re-raise unchanged\n\n# raise from None — clean error\ndef get_user(user_id):\n    try:\n        return database[user_id]\n    except KeyError:\n        raise ValueError(f\"User {user_id} not found\") from None\n\n# raise from — chain exceptions explicitly\ndef load_config(path):\n    try:\n        with open(path) as f:\n            return f.read()\n    except FileNotFoundError as e:\n        raise RuntimeError(f\"Config missing: {path}\") from e",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Use `raise ValueError` not `raise Exception` when the problem is a bad value. Use `raise TypeError` when the wrong type was passed. Specific exception types let callers catch exactly what they need to handle — catching `ValueError` is much more precise than catching `Exception`."
      },
      "keyPoints": [
        "raise ExceptionType('message') signals an error to the caller immediately",
        "Choose the most specific built-in exception type that fits the situation",
        "Bare raise inside except re-raises the current exception unchanged",
        "raise NewError() from original_error chains exceptions — preserves context",
        "raise NewError() from None suppresses the original context for clean errors"
      ],
      "tryIt": "Write a validate_password(password) function that raises ValueError with a specific message for each rule that fails: too short (< 8 chars), no digits, no uppercase letters. Write a register_user(username, password) function that calls validate_password and catches ValueError to return a dict with success=False and the error message."
    }
  },

  {
    "id": 1033,
    "moduleId": 11,
    "moduleTitle": "Error Handling",
    "title": "Custom Exception Classes",
    "type": "lesson",
    "content": {
      "body": "Built-in exceptions cover common cases, but real applications need domain-specific errors. Custom exception classes let you create a hierarchy of errors that are meaningful in your application's context — `InsufficientFundsError`, `InvalidEmailError`, `UserNotFoundError`.\n\n## Creating a Custom Exception\n\nInherit from `Exception` (or a more specific built-in). At minimum, just the class definition is enough:\n\n```python\nclass InsufficientFundsError(Exception):\n    pass\n```\n\n## Adding Context\n\nAdd an `__init__` to store extra information about the error:\n\n```python\nclass InsufficientFundsError(Exception):\n    def __init__(self, balance, amount):\n        self.balance = balance\n        self.amount = amount\n        super().__init__(f\"Need {amount}, have {balance}\")\n```\n\n## Exception Hierarchies\n\nGroup related exceptions under a common base class. Callers can catch the base class to handle all related errors, or catch specific subclasses for fine-grained handling.\n\n```python\nclass AppError(Exception): pass\nclass ValidationError(AppError): pass\nclass DatabaseError(AppError): pass\n```\n\n## When to Create Custom Exceptions\n\nCreate custom exceptions when:\n- The error is specific to your domain and no built-in fits\n- You need to attach extra data to the error\n- You want callers to be able to catch your errors specifically without catching everything",
      "diagram": "flowchart TD\n    A[\"Exception\"] --> B[\"AppError\nbase for all app errors\"]\n    B --> C[\"ValidationError\nbad input data\"]\n    B --> D[\"DatabaseError\nDB operation failed\"]\n    B --> E[\"AuthError\nauthentication failed\"]\n    C --> F[\"EmailValidationError\"]\n    C --> G[\"AgeValidationError\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Build a hierarchy — callers catch AppError for all errors or specific subclasses for fine-grained handling",
      "code": "# Simple custom exception\nclass ValidationError(Exception):\n    pass\n\n# Custom exception with extra data\nclass InsufficientFundsError(Exception):\n    def __init__(self, balance, amount):\n        self.balance = balance\n        self.amount = amount\n        super().__init__(\n            f\"Insufficient funds: need {amount:.2f}, have {balance:.2f}\"\n        )\n\n# Exception hierarchy\nclass AppError(Exception):\n    \"\"\"Base class for all application errors.\"\"\"\n    pass\n\nclass ValidationError(AppError):\n    def __init__(self, field, message):\n        self.field = field\n        super().__init__(f\"{field}: {message}\")\n\nclass NotFoundError(AppError):\n    def __init__(self, resource, identifier):\n        super().__init__(f\"{resource} '{identifier}' not found\")\n\n# Using custom exceptions\ndef withdraw(balance, amount):\n    if amount <= 0:\n        raise ValidationError(\"amount\", \"must be positive\")\n    if amount > balance:\n        raise InsufficientFundsError(balance, amount)\n    return balance - amount\n\ntry:\n    new_balance = withdraw(50.00, 75.00)\nexcept InsufficientFundsError as e:\n    print(f\"Transaction failed: {e}\")\n    print(f\"Short by: {e.amount - e.balance:.2f}\")\nexcept ValidationError as e:\n    print(f\"Invalid input — {e.field}: {e}\")\nexcept AppError as e:\n    print(f\"App error: {e}\")   # catches any AppError subclass",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Name custom exceptions with the `Error` suffix: `ValidationError`, `NotFoundError`, `InsufficientFundsError`. This is the Python convention — it makes it immediately clear that the class is an exception. Always inherit from `Exception` (not `BaseException`) unless you have a specific reason not to."
      },
      "keyPoints": [
        "Inherit from Exception to create a custom exception — a bare class body is enough",
        "Add __init__ to store extra context: field names, values, IDs",
        "Build a hierarchy with a common AppError base — callers catch at the right level",
        "Name exceptions with the Error suffix: ValidationError, NotFoundError",
        "Create custom exceptions when no built-in fits or when you need domain-specific context"
      ],
      "tryIt": "Build an exception hierarchy for a bank application: BankError (base), InsufficientFundsError (with balance and amount attributes), AccountNotFoundError (with account_id), and InvalidAmountError (with amount). Write deposit() and withdraw() functions that raise the appropriate exceptions. Write a transaction handler that catches each type and prints a specific message."
    }
  },

  {
    "id": 1034,
    "moduleId": 11,
    "moduleTitle": "Error Handling",
    "title": "Exception Chaining",
    "type": "lesson",
    "content": {
      "body": "When you catch one exception and raise another, Python automatically records the original exception as context. This is called exception chaining — it preserves the full history of what went wrong, which is invaluable for debugging.\n\n## Implicit Chaining\n\nWhen you raise inside an `except` block, Python automatically attaches the original exception as `__context__`:\n\n```python\ntry:\n    int(\"bad\")\nexcept ValueError:\n    raise RuntimeError(\"Processing failed\")\n# Traceback shows both exceptions\n```\n\nThe traceback reads: \"During handling of the above exception, another exception occurred.\"\n\n## Explicit Chaining with from\n\nUse `raise NewError() from original` to explicitly chain exceptions. This sets `__cause__` and produces a clearer traceback: \"The above exception was the direct cause of the following exception.\"\n\n```python\nexcept KeyError as e:\n    raise ValueError(f\"Missing field: {e}\") from e\n```\n\n## Suppressing Context with from None\n\n`raise NewError() from None` suppresses the original exception entirely. Use this when the original exception is an implementation detail you do not want to expose to callers.\n\n```python\nexcept KeyError:\n    raise UserNotFoundError(user_id) from None\n```\n\n## When to Use Each\n\n- **Implicit** — default, no extra code needed, full context preserved\n- **from e** — when the original exception is directly relevant to the new one\n- **from None** — when you want a clean public API without internal details leaking",
      "diagram": "flowchart TD\n    A[\"except ValueError as e:\"] --> B[\"raise RuntimeError()\nimplicit chaining\"]\n    A --> C[\"raise RuntimeError()\nfrom e\nexplicit chaining\"]\n    A --> D[\"raise RuntimeError()\nfrom None\nsuppress context\"]\n    B --> E[\"__context__ set\n'During handling...'\"]\n    C --> F[\"__cause__ set\n'Direct cause of...'\"]\n    D --> G[\"No context shown\nclean traceback\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#e2e8f0,stroke:#94a3b8,color:#1a1a1a",
      "diagramCaption": "from e makes the chain explicit; from None hides internal details from callers",
      "code": "# Implicit chaining — automatic\ndef parse_config(data):\n    try:\n        return {\"port\": int(data[\"port\"])}\n    except KeyError as e:\n        raise RuntimeError(f\"Config incomplete: missing {e}\")\n    # traceback shows both ValueError and RuntimeError\n\n# Explicit chaining with from\ndef load_user(user_id, db):\n    try:\n        return db[user_id]\n    except KeyError as e:\n        raise ValueError(f\"User {user_id} not found\") from e\n    # \"The above exception was the direct cause...\"\n\n# Suppress context with from None — clean public API\nclass UserNotFoundError(Exception):\n    pass\n\ndef get_user(user_id, db):\n    try:\n        return db[user_id]\n    except KeyError:\n        raise UserNotFoundError(f\"No user with id {user_id}\") from None\n    # Only UserNotFoundError shown — KeyError hidden\n\n# Accessing chained exceptions\ntry:\n    try:\n        int(\"bad\")\n    except ValueError as e:\n        raise RuntimeError(\"Processing failed\") from e\nexcept RuntimeError as e:\n    print(f\"Error: {e}\")\n    print(f\"Caused by: {e.__cause__}\")\n    print(f\"Context: {e.__context__}\")\n\n# Re-raise preserves full chain\ndef process(data):\n    try:\n        return int(data)\n    except ValueError:\n        raise   # re-raise — original traceback preserved",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use `raise NewError() from original` when wrapping low-level exceptions in higher-level ones — it makes the relationship explicit in the traceback. Use `from None` when the original exception is an implementation detail (like a KeyError from an internal dict) that callers should not see."
      },
      "keyPoints": [
        "Raising inside except automatically chains the original exception as __context__",
        "raise NewError() from e sets __cause__ — explicit, clearer traceback message",
        "raise NewError() from None suppresses the original — clean public API",
        "Bare raise re-raises the current exception with its full original traceback",
        "Access chained exceptions via e.__cause__ and e.__context__"
      ],
      "tryIt": "Write a data pipeline with three layers: parse_csv() that raises ValueError on bad data, transform() that catches ValueError and raises a ProcessingError from it, and run_pipeline() that catches ProcessingError and raises a PipelineError from None. Run it with bad data and observe how each chaining style affects the traceback."
    }
  },

  {
    "id": 1035,
    "moduleId": 11,
    "moduleTitle": "Error Handling",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Exception handling bugs are often subtle — the code runs but swallows errors silently, catches too broadly, or handles the wrong thing. These are the patterns that cause the most problems in real code.\n\n## Mistake 1 — Bare except\n\n`except:` without a type catches `SystemExit` and `KeyboardInterrupt`. The user cannot stop the program with Ctrl+C. Always specify at least `except Exception:`.\n\n## Mistake 2 — Catching Too Broadly\n\n`except Exception: pass` silently swallows all errors. The program continues as if nothing happened, but the data is wrong or the operation failed. Always do something meaningful in the except block — log, return a default, or re-raise.\n\n## Mistake 3 — Using Exceptions for Flow Control\n\nExceptions are for exceptional conditions — not for normal program logic. Using `try/except` to check whether a key exists (instead of `in` or `.get()`) is slower and harder to read.\n\n## Mistake 4 — Catching the Wrong Exception\n\nCatching `Exception` when you meant `ValueError`, or catching `ValueError` when the code actually raises `TypeError`. The except block never runs and the error propagates anyway.\n\n## Mistake 5 — Not Logging Before Re-raising\n\nRe-raising without logging loses the context. If the exception propagates to a top-level handler that only prints the message, you lose the stack trace and the original cause.\n\n## Mistake 6 — Mutable State Left Inconsistent\n\nIf an exception occurs halfway through modifying state, the object may be left in an inconsistent state. Use transactions, rollbacks, or copy-modify-replace patterns to keep state consistent.",
      "diagram": "flowchart TD\n    A[\"Exception Mistakes\"] --> B[\"Bare except\nblocks Ctrl+C\"]\n    A --> C[\"except: pass\nsilent failure\"]\n    A --> D[\"Exceptions for\nflow control\"]\n    A --> E[\"Wrong exception\ntype caught\"]\n    A --> F[\"No logging\nbefore re-raise\"]\n    A --> G[\"Inconsistent state\nafter partial update\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Silent exception swallowing is the most dangerous mistake — always do something in the except block",
      "code": "# Mistake 1 — bare except\n# try:\n#     risky()\n# except:        # catches SystemExit, KeyboardInterrupt!\n#     pass\n# Fix:\ntry:\n    int(\"bad\")\nexcept Exception:\n    print(\"Handled\")\n\n# Mistake 2 — silent swallow\n# try:\n#     result = process(data)\n# except Exception:\n#     pass   # data is wrong but program continues!\n# Fix: always do something\ntry:\n    result = int(\"bad\")\nexcept ValueError as e:\n    print(f\"Processing failed: {e}\")\n    result = None\n\n# Mistake 3 — exceptions for flow control\n# Slow and unreadable:\n# try:\n#     value = d[\"key\"]\n# except KeyError:\n#     value = \"default\"\n# Better:\nd = {\"a\": 1}\nvalue = d.get(\"key\", \"default\")\n\n# Mistake 4 — wrong exception type\ndef process(x):\n    return x.upper()   # raises AttributeError if x is None\n\ntry:\n    process(None)\nexcept ValueError:   # wrong type — never catches AttributeError!\n    print(\"This never runs\")\n# Fix: catch the right type\ntry:\n    process(None)\nexcept AttributeError as e:\n    print(f\"Caught: {e}\")\n\n# Mistake 5 — no logging before re-raise\nimport logging\ntry:\n    int(\"bad\")\nexcept ValueError as e:\n    logging.error(f\"Conversion failed: {e}\", exc_info=True)\n    raise   # re-raise with full traceback logged",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "`except Exception: pass` is one of the most dangerous patterns in Python. It silently swallows every error — your program continues running with wrong data, failed operations, and no indication anything went wrong. If you must suppress an exception, at minimum log it: `except Exception as e: logging.error(e)`."
      },
      "keyPoints": [
        "Never use bare except: — always specify at least except Exception:",
        "Never use except Exception: pass — always log, return a default, or re-raise",
        "Use .get() and in for expected missing keys — not try/except",
        "Catch the specific exception type the code actually raises",
        "Log before re-raising — exc_info=True includes the full traceback in the log"
      ],
      "tryIt": "Find and fix all five bugs: (1) bare except blocking Ctrl+C, (2) except Exception: pass swallowing a real error, (3) try/except used to check dict key existence, (4) catching ValueError when the code raises TypeError, (5) re-raising without logging. Write the corrected version of each."
    }
  },

  {
    "id": 1036,
    "moduleId": 11,
    "moduleTitle": "Error Handling",
    "title": "Module 11 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered exception handling — the mechanism that separates programs that crash from programs that recover gracefully. Robust error handling is one of the clearest markers of production-quality code.\n\n## What You Learned\n\n**Exceptions** are objects raised when Python encounters an error. All catchable exceptions inherit from `Exception`. Read tracebacks bottom-up — the last line is the actual error.\n\n**try/except** — `try` contains risky code; `except` handles specific exception types. Use `as e` to capture the exception object. Never use bare `except:`.\n\n**Multiple except clauses** — handle different exceptions differently. Specific types before general ones. `except (TypeError, ValueError)` catches both with one handler.\n\n**else and finally** — `else` runs only on success; `finally` always runs. Use `finally` for cleanup when `with` is not available.\n\n**Raising exceptions** — `raise ExceptionType(\"message\")` signals errors to callers. Choose the most specific built-in type. Bare `raise` re-raises unchanged.\n\n**Custom exceptions** — inherit from `Exception`. Add `__init__` for extra context. Build hierarchies with a common base class. Name with the `Error` suffix.\n\n**Exception chaining** — `raise New() from original` makes the chain explicit. `from None` suppresses internal details. Implicit chaining happens automatically.\n\n## What Is Coming Next\n\nModule 12 introduces **Object-Oriented Programming** — classes, instances, inheritance, and the patterns that let you model real-world concepts as Python objects.",
      "diagram": "flowchart TD\n    A[\"✅ Exceptions\nhierarchy traceback\"] --> B[\"✅ try/except\ncatch and handle\"]\n    B --> C[\"✅ Multiple except\nspecific before general\"]\n    C --> D[\"✅ else finally\nsuccess cleanup\"]\n    D --> E[\"✅ raise\nsignal errors\"]\n    E --> F[\"✅ Custom exceptions\nhierarchy context\"]\n    F --> G[\"✅ Exception chaining\nfrom from None\"]\n    G --> H[\"➡️ OOP\nModule 12\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 11 complete — robust error handling separates scripts from production code",
      "code": "# Everything from Module 11 in one program\nclass AppError(Exception):\n    pass\n\nclass ValidationError(AppError):\n    def __init__(self, field, message):\n        self.field = field\n        super().__init__(f\"{field}: {message}\")\n\nclass NotFoundError(AppError):\n    def __init__(self, resource, id):\n        super().__init__(f\"{resource} '{id}' not found\")\n\ndef validate_user(data):\n    if not data.get(\"name\"):\n        raise ValidationError(\"name\", \"cannot be empty\")\n    if not isinstance(data.get(\"age\"), int):\n        raise ValidationError(\"age\", \"must be an integer\")\n    if data[\"age\"] < 0 or data[\"age\"] > 150:\n        raise ValidationError(\"age\", f\"invalid value: {data['age']}\")\n    if \"@\" not in data.get(\"email\", \"\"):\n        raise ValidationError(\"email\", \"invalid format\")\n\ndef create_user(data, db):\n    try:\n        validate_user(data)\n    except ValidationError as e:\n        return {\"success\": False, \"error\": str(e), \"field\": e.field}\n\n    try:\n        db[data[\"email\"]] = data\n        return {\"success\": True, \"user\": data}\n    except Exception as e:\n        raise AppError(\"Failed to save user\") from e\n\ndb = {}\nprint(create_user({\"name\": \"Alice\", \"age\": 30, \"email\": \"alice@example.com\"}, db))\nprint(create_user({\"name\": \"\", \"age\": 30, \"email\": \"alice@example.com\"}, db))\nprint(create_user({\"name\": \"Bob\", \"age\": -1, \"email\": \"bob@example.com\"}, db))",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Before moving on, make sure you can write a complete try/except/else/finally block from memory, create a custom exception with extra attributes, and explain the difference between `raise`, `raise from e`, and `raise from None`. These patterns appear constantly in real Python codebases."
      },
      "keyPoints": [
        "Never use bare except: — always specify at least except Exception:",
        "else runs on success only; finally always runs — use for cleanup",
        "Raise the most specific exception type that fits the situation",
        "Custom exceptions with hierarchies make error handling precise and readable",
        "raise from e chains explicitly; raise from None hides internal details"
      ],
      "tryIt": "From memory, build a complete user registration system with: a ValidationError hierarchy (EmailError, PasswordError, AgeError), a validate() function that raises the right subclass, a register() function using try/except/else, and a main() function that catches each error type and prints a user-friendly message."
    }
  },

  {
    "id": 1037,
    "moduleId": 12,
    "moduleTitle": "Recursion",
    "title": "What Is Recursion?",
    "type": "lesson",
    "content": {
      "body": "Recursion is when a function calls itself. It is a technique for solving problems by breaking them into smaller versions of the same problem, solving each smaller version the same way, until you reach a version small enough to solve directly.\n\n## The Core Idea\n\nEvery recursive solution has the same structure:\n1. **Check if this is the simplest case** — if yes, return the answer directly\n2. **If not, break the problem into a smaller version** and call yourself with it\n3. **Combine the result** of the smaller version with the current step\n\nThis is fundamentally different from loops. A loop says \"repeat this action\". Recursion says \"this problem is a smaller version of itself — solve the smaller version first\".\n\n## A Simple Example\n\nCounting down from n to 1:\n- If n is 0, stop (base case)\n- Otherwise, print n, then count down from n-1 (recursive case)\n\nThe function calls itself with a smaller argument each time. Eventually it reaches 0 and stops.\n\n## When Recursion Is Natural\n\nSome problems have a naturally recursive structure — their definition refers to themselves. Trees, file systems, mathematical sequences, and nested data structures are all naturally recursive. For these, a recursive solution is often cleaner and more direct than an iterative one.\n\n## Python's Recursion Limit\n\nPython limits recursion depth to 1000 by default to prevent stack overflow. For deep recursion, use iteration or increase the limit with `sys.setrecursionlimit()`.",
      "diagram": "flowchart TD\n    A[\"countdown(3)\"] --> B[\"print 3\ncountdown(2)\"]\n    B --> C[\"print 2\ncountdown(1)\"]\n    C --> D[\"print 1\ncountdown(0)\"]\n    D --> E[\"base case\nreturn\"]\n    E --> F[\"return to countdown(1)\"]\n    F --> G[\"return to countdown(2)\"]\n    G --> H[\"return to countdown(3)\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Each call creates a smaller version of the problem — the base case stops the chain",
      "code": "# Simple countdown — recursion vs loop\ndef countdown_recursive(n):\n    if n <= 0:          # base case\n        print(\"Go!\")\n        return\n    print(n)\n    countdown_recursive(n - 1)   # recursive case\n\ndef countdown_loop(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    print(\"Go!\")\n\ncountdown_recursive(5)\n\n# Sum of a list — recursive\ndef sum_list(numbers):\n    if not numbers:          # base case: empty list\n        return 0\n    return numbers[0] + sum_list(numbers[1:])   # first + rest\n\nprint(sum_list([1, 2, 3, 4, 5]))   # 15\n\n# Python's recursion limit\nimport sys\nprint(sys.getrecursionlimit())   # 1000\n\n# RecursionError — no base case\n# def infinite(n):\n#     return infinite(n + 1)   # RecursionError: maximum depth exceeded",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Recursion is not always better than a loop — it is a different way of thinking about the same problem. For simple repetition, loops are clearer and faster. Recursion shines when the problem structure is naturally self-similar: trees, nested data, divide-and-conquer algorithms."
      },
      "keyPoints": [
        "Recursion is a function calling itself with a smaller version of the problem",
        "Every recursive function needs a base case — the simplest case that returns directly",
        "The recursive case breaks the problem down and calls itself with a smaller input",
        "Python limits recursion to 1000 levels by default — deep recursion needs iteration",
        "Recursion is natural for tree traversal, nested data, and divide-and-conquer problems"
      ],
      "tryIt": "Write a recursive function power(base, exp) that computes base**exp without using the ** operator. Base case: exp == 0 returns 1. Recursive case: base * power(base, exp-1). Test with power(2, 10) and power(3, 4). Then trace through power(2, 3) on paper, showing each call and return value."
    }
  },

  {
    "id": 1038,
    "moduleId": 12,
    "moduleTitle": "Recursion",
    "title": "Base Case and Recursive Case",
    "type": "lesson",
    "content": {
      "body": "Every recursive function has exactly two parts: the base case and the recursive case. Getting both right is the entire skill of writing recursive functions.\n\n## The Base Case\n\nThe base case is the condition under which the function stops calling itself and returns a direct answer. Without a base case, the function calls itself forever until Python raises a `RecursionError`.\n\nA function can have multiple base cases. Factorial has two: `n == 0` and `n == 1` both return 1. Binary search has two: found the target, or the search space is empty.\n\n## The Recursive Case\n\nThe recursive case does two things:\n1. Breaks the problem into a smaller version\n2. Calls itself with that smaller version\n\nThe key requirement: **each recursive call must move closer to the base case**. If the input does not get smaller (or simpler) with each call, the function never terminates.\n\n## Designing a Recursive Function\n\nAsk three questions:\n1. What is the simplest possible input? → that is your base case\n2. How does a problem of size n relate to a problem of size n-1? → that is your recursive case\n3. Does each call move toward the base case? → verify termination\n\n## Trust the Recursion\n\nThe hardest mental shift: trust that the recursive call works correctly. When writing `factorial(n)`, assume `factorial(n-1)` already gives the right answer. Your job is only to combine it correctly with the current step.",
      "diagram": "flowchart TD\n    A[\"factorial(n)\"] --> B{\"n == 0\nor n == 1?\"}\n    B -->|\"Yes — base case\"| C[\"return 1\"]\n    B -->|\"No — recursive case\"| D[\"return n * factorial(n-1)\"]\n    D --> E[\"factorial(n-1)\nmoves toward base\"]\n    E --> B\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Base case returns directly; recursive case reduces the problem and calls itself",
      "code": "# Factorial — classic example\ndef factorial(n):\n    if n < 0:\n        raise ValueError(\"Factorial undefined for negative numbers\")\n    if n == 0 or n == 1:   # base cases\n        return 1\n    return n * factorial(n - 1)   # recursive case\n\nprint(factorial(5))   # 120\nprint(factorial(0))   # 1\n\n# Fibonacci — two recursive calls\ndef fibonacci(n):\n    if n < 0:\n        raise ValueError(\"n must be non-negative\")\n    if n == 0:   # base case 1\n        return 0\n    if n == 1:   # base case 2\n        return 1\n    return fibonacci(n - 1) + fibonacci(n - 2)   # recursive case\n\nprint([fibonacci(i) for i in range(10)])\n# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n\n# Sum of digits\ndef digit_sum(n):\n    n = abs(n)\n    if n < 10:          # base case: single digit\n        return n\n    return n % 10 + digit_sum(n // 10)   # last digit + rest\n\nprint(digit_sum(12345))   # 15\n\n# Reverse a string\ndef reverse(s):\n    if len(s) <= 1:     # base case\n        return s\n    return reverse(s[1:]) + s[0]   # rest reversed + first char\n\nprint(reverse(\"Python\"))   # nohtyP",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "When designing a recursive function, start with the base case — what is the simplest input that needs no further breakdown? Then ask: if I already had the answer for n-1, how would I compute the answer for n? That relationship is your recursive case. Trust that the recursive call works and just combine the results."
      },
      "keyPoints": [
        "Every recursive function needs at least one base case that returns directly",
        "The recursive case must move closer to the base case on every call",
        "A function can have multiple base cases — factorial has two (n==0 and n==1)",
        "Trust the recursion: assume the recursive call returns the correct answer",
        "No base case or no progress toward it causes infinite recursion and RecursionError"
      ],
      "tryIt": "Write recursive functions for: (1) sum of integers from 1 to n, (2) count occurrences of a character in a string, (3) check whether a string is a palindrome. For each, identify the base case and recursive case before writing any code. Trace through a small example by hand to verify."
    }
  },

  {
    "id": 1039,
    "moduleId": 12,
    "moduleTitle": "Recursion",
    "title": "The Call Stack",
    "type": "lesson",
    "content": {
      "body": "Understanding the call stack is the key to understanding recursion. Every function call — recursive or not — creates a new frame on the call stack. That frame holds the function's local variables and the point to return to when the function finishes.\n\n## What the Call Stack Does\n\nWhen a function is called, Python pushes a new frame onto the stack. When the function returns, the frame is popped and execution resumes in the calling frame. The stack grows with each call and shrinks with each return.\n\n## Recursive Calls Build the Stack\n\nEach recursive call adds a new frame. `factorial(5)` calls `factorial(4)`, which calls `factorial(3)`, and so on. The stack grows until the base case is reached. Then each call returns, popping frames one by one — this is called **unwinding**.\n\n## Stack Overflow\n\nPython's default recursion limit is 1000. If the stack grows beyond this, Python raises `RecursionError: maximum recursion depth exceeded`. This protects against infinite recursion consuming all available memory.\n\n## Visualising the Stack\n\n```\nfactorial(4)\n  factorial(3)\n    factorial(2)\n      factorial(1)  ← base case, returns 1\n    returns 2 * 1 = 2\n  returns 3 * 2 = 6\nreturns 4 * 6 = 24\n```\n\nEach return value is passed back up the stack, combining with the current frame's computation until the original call gets its final answer.",
      "diagram": "flowchart TD\n    A[\"factorial(4) — frame 1\"] --> B[\"factorial(3) — frame 2\"]\n    B --> C[\"factorial(2) — frame 3\"]\n    C --> D[\"factorial(1) — frame 4\nbase case: return 1\"]\n    D -->|\"return 1\"| C2[\"frame 3: 2 * 1 = 2\"]\n    C2 -->|\"return 2\"| B2[\"frame 2: 3 * 2 = 6\"]\n    B2 -->|\"return 6\"| A2[\"frame 1: 4 * 6 = 24\"]\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style A2 fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Stack grows on each call, unwinds on each return — each frame waits for the one below it",
      "code": "import sys\n\n# See the current call stack depth\ndef depth_check(n):\n    print(f\"n={n}, stack depth={len(sys._current_frames())}\")\n    if n == 0:\n        return 0\n    return depth_check(n - 1)\n\ndepth_check(5)\n\n# Trace factorial with print statements\ndef factorial_traced(n, depth=0):\n    indent = \"  \" * depth\n    print(f\"{indent}factorial({n}) called\")\n    if n <= 1:\n        print(f\"{indent}base case: return 1\")\n        return 1\n    result = n * factorial_traced(n - 1, depth + 1)\n    print(f\"{indent}factorial({n}) returning {result}\")\n    return result\n\nfactorial_traced(4)\n\n# RecursionError — stack overflow\ndef no_base(n):\n    return no_base(n + 1)\n\ntry:\n    no_base(0)\nexcept RecursionError as e:\n    print(f\"Stack overflow: {e}\")\n\n# Check and adjust recursion limit\nprint(sys.getrecursionlimit())   # 1000\n# sys.setrecursionlimit(5000)    # increase if needed",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Each recursive call consumes stack space. A recursion depth of 1000 is Python's safety limit — not a target. If your recursive function needs more than a few hundred levels, consider converting it to an iterative solution or using memoisation to reduce the number of calls. Deep recursion is a sign the algorithm may need rethinking."
      },
      "keyPoints": [
        "Each function call pushes a frame onto the call stack — recursive calls stack up",
        "The stack unwinds as each call returns — results propagate back up",
        "Python's default recursion limit is 1000 — exceeded causes RecursionError",
        "Stack depth equals the number of pending recursive calls at any point",
        "Use print statements or a debugger to trace the call stack when debugging recursion"
      ],
      "tryIt": "Add print statements to a recursive fibonacci(n) function to trace every call and return. Run fibonacci(6) and count: how many times is fibonacci(2) called? How many total calls are made? This reveals the exponential call explosion that makes naive fibonacci slow — and motivates memoisation."
    }
  },

  {
    "id": 1040,
    "moduleId": 12,
    "moduleTitle": "Recursion",
    "title": "Recursion with Return Values",
    "type": "lesson",
    "content": {
      "body": "Many recursive functions do more than just repeat an action — they compute and return a value. Understanding how return values propagate back up the call stack is essential for writing correct recursive functions.\n\n## How Return Values Propagate\n\nWhen the base case returns, its value is passed back to the frame that called it. That frame uses the value in its own computation and returns its result to the frame above it. This continues until the original call receives the final answer.\n\n```\nfactorial(4)\n  = 4 * factorial(3)\n  = 4 * (3 * factorial(2))\n  = 4 * (3 * (2 * factorial(1)))\n  = 4 * (3 * (2 * 1))\n  = 4 * (3 * 2)\n  = 4 * 6\n  = 24\n```\n\n## Accumulator Pattern\n\nSome recursive functions carry an accumulator — an extra parameter that builds up the result as the recursion progresses. This is called tail recursion and can be more efficient because the result is ready when the base case is reached, without needing to unwind.\n\n```python\ndef factorial(n, acc=1):\n    if n <= 1:\n        return acc\n    return factorial(n - 1, acc * n)\n```\n\n## Multiple Return Paths\n\nRecursive functions often have multiple return statements — one for each base case and one for the recursive case. Each path must return a value of the same type.\n\n## Returning from Nested Structures\n\nWhen recursing into nested data (trees, nested lists), the return value from each recursive call is combined with the current level's contribution.",
      "diagram": "flowchart TD\n    A[\"factorial(4)\"] -->|\"4 * factorial(3)\"| B[\"factorial(3)\"]\n    B -->|\"3 * factorial(2)\"| C[\"factorial(2)\"]\n    C -->|\"2 * factorial(1)\"| D[\"factorial(1)\nreturn 1\"]\n    D -->|\"return 1\"| C2[\"2 * 1 = 2\"]\n    C2 -->|\"return 2\"| B2[\"3 * 2 = 6\"]\n    B2 -->|\"return 6\"| A2[\"4 * 6 = 24\"]\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style A2 fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style A fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Return values propagate upward — each frame multiplies its n by the result from below",
      "code": "# Standard recursive factorial\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\n# Accumulator version — result built on the way down\ndef factorial_acc(n, acc=1):\n    if n <= 1:\n        return acc\n    return factorial_acc(n - 1, n * acc)\n\nprint(factorial(5))       # 120\nprint(factorial_acc(5))   # 120\n\n# Sum of nested list — recursive with return value\ndef deep_sum(items):\n    total = 0\n    for item in items:\n        if isinstance(item, list):\n            total += deep_sum(item)   # recurse into nested list\n        else:\n            total += item\n    return total\n\nnested = [1, [2, 3], [4, [5, 6]], 7]\nprint(deep_sum(nested))   # 28\n\n# Flatten nested list\ndef flatten(items):\n    result = []\n    for item in items:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result\n\nprint(flatten([1, [2, [3, 4]], [5, 6]]))   # [1, 2, 3, 4, 5, 6]\n\n# Binary search — recursive with return value\ndef binary_search(arr, target, low=0, high=None):\n    if high is None:\n        high = len(arr) - 1\n    if low > high:\n        return -1   # base case: not found\n    mid = (low + high) // 2\n    if arr[mid] == target:\n        return mid  # base case: found\n    if arr[mid] < target:\n        return binary_search(arr, target, mid + 1, high)\n    return binary_search(arr, target, low, mid - 1)\n\nnums = [1, 3, 5, 7, 9, 11, 13]\nprint(binary_search(nums, 7))    # 3\nprint(binary_search(nums, 6))    # -1",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "The accumulator pattern (`factorial_acc`) is more memory-efficient because the result is computed on the way down rather than on the way back up. Python does not optimise tail calls automatically (unlike some languages), but the accumulator pattern still reduces the work done during unwinding and makes the logic clearer."
      },
      "keyPoints": [
        "Return values propagate upward — each frame uses the result from the call below it",
        "The accumulator pattern builds the result on the way down instead of the way up",
        "Every return path in a recursive function must return a value of the same type",
        "Recursing into nested structures combines results from each level",
        "Binary search is a classic example of recursion with meaningful return values"
      ],
      "tryIt": "Write a recursive function max_value(items) that finds the maximum value in a nested list of numbers (lists can be nested to any depth). Base case: a single number. Recursive case: max of current item vs max of the rest. Test with [3, [1, [9, 2]], [4, 7], 5] — should return 9."
    }
  },

  {
    "id": 1041,
    "moduleId": 12,
    "moduleTitle": "Recursion",
    "title": "Classic Recursive Problems",
    "type": "lesson",
    "content": {
      "body": "Certain problems appear repeatedly in computer science and are best understood through recursion. Working through these classics builds the mental model for thinking recursively.\n\n## Fibonacci Sequence\n\nEach number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13...\n\nThe recursive definition mirrors the mathematical one directly. The naive recursive implementation is elegant but exponentially slow — `fibonacci(40)` makes over a billion calls. Memoisation fixes this (next lesson).\n\n## Tower of Hanoi\n\nMove n discs from peg A to peg C using peg B as auxiliary, never placing a larger disc on a smaller one. The recursive insight: move n-1 discs to B, move the largest to C, move n-1 discs from B to C. This requires `2^n - 1` moves.\n\n## Tree Traversal\n\nA tree is a naturally recursive structure — each node has children that are themselves trees. Traversing a tree (visiting every node) is cleanest as a recursive function.\n\n## Merge Sort\n\nDivide the list in half, sort each half recursively, then merge the two sorted halves. This is the classic divide-and-conquer pattern — the recursive structure directly mirrors the algorithm.\n\n## Directory Walking\n\nA file system is a tree. Walking all files in a directory and its subdirectories is naturally recursive — for each item, if it is a directory, recurse into it.",
      "diagram": "flowchart TD\n    A[\"Classic Recursive Problems\"] --> B[\"Fibonacci\nfib(n) = fib(n-1) + fib(n-2)\"]\n    A --> C[\"Tower of Hanoi\nmove n-1, move largest, move n-1\"]\n    A --> D[\"Tree traversal\nvisit node then children\"]\n    A --> E[\"Merge sort\ndivide sort merge\"]\n    A --> F[\"Directory walk\nrecurse into subdirs\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Each classic problem has a naturally recursive structure — the solution mirrors the problem definition",
      "code": "# Fibonacci — elegant but slow without memoisation\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nprint([fib(i) for i in range(10)])\n\n# Tower of Hanoi\ndef hanoi(n, source, target, auxiliary):\n    if n == 1:\n        print(f\"Move disc 1 from {source} to {target}\")\n        return\n    hanoi(n-1, source, auxiliary, target)\n    print(f\"Move disc {n} from {source} to {target}\")\n    hanoi(n-1, auxiliary, target, source)\n\nhanoi(3, \"A\", \"C\", \"B\")   # 7 moves for 3 discs\n\n# Tree traversal\ndef traverse(node):\n    if node is None:\n        return\n    print(node[\"value\"])          # visit current node\n    for child in node.get(\"children\", []):\n        traverse(child)           # recurse into each child\n\ntree = {\n    \"value\": 1,\n    \"children\": [\n        {\"value\": 2, \"children\": [{\"value\": 4, \"children\": []}]},\n        {\"value\": 3, \"children\": [{\"value\": 5, \"children\": []}]},\n    ]\n}\ntraverse(tree)   # 1 2 4 3 5\n\n# Directory walk (simulated)\ndef walk(structure, path=\"\"):\n    for name, content in structure.items():\n        full_path = f\"{path}/{name}\" if path else name\n        if isinstance(content, dict):\n            walk(content, full_path)   # recurse into directory\n        else:\n            print(full_path)           # print file path\n\nfiles = {\"src\": {\"main.py\": None, \"utils\": {\"helpers.py\": None}}, \"README.md\": None}\nwalk(files)",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Tower of Hanoi with n discs requires exactly 2^n - 1 moves. For 64 discs (the original legend), that is 18,446,744,073,709,551,615 moves. At one move per second, it would take about 585 billion years. This illustrates why exponential algorithms are impractical for large inputs — even when the recursive code is just a few lines."
      },
      "keyPoints": [
        "Fibonacci: fib(n) = fib(n-1) + fib(n-2) — elegant but exponentially slow without memoisation",
        "Tower of Hanoi: move n-1 to auxiliary, move largest to target, move n-1 to target",
        "Tree traversal is naturally recursive — visit node, then recurse into each child",
        "Merge sort: divide in half, sort each half recursively, merge sorted halves",
        "Directory walking is tree traversal — recurse into subdirectories"
      ],
      "tryIt": "Implement merge_sort(lst) recursively. Base case: list of 0 or 1 items is already sorted. Recursive case: split in half, sort each half, merge. Write a separate merge(left, right) function that combines two sorted lists. Test with [5, 2, 8, 1, 9, 3] and verify the result is sorted."
    }
  },

  {
    "id": 1042,
    "moduleId": 12,
    "moduleTitle": "Recursion",
    "title": "Recursion vs Loops",
    "type": "lesson",
    "content": {
      "body": "Recursion and loops are both ways to repeat operations. Every recursive function can be rewritten as a loop, and vice versa. Choosing between them is a matter of clarity, performance, and the natural structure of the problem.\n\n## When Recursion Is Better\n\n**Naturally recursive problems** — trees, graphs, nested data, divide-and-conquer algorithms. The recursive solution mirrors the problem structure directly and is easier to understand.\n\n**Cleaner code** — some problems that require complex loop logic with explicit stacks become simple and readable with recursion.\n\n**Mathematical definitions** — when the problem is defined recursively (Fibonacci, factorial, combinatorics), the recursive code reads like the definition.\n\n## When Loops Are Better\n\n**Simple repetition** — counting, summing, iterating over a flat list. A loop is clearer and faster.\n\n**Performance** — each recursive call has overhead (creating a stack frame). For deep recursion, this adds up. Python also has a 1000-level limit.\n\n**Memory** — each stack frame uses memory. A loop uses constant memory regardless of iteration count.\n\n**Tail recursion** — Python does not optimise tail calls. A tail-recursive function that loops 10,000 times will hit the recursion limit; a loop will not.\n\n## The Practical Rule\n\nUse recursion when the problem is naturally recursive and the depth is bounded and small. Use loops for everything else. When in doubt, write the loop — it is almost always faster and uses less memory.",
      "diagram": "flowchart LR\n    A[\"Problem\"] --> B{\"Naturally\nrecursive?\"}\n    B -->|\"Yes — tree nested\ndivide-conquer\"| C[\"Recursion\ncleaner code\"]\n    B -->|\"No — flat list\nsimple repeat\"| D[\"Loop\nfaster less memory\"]\n    C --> E{\"Depth\nbounded?\"}\n    E -->|\"Yes < 100 levels\"| F[\"Recursion OK\"]\n    E -->|\"No > 1000 levels\"| G[\"Use loop\nor memoisation\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Use recursion for naturally recursive problems with bounded depth — loops for everything else",
      "code": "# Factorial — both versions\ndef factorial_recursive(n):\n    if n <= 1: return 1\n    return n * factorial_recursive(n - 1)\n\ndef factorial_loop(n):\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result\n\n# Both give same result — loop is faster and handles large n\nprint(factorial_recursive(10))   # 3628800\nprint(factorial_loop(10))        # 3628800\n# factorial_recursive(2000)      # RecursionError!\n# factorial_loop(2000)           # works fine\n\n# Flatten nested list — recursion is cleaner\ndef flatten_recursive(items):\n    result = []\n    for item in items:\n        if isinstance(item, list):\n            result.extend(flatten_recursive(item))\n        else:\n            result.append(item)\n    return result\n\n# Iterative version — needs explicit stack\ndef flatten_iterative(items):\n    result = []\n    stack = list(items)\n    while stack:\n        item = stack.pop(0)\n        if isinstance(item, list):\n            stack = list(item) + stack\n        else:\n            result.append(item)\n    return result\n\ndata = [1, [2, [3, 4]], [5, 6]]\nprint(flatten_recursive(data))   # [1, 2, 3, 4, 5, 6]\nprint(flatten_iterative(data))   # [1, 2, 3, 4, 5, 6]\n# Recursive version is clearly more readable here",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "A good rule of thumb: if you need an explicit stack data structure to write the iterative version, the recursive version is probably cleaner. The recursive version uses the call stack implicitly — the iterative version makes it explicit. When the call stack is the right tool, use recursion."
      },
      "keyPoints": [
        "Every recursive function can be rewritten as a loop — choose based on clarity",
        "Recursion is cleaner for trees, nested data, and divide-and-conquer problems",
        "Loops are faster, use less memory, and have no depth limit",
        "Python does not optimise tail calls — deep tail recursion hits the 1000-level limit",
        "If the iterative version needs an explicit stack, the recursive version is probably cleaner"
      ],
      "tryIt": "Write both recursive and iterative versions of: (1) sum of a list, (2) reverse a string, (3) find all files in a nested directory structure. For each pair, compare readability and think about which you would use in production code and why."
    }
  },

  {
    "id": 1043,
    "moduleId": 12,
    "moduleTitle": "Recursion",
    "title": "Memoisation",
    "type": "lesson",
    "content": {
      "body": "Memoisation is an optimisation technique that caches the results of function calls so repeated calls with the same arguments return instantly. It transforms exponentially slow recursive functions into linear ones.\n\n## The Problem: Overlapping Subproblems\n\nNaive recursive Fibonacci is slow because it recomputes the same values repeatedly. `fib(5)` calls `fib(4)` and `fib(3)`. `fib(4)` calls `fib(3)` and `fib(2)`. `fib(3)` is computed twice, `fib(2)` three times, and so on. The number of calls grows exponentially.\n\n## Manual Memoisation\n\nStore results in a dict. Before computing, check if the result is already cached:\n\n```python\ncache = {}\ndef fib(n):\n    if n in cache:\n        return cache[n]\n    if n <= 1:\n        return n\n    cache[n] = fib(n-1) + fib(n-2)\n    return cache[n]\n```\n\n## functools.lru_cache\n\nPython's `@lru_cache` decorator handles memoisation automatically. Add it above any pure function (same inputs always give same output) to cache its results:\n\n```python\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n```\n\n`maxsize=None` means unlimited cache size. `@cache` (Python 3.9+) is a simpler alias.\n\n## When to Use Memoisation\n\nUse memoisation when a recursive function has **overlapping subproblems** — the same inputs are computed more than once. This is the defining characteristic of dynamic programming problems.",
      "diagram": "flowchart TD\n    A[\"fib(5) without cache\"] --> B[\"fib(4) + fib(3)\"]\n    B --> C[\"fib(3) computed\nTWICE\"]\n    B --> D[\"fib(2) computed\nTHREE TIMES\"]\n    E[\"fib(5) with cache\"] --> F[\"fib(4) computed once\ncached\"]\n    F --> G[\"fib(3) — cache hit\ninstant\"]\n    F --> H[\"fib(2) — cache hit\ninstant\"]\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Memoisation turns exponential O(2^n) into linear O(n) by caching repeated subproblems",
      "code": "from functools import lru_cache\nimport time\n\n# Naive fibonacci — exponentially slow\ndef fib_slow(n):\n    if n <= 1: return n\n    return fib_slow(n-1) + fib_slow(n-2)\n\n# Memoised with lru_cache — linear\n@lru_cache(maxsize=None)\ndef fib_fast(n):\n    if n <= 1: return n\n    return fib_fast(n-1) + fib_fast(n-2)\n\n# Compare performance\nstart = time.time()\nprint(fib_slow(35))\nprint(f\"Slow: {time.time() - start:.3f}s\")\n\nstart = time.time()\nprint(fib_fast(35))\nprint(f\"Fast: {time.time() - start:.6f}s\")\n\n# Cache info\nprint(fib_fast.cache_info())\n# CacheInfo(hits=33, misses=36, maxsize=None, currsize=36)\n\n# Manual memoisation — same effect\ndef make_fib():\n    cache = {}\n    def fib(n):\n        if n in cache: return cache[n]\n        if n <= 1: return n\n        cache[n] = fib(n-1) + fib(n-2)\n        return cache[n]\n    return fib\n\nfib = make_fib()\nprint(fib(100))   # instant\n\n# lru_cache with maxsize — evicts least recently used\n@lru_cache(maxsize=128)\ndef expensive(n):\n    return n ** 2\n\n# Clear cache when needed\nfib_fast.cache_clear()",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Add `@lru_cache(maxsize=None)` to any pure recursive function that recomputes the same inputs. It is a one-line fix that can turn a function that takes minutes into one that takes microseconds. The only requirement: the function must be pure — same inputs must always produce the same output, with no side effects."
      },
      "keyPoints": [
        "Memoisation caches results so repeated calls with the same arguments return instantly",
        "Naive recursive Fibonacci is O(2^n) — memoised Fibonacci is O(n)",
        "@lru_cache(maxsize=None) adds automatic memoisation with one decorator line",
        "Use memoisation when a recursive function has overlapping subproblems",
        "The function must be pure — same inputs always give same output, no side effects"
      ],
      "tryIt": "Implement a memoised recursive solution for the coin change problem: given a list of coin denominations and a target amount, find the minimum number of coins needed. Use @lru_cache. Compare the performance with and without caching for target=10000 and coins=[1, 5, 10, 25]."
    }
  },

  {
    "id": 1044,
    "moduleId": 12,
    "moduleTitle": "Recursion",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Recursive bugs are often harder to debug than loop bugs because the error may be several levels deep in the call stack. These are the patterns that cause the most problems.\n\n## Mistake 1 — Missing Base Case\n\nNo base case means infinite recursion. The function calls itself forever until Python raises `RecursionError`. Always identify the base case before writing the recursive case.\n\n## Mistake 2 — Base Case Never Reached\n\nThe recursive call does not move toward the base case. `factorial(n)` calling `factorial(n)` instead of `factorial(n-1)` loops forever. Each call must make the problem strictly smaller.\n\n## Mistake 3 — Wrong Base Case Value\n\nThe base case returns the wrong value. `factorial(0)` returning 0 instead of 1 makes every factorial 0. The base case value propagates through all return values — getting it wrong corrupts everything.\n\n## Mistake 4 — Forgetting to Return\n\nA recursive function that does not return its result loses the value. `return fib(n-1) + fib(n-2)` is correct. `fib(n-1) + fib(n-2)` without `return` gives `None + None` — a `TypeError`.\n\n## Mistake 5 — Exponential Calls Without Memoisation\n\nCalling `fib(40)` without memoisation makes over a billion calls. The function appears to hang. Add `@lru_cache` before assuming the algorithm is wrong.\n\n## Mistake 6 — Mutating Shared State\n\nPassing a mutable object (list, dict) across recursive calls and modifying it can produce unexpected results. Use immutable arguments or create copies at each level.",
      "diagram": "flowchart TD\n    A[\"Recursion Mistakes\"] --> B[\"No base case\nRecursionError\"]\n    A --> C[\"Base case unreachable\ninfinite recursion\"]\n    A --> D[\"Wrong base value\ncorrupts all results\"]\n    A --> E[\"Missing return\nNone propagates\"]\n    A --> F[\"No memoisation\nexponential calls\"]\n    A --> G[\"Mutating shared state\nunexpected results\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Missing base case and missing return are the two most common recursive bugs",
      "code": "# Mistake 1 — no base case\n# def countdown(n):\n#     print(n)\n#     countdown(n - 1)   # RecursionError!\ndef countdown(n):\n    if n <= 0: return   # base case added\n    print(n)\n    countdown(n - 1)\n\n# Mistake 2 — base case never reached\n# def factorial(n):\n#     if n == 0: return 1\n#     return n * factorial(n)   # n never decreases!\ndef factorial(n):\n    if n == 0: return 1\n    return n * factorial(n - 1)   # n - 1, not n\n\n# Mistake 3 — wrong base case value\n# def factorial(n):\n#     if n == 0: return 0   # wrong! should be 1\n#     return n * factorial(n - 1)\n# factorial(5) = 5*4*3*2*1*0 = 0 — everything is 0!\n\n# Mistake 4 — missing return\ndef fib(n):\n    if n <= 1: return n\n    # fib(n-1) + fib(n-2)   # missing return — gives None!\n    return fib(n-1) + fib(n-2)   # correct\n\n# Mistake 5 — no memoisation\nfrom functools import lru_cache\n\n# fib(40) without cache — takes seconds\n@lru_cache(maxsize=None)\ndef fib_fast(n):\n    if n <= 1: return n\n    return fib_fast(n-1) + fib_fast(n-2)\n\nprint(fib_fast(100))   # instant\n\n# Mistake 6 — mutating shared list\ndef collect(n, result=[]):   # mutable default!\n    if n == 0: return result\n    result.append(n)\n    return collect(n-1, result)\n\n# Fix: create new list each call\ndef collect_safe(n, result=None):\n    if result is None: result = []\n    if n == 0: return result\n    result.append(n)\n    return collect_safe(n-1, result)",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "If your recursive function seems to hang, check two things first: (1) does it have a base case? (2) does each call move toward the base case? If both are yes, add `@lru_cache` — the function may be correct but exponentially slow due to overlapping subproblems. Most 'broken' recursive functions are actually just missing memoisation."
      },
      "keyPoints": [
        "Always identify the base case before writing the recursive case",
        "Each recursive call must make the problem strictly smaller — verify this",
        "The base case value propagates through all results — getting it wrong corrupts everything",
        "Always return the recursive call result — missing return gives None",
        "Add @lru_cache before assuming a slow recursive function is wrong"
      ],
      "tryIt": "Find and fix all six bugs: (1) recursive function with no base case, (2) recursive call that does not reduce the problem, (3) base case returning 0 instead of 1 for factorial, (4) recursive call result not returned, (5) fib(35) called without memoisation, (6) mutable list passed as default parameter."
    }
  },

  {
    "id": 1045,
    "moduleId": 12,
    "moduleTitle": "Recursion",
    "title": "Module 12 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered recursion — a fundamental technique for solving problems that have a naturally self-similar structure. Recursion is not just a programming trick; it is a way of thinking about problems.\n\n## What You Learned\n\n**What recursion is** — a function calling itself with a smaller version of the problem. Every recursive solution has a base case (stop condition) and a recursive case (smaller version + combine).\n\n**Base case and recursive case** — the base case returns directly; the recursive case reduces the problem and calls itself. Each call must move closer to the base case. Trust that the recursive call works.\n\n**The call stack** — each call pushes a frame; each return pops one. The stack unwinds as return values propagate upward. Python's limit is 1000 levels.\n\n**Return values** — propagate upward through the call stack. The accumulator pattern builds results on the way down. Every return path must return a value.\n\n**Classic problems** — Fibonacci, Tower of Hanoi, tree traversal, merge sort, directory walking. Each has a naturally recursive structure.\n\n**Recursion vs loops** — use recursion for naturally recursive problems with bounded depth. Use loops for simple repetition, large iteration counts, and performance-critical code.\n\n**Memoisation** — `@lru_cache` caches results of pure functions. Transforms exponential recursive functions into linear ones. Essential for overlapping subproblems.\n\n## What Is Coming Next\n\nModule 13 introduces **Object-Oriented Programming** — classes, instances, methods, inheritance, and the patterns that let you model real-world concepts as Python objects.",
      "diagram": "flowchart TD\n    A[\"✅ What is recursion\nself-similar problems\"] --> B[\"✅ Base & recursive case\nstop condition + reduce\"]\n    B --> C[\"✅ Call stack\nframes push pop unwind\"]\n    C --> D[\"✅ Return values\npropagate upward\"]\n    D --> E[\"✅ Classic problems\nfib hanoi trees sort\"]\n    E --> F[\"✅ Recursion vs loops\nwhen to use each\"]\n    F --> G[\"✅ Memoisation\nlru_cache overlapping\"]\n    G --> H[\"➡️ OOP\nModule 13\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 12 complete — recursion is a thinking tool as much as a coding technique",
      "code": "from functools import lru_cache\n\n# Everything from Module 12 in one program\n\n# Memoised fibonacci\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n\n# Recursive tree sum with return value\ndef tree_sum(node):\n    if node is None: return 0\n    return node[\"value\"] + sum(tree_sum(c) for c in node.get(\"children\", []))\n\n# Merge sort\ndef merge_sort(lst):\n    if len(lst) <= 1: return lst\n    mid = len(lst) // 2\n    left = merge_sort(lst[:mid])\n    right = merge_sort(lst[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]\n\n# Test all three\nprint([fib(i) for i in range(10)])\n\ntree = {\"value\": 1, \"children\": [\n    {\"value\": 2, \"children\": [{\"value\": 4, \"children\": []}]},\n    {\"value\": 3, \"children\": []},\n]}\nprint(tree_sum(tree))   # 10\n\nprint(merge_sort([5, 2, 8, 1, 9, 3]))   # [1, 2, 3, 5, 8, 9]",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Before moving on, make sure you can write a recursive function from scratch: identify the base case, write the recursive case, verify each call moves toward the base case, and add @lru_cache if the function has overlapping subproblems. If you can implement merge sort from memory, you have genuinely mastered Module 12."
      },
      "keyPoints": [
        "Every recursive function needs a base case and a recursive case that moves toward it",
        "Trust the recursion — assume the recursive call works and just combine the results",
        "The call stack grows with each call and unwinds as each returns — limit is 1000",
        "Add @lru_cache to pure recursive functions with overlapping subproblems",
        "Use recursion for naturally recursive structures; use loops for simple repetition"
      ],
      "tryIt": "From memory, implement three recursive functions: (1) flatten a deeply nested list, (2) count all nodes in a tree, (3) find the maximum depth of a nested list. For each, identify the base case first, then write the recursive case. Add memoisation to any that might recompute the same inputs."
    }
  },

  {
    "id": 1046,
    "moduleId": 13,
    "moduleTitle": "Modules & Packages",
    "title": "What Is a Module?",
    "type": "lesson",
    "content": {
      "body": "A module is a Python file. Any `.py` file is a module. When you import it, Python executes the file and makes its functions, classes, and variables available in your code. Modules are the fundamental unit of code organisation in Python.\n\n## Why Modules Exist\n\nWithout modules, every program would be a single file. As programs grow, a single file becomes unmanageable — thousands of lines, functions that are hard to find, no separation of concerns. Modules let you split code into logical units, each focused on one area of responsibility.\n\n## The Three Types of Modules\n\n**Built-in modules** — compiled into the Python interpreter itself: `sys`, `builtins`. Always available, no installation needed.\n\n**Standard library modules** — shipped with Python but not built-in: `os`, `json`, `csv`, `datetime`, `math`, `random`. Available on any Python installation.\n\n**Third-party modules** — installed via `pip`: `requests`, `numpy`, `pandas`, `flask`. Not available until installed.\n\n**Your own modules** — any `.py` file you write. Import them by filename (without `.py`).\n\n## What a Module Contains\n\nA module can contain functions, classes, variables, and executable code. When imported, the module's top-level code runs once. Subsequent imports use the cached version — Python does not re-execute the file.\n\n## The Module Cache\n\nPython caches imported modules in `sys.modules`. Importing the same module twice does not re-execute it — the second import returns the cached version instantly.",
      "diagram": "flowchart TD\n    A[\"Python Modules\"] --> B[\"Built-in\nsys builtins\"]\n    A --> C[\"Standard Library\nos json math datetime\"]\n    A --> D[\"Third-party\nrequests numpy pandas\"]\n    A --> E[\"Your own\nutils.py helpers.py\"]\n    F[\"import module\"] --> G[\"Execute file once\"]\n    G --> H[\"Cache in sys.modules\"]\n    H --> I[\"Second import\nreturns cached\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Modules are .py files — Python executes them once on first import and caches the result",
      "code": "# Every .py file is a module\n# math is a standard library module\nimport math\n\nprint(math.pi)          # 3.141592653589793\nprint(math.sqrt(16))    # 4.0\nprint(math.floor(3.7))  # 3\n\n# sys gives access to the interpreter\nimport sys\nprint(sys.version)\nprint(sys.path)         # where Python looks for modules\n\n# Check the module cache\nimport json\nprint('json' in sys.modules)   # True — already cached\nimport json                     # second import — no re-execution\nprint('json' in sys.modules)   # True — same cached object\n\n# See what a module contains\nprint(dir(math))   # all names in the math module\n\n# Module metadata\nprint(math.__name__)    # 'math'\nprint(math.__file__)    # path to the .py file (if applicable)\nprint(math.__doc__)     # module docstring",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Python searches for modules in this order: (1) the directory containing the script being run, (2) directories in the PYTHONPATH environment variable, (3) the standard library, (4) site-packages (where pip installs). `sys.path` shows the full search path. If a module is not found, Python raises `ModuleNotFoundError`."
      },
      "keyPoints": [
        "A module is any .py file — functions, classes, and variables defined in it are importable",
        "Three types: built-in (compiled in), standard library (shipped with Python), third-party (pip)",
        "Python executes a module file once on first import and caches it in sys.modules",
        "Subsequent imports return the cached version — no re-execution",
        "sys.path controls where Python looks for modules"
      ],
      "tryIt": "Import the math, random, and datetime modules. From math: calculate the circumference of a circle with radius 5. From random: generate 5 random integers between 1 and 100. From datetime: print today's date and the day of the week. Use dir() to explore what each module contains."
    }
  },

  {
    "id": 1047,
    "moduleId": 13,
    "moduleTitle": "Modules & Packages",
    "title": "Importing Modules",
    "type": "lesson",
    "content": {
      "body": "Python provides several import syntaxes, each with different trade-offs for readability, namespace clarity, and convenience. Choosing the right one matters for code quality.\n\n## import module\n\nThe standard import. Access names with `module.name`. This is the clearest form — the module name in the code tells you exactly where each name comes from.\n\n```python\nimport math\nprint(math.sqrt(16))   # clearly from math\n```\n\n## import module as alias\n\nUse an alias when the module name is long or when there is a naming conflict. Aliases are also conventional for some popular libraries (`import numpy as np`, `import pandas as pd`).\n\n```python\nimport datetime as dt\ntoday = dt.date.today()\n```\n\n## Importing Multiple Modules\n\nImport each module on its own line. PEP 8 requires one import per line — never `import os, sys` on the same line.\n\n## Import Order\n\nPEP 8 specifies the order: standard library imports first, then third-party, then local. Separate each group with a blank line. Most linters enforce this automatically.\n\n```python\nimport os\nimport sys\n\nimport requests\n\nimport mymodule\n```\n\n## Lazy Imports\n\nImporting inside a function delays the import until the function is called. Useful for optional dependencies or reducing startup time.",
      "diagram": "flowchart TD\n    A[\"Import styles\"] --> B[\"import math\nfull module name\"]\n    A --> C[\"import numpy as np\nalias\"]\n    A --> D[\"from math import sqrt\nspecific name\"]\n    A --> E[\"from math import *\nall names — avoid\"]\n    B --> F[\"math.sqrt()\nclear origin\"]\n    C --> G[\"np.array()\nconventional alias\"]\n    D --> H[\"sqrt()\nno prefix needed\"]\n    E --> I[\"sqrt()\norigin unclear — pollutes namespace\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "import module is clearest — aliases are conventional for popular libraries",
      "code": "# Standard import\nimport math\nimport os\nimport sys\n\nprint(math.pi)\nprint(os.getcwd())\nprint(sys.version)\n\n# Alias — conventional for popular libraries\nimport datetime as dt\nimport collections as col\n\ntoday = dt.date.today()\ncounter = col.Counter([1, 2, 2, 3, 3, 3])\nprint(today)\nprint(counter)\n\n# PEP 8 import order\n# 1. Standard library\nimport json\nimport pathlib\n\n# 2. Third-party (if installed)\n# import requests\n# import numpy as np\n\n# 3. Local modules\n# import mymodule\n\n# One import per line — not import os, sys\n# import os, sys   # PEP 8 violation\n\n# Lazy import inside function\ndef process_image(path):\n    import PIL.Image   # only imported when function is called\n    return PIL.Image.open(path)\n\n# Conditional import — handle optional dependency\ntry:\n    import ujson as json_lib   # faster json if available\nexcept ImportError:\n    import json as json_lib    # fall back to standard library",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use `import module` (not `from module import *`) for clarity. When you see `sqrt()` in code, you cannot tell where it came from. When you see `math.sqrt()`, the origin is immediately clear. The only exception is interactive sessions and notebooks where brevity matters more than clarity."
      },
      "keyPoints": [
        "import module gives full namespace clarity — math.sqrt() shows the origin",
        "import module as alias is conventional for popular libraries (np, pd, dt)",
        "PEP 8: one import per line, standard library first, then third-party, then local",
        "Never use from module import * in production code — pollutes the namespace",
        "Lazy imports inside functions delay loading until needed — useful for optional deps"
      ],
      "tryIt": "Write a script that imports os, sys, json, datetime, and pathlib following PEP 8 order. Use each module for one operation: list files in the current directory, print the Python version, write a dict to JSON, print today's date formatted as 'Monday 15 January 2025', and check if a path exists."
    }
  },

  {
    "id": 1048,
    "moduleId": 13,
    "moduleTitle": "Modules & Packages",
    "title": "from ... import",
    "type": "lesson",
    "content": {
      "body": "The `from module import name` syntax imports specific names directly into the current namespace. You can use them without the module prefix. This is convenient but requires care — it can make code harder to read and cause name collisions.\n\n## Syntax\n\n```python\nfrom math import sqrt, pi, floor\nprint(sqrt(16))   # no math. prefix needed\n```\n\n## When to Use It\n\nUse `from module import name` when:\n- The name is used frequently and the prefix adds noise\n- The origin is obvious from context\n- You are importing a specific class or function that is the main thing you need\n\n```python\nfrom pathlib import Path\nfrom datetime import datetime, timedelta\nfrom collections import defaultdict, Counter\n```\n\nThese are idiomatic — the names are distinctive enough that their origin is clear.\n\n## Aliasing Imported Names\n\nYou can alias individual names too:\n\n```python\nfrom datetime import datetime as dt\nfrom collections import OrderedDict as OD\n```\n\n## What to Avoid\n\n**`from module import *`** — imports all public names. Pollutes the namespace, makes it impossible to tell where names come from, and can silently overwrite existing names. Never use in production code.\n\n**Shadowing built-ins** — `from os import open` replaces the built-in `open()`. Always check that imported names do not conflict with built-ins or other imports.",
      "diagram": "flowchart LR\n    A[\"from math import sqrt, pi\"] --> B[\"sqrt added to\ncurrent namespace\"]\n    A --> C[\"pi added to\ncurrent namespace\"]\n    D[\"import math\"] --> E[\"math added to\ncurrent namespace\"]\n    E --> F[\"math.sqrt\nmath.pi via prefix\"]\n    G[\"from math import *\"] --> H[\"ALL names added\norigin unclear\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "from import adds names directly — convenient but loses the module prefix that shows origin",
      "code": "# from import — specific names\nfrom math import sqrt, pi, ceil, floor\nfrom datetime import datetime, date, timedelta\nfrom pathlib import Path\nfrom collections import defaultdict, Counter\n\nprint(sqrt(25))    # 5.0\nprint(pi)          # 3.14159...\n\ntoday = date.today()\ntomorrow = today + timedelta(days=1)\nprint(f\"Today: {today}, Tomorrow: {tomorrow}\")\n\np = Path(\"data\") / \"file.txt\"\nprint(p.suffix)   # .txt\n\n# Counter and defaultdict\nwords = [\"apple\", \"banana\", \"apple\", \"cherry\", \"banana\", \"apple\"]\ncounts = Counter(words)\nprint(counts.most_common(2))   # [('apple', 3), ('banana', 2)]\n\ngroups = defaultdict(list)\nfor word in words:\n    groups[word[0]].append(word)\nprint(dict(groups))\n\n# Aliasing individual names\nfrom datetime import datetime as DateTime\nfrom collections import OrderedDict as OD\n\n# Avoid: from module import *\n# from math import *   # sqrt, pi, sin, cos... all in namespace\n# from os import *     # may overwrite built-in open!\n\n# Name collision example\n# from os.path import open   # shadows built-in open!\n# with open(\"file.txt\") as f:   # now broken",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "`from module import *` is banned in most professional codebases. It makes it impossible to know where a name came from, can silently overwrite existing names, and breaks tools like linters and IDEs that track name origins. The only acceptable use is in interactive sessions. Never use it in .py files."
      },
      "keyPoints": [
        "from module import name adds the name directly to the current namespace",
        "Use it for frequently used names where the origin is obvious from context",
        "Idiomatic: from pathlib import Path, from collections import Counter",
        "Never use from module import * in production code",
        "Check that imported names do not shadow built-ins or other imports"
      ],
      "tryIt": "Rewrite these imports using from...import: (1) math.sqrt, math.pi, math.factorial, (2) datetime.datetime.now(), (3) collections.Counter, collections.defaultdict. Then deliberately create a name collision by importing something that shadows a built-in and observe what breaks."
    }
  },

  {
    "id": 1049,
    "moduleId": 13,
    "moduleTitle": "Modules & Packages",
    "title": "Creating Your Own Module",
    "type": "lesson",
    "content": {
      "body": "Creating a module is as simple as saving a `.py` file. Any Python file can be imported by other files in the same directory. This is how you split a growing program into manageable, reusable pieces.\n\n## Creating a Module\n\nWrite your functions, classes, and variables in a `.py` file. The filename (without `.py`) becomes the module name.\n\n```python\n# mathutils.py\ndef add(a, b): return a + b\ndef multiply(a, b): return a * b\nPI = 3.14159\n```\n\n```python\n# main.py\nimport mathutils\nprint(mathutils.add(3, 4))\nprint(mathutils.PI)\n```\n\n## Module Docstrings\n\nAdd a docstring at the top of your module to describe its purpose. This appears when someone calls `help(your_module)`.\n\n## Controlling What Gets Exported\n\nBy default, `from module import *` imports all names that do not start with an underscore. Define `__all__` as a list of strings to explicitly control what is exported:\n\n```python\n__all__ = [\"add\", \"multiply\"]   # PI not exported by *\n```\n\n## Private Names\n\nNames starting with a single underscore (`_helper`) are conventionally private — they signal \"internal use only\" and are excluded from `import *`. Names starting with double underscore (`__private`) trigger name mangling in classes.\n\n## Reloading a Module\n\nDuring development, if you modify a module and want to reload it without restarting Python, use `importlib.reload(module)`.",
      "diagram": "flowchart LR\n    A[\"mathutils.py\ndef add()\ndef multiply()\nPI = 3.14\"] --> B[\"import mathutils\"]\n    B --> C[\"mathutils.add()\nmathutils.PI\"]\n    D[\"__all__ = ['add']\"] --> E[\"from mathutils import *\nonly imports add\"]\n    F[\"_helper()\"] --> G[\"excluded from\nimport *\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Any .py file is a module — __all__ controls what import * exports",
      "code": "# --- mathutils.py ---\n\"\"\"Utility functions for mathematical operations.\"\"\"\n\n__all__ = [\"add\", \"subtract\", \"multiply\"]\n\nPI = 3.14159265358979\n\ndef add(a, b):\n    \"\"\"Return the sum of a and b.\"\"\"\n    return a + b\n\ndef subtract(a, b):\n    \"\"\"Return a minus b.\"\"\"\n    return a - b\n\ndef multiply(a, b):\n    \"\"\"Return the product of a and b.\"\"\"\n    return a * b\n\ndef _validate(value):\n    \"\"\"Internal helper — not exported.\"\"\"\n    if not isinstance(value, (int, float)):\n        raise TypeError(f\"Expected number, got {type(value).__name__}\")\n    return value\n\n# --- main.py ---\nimport mathutils\n\nprint(mathutils.add(3, 4))       # 7\nprint(mathutils.PI)               # 3.14159...\nprint(mathutils.__doc__)          # module docstring\nprint(dir(mathutils))             # all names\n\n# Reload during development\nimport importlib\nimportlib.reload(mathutils)\n\n# __name__ check — covered next lesson\n# if __name__ == \"__main__\":\n#     print(\"Running as script\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Keep each module focused on one responsibility. A module called `utils.py` that contains everything is not much better than one big file. Better names: `string_utils.py`, `date_helpers.py`, `validators.py`. The name should tell you exactly what is inside without opening the file."
      },
      "keyPoints": [
        "Any .py file is a module — the filename without .py is the module name",
        "Add a module docstring at the top to describe its purpose",
        "__all__ controls what from module import * exports",
        "Names starting with _ are conventionally private and excluded from import *",
        "importlib.reload() reloads a module during development without restarting Python"
      ],
      "tryIt": "Create a validators.py module with three functions: is_email(s) (checks for @), is_positive_int(n) (checks type and value), and is_non_empty_string(s). Add __all__ to export only these three. Add a _validate_type() helper that is private. Import and test all three from a separate main.py file."
    }
  },

  {
    "id": 1050,
    "moduleId": 13,
    "moduleTitle": "Modules & Packages",
    "title": "Packages",
    "type": "lesson",
    "content": {
      "body": "A package is a directory containing Python modules. It lets you organise related modules into a hierarchy — the same way a filesystem organises files into folders. Packages are how large Python projects structure their code.\n\n## Creating a Package\n\nA directory becomes a package when it contains an `__init__.py` file. This file can be empty or can contain initialisation code and imports that run when the package is imported.\n\n```\nmyapp/\n    __init__.py\n    models.py\n    utils.py\n    validators/\n        __init__.py\n        email.py\n        password.py\n```\n\n## Importing from Packages\n\n```python\nimport myapp.models\nfrom myapp.utils import helper\nfrom myapp.validators.email import validate_email\n```\n\n## __init__.py\n\nThe `__init__.py` file runs when the package is imported. Use it to:\n- Re-export names for a cleaner public API\n- Run package-level initialisation\n- Define `__all__` for the package\n\n```python\n# myapp/__init__.py\nfrom .models import User, Product\nfrom .utils import format_date\n```\n\nNow callers can write `from myapp import User` instead of `from myapp.models import User`.\n\n## Relative Imports\n\nInside a package, use relative imports to reference sibling modules:\n```python\nfrom . import utils          # same package\nfrom .models import User     # same package, specific name\nfrom ..shared import config  # parent package\n```",
      "diagram": "flowchart TD\n    A[\"myapp/\n__init__.py\"] --> B[\"models.py\nUser Product\"]\n    A --> C[\"utils.py\nformat_date\"]\n    A --> D[\"validators/\n__init__.py\"]\n    D --> E[\"email.py\nvalidate_email\"]\n    D --> F[\"password.py\nvalidate_password\"]\n    G[\"from myapp import User\"] --> H[\"__init__.py re-exports\nfrom .models import User\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "__init__.py makes a directory a package — use it to re-export a clean public API",
      "code": "# Package structure:\n# myapp/\n#   __init__.py\n#   models.py\n#   utils.py\n#   validators/\n#     __init__.py\n#     email.py\n\n# myapp/models.py\nclass User:\n    def __init__(self, name, email):\n        self.name = name\n        self.email = email\n    def __repr__(self):\n        return f\"User({self.name!r})\"\n\n# myapp/utils.py\nfrom datetime import date\ndef format_date(d):\n    return d.strftime(\"%d %B %Y\")\n\n# myapp/validators/email.py\ndef validate_email(email):\n    return \"@\" in email and \".\" in email.split(\"@\")[-1]\n\n# myapp/__init__.py — clean public API\nfrom .models import User\nfrom .utils import format_date\nfrom .validators.email import validate_email\n\n# main.py — clean imports thanks to __init__.py\nfrom myapp import User, format_date, validate_email\n\nuser = User(\"Alice\", \"alice@example.com\")\nprint(user)\nprint(format_date(date.today()))\nprint(validate_email(user.email))\n\n# Without __init__.py re-exports:\n# from myapp.models import User          # verbose\n# from myapp.validators.email import ... # very verbose",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "In Python 3.3+, `__init__.py` is optional — directories without it are called 'namespace packages'. But for regular packages, always include `__init__.py`. It signals intent (this is a package, not just a directory), enables re-exports, and is expected by most tools and frameworks."
      },
      "keyPoints": [
        "A package is a directory with __init__.py — organises related modules hierarchically",
        "__init__.py runs on import — use it to re-export a clean public API",
        "Import from packages: from myapp.models import User",
        "Relative imports inside a package: from . import utils, from .models import User",
        "Re-exporting in __init__.py lets callers use from myapp import User instead of the full path"
      ],
      "tryIt": "Create a package called 'school' with three modules: students.py (Student class with name and grade), courses.py (Course class with title and students list), and utils.py (format_grade function). Write __init__.py to re-export all three classes and the function. Import everything from 'school' in a main.py and create a course with two students."
    }
  },

  {
    "id": 1051,
    "moduleId": 13,
    "moduleTitle": "Modules & Packages",
    "title": "The Standard Library",
    "type": "lesson",
    "content": {
      "body": "Python's standard library is one of its greatest strengths — a comprehensive collection of modules for almost every common programming task, available on every Python installation with no extra dependencies. \"Batteries included\" is Python's philosophy.\n\n## Essential Standard Library Modules\n\n**`os`** — operating system interface: file operations, environment variables, process management.\n\n**`sys`** — interpreter interface: command-line arguments, stdin/stdout, exit codes, recursion limit.\n\n**`pathlib`** — object-oriented file paths (covered in Module 10).\n\n**`datetime`** — dates, times, timedeltas, formatting and parsing.\n\n**`collections`** — specialised containers: `Counter`, `defaultdict`, `OrderedDict`, `deque`, `namedtuple`.\n\n**`itertools`** — iterator building blocks: `chain`, `product`, `combinations`, `permutations`, `groupby`.\n\n**`functools`** — higher-order functions: `lru_cache`, `partial`, `reduce` (covered in Module 9).\n\n**`re`** — regular expressions for pattern matching and text processing.\n\n**`json`** — JSON encoding and decoding (covered in Module 10).\n\n**`math`** and **`random`** — mathematical functions and random number generation.\n\n**`typing`** — type hints and annotations.\n\n**`unittest`** — built-in testing framework.\n\n## Finding What You Need\n\nThe official Python documentation at docs.python.org has the complete standard library reference. The search is excellent — type the task you want to do and it usually finds the right module.",
      "diagram": "flowchart TD\n    A[\"Standard Library\"] --> B[\"Data\ncollections itertools\"]\n    A --> C[\"Files & OS\nos sys pathlib\"]\n    A --> D[\"Time\ndatetime\"]\n    A --> E[\"Text\nre string\"]\n    A --> F[\"Math\nmath random statistics\"]\n    A --> G[\"Networking\nurllib http socket\"]\n    A --> H[\"Testing\nunittest doctest\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "The standard library covers almost every common task — check it before installing a third-party package",
      "code": "# collections — specialised containers\nfrom collections import Counter, defaultdict, deque, namedtuple\n\nwords = [\"apple\", \"banana\", \"apple\", \"cherry\", \"banana\", \"apple\"]\nprint(Counter(words).most_common(2))   # [('apple', 3), ('banana', 2)]\n\ngroups = defaultdict(list)\nfor w in words:\n    groups[w[0]].append(w)\n\nPoint = namedtuple(\"Point\", [\"x\", \"y\"])\np = Point(3, 4)\nprint(p.x, p.y)   # 3 4\n\n# itertools — iterator tools\nfrom itertools import chain, combinations, groupby\n\nflat = list(chain([1,2], [3,4], [5,6]))\nprint(flat)   # [1, 2, 3, 4, 5, 6]\n\npairs = list(combinations([1,2,3], 2))\nprint(pairs)   # [(1,2), (1,3), (2,3)]\n\n# datetime — dates and times\nfrom datetime import datetime, date, timedelta\n\nnow = datetime.now()\nprint(now.strftime(\"%Y-%m-%d %H:%M\"))\n\nbirthday = date(1990, 6, 15)\nage_days = (date.today() - birthday).days\nprint(f\"Age in days: {age_days}\")\n\n# re — regular expressions\nimport re\nemail_pattern = r\"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}\"\ntext = \"Contact alice@example.com or bob@test.org\"\nemails = re.findall(email_pattern, text)\nprint(emails)   # ['alice@example.com', 'bob@test.org']",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Before installing a third-party package with pip, check whether the standard library already has what you need. `collections.Counter` replaces many manual counting loops. `itertools.chain` replaces list concatenation. `pathlib.Path` replaces string path manipulation. The standard library is often faster, more reliable, and always available."
      },
      "keyPoints": [
        "The standard library ships with Python — no pip install needed",
        "collections: Counter, defaultdict, deque, namedtuple for specialised data structures",
        "itertools: chain, combinations, permutations, groupby for iterator operations",
        "datetime: dates, times, timedeltas, formatting and parsing",
        "Check the standard library before installing a third-party package"
      ],
      "tryIt": "Using only the standard library: (1) count word frequencies in a sentence using Counter, (2) group a list of names by first letter using defaultdict, (3) generate all 2-element combinations from a list of 5 items using itertools, (4) find all dates in a string using re, (5) calculate how many days until New Year."
    }
  },

  {
    "id": 1052,
    "moduleId": 13,
    "moduleTitle": "Modules & Packages",
    "title": "__name__ == \"__main__\"",
    "type": "lesson",
    "content": {
      "body": "Every Python module has a `__name__` attribute. When a file is run directly, `__name__` is set to `\"__main__\"`. When it is imported by another file, `__name__` is set to the module's name. This distinction lets you write files that work both as importable modules and as runnable scripts.\n\n## The Pattern\n\n```python\ndef main():\n    # your script logic here\n    pass\n\nif __name__ == \"__main__\":\n    main()\n```\n\nCode inside the `if __name__ == \"__main__\":` block only runs when the file is executed directly — not when it is imported. This is the standard pattern for all Python scripts.\n\n## Why It Matters\n\nWithout this guard, any code at the top level of a module runs when it is imported. If your module prints output, starts a server, or modifies global state at the top level, importing it causes those side effects — which is almost never what you want.\n\n## What to Put Inside\n\n- The `main()` function call\n- Argument parsing (`argparse`)\n- Test code during development\n- Any code that should only run when the file is the entry point\n\n## What to Keep Outside\n\n- Function and class definitions\n- Constants\n- Imports\n\nThese should always be at the top level so they are available when the module is imported.",
      "diagram": "flowchart TD\n    A[\"Python runs file\"] --> B{\"How was it started?\"}\n    B -->|\"python script.py\ndirect execution\"| C[\"__name__ = '__main__'\"]\n    B -->|\"import script\nfrom another file\"| D[\"__name__ = 'script'\"]\n    C --> E[\"if __name__ == '__main__':\n    main()  ← RUNS\"]\n    D --> F[\"if __name__ == '__main__':\n    main()  ← SKIPPED\"]\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "__name__ is '__main__' only when run directly — imported modules get their filename as __name__",
      "code": "# calculator.py\n\ndef add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b\n\ndef multiply(a, b):\n    return a * b\n\ndef main():\n    print(\"Simple Calculator\")\n    a = float(input(\"First number: \"))\n    op = input(\"Operation (+, -, *): \")\n    b = float(input(\"Second number: \"))\n\n    if op == \"+\":\n        print(f\"Result: {add(a, b)}\")\n    elif op == \"-\":\n        print(f\"Result: {subtract(a, b)}\")\n    elif op == \"*\":\n        print(f\"Result: {multiply(a, b)}\")\n    else:\n        print(\"Unknown operation\")\n\nif __name__ == \"__main__\":\n    main()\n\n# When run directly:   python calculator.py → runs main()\n# When imported:       import calculator → only functions available\n#                      calculator.add(3, 4) → 7\n\n# Check __name__ in any module\nprint(f\"This module's __name__: {__name__}\")\n# Prints '__main__' if run directly\n# Prints 'calculator' if imported",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Always wrap script logic in a `main()` function and call it under `if __name__ == '__main__':`. This makes your file importable (so other code can use your functions), testable (tests can import without running the script), and clear (the entry point is explicit). It is one of the most important Python conventions."
      },
      "keyPoints": [
        "__name__ is '__main__' when a file is run directly, the module name when imported",
        "Code under if __name__ == '__main__': only runs on direct execution",
        "Always wrap script logic in main() and call it under the guard",
        "Top-level code without the guard runs on import — avoid side effects at module level",
        "This pattern makes files both importable modules and runnable scripts"
      ],
      "tryIt": "Take any script you have written and refactor it: move all logic into a main() function, add the if __name__ == '__main__': guard, and verify it still runs correctly. Then import it from another file and confirm that importing it does not execute the script logic — only the function definitions are available."
    }
  },

  {
    "id": 1053,
    "moduleId": 13,
    "moduleTitle": "Modules & Packages",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Module and import bugs range from immediate `ModuleNotFoundError` crashes to subtle namespace pollution that causes wrong results. These are the patterns that cause the most confusion.\n\n## Mistake 1 — Circular Imports\n\nModule A imports from module B, and module B imports from module A. Python partially executes A, starts B, tries to import from A (which is not fully loaded yet), and raises `ImportError` or gives `None` for names that have not been defined yet. Restructure to break the cycle — move shared code to a third module.\n\n## Mistake 2 — Shadowing a Module Name\n\nNaming your file `math.py`, `random.py`, or `os.py` shadows the standard library module. `import math` imports your file instead of the standard library. Always check that your filenames do not conflict with standard library or third-party module names.\n\n## Mistake 3 — from module import * in Production\n\nPollutes the namespace, hides where names come from, and can silently overwrite existing names. Never use in `.py` files.\n\n## Mistake 4 — Missing __init__.py\n\nForgetting `__init__.py` in a package directory means Python may not recognise it as a package (in Python 2 it definitely will not; in Python 3 it becomes a namespace package which behaves differently). Always include it for regular packages.\n\n## Mistake 5 — Relative Import Outside a Package\n\n`from . import utils` only works inside a package. Running a file directly that uses relative imports raises `ImportError: attempted relative import with no known parent package`. Use absolute imports or run via `python -m package.module`.",
      "diagram": "flowchart TD\n    A[\"Module Mistakes\"] --> B[\"Circular imports\nA imports B imports A\"]\n    A --> C[\"Shadow stdlib\nmath.py os.py\"]\n    A --> D[\"import *\nnamespace pollution\"]\n    A --> E[\"Missing __init__.py\nnot a package\"]\n    A --> F[\"Relative import\noutside package\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Circular imports and shadowing stdlib names are the hardest bugs to diagnose",
      "code": "# Mistake 1 — circular import\n# a.py: from b import func_b\n# b.py: from a import func_a   # circular!\n# Fix: move shared code to c.py, import from c in both a and b\n\n# Mistake 2 — shadowing stdlib\n# If you have a file called 'math.py' in your project:\n# import math   # imports YOUR math.py, not stdlib!\n# print(math.sqrt(4))   # AttributeError — your file has no sqrt\n# Fix: rename your file to something unique\n\n# Mistake 3 — import * in production\n# from os import *   # open, path, getcwd... all in namespace\n# from sys import *  # may overwrite os names!\n# Fix: always import specifically\nimport os\nimport sys\n\n# Mistake 4 — missing __init__.py\n# mypackage/\n#   models.py    (no __init__.py)\n# from mypackage import models   # may fail or behave unexpectedly\n# Fix: add __init__.py to mypackage/\n\n# Mistake 5 — relative import outside package\n# utils.py (standalone file):\n# from . import helpers   # ImportError!\n# Fix: use absolute import\n# import helpers\n# Or run as: python -m mypackage.utils\n\n# Checking for name conflicts\nimport sys\nprint(\"math\" in sys.modules)   # check if already imported\n# List all importable modules\nimport pkgutil\n# stdlib_names = [m.name for m in pkgutil.iter_modules()]",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never name your Python files after standard library modules: `math.py`, `os.py`, `random.py`, `string.py`, `json.py`, `csv.py`, `datetime.py`, `collections.py`. Python searches the current directory first, so your file shadows the stdlib module. This causes confusing `AttributeError` or `ImportError` that looks like a Python bug."
      },
      "keyPoints": [
        "Circular imports cause ImportError or None values — break cycles with a shared third module",
        "Never name files after stdlib modules — your file shadows the standard library",
        "Never use from module import * in .py files — pollutes namespace silently",
        "Always include __init__.py in package directories",
        "Relative imports only work inside packages — use absolute imports in standalone scripts"
      ],
      "tryIt": "Deliberately create each mistake and observe the error: (1) create math.py and try to use stdlib math, (2) create a circular import between two files, (3) use from os import * and then try to use a name that got overwritten, (4) use a relative import in a standalone file. Fix each one."
    }
  },

  {
    "id": 1054,
    "moduleId": 13,
    "moduleTitle": "Modules & Packages",
    "title": "Module 13 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered Python's code organisation system — modules and packages. These are the tools that let you split a growing program into manageable, reusable, and testable pieces.\n\n## What You Learned\n\n**Modules** are `.py` files. Python executes them once on first import and caches the result in `sys.modules`. Three types: built-in, standard library, third-party.\n\n**Importing** — `import module` for namespace clarity. `import module as alias` for long names. PEP 8: one import per line, stdlib first, then third-party, then local.\n\n**from ... import** — imports specific names directly. Use for frequently used names where origin is obvious. Never use `import *` in production code.\n\n**Creating modules** — any `.py` file. Add a docstring. Use `__all__` to control exports. Prefix private names with `_`.\n\n**Packages** — directories with `__init__.py`. Use `__init__.py` to re-export a clean public API. Relative imports inside packages with `from . import`.\n\n**Standard library** — batteries included. `collections`, `itertools`, `datetime`, `re`, `pathlib`, `functools`. Check it before installing third-party packages.\n\n**`__name__ == \"__main__\"`** — the standard guard for script entry points. Wrap logic in `main()` and call it under the guard. Makes files both importable and runnable.\n\n## What Is Coming Next\n\nModule 14 introduces **Object-Oriented Programming** — classes, instances, methods, inheritance, and encapsulation. OOP is how you model real-world concepts as Python objects and build large, maintainable systems.",
      "diagram": "flowchart TD\n    A[\"✅ What is a module\n.py file cached\"] --> B[\"✅ Importing\nimport as alias\"]\n    B --> C[\"✅ from import\nspecific names\"]\n    C --> D[\"✅ Creating modules\n__all__ private names\"]\n    D --> E[\"✅ Packages\n__init__.py re-export\"]\n    E --> F[\"✅ Standard library\nbatteries included\"]\n    F --> G[\"✅ __name__ main\nscript guard\"]\n    G --> H[\"➡️ OOP\nModule 14\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 13 complete — modules and packages are the foundation of organised Python projects",
      "code": "# Everything from Module 13 in one project structure\n\n# project/\n#   __init__.py\n#   main.py\n#   utils/\n#     __init__.py\n#     validators.py\n#     formatters.py\n\n# utils/validators.py\n\"\"\"Input validation utilities.\"\"\"\n__all__ = [\"validate_email\", \"validate_age\"]\n\ndef validate_email(email):\n    return isinstance(email, str) and \"@\" in email\n\ndef validate_age(age):\n    return isinstance(age, int) and 0 < age < 150\n\ndef _check_type(value, expected):\n    if not isinstance(value, expected):\n        raise TypeError(f\"Expected {expected.__name__}\")\n\n# utils/__init__.py\nfrom .validators import validate_email, validate_age\nfrom .formatters import format_name\n\n# main.py\nfrom utils import validate_email, validate_age\nfrom collections import namedtuple\nfrom datetime import date\n\nUser = namedtuple(\"User\", [\"name\", \"email\", \"age\"])\n\ndef register(name, email, age):\n    if not validate_email(email):\n        raise ValueError(f\"Invalid email: {email}\")\n    if not validate_age(age):\n        raise ValueError(f\"Invalid age: {age}\")\n    return User(name, email, age)\n\ndef main():\n    user = register(\"Alice\", \"alice@example.com\", 30)\n    print(f\"Registered: {user.name} on {date.today()}\")\n\nif __name__ == \"__main__\":\n    main()",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Before moving on, make sure you can: create a module with __all__ and private names, create a package with __init__.py that re-exports a clean API, and write a script with the if __name__ == '__main__': guard. These three patterns appear in virtually every professional Python project."
      },
      "keyPoints": [
        "Modules are .py files — import them to reuse their functions and classes",
        "Use import module for clarity — from module import * pollutes the namespace",
        "Packages are directories with __init__.py — use it to re-export a clean public API",
        "Always use if __name__ == '__main__': to guard script entry points",
        "Check the standard library before installing third-party packages"
      ],
      "tryIt": "From memory, create a mini project: a package called 'finance' with modules for currency.py (convert between currencies), tax.py (calculate tax), and __init__.py that re-exports the main functions. Write a main.py that imports from 'finance' and uses the if __name__ == '__main__': guard. Run it directly and also import it from another file."
    }
  },

  {
    "id": 1055,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "What Is OOP?",
    "type": "lesson",
    "content": {
      "body": "Object-Oriented Programming (OOP) is a way of organising code around objects — bundles of data and the functions that operate on that data. Instead of writing separate functions that take data as arguments, you define objects that know their own data and know how to operate on it.\n\n## The Core Idea\n\nIn procedural programming, data and functions are separate. You pass data to functions. In OOP, data and functions are bundled together into objects. The object knows its own state and knows what it can do.\n\n```python\n# Procedural\ndef get_full_name(first, last):\n    return f\"{first} {last}\"\n\n# OOP\nclass Person:\n    def get_full_name(self):\n        return f\"{self.first} {self.last}\"\n```\n\n## The Four Pillars\n\n**Encapsulation** — bundle data and methods together; hide internal details.\n\n**Inheritance** — a class can inherit attributes and methods from another class, extending or specialising its behaviour.\n\n**Polymorphism** — different objects can respond to the same method call in different ways.\n\n**Abstraction** — expose only what is necessary; hide complexity behind a clean interface.\n\n## When OOP Makes Sense\n\nOOP is most valuable when you are modelling real-world entities with state and behaviour — users, products, bank accounts, game characters. It is less useful for simple scripts and data transformation pipelines where functions and comprehensions are cleaner.",
      "diagram": "flowchart TD\n    A[\"Object\"] --> B[\"State\n(attributes/data)\"]\n    A --> C[\"Behaviour\n(methods/functions)\"]\n    B --> D[\"name = 'Alice'\nbalance = 1000\"]\n    C --> E[\"deposit()\nwithdraw()\nget_balance()\"]\n    F[\"Four Pillars\"] --> G[\"Encapsulation\"]\n    F --> H[\"Inheritance\"]\n    F --> I[\"Polymorphism\"]\n    F --> J[\"Abstraction\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Objects bundle state (data) and behaviour (methods) — the four pillars govern how they interact",
      "code": "# Procedural approach — data and functions separate\ndef create_account(name, balance):\n    return {\"name\": name, \"balance\": balance}\n\ndef deposit(account, amount):\n    account[\"balance\"] += amount\n\ndef get_balance(account):\n    return account[\"balance\"]\n\nacc = create_account(\"Alice\", 1000)\ndeposit(acc, 500)\nprint(get_balance(acc))   # 1500\n\n# OOP approach — data and behaviour bundled\nclass BankAccount:\n    def __init__(self, name, balance):\n        self.name = name\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def get_balance(self):\n        return self.balance\n\nacc = BankAccount(\"Alice\", 1000)\nacc.deposit(500)\nprint(acc.get_balance())   # 1500\nprint(acc.name)            # Alice\n\n# OOP is cleaner when objects have identity and state\n# Procedural is fine for stateless transformations",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "OOP is a tool, not a religion. Python supports multiple paradigms — procedural, functional, and object-oriented. Use OOP when you are modelling entities with state and behaviour. Use functions and comprehensions for data transformation. The best Python code uses the right tool for each situation."
      },
      "keyPoints": [
        "OOP bundles data (attributes) and functions (methods) into objects",
        "The four pillars: Encapsulation, Inheritance, Polymorphism, Abstraction",
        "Objects model real-world entities with identity, state, and behaviour",
        "OOP is most valuable for entities with state — less useful for stateless transformations",
        "Python supports OOP, procedural, and functional styles — use the right tool"
      ],
      "tryIt": "Think of three real-world entities that would benefit from OOP modelling: for each, list 3 attributes (data it holds) and 3 methods (things it can do). Examples: a library book, a shopping cart, a student. Then write the class skeleton (just the class name, __init__, and method signatures — no implementation yet)."
    }
  },

  {
    "id": 1056,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "Classes and Instances",
    "type": "lesson",
    "content": {
      "body": "A **class** is a blueprint. An **instance** is an object created from that blueprint. The class defines what attributes and methods all instances will have. Each instance has its own copy of the data.\n\n## Defining a Class\n\n```python\nclass Dog:\n    species = \"Canis familiaris\"   # class attribute\n\n    def __init__(self, name, breed):\n        self.name = name           # instance attribute\n        self.breed = breed         # instance attribute\n```\n\n## Creating Instances\n\nCall the class like a function. Python calls `__init__` automatically with the new instance as the first argument (`self`).\n\n```python\nrex = Dog(\"Rex\", \"Labrador\")\nbuddy = Dog(\"Buddy\", \"Poodle\")\n```\n\n`rex` and `buddy` are separate instances. Changing `rex.name` does not affect `buddy.name`.\n\n## Class Attributes vs Instance Attributes\n\n**Class attributes** are shared by all instances. Defined directly in the class body. Accessed via the class or any instance.\n\n**Instance attributes** are unique to each instance. Defined in `__init__` (or other methods) using `self.attribute = value`.\n\nWhen you access an attribute on an instance, Python first checks the instance's own `__dict__`, then the class's `__dict__`. This means an instance attribute with the same name as a class attribute shadows the class attribute for that instance.",
      "diagram": "flowchart TD\n    A[\"class Dog:\n  species = 'Canis'\n  def __init__(name, breed)\"] --> B[\"Dog class object\nin memory\"]\n    B --> C[\"rex = Dog('Rex', 'Lab')\nInstance 1\"]\n    B --> D[\"buddy = Dog('Buddy', 'Poodle')\nInstance 2\"]\n    C --> E[\"rex.name = 'Rex'\nrex.breed = 'Lab'\"]\n    D --> F[\"buddy.name = 'Buddy'\nbuddy.breed = 'Poodle'\"]\n    B --> G[\"Dog.species shared\nby all instances\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "The class is the blueprint — each instance has its own data but shares class attributes",
      "code": "class Dog:\n    # Class attribute — shared by all instances\n    species = \"Canis familiaris\"\n    count = 0\n\n    def __init__(self, name, breed, age):\n        # Instance attributes — unique to each instance\n        self.name = name\n        self.breed = breed\n        self.age = age\n        Dog.count += 1   # update class attribute\n\n# Create instances\nrex = Dog(\"Rex\", \"Labrador\", 3)\nbuddy = Dog(\"Buddy\", \"Poodle\", 5)\nluna = Dog(\"Luna\", \"Husky\", 2)\n\n# Instance attributes\nprint(rex.name)    # Rex\nprint(buddy.age)   # 5\n\n# Class attribute — same for all\nprint(rex.species)    # Canis familiaris\nprint(buddy.species)  # Canis familiaris\nprint(Dog.species)    # Canis familiaris\nprint(Dog.count)      # 3\n\n# Instance attribute shadows class attribute\nrex.species = \"Modified\"   # creates instance attribute\nprint(rex.species)    # Modified — instance attribute\nprint(buddy.species)  # Canis familiaris — class attribute unchanged\n\n# Check instance type\nprint(type(rex))              # <class '__main__.Dog'>\nprint(isinstance(rex, Dog))   # True",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Be careful with mutable class attributes (lists, dicts). If you define `items = []` as a class attribute and append to it via an instance, all instances share the same list. This is almost never what you want. Define mutable attributes in `__init__` as instance attributes: `self.items = []`."
      },
      "keyPoints": [
        "A class is a blueprint; an instance is an object created from it",
        "Call the class like a function to create an instance — Python calls __init__ automatically",
        "Instance attributes are unique to each instance — defined with self.attr = value",
        "Class attributes are shared by all instances — defined in the class body",
        "Never use mutable objects (lists, dicts) as class attributes — use instance attributes"
      ],
      "tryIt": "Create a Car class with class attribute 'wheels = 4' and instance attributes make, model, and year. Add a class attribute 'total_cars' that increments each time a Car is created. Create three cars and verify: each has its own make/model/year, all share wheels=4, and total_cars equals 3."
    }
  },

  {
    "id": 1057,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "__init__ and Instance Attributes",
    "type": "lesson",
    "content": {
      "body": "`__init__` is the initialiser method — it runs automatically when a new instance is created. Its job is to set up the instance's initial state by assigning values to instance attributes.\n\n## The self Parameter\n\nEvery instance method receives the instance itself as the first argument, conventionally named `self`. Python passes it automatically — you never pass it explicitly when calling a method. `self` is how the method accesses and modifies the instance's own data.\n\n## __init__ Signature\n\n`__init__` can take any parameters after `self`. These become the arguments you pass when creating an instance:\n\n```python\nclass Person:\n    def __init__(self, name, age, email=None):\n        self.name = name\n        self.age = age\n        self.email = email\n        self._id = generate_id()   # computed attribute\n```\n\n## Validation in __init__\n\n`__init__` is the right place to validate constructor arguments and raise exceptions for invalid input:\n\n```python\ndef __init__(self, age):\n    if age < 0:\n        raise ValueError(f\"Age cannot be negative: {age}\")\n    self.age = age\n```\n\n## __init__ Does Not Return\n\n`__init__` must not return a value (other than `None`). Returning anything else raises `TypeError`. The new instance is returned by `__new__` — `__init__` only initialises it.\n\n## Post-Initialisation\n\nFor complex initialisation logic, keep `__init__` simple and delegate to helper methods. This makes the class easier to test and subclass.",
      "diagram": "flowchart TD\n    A[\"Person('Alice', 30)\"] --> B[\"__new__\ncreate instance\"]\n    B --> C[\"__init__(self, 'Alice', 30)\ninitialise instance\"]\n    C --> D[\"self.name = 'Alice'\"]\n    C --> E[\"self.age = 30\"]\n    C --> F[\"self._id = generate_id()\"]\n    D --> G[\"Instance ready\nreturned to caller\"]\n    E --> G\n    F --> G\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "__new__ creates the instance; __init__ initialises it — you only need to write __init__",
      "code": "import uuid\nfrom datetime import datetime\n\nclass BankAccount:\n    def __init__(self, owner, initial_balance=0):\n        # Validate inputs\n        if not owner:\n            raise ValueError(\"Owner name cannot be empty\")\n        if initial_balance < 0:\n            raise ValueError(\"Initial balance cannot be negative\")\n\n        # Set instance attributes\n        self.owner = owner\n        self.balance = initial_balance\n        self._id = str(uuid.uuid4())[:8]   # private computed attr\n        self._created_at = datetime.now()\n        self._transactions = []            # mutable — instance attr!\n\n    def _record(self, amount, type_):\n        self._transactions.append({\n            \"amount\": amount,\n            \"type\": type_,\n            \"time\": datetime.now().isoformat()\n        })\n\nacc1 = BankAccount(\"Alice\", 1000)\nacc2 = BankAccount(\"Bob\")   # default balance 0\n\nprint(acc1.owner)    # Alice\nprint(acc1.balance)  # 1000\nprint(acc1._id)      # unique ID\n\n# Validation\ntry:\n    bad = BankAccount(\"\", 100)\nexcept ValueError as e:\n    print(f\"Error: {e}\")\n\n# Each instance has its own _transactions list\nacc1._transactions.append(\"test\")\nprint(len(acc2._transactions))   # 0 — separate list",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Keep `__init__` focused on setting up state. If initialisation requires complex logic, delegate to private helper methods: `self._setup_connection()`, `self._load_config()`. This keeps `__init__` readable and makes the class easier to subclass — subclasses can override helpers without rewriting the entire initialiser."
      },
      "keyPoints": [
        "__init__ runs automatically when an instance is created — sets up initial state",
        "self is the instance itself — Python passes it automatically, never pass it explicitly",
        "Validate constructor arguments in __init__ and raise exceptions for invalid input",
        "__init__ must not return a value — returning anything raises TypeError",
        "Define all mutable attributes in __init__ as instance attributes, not class attributes"
      ],
      "tryIt": "Write a Rectangle class with __init__ taking width and height. Validate that both are positive numbers. Add computed attributes: area (width * height) and perimeter (2 * (width + height)). Add a _created_at timestamp. Test with valid dimensions, zero dimensions, and negative dimensions."
    }
  },

  {
    "id": 1058,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "Instance Methods",
    "type": "lesson",
    "content": {
      "body": "Instance methods are functions defined inside a class that operate on an instance. They always receive `self` as their first parameter — the instance they are called on. Through `self`, they can read and modify the instance's attributes and call other methods.\n\n## Defining and Calling Methods\n\n```python\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return 3.14159 * self.radius ** 2\n\nc = Circle(5)\nprint(c.area())   # 78.54\n```\n\nWhen you call `c.area()`, Python automatically passes `c` as `self`. You never pass `self` explicitly.\n\n## Methods That Modify State\n\nMethods can modify the instance's attributes. This is how objects change over time:\n\n```python\ndef deposit(self, amount):\n    self.balance += amount\n    return self\n```\n\n## Method Chaining\n\nReturning `self` from a method enables method chaining — calling multiple methods in sequence on the same object:\n\n```python\naccount.deposit(100).deposit(200).withdraw(50)\n```\n\n## Helper Methods\n\nPrivate methods (prefixed with `_`) are implementation details — called by other methods but not intended for external use. They keep public methods clean and focused.\n\n## The Difference Between a Function and a Method\n\nA function is standalone. A method is bound to an instance — it always has access to the instance's state through `self`. The same logic written as a method is more cohesive because the data it operates on travels with it.",
      "diagram": "flowchart TD\n    A[\"c = Circle(5)\"] --> B[\"c.area()\"]\n    B --> C[\"Python calls\nCircle.area(c)\"]\n    C --> D[\"self = c\nself.radius = 5\"]\n    D --> E[\"return 3.14 * 5**2\n= 78.54\"]\n    F[\"Method chaining\"] --> G[\"acc.deposit(100)\"]\n    G -->|\"returns self\"| H[\".deposit(200)\"]\n    H -->|\"returns self\"| I[\".withdraw(50)\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "self is the instance — Python passes it automatically when you call a method",
      "code": "import math\n\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n        self._history = []\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Deposit must be positive\")\n        self.balance += amount\n        self._record(\"deposit\", amount)\n        return self   # enable chaining\n\n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Withdrawal must be positive\")\n        if amount > self.balance:\n            raise ValueError(\"Insufficient funds\")\n        self.balance -= amount\n        self._record(\"withdrawal\", amount)\n        return self\n\n    def get_balance(self):\n        return self.balance\n\n    def statement(self):\n        lines = [f\"Account: {self.owner}\"]\n        for entry in self._history:\n            lines.append(f\"  {entry['type']:10} {entry['amount']:>8.2f}\")\n        lines.append(f\"  {'Balance':10} {self.balance:>8.2f}\")\n        return \"\n\".join(lines)\n\n    def _record(self, type_, amount):\n        self._history.append({\"type\": type_, \"amount\": amount})\n\nacc = BankAccount(\"Alice\", 1000)\nacc.deposit(500).deposit(200).withdraw(100)   # chaining\nprint(acc.statement())\nprint(acc.get_balance())   # 1600",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Return `self` from methods that modify state to enable method chaining. This is the builder pattern — `account.deposit(100).withdraw(50)` reads naturally. Only do this for methods whose primary purpose is modification. Methods that compute and return a value (like `get_balance()`) should return the value, not `self`."
      },
      "keyPoints": [
        "Instance methods always take self as the first parameter — Python passes it automatically",
        "Through self, methods can read and modify the instance's attributes",
        "Return self from modifier methods to enable method chaining",
        "Private methods (prefixed with _) are implementation details — not for external use",
        "Methods are bound to instances — they always have access to the instance's state"
      ],
      "tryIt": "Add methods to your Rectangle class: scale(factor) that multiplies both dimensions by factor and returns self, is_square() that returns True if width equals height, and describe() that returns a formatted string like 'Rectangle 4x6 (area=24)'. Test method chaining: rect.scale(2).scale(0.5)."
    }
  },

  {
    "id": 1059,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "Encapsulation and Properties",
    "type": "lesson",
    "content": {
      "body": "Encapsulation means bundling data and methods together and controlling access to the internal state. In Python, this is done through naming conventions and the `@property` decorator rather than strict access modifiers.\n\n## Access Conventions\n\n**Public** (`name`) — accessible from anywhere. The default.\n\n**Protected** (`_name`) — single underscore signals \"internal use\". Accessible but conventionally not used outside the class or subclasses.\n\n**Private** (`__name`) — double underscore triggers name mangling. Python renames it to `_ClassName__name`, making accidental access from outside harder (but not impossible).\n\n## Why Encapsulation Matters\n\nDirect attribute access lets anyone set `account.balance = -1000000`. Encapsulation lets you enforce invariants — rules that must always be true about the object's state.\n\n## The @property Decorator\n\n`@property` turns a method into a read-only attribute. The caller accesses it like an attribute (`obj.area`) but Python calls the method behind the scenes.\n\n```python\n@property\ndef area(self):\n    return self.width * self.height\n```\n\n## Getters and Setters\n\nPair `@property` with `@name.setter` to add validation when an attribute is set:\n\n```python\n@balance.setter\ndef balance(self, value):\n    if value < 0:\n        raise ValueError(\"Balance cannot be negative\")\n    self._balance = value\n```",
      "diagram": "flowchart TD\n    A[\"@property\"] --> B[\"Read like attribute\nacc.balance\"]\n    B --> C[\"Calls getter method\nbehind the scenes\"]\n    D[\"@balance.setter\"] --> E[\"acc.balance = 500\"]\n    E --> F[\"Calls setter method\nvalidates then stores\"]\n    G[\"_name convention\"] --> H[\"Protected\nuse with care\"]\n    I[\"__name mangling\"] --> J[\"_Class__name\nharder to access\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "@property makes methods look like attributes — add a setter to validate on assignment",
      "code": "class Temperature:\n    def __init__(self, celsius=0):\n        self.celsius = celsius   # uses the setter\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError(f\"Temperature below absolute zero: {value}\")\n        self._celsius = value\n\n    @property\n    def fahrenheit(self):\n        return self._celsius * 9/5 + 32   # computed, read-only\n\n    @property\n    def kelvin(self):\n        return self._celsius + 273.15\n\nt = Temperature(100)\nprint(t.celsius)     # 100\nprint(t.fahrenheit)  # 212.0\nprint(t.kelvin)      # 373.15\n\nt.celsius = 0        # uses setter — validates\nprint(t.fahrenheit)  # 32.0\n\ntry:\n    t.celsius = -300   # raises ValueError\nexcept ValueError as e:\n    print(e)\n\n# t.fahrenheit = 100  # AttributeError — no setter defined\n\n# Name mangling\nclass Safe:\n    def __init__(self, code):\n        self.__code = code   # mangled to _Safe__code\n\n    def unlock(self, attempt):\n        return attempt == self.__code\n\ns = Safe(\"1234\")\nprint(s.unlock(\"1234\"))   # True\n# print(s.__code)         # AttributeError\nprint(s._Safe__code)      # \"1234\" — accessible but discouraged",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Start with public attributes. Add `@property` when you need to compute a value or add validation. Do not add getters and setters for every attribute by default — that is Java-style boilerplate that Python does not need. The Pythonic approach is to use plain attributes until you have a reason to add a property."
      },
      "keyPoints": [
        "Single underscore _name signals protected — accessible but conventionally internal",
        "Double underscore __name triggers name mangling — harder but not impossible to access",
        "@property makes a method accessible like an attribute — no parentheses needed",
        "@name.setter adds validation when the attribute is assigned",
        "Start with public attributes — add @property only when you need computation or validation"
      ],
      "tryIt": "Add a @property to your BankAccount class: balance should be read via a property that returns self._balance. Add a setter that raises ValueError for negative values. Add a read-only property interest_rate that returns a fixed 0.05. Test that direct assignment to balance goes through the setter."
    }
  },

  {
    "id": 1060,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "Inheritance",
    "type": "lesson",
    "content": {
      "body": "Inheritance lets a class acquire the attributes and methods of another class. The inheriting class (subclass or child) extends or specialises the behaviour of the inherited class (superclass or parent). This avoids code duplication and models \"is-a\" relationships.\n\n## Syntax\n\n```python\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        raise NotImplementedError\n\nclass Dog(Animal):\n    def speak(self):\n        return f\"{self.name} says Woof!\"\n```\n\n`Dog` inherits everything from `Animal` and overrides `speak()`.\n\n## What Is Inherited\n\nThe subclass inherits all public and protected methods and attributes. It can:\n- Use them as-is\n- Override them with its own implementation\n- Extend them by calling the parent's version with `super()`\n\n## super()\n\n`super()` gives access to the parent class. The most common use is calling the parent's `__init__` to initialise inherited attributes before adding new ones:\n\n```python\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)   # initialise Animal part\n        self.breed = breed       # add Dog-specific attribute\n```\n\n## isinstance() and issubclass()\n\n`isinstance(obj, Class)` returns `True` if `obj` is an instance of `Class` or any subclass. `issubclass(Sub, Parent)` checks the class hierarchy.",
      "diagram": "flowchart TD\n    A[\"Animal\n__init__(name)\nspeak()\ndescribe()\"] --> B[\"Dog(Animal)\nspeak() → 'Woof'\nfetch()\"]\n    A --> C[\"Cat(Animal)\nspeak() → 'Meow'\npurr()\"]\n    A --> D[\"Bird(Animal)\nspeak() → 'Tweet'\nfly()\"]\n    B --> E[\"rex = Dog('Rex','Lab')\nrex.speak()\nrex.describe()\nrex.fetch()\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166634",
      "diagramCaption": "Subclasses inherit all parent methods and can override or extend them",
      "code": "class Animal:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def speak(self):\n        raise NotImplementedError(f\"{type(self).__name__} must implement speak()\")\n\n    def describe(self):\n        return f\"{self.name} ({type(self).__name__}, age {self.age})\"\n\nclass Dog(Animal):\n    def __init__(self, name, age, breed):\n        super().__init__(name, age)   # call parent __init__\n        self.breed = breed\n\n    def speak(self):\n        return f\"{self.name} says: Woof!\"\n\n    def fetch(self, item):\n        return f\"{self.name} fetches the {item}!\"\n\nclass Cat(Animal):\n    def speak(self):\n        return f\"{self.name} says: Meow!\"\n\nclass GuideDog(Dog):\n    def __init__(self, name, age, breed, owner):\n        super().__init__(name, age, breed)\n        self.owner = owner\n\n    def describe(self):\n        base = super().describe()\n        return f\"{base} — guide dog for {self.owner}\"\n\nrex = Dog(\"Rex\", 3, \"Labrador\")\nwhiskers = Cat(\"Whiskers\", 5)\nbuddy = GuideDog(\"Buddy\", 4, \"Golden\", \"Alice\")\n\nprint(rex.speak())       # Rex says: Woof!\nprint(whiskers.speak())  # Whiskers says: Meow!\nprint(buddy.describe())  # Buddy (GuideDog, age 4) — guide dog for Alice\nprint(rex.fetch(\"ball\")) # Rex fetches the ball!\n\nprint(isinstance(rex, Dog))     # True\nprint(isinstance(rex, Animal))  # True — Dog is an Animal\nprint(issubclass(Dog, Animal))  # True",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Always call `super().__init__()` in a subclass `__init__` when the parent has one. Forgetting it means the parent's attributes are never set up — methods that rely on them will raise `AttributeError`. The call should be the first line of the subclass `__init__`, before setting any subclass-specific attributes."
      },
      "keyPoints": [
        "Inheritance models 'is-a' relationships — Dog is an Animal",
        "Subclasses inherit all parent methods and can override or extend them",
        "super().__init__() calls the parent initialiser — always call it first",
        "isinstance(obj, Class) returns True for the class and all its subclasses",
        "Use NotImplementedError in parent methods that subclasses must implement"
      ],
      "tryIt": "Create a Shape base class with __init__(color) and abstract area() and perimeter() methods (raise NotImplementedError). Create Circle(Shape) and Rectangle(Shape) subclasses that implement both methods. Create a Triangle(Shape) subclass too. Write a function total_area(shapes) that sums the areas of a mixed list of shapes."
    }
  },

  {
    "id": 1061,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "Method Overriding and super()",
    "type": "lesson",
    "content": {
      "body": "Method overriding is when a subclass provides its own implementation of a method inherited from the parent. The subclass version replaces the parent version for instances of the subclass. `super()` lets you call the parent's version from inside the override.\n\n## Overriding\n\nDefine a method with the same name in the subclass. When called on a subclass instance, Python uses the subclass version — the parent version is shadowed.\n\n```python\nclass Animal:\n    def speak(self):\n        return \"Some sound\"\n\nclass Dog(Animal):\n    def speak(self):\n        return \"Woof!\"   # overrides Animal.speak()\n```\n\n## Extending with super()\n\nOften you want to extend the parent's behaviour rather than replace it entirely. Call `super().method()` to run the parent's version, then add your own logic:\n\n```python\nclass Dog(Animal):\n    def describe(self):\n        base = super().describe()\n        return f\"{base} — breed: {self.breed}\"\n```\n\n## super() in __init__\n\nThe most common use of `super()` is in `__init__` to initialise the parent's attributes before adding the subclass's own:\n\n```python\ndef __init__(self, name, breed):\n    super().__init__(name)   # parent's __init__\n    self.breed = breed       # subclass-specific\n```\n\n## Method Resolution Order (MRO)\n\nPython uses the C3 linearisation algorithm to determine which method to call in complex inheritance hierarchies. `ClassName.__mro__` shows the order. For single inheritance, it is just child → parent → object.",
      "diagram": "flowchart TD\n    A[\"dog.speak()\"] --> B{\"Dog has\nspeak()?\"}\n    B -->|\"Yes\"| C[\"Call Dog.speak()\noverride\"]\n    B -->|\"No\"| D[\"Check parent\nAnimal.speak()\"]\n    E[\"super().method()\"] --> F[\"Call parent's\nversion explicitly\"]\n    F --> G[\"Extend behaviour\nparent + child logic\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Overriding replaces the parent method; super() calls it to extend behaviour",
      "code": "class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def describe(self):\n        return f\"{self.name} — salary: {self.salary:,.0f}\"\n\n    def annual_bonus(self):\n        return self.salary * 0.05\n\nclass Manager(Employee):\n    def __init__(self, name, salary, department):\n        super().__init__(name, salary)   # parent's __init__\n        self.department = department\n\n    def describe(self):\n        base = super().describe()        # parent's describe()\n        return f\"{base} — manages {self.department}\"\n\n    def annual_bonus(self):\n        base = super().annual_bonus()    # parent's bonus\n        return base + 5000               # manager gets extra\n\nclass Executive(Manager):\n    def __init__(self, name, salary, department, stock_options):\n        super().__init__(name, salary, department)\n        self.stock_options = stock_options\n\n    def annual_bonus(self):\n        base = super().annual_bonus()\n        return base + self.stock_options * 100\n\nemp = Employee(\"Alice\", 50000)\nmgr = Manager(\"Bob\", 80000, \"Engineering\")\nexec = Executive(\"Carol\", 150000, \"Product\", 1000)\n\nprint(emp.describe())\nprint(mgr.describe())\nprint(exec.describe())\n\nprint(f\"Alice bonus: {emp.annual_bonus():,.0f}\")\nprint(f\"Bob bonus: {mgr.annual_bonus():,.0f}\")\nprint(f\"Carol bonus: {exec.annual_bonus():,.0f}\")\n\n# Check MRO\nprint(Executive.__mro__)",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use `super()` instead of calling the parent class by name: `super().__init__()` not `Animal.__init__(self)`. `super()` works correctly with multiple inheritance and makes refactoring easier — if you change the parent class, you do not need to update every `super()` call."
      },
      "keyPoints": [
        "Overriding replaces a parent method with a subclass version",
        "super() calls the parent's version — use it to extend rather than replace",
        "Always call super().__init__() in a subclass __init__ before adding subclass attributes",
        "isinstance(obj, Parent) returns True for the parent and all subclasses",
        "ClassName.__mro__ shows the method resolution order for complex hierarchies"
      ],
      "tryIt": "Create a Vehicle base class with __init__(make, model, year) and a describe() method. Create Car(Vehicle) that adds doors and overrides describe() to include them. Create ElectricCar(Car) that adds battery_size and overrides describe() again. Use super() in both subclasses. Create one of each and print their descriptions."
    }
  },

  {
    "id": 1062,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "Dunder Methods",
    "type": "lesson",
    "content": {
      "body": "Dunder methods (double underscore methods, also called magic methods) let you define how your objects behave with Python's built-in operations. They are called automatically by Python when you use operators, built-in functions, or language constructs.\n\n## Essential Dunder Methods\n\n**`__init__(self, ...)`** — initialiser, called when creating an instance.\n\n**`__str__(self)`** — returns a human-readable string. Called by `str()` and `print()`.\n\n**`__repr__(self)`** — returns an unambiguous representation. Called by `repr()` and in the REPL. Should ideally be valid Python code that recreates the object.\n\n**`__len__(self)`** — returns the length. Called by `len()`.\n\n**`__getitem__(self, key)`** — enables indexing: `obj[key]`.\n\n**`__setitem__(self, key, value)`** — enables assignment: `obj[key] = value`.\n\n**`__contains__(self, item)`** — enables membership testing: `item in obj`.\n\n## Operator Overloading\n\n**`__add__(self, other)`** — defines `+`\n**`__eq__(self, other)`** — defines `==`\n**`__lt__(self, other)`** — defines `<`\n\nImplementing these lets your objects work with Python's operators naturally.\n\n## Comparison Methods\n\nImplement `__eq__` and `__lt__` to make objects sortable and comparable. Python derives the other comparison operators from these two.",
      "diagram": "flowchart TD\n    A[\"Dunder Methods\"] --> B[\"__str__\nprint(obj)\"]\n    A --> C[\"__repr__\nrepr(obj)\"]\n    A --> D[\"__len__\nlen(obj)\"]\n    A --> E[\"__getitem__\nobj[key]\"]\n    A --> F[\"__add__\nobj + other\"]\n    A --> G[\"__eq__\nobj == other\"]\n    B --> H[\"Human-readable\nfor users\"]\n    C --> I[\"Unambiguous\nfor developers\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Dunder methods make your objects behave like built-in types",
      "code": "class Vector:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __str__(self):\n        return f\"Vector({self.x}, {self.y})\"\n\n    def __repr__(self):\n        return f\"Vector({self.x!r}, {self.y!r})\"\n\n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n\n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y\n\n    def __len__(self):\n        return 2   # 2D vector\n\n    def __getitem__(self, index):\n        if index == 0: return self.x\n        if index == 1: return self.y\n        raise IndexError(\"Vector index out of range\")\n\nv1 = Vector(3, 4)\nv2 = Vector(1, 2)\n\nprint(v1)           # Vector(3, 4) — calls __str__\nprint(repr(v1))     # Vector(3, 4) — calls __repr__\nprint(v1 + v2)      # Vector(4, 6) — calls __add__\nprint(v1 == v2)     # False — calls __eq__\nprint(len(v1))      # 2 — calls __len__\nprint(v1[0], v1[1]) # 3 4 — calls __getitem__\n\n# Sorting with __lt__\nclass Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    def __lt__(self, other):\n        return self.age < other.age\n    def __repr__(self):\n        return f\"Person({self.name!r}, {self.age})\"\n\npeople = [Person(\"Alice\", 30), Person(\"Bob\", 25), Person(\"Carol\", 35)]\nprint(sorted(people))   # sorted by age",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Always implement both `__str__` and `__repr__`. `__str__` is for end users — make it readable. `__repr__` is for developers — make it unambiguous and ideally valid Python code. The convention: `repr(obj)` should produce code that recreates the object: `Vector(3, 4)` not `<Vector at 0x...>`."
      },
      "keyPoints": [
        "Dunder methods define how objects behave with built-in operations and operators",
        "__str__ for print(), __repr__ for repr() and the REPL — implement both",
        "__add__, __eq__, __lt__ enable +, ==, < operators on your objects",
        "__len__, __getitem__, __contains__ make objects behave like sequences",
        "Implementing __eq__ and __lt__ makes objects sortable with sorted()"
      ],
      "tryIt": "Add dunder methods to your Rectangle class: __str__ for a readable description, __repr__ for recreation code, __eq__ to compare by area, __lt__ to sort by area, __add__ to create a new rectangle with combined dimensions. Test each by printing, comparing, sorting a list, and adding two rectangles."
    }
  },

  {
    "id": 1063,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "Class and Static Methods",
    "type": "lesson",
    "content": {
      "body": "Instance methods operate on an instance (`self`). Class methods operate on the class itself (`cls`). Static methods are just regular functions that happen to live in the class namespace — they take neither `self` nor `cls`.\n\n## Class Methods\n\nDecorated with `@classmethod`. Receive the class as the first argument (`cls`). Used for alternative constructors, factory methods, and operations that affect the class rather than an instance.\n\n```python\n@classmethod\ndef from_string(cls, text):\n    name, age = text.split(\",\")\n    return cls(name, int(age))\n```\n\n## Static Methods\n\nDecorated with `@staticmethod`. Take no special first argument. Used for utility functions that are logically related to the class but do not need access to instance or class data.\n\n```python\n@staticmethod\ndef is_valid_age(age):\n    return 0 < age < 150\n```\n\n## When to Use Each\n\n**Instance method** — needs access to instance data (`self.attribute`). Most methods are instance methods.\n\n**Class method** — needs access to the class itself. Alternative constructors, factory methods, class-level operations.\n\n**Static method** — logically belongs with the class but needs neither instance nor class data. Validators, formatters, converters.\n\n## Alternative Constructors\n\nClass methods are the standard pattern for alternative constructors — different ways to create an instance from different input formats.",
      "diagram": "flowchart TD\n    A[\"Method Types\"] --> B[\"Instance method\ndef method(self)\"]\n    A --> C[\"Class method\n@classmethod\ndef method(cls)\"]\n    A --> D[\"Static method\n@staticmethod\ndef method()\"]\n    B --> E[\"Operates on\ninstance data\"]\n    C --> F[\"Operates on\nclass itself\"]\n    D --> G[\"No access to\ninstance or class\"]\n    F --> H[\"Alternative\nconstructors\"]\n    G --> I[\"Utility functions\nvalidators\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#e2e8f0,stroke:#94a3b8,color:#1a1a1a",
      "diagramCaption": "Instance methods use self; class methods use cls; static methods use neither",
      "code": "from datetime import date\n\nclass Person:\n    def __init__(self, name, birth_year):\n        self.name = name\n        self.birth_year = birth_year\n\n    # Instance method — uses self\n    def age(self):\n        return date.today().year - self.birth_year\n\n    # Class method — alternative constructor\n    @classmethod\n    def from_birth_date(cls, name, birth_date):\n        return cls(name, birth_date.year)\n\n    @classmethod\n    def from_string(cls, text):\n        name, year = text.split(\",\")\n        return cls(name, int(year))\n\n    # Static method — no self or cls\n    @staticmethod\n    def is_valid_year(year):\n        return 1900 <= year <= date.today().year\n\n# Instance method\np1 = Person(\"Alice\", 1990)\nprint(p1.age())   # 35 (in 2025)\n\n# Class method — alternative constructor\np2 = Person.from_birth_date(\"Bob\", date(1985, 6, 15))\nprint(p2.age())   # 40\n\np3 = Person.from_string(\"Carol,1995\")\nprint(p3.age())   # 30\n\n# Static method — called on class or instance\nprint(Person.is_valid_year(2000))   # True\nprint(p1.is_valid_year(1800))       # False\n\n# Class method can access class attributes\nclass Counter:\n    count = 0\n\n    def __init__(self):\n        Counter.count += 1\n\n    @classmethod\n    def get_count(cls):\n        return cls.count\n\nc1 = Counter()\nc2 = Counter()\nprint(Counter.get_count())   # 2",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use class methods for alternative constructors: `Person.from_string()`, `Date.from_timestamp()`, `Config.from_file()`. This is cleaner than overloading `__init__` with complex type checking. Each class method has a clear name that describes what input format it expects."
      },
      "keyPoints": [
        "Instance methods take self — operate on instance data",
        "Class methods take cls — operate on the class itself, used for alternative constructors",
        "Static methods take neither — utility functions logically grouped with the class",
        "Class methods are the standard pattern for factory methods and alternative constructors",
        "Call class methods on the class or an instance; static methods work the same way"
      ],
      "tryIt": "Add to your BankAccount class: a class method from_dict(data) that creates an account from a dict with 'owner' and 'balance' keys, a class method get_total_accounts() that returns how many accounts have been created (use a class attribute counter), and a static method is_valid_amount(amount) that checks if an amount is positive."
    }
  },

  {
    "id": 1064,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "OOP bugs range from immediate crashes to subtle design problems that make code hard to maintain. These are the patterns that trip up beginners most often.\n\n## Mistake 1 — Forgetting self\n\nDefining a method without `self` as the first parameter, or forgetting to use `self` to access instance attributes inside a method. Python raises `TypeError` when calling the method.\n\n## Mistake 2 — Not Calling super().__init__()\n\nForgetting to call the parent's `__init__` in a subclass means the parent's attributes are never set up. Methods that rely on them raise `AttributeError`.\n\n## Mistake 3 — Mutable Class Attributes\n\nUsing a list or dict as a class attribute. All instances share the same object — appending to it from one instance affects all others. Always define mutable attributes in `__init__`.\n\n## Mistake 4 — Overusing Inheritance\n\nInheritance models \"is-a\" relationships. Using it for \"has-a\" relationships (composition) creates fragile hierarchies. Prefer composition over inheritance when an object contains another object rather than being a specialisation of it.\n\n## Mistake 5 — Missing __str__ and __repr__\n\nWithout these, `print(obj)` shows `<__main__.MyClass object at 0x...>` — useless for debugging. Always implement both.\n\n## Mistake 6 — Modifying Class Attributes via Instance\n\n`instance.class_attr = value` creates a new instance attribute that shadows the class attribute — it does not modify the class attribute. Use `ClassName.class_attr = value` to modify the class attribute.",
      "diagram": "flowchart TD\n    A[\"OOP Mistakes\"] --> B[\"Missing self\nTypeError on call\"]\n    A --> C[\"No super().__init__\nAttributeError\"]\n    A --> D[\"Mutable class attr\nshared across instances\"]\n    A --> E[\"Overusing inheritance\nfragile hierarchy\"]\n    A --> F[\"No __str__ __repr__\nuseless debug output\"]\n    A --> G[\"instance.class_attr =\nshadows not modifies\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Mutable class attributes and missing super().__init__() are the most common silent bugs",
      "code": "# Mistake 1 — missing self\nclass Counter:\n    def __init__(self):\n        self.count = 0\n    # def increment():   # TypeError — missing self\n    def increment(self):\n        self.count += 1\n\n# Mistake 2 — missing super().__init__()\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        # super().__init__(name)  # forgot this!\n        super().__init__(name)    # correct\n        self.breed = breed\n\n# Mistake 3 — mutable class attribute\nclass BadTeam:\n    members = []   # shared by ALL instances!\n\nclass GoodTeam:\n    def __init__(self):\n        self.members = []   # each instance gets its own\n\nt1 = BadTeam()\nt2 = BadTeam()\nt1.members.append(\"Alice\")\nprint(t2.members)   # ['Alice'] — oops!\n\ng1 = GoodTeam()\ng2 = GoodTeam()\ng1.members.append(\"Alice\")\nprint(g2.members)   # [] — correct\n\n# Mistake 4 — inheritance vs composition\n# BAD: Car inherits Engine (Car is not an Engine)\n# GOOD: Car has an Engine\nclass Engine:\n    def start(self): return \"Vroom\"\n\nclass Car:\n    def __init__(self):\n        self.engine = Engine()   # composition\n    def start(self):\n        return self.engine.start()\n\n# Mistake 5 — no __str__\nclass Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    def __repr__(self):\n        return f\"Point({self.x}, {self.y})\"\n    def __str__(self):\n        return f\"({self.x}, {self.y})\"\n\n# Mistake 6 — shadowing class attribute\nclass Config:\n    debug = False\n\nc = Config()\nc.debug = True          # creates instance attribute\nprint(Config.debug)     # False — class unchanged!\nConfig.debug = True     # correct way to modify class attr",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Prefer composition over inheritance. If you find yourself writing deep inheritance hierarchies (more than 2-3 levels), or inheriting just to reuse code rather than to model an 'is-a' relationship, refactor to composition. A Car has an Engine — it is not an Engine. Composition is more flexible and easier to test."
      },
      "keyPoints": [
        "Every instance method must have self as the first parameter",
        "Always call super().__init__() in subclass __init__ before adding subclass attributes",
        "Never use mutable objects as class attributes — define them in __init__",
        "Prefer composition over inheritance for 'has-a' relationships",
        "Always implement __str__ and __repr__ for useful debug output"
      ],
      "tryIt": "Find and fix all six bugs: (1) a method missing self, (2) a subclass __init__ not calling super(), (3) a mutable list as a class attribute, (4) inheritance used where composition is appropriate, (5) a class with no __repr__, (6) an instance assignment that should modify the class attribute."
    }
  },

  {
    "id": 1065,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming",
    "title": "Module 14 Summary",
    "type": "lesson",
    "content": {
      "body": "This module introduced Object-Oriented Programming — one of the most important paradigms in software development. You can now model real-world entities as Python objects with state and behaviour.\n\n## What You Learned\n\n**OOP fundamentals** — objects bundle data (attributes) and behaviour (methods). The four pillars: Encapsulation, Inheritance, Polymorphism, Abstraction.\n\n**Classes and instances** — a class is a blueprint; an instance is an object created from it. Class attributes are shared; instance attributes are unique to each instance.\n\n**__init__** — the initialiser. Sets up instance state. Validates inputs. Always define mutable attributes here, not as class attributes.\n\n**Instance methods** — take `self`. Access and modify instance data. Return `self` for method chaining. Private methods prefixed with `_`.\n\n**Encapsulation and properties** — `@property` makes methods look like attributes. `@name.setter` adds validation. Start with public attributes; add properties when needed.\n\n**Inheritance** — subclasses inherit parent methods and can override or extend them. Always call `super().__init__()`. Use `isinstance()` to check type.\n\n**Method overriding and super()** — override to replace; use `super()` to extend. MRO determines which method is called.\n\n**Dunder methods** — `__str__`, `__repr__`, `__add__`, `__eq__`, `__lt__` make objects behave like built-in types.\n\n**Class and static methods** — `@classmethod` for alternative constructors; `@staticmethod` for utility functions.\n\n## What Is Coming Next\n\nModule 15 introduces **advanced Python topics** — decorators, context managers, generators, and the patterns used in professional Python codebases.",
      "diagram": "flowchart TD\n    A[\"✅ OOP concepts\nfour pillars\"] --> B[\"✅ Classes & instances\nblueprint vs object\"]\n    B --> C[\"✅ __init__\ninitialiser\"]\n    C --> D[\"✅ Instance methods\nself chaining\"]\n    D --> E[\"✅ Encapsulation\n@property setter\"]\n    E --> F[\"✅ Inheritance\nsuper() isinstance\"]\n    F --> G[\"✅ Dunder methods\n__str__ __repr__\"]\n    G --> H[\"✅ Class & static\n@classmethod @staticmethod\"]\n    H --> I[\"➡️ Advanced Python\nModule 15\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 14 complete — OOP is the foundation of large-scale Python development",
      "code": "from datetime import datetime\n\nclass BankAccount:\n    _total = 0\n\n    def __init__(self, owner, balance=0):\n        if not owner:\n            raise ValueError(\"Owner required\")\n        if balance < 0:\n            raise ValueError(\"Balance cannot be negative\")\n        self.owner = owner\n        self._balance = balance\n        self._history = []\n        BankAccount._total += 1\n\n    @property\n    def balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Amount must be positive\")\n        self._balance += amount\n        self._history.append((\"deposit\", amount))\n        return self\n\n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Amount must be positive\")\n        if amount > self._balance:\n            raise ValueError(\"Insufficient funds\")\n        self._balance -= amount\n        self._history.append((\"withdrawal\", amount))\n        return self\n\n    @classmethod\n    def from_dict(cls, data):\n        return cls(data[\"owner\"], data.get(\"balance\", 0))\n\n    @staticmethod\n    def is_valid_amount(amount):\n        return isinstance(amount, (int, float)) and amount > 0\n\n    @classmethod\n    def total_accounts(cls):\n        return cls._total\n\n    def __str__(self):\n        return f\"Account({self.owner}, balance={self._balance})\"\n\n    def __repr__(self):\n        return f\"BankAccount({self.owner!r}, {self._balance})\"\n\nacc = BankAccount(\"Alice\", 1000)\nacc.deposit(500).withdraw(200)\nprint(acc)\nprint(BankAccount.total_accounts())",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Before moving on, make sure you can write a complete class from memory: __init__ with validation, instance methods, a @property with setter, a classmethod alternative constructor, __str__ and __repr__. If you can build the BankAccount above without looking at examples, you have genuinely mastered Module 14."
      },
      "keyPoints": [
        "Classes bundle state and behaviour — instances are independent objects from the blueprint",
        "Always call super().__init__() in subclasses; never use mutable class attributes",
        "@property adds computed attributes and validation without changing the calling syntax",
        "Dunder methods make objects behave like built-in types — always implement __str__ and __repr__",
        "Prefer composition over inheritance for 'has-a' relationships"
      ],
      "tryIt": "From memory, build a complete Library system: a Book class (title, author, isbn, available), a Library class with add_book(), checkout(isbn), return_book(isbn), and search(query) methods. Use @property for available_count, a classmethod from_catalog(data), __str__ and __repr__ on both classes."
    }
  },

  {
    "id": 1066,
    "moduleId": 15,
    "moduleTitle": "Virtual Environments & pip",
    "title": "What Is a Virtual Environment?",
    "type": "lesson",
    "content": {
      "body": "A virtual environment is an isolated Python installation for a specific project. It has its own copy of the Python interpreter and its own set of installed packages, completely separate from your system Python and from other projects.\n\n## The Problem Without Virtual Environments\n\nWithout virtual environments, all Python packages are installed globally. Project A needs `requests==2.28` and Project B needs `requests==2.31`. You cannot have both installed globally at the same time. Upgrading for one project breaks the other.\n\n## What a Virtual Environment Contains\n\n- A copy of (or symlink to) the Python interpreter\n- A `site-packages` directory for installed packages\n- Scripts to activate/deactivate the environment\n- An isolated `pip` that installs only into this environment\n\n## The Standard Tool: venv\n\nPython 3.3+ includes `venv` in the standard library. It is the official, built-in way to create virtual environments. No installation needed.\n\n```bash\npython -m venv .venv\n```\n\nThis creates a `.venv` directory in your project. The dot prefix hides it from directory listings and signals it is not source code.\n\n## One Environment Per Project\n\nThe convention is one virtual environment per project, stored in the project directory (usually named `.venv` or `venv`). Never commit the virtual environment to version control — add it to `.gitignore`.",
      "diagram": "flowchart TD\n    A[\"System Python\nglobal packages\"] --> B[\"Project A\n.venv/\nrequests 2.28\"]\n    A --> C[\"Project B\n.venv/\nrequests 2.31\"]\n    A --> D[\"Project C\n.venv/\nDjango 4.2\"]\n    B --> E[\"Isolated\nno conflicts\"]\n    C --> E\n    D --> E\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Each project gets its own isolated environment — no version conflicts between projects",
      "code": "# Create a virtual environment\n# Run in your terminal (not in Python):\n\n# Create .venv in current directory\n# python -m venv .venv\n\n# What gets created:\n# .venv/\n#   bin/          (macOS/Linux) or Scripts/ (Windows)\n#     python\n#     pip\n#     activate\n#   lib/\n#     python3.x/\n#       site-packages/   (installed packages go here)\n#   pyvenv.cfg\n\n# Check Python version inside venv\n# python --version\n\n# See where Python is coming from\nimport sys\nprint(sys.executable)   # shows path to current Python\nprint(sys.prefix)       # shows the environment root\n\n# Check if inside a virtual environment\nimport os\nin_venv = hasattr(sys, 'real_prefix') or (\n    hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix\n)\nprint(f\"In virtual environment: {in_venv}\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Always add your virtual environment directory to `.gitignore`. It contains compiled binaries and platform-specific files that should not be committed. Other developers recreate it from `requirements.txt`. A typical `.gitignore` entry: `.venv/` or `venv/`."
      },
      "keyPoints": [
        "Virtual environments isolate project dependencies — no version conflicts between projects",
        "python -m venv .venv creates a virtual environment in the current directory",
        "Each project should have its own virtual environment",
        "Never commit the virtual environment to version control — add it to .gitignore",
        "venv is built into Python 3.3+ — no installation needed"
      ],
      "tryIt": "Create a new project directory. Inside it, create a virtual environment with python -m venv .venv. Inspect the directory structure it creates. Run python inside the venv and check sys.executable to confirm you are using the venv's Python. Then check sys.prefix to see the environment root."
    }
  },

  {
    "id": 1067,
    "moduleId": 15,
    "moduleTitle": "Virtual Environments & pip",
    "title": "Creating and Activating venvs",
    "type": "lesson",
    "content": {
      "body": "Creating a virtual environment is one command. Activating it tells your terminal to use that environment's Python and pip for all subsequent commands.\n\n## Creating\n\n```bash\npython -m venv .venv\n```\n\nUse `python3` if `python` points to Python 2 on your system. The `.venv` name is conventional — you can use any name.\n\n## Activating\n\nActivation modifies your shell's `PATH` to put the venv's `bin` (or `Scripts`) directory first. After activation, `python` and `pip` refer to the venv's versions.\n\n**macOS / Linux:**\n```bash\nsource .venv/bin/activate\n```\n\n**Windows (Command Prompt):**\n```cmd\n.venv\\Scripts\\activate.bat\n```\n\n**Windows (PowerShell):**\n```powershell\n.venv\\Scripts\\Activate.ps1\n```\n\n## Confirming Activation\n\nYour terminal prompt changes to show the environment name: `(.venv) user@machine:~$`. Run `which python` (macOS/Linux) or `where python` (Windows) to confirm it points to the venv.\n\n## Deactivating\n\n```bash\ndeactivate\n```\n\nThis restores your original `PATH`. The virtual environment still exists — you just are not using it.\n\n## IDE Integration\n\nVS Code, PyCharm, and most IDEs detect virtual environments automatically. Select the venv's Python interpreter in your IDE settings to get correct autocomplete and linting.",
      "diagram": "flowchart TD\n    A[\"python -m venv .venv\ncreate environment\"] --> B[\".venv/ directory\ncreated\"]\n    B --> C[\"source .venv/bin/activate\nactivate on macOS/Linux\"]\n    B --> D[\".venv/Scripts/activate\nactivate on Windows\"]\n    C --> E[\"(.venv) prompt\nPATH updated\"]\n    D --> E\n    E --> F[\"pip install ...\ninstalls into .venv\"]\n    E --> G[\"python script.py\nuses .venv Python\"]\n    H[\"deactivate\"] --> I[\"Restore original PATH\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Activation updates PATH — all python and pip commands use the venv until you deactivate",
      "code": "# Full workflow — run in terminal\n\n# 1. Create project directory\n# mkdir myproject && cd myproject\n\n# 2. Create virtual environment\n# python -m venv .venv\n\n# 3. Activate (macOS/Linux)\n# source .venv/bin/activate\n\n# 3. Activate (Windows PowerShell)\n# .venv\\Scripts\\Activate.ps1\n\n# 4. Confirm activation\n# which python          # macOS/Linux\n# where python          # Windows\n# Should show: /path/to/myproject/.venv/bin/python\n\n# 5. Install packages (into the venv only)\n# pip install requests\n\n# 6. Run your script\n# python main.py\n\n# 7. Deactivate when done\n# deactivate\n\n# In Python — check current environment\nimport sys\nprint(sys.executable)\n# /path/to/myproject/.venv/bin/python3\n\n# Useful: create venv and activate in one step (macOS/Linux)\n# python -m venv .venv && source .venv/bin/activate",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Configure your IDE to use the venv's Python interpreter automatically. In VS Code: Ctrl+Shift+P → 'Python: Select Interpreter' → choose the .venv option. This ensures the integrated terminal activates the venv automatically and gives you correct autocomplete for installed packages."
      },
      "keyPoints": [
        "source .venv/bin/activate on macOS/Linux; .venv\\Scripts\\activate on Windows",
        "Activation updates PATH — python and pip now refer to the venv's versions",
        "The (.venv) prompt prefix confirms the environment is active",
        "deactivate restores the original PATH — the venv still exists",
        "Configure your IDE to use the venv's interpreter for autocomplete and linting"
      ],
      "tryIt": "Create a virtual environment, activate it, and verify activation with which python. Install the requests library with pip install requests. Write a short Python script that imports requests and prints requests.__version__. Deactivate the venv and try running the same script — observe the ImportError."
    }
  },

  {
    "id": 1068,
    "moduleId": 15,
    "moduleTitle": "Virtual Environments & pip",
    "title": "Installing Packages with pip",
    "type": "lesson",
    "content": {
      "body": "`pip` is Python's package installer. It downloads packages from PyPI (the Python Package Index) and installs them into the active environment. With a virtual environment active, all pip operations affect only that environment.\n\n## Basic Commands\n\n```bash\npip install requests          # install latest version\npip install requests==2.31.0  # install specific version\npip install \"requests>=2.28\"  # install minimum version\npip install requests flask    # install multiple packages\npip install -U requests       # upgrade to latest\npip uninstall requests        # remove a package\n```\n\n## Listing and Inspecting\n\n```bash\npip list                      # all installed packages\npip show requests             # details about a package\npip check                     # check for dependency conflicts\n```\n\n## Version Specifiers\n\n- `==2.31.0` — exact version\n- `>=2.28` — minimum version\n- `~=2.28` — compatible release (2.28.x)\n- `!=2.30` — exclude a version\n\n## PyPI\n\nPyPI (pypi.org) hosts over 500,000 packages. Search for packages by name or functionality. Always check: number of downloads, last update date, and whether the package is actively maintained.\n\n## pip vs pip3\n\nOn systems with both Python 2 and Python 3, `pip3` explicitly installs for Python 3. Inside a virtual environment, `pip` always refers to the correct version — no ambiguity.",
      "diagram": "flowchart LR\n    A[\"pip install requests\"] --> B[\"PyPI\npypi.org\"]\n    B --> C[\"Download package\n+ dependencies\"]\n    C --> D[\".venv/lib/\nsite-packages/\nrequests/\"]\n    E[\"pip list\"] --> F[\"Show all\ninstalled packages\"]\n    G[\"pip show requests\"] --> H[\"Version location\ndependencies\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "pip downloads from PyPI and installs into the active environment's site-packages",
      "code": "# All commands run in terminal with venv active\n\n# Install latest version\n# pip install requests\n\n# Install specific version\n# pip install requests==2.31.0\n\n# Install with version constraint\n# pip install \"requests>=2.28,<3.0\"\n\n# Install multiple packages at once\n# pip install requests flask python-dotenv\n\n# Upgrade a package\n# pip install --upgrade requests\n# pip install -U requests   # shorthand\n\n# Uninstall\n# pip uninstall requests\n\n# List all installed packages\n# pip list\n# Package    Version\n# ---------- -------\n# certifi    2023.7.22\n# requests   2.31.0\n\n# Show details about a package\n# pip show requests\n# Name: requests\n# Version: 2.31.0\n# Location: /path/to/.venv/lib/python3.x/site-packages\n# Requires: certifi, charset-normalizer, idna, urllib3\n\n# Check for dependency conflicts\n# pip check\n\n# In Python — check installed version\nimport importlib.metadata\nprint(importlib.metadata.version(\"requests\"))",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never run `pip install` without an active virtual environment unless you specifically intend to install globally. Global installs can conflict with system packages and break other projects. Always activate your venv first. If you accidentally install globally, use `pip uninstall` to remove it."
      },
      "keyPoints": [
        "pip install package installs from PyPI into the active environment",
        "Specify versions: ==exact, >=minimum, ~=compatible, !=exclude",
        "pip list shows all installed packages; pip show gives details on one",
        "pip install -U package upgrades to the latest version",
        "Always activate your venv before running pip — never install globally by accident"
      ],
      "tryIt": "With your venv active: install requests, flask, and python-dotenv. Run pip list to see all installed packages (notice the dependencies that came with them). Run pip show flask to see its details and dependencies. Then uninstall flask and run pip check to verify no broken dependencies remain."
    }
  },

  {
    "id": 1069,
    "moduleId": 15,
    "moduleTitle": "Virtual Environments & pip",
    "title": "requirements.txt",
    "type": "lesson",
    "content": {
      "body": "`requirements.txt` is the standard way to record a project's dependencies so others can recreate the exact same environment. It is a plain text file listing package names and versions, one per line.\n\n## Generating requirements.txt\n\n`pip freeze` outputs all installed packages with their exact versions. Redirect to a file:\n\n```bash\npip freeze > requirements.txt\n```\n\nThis captures every package including transitive dependencies (packages that your packages depend on).\n\n## Installing from requirements.txt\n\n```bash\npip install -r requirements.txt\n```\n\nThis installs every package listed in the file. The standard workflow for a new developer joining a project:\n\n```bash\ngit clone https://github.com/user/project\ncd project\npython -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt\n```\n\n## Direct vs Pinned Dependencies\n\n`pip freeze` pins every package to an exact version (`requests==2.31.0`). This is reproducible but can make upgrades harder. An alternative is to maintain a hand-written `requirements.txt` with only your direct dependencies and loose version constraints, and a separate `requirements-lock.txt` with the full pinned output.\n\n## Multiple Requirements Files\n\nLarge projects often have separate files:\n- `requirements.txt` — production dependencies\n- `requirements-dev.txt` — development tools (pytest, black, mypy)\n- `requirements-test.txt` — test dependencies",
      "diagram": "flowchart TD\n    A[\"pip freeze\"] --> B[\"requirements.txt\nrequests==2.31.0\nflask==3.0.0\n...\"]\n    B --> C[\"git commit\nrequirements.txt\"]\n    C --> D[\"New developer\ngit clone\"]\n    D --> E[\"pip install -r\nrequirements.txt\"]\n    E --> F[\"Identical environment\nreproduced\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "pip freeze captures the exact environment; pip install -r recreates it anywhere",
      "code": "# Generate requirements.txt from current environment\n# pip freeze > requirements.txt\n\n# Example requirements.txt content:\n# certifi==2023.7.22\n# charset-normalizer==3.3.2\n# click==8.1.7\n# flask==3.0.0\n# idna==3.6\n# itsdangerous==2.1.2\n# jinja2==3.1.2\n# markupsafe==2.1.3\n# requests==2.31.0\n# urllib3==2.1.0\n# werkzeug==3.0.1\n\n# Install from requirements.txt\n# pip install -r requirements.txt\n\n# Hand-written requirements.txt (direct deps only)\n# requests>=2.28\n# flask>=3.0\n# python-dotenv>=1.0\n\n# Development requirements (requirements-dev.txt)\n# -r requirements.txt   # include production deps\n# pytest>=7.0\n# black>=23.0\n# mypy>=1.0\n# ruff>=0.1\n\n# Install dev requirements\n# pip install -r requirements-dev.txt\n\n# In Python — read requirements programmatically\nfrom pathlib import Path\n\ndef read_requirements(path=\"requirements.txt\"):\n    reqs = Path(path)\n    if not reqs.exists():\n        return []\n    return [\n        line.strip()\n        for line in reqs.read_text().splitlines()\n        if line.strip() and not line.startswith(\"#\")\n    ]\n\nprint(read_requirements())",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Commit `requirements.txt` to version control — never commit the `.venv` directory. The requirements file is small, human-readable, and platform-independent. The venv directory is large, binary, and platform-specific. Anyone can recreate the venv from the requirements file in seconds."
      },
      "keyPoints": [
        "pip freeze > requirements.txt captures all installed packages with exact versions",
        "pip install -r requirements.txt recreates the environment from the file",
        "Commit requirements.txt to version control — never commit .venv",
        "Separate requirements-dev.txt for development tools not needed in production",
        "Hand-written requirements with loose constraints are more maintainable than frozen output"
      ],
      "tryIt": "With your venv active and requests/flask installed, run pip freeze > requirements.txt. Open the file and examine its contents. Create a new directory, create a fresh venv, activate it, and run pip install -r requirements.txt. Verify the same packages are installed with pip list."
    }
  },

  {
    "id": 1070,
    "moduleId": 15,
    "moduleTitle": "Virtual Environments & pip",
    "title": "pyproject.toml — Modern Python Projects",
    "type": "lesson",
    "content": {
      "body": "`pyproject.toml` is the modern standard for Python project configuration, defined in PEP 518 and PEP 621. It replaces the older `setup.py` and `setup.cfg` files and consolidates all project metadata, build configuration, and tool settings in one place.\n\n## Structure\n\n```toml\n[project]\nname = \"myproject\"\nversion = \"1.0.0\"\ndescription = \"A sample project\"\nrequires-python = \">=3.10\"\ndependencies = [\n    \"requests>=2.28\",\n    \"flask>=3.0\",\n]\n\n[project.optional-dependencies]\ndev = [\"pytest>=7.0\", \"black>=23.0\", \"mypy>=1.0\"]\n\n[build-system]\nrequires = [\"hatchling\"]\nbuild-backend = \"hatchling.build\"\n```\n\n## Tool Configuration\n\n`pyproject.toml` also holds configuration for development tools — replacing separate config files:\n\n```toml\n[tool.black]\nline-length = 88\n\n[tool.mypy]\nstrict = true\n\n[tool.pytest.ini_options]\ntestpaths = [\"tests\"]\n```\n\n## Modern Package Managers\n\nTools like `uv`, `poetry`, and `hatch` use `pyproject.toml` as their primary configuration file and provide faster, more reliable dependency management than plain pip.\n\n## When to Use It\n\nUse `pyproject.toml` for any project you intend to share, publish, or maintain long-term. For simple scripts and learning projects, `requirements.txt` is sufficient.",
      "diagram": "flowchart TD\n    A[\"pyproject.toml\"] --> B[\"[project]\nname version deps\"]\n    A --> C[\"[project.optional-dependencies]\ndev test\"]\n    A --> D[\"[build-system]\nbuild backend\"]\n    A --> E[\"[tool.black]\n[tool.mypy]\n[tool.pytest]\"]\n    B --> F[\"pip install .\ninstall project\"]\n    C --> G[\"pip install .[dev]\ninstall with dev deps\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "pyproject.toml consolidates project metadata, dependencies, and tool config in one file",
      "code": "# pyproject.toml — full example\n# [project]\n# name = \"school-api\"\n# version = \"0.1.0\"\n# description = \"School management API\"\n# readme = \"README.md\"\n# requires-python = \">=3.11\"\n# license = {text = \"MIT\"}\n# dependencies = [\n#     \"flask>=3.0\",\n#     \"flask-sqlalchemy>=3.1\",\n#     \"python-dotenv>=1.0\",\n#     \"requests>=2.31\",\n# ]\n#\n# [project.optional-dependencies]\n# dev = [\n#     \"pytest>=7.4\",\n#     \"pytest-cov>=4.1\",\n#     \"black>=23.0\",\n#     \"ruff>=0.1\",\n#     \"mypy>=1.5\",\n# ]\n#\n# [build-system]\n# requires = [\"hatchling\"]\n# build-backend = \"hatchling.build\"\n#\n# [tool.black]\n# line-length = 88\n# target-version = [\"py311\"]\n#\n# [tool.ruff]\n# line-length = 88\n# select = [\"E\", \"F\", \"I\"]\n#\n# [tool.mypy]\n# python_version = \"3.11\"\n# strict = true\n#\n# [tool.pytest.ini_options]\n# testpaths = [\"tests\"]\n# addopts = \"--cov=src --cov-report=term-missing\"\n\n# Install project with all dependencies\n# pip install .\n\n# Install with dev dependencies\n# pip install \".[dev]\"\n\n# Read pyproject.toml in Python\nimport tomllib   # Python 3.11+\nfrom pathlib import Path\n\nif Path(\"pyproject.toml\").exists():\n    with open(\"pyproject.toml\", \"rb\") as f:\n        config = tomllib.load(f)\n    print(config.get(\"project\", {}).get(\"name\"))",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "`pyproject.toml` uses TOML format — similar to INI but with types. Strings use double quotes, arrays use square brackets, tables use `[section]` headers. Python 3.11+ includes `tomllib` for reading TOML files. For older Python, install the `tomli` package."
      },
      "keyPoints": [
        "pyproject.toml is the modern standard for Python project configuration (PEP 518/621)",
        "Consolidates project metadata, dependencies, build config, and tool settings",
        "[project.optional-dependencies] separates dev/test deps from production deps",
        "pip install . installs the project; pip install .[dev] includes optional deps",
        "Use pyproject.toml for shareable projects; requirements.txt for simple scripts"
      ],
      "tryIt": "Create a pyproject.toml for a small project with at least two production dependencies and two dev dependencies. Add tool configuration for black (line-length=88) and pytest (testpaths=['tests']). Install the project with pip install . and verify the dependencies are installed. Then install with pip install .[dev] and verify the dev tools appear."
    }
  },

  {
    "id": 1071,
    "moduleId": 15,
    "moduleTitle": "Virtual Environments & pip",
    "title": "Environment Variables and .env Files",
    "type": "lesson",
    "content": {
      "body": "Environment variables are key-value pairs set in the operating system that programs can read at runtime. They are the standard way to configure applications without hardcoding sensitive values — API keys, database URLs, secret keys — in source code.\n\n## Why Environment Variables?\n\nHardcoding secrets in source code is a security risk — they end up in version control and are visible to anyone with access to the repository. Environment variables keep secrets out of code and allow the same code to behave differently in development, staging, and production.\n\n## Reading Environment Variables\n\n```python\nimport os\napi_key = os.environ[\"API_KEY\"]           # raises KeyError if missing\napi_key = os.environ.get(\"API_KEY\")       # returns None if missing\napi_key = os.environ.get(\"API_KEY\", \"\")   # returns default if missing\n```\n\n## .env Files\n\nA `.env` file stores environment variables for local development. It is a plain text file with `KEY=VALUE` pairs. The `python-dotenv` library loads it automatically:\n\n```python\nfrom dotenv import load_dotenv\nload_dotenv()   # loads .env into os.environ\n```\n\n## .env File Format\n\n```\nDATABASE_URL=postgresql://localhost/mydb\nSECRET_KEY=dev-secret-key-change-in-production\nDEBUG=true\nAPI_KEY=your-api-key-here\n```\n\n## Never Commit .env\n\nAdd `.env` to `.gitignore`. Provide a `.env.example` file with placeholder values so other developers know what variables are needed.",
      "diagram": "flowchart TD\n    A[\".env file\nAPI_KEY=abc123\nDB_URL=...\"] --> B[\"load_dotenv()\"]\n    B --> C[\"os.environ\nAPI_KEY=abc123\"]\n    C --> D[\"os.environ.get('API_KEY')\n'abc123'\"]\n    E[\".env.example\nAPI_KEY=your-key-here\"] --> F[\"Committed to git\nshows required vars\"]\n    A --> G[\".gitignore\n.env\nnever committed\"]\n    style A fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": ".env holds secrets locally; .env.example shows what's needed; never commit .env",
      "code": "# Install python-dotenv\n# pip install python-dotenv\n\n# .env file (never commit this):\n# DATABASE_URL=postgresql://localhost/mydb\n# SECRET_KEY=super-secret-key-change-me\n# DEBUG=true\n# API_KEY=sk-abc123\n\n# .env.example (commit this):\n# DATABASE_URL=postgresql://localhost/yourdb\n# SECRET_KEY=change-this-to-a-random-string\n# DEBUG=false\n# API_KEY=your-api-key-here\n\n# Load .env in Python\nfrom dotenv import load_dotenv\nimport os\n\nload_dotenv()   # loads .env into os.environ\n\n# Read variables\ndb_url = os.environ.get(\"DATABASE_URL\", \"sqlite:///dev.db\")\nsecret = os.environ.get(\"SECRET_KEY\", \"fallback-dev-key\")\ndebug = os.environ.get(\"DEBUG\", \"false\").lower() == \"true\"\napi_key = os.environ[\"API_KEY\"]   # raises if missing\n\nprint(f\"Database: {db_url}\")\nprint(f\"Debug mode: {debug}\")\n\n# Config class pattern — centralise all config\nclass Config:\n    DATABASE_URL = os.environ.get(\"DATABASE_URL\", \"sqlite:///dev.db\")\n    SECRET_KEY = os.environ.get(\"SECRET_KEY\", \"dev-key\")\n    DEBUG = os.environ.get(\"DEBUG\", \"false\").lower() == \"true\"\n    API_KEY = os.environ.get(\"API_KEY\")\n\n    @classmethod\n    def validate(cls):\n        if not cls.API_KEY:\n            raise ValueError(\"API_KEY environment variable is required\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never hardcode API keys, passwords, or secret keys in your source code. Even in private repositories, secrets in code are a security risk — they appear in git history, logs, and error messages. Always use environment variables. If you accidentally commit a secret, rotate it immediately — deleting the commit is not enough."
      },
      "keyPoints": [
        "Environment variables keep secrets out of source code",
        "os.environ.get('KEY', default) reads safely — returns default if missing",
        "python-dotenv loads .env files into os.environ with load_dotenv()",
        "Never commit .env — add it to .gitignore",
        "Commit .env.example with placeholder values to document required variables"
      ],
      "tryIt": "Create a .env file with DATABASE_URL, SECRET_KEY, and DEBUG variables. Write a Config class that reads all three using os.environ.get() with sensible defaults. Add a validate() classmethod that raises ValueError if SECRET_KEY is the default dev value. Create a .env.example with placeholder values."
    }
  },

  {
    "id": 1072,
    "moduleId": 15,
    "moduleTitle": "Virtual Environments & pip",
    "title": "Project Structure Best Practices",
    "type": "lesson",
    "content": {
      "body": "A well-structured project is easier to navigate, test, and maintain. Python has established conventions for project layout that most developers follow — learning them makes your projects immediately familiar to other Python developers.\n\n## Standard Project Layout\n\n```\nmyproject/\n    .venv/              # virtual environment (gitignored)\n    src/\n        myproject/\n            __init__.py\n            main.py\n            models.py\n            utils.py\n    tests/\n        __init__.py\n        test_models.py\n        test_utils.py\n    .env                # secrets (gitignored)\n    .env.example        # template (committed)\n    .gitignore\n    pyproject.toml      # or requirements.txt\n    README.md\n```\n\n## The src Layout\n\nPlacing source code in a `src/` subdirectory (the \"src layout\") prevents accidental imports of the local package instead of the installed one. It is the recommended layout for packages you intend to distribute.\n\n## .gitignore Essentials\n\nAlways include:\n```\n.venv/\nvenv/\n__pycache__/\n*.pyc\n.env\n*.egg-info/\ndist/\nbuild/\n.pytest_cache/\n.mypy_cache/\n```\n\n## README.md\n\nEvery project needs a README with: what the project does, how to install it, how to run it, and how to run the tests. This is the first thing anyone reads.",
      "diagram": "flowchart TD\n    A[\"myproject/\"] --> B[\".venv/\ngitignored\"]\n    A --> C[\"src/myproject/\nsource code\"]\n    A --> D[\"tests/\ntest files\"]\n    A --> E[\"pyproject.toml\nor requirements.txt\"]\n    A --> F[\".env\ngitignored\"]\n    A --> G[\".env.example\ncommitted\"]\n    A --> H[\"README.md\ndocumentation\"]\n    A --> I[\".gitignore\nexclusions\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Standard layout — .venv and .env are gitignored; everything else is committed",
      "code": "# Minimal .gitignore for Python projects\n# .gitignore contents:\n\n# Virtual environments\n# .venv/\n# venv/\n# env/\n\n# Python cache\n# __pycache__/\n# *.py[cod]\n# *.pyo\n\n# Environment variables\n# .env\n# .env.local\n\n# Distribution / packaging\n# dist/\n# build/\n# *.egg-info/\n\n# Testing\n# .pytest_cache/\n# .coverage\n# htmlcov/\n\n# Type checking\n# .mypy_cache/\n\n# IDE\n# .vscode/settings.json\n# .idea/\n\n# README.md template:\n# # Project Name\n# Brief description.\n#\n# ## Installation\n# python -m venv .venv\n# source .venv/bin/activate\n# pip install -r requirements.txt\n#\n# ## Configuration\n# cp .env.example .env\n# # Edit .env with your values\n#\n# ## Running\n# python -m myproject\n#\n# ## Testing\n# pytest\n\n# Check what git is tracking\n# git status\n# git ls-files   # all tracked files",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "GitHub provides a Python `.gitignore` template when you create a new repository. Use it as your starting point — it covers all the common Python files that should not be committed. You can also generate one at gitignore.io by searching for 'Python'."
      },
      "keyPoints": [
        "Standard layout: src/ for code, tests/ for tests, pyproject.toml at root",
        "The src layout prevents accidental imports of local code over installed packages",
        ".gitignore must include .venv/, __pycache__/, .env, dist/, build/",
        "README.md should cover: what it does, how to install, how to run, how to test",
        "Commit .env.example with placeholder values — never commit .env"
      ],
      "tryIt": "Set up a complete project structure from scratch: create the directory layout, initialise a git repository, create a .gitignore with all Python exclusions, create a .env.example, write a minimal README.md, and create a pyproject.toml. Verify git status shows only the files that should be tracked."
    }
  },

  {
    "id": 1073,
    "moduleId": 15,
    "moduleTitle": "Virtual Environments & pip",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Environment and dependency bugs are often confusing because the error message points to the wrong place — the symptom is an import error or wrong version, but the cause is an environment problem.\n\n## Mistake 1 — Installing Without Activating the venv\n\nRunning `pip install` without activating the virtual environment installs globally. The package appears to install successfully but is not available when you run your project with the venv active.\n\n## Mistake 2 — Committing .env or .venv\n\nCommitting `.env` exposes secrets. Committing `.venv` adds thousands of binary files to the repository. Both should be in `.gitignore` from the start.\n\n## Mistake 3 — Not Updating requirements.txt\n\nInstalling a new package but forgetting to run `pip freeze > requirements.txt` means the next developer who clones the project gets an `ImportError`. Update requirements.txt every time you install or upgrade a package.\n\n## Mistake 4 — Using the Wrong Python\n\nRunning `python script.py` from a terminal where the venv is not active uses the system Python. The script fails with `ModuleNotFoundError` even though the package is installed — in the venv, not globally.\n\n## Mistake 5 — Hardcoding Secrets\n\nPutting API keys, passwords, or secret keys directly in source code. Even in private repositories, this is a security risk. Use environment variables.\n\n## Mistake 6 — One venv for All Projects\n\nUsing a single shared virtual environment for multiple projects. Package version conflicts between projects are inevitable. One venv per project.",
      "diagram": "flowchart TD\n    A[\"Environment Mistakes\"] --> B[\"pip install\nwithout venv active\"]\n    A --> C[\"Commit .env\nor .venv\"]\n    A --> D[\"Forget to update\nrequirements.txt\"]\n    A --> E[\"Wrong Python\nvenv not active\"]\n    A --> F[\"Hardcoded secrets\nin source code\"]\n    A --> G[\"Shared venv\nfor all projects\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Most environment bugs come from the venv not being active or requirements.txt being out of date",
      "code": "# Mistake 1 — installing without venv active\n# pip install requests   # installs globally!\n# Fix: always activate first\n# source .venv/bin/activate\n# pip install requests\n\n# Mistake 2 — check what's in .gitignore\n# cat .gitignore | grep -E \"venv|.env\"\n# Should show: .venv/ and .env\n\n# Mistake 3 — update requirements after installing\n# pip install requests\n# pip freeze > requirements.txt   # don't forget this!\n\n# Mistake 4 — check which Python you're using\nimport sys\nprint(sys.executable)\n# Should show: /path/to/project/.venv/bin/python\n# If it shows /usr/bin/python — venv is not active!\n\n# Mistake 5 — never do this\n# API_KEY = \"sk-abc123def456\"   # hardcoded secret!\n# Fix:\nimport os\nfrom dotenv import load_dotenv\nload_dotenv()\nAPI_KEY = os.environ.get(\"API_KEY\")\nif not API_KEY:\n    raise ValueError(\"API_KEY not set in environment\")\n\n# Mistake 6 — check you're in the right venv\n# pip list | grep requests\n# If empty, wrong venv or venv not active\n\n# Diagnostic: print full environment info\nprint(f\"Python: {sys.version}\")\nprint(f\"Executable: {sys.executable}\")\nprint(f\"Prefix: {sys.prefix}\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "If you get `ModuleNotFoundError` for a package you know you installed, the first thing to check is whether your virtual environment is active. Run `which python` (macOS/Linux) or `where python` (Windows) — if it does not show a path inside your project's `.venv` directory, the venv is not active."
      },
      "keyPoints": [
        "Always activate the venv before running pip — check with which python",
        "Add .venv/ and .env to .gitignore immediately when creating a project",
        "Update requirements.txt every time you install or upgrade a package",
        "ModuleNotFoundError usually means the venv is not active or the wrong Python is used",
        "Never hardcode secrets — use environment variables and python-dotenv"
      ],
      "tryIt": "Deliberately trigger each mistake and observe the error: (1) install a package without activating the venv, (2) check git status with .venv not in .gitignore, (3) install a package and check requirements.txt is out of date, (4) run a script that imports a venv package without activating the venv. Fix each one."
    }
  },

  {
    "id": 1074,
    "moduleId": 15,
    "moduleTitle": "Virtual Environments & pip",
    "title": "Module 15 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered the tooling that makes Python projects professional, reproducible, and secure. These practices are not optional extras — they are the baseline for any code you share or deploy.\n\n## What You Learned\n\n**Virtual environments** — isolated Python installations per project. `python -m venv .venv` creates one. `source .venv/bin/activate` activates it. `deactivate` restores the original environment. Never commit `.venv`.\n\n**pip** — Python's package installer. `pip install package` installs from PyPI. Version specifiers: `==`, `>=`, `~=`. `pip list` and `pip show` inspect the environment. Always activate the venv first.\n\n**requirements.txt** — records dependencies for reproducibility. `pip freeze > requirements.txt` captures the current environment. `pip install -r requirements.txt` recreates it. Commit this file; never commit `.venv`.\n\n**pyproject.toml** — the modern standard for project configuration. Consolidates metadata, dependencies, build config, and tool settings. Use for shareable and distributable projects.\n\n**Environment variables** — keep secrets out of source code. `os.environ.get()` reads them safely. `python-dotenv` loads `.env` files. Never commit `.env` — commit `.env.example` instead.\n\n**Project structure** — standard layout with `src/`, `tests/`, `.gitignore`, `README.md`. The src layout prevents import confusion. A good `.gitignore` excludes `.venv`, `__pycache__`, `.env`, and build artifacts.\n\n## Congratulations\n\nYou have completed all 15 modules of the Python course. You now have a comprehensive foundation covering variables, control flow, functions, data structures, OOP, error handling, file handling, modules, and professional tooling. The next step is to build real projects and apply everything you have learned.",
      "diagram": "flowchart TD\n    A[\"✅ Virtual environments\nisolated per project\"] --> B[\"✅ pip\ninstall from PyPI\"]\n    B --> C[\"✅ requirements.txt\nreproduce environment\"]\n    C --> D[\"✅ pyproject.toml\nmodern config\"]\n    D --> E[\"✅ Environment vars\nsecrets out of code\"]\n    E --> F[\"✅ Project structure\nsrc tests gitignore\"]\n    F --> G[\"🎉 Python Course\nComplete!\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 15 complete — professional Python tooling is the foundation of real projects",
      "code": "# Complete project setup workflow\n# Run these commands in your terminal:\n\n# 1. Create project directory\n# mkdir myproject && cd myproject\n\n# 2. Initialise git\n# git init\n\n# 3. Create .gitignore (add Python template)\n# echo \".venv/\n__pycache__/\n*.pyc\n.env\ndist/\nbuild/\" > .gitignore\n\n# 4. Create virtual environment\n# python -m venv .venv\n\n# 5. Activate\n# source .venv/bin/activate   # macOS/Linux\n# .venv\\Scripts\\activate      # Windows\n\n# 6. Install dependencies\n# pip install requests flask python-dotenv\n\n# 7. Save dependencies\n# pip freeze > requirements.txt\n\n# 8. Create .env.example\n# echo \"SECRET_KEY=change-me\nDEBUG=false\nAPI_KEY=your-key\" > .env.example\n\n# 9. Create .env (never commit)\n# cp .env.example .env\n# # Edit .env with real values\n\n# 10. Create project structure\n# mkdir -p src/myproject tests\n# touch src/myproject/__init__.py\n# touch src/myproject/main.py\n# touch tests/__init__.py\n\n# In main.py:\nfrom dotenv import load_dotenv\nimport os\n\nload_dotenv()\n\ndef create_app():\n    secret = os.environ.get(\"SECRET_KEY\", \"dev\")\n    debug = os.environ.get(\"DEBUG\", \"false\") == \"true\"\n    return {\"secret\": secret, \"debug\": debug}\n\nif __name__ == \"__main__\":\n    app = create_app()\n    print(f\"App running: debug={app['debug']}\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The workflow in the code above — create venv, activate, install, freeze, create .env — should become muscle memory. Every new Python project starts this way. The five minutes it takes to set up properly saves hours of debugging environment issues later."
      },
      "keyPoints": [
        "One virtual environment per project — activate before every pip install",
        "pip freeze > requirements.txt after every install — commit it to git",
        "Never commit .venv or .env — always commit .env.example",
        "pyproject.toml for distributable projects; requirements.txt for scripts",
        "Environment variables keep secrets out of code — use python-dotenv for local dev"
      ],
      "tryIt": "From memory, set up a complete new Python project: create the directory, initialise git, create and activate a venv, install two packages, freeze requirements, create .env.example and .env, write a main.py that reads from environment variables, and verify git status shows only the right files tracked."
    }
  },

  {
    "id": 1075,
    "moduleId": 16,
    "moduleTitle": "Testing",
    "title": "What Is Testing?",
    "type": "lesson",
    "content": {
      "body": "Testing is writing code that verifies other code works correctly. Instead of manually running your program and checking the output every time you make a change, you write automated tests that check the behaviour programmatically. Tests run in seconds and catch regressions immediately.\n\n## Why Testing Matters\n\nWithout tests, every change is risky. You fix a bug in one function and accidentally break another. You refactor code and have no way to verify it still works. Tests give you confidence — when all tests pass, you know the code works as intended.\n\n## The Three Types of Tests\n\n**Unit tests** — test individual functions or methods in isolation. Fast, focused, and the foundation of all testing.\n\n**Integration tests** — test how multiple components work together. Slower but catch issues that unit tests miss.\n\n**End-to-end tests** — test the entire system from the user's perspective. Slowest but verify the full workflow.\n\n## Test-Driven Development (TDD)\n\nTDD is a workflow where you write the test before writing the code. The cycle: write a failing test, write the minimum code to make it pass, refactor. This forces you to think about the interface before the implementation.\n\n## The Testing Pyramid\n\nMost tests should be unit tests (fast, many). Fewer integration tests (slower, moderate). Very few end-to-end tests (slowest, expensive). This balance gives maximum coverage with minimum execution time.",
      "diagram": "flowchart TD\n    A[\"Testing Pyramid\"] --> B[\"E2E Tests\nfew, slow, full system\"]\n    B --> C[\"Integration Tests\nmoderate, components together\"]\n    C --> D[\"Unit Tests\nmany, fast, isolated functions\"]\n    E[\"TDD Cycle\"] --> F[\"Write failing test\"]\n    F --> G[\"Write minimal code\nto pass\"]\n    G --> H[\"Refactor\"]\n    H --> F\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Most tests should be fast unit tests — integration and E2E tests are slower and fewer",
      "code": "# Function to test\ndef add(a, b):\n    return a + b\n\n# Manual testing — run and check output\nprint(add(2, 3))   # 5 — looks right\nprint(add(0, 0))   # 0 — looks right\nprint(add(-1, 1))  # 0 — looks right\n\n# Automated testing — assert expected behaviour\ndef test_add():\n    assert add(2, 3) == 5\n    assert add(0, 0) == 0\n    assert add(-1, 1) == 0\n    assert add(100, 200) == 300\n    print(\"All tests passed!\")\n\ntest_add()\n\n# What happens when a test fails\ndef broken_add(a, b):\n    return a + b + 1   # bug!\n\ndef test_broken():\n    assert broken_add(2, 3) == 5   # AssertionError!\n\ntry:\n    test_broken()\nexcept AssertionError:\n    print(\"Test failed — bug caught!\")\n\n# TDD workflow example\n# 1. Write test first (it fails — function doesn't exist yet)\n# def test_multiply():\n#     assert multiply(3, 4) == 12\n\n# 2. Write minimal code to pass\n# def multiply(a, b):\n#     return a * b\n\n# 3. Refactor if needed\n# def multiply(a, b):\n#     if not isinstance(a, (int, float)):\n#         raise TypeError\n#     return a * b",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Tests are not optional for professional code. Every function you write should have at least one test. Tests are documentation — they show how the function is meant to be used. They are safety — they catch bugs before users do. They are confidence — they let you refactor without fear."
      },
      "keyPoints": [
        "Testing is writing code that verifies other code works correctly",
        "Automated tests run in seconds and catch regressions immediately",
        "Unit tests are fast and focused — test individual functions in isolation",
        "The testing pyramid: many unit tests, fewer integration tests, very few E2E tests",
        "TDD: write the test first, write code to pass it, then refactor"
      ],
      "tryIt": "Write a function is_palindrome(s) that checks if a string reads the same forwards and backwards. Before implementing it, write five test cases: an empty string, a single character, 'racecar', 'hello', and 'A man a plan a canal Panama' (case-insensitive). Run the tests, watch them fail, then implement the function."
    }
  },

  {
    "id": 1076,
    "moduleId": 16,
    "moduleTitle": "Testing",
    "title": "Writing Tests with assert",
    "type": "lesson",
    "content": {
      "body": "The `assert` statement is Python's built-in testing tool. It checks that a condition is `True`. If the condition is `False`, it raises an `AssertionError` and stops execution. This is the foundation of all Python testing.\n\n## Syntax\n\n```python\nassert condition, \"optional message\"\n```\n\nIf `condition` is `True`, nothing happens. If `False`, `AssertionError` is raised with the optional message.\n\n## Common Assertion Patterns\n\n```python\nassert result == expected\nassert result != wrong_value\nassert result > 0\nassert result in valid_values\nassert isinstance(result, int)\nassert result is None\nassert result is not None\n```\n\n## Testing Functions\n\nGroup related assertions into a test function. Name it `test_something` so test runners can find it automatically:\n\n```python\ndef test_add():\n    assert add(2, 3) == 5\n    assert add(0, 0) == 0\n    assert add(-1, 1) == 0\n```\n\n## When assert Fails\n\nThe traceback shows which assertion failed and on which line. The optional message helps identify what went wrong:\n\n```python\nassert age >= 0, f\"Age cannot be negative: {age}\"\n```\n\n## assert vs if/raise\n\n`assert` is for testing and debugging. Use `if`/`raise` for validation in production code. Python can disable assertions with the `-O` flag — they should never be used for critical checks.",
      "diagram": "flowchart TD\n    A[\"assert condition\"] --> B{\"condition\nTrue?\"}\n    B -->|\"True\"| C[\"Continue\nno error\"]\n    B -->|\"False\"| D[\"AssertionError\nstop execution\"]\n    E[\"Test function\"] --> F[\"assert result == 5\"]\n    F --> G[\"assert result > 0\"]\n    G --> H[\"assert result in [...]\"]\n    H --> I[\"All pass\ntest succeeds\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style I fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "assert checks a condition — raises AssertionError if False, continues if True",
      "code": "# Function to test\ndef divide(a, b):\n    if b == 0:\n        raise ValueError(\"Cannot divide by zero\")\n    return a / b\n\n# Test with assert\ndef test_divide():\n    # Normal cases\n    assert divide(10, 2) == 5\n    assert divide(9, 3) == 3\n    assert divide(1, 2) == 0.5\n    \n    # Edge cases\n    assert divide(0, 5) == 0\n    assert divide(-10, 2) == -5\n    \n    # Test exception\n    try:\n        divide(10, 0)\n        assert False, \"Should have raised ValueError\"\n    except ValueError:\n        pass   # expected\n    \n    print(\"All divide tests passed!\")\n\ntest_divide()\n\n# Multiple assertions with messages\ndef test_string_methods():\n    text = \"Hello, World!\"\n    assert len(text) == 13, f\"Expected length 13, got {len(text)}\"\n    assert text.startswith(\"Hello\"), \"Should start with Hello\"\n    assert \"World\" in text, \"Should contain World\"\n    assert text.upper() == \"HELLO, WORLD!\", \"Upper case failed\"\n    print(\"String tests passed!\")\n\ntest_string_methods()\n\n# Testing return types\ndef test_types():\n    result = add(2, 3)\n    assert isinstance(result, int), f\"Expected int, got {type(result)}\"\n    \n# assert vs if/raise\n# WRONG — assert for validation:\n# def withdraw(amount):\n#     assert amount > 0   # disabled with -O flag!\n# RIGHT — if/raise for validation:\ndef withdraw(amount):\n    if amount <= 0:\n        raise ValueError(\"Amount must be positive\")",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never use `assert` for input validation in production code. Python can run with the `-O` (optimize) flag which disables all assertions. Use `if` with `raise` for validation that must always run. Reserve `assert` for tests and debugging checks that can safely be disabled in production."
      },
      "keyPoints": [
        "assert condition raises AssertionError if condition is False",
        "Add an optional message: assert condition, 'message' for clearer failures",
        "Group related assertions into test functions named test_something",
        "Test normal cases, edge cases, and exceptions",
        "Never use assert for production validation — use if/raise instead"
      ],
      "tryIt": "Write a function factorial(n) and a complete test_factorial() function with at least 6 assertions: factorial(0), factorial(1), factorial(5), negative input raises ValueError, non-integer raises TypeError, and the result type is int. Run the tests and verify all pass."
    }
  },

  {
    "id": 1077,
    "moduleId": 16,
    "moduleTitle": "Testing",
    "title": "Introduction to pytest",
    "type": "lesson",
    "content": {
      "body": "pytest is Python's most popular testing framework. It discovers tests automatically, provides better error messages than plain `assert`, and adds powerful features like fixtures, parametrization, and plugins. It is the industry standard for Python testing.\n\n## Installation\n\n```bash\npip install pytest\n```\n\n## Test Discovery\n\npytest automatically finds and runs all files named `test_*.py` or `*_test.py`, and all functions named `test_*` inside them. No registration or imports needed.\n\n## Running Tests\n\n```bash\npytest                  # run all tests\npytest test_math.py     # run one file\npytest -v               # verbose output\npytest -k \"add\"         # run tests matching \"add\"\npytest --tb=short       # shorter tracebacks\n```\n\n## Better Failure Messages\n\npytest rewrites assertions to show the actual values when they fail:\n\n```\nassert add(2, 3) == 6\nAssertionError: assert 5 == 6\n```\n\nPlain `assert` just says \"AssertionError\" with no context.\n\n## Test Organization\n\n```\nproject/\n    src/\n        myapp/\n            math.py\n    tests/\n        test_math.py\n```\n\nMirror your source structure in the tests directory. One test file per source file.",
      "diagram": "flowchart TD\n    A[\"pytest\"] --> B[\"Discover\ntest_*.py files\"]\n    B --> C[\"Find test_*\nfunctions\"]\n    C --> D[\"Run each test\"]\n    D --> E{\"All pass?\"}\n    E -->|\"Yes\"| F[\"Exit 0\ngreen output\"]\n    E -->|\"No\"| G[\"Exit 1\nshow failures\"]\n    G --> H[\"Detailed traceback\nactual vs expected\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "pytest discovers tests automatically — no imports or registration needed",
      "code": "# math_utils.py\ndef add(a, b):\n    return a + b\n\ndef multiply(a, b):\n    return a * b\n\ndef divide(a, b):\n    if b == 0:\n        raise ValueError(\"Cannot divide by zero\")\n    return a / b\n\n# test_math_utils.py\nfrom math_utils import add, multiply, divide\nimport pytest\n\ndef test_add():\n    assert add(2, 3) == 5\n    assert add(0, 0) == 0\n    assert add(-1, 1) == 0\n\ndef test_multiply():\n    assert multiply(3, 4) == 12\n    assert multiply(0, 5) == 0\n    assert multiply(-2, 3) == -6\n\ndef test_divide():\n    assert divide(10, 2) == 5\n    assert divide(9, 3) == 3\n    assert divide(1, 2) == 0.5\n\ndef test_divide_by_zero():\n    with pytest.raises(ValueError):\n        divide(10, 0)\n\n# Run in terminal:\n# pytest test_math_utils.py\n# pytest -v                    # verbose\n# pytest -k \"divide\"           # run only divide tests\n# pytest --tb=short            # shorter tracebacks\n\n# Output:\n# test_math_utils.py::test_add PASSED\n# test_math_utils.py::test_multiply PASSED\n# test_math_utils.py::test_divide PASSED\n# test_math_utils.py::test_divide_by_zero PASSED\n# 4 passed in 0.02s",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Run `pytest -v` (verbose) during development to see each test name as it runs. Run plain `pytest` in CI/CD for faster output. Use `pytest -k 'pattern'` to run a subset of tests while working on a specific feature. Use `pytest --lf` (last failed) to re-run only the tests that failed last time."
      },
      "keyPoints": [
        "pytest is the industry-standard Python testing framework",
        "Test discovery is automatic — name files test_*.py and functions test_*",
        "pytest provides better failure messages than plain assert",
        "Run pytest in the project root — it finds all tests recursively",
        "pytest -v for verbose output; pytest -k 'pattern' to filter tests"
      ],
      "tryIt": "Install pytest in your venv. Create a test_calculator.py file with test functions for add, subtract, multiply, and divide. Each test should have at least 3 assertions. Run pytest and verify all pass. Then deliberately break one function and run pytest again to see the failure output."
    }
  },

  {
    "id": 1078,
    "moduleId": 16,
    "moduleTitle": "Testing",
    "title": "Test Functions and Naming",
    "type": "lesson",
    "content": {
      "body": "Good test names are as important as good code names. A test name should describe exactly what is being tested, under what conditions, and what the expected outcome is. When a test fails, the name alone should tell you what broke.\n\n## Naming Convention\n\nThe pattern `test_[function]_[scenario]_[expected]` produces self-documenting test names:\n\n```python\ndef test_divide_by_zero_raises_value_error():\ndef test_add_negative_numbers_returns_correct_sum():\ndef test_withdraw_insufficient_funds_raises_error():\n```\n\n## One Assertion Per Test (Guideline)\n\nEach test should verify one specific behaviour. Multiple assertions in one test mean a failure in the first assertion hides whether the later ones pass. The guideline is not absolute — related assertions about the same behaviour can stay together.\n\n## Arrange, Act, Assert (AAA)\n\nStructure each test in three sections:\n1. **Arrange** — set up the data and objects needed\n2. **Act** — call the function being tested\n3. **Assert** — verify the result\n\n```python\ndef test_deposit_increases_balance():\n    account = BankAccount(\"Alice\", 100)   # Arrange\n    account.deposit(50)                    # Act\n    assert account.balance == 150          # Assert\n```\n\n## Test Classes\n\nGroup related tests in a class prefixed with `Test`. pytest discovers them automatically. No inheritance needed.\n\n```python\nclass TestBankAccount:\n    def test_deposit(self): ...\n    def test_withdraw(self): ...\n```",
      "diagram": "flowchart TD\n    A[\"Good test name\"] --> B[\"test_function\n_scenario\n_expected\"]\n    C[\"AAA Pattern\"] --> D[\"Arrange\nset up data\"]\n    D --> E[\"Act\ncall function\"]\n    E --> F[\"Assert\nverify result\"]\n    G[\"Test class\"] --> H[\"class TestBankAccount:\"]\n    H --> I[\"def test_deposit(self)\"]\n    H --> J[\"def test_withdraw(self)\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "AAA pattern keeps tests readable — Arrange, Act, Assert in three clear sections",
      "code": "from bank import BankAccount\nimport pytest\n\nclass TestBankAccount:\n\n    # AAA pattern — clear structure\n    def test_deposit_increases_balance(self):\n        # Arrange\n        account = BankAccount(\"Alice\", 100)\n        # Act\n        account.deposit(50)\n        # Assert\n        assert account.balance == 150\n\n    def test_withdraw_decreases_balance(self):\n        account = BankAccount(\"Alice\", 200)\n        account.withdraw(75)\n        assert account.balance == 125\n\n    def test_withdraw_insufficient_funds_raises_error(self):\n        account = BankAccount(\"Alice\", 50)\n        with pytest.raises(ValueError, match=\"Insufficient\"):\n            account.withdraw(100)\n\n    def test_deposit_zero_raises_error(self):\n        account = BankAccount(\"Alice\", 100)\n        with pytest.raises(ValueError):\n            account.deposit(0)\n\n    def test_initial_balance_is_zero_by_default(self):\n        account = BankAccount(\"Alice\")\n        assert account.balance == 0\n\n    def test_owner_name_is_stored(self):\n        account = BankAccount(\"Bob\", 500)\n        assert account.owner == \"Bob\"\n\n# Run specific class:\n# pytest test_bank.py::TestBankAccount\n# pytest test_bank.py::TestBankAccount::test_deposit_increases_balance",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "When a test fails, the name should tell you exactly what broke without reading the test body. `test_withdraw_insufficient_funds_raises_error` is clear. `test_withdraw_2` is useless. Spend time on test names — they are the first thing you read when something breaks at 2am."
      },
      "keyPoints": [
        "Name tests: test_function_scenario_expected — the name should describe the failure",
        "AAA pattern: Arrange (setup), Act (call), Assert (verify) — three clear sections",
        "Group related tests in a class prefixed with Test — no inheritance needed",
        "One behaviour per test — multiple assertions about the same behaviour are fine",
        "pytest discovers Test classes and test_ methods automatically"
      ],
      "tryIt": "Rewrite your calculator tests using the AAA pattern and descriptive names. Group them in a TestCalculator class. Add tests for edge cases: adding very large numbers, multiplying by zero, dividing a negative by a positive. Each test name should describe the scenario and expected outcome."
    }
  },

  {
    "id": 1079,
    "moduleId": 16,
    "moduleTitle": "Testing",
    "title": "Testing Exceptions",
    "type": "lesson",
    "content": {
      "body": "Testing that your code raises the right exception under the right conditions is just as important as testing the happy path. pytest provides `pytest.raises()` as a context manager for this purpose.\n\n## pytest.raises()\n\n```python\nwith pytest.raises(ValueError):\n    divide(10, 0)\n```\n\nThe test passes if `ValueError` is raised inside the `with` block. It fails if no exception is raised, or if a different exception type is raised.\n\n## Checking the Exception Message\n\nUse the `match` parameter to verify the exception message with a regex pattern:\n\n```python\nwith pytest.raises(ValueError, match=\"Cannot divide by zero\"):\n    divide(10, 0)\n```\n\n## Capturing the Exception\n\nAssign the context manager to a variable to inspect the exception after the block:\n\n```python\nwith pytest.raises(ValueError) as exc_info:\n    divide(10, 0)\nassert \"zero\" in str(exc_info.value)\n```\n\n## Testing Multiple Exception Types\n\nTest each exception type separately — one test per exception scenario. This makes failures specific and easy to diagnose.\n\n## What Not to Test\n\nDo not test that Python's built-in exceptions work correctly. Test that your code raises the right exception at the right time with the right message — not that `ValueError` behaves like a `ValueError`.",
      "diagram": "flowchart TD\n    A[\"with pytest.raises(ValueError):\"] --> B[\"Execute block\"]\n    B --> C{\"ValueError\nraised?\"}\n    C -->|\"Yes\"| D[\"Test PASSES\"]\n    C -->|\"No exception\"| E[\"Test FAILS\nExpected exception\"]\n    C -->|\"Wrong type\"| F[\"Test FAILS\nWrong exception\"]\n    G[\"match='pattern'\"] --> H[\"Also checks\nexception message\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "pytest.raises() passes only if the expected exception is raised — wrong type or no exception fails",
      "code": "import pytest\n\ndef divide(a, b):\n    if not isinstance(a, (int, float)):\n        raise TypeError(f\"Expected number, got {type(a).__name__}\")\n    if b == 0:\n        raise ValueError(\"Cannot divide by zero\")\n    return a / b\n\ndef set_age(age):\n    if age < 0:\n        raise ValueError(f\"Age cannot be negative: {age}\")\n    if age > 150:\n        raise ValueError(f\"Age {age} is unrealistic\")\n    return age\n\n# Basic exception test\ndef test_divide_by_zero_raises_value_error():\n    with pytest.raises(ValueError):\n        divide(10, 0)\n\n# Check exception message with match (regex)\ndef test_divide_by_zero_message():\n    with pytest.raises(ValueError, match=\"Cannot divide by zero\"):\n        divide(10, 0)\n\n# Check exception type\ndef test_divide_wrong_type_raises_type_error():\n    with pytest.raises(TypeError):\n        divide(\"ten\", 2)\n\n# Capture and inspect exception\ndef test_negative_age_message():\n    with pytest.raises(ValueError) as exc_info:\n        set_age(-5)\n    assert \"-5\" in str(exc_info.value)\n    assert \"negative\" in str(exc_info.value).lower()\n\n# Test that no exception is raised (implicit — just call it)\ndef test_valid_age_does_not_raise():\n    result = set_age(25)\n    assert result == 25\n\n# Multiple exception scenarios — separate tests\ndef test_age_too_high_raises_value_error():\n    with pytest.raises(ValueError, match=\"unrealistic\"):\n        set_age(200)",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Always test both the exception type and the message. `pytest.raises(ValueError)` only checks the type — a function that raises `ValueError('wrong message')` would still pass. Use `match='expected text'` to verify the message contains the right information. This catches bugs where the right exception type is raised for the wrong reason."
      },
      "keyPoints": [
        "pytest.raises(ExceptionType) passes only if that exception is raised in the block",
        "match='pattern' checks the exception message with a regex — use it always",
        "Capture with 'as exc_info' to inspect the exception after the block",
        "Test each exception scenario in a separate test function",
        "Test that valid input does NOT raise — just call the function and assert the result"
      ],
      "tryIt": "Write a validate_email(email) function that raises ValueError for: empty string, missing @, missing dot after @. Write three separate test functions — one for each failure case — using pytest.raises with match to verify the message. Add a fourth test that valid emails do not raise."
    }
  },

  {
    "id": 1080,
    "moduleId": 16,
    "moduleTitle": "Testing",
    "title": "Test Fixtures",
    "type": "lesson",
    "content": {
      "body": "Fixtures are reusable setup functions in pytest. Instead of creating the same objects at the start of every test, you define a fixture once and inject it into any test that needs it. pytest handles creation, injection, and cleanup automatically.\n\n## Defining a Fixture\n\nDecorate a function with `@pytest.fixture`. pytest calls it before each test that requests it and passes the return value as an argument:\n\n```python\n@pytest.fixture\ndef account():\n    return BankAccount(\"Alice\", 1000)\n\ndef test_deposit(account):   # account is injected\n    account.deposit(500)\n    assert account.balance == 1500\n```\n\n## Fixture Scope\n\nBy default, fixtures run once per test. Use `scope` to control how often:\n- `scope=\"function\"` — once per test (default)\n- `scope=\"class\"` — once per test class\n- `scope=\"module\"` — once per test file\n- `scope=\"session\"` — once per entire test run\n\n## Fixtures with Cleanup (yield)\n\nUse `yield` instead of `return` to add teardown code that runs after the test:\n\n```python\n@pytest.fixture\ndef db_connection():\n    conn = create_connection()\n    yield conn          # test runs here\n    conn.close()        # cleanup after test\n```\n\n## conftest.py\n\nFixtures defined in `conftest.py` are automatically available to all tests in the same directory and subdirectories — no import needed.",
      "diagram": "flowchart TD\n    A[\"@pytest.fixture\ndef account():\"] --> B[\"pytest calls fixture\nbefore test\"]\n    B --> C[\"def test_deposit(account):\nfixture injected\"]\n    C --> D[\"Test runs\"]\n    D --> E[\"yield fixture\"] --> F[\"Teardown runs\nafter test\"]\n    G[\"conftest.py\"] --> H[\"Fixtures available\nto all tests\nautomatically\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Fixtures inject setup into tests — yield fixtures add automatic teardown",
      "code": "import pytest\nfrom bank import BankAccount\n\n# Basic fixture\n@pytest.fixture\ndef empty_account():\n    return BankAccount(\"Alice\")\n\n@pytest.fixture\ndef funded_account():\n    return BankAccount(\"Alice\", 1000)\n\n# Tests use fixtures by name\ndef test_initial_balance_is_zero(empty_account):\n    assert empty_account.balance == 0\n\ndef test_deposit(funded_account):\n    funded_account.deposit(500)\n    assert funded_account.balance == 1500\n\ndef test_withdraw(funded_account):\n    funded_account.withdraw(200)\n    assert funded_account.balance == 800\n\n# Fixture with teardown using yield\n@pytest.fixture\ndef temp_file(tmp_path):\n    path = tmp_path / \"test.txt\"\n    path.write_text(\"test data\")\n    yield path\n    # cleanup happens automatically with tmp_path\n\ndef test_file_content(temp_file):\n    assert temp_file.read_text() == \"test data\"\n\n# Fixture scope — shared across all tests in module\n@pytest.fixture(scope=\"module\")\ndef expensive_setup():\n    print(\"Setting up once for the module\")\n    data = {\"key\": \"value\"}   # expensive operation\n    yield data\n    print(\"Tearing down module fixture\")\n\n# conftest.py — shared fixtures (no import needed)\n# Create tests/conftest.py:\n# @pytest.fixture\n# def db():\n#     conn = connect_to_test_db()\n#     yield conn\n#     conn.rollback()\n#     conn.close()",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "pytest has a built-in `tmp_path` fixture that provides a temporary directory unique to each test. Use it instead of creating and cleaning up temp files manually. It is automatically cleaned up after the test. Other useful built-in fixtures: `capsys` (capture stdout/stderr), `monkeypatch` (mock attributes), `caplog` (capture log output)."
      },
      "keyPoints": [
        "@pytest.fixture defines reusable setup — injected by name into test parameters",
        "Fixtures run before each test by default — scope controls how often",
        "yield fixtures add teardown code that runs after the test completes",
        "conftest.py makes fixtures available to all tests without importing",
        "Built-in fixtures: tmp_path, capsys, monkeypatch, caplog"
      ],
      "tryIt": "Create a fixture that returns a pre-populated list of student dicts (name, score). Write three tests that use it: one that finds the highest scorer, one that filters passing students, and one that calculates the average. Add a yield fixture that writes test data to a temp file and reads it back, verifying the content."
    }
  },

  {
    "id": 1081,
    "moduleId": 16,
    "moduleTitle": "Testing",
    "title": "Parametrized Tests",
    "type": "lesson",
    "content": {
      "body": "Parametrized tests run the same test function with multiple sets of inputs. Instead of writing five nearly identical test functions, you write one and provide a list of input/expected pairs. pytest runs it once per set and reports each as a separate test.\n\n## @pytest.mark.parametrize\n\n```python\n@pytest.mark.parametrize(\"a, b, expected\", [\n    (2, 3, 5),\n    (0, 0, 0),\n    (-1, 1, 0),\n    (100, 200, 300),\n])\ndef test_add(a, b, expected):\n    assert add(a, b) == expected\n```\n\npytest runs this four times, once per tuple. Each run is reported separately with the parameter values in the test name.\n\n## Single Parameter\n\nFor a single parameter, omit the tuple:\n\n```python\n@pytest.mark.parametrize(\"value\", [1, 2, 3, 100, -5])\ndef test_is_positive(value):\n    assert value > 0 or value <= 0   # always true — just an example\n```\n\n## Parametrize with IDs\n\nAdd human-readable IDs to make failure messages clearer:\n\n```python\n@pytest.mark.parametrize(\"email,valid\", [\n    (\"alice@example.com\", True),\n    (\"not-an-email\", False),\n], ids=[\"valid_email\", \"invalid_email\"])\n```\n\n## Combining with Fixtures\n\nParametrize and fixtures work together — the fixture runs once per parameter set.",
      "diagram": "flowchart TD\n    A[\"@pytest.mark.parametrize\n[(2,3,5),(0,0,0),(-1,1,0)]\"] --> B[\"test_add[2-3-5]\"]\n    A --> C[\"test_add[0-0-0]\"]\n    A --> D[\"test_add[-1-1-0]\"]\n    B --> E[\"PASS\"]\n    C --> F[\"PASS\"]\n    D --> G[\"PASS\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Parametrize runs one test function with multiple inputs — each reported separately",
      "code": "import pytest\n\ndef add(a, b):\n    return a + b\n\ndef is_valid_email(email):\n    return isinstance(email, str) and \"@\" in email and \".\" in email.split(\"@\")[-1]\n\ndef classify_score(score):\n    if score >= 90: return \"A\"\n    if score >= 75: return \"B\"\n    if score >= 50: return \"C\"\n    return \"F\"\n\n# Basic parametrize\n@pytest.mark.parametrize(\"a, b, expected\", [\n    (2, 3, 5),\n    (0, 0, 0),\n    (-1, 1, 0),\n    (100, 200, 300),\n    (-5, -3, -8),\n])\ndef test_add(a, b, expected):\n    assert add(a, b) == expected\n\n# Email validation — multiple cases\n@pytest.mark.parametrize(\"email, expected\", [\n    (\"alice@example.com\", True),\n    (\"bob@test.org\", True),\n    (\"not-an-email\", False),\n    (\"missing-dot@domain\", False),\n    (\"\", False),\n    (\"@nodomain.com\", False),\n], ids=[\"valid1\", \"valid2\", \"no_at\", \"no_dot\", \"empty\", \"no_local\"])\ndef test_is_valid_email(email, expected):\n    assert is_valid_email(email) == expected\n\n# Grade classifier — boundary values\n@pytest.mark.parametrize(\"score, grade\", [\n    (95, \"A\"), (90, \"A\"),\n    (89, \"B\"), (75, \"B\"),\n    (74, \"C\"), (50, \"C\"),\n    (49, \"F\"), (0, \"F\"),\n])\ndef test_classify_score(score, grade):\n    assert classify_score(score) == grade",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Always include boundary values in your parametrize list. For a grade classifier with threshold 90, test 89, 90, and 91 — not just 85 and 95. Boundary bugs (off-by-one errors) are the most common logic bugs and are only caught by testing the exact boundary values."
      },
      "keyPoints": [
        "@pytest.mark.parametrize runs one test with multiple input sets",
        "Each parameter set is reported as a separate test with the values in the name",
        "Use ids= for human-readable test names instead of auto-generated ones",
        "Always include boundary values — they catch off-by-one errors",
        "Parametrize reduces duplication — one test function replaces many identical ones"
      ],
      "tryIt": "Write a parametrized test for a temperature_category(celsius) function that returns 'freezing' (<0), 'cold' (0-15), 'comfortable' (16-25), 'hot' (>25). Include at least 8 parameter sets covering all categories and all boundary values. Run pytest and verify each case."
    }
  },

  {
    "id": 1082,
    "moduleId": 16,
    "moduleTitle": "Testing",
    "title": "Common Beginner Mistakes",
    "type": "lesson",
    "content": {
      "body": "Testing bugs are often subtle — tests that pass when they should fail, or tests that are so tightly coupled to implementation that they break on every refactor. These are the patterns that undermine the value of a test suite.\n\n## Mistake 1 — Testing Implementation, Not Behaviour\n\nTesting that a function calls a specific internal method rather than testing what it returns. When you refactor the implementation, the test breaks even though the behaviour is correct.\n\n## Mistake 2 — Tests That Always Pass\n\nA test with no assertions, or an assertion that is always `True`, gives false confidence. `assert True` passes but tests nothing.\n\n## Mistake 3 — Not Testing Edge Cases\n\nTesting only the happy path. Real bugs live in edge cases: empty input, zero, negative numbers, very large values, None, empty strings.\n\n## Mistake 4 — Shared Mutable State Between Tests\n\nTests that modify shared state (a global variable, a class attribute) can pass or fail depending on the order they run. Each test must be independent — set up its own state and not rely on other tests.\n\n## Mistake 5 — Catching Exceptions in Tests\n\nWrapping test code in `try/except` to prevent failures. If the code raises, the test should fail — that is the point. Use `pytest.raises()` when you expect an exception.\n\n## Mistake 6 — Ignoring Failing Tests\n\nCommenting out or skipping failing tests instead of fixing them. A test suite with known failures is worse than no tests — it creates false confidence.",
      "diagram": "flowchart TD\n    A[\"Testing Mistakes\"] --> B[\"Test implementation\nnot behaviour\"]\n    A --> C[\"No assertions\nalways passes\"]\n    A --> D[\"No edge cases\nhappy path only\"]\n    A --> E[\"Shared state\norder-dependent\"]\n    A --> F[\"Catching exceptions\nhides failures\"]\n    A --> G[\"Skipping failures\nfalse confidence\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Tests that always pass and shared state are the most dangerous — they give false confidence",
      "code": "import pytest\n\n# Mistake 1 — testing implementation not behaviour\n# BAD: tests internal call, breaks on refactor\n# def test_add_calls_sum():\n#     with mock.patch('builtins.sum') as mock_sum:\n#         add([1,2,3])\n#         mock_sum.assert_called()\n\n# GOOD: test the result\ndef test_add_returns_correct_sum():\n    assert add([1, 2, 3]) == 6\n\n# Mistake 2 — test with no real assertion\n# BAD:\ndef test_nothing():\n    result = add(2, 3)\n    assert True   # always passes!\n\n# GOOD:\ndef test_add_two_positives():\n    assert add(2, 3) == 5\n\n# Mistake 3 — missing edge cases\n# BAD: only tests happy path\ndef test_divide_basic():\n    assert divide(10, 2) == 5\n\n# GOOD: includes edge cases\ndef test_divide_edge_cases():\n    assert divide(0, 5) == 0       # zero numerator\n    assert divide(-10, 2) == -5    # negative\n    assert divide(1, 3) == pytest.approx(0.333, rel=1e-3)\n\n# Mistake 4 — shared mutable state\ncounter = 0   # shared state — BAD\n\ndef test_first():\n    global counter\n    counter += 1\n    assert counter == 1   # passes if run first\n\ndef test_second():\n    global counter\n    counter += 1\n    assert counter == 1   # FAILS if run after test_first!\n\n# GOOD: each test creates its own state\ndef test_independent():\n    local_counter = 0\n    local_counter += 1\n    assert local_counter == 1\n\n# Mistake 5 — catching exceptions in tests\n# BAD:\ndef test_bad_exception_handling():\n    try:\n        divide(10, 0)\n    except ValueError:\n        pass   # test always passes — even if wrong exception!\n\n# GOOD:\ndef test_divide_by_zero():\n    with pytest.raises(ValueError, match=\"zero\"):\n        divide(10, 0)",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "A test suite where all tests pass but the code is broken is worse than no tests. It creates false confidence. The most common cause: tests with no meaningful assertions, tests that catch all exceptions, or tests that share mutable state. Run your tests with a deliberately broken function — if they still pass, your tests are not testing anything."
      },
      "keyPoints": [
        "Test behaviour (what it returns) not implementation (how it works internally)",
        "Every test must have at least one meaningful assertion — assert True tests nothing",
        "Always test edge cases: empty, zero, negative, None, very large values",
        "Each test must be independent — no shared mutable state between tests",
        "Never catch exceptions in tests — use pytest.raises() for expected exceptions"
      ],
      "tryIt": "Audit your existing tests for all six mistakes. For each one found: (1) identify which mistake it is, (2) explain why it is a problem, (3) rewrite it correctly. Then deliberately break the function being tested and verify the corrected test now fails as expected."
    }
  },

  {
    "id": 1083,
    "moduleId": 16,
    "moduleTitle": "Testing",
    "title": "Module 16 Summary",
    "type": "lesson",
    "content": {
      "body": "This module introduced automated testing — one of the most important professional skills in software development. Tests give you confidence to change code, catch bugs before users do, and document how your code is meant to be used.\n\n## What You Learned\n\n**What testing is** — automated code that verifies other code. Unit tests are fast and focused. The testing pyramid: many unit tests, fewer integration tests, very few E2E tests.\n\n**assert** — Python's built-in check. Raises `AssertionError` if the condition is `False`. Use for tests and debugging, never for production validation.\n\n**pytest** — the industry-standard framework. Discovers tests automatically. Better failure messages. Run with `pytest`, `pytest -v`, `pytest -k pattern`.\n\n**Test naming and structure** — `test_function_scenario_expected`. AAA pattern: Arrange, Act, Assert. Group related tests in `Test` classes.\n\n**Testing exceptions** — `pytest.raises(ExceptionType, match='pattern')`. Test both the type and the message. One exception scenario per test.\n\n**Fixtures** — `@pytest.fixture` for reusable setup. `yield` for teardown. `conftest.py` for shared fixtures. Built-in fixtures: `tmp_path`, `capsys`, `monkeypatch`.\n\n**Parametrized tests** — `@pytest.mark.parametrize` runs one test with multiple inputs. Always include boundary values.\n\n## What Is Coming Next\n\nModule 17 introduces **APIs** — making HTTP requests with the `requests` library, parsing JSON responses, handling errors, and working with authentication.",
      "diagram": "flowchart TD\n    A[\"✅ What is testing\nunit integration E2E\"] --> B[\"✅ assert\nbuilt-in check\"]\n    B --> C[\"✅ pytest\ndiscovery messages\"]\n    C --> D[\"✅ Naming & AAA\ntest_fn_scenario_expected\"]\n    D --> E[\"✅ Testing exceptions\npytest.raises match\"]\n    E --> F[\"✅ Fixtures\nsetup teardown conftest\"]\n    F --> G[\"✅ Parametrize\nmultiple inputs\"]\n    G --> H[\"➡️ APIs\nModule 17\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 16 complete — testing is the foundation of professional Python development",
      "code": "import pytest\n\n# Everything from Module 16 in one test file\n\ndef validate_user(name, age, email):\n    if not name or not name.strip():\n        raise ValueError(\"Name cannot be empty\")\n    if not isinstance(age, int) or age < 0 or age > 150:\n        raise ValueError(f\"Invalid age: {age}\")\n    if not email or \"@\" not in email:\n        raise ValueError(f\"Invalid email: {email}\")\n    return {\"name\": name.strip(), \"age\": age, \"email\": email}\n\n@pytest.fixture\ndef valid_data():\n    return {\"name\": \"Alice\", \"age\": 30, \"email\": \"alice@example.com\"}\n\nclass TestValidateUser:\n\n    def test_valid_user_returns_dict(self, valid_data):\n        result = validate_user(**valid_data)\n        assert result[\"name\"] == \"Alice\"\n        assert result[\"age\"] == 30\n\n    def test_empty_name_raises(self):\n        with pytest.raises(ValueError, match=\"empty\"):\n            validate_user(\"\", 30, \"a@b.com\")\n\n    def test_whitespace_name_raises(self):\n        with pytest.raises(ValueError, match=\"empty\"):\n            validate_user(\"   \", 30, \"a@b.com\")\n\n    def test_invalid_email_raises(self):\n        with pytest.raises(ValueError, match=\"email\"):\n            validate_user(\"Alice\", 30, \"not-an-email\")\n\n    @pytest.mark.parametrize(\"age\", [-1, 151, -100, 200])\n    def test_invalid_age_raises(self, age):\n        with pytest.raises(ValueError, match=\"age\"):\n            validate_user(\"Alice\", age, \"a@b.com\")\n\n    @pytest.mark.parametrize(\"age\", [0, 1, 25, 100, 150])\n    def test_valid_ages_pass(self, age):\n        result = validate_user(\"Alice\", age, \"a@b.com\")\n        assert result[\"age\"] == age",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Before moving on, make sure you can write a complete test file from memory: a fixture, a test class with AAA-structured tests, exception tests with match, and a parametrized test with boundary values. If you can write tests for the validate_user function above without looking at examples, you have mastered Module 16."
      },
      "keyPoints": [
        "Tests give confidence to change code — without them every change is risky",
        "pytest discovers tests automatically — name files test_*.py and functions test_*",
        "AAA pattern: Arrange, Act, Assert — keeps tests readable and focused",
        "pytest.raises(Type, match='pattern') tests both exception type and message",
        "Parametrize with boundary values — off-by-one errors only show at the boundary"
      ],
      "tryIt": "From memory, write a complete test suite for a Stack class (push, pop, peek, is_empty, size). Include: a fixture that returns a pre-populated stack, tests for all methods, exception tests for popping/peeking an empty stack, and a parametrized test for pushing multiple values."
    }
  },

  {
    "id": 1084,
    "moduleId": 17,
    "moduleTitle": "APIs",
    "title": "What Is an API?",
    "type": "lesson",
    "content": {
      "body": "An API (Application Programming Interface) is a defined way for two programs to communicate. A web API lets your Python code talk to remote services — fetching weather data, sending messages, querying databases, processing payments — without knowing anything about how those services work internally.\n\n## Why APIs Matter\n\nAPIs are how modern software is built. Instead of building everything from scratch, you connect to services that already do what you need. Weather data, maps, payments, authentication, email, SMS, machine learning — all available as APIs.\n\n## How Web APIs Work\n\nYour program sends an HTTP request to a URL. The server processes it and sends back a response — usually JSON data. Your program reads the JSON and uses the data.\n\n```\nYour Python code\n    → HTTP request → https://api.example.com/users\n    ← HTTP response ← {\"users\": [...]}\n```\n\n## REST APIs\n\nMost web APIs follow REST (Representational State Transfer) conventions:\n- Resources are identified by URLs: `/users`, `/users/42`, `/users/42/posts`\n- HTTP methods indicate the action: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)\n- Responses are JSON\n\n## The requests Library\n\nPython's `requests` library is the standard tool for making HTTP requests. It is not in the standard library — install with `pip install requests`.",
      "diagram": "flowchart LR\n    A[\"Python code\"] -->|\"HTTP request\nGET /users\"| B[\"API Server\"]\n    B -->|\"HTTP response\n200 OK + JSON\"| A\n    C[\"REST conventions\"] --> D[\"GET — read\"]\n    C --> E[\"POST — create\"]\n    C --> F[\"PUT/PATCH — update\"]\n    C --> G[\"DELETE — remove\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "APIs communicate via HTTP — your code sends a request, the server returns JSON",
      "code": "# Install requests first:\n# pip install requests\n\nimport requests\n\n# The simplest possible API call\nresponse = requests.get(\"https://httpbin.org/get\")\n\n# Response object contains everything\nprint(response.status_code)   # 200\nprint(response.headers[\"Content-Type\"])\nprint(type(response.json()))  # dict\n\n# A real public API — no key needed\nresponse = requests.get(\"https://api.github.com/users/python\")\nuser = response.json()\nprint(user[\"name\"])           # Python\nprint(user[\"public_repos\"])   # number of repos\nprint(user[\"followers\"])      # follower count\n\n# Another free API — random user data\nresponse = requests.get(\"https://randomuser.me/api/\")\ndata = response.json()\nperson = data[\"results\"][0]\nprint(person[\"name\"][\"first\"], person[\"name\"][\"last\"])\nprint(person[\"email\"])",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Always check the API documentation before writing code. The docs tell you: what endpoints exist, what parameters they accept, what the response looks like, rate limits, and authentication requirements. Good API docs include example requests and responses — read them first."
      },
      "keyPoints": [
        "APIs let programs communicate — web APIs use HTTP to exchange data",
        "REST APIs use URLs for resources and HTTP methods for actions",
        "GET reads data, POST creates, PUT/PATCH updates, DELETE removes",
        "Responses are almost always JSON — a dict or list in Python",
        "requests is the standard Python library for HTTP — pip install requests"
      ],
      "tryIt": "Make a GET request to https://api.github.com/users/YOUR_USERNAME (replace with your GitHub username). Print your name, bio, number of public repos, and follower count. Then make a request to https://api.github.com/users/YOUR_USERNAME/repos and print the names of your first 5 repositories."
    }
  },

  {
    "id": 1085,
    "moduleId": 17,
    "moduleTitle": "APIs",
    "title": "HTTP Basics",
    "type": "lesson",
    "content": {
      "body": "HTTP (HyperText Transfer Protocol) is the language of the web. Every API call is an HTTP request and response. Understanding the key parts of HTTP makes you a better API consumer and helps you debug problems.\n\n## HTTP Request Structure\n\nEvery request has:\n- **Method** — GET, POST, PUT, PATCH, DELETE\n- **URL** — the resource address\n- **Headers** — metadata (Content-Type, Authorization, Accept)\n- **Body** — data sent with POST/PUT requests (usually JSON)\n\n## HTTP Response Structure\n\nEvery response has:\n- **Status code** — a number indicating success or failure\n- **Headers** — metadata about the response\n- **Body** — the actual data (usually JSON)\n\n## Status Codes\n\n| Range | Meaning | Examples |\n|---|---|---|\n| 2xx | Success | 200 OK, 201 Created, 204 No Content |\n| 3xx | Redirect | 301 Moved, 302 Found |\n| 4xx | Client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests |\n| 5xx | Server error | 500 Internal Server Error, 503 Service Unavailable |\n\n## Headers\n\nHeaders carry metadata. Common ones:\n- `Content-Type: application/json` — body is JSON\n- `Authorization: Bearer token` — authentication\n- `Accept: application/json` — tell server what format you want",
      "diagram": "flowchart TD\n    A[\"HTTP Request\"] --> B[\"Method\nGET POST PUT DELETE\"]\n    A --> C[\"URL\nhttps://api.example.com/users\"]\n    A --> D[\"Headers\nAuthorization Content-Type\"]\n    A --> E[\"Body\nJSON data for POST/PUT\"]\n    F[\"HTTP Response\"] --> G[\"Status Code\n200 404 500\"]\n    F --> H[\"Headers\nContent-Type Rate-Limit\"]\n    F --> I[\"Body\nJSON data\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Every API interaction is a request (method + URL + headers + body) and a response (status + headers + body)",
      "code": "import requests\n\nresponse = requests.get(\"https://httpbin.org/get\")\n\n# Status code\nprint(response.status_code)   # 200\nprint(response.ok)             # True if 200-299\n\n# Response headers\nprint(response.headers[\"Content-Type\"])\nprint(response.headers.get(\"X-RateLimit-Remaining\"))\n\n# Status code categories\ndef describe_status(code):\n    if 200 <= code < 300:\n        return \"Success\"\n    elif 300 <= code < 400:\n        return \"Redirect\"\n    elif 400 <= code < 500:\n        return \"Client error\"\n    elif 500 <= code < 600:\n        return \"Server error\"\n\nprint(describe_status(200))   # Success\nprint(describe_status(404))   # Client error\nprint(describe_status(500))   # Server error\n\n# Common status codes\n# 200 OK — request succeeded\n# 201 Created — resource created (POST)\n# 204 No Content — success, no body (DELETE)\n# 400 Bad Request — invalid request data\n# 401 Unauthorized — authentication required\n# 403 Forbidden — authenticated but not allowed\n# 404 Not Found — resource does not exist\n# 429 Too Many Requests — rate limited\n# 500 Internal Server Error — server bug\n\n# Request headers\nheaders = {\n    \"Accept\": \"application/json\",\n    \"User-Agent\": \"MyApp/1.0\",\n}\nresponse = requests.get(\"https://httpbin.org/headers\", headers=headers)\nprint(response.json())",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Always check `response.status_code` before using the response data. A 404 response has a body too — but it is an error message, not the data you wanted. Use `response.raise_for_status()` to automatically raise an exception for any 4xx or 5xx status code — it is the cleanest way to handle HTTP errors."
      },
      "keyPoints": [
        "HTTP requests have: method, URL, headers, and optional body",
        "HTTP responses have: status code, headers, and body",
        "2xx = success, 4xx = client error, 5xx = server error",
        "Common codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found",
        "response.raise_for_status() raises an exception for 4xx and 5xx responses"
      ],
      "tryIt": "Make requests to these URLs and print the status code and a description for each: https://httpbin.org/status/200, https://httpbin.org/status/404, https://httpbin.org/status/500. Then make a request to a real API endpoint and print all response headers. Use response.raise_for_status() and catch the exception for the 404."
    }
  },

  {
    "id": 1086,
    "moduleId": 17,
    "moduleTitle": "APIs",
    "title": "Making GET Requests",
    "type": "lesson",
    "content": {
      "body": "GET requests retrieve data from an API. They are the most common type of API call — fetching a user, listing products, searching for records. The `requests.get()` function handles everything.\n\n## Basic GET Request\n\n```python\nimport requests\nresponse = requests.get(\"https://api.example.com/users\")\ndata = response.json()\n```\n\n## Query Parameters\n\nQuery parameters filter, sort, or paginate results. Pass them as a dict to the `params` argument — requests handles URL encoding automatically.\n\n```python\nresponse = requests.get(\n    \"https://api.example.com/users\",\n    params={\"page\": 1, \"per_page\": 10, \"sort\": \"name\"}\n)\n# Becomes: /users?page=1&per_page=10&sort=name\n```\n\n## Timeouts\n\nAlways set a timeout. Without one, your program can hang indefinitely if the server is slow or unresponsive.\n\n```python\nresponse = requests.get(url, timeout=10)   # 10 seconds\n```\n\n## Sessions\n\nFor multiple requests to the same API, use a `Session` object. It reuses the TCP connection and lets you set headers once for all requests.\n\n```python\nsession = requests.Session()\nsession.headers[\"Authorization\"] = \"Bearer token\"\nresponse = session.get(\"/users\")\n```",
      "diagram": "flowchart TD\n    A[\"requests.get(url)\"] --> B[\"params={}\nquery string\"]\n    A --> C[\"headers={}\nAuthorization etc\"]\n    A --> D[\"timeout=10\ndon't hang forever\"]\n    B --> E[\"URL encoded\n?key=value&key2=value2\"]\n    F[\"response\"] --> G[\".status_code\n200 404 etc\"]\n    F --> H[\".json()\nparse JSON body\"]\n    F --> I[\".raise_for_status()\nraise on 4xx 5xx\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Always set timeout and call raise_for_status() — never assume the request succeeded",
      "code": "import requests\n\nBASE_URL = \"https://jsonplaceholder.typicode.com\"\n\n# Basic GET\nresponse = requests.get(f\"{BASE_URL}/users\", timeout=10)\nresponse.raise_for_status()\nusers = response.json()\nprint(f\"Got {len(users)} users\")\nprint(users[0][\"name\"])\n\n# GET with query parameters\nresponse = requests.get(\n    f\"{BASE_URL}/posts\",\n    params={\"userId\": 1, \"_limit\": 3},\n    timeout=10\n)\nresponse.raise_for_status()\nposts = response.json()\nfor post in posts:\n    print(f\"  {post['id']}: {post['title'][:40]}\")\n\n# GET a single resource by ID\nuser_id = 1\nresponse = requests.get(f\"{BASE_URL}/users/{user_id}\", timeout=10)\nresponse.raise_for_status()\nuser = response.json()\nprint(f\"Name: {user['name']}, Email: {user['email']}\")\n\n# Session — reuse connection and headers\nsession = requests.Session()\nsession.headers.update({\n    \"Accept\": \"application/json\",\n    \"User-Agent\": \"PythonCourse/1.0\",\n})\n\nr1 = session.get(f\"{BASE_URL}/users/1\", timeout=10)\nr2 = session.get(f\"{BASE_URL}/users/2\", timeout=10)\nprint(r1.json()[\"name\"], r2.json()[\"name\"])",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Always set a `timeout` on every request. Without it, `requests.get()` will wait forever if the server never responds — hanging your program indefinitely. A timeout of 5-30 seconds is typical. Use a tuple `timeout=(connect_timeout, read_timeout)` for separate connect and read timeouts."
      },
      "keyPoints": [
        "requests.get(url, params={}, headers={}, timeout=10) is the standard call",
        "Pass query parameters as a dict — requests handles URL encoding automatically",
        "Always set timeout — without it your program can hang indefinitely",
        "response.raise_for_status() raises HTTPError for 4xx and 5xx responses",
        "Use Session() for multiple requests to the same API — reuses connection and headers"
      ],
      "tryIt": "Using the JSONPlaceholder API (jsonplaceholder.typicode.com): fetch all posts by user 1 using query params, fetch the first 5 comments on post 1, and fetch user 3's details. For each request: set a timeout, call raise_for_status(), and print a meaningful summary of the response data."
    }
  },

  {
    "id": 1087,
    "moduleId": 17,
    "moduleTitle": "APIs",
    "title": "Parsing JSON Responses",
    "type": "lesson",
    "content": {
      "body": "API responses are almost always JSON. The `requests` library parses JSON automatically with `response.json()`, returning a Python dict or list. Knowing how to navigate nested JSON structures is an essential everyday skill.\n\n## response.json()\n\n`response.json()` parses the response body as JSON and returns a Python object. It raises `requests.exceptions.JSONDecodeError` if the body is not valid JSON — which happens when the server returns an error page instead of JSON.\n\n## Navigating Nested Structures\n\nReal API responses are often deeply nested. Use chained key access and list indexing:\n\n```python\ndata = response.json()\ncity = data[\"location\"][\"city\"]\nfirst_tag = data[\"tags\"][0]\n```\n\nUse `.get()` for optional fields to avoid `KeyError`:\n\n```python\nbio = data.get(\"bio\", \"No bio provided\")\n```\n\n## Extracting Data with Comprehensions\n\nList comprehensions are the clean way to extract fields from a list of dicts:\n\n```python\nnames = [user[\"name\"] for user in data[\"users\"]]\nemails = [u[\"email\"] for u in data[\"users\"] if u.get(\"active\")]\n```\n\n## Handling Unexpected Structure\n\nAPI responses can change. Always use `.get()` for optional fields, check list lengths before indexing, and handle `None` values explicitly.",
      "diagram": "flowchart TD\n    A[\"response.json()\"] --> B[\"Python dict or list\"]\n    B --> C[\"data['key']\nnested access\"]\n    B --> D[\"data.get('key', default)\nsafe access\"]\n    B --> E[\"data['list'][0]\nlist indexing\"]\n    F[\"List of dicts\"] --> G[\"[item['field']\nfor item in data]\"]\n    G --> H[\"Extract fields\nwith comprehension\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "response.json() returns a Python dict or list — use .get() for safe access to optional fields",
      "code": "import requests\n\nBASE = \"https://jsonplaceholder.typicode.com\"\n\n# Basic JSON parsing\nresponse = requests.get(f\"{BASE}/users/1\", timeout=10)\nresponse.raise_for_status()\nuser = response.json()\n\n# Direct access\nprint(user[\"name\"])\nprint(user[\"email\"])\n\n# Nested access\nprint(user[\"address\"][\"city\"])\nprint(user[\"address\"][\"geo\"][\"lat\"])\nprint(user[\"company\"][\"name\"])\n\n# Safe access with .get()\nprint(user.get(\"bio\", \"No bio\"))          # optional field\nprint(user.get(\"phone\", \"No phone\"))\n\n# List of objects\nresponse = requests.get(f\"{BASE}/users\", timeout=10)\nresponse.raise_for_status()\nusers = response.json()\n\n# Extract with comprehension\nnames = [u[\"name\"] for u in users]\nemails = [u[\"email\"] for u in users]\ncities = [u[\"address\"][\"city\"] for u in users]\n\nprint(f\"Users: {len(users)}\")\nprint(f\"Cities: {cities[:3]}\")\n\n# Filter and extract\nlondon_users = [u[\"name\"] for u in users if \"London\" in u[\"address\"][\"city\"]]\n\n# Nested list\nresponse = requests.get(f\"{BASE}/posts/1/comments\", timeout=10)\ncomments = response.json()\nprint(f\"Comments: {len(comments)}\")\nfirst_email = comments[0].get(\"email\", \"unknown\")\nprint(f\"First commenter: {first_email}\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Before writing code to parse an API response, print the raw JSON first: `import json; print(json.dumps(response.json(), indent=2))`. This shows you the exact structure — field names, nesting levels, and data types. Never guess the structure; always inspect it first."
      },
      "keyPoints": [
        "response.json() parses JSON into a Python dict or list automatically",
        "Use chained key access for nested structures: data['address']['city']",
        "Use .get(key, default) for optional fields — avoids KeyError",
        "List comprehensions extract fields from lists of dicts cleanly",
        "Always print the raw JSON first to understand the structure before parsing"
      ],
      "tryIt": "Fetch https://jsonplaceholder.typicode.com/users and parse the response. Print: all user names, all unique cities, the user with the longest name, and a dict mapping each user's name to their company name. Use list comprehensions and .get() throughout."
    }
  },

  {
    "id": 1088,
    "moduleId": 17,
    "moduleTitle": "APIs",
    "title": "Query Parameters and Headers",
    "type": "lesson",
    "content": {
      "body": "Query parameters and headers are the two main ways to customise an API request. Query parameters filter and configure the data you get back. Headers carry authentication, content type, and other metadata.\n\n## Query Parameters\n\nPass as a dict to `params=`. requests URL-encodes them automatically. Use them for: filtering, sorting, pagination, search terms, and format selection.\n\n```python\nrequests.get(url, params={\n    \"q\": \"python\",\n    \"sort\": \"stars\",\n    \"per_page\": 10,\n    \"page\": 1,\n})\n# → /search?q=python&sort=stars&per_page=10&page=1\n```\n\n## Request Headers\n\nPass as a dict to `headers=`. Common headers:\n\n**`Authorization`** — authentication token or API key\n**`Content-Type`** — format of the request body (usually `application/json`)\n**`Accept`** — format you want in the response\n**`User-Agent`** — identify your application\n\n```python\nheaders = {\n    \"Authorization\": \"Bearer your-token\",\n    \"Accept\": \"application/json\",\n}\n```\n\n## API Keys\n\nMany APIs require an API key for authentication. Keys are passed as a header, a query parameter, or both — check the API docs.\n\n```python\n# As header\nheaders = {\"X-API-Key\": os.environ[\"API_KEY\"]}\n\n# As query parameter\nparams = {\"api_key\": os.environ[\"API_KEY\"]}\n```\n\nAlways store API keys in environment variables — never hardcode them.",
      "diagram": "flowchart LR\n    A[\"GET /search\"] --> B[\"params={}\n?q=python&page=1\"]\n    A --> C[\"headers={}\nAuthorization: Bearer ...\"]\n    B --> D[\"Filter results\nPaginate\nSort\"]\n    C --> E[\"Authenticate\nIdentify format\nRate limit bypass\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "params= for query string; headers= for metadata and authentication",
      "code": "import requests\nimport os\n\n# Query parameters — GitHub search API (no auth needed for basic use)\nresponse = requests.get(\n    \"https://api.github.com/search/repositories\",\n    params={\n        \"q\": \"language:python stars:>10000\",\n        \"sort\": \"stars\",\n        \"order\": \"desc\",\n        \"per_page\": 5,\n    },\n    headers={\"Accept\": \"application/vnd.github.v3+json\"},\n    timeout=10,\n)\nresponse.raise_for_status()\ndata = response.json()\nprint(f\"Total results: {data['total_count']}\")\nfor repo in data[\"items\"]:\n    print(f\"  {repo['full_name']}: {repo['stargazers_count']:,} stars\")\n\n# Headers — User-Agent is required by GitHub API\nsession = requests.Session()\nsession.headers.update({\n    \"Accept\": \"application/json\",\n    \"User-Agent\": \"PythonCourse/1.0 (learning)\",\n})\n\n# API key from environment variable\napi_key = os.environ.get(\"OPENWEATHER_API_KEY\")\nif api_key:\n    response = session.get(\n        \"https://api.openweathermap.org/data/2.5/weather\",\n        params={\"q\": \"London\", \"appid\": api_key, \"units\": \"metric\"},\n        timeout=10,\n    )\n    if response.ok:\n        weather = response.json()\n        print(f\"London: {weather['main']['temp']}C\")\n\n# Inspect what URL was actually sent\nr = requests.Request(\"GET\", \"https://api.example.com/search\",\n    params={\"q\": \"test\", \"page\": 1})\nprepared = r.prepare()\nprint(prepared.url)   # https://api.example.com/search?q=test&page=1",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "Never hardcode API keys in your source code. Store them in environment variables and load with `os.environ.get('API_KEY')`. If you accidentally commit an API key, rotate it immediately — deleting the commit is not enough since git history is permanent. Use `.env` files locally and environment variables in production."
      },
      "keyPoints": [
        "params={} adds query parameters — requests URL-encodes them automatically",
        "headers={} adds request headers — use for auth, content type, user agent",
        "API keys go in environment variables — never hardcode them",
        "Use a Session to set headers once for all requests to the same API",
        "Print prepared.url to see the exact URL that will be sent"
      ],
      "tryIt": "Use the GitHub API to search for Python repositories with more than 5000 stars. Sort by most recently updated. Print the top 10 results with name, stars, and last update date. Add a User-Agent header (required by GitHub). Then add pagination — fetch page 2 and compare the results."
    }
  },

  {
    "id": 1089,
    "moduleId": 17,
    "moduleTitle": "APIs",
    "title": "POST Requests and Authentication",
    "type": "lesson",
    "content": {
      "body": "POST requests send data to an API to create a resource. Authentication proves your identity to the API. Together, these let you build integrations that do more than just read data.\n\n## POST Requests\n\n`requests.post()` sends data in the request body. Pass a dict to `json=` and requests sets the `Content-Type: application/json` header automatically.\n\n```python\nresponse = requests.post(\n    \"https://api.example.com/users\",\n    json={\"name\": \"Alice\", \"email\": \"alice@example.com\"},\n    timeout=10,\n)\n```\n\n## PUT and PATCH\n\n`PUT` replaces an entire resource. `PATCH` updates specific fields. Use `requests.put()` and `requests.patch()` with the same `json=` argument.\n\n## DELETE\n\n`requests.delete(url)` removes a resource. Usually returns 204 No Content on success.\n\n## Authentication Methods\n\n**API Key** — passed as a header or query parameter. Simple but less secure.\n\n**Bearer Token** — a JWT or OAuth token in the `Authorization` header. The most common modern approach.\n\n**Basic Auth** — username and password encoded in the header. Use `auth=(username, password)`.\n\n**OAuth 2.0** — a multi-step flow that grants tokens. Used by Google, GitHub, Twitter. The `requests-oauthlib` library handles the flow.",
      "diagram": "flowchart TD\n    A[\"POST /users\njson={'name':'Alice'}\"] --> B[\"201 Created\n{'id': 42, 'name': 'Alice'}\"]\n    C[\"PUT /users/42\njson={full object}\"] --> D[\"200 OK\nupdated resource\"]\n    E[\"PATCH /users/42\njson={'email':'new@...'}\"] --> F[\"200 OK\npartial update\"]\n    G[\"DELETE /users/42\"] --> H[\"204 No Content\"]\n    I[\"Auth methods\"] --> J[\"API Key\nX-API-Key header\"]\n    I --> K[\"Bearer Token\nAuthorization: Bearer ...\"]\n    I --> L[\"Basic Auth\nauth=(user, pass)\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "POST creates, PUT replaces, PATCH updates, DELETE removes — all need authentication",
      "code": "import requests\nimport os\n\nBASE = \"https://jsonplaceholder.typicode.com\"\n\n# POST — create a resource\nresponse = requests.post(\n    f\"{BASE}/posts\",\n    json={\n        \"title\": \"My First Post\",\n        \"body\": \"This is the content\",\n        \"userId\": 1,\n    },\n    timeout=10,\n)\nresponse.raise_for_status()\ncreated = response.json()\nprint(f\"Created post with id: {created['id']}\")\n\n# PUT — replace entire resource\nresponse = requests.put(\n    f\"{BASE}/posts/1\",\n    json={\"id\": 1, \"title\": \"Updated Title\", \"body\": \"New body\", \"userId\": 1},\n    timeout=10,\n)\nprint(f\"PUT status: {response.status_code}\")\n\n# PATCH — update specific fields\nresponse = requests.patch(\n    f\"{BASE}/posts/1\",\n    json={\"title\": \"Just the title changed\"},\n    timeout=10,\n)\nprint(f\"PATCH status: {response.status_code}\")\n\n# DELETE\nresponse = requests.delete(f\"{BASE}/posts/1\", timeout=10)\nprint(f\"DELETE status: {response.status_code}\")   # 200 (JSONPlaceholder quirk)\n\n# Bearer token authentication\ntoken = os.environ.get(\"API_TOKEN\", \"demo-token\")\nresponse = requests.get(\n    \"https://httpbin.org/bearer\",\n    headers={\"Authorization\": f\"Bearer {token}\"},\n    timeout=10,\n)\nprint(f\"Auth status: {response.status_code}\")\n\n# Basic auth\nresponse = requests.get(\n    \"https://httpbin.org/basic-auth/user/pass\",\n    auth=(\"user\", \"pass\"),\n    timeout=10,\n)\nprint(f\"Basic auth: {response.json()['authenticated']}\")",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use `json=` not `data=` when sending JSON to an API. `json=` automatically sets `Content-Type: application/json` and serialises the dict. `data=` sends form-encoded data, which most modern APIs do not accept. If you get a 400 Bad Request on a POST, check that you are using `json=` and not `data=`."
      },
      "keyPoints": [
        "requests.post(url, json={}) sends JSON — sets Content-Type automatically",
        "PUT replaces the full resource; PATCH updates specific fields",
        "DELETE removes a resource — usually returns 204 No Content",
        "Bearer token: headers={'Authorization': 'Bearer token'}",
        "Basic auth: auth=('username', 'password') — requests handles encoding"
      ],
      "tryIt": "Using JSONPlaceholder: POST a new todo item with title and completed=False, verify the 201 response and print the created id. Then PATCH it to set completed=True. Finally DELETE it and verify the response. For each request, print the status code and a summary of the response body."
    }
  },

  {
    "id": 1090,
    "moduleId": 17,
    "moduleTitle": "APIs",
    "title": "Error Handling",
    "type": "lesson",
    "content": {
      "body": "API calls can fail in many ways — network errors, timeouts, rate limits, authentication failures, invalid data. Robust error handling is what separates a script that works on your machine from code that runs reliably in production.\n\n## The Error Hierarchy\n\n`requests` exceptions all inherit from `requests.exceptions.RequestException`:\n\n- `ConnectionError` — network problem, DNS failure\n- `Timeout` — request exceeded the timeout\n- `HTTPError` — raised by `raise_for_status()` for 4xx/5xx\n- `JSONDecodeError` — response body is not valid JSON\n\n## The Standard Pattern\n\n```python\ntry:\n    response = requests.get(url, timeout=10)\n    response.raise_for_status()\n    data = response.json()\nexcept requests.exceptions.Timeout:\n    print(\"Request timed out\")\nexcept requests.exceptions.HTTPError as e:\n    print(f\"HTTP error: {e.response.status_code}\")\nexcept requests.exceptions.RequestException as e:\n    print(f\"Request failed: {e}\")\n```\n\n## Rate Limiting\n\nAPIs limit how many requests you can make per minute/hour. A 429 response means you have been rate limited. Always check for 429 and implement retry logic with exponential backoff.\n\n## Retry Logic\n\nFor transient failures (timeouts, 5xx errors), retry with increasing delays. The `tenacity` library or `urllib3.util.retry` handle this cleanly.\n\n## Defensive Parsing\n\nNever assume the response structure. Use `.get()` for optional fields, check list lengths, and handle `None` values.",
      "diagram": "flowchart TD\n    A[\"requests.get()\"] --> B{\"Success?\"}\n    B -->|\"Network error\"| C[\"ConnectionError\nretry or fail\"]\n    B -->|\"Timeout\"| D[\"Timeout\nretry with backoff\"]\n    B -->|\"4xx 5xx\"| E[\"HTTPError\ncheck status code\"]\n    B -->|\"200 OK\"| F[\"raise_for_status()\nparse JSON\"]\n    E --> G[\"401 — check auth\n404 — not found\n429 — rate limited\n500 — server bug\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Handle each error type differently — network errors retry, 4xx errors need fixing, 5xx errors retry",
      "code": "import requests\nimport time\n\ndef fetch_with_retry(url, max_retries=3, timeout=10):\n    \"\"\"Fetch URL with retry logic for transient failures.\"\"\"\n    for attempt in range(max_retries):\n        try:\n            response = requests.get(url, timeout=timeout)\n            response.raise_for_status()\n            return response.json()\n\n        except requests.exceptions.Timeout:\n            wait = 2 ** attempt   # exponential backoff: 1, 2, 4 seconds\n            print(f\"Timeout on attempt {attempt + 1}, retrying in {wait}s\")\n            if attempt < max_retries - 1:\n                time.sleep(wait)\n\n        except requests.exceptions.HTTPError as e:\n            status = e.response.status_code\n            if status == 429:\n                retry_after = int(e.response.headers.get(\"Retry-After\", 60))\n                print(f\"Rate limited. Waiting {retry_after}s\")\n                time.sleep(retry_after)\n            elif status == 401:\n                raise ValueError(\"Authentication failed — check your API key\")\n            elif status == 404:\n                return None   # not found is not an error\n            elif 500 <= status < 600:\n                print(f\"Server error {status}, retrying\")\n                time.sleep(2 ** attempt)\n            else:\n                raise   # 4xx errors are not retryable\n\n        except requests.exceptions.ConnectionError as e:\n            print(f\"Connection failed: {e}\")\n            if attempt < max_retries - 1:\n                time.sleep(2 ** attempt)\n\n    raise RuntimeError(f\"Failed after {max_retries} attempts\")\n\n# Usage\nresult = fetch_with_retry(\"https://jsonplaceholder.typicode.com/users/1\")\nif result:\n    print(result[\"name\"])\n\n# Check for specific error details\ntry:\n    r = requests.get(\"https://httpbin.org/status/429\", timeout=5)\n    r.raise_for_status()\nexcept requests.exceptions.HTTPError as e:\n    print(f\"Status: {e.response.status_code}\")\n    print(f\"Headers: {dict(e.response.headers)}\") ",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use exponential backoff for retries: wait 1 second after the first failure, 2 after the second, 4 after the third. This prevents hammering a struggling server. For production code, use the `tenacity` library which handles retry logic, backoff, and jitter with a clean decorator interface."
      },
      "keyPoints": [
        "requests exceptions: Timeout, ConnectionError, HTTPError all inherit from RequestException",
        "raise_for_status() raises HTTPError for 4xx and 5xx — call it after every request",
        "429 Too Many Requests means rate limited — check Retry-After header and wait",
        "Retry transient failures (timeout, 5xx) with exponential backoff",
        "404 Not Found is often not an error — return None and handle it in the caller"
      ],
      "tryIt": "Write a robust fetch_user(user_id) function that handles: Timeout (retry up to 3 times with backoff), 404 (return None), 401 (raise ValueError with clear message), 429 (wait and retry), and any other HTTPError (re-raise). Test each case using httpbin.org/status/CODE."
    }
  },

  {
    "id": 1091,
    "moduleId": 17,
    "moduleTitle": "APIs",
    "title": "Working with Pagination",
    "type": "lesson",
    "content": {
      "body": "Most APIs that return lists of data use pagination — they return a limited number of results per request and provide a way to get the next page. Without handling pagination, you only ever see the first page of results.\n\n## Why Pagination Exists\n\nReturning thousands of records in one response would be slow and memory-intensive for both the server and the client. Pagination lets you fetch data in manageable chunks.\n\n## Common Pagination Styles\n\n**Page-based** — `?page=1&per_page=20`. Simple but inefficient for large datasets.\n\n**Offset-based** — `?offset=0&limit=20`, then `?offset=20&limit=20`. Similar to page-based.\n\n**Cursor-based** — the response includes a `next_cursor` token. Use it in the next request. More efficient for large, changing datasets.\n\n**Link header** — the response includes a `Link` header with URLs for next, prev, first, last pages. Used by GitHub.\n\n## Fetching All Pages\n\nThe standard pattern: loop until there is no next page.\n\n```python\npage = 1\nall_results = []\nwhile True:\n    response = requests.get(url, params={\"page\": page, \"per_page\": 100})\n    data = response.json()\n    all_results.extend(data)\n    if len(data) < 100:   # last page\n        break\n    page += 1\n```\n\n## Rate Limit Awareness\n\nFetching all pages means many requests. Add a small delay between pages and check rate limit headers to avoid being blocked.",
      "diagram": "flowchart TD\n    A[\"GET /items?page=1\"] --> B[\"Items 1-20\nnext: page=2\"]\n    B --> C[\"GET /items?page=2\"]\n    C --> D[\"Items 21-40\nnext: page=3\"]\n    D --> E[\"GET /items?page=3\"]\n    E --> F[\"Items 41-45\nno next page\"]\n    F --> G[\"All 45 items\ncollected\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Fetch pages in a loop until the response is empty or has no next page link",
      "code": "import requests\nimport time\n\ndef fetch_all_pages(base_url, params=None, page_size=100, delay=0.1):\n    \"\"\"Fetch all pages from a paginated API.\"\"\"\n    params = params or {}\n    params[\"per_page\"] = page_size\n    all_items = []\n    page = 1\n\n    while True:\n        params[\"page\"] = page\n        response = requests.get(base_url, params=params, timeout=10)\n        response.raise_for_status()\n        items = response.json()\n\n        if not items:\n            break\n\n        all_items.extend(items)\n        print(f\"Page {page}: got {len(items)} items (total: {len(all_items)})\")\n\n        if len(items) < page_size:\n            break   # last page\n\n        page += 1\n        time.sleep(delay)   # be polite to the API\n\n    return all_items\n\n# JSONPlaceholder — 100 posts total\nposts = fetch_all_pages(\n    \"https://jsonplaceholder.typicode.com/posts\",\n    page_size=10\n)\nprint(f\"Total posts: {len(posts)}\")\n\n# GitHub Link header pagination\ndef fetch_github_pages(url, headers=None, max_pages=5):\n    \"\"\"Follow GitHub Link header pagination.\"\"\"\n    headers = headers or {\"Accept\": \"application/vnd.github.v3+json\"}\n    all_items = []\n    page_count = 0\n\n    while url and page_count < max_pages:\n        response = requests.get(url, headers=headers, timeout=10)\n        response.raise_for_status()\n        all_items.extend(response.json())\n        page_count += 1\n\n        # Parse Link header for next page URL\n        link = response.headers.get(\"Link\", \"\")\n        next_url = None\n        for part in link.split(\",\"):\n            if 'rel=\"next\"' in part:\n                next_url = part.split(\";\")[0].strip().strip(\"<>\")\n        url = next_url\n\n    return all_items",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Always add a small delay between paginated requests — `time.sleep(0.1)` is usually enough. Without it, you may hit rate limits and get blocked. Also set a maximum page limit to prevent infinite loops if the API has a bug or the data is larger than expected."
      },
      "keyPoints": [
        "Pagination returns data in chunks — you must loop to get all results",
        "Common styles: page-based, offset-based, cursor-based, Link header",
        "Loop until the response is empty or shorter than the page size",
        "Add a small delay between pages to avoid rate limiting",
        "Set a maximum page limit to prevent infinite loops"
      ],
      "tryIt": "Write a function get_all_repos(username) that fetches all public repositories for a GitHub user using pagination (GitHub returns max 30 per page by default, 100 with per_page=100). Print the total count and the names of the 5 most recently updated repos. Add a delay between pages."
    }
  },

  {
    "id": 1092,
    "moduleId": 17,
    "moduleTitle": "APIs",
    "title": "Module 17 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered working with web APIs — one of the most practical and frequently used skills in Python development. APIs connect your code to the world.\n\n## What You Learned\n\n**What APIs are** — HTTP-based interfaces for program-to-program communication. REST APIs use URLs for resources and HTTP methods for actions.\n\n**HTTP basics** — requests have method, URL, headers, body. Responses have status code, headers, body. 2xx = success, 4xx = client error, 5xx = server error.\n\n**GET requests** — `requests.get(url, params={}, headers={}, timeout=10)`. Always set timeout. Call `raise_for_status()`. Use `Session` for multiple requests.\n\n**Parsing JSON** — `response.json()` returns a dict or list. Use `.get()` for optional fields. List comprehensions extract fields from lists of dicts.\n\n**Query parameters and headers** — `params={}` for query string, `headers={}` for metadata and auth. Store API keys in environment variables.\n\n**POST, PUT, PATCH, DELETE** — `json={}` sends JSON body. Bearer tokens and Basic auth for authentication.\n\n**Error handling** — catch `Timeout`, `HTTPError`, `ConnectionError`. Retry transient failures with exponential backoff. Handle 429 rate limits.\n\n**Pagination** — loop until empty response or no next page. Add delays between pages. Set a maximum page limit.\n\n## What Is Coming Next\n\nModule 18 is the **Capstone Project** — building a complete Python application that uses everything from the course.",
      "diagram": "flowchart TD\n    A[\"✅ What is an API\nHTTP REST\"] --> B[\"✅ HTTP basics\nstatus codes headers\"]\n    B --> C[\"✅ GET requests\nparams timeout session\"]\n    C --> D[\"✅ JSON parsing\n.get() comprehensions\"]\n    D --> E[\"✅ Params & headers\nAPI keys auth\"]\n    E --> F[\"✅ POST PUT DELETE\njson= bearer basic\"]\n    F --> G[\"✅ Error handling\nretry backoff 429\"]\n    G --> H[\"✅ Pagination\nloop all pages\"]\n    H --> I[\"➡️ Capstone Project\nModule 18\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 17 complete — APIs connect your Python code to the world",
      "code": "import requests\nimport os\nimport time\n\nclass GitHubClient:\n    \"\"\"A simple GitHub API client demonstrating Module 17 concepts.\"\"\"\n\n    BASE_URL = \"https://api.github.com\"\n\n    def __init__(self, token=None):\n        self.session = requests.Session()\n        self.session.headers.update({\n            \"Accept\": \"application/vnd.github.v3+json\",\n            \"User-Agent\": \"PythonCourse/1.0\",\n        })\n        if token:\n            self.session.headers[\"Authorization\"] = f\"Bearer {token}\"\n\n    def get_user(self, username):\n        response = self.session.get(\n            f\"{self.BASE_URL}/users/{username}\", timeout=10\n        )\n        if response.status_code == 404:\n            return None\n        response.raise_for_status()\n        return response.json()\n\n    def get_repos(self, username, max_pages=5):\n        all_repos = []\n        page = 1\n        while page <= max_pages:\n            response = self.session.get(\n                f\"{self.BASE_URL}/users/{username}/repos\",\n                params={\"per_page\": 100, \"page\": page, \"sort\": \"updated\"},\n                timeout=10,\n            )\n            response.raise_for_status()\n            repos = response.json()\n            if not repos:\n                break\n            all_repos.extend(repos)\n            if len(repos) < 100:\n                break\n            page += 1\n            time.sleep(0.1)\n        return all_repos\n\nclient = GitHubClient(token=os.environ.get(\"GITHUB_TOKEN\"))\nuser = client.get_user(\"python\")\nif user:\n    print(f\"{user['name']}: {user['public_repos']} repos\")\n    repos = client.get_repos(\"python\")\n    print(f\"Fetched {len(repos)} repos\")",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Before moving on, make sure you can write a complete API client from memory: a Session with headers, a GET with params and timeout, raise_for_status(), JSON parsing with .get(), and basic error handling. The GitHubClient above is the pattern — adapt it for any API you work with."
      },
      "keyPoints": [
        "Always set timeout and call raise_for_status() on every request",
        "Store API keys in environment variables — never in source code",
        "Use Session for multiple requests — set headers once, reuse connection",
        "Handle each error type appropriately — retry transient, fix client errors",
        "Paginate with a loop, delay between pages, and a maximum page limit"
      ],
      "tryIt": "Build a complete API client class for the JSONPlaceholder API with methods: get_user(id), get_user_posts(user_id), create_post(user_id, title, body), and delete_post(post_id). Each method should handle errors appropriately. Write tests for each method using pytest and monkeypatch to mock the HTTP calls."
    }
  },

  {
    "id": 1093,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "The Challenge",
    "type": "lesson",
    "content": {
      "body": "You have completed 17 modules of Python. Now it is time to prove it.\n\nThe capstone is not a tutorial. There are no step-by-step instructions. You are given a brief, a set of requirements, and milestones. You decide how to build it.\n\n## The Project: Personal Task Manager\n\nBuild a command-line task manager that a real person could use daily. It must persist data between sessions, handle invalid input gracefully, and be structured like professional code — not a single 300-line script.\n\n## Why This Project\n\nIt is deliberately chosen to touch every major concept from the course:\n\n- Variables, data types, and operators\n- Control flow and loops\n- Functions with validation and error handling\n- Lists and dicts as the data model\n- File handling for persistence\n- Modules and project structure\n- OOP (optional but encouraged)\n- Testing with pytest\n- Virtual environment and requirements.txt\n\n## The Rules\n\n**No copying tutorials.** If you find a task manager tutorial online, close it. The struggle is the learning.\n\n**Build incrementally.** Complete each milestone before moving to the next. A working simple version beats a broken complex one.\n\n**Test as you go.** Write tests alongside your code — not all at the end.\n\n**Document your decisions.** Your README should explain not just how to run it, but why you made key design choices.",
      "diagram": "flowchart TD\n    A[\"The Challenge\"] --> B[\"Build a CLI\nTask Manager\"]\n    B --> C[\"Milestone 1\nData & Storage\"]\n    C --> D[\"Milestone 2\nCore Operations\"]\n    D --> E[\"Milestone 3\nUser Interface\"]\n    E --> F[\"Milestone 4\nTesting\"]\n    F --> G[\"Milestone 5\nPolish\"]\n    G --> H[\"Submission\nChecklist\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Five milestones — complete each before moving to the next",
      "code": "# This is what your finished project should be able to do.\n# How you build it is entirely up to you.\n\n# $ python -m task_manager\n\n# Task Manager\n# ============\n# 1. Add task\n# 2. View tasks\n# 3. Mark complete\n# 4. Delete task\n# 5. Quit\n# > 1\n\n# Title: Buy groceries\n# Priority (low/medium/high): high\n# Due date (YYYY-MM-DD, optional):\n# Task added: [1] Buy groceries (high)\n\n# > 2\n# ID  Status  Priority  Title                Due\n# --  ------  --------  -------------------  ----------\n#  1  pending high      Buy groceries        —\n#  2  done    medium    Read Python docs     —\n\n# > 3\n# Task ID: 1\n# Marked complete: Buy groceries\n\n# > 5\n# Goodbye! Tasks saved.\n\n# On next run — tasks are still there.",
      "language": "python",
      "callout": {
        "type": "warning",
        "text": "The most common capstone mistake is starting to code immediately. Spend 20 minutes planning first: sketch the data structure, list the functions you need, decide how files will be organised. Developers who plan build faster and make fewer structural mistakes that require rewriting everything."
      },
      "keyPoints": [
        "This is a challenge — no step-by-step instructions, you decide how to build it",
        "The project touches every major concept from the course",
        "Complete each milestone before moving to the next",
        "Write tests alongside your code — not all at the end",
        "Document your design decisions in the README"
      ],
      "tryIt": "Before writing any code: (1) sketch the task data structure as a Python dict with all fields, (2) list every function the app needs with its name and what it does, (3) draw the file structure, (4) write the first paragraph of your README. Only then open your editor."
    }
  },

  {
    "id": 1094,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Project Requirements",
    "type": "lesson",
    "content": {
      "body": "These are the requirements your finished project must meet. They describe what the app does — not how to build it. Every decision about implementation is yours.\n\n## Functional Requirements\n\n**Task creation** — the user can add a task with a title (required), priority (low/medium/high, default medium), and optional due date. Each task gets a unique ID assigned automatically.\n\n**Task listing** — the user can view all tasks in a readable format showing ID, status, priority, title, and due date. The user can filter by status: all, pending, or completed.\n\n**Task completion** — the user can mark a task as complete by its ID. Completing an already-complete task should show an appropriate message.\n\n**Task deletion** — the user can delete a task by its ID. The app should confirm before deleting.\n\n**Persistence** — tasks are saved to a file automatically. When the app starts, it loads the saved tasks. If no file exists, it starts with an empty list.\n\n## Non-Functional Requirements\n\n**No crashes** — the app must never crash on invalid input. Empty title, wrong priority, non-numeric ID, missing file — all handled gracefully.\n\n**Clean structure** — the code must be split into at least two files. A single 300-line main.py does not meet this requirement.\n\n**Tests** — at least 10 pytest tests covering the core logic. Tests must pass.\n\n**README** — explains what the app does, how to install and run it, and at least one design decision you made and why.",
      "diagram": "flowchart TD\n    A[\"Requirements\"] --> B[\"Functional\nwhat it does\"]\n    A --> C[\"Non-functional\nhow it behaves\"]\n    B --> D[\"Add task\nList filter\nComplete\nDelete\nPersist\"]\n    C --> E[\"No crashes\nClean structure\n10+ tests\nREADME\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Functional requirements define what it does — non-functional define how well it does it",
      "code": "# Acceptance criteria — your project passes when:\n\n# 1. I can add a task with title, priority, and optional due date\n# 2. I can list all tasks and see their status\n# 3. I can filter tasks by pending or completed\n# 4. I can mark a task complete by ID\n# 5. I can delete a task by ID with confirmation\n# 6. Tasks persist — quit and restart, they are still there\n# 7. Invalid input never crashes the app:\n#    - Empty title → error message, re-prompt\n#    - Invalid priority → error message, re-prompt\n#    - Non-numeric ID → error message, re-prompt\n#    - ID that does not exist → clear error message\n#    - Missing tasks file → start with empty list\n# 8. Code is in at least 2 files\n# 9. pytest tests/ passes with 10+ tests\n# 10. README explains installation and one design decision\n\n# Optional extensions (not required):\n# - Search tasks by keyword\n# - Sort by priority or due date\n# - Edit an existing task\n# - Colour output with colorama\n# - Export to CSV",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Build the core requirements first. All 10 acceptance criteria must pass before you add any extensions. A complete, tested app with 5 features is far more impressive than a half-finished app with 10 features. Extensions are for after everything works."
      },
      "keyPoints": [
        "5 functional requirements: add, list, complete, delete, persist",
        "4 non-functional requirements: no crashes, clean structure, 10+ tests, README",
        "Every acceptance criterion must pass before submission",
        "Extensions are optional — only after all core requirements are met",
        "A complete simple app beats an incomplete complex one"
      ],
      "tryIt": "Print this list of acceptance criteria and keep it next to you while building. Check off each one as it passes. Do not move to the next milestone until the current one's criteria are all checked."
    }
  },

  {
    "id": 1095,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Milestone 1 — Data and Storage",
    "type": "lesson",
    "content": {
      "body": "Your first milestone is the foundation: define what a task looks like and make it persist to disk. Nothing else works until this is solid.\n\n## Your Goal\n\nBy the end of this milestone you should be able to:\n- Create a task with all required fields\n- Save a list of tasks to a file\n- Load tasks back from that file\n- Handle the case where the file does not exist\n- Handle the case where the file is corrupt\n\n## Constraints\n\n- Tasks must be stored as JSON — not pickle, not CSV, not a custom format\n- The file must be human-readable when opened in a text editor\n- Loading a missing file must return an empty list — not crash\n- All of this must be in its own module — not in main.py\n\n## Acceptance Criteria\n\n- `create_task(\"Buy milk\", \"high\")` returns a dict with all required fields populated\n- `create_task(\"\", \"high\")` raises `ValueError`\n- `create_task(\"Test\", \"invalid\")` raises `ValueError`\n- `save_tasks(tasks)` writes a valid JSON file\n- `load_tasks()` on a missing file returns `[]`\n- `load_tasks()` on a corrupt file returns `[]` without crashing\n- `load_tasks(save_tasks(tasks))` round-trips correctly\n- All of the above have passing pytest tests",
      "diagram": "flowchart TD\n    A[\"Milestone 1\"] --> B[\"Design task\ndata structure\"]\n    B --> C[\"Write create_task()\nwith validation\"]\n    C --> D[\"Write save_tasks()\nJSON to file\"]\n    D --> E[\"Write load_tasks()\nhandle missing corrupt\"]\n    E --> F[\"Write tests\nfor all of the above\"]\n    F --> G[\"All tests pass\nMilestone 1 complete\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Data and storage first — nothing else works until this foundation is solid",
      "code": "# What your milestone 1 code should be able to do.\n# The implementation is yours — this is just the interface.\n\n# From your models/data module:\ntask = create_task(\"Buy groceries\", \"high\", \"2025-02-01\")\n# task is a dict with: id, title, priority, completed,\n#                      created_at, due_date, completed_at\n\n# Validation:\n# create_task(\"\", \"high\")       → raises ValueError\n# create_task(\"Test\", \"urgent\") → raises ValueError\n# create_task(\"Test\", \"high\", \"not-a-date\") → raises ValueError\n\n# From your storage module:\ntasks = [task]\nsave_tasks(tasks)   # writes tasks.json\n\nloaded = load_tasks()   # reads tasks.json\nassert loaded == tasks  # round-trip works\n\n# Edge cases:\nimport os\nos.remove(\"tasks.json\")\nassert load_tasks() == []   # missing file → empty list\n\nwith open(\"tasks.json\", \"w\") as f:\n    f.write(\"not valid json {{{\")\nassert load_tasks() == []   # corrupt file → empty list\n\n# Tests:\n# pytest tests/test_models.py tests/test_storage.py\n# All pass before moving to Milestone 2",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Write the tests for create_task() before implementing it. List every case that should work and every case that should raise. Then implement until all tests pass. This is TDD — and it is the fastest way to build correct code because you know exactly when you are done."
      },
      "keyPoints": [
        "Define the task data structure first — every other function depends on it",
        "Store tasks as JSON — human-readable and trivial to load with json.load()",
        "load_tasks() must never crash — return [] for missing or corrupt files",
        "Put data and storage in their own modules — not in main.py",
        "Write tests before implementing — you know you are done when they all pass"
      ],
      "tryIt": "Complete Milestone 1. Run pytest on your models and storage tests. Every acceptance criterion must pass before you move to Milestone 2. If any test fails, fix it before continuing."
    }
  },

  {
    "id": 1096,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Milestone 2 — Core Operations",
    "type": "lesson",
    "content": {
      "body": "With data and storage working, you now build the business logic — the functions that add, complete, delete, and list tasks. These are the operations the user will trigger from the menu.\n\n## Your Goal\n\nBy the end of this milestone you should have a set of functions that operate on a task list in memory. They take the list and some parameters, do their job, and return a result or raise an exception. They do not print anything. They do not save to disk. That is the caller's job.\n\n## Constraints\n\n- Every operation must validate its inputs and raise `ValueError` with a clear message for invalid input\n- No function in this module should call `print()` or `input()`\n- No function should call `save_tasks()` — persistence is the caller's responsibility\n- All operations must have passing tests before you move on\n\n## Acceptance Criteria\n\n- `add_task(tasks, \"Buy milk\", \"high\")` adds a task with the correct next ID and returns it\n- `add_task(tasks, \"\", \"high\")` raises `ValueError`\n- `complete_task(tasks, 1)` marks task 1 complete and sets `completed_at`\n- `complete_task(tasks, 999)` raises `ValueError` — task not found\n- `delete_task(tasks, 1)` removes task 1 and returns it\n- `delete_task(tasks, 999)` raises `ValueError` — task not found\n- `list_tasks(tasks, \"pending\")` returns only incomplete tasks\n- `list_tasks(tasks, \"completed\")` returns only complete tasks\n- `list_tasks(tasks, \"all\")` returns all tasks\n- All of the above have passing pytest tests",
      "diagram": "flowchart TD\n    A[\"Milestone 2\"] --> B[\"add_task()\nassign ID validate\"]\n    A --> C[\"complete_task()\nfind by ID mark done\"]\n    A --> D[\"delete_task()\nfind by ID remove\"]\n    A --> E[\"list_tasks()\nfilter by status\"]\n    B --> F[\"No print()\nNo save()\nNo input()\"]\n    C --> F\n    D --> F\n    E --> F\n    F --> G[\"Tests pass\nMilestone 2 complete\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Operations are pure logic — no I/O, no display, no persistence",
      "code": "# What your milestone 2 code must be able to do.\n# The implementation is yours.\n\ntasks = []\n\n# add_task — returns the new task\ntask = add_task(tasks, \"Buy groceries\", \"high\")\nassert task[\"id\"] == 1\nassert task[\"title\"] == \"Buy groceries\"\nassert task[\"completed\"] is False\nassert task in tasks\n\n# IDs increment correctly\nadd_task(tasks, \"Read docs\", \"medium\")\nadd_task(tasks, \"Clean desk\", \"low\")\nassert tasks[1][\"id\"] == 2\nassert tasks[2][\"id\"] == 3\n\n# complete_task — marks done, sets timestamp\ncomplete_task(tasks, 1)\nassert tasks[0][\"completed\"] is True\nassert tasks[0][\"completed_at\"] is not None\n\n# complete_task — not found raises\ntry:\n    complete_task(tasks, 999)\n    assert False, \"Should have raised\"\nexcept ValueError:\n    pass\n\n# delete_task — removes and returns\ndeleted = delete_task(tasks, 2)\nassert deleted[\"title\"] == \"Read docs\"\nassert len(tasks) == 2\n\n# list_tasks — filter\npending = list_tasks(tasks, \"pending\")\nassert len(pending) == 1   # only task 3 is pending\n\ncompleted = list_tasks(tasks, \"completed\")\nassert len(completed) == 1  # task 1\n\nall_tasks = list_tasks(tasks, \"all\")\nassert len(all_tasks) == 2",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "The rule 'no print() in operations' is not arbitrary. It makes your functions testable without capturing stdout, reusable in different contexts (CLI, web API, GUI), and easier to reason about. A function that only transforms data is always easier to test and reuse than one that also produces output."
      },
      "keyPoints": [
        "Operations are pure logic — no print(), no input(), no save_tasks()",
        "Every operation validates inputs and raises ValueError for invalid data",
        "find by ID pattern: next((t for t in tasks if t['id'] == id), None)",
        "list_tasks() filters and returns a new list — does not modify the original",
        "All tests must pass before moving to Milestone 3"
      ],
      "tryIt": "Complete Milestone 2. Run pytest on your operations tests. Write at least 3 tests per function — happy path, not found, and an edge case. Every acceptance criterion must pass before you move to Milestone 3."
    }
  },

  {
    "id": 1097,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Milestone 3 — User Interface",
    "type": "lesson",
    "content": {
      "body": "With the logic working and tested, you now build the interface — the menu, input handling, display formatting, and the main loop that ties everything together.\n\n## Your Goal\n\nBy the end of this milestone the app is fully functional. A user can run it, add tasks, view them, complete them, delete them, quit, and come back to find their tasks still there.\n\n## Constraints\n\n- The main loop must be in `main.py` (or `__main__.py`)\n- Input handling must re-prompt on invalid input — never crash\n- Display must be readable — a formatted table, not raw dict output\n- The app must auto-save after every operation that modifies tasks\n- `main.py` must use `if __name__ == \"__main__\":`\n\n## Acceptance Criteria\n\n- Running `python -m task_manager` (or `python main.py`) starts the app\n- The menu is clear and all 5 options work\n- Entering a non-numeric ID shows an error and re-prompts — does not crash\n- Entering an invalid priority shows an error and re-prompts — does not crash\n- Entering an empty title shows an error and re-prompts — does not crash\n- Tasks display in a readable format with ID, status, priority, title, due date\n- Quitting and restarting shows the same tasks\n- The app never crashes on any input — try to break it\n\n## The Test\n\nHand your app to someone who has never seen it. Tell them nothing. Watch what they do. If they can figure out how to use it without help and it does not crash, you have passed this milestone.",
      "diagram": "flowchart TD\n    A[\"main.py\"] --> B[\"load_tasks()\"]\n    B --> C[\"show menu\"]\n    C --> D{\"choice\"}\n    D -->|\"1\"| E[\"get input\nvalidate\nadd_task()\nsave\"]\n    D -->|\"2\"| F[\"get filter\nlist_tasks()\ndisplay\"]\n    D -->|\"3\"| G[\"get ID\ncomplete_task()\nsave\"]\n    D -->|\"4\"| H[\"get ID\nconfirm\ndelete_task()\nsave\"]\n    D -->|\"5\"| I[\"quit\"]\n    E --> C\n    F --> C\n    G --> C\n    H --> C\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style I fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "main.py orchestrates — it calls operations, handles errors, saves, and loops",
      "code": "# What your milestone 3 app must look like from the outside.\n# The implementation is yours.\n\n# $ python -m task_manager\n\n# Task Manager\n# ============\n# 1. Add task\n# 2. View tasks\n# 3. Mark complete\n# 4. Delete task\n# 5. Quit\n# > 3a\n# Please enter a number.\n# > 99\n# Error: Task 99 not found.\n# > 2\n\n# ID  Status    Priority  Title                Due\n# --  --------  --------  -------------------  ----------\n#  1  pending   high      Buy groceries        2025-02-01\n#  2  pending   medium    Read Python docs     —\n#  3  completed low       Clean desk           —\n\n# > 1\n# Title: \n# Title cannot be empty.\n# Title: Buy milk\n# Priority (low/medium/high) [medium]: \n# Task added: [4] Buy milk (medium)\n\n# > 5\n# Goodbye! 4 tasks saved.\n\n# $ python -m task_manager\n# Loaded 4 tasks.\n# (tasks are still there)",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Keep main.py thin. If you find yourself writing business logic in main.py — calculating IDs, checking if tasks exist, formatting dates — move it to operations.py or display.py. main.py should read like a high-level description of what the app does, not how it does it."
      },
      "keyPoints": [
        "main.py orchestrates — it calls operations, handles errors, saves, and loops",
        "Input helpers re-prompt on invalid input — never pass raw input to operations",
        "Auto-save after every modifying operation — never lose data",
        "Display must be readable — formatted table, not raw dict output",
        "Test by trying to break it — enter garbage, empty strings, huge numbers"
      ],
      "tryIt": "Complete Milestone 3. Try to crash your app with every kind of bad input you can think of. Then give it to someone else and watch them use it. Fix every crash and every confusing moment before moving to Milestone 4."
    }
  },

  {
    "id": 1098,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Milestone 4 — Testing",
    "type": "lesson",
    "content": {
      "body": "Your app works. Now prove it. A working app without tests is a fragile app — one refactor away from breaking silently. This milestone is about building confidence through a proper test suite.\n\n## Your Goal\n\nWrite a test suite that covers the critical paths of your application. When all tests pass, you should be able to refactor any module with confidence that you will catch regressions immediately.\n\n## What to Test\n\n**models** — create_task with valid and invalid inputs. mark_complete on pending and already-complete tasks.\n\n**storage** — save/load round-trip. Load from missing file. Load from corrupt file. Save creates the file if it does not exist.\n\n**operations** — add_task ID assignment. complete_task and delete_task happy path and not-found. list_tasks all three filter options.\n\n## What Not to Test\n\nDo not test main.py directly — it requires user input and is hard to automate. Do not test display formatting unless you specifically want to. Focus on the logic.\n\n## Acceptance Criteria\n\n- `pytest tests/` runs without errors\n- At least 10 tests total\n- At least one parametrized test\n- At least one fixture used across multiple tests\n- At least one exception test using `pytest.raises()`\n- All tests are independent — no test depends on another test's state\n- Tests use `tmp_path` for any file operations — no real files created",
      "diagram": "flowchart TD\n    A[\"Test Suite\"] --> B[\"test_models.py\n4+ tests\"]\n    A --> C[\"test_storage.py\n4+ tests\"]\n    A --> D[\"test_operations.py\n6+ tests\"]\n    A --> E[\"conftest.py\nshared fixtures\"]\n    B --> F[\"pytest tests/\nall pass\"]\n    C --> F\n    D --> F\n    E --> F\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "10+ tests across 3 files — fixtures, parametrize, and exception tests required",
      "code": "# Your test suite must include at least these patterns.\n# The specific tests are yours to design.\n\nimport pytest\n\n# 1. A fixture used by multiple tests\n@pytest.fixture\ndef sample_tasks():\n    tasks = []\n    # add some tasks using your add_task function\n    return tasks\n\n# 2. A parametrized test\n@pytest.mark.parametrize(\"title,priority,should_raise\", [\n    (\"Valid task\", \"high\", False),\n    (\"\", \"high\", True),          # empty title\n    (\"Task\", \"urgent\", True),    # invalid priority\n    (\"  \", \"low\", True),         # whitespace only\n])\ndef test_create_task_validation(title, priority, should_raise):\n    if should_raise:\n        with pytest.raises(ValueError):\n            create_task(title, priority)\n    else:\n        task = create_task(title, priority)\n        assert task[\"title\"] == title.strip()\n\n# 3. An exception test\ndef test_complete_nonexistent_task_raises(sample_tasks):\n    with pytest.raises(ValueError, match=\"not found\"):\n        complete_task(sample_tasks, 9999)\n\n# 4. A storage test using tmp_path\ndef test_save_load_roundtrip(tmp_path, monkeypatch):\n    monkeypatch.chdir(tmp_path)\n    tasks = [create_task(\"Test\", \"medium\")]\n    save_tasks(tasks)\n    loaded = load_tasks()\n    assert len(loaded) == 1\n    assert loaded[0][\"title\"] == \"Test\"\n\n# 5. Edge case\ndef test_load_missing_file_returns_empty(tmp_path, monkeypatch):\n    monkeypatch.chdir(tmp_path)\n    result = load_tasks()\n    assert result == []",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Use `monkeypatch.chdir(tmp_path)` to redirect file operations to a temporary directory during tests. This means your tests never touch real files in your project directory and clean up automatically. It is cleaner than patching the file path constant directly."
      },
      "keyPoints": [
        "10+ tests across test_models.py, test_storage.py, test_operations.py",
        "Required: at least one fixture, one parametrized test, one pytest.raises() test",
        "Use tmp_path and monkeypatch.chdir() for file operation tests",
        "All tests must be independent — no shared mutable state between tests",
        "pytest tests/ must pass with zero failures before submission"
      ],
      "tryIt": "Complete Milestone 4. Run pytest --tb=short -v and fix every failure. Then run pytest --cov=. and check coverage. Find the uncovered lines and decide whether they need tests. Aim for 80%+ coverage on models and operations."
    }
  },

  {
    "id": 1099,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Milestone 5 — Polish and Extensions",
    "type": "lesson",
    "content": {
      "body": "Your app works and is tested. This milestone is about making it something you are proud to show. Polish the rough edges, write the README, and — if you have time — add one extension that makes the app genuinely more useful.\n\n## Your Goal\n\nBy the end of this milestone your project is ready to show to anyone. The code is clean, the README is complete, and the app handles every edge case gracefully.\n\n## Polish Checklist\n\n**Code quality** — run `black .` to format your code. Run `ruff check .` to catch style issues. Fix everything they flag.\n\n**Error messages** — every error message should tell the user what went wrong and what to do instead. \"Invalid input\" is not helpful. \"Priority must be low, medium, or high\" is.\n\n**Edge cases** — what happens with 0 tasks? 1000 tasks? A task title with special characters? A due date in the past? Test these manually.\n\n**Project structure** — is your `.gitignore` correct? Is `requirements.txt` up to date? Is `.env.example` present if needed?\n\n## Choose One Extension\n\nPick one that genuinely improves the app for a real user:\n\n- **Search** — filter tasks by keyword in the title\n- **Sort** — sort by priority, due date, or creation date\n- **Edit** — change a task's title, priority, or due date\n- **Overdue highlighting** — mark tasks past their due date visually\n- **Statistics** — show total, pending, completed, and overdue counts\n- **Export** — save tasks to a CSV file\n\nWrite tests for your extension before implementing it.",
      "diagram": "flowchart TD\n    A[\"Milestone 5\"] --> B[\"Run black ruff\nfix all issues\"]\n    B --> C[\"Improve error\nmessages\"]\n    C --> D[\"Test edge cases\nmanually\"]\n    D --> E[\"Update .gitignore\nrequirements.txt\"]\n    E --> F[\"Choose one\nextension\"]\n    F --> G[\"Write tests first\nthen implement\"]\n    G --> H[\"Project ready\nto submit\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Polish before extensions — a clean simple app beats a messy complex one",
      "code": "# Polish checklist — run these before submission\n\n# 1. Format code\n# pip install black ruff\n# black .\n# ruff check .\n\n# 2. Check requirements.txt is complete\n# pip freeze > requirements.txt\n\n# 3. Verify .gitignore covers:\n# .venv/\n# __pycache__/\n# *.pyc\n# .env\n# tasks.json   (optional — depends if you want to share sample data)\n\n# 4. Test edge cases manually:\n# - Add a task with a very long title (100+ chars)\n# - Add 20 tasks, then list them\n# - Complete all tasks, then list pending (should show empty)\n# - Delete all tasks, then try to complete one\n# - Enter Ctrl+C during input (KeyboardInterrupt)\n\n# 5. Extension example — search (implement yours differently)\n# def search_tasks(tasks, query):\n#     \"\"\"Return tasks whose title contains query (case-insensitive).\"\"\"\n#     # Your implementation here\n#     pass\n\n# 6. README must include:\n# - What the app does (2-3 sentences)\n# - Installation instructions\n# - How to run it\n# - How to run the tests\n# - One design decision you made and why\n# - (Optional) Screenshot or demo\n\n# Final check:\n# git clone your own repo into a fresh directory\n# Follow your own README from scratch\n# If it works first time, you are done",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "The README 'design decision' section is what separates a student project from a professional one. Write about a real choice you made: why you split the code into modules the way you did, why you chose JSON over CSV, why you used a list of dicts instead of a class. Explaining your reasoning shows you understand what you built."
      },
      "keyPoints": [
        "Run black and ruff before submission — fix everything they flag",
        "Every error message should tell the user what went wrong and what to do",
        "Test edge cases manually — 0 tasks, 1000 tasks, special characters",
        "Choose one extension that genuinely improves the app — write tests first",
        "Clone your own repo and follow your README — if it works, you are done"
      ],
      "tryIt": "Complete Milestone 5. Run black and ruff. Test every edge case you can think of. Write and implement one extension with tests. Then clone your repo into a fresh directory and follow your own README from scratch. Fix anything that does not work."
    }
  },

  {
    "id": 1100,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Submission Checklist",
    "type": "lesson",
    "content": {
      "body": "Before you consider your capstone complete, go through this checklist. Every item must be checked. If anything is missing, fix it before moving on.\n\n## Functionality\n\n- [ ] Add task works — title required, priority validated, ID auto-assigned\n- [ ] List tasks works — shows all tasks in readable format\n- [ ] Filter by pending and completed works\n- [ ] Mark complete works — sets completed flag and timestamp\n- [ ] Delete task works — confirms before deleting\n- [ ] Tasks persist — quit and restart, tasks are still there\n- [ ] App never crashes on invalid input — tested with garbage input\n\n## Code Quality\n\n- [ ] Code is split into at least 2 files\n- [ ] No business logic in main.py\n- [ ] No print() or input() in operations module\n- [ ] black . runs with no changes\n- [ ] ruff check . runs with no errors\n\n## Tests\n\n- [ ] pytest tests/ passes with zero failures\n- [ ] At least 10 tests total\n- [ ] At least one fixture\n- [ ] At least one parametrized test\n- [ ] At least one pytest.raises() test\n- [ ] Tests use tmp_path for file operations\n\n## Project Setup\n\n- [ ] Virtual environment created (.venv/)\n- [ ] requirements.txt is up to date\n- [ ] .gitignore covers .venv/, __pycache__/, .env\n- [ ] Project is pushed to GitHub\n\n## Documentation\n\n- [ ] README explains what the app does\n- [ ] README has installation instructions\n- [ ] README has run instructions\n- [ ] README has test instructions\n- [ ] README explains at least one design decision",
      "diagram": "flowchart TD\n    A[\"Submission Checklist\"] --> B[\"Functionality\n7 items\"]\n    A --> C[\"Code Quality\n5 items\"]\n    A --> D[\"Tests\n6 items\"]\n    A --> E[\"Project Setup\n4 items\"]\n    A --> F[\"Documentation\n5 items\"]\n    B --> G{\"All checked?\"}\n    C --> G\n    D --> G\n    E --> G\n    F --> G\n    G -->|\"Yes\"| H[\"Submit\"]\n    G -->|\"No\"| I[\"Fix and recheck\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Every item must be checked — no partial submissions",
      "code": "# Final verification commands — run all of these\n\n# 1. Tests pass\n# pytest tests/ -v\n# Expected: all green, 0 failures\n\n# 2. Code is formatted\n# black --check .\n# Expected: \"All done! No files would be reformatted.\"\n\n# 3. No lint errors\n# ruff check .\n# Expected: no output (no errors)\n\n# 4. Requirements are current\n# pip freeze > requirements.txt\n# git diff requirements.txt\n# Expected: no unexpected changes\n\n# 5. Git is clean\n# git status\n# Expected: nothing to commit (or only tasks.json if you chose to gitignore it)\n\n# 6. README is complete\n# Open README.md and read it as if you have never seen the project\n# Can you install and run it from scratch following only the README?\n\n# 7. Clone test (the ultimate check)\n# cd /tmp\n# git clone https://github.com/you/task-manager\n# cd task-manager\n# python -m venv .venv && source .venv/bin/activate\n# pip install -r requirements.txt\n# pytest tests/\n# python -m task_manager\n# If all of this works, you are done.",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The clone test is the most important check. If you can clone your own repo into a fresh directory, follow your README, and have a working app in under 5 minutes — your project is genuinely complete. If anything breaks, your README or setup is incomplete. Fix it."
      },
      "keyPoints": [
        "27 checklist items across 5 categories — every one must be checked",
        "pytest tests/ must pass with zero failures",
        "black and ruff must run clean",
        "Clone your own repo and follow the README — the ultimate test",
        "A project is not done until someone else can run it from scratch"
      ],
      "tryIt": "Go through the checklist item by item. For each unchecked item, fix it before continuing. Do not submit until every box is checked. Then do the clone test — clone your repo into /tmp and follow your README from scratch."
    }
  },

  {
    "id": 1101,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "What You Just Built",
    "type": "lesson",
    "content": {
      "body": "You built a complete Python application from scratch. Not a tutorial. Not a copy. Yours.\n\n## What This Proves\n\n**You can design.** You looked at a set of requirements and decided how to structure the code — what goes in which file, what each function does, how data flows through the system.\n\n**You can build.** You wrote code that works, handles errors, and does not crash on bad input.\n\n**You can test.** You wrote a test suite that gives you confidence to change the code without breaking it.\n\n**You can document.** You wrote a README that lets someone else run your project without asking you anything.\n\n**You can ship.** The project is on GitHub, installable, and runnable by anyone.\n\n## What This Is Worth\n\nThis project is worth more than any certificate. When you apply for a job or a freelance project, you can say: \"Here is something I built. Here is the code. Here is how to run it.\" That is what employers and clients want to see.\n\n## What Comes Next\n\nYou have the foundation. The next step is to build more — more projects, more complexity, more depth in your chosen specialisation. Every project you build from here will be faster and better than the last.\n\nThe task manager is your first complete project. It will not be your last. Go build the next one.",
      "diagram": "flowchart TD\n    A[\"You built this\"] --> B[\"Designed\ndata structure modules\"]\n    A --> C[\"Built\nworking tested app\"]\n    A --> D[\"Tested\n10+ passing tests\"]\n    A --> E[\"Documented\nREADME anyone can run\"]\n    A --> F[\"Shipped\nGitHub public repo\"]\n    B --> G[\"Proof you can\nbuild real software\"]\n    C --> G\n    D --> G\n    E --> G\n    F --> G\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Design + Build + Test + Document + Ship = a real project",
      "code": "# Your capstone project in numbers:\n# ~200 lines of source code\n# ~150 lines of tests\n# 5 modules (models, storage, operations, display, main)\n# 10+ passing tests\n# 1 README\n# 1 GitHub repository\n\n# What you demonstrated:\n# - Data structures: tasks as dicts in a list\n# - Functions: focused, testable, no side effects\n# - File handling: JSON persistence with error handling\n# - Error handling: ValueError, graceful recovery\n# - Modules: separation of concerns\n# - Testing: fixtures, parametrize, exception tests\n# - Project structure: venv, requirements.txt, .gitignore\n\n# Your next project ideas:\n# - A URL shortener (web dev — FastAPI + SQLite)\n# - A weather dashboard (APIs + data display)\n# - A file organiser (automation + pathlib)\n# - A personal finance tracker (data + CSV/JSON)\n# - A quiz game (OOP + file handling)\n# - A web scraper (requests + BeautifulSoup)\n\n# The pattern is the same for all of them:\n# 1. Define the data model\n# 2. Build the operations\n# 3. Build the interface\n# 4. Write the tests\n# 5. Polish and ship\n\n# You know how to do this now. Go build something.",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Share your project. Post it on LinkedIn, show it to a friend, submit it to a Python community. Getting feedback from real people accelerates your growth faster than any course. The worst that can happen is someone suggests an improvement — which is exactly what you want."
      },
      "keyPoints": [
        "You designed, built, tested, documented, and shipped a real application",
        "This project is worth more than any certificate — it is proof of ability",
        "The pattern you used here applies to every project you will ever build",
        "Share your project — feedback accelerates growth",
        "Go build the next one — every project makes the next one faster and better"
      ],
      "tryIt": "Push your final project to GitHub. Write a LinkedIn post or a message to a friend describing what you built and what you learned. Then open a new directory and start your next project — use the same 5-step pattern: data model, operations, interface, tests, ship."
    }
  },

  {
    "id": 1102,
    "moduleId": 19,
    "moduleTitle": "Next Steps",
    "title": "What You Have Achieved",
    "type": "lesson",
    "content": {
      "body": "You have completed the Python course. That is a significant achievement — most people who start a programming course do not finish it. You did.\n\n## What You Now Know\n\nYou started with no Python knowledge and you now have a comprehensive foundation:\n\n**Core language** — variables, data types, operators, control flow, loops, functions, and all the tools to write programs that make decisions and repeat actions.\n\n**Data structures** — lists, tuples, dicts, sets, and comprehensions. You can model and manipulate any kind of data.\n\n**Object-oriented programming** — classes, inheritance, encapsulation, dunder methods. You can model real-world concepts as Python objects.\n\n**Professional practices** — error handling, file handling, modules, virtual environments, testing, and APIs. You can build programs that are robust, organised, and maintainable.\n\n**A complete project** — you built a real application from scratch, made design decisions, and tested it.\n\n## What This Means\n\nYou are no longer a complete beginner. You have the foundation to:\n- Read and understand most Python code you encounter\n- Build small to medium applications independently\n- Learn any Python framework or library with the official docs\n- Contribute to open source projects\n- Apply for junior developer roles with a portfolio\n\n## The Honest Assessment\n\nYou are not yet an expert. Expertise comes from building many projects, reading other people's code, and years of practice. But you have the foundation — and the foundation is everything.",
      "diagram": "flowchart TD\n    A[\"Course Complete\"] --> B[\"Core Python\nvariables loops functions\"]\n    A --> C[\"Data Structures\nlists dicts sets\"]\n    A --> D[\"OOP\nclasses inheritance\"]\n    A --> E[\"Professional\ntesting APIs files\"]\n    A --> F[\"Complete Project\ncapstone\"]\n    B --> G[\"Foundation\nfor everything\"]\n    C --> G\n    D --> G\n    E --> G\n    F --> G\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "You have a complete Python foundation — the next step is building with it",
      "code": "# A summary of what you can now write from memory\n\n# Variables, types, operators\nname = \"Alice\"\nage = 30\nis_active = True\n\n# Control flow\nif age >= 18:\n    print(f\"Welcome, {name}\")\n\n# Functions with validation\ndef greet(name, greeting=\"Hello\"):\n    if not name:\n        raise ValueError(\"Name required\")\n    return f\"{greeting}, {name}!\"\n\n# Data structures\nusers = [{\"name\": \"Alice\", \"score\": 92}, {\"name\": \"Bob\", \"score\": 78}]\npassing = [u[\"name\"] for u in users if u[\"score\"] >= 50]\nscores = {u[\"name\"]: u[\"score\"] for u in users}\n\n# OOP\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self._balance = balance\n\n    @property\n    def balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Amount must be positive\")\n        self._balance += amount\n        return self\n\n# Error handling\ntry:\n    result = int(input(\"Enter a number: \"))\nexcept ValueError:\n    print(\"That is not a number\")\n\n# File handling\nimport json\nfrom pathlib import Path\ndata = json.loads(Path(\"data.json\").read_text())\n\n# Testing\nimport pytest\ndef test_greet():\n    assert greet(\"Alice\") == \"Hello, Alice!\"",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The best way to consolidate what you have learned is to build something. Pick a project that interests you — a tool you would actually use, a problem you want to solve. The act of building forces you to apply everything you know and reveals the gaps you need to fill. Start today."
      },
      "keyPoints": [
        "You have a complete Python foundation covering all major language features",
        "You can read and understand most Python code you encounter",
        "You can build small to medium applications independently",
        "You can learn any Python framework with the official documentation",
        "Expertise comes from building many projects — start your next one today"
      ],
      "tryIt": "Write a single Python file from memory that demonstrates: a class with __init__, a property, and a method; a function with error handling; a list comprehension; JSON file read/write; and a pytest test. No looking at examples. This is your baseline — everything you build from here adds to it."
    }
  },

  {
    "id": 1103,
    "moduleId": 19,
    "moduleTitle": "Next Steps",
    "title": "Python Career Paths",
    "type": "lesson",
    "content": {
      "body": "Python is used across many fields. The path you choose determines what you learn next. Each specialisation builds on the same Python foundation you have now — the difference is which libraries and frameworks you add.\n\n## Web Development\n\nBuild web applications and APIs. The main frameworks are **Django** (full-featured, batteries included, used by Instagram and Pinterest) and **FastAPI** (modern, fast, async, excellent for APIs). Learn: HTTP, databases, authentication, deployment.\n\n## Data Science and Machine Learning\n\nAnalyse data, build models, make predictions. The core stack: **pandas** (data manipulation), **NumPy** (numerical computing), **scikit-learn** (machine learning), **matplotlib/seaborn** (visualisation). Learn: statistics, linear algebra, SQL.\n\n## Automation and Scripting\n\nAutomate repetitive tasks — file processing, web scraping, system administration. Libraries: **requests** (HTTP), **BeautifulSoup/Playwright** (web scraping), **Paramiko** (SSH), **schedule** (task scheduling).\n\n## DevOps and Infrastructure\n\nManage infrastructure with code. Libraries: **boto3** (AWS), **Ansible** (configuration management), **Docker SDK**. Learn: Linux, cloud platforms, CI/CD.\n\n## Cybersecurity\n\nPenetration testing, security tooling, vulnerability analysis. Libraries: **Scapy** (network packets), **Cryptography**, **Paramiko**. Learn: networking, operating systems, security concepts.\n\n## Game Development\n\nBuild games with **Pygame** or **Arcade**. Good for learning OOP and game loops.",
      "diagram": "flowchart TD\n    A[\"Python Foundation\"] --> B[\"Web Dev\nDjango FastAPI\"]\n    A --> C[\"Data Science\npandas NumPy sklearn\"]\n    A --> D[\"Automation\nrequests scraping\"]\n    A --> E[\"DevOps\nboto3 Ansible\"]\n    A --> F[\"Security\nScapy Cryptography\"]\n    A --> G[\"Game Dev\nPygame Arcade\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Same Python foundation — different libraries and frameworks for each specialisation",
      "code": "# Web Development — FastAPI example\n# pip install fastapi uvicorn\nfrom fastapi import FastAPI\napp = FastAPI()\n\n@app.get(\"/users/{user_id}\")\ndef get_user(user_id: int):\n    return {\"id\": user_id, \"name\": \"Alice\"}\n\n# Run: uvicorn main:app --reload\n\n# Data Science — pandas example\n# pip install pandas\nimport pandas as pd\ndf = pd.read_csv(\"data.csv\")\nprint(df.describe())\nprint(df.groupby(\"category\")[\"value\"].mean())\n\n# Automation — web scraping example\n# pip install requests beautifulsoup4\nimport requests\nfrom bs4 import BeautifulSoup\nresponse = requests.get(\"https://example.com\")\nsoup = BeautifulSoup(response.text, \"html.parser\")\ntitles = [h2.text for h2 in soup.find_all(\"h2\")]\n\n# DevOps — AWS boto3 example\n# pip install boto3\nimport boto3\ns3 = boto3.client(\"s3\")\nbuckets = s3.list_buckets()[\"Buckets\"]\nfor bucket in buckets:\n    print(bucket[\"Name\"])\n\n# All of these use the same Python you already know\n# The new skill is the library — not the language",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Pick one specialisation and go deep before branching out. Trying to learn web dev, data science, and DevOps simultaneously leads to shallow knowledge in all three. Choose the one that aligns with your goals, build 3-5 projects in that area, then expand. Depth before breadth."
      },
      "keyPoints": [
        "Web dev: Django (full-stack) or FastAPI (APIs) — most job opportunities",
        "Data science: pandas, NumPy, scikit-learn — highest salaries",
        "Automation: requests, BeautifulSoup, Playwright — quickest to productivity",
        "DevOps: boto3, Ansible — growing demand with cloud adoption",
        "Pick one specialisation and go deep — breadth comes after depth"
      ],
      "tryIt": "Research the job market in your area or target market. Find 5 Python job postings and list the libraries and frameworks they require. This tells you exactly what to learn next. Pick the specialisation that appears most often and matches your interests."
    }
  },

  {
    "id": 1104,
    "moduleId": 19,
    "moduleTitle": "Next Steps",
    "title": "Choosing a Specialisation",
    "type": "lesson",
    "content": {
      "body": "Choosing what to learn next is one of the most important decisions you will make. The wrong choice wastes months. The right choice compounds — each thing you learn makes the next thing easier.\n\n## The Decision Framework\n\nAsk three questions:\n\n**1. What do you want to build?** The most important question. If you want to build web apps, learn Django or FastAPI. If you want to analyse data, learn pandas. If you want to automate your job, learn scripting. Your goal determines your path.\n\n**2. What does the market want?** Look at job postings in your area. What libraries appear most often? What frameworks do companies use? This tells you where the opportunities are.\n\n**3. What can you learn in 3 months?** Pick something achievable. A focused 3-month sprint on one framework produces more results than 3 months of scattered learning.\n\n## Recommended First Specialisations\n\n**If you want a job quickly** — web development with FastAPI or Django. Most job postings, clearest learning path, fastest to a portfolio project.\n\n**If you want the highest ceiling** — data science and machine learning. Longer path, but the skills are in high demand and the work is intellectually rich.\n\n**If you want to automate your current job** — scripting and automation. Immediate practical value, builds confidence fast.\n\n## The Learning Path\n\n1. Pick one specialisation\n2. Find the official documentation and one good book or course\n3. Build 3 projects of increasing complexity\n4. Contribute to an open source project\n5. Apply for jobs or freelance work",
      "diagram": "flowchart TD\n    A[\"What do you\nwant to build?\"] --> B[\"Web apps\n→ Django FastAPI\"]\n    A --> C[\"Analyse data\n→ pandas sklearn\"]\n    A --> D[\"Automate tasks\n→ scripting requests\"]\n    B --> E[\"3 months:\nTodo API\nBlog\nE-commerce\"]\n    C --> F[\"3 months:\nEDA project\nML model\nDashboard\"]\n    D --> G[\"3 months:\nFile processor\nScraper\nScheduled job\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Pick one path, build 3 projects in 3 months — depth before breadth",
      "code": "# Recommended learning resources by path\n\n# Web Development\n# Official docs: docs.djangoproject.com, fastapi.tiangolo.com\n# Projects to build:\n# 1. REST API for a todo app (FastAPI + SQLite)\n# 2. Blog with user authentication (Django)\n# 3. E-commerce backend (Django REST Framework)\n\n# Data Science\n# Official docs: pandas.pydata.org, scikit-learn.org\n# Projects to build:\n# 1. Exploratory data analysis on a public dataset\n# 2. Predict house prices (regression)\n# 3. Customer churn prediction (classification)\n\n# Automation\n# Official docs: docs.python-requests.org, playwright.dev/python\n# Projects to build:\n# 1. Automate a repetitive task at your current job\n# 2. Scrape and analyse data from a website\n# 3. Build a scheduled report emailer\n\n# All paths: learn these regardless of specialisation\n# - Git and GitHub (version control)\n# - SQL (databases)\n# - Linux command line basics\n# - Docker basics\n# - One cloud platform (AWS, GCP, or Azure)\n\n# Timeline\n# Month 1: Learn the framework basics, build project 1\n# Month 2: Go deeper, build project 2\n# Month 3: Build project 3, polish portfolio, start applying",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "Whatever path you choose, learn SQL. Every specialisation eventually touches a database. SQL is the most universally useful skill in software development after Python itself. SQLite is built into Python — start with it, then learn PostgreSQL. A developer who knows Python and SQL can build almost anything."
      },
      "keyPoints": [
        "Choose based on what you want to build, what the market wants, and what is achievable",
        "Web dev is the fastest path to employment — most job postings",
        "Data science has the highest ceiling — longer path, higher reward",
        "Automation gives immediate practical value — automate your current job",
        "Learn SQL regardless of specialisation — every path touches databases"
      ],
      "tryIt": "Write a 3-month learning plan for your chosen specialisation. Include: the framework or library you will learn, 3 projects you will build (with increasing complexity), the resources you will use, and a weekly time commitment. Be specific — 'learn Django' is not a plan, 'build a REST API for a todo app by week 4' is."
    }
  },

  {
    "id": 1105,
    "moduleId": 19,
    "moduleTitle": "Next Steps",
    "title": "Building a Portfolio",
    "type": "lesson",
    "content": {
      "body": "A portfolio is proof that you can build things. Employers and clients do not care about certificates — they care about what you have built. A GitHub profile with 3-5 well-documented projects is worth more than any qualification.\n\n## What Makes a Good Portfolio Project\n\n**Solves a real problem** — not a tutorial clone. Something you actually wanted to exist. Even a small tool you use yourself is more impressive than a polished copy of a tutorial.\n\n**Has a README** — explains what it does, why you built it, how to install and run it, and what you learned. A project without a README is invisible.\n\n**Has tests** — shows you write professional code, not just code that works on your machine.\n\n**Is deployed or runnable** — a live URL or clear instructions to run locally. Employers want to see it working.\n\n**Shows progression** — your first project can be simple. Your third should be more complex. The progression shows you are learning.\n\n## Project Ideas by Level\n\n**Beginner** — CLI tools: password generator, unit converter, quiz game, file organiser.\n\n**Intermediate** — web apps: personal blog, URL shortener, weather dashboard, expense tracker.\n\n**Advanced** — APIs, data pipelines, ML models, automation tools that solve real problems.\n\n## GitHub Profile\n\nYour GitHub profile is your portfolio. Pin your best 6 repositories. Write a profile README. Commit regularly — the contribution graph shows activity. Use descriptive commit messages.",
      "diagram": "flowchart TD\n    A[\"Portfolio Project\"] --> B[\"Solves real problem\nnot a tutorial clone\"]\n    A --> C[\"README\nwhat why how\"]\n    A --> D[\"Tests\nprofessional code\"]\n    A --> E[\"Deployed or runnable\nemployers can see it\"]\n    A --> F[\"Clean code\nwell structured\"]\n    G[\"GitHub Profile\"] --> H[\"Pin 6 best repos\"]\n    G --> I[\"Profile README\"]\n    G --> J[\"Regular commits\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "A portfolio is proof you can build — README, tests, and deployment make it professional",
      "code": "# README template for a portfolio project\n\n# Project Name\n# Brief one-line description\n\n# ## What It Does\n# 2-3 sentences explaining the problem it solves\n# and who it is for.\n\n# ## Demo\n# Screenshot or GIF of the app running\n# Or: Live URL if deployed\n\n# ## Features\n# - Feature 1\n# - Feature 2\n# - Feature 3\n\n# ## Installation\n# git clone https://github.com/you/project\n# cd project\n# python -m venv .venv\n# source .venv/bin/activate\n# pip install -r requirements.txt\n# cp .env.example .env\n# # Edit .env with your values\n\n# ## Usage\n# python main.py\n# # or\n# pytest tests/\n\n# ## What I Learned\n# - Specific technical skill\n# - Design decision and why\n# - Challenge and how I solved it\n\n# ## Tech Stack\n# - Python 3.11\n# - FastAPI\n# - SQLite / PostgreSQL\n# - pytest\n\n# Good commit message examples:\n# \"Add task completion with timestamp\"\n# \"Fix: handle missing tasks.json on startup\"\n# \"Refactor: extract validation to models.py\"\n# \"Test: add parametrized tests for priority filter\"",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "The 'What I Learned' section in your README is underrated. It shows self-awareness, the ability to reflect on your work, and that you are growing. Employers read it. Write honestly — 'I learned that separating business logic from I/O makes testing much easier' is more impressive than a list of technologies."
      },
      "keyPoints": [
        "3-5 well-documented projects beat any certificate",
        "Solve a real problem — not a tutorial clone",
        "Every project needs a README: what, why, how to run, what you learned",
        "Tests show you write professional code",
        "Pin your best 6 repos on GitHub and commit regularly"
      ],
      "tryIt": "Write a README for your capstone project following the template above. Include a 'What I Learned' section with at least 3 specific technical insights. Push it to GitHub. Then identify your next portfolio project — something you would actually use — and write the README before writing any code."
    }
  },

  {
    "id": 1106,
    "moduleId": 19,
    "moduleTitle": "Next Steps",
    "title": "Professional Tools to Learn Next",
    "type": "lesson",
    "content": {
      "body": "Beyond Python itself, professional developers use a set of tools that are language-agnostic but essential. Learning these makes you dramatically more effective and employable.\n\n## Git and GitHub\n\nVersion control is non-negotiable. Every professional project uses Git. Learn: `git init`, `add`, `commit`, `push`, `pull`, `branch`, `merge`, `rebase`. Understand pull requests and code review workflows. GitHub is where the Python community lives.\n\n## SQL and Databases\n\nAlmost every application stores data. Learn SQL: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`, `GROUP BY`. Start with SQLite (built into Python), then PostgreSQL. Learn one ORM: SQLAlchemy or Django ORM.\n\n## Linux Command Line\n\nMost Python runs on Linux servers. Learn: navigation, file operations, permissions, processes, environment variables, SSH, and basic shell scripting. The command line is the developer's primary interface.\n\n## Docker\n\nContainers solve \"it works on my machine\". Learn to write a `Dockerfile`, build images, run containers, and use `docker-compose` for multi-service apps. Docker is now expected in most professional environments.\n\n## One Cloud Platform\n\nAWS, Google Cloud, or Azure. Start with AWS — it has the most market share and the best free tier. Learn: EC2 (virtual machines), S3 (file storage), RDS (databases), Lambda (serverless functions).\n\n## Code Quality Tools\n\n**black** — automatic code formatter. **ruff** — fast linter. **mypy** — static type checker. Run these in CI/CD to enforce quality automatically.",
      "diagram": "flowchart TD\n    A[\"Professional Tools\"] --> B[\"Git & GitHub\nversion control\"]\n    A --> C[\"SQL\ndatabases\"]\n    A --> D[\"Linux CLI\nservers\"]\n    A --> E[\"Docker\ncontainers\"]\n    A --> F[\"Cloud\nAWS GCP Azure\"]\n    A --> G[\"Code quality\nblack ruff mypy\"]\n    B --> H[\"Priority 1\nlearn immediately\"]\n    C --> H\n    D --> I[\"Priority 2\nlearn within 3 months\"]\n    E --> I\n    F --> J[\"Priority 3\nlearn within 6 months\"]\n    G --> H\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style I fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Git, SQL, and code quality tools are immediate priorities — Docker and cloud come next",
      "code": "# Git — essential commands\n# git init                    # initialise repo\n# git add .                   # stage all changes\n# git commit -m \"message\"     # commit with message\n# git push origin main        # push to GitHub\n# git pull                    # get latest changes\n# git branch feature-name     # create branch\n# git checkout feature-name   # switch branch\n# git merge feature-name      # merge branch\n# git log --oneline           # see history\n\n# SQL — essential queries\n# SELECT name, score FROM students WHERE score >= 50;\n# INSERT INTO tasks (title, priority) VALUES ('Buy milk', 'high');\n# UPDATE tasks SET completed = 1 WHERE id = 3;\n# DELETE FROM tasks WHERE completed = 1;\n# SELECT category, COUNT(*) FROM tasks GROUP BY category;\n\n# Python + SQLite\nimport sqlite3\nconn = sqlite3.connect(\"tasks.db\")\ncursor = conn.cursor()\ncursor.execute(\"CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT)\")\ncursor.execute(\"INSERT INTO tasks (title) VALUES (?)\", (\"Buy groceries\",))\nconn.commit()\ntasks = cursor.execute(\"SELECT * FROM tasks\").fetchall()\nconn.close()\n\n# Code quality tools\n# pip install black ruff mypy\n# black .          # format all Python files\n# ruff check .     # lint all Python files\n# mypy src/        # type check",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Learn Git before anything else. Every other tool on this list assumes you know Git. Start with the basics: init, add, commit, push, pull. Then learn branching. Then learn pull requests on GitHub. Git is the single most important tool in a developer's toolkit after their programming language."
      },
      "keyPoints": [
        "Git is non-negotiable — learn it before any other tool",
        "SQL is universally useful — every application eventually touches a database",
        "Linux CLI is essential — most Python runs on Linux servers",
        "Docker solves environment problems — expected in most professional environments",
        "black, ruff, mypy enforce code quality automatically — add them to every project"
      ],
      "tryIt": "Set up Git for your capstone project: initialise a repo, make your first commit, push to GitHub. Add a .gitignore. Install black and ruff and run them on your code. Fix any issues they find. Set up a GitHub Actions workflow that runs pytest and ruff on every push."
    }
  },

  {
    "id": 1107,
    "moduleId": 19,
    "moduleTitle": "Next Steps",
    "title": "Learning Habits That Matter",
    "type": "lesson",
    "content": {
      "body": "The difference between developers who grow quickly and those who plateau is not talent — it is habits. The right learning habits compound over time. The wrong ones waste time and build false confidence.\n\n## Build, Don't Just Read\n\nReading tutorials and watching videos feels like learning but produces shallow knowledge. The only way to actually learn programming is to write code. For every hour you spend reading, spend two hours building. If you cannot build something from memory, you have not learned it.\n\n## Read Other People's Code\n\nThe fastest way to improve is to read code written by experienced developers. Browse GitHub repositories in your area of interest. Read the source code of libraries you use. Notice patterns, naming conventions, and design decisions. Ask yourself: why did they do it this way?\n\n## Embrace Errors\n\nErrors are not failures — they are information. Every error message tells you exactly what went wrong. Developers who get comfortable with errors debug faster and learn more. When you hit an error, read it carefully before searching for a solution.\n\n## Deliberate Practice\n\nNot all practice is equal. Deliberate practice means working at the edge of your ability — problems that are slightly too hard, not problems you can solve easily. If everything you build is comfortable, you are not growing.\n\n## Consistency Over Intensity\n\n30 minutes every day beats 8 hours on Saturday. Consistent practice builds neural pathways. Long gaps break them. Find a sustainable daily habit — even 20 minutes of coding is better than nothing.\n\n## Teach What You Learn\n\nWriting about what you learn — a blog, a README, explaining to a friend — forces you to understand it deeply. If you cannot explain it simply, you do not understand it yet.",
      "diagram": "flowchart TD\n    A[\"Learning Habits\"] --> B[\"Build don't just read\n2 hours coding per 1 hour reading\"]\n    A --> C[\"Read others' code\nGitHub open source\"]\n    A --> D[\"Embrace errors\nread before searching\"]\n    A --> E[\"Deliberate practice\nslightly too hard\"]\n    A --> F[\"Consistency\n30 min daily beats 8hr Saturday\"]\n    A --> G[\"Teach what you learn\nblog README explain\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Consistent building beats occasional reading — habits compound over months and years",
      "code": "# A sustainable daily learning habit\n\n# Morning (20-30 minutes):\n# - Review yesterday's code\n# - Fix one thing that bothered you\n# - Read one page of documentation\n\n# Evening (30-60 minutes):\n# - Build something — even a small function\n# - Write one test\n# - Commit to GitHub\n\n# Weekly (2-3 hours):\n# - Work on a portfolio project\n# - Read source code of a library you use\n# - Write a short note about what you learned\n\n# Monthly:\n# - Review your GitHub activity\n# - Update your portfolio README\n# - Identify one gap in your knowledge\n# - Plan next month's learning\n\n# Signs you are growing:\n# - You read error messages before searching\n# - You reach for tests automatically\n# - You think about edge cases before writing code\n# - You refactor old code and see how to improve it\n# - You can explain your code to someone else\n\n# Signs you are plateauing:\n# - Everything you build feels comfortable\n# - You copy-paste without understanding\n# - You avoid reading documentation\n# - You have not pushed to GitHub in a week",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The most important habit is showing up every day. Not for 8 hours — for 20 minutes. Open your editor, write something, commit it. The compound effect of daily practice over a year is extraordinary. A developer who codes for 20 minutes every day for a year has 120 hours of practice. One who codes for 8 hours once a week has 416 hours — but the daily developer will be better."
      },
      "keyPoints": [
        "Build more than you read — 2 hours coding for every 1 hour reading",
        "Read other people's code — GitHub is a library of professional patterns",
        "Embrace errors — read them carefully before searching",
        "Deliberate practice means working at the edge of your ability",
        "30 minutes daily beats 8 hours on Saturday — consistency compounds"
      ],
      "tryIt": "Design your learning habit for the next 30 days. Be specific: what time, how long, what you will build. Write it down. Set a daily reminder. At the end of 30 days, review your GitHub contribution graph — it should show 30 consecutive days of commits. That is your proof of consistency."
    }
  },

  {
    "id": 1108,
    "moduleId": 19,
    "moduleTitle": "Next Steps",
    "title": "Git and Version Control",
    "type": "lesson",
    "content": {
      "body": "Git is the version control system used by virtually every software project in the world. It tracks every change you make, lets you experiment safely, collaborate with others, and recover from mistakes. Learning Git is not optional — it is the first professional tool every developer must master.\n\n## Core Concepts\n\n**Repository** — a project tracked by Git. Contains all files and their complete history.\n\n**Commit** — a snapshot of your project at a point in time. Each commit has a message describing what changed.\n\n**Branch** — an independent line of development. Work on a feature in a branch without affecting the main code.\n\n**Remote** — a copy of the repository on a server (GitHub, GitLab). Push to share your work; pull to get others' changes.\n\n## The Daily Workflow\n\n```bash\ngit status              # see what changed\ngit add .               # stage all changes\ngit commit -m \"message\" # save a snapshot\ngit push                # share with remote\ngit pull                # get latest changes\n```\n\n## Branching Workflow\n\n```bash\ngit checkout -b feature-name   # create and switch to branch\n# ... make changes ...\ngit add . && git commit -m \"Add feature\"\ngit checkout main\ngit merge feature-name\ngit push\n```\n\n## Good Commit Messages\n\nA good commit message completes the sentence \"This commit will...\":\n- \"Add task completion with timestamp\" ✅\n- \"Fix crash when tasks.json is missing\" ✅\n- \"Update stuff\" ❌\n- \"WIP\" ❌",
      "diagram": "flowchart LR\n    A[\"Working directory\nfiles you edit\"] -->|\"git add\"| B[\"Staging area\nchanges to commit\"]\n    B -->|\"git commit\"| C[\"Local repo\ncommit history\"]\n    C -->|\"git push\"| D[\"Remote repo\nGitHub\"]\n    D -->|\"git pull\"| A\n    E[\"git branch feature\"] --> F[\"Independent\nline of work\"]\n    F -->|\"git merge\"| C\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "add → commit → push is the daily cycle; branches let you work without affecting main",
      "code": "# Essential Git commands\n\n# Setup (once)\n# git config --global user.name \"Your Name\"\n# git config --global user.email \"you@example.com\"\n\n# Start a project\n# git init                          # new repo\n# git clone https://github.com/...  # copy existing repo\n\n# Daily workflow\n# git status                        # what changed?\n# git diff                          # see exact changes\n# git add filename.py               # stage one file\n# git add .                         # stage everything\n# git commit -m \"Add user login\"    # save snapshot\n# git push origin main              # share to GitHub\n# git pull                          # get latest\n\n# Branching\n# git checkout -b feature/add-search   # create + switch\n# git branch                           # list branches\n# git checkout main                    # switch to main\n# git merge feature/add-search         # merge branch\n# git branch -d feature/add-search     # delete branch\n\n# Undo mistakes\n# git restore filename.py    # discard unstaged changes\n# git reset HEAD~1           # undo last commit (keep changes)\n# git log --oneline          # see history\n\n# .gitignore — files Git should ignore\n# .venv/\n# __pycache__/\n# *.pyc\n# .env\n# *.egg-info/\n# dist/\n# .pytest_cache/",
      "language": "python",
      "callout": {
        "type": "tip",
        "text": "Commit early and often. A commit is not a finished feature — it is a checkpoint. Commit every time you have something working, even if it is small. Small commits are easier to understand, easier to revert, and easier to review. The rule: if you would be upset to lose the last hour of work, commit now."
      },
      "keyPoints": [
        "Git tracks every change — you can always go back to any previous state",
        "Daily workflow: status → add → commit → push",
        "Branches let you work on features without affecting the main codebase",
        "Good commit messages describe what changed and why — not just 'update'",
        "Commit early and often — small commits are easier to understand and revert"
      ],
      "tryIt": "Initialise a Git repository for your capstone project. Make your first commit with all the project files. Create a branch called 'feature/search', add a search function to operations.py, commit it, merge it back to main, and push to GitHub. Write a commit message for each step that follows the 'This commit will...' pattern."
    }
  },

  {
    "id": 1109,
    "moduleId": 19,
    "moduleTitle": "Next Steps",
    "title": "Final Advice and Roadmap",
    "type": "lesson",
    "content": {
      "body": "You have everything you need to move forward. This final lesson is a concrete roadmap for the next 6 months — specific actions, not vague advice.\n\n## The Next 30 Days\n\n1. Complete the capstone project if not finished\n2. Push it to GitHub with a proper README\n3. Set up Git for all your projects\n4. Install black, ruff, and mypy — run them on your code\n5. Write a 3-month learning plan for your chosen specialisation\n6. Start the first project in your plan\n\n## The Next 3 Months\n\n1. Build 3 projects in your chosen specialisation\n2. Learn SQL — complete a free SQL course and use it in a project\n3. Learn Git branching and pull requests\n4. Read the source code of one library you use\n5. Write about what you learned — a blog post, a README, a tweet thread\n\n## The Next 6 Months\n\n1. Have 3-5 portfolio projects on GitHub\n2. Contribute to one open source project (even documentation)\n3. Learn Docker basics\n4. Learn one cloud platform (AWS free tier)\n5. Apply for jobs, freelance work, or an internship\n\n## The Most Important Thing\n\nBuild things. Not tutorials — your own ideas. The gap between \"I understand Python\" and \"I can build with Python\" is closed only by building. Every project teaches you something no lesson can.\n\n## You Are Ready\n\nYou have the foundation. You have the tools. You have the habits. The only thing left is to start. Open your editor, create a new project, and build something.",
      "diagram": "flowchart TD\n    A[\"Now\"] --> B[\"30 days\nCapstone + GitHub\nLearning plan\"]\n    B --> C[\"3 months\n3 projects\nSQL Git Docker\"]\n    C --> D[\"6 months\nPortfolio\nOpen source\nCloud\"]\n    D --> E[\"Job / Freelance\nContributions\nCommunity\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "30 days → 3 months → 6 months — concrete milestones, not vague goals",
      "code": "# Your 6-month roadmap — fill this in\n\n# MONTH 1-2: Foundation\n# Specialisation chosen: _______________\n# Project 1: _______________\n# Resources: _______________\n# SQL course: _______________\n\n# MONTH 3-4: Building\n# Project 2: _______________\n# Project 3: _______________\n# New tool learned: _______________\n\n# MONTH 5-6: Portfolio\n# Project 4 (most complex): _______________\n# Open source contribution: _______________\n# Cloud platform: _______________\n\n# Weekly habit (fill in your schedule):\n# Monday-Friday: ___ minutes at ___ time\n# Weekend: ___ hours on ___\n\n# Resources by specialisation:\n\n# Web Development\n# - FastAPI docs: fastapi.tiangolo.com\n# - Django docs: docs.djangoproject.com\n# - Full Stack Python: fullstackpython.com\n\n# Data Science\n# - Pandas docs: pandas.pydata.org\n# - Kaggle: kaggle.com (free datasets + courses)\n# - fast.ai: fast.ai (practical ML)\n\n# Automation\n# - Automate the Boring Stuff: automatetheboringstuff.com\n# - Playwright: playwright.dev/python\n# - Real Python: realpython.com\n\n# All paths\n# - Git: learngitbranching.js.org\n# - SQL: sqlzoo.net or mode.com/sql-tutorial\n# - Linux: linuxcommand.org\n# - Docker: docs.docker.com/get-started",
      "language": "python",
      "callout": {
        "type": "note",
        "text": "The developers who succeed are not the most talented — they are the most consistent. They show up every day, build things, make mistakes, learn from them, and keep going. You have completed a full Python course. That puts you ahead of most people who start. Now keep going."
      },
      "keyPoints": [
        "30 days: finish capstone, push to GitHub, write learning plan",
        "3 months: 3 projects, SQL, Git branching, read open source code",
        "6 months: portfolio, open source contribution, Docker, cloud",
        "Build your own ideas — not tutorials — that is what closes the gap",
        "Consistency beats intensity — 30 minutes daily compounds over months"
      ],
      "tryIt": "Fill in the roadmap template above with your specific plans. Be concrete: name the projects, name the resources, set the times. Share it somewhere — a GitHub gist, a blog post, a message to a friend. Accountability accelerates progress. Then close this lesson and open your editor."
    }
  },

];
