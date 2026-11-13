export const javascriptSlidesData = [

  // =========================
  // Module 1: Introduction to JavaScript
  // =========================

  {
    "id": 1,
    "moduleId": 1,
    "moduleTitle": "Introduction to JavaScript",
    "title": "Welcome to JavaScript",
    "type": "lesson",
    "content": {
      "body": "JavaScript is the language that makes the web interactive. Every button that responds when you click it, every form that validates your input before submitting, every page that updates without a full reload — that is JavaScript doing its job. It is the only programming language that runs natively inside every web browser in the world.\n\nBut JavaScript is no longer limited to browsers. With Node.js, it runs on servers and powers APIs used by millions of users. With React Native, it builds mobile apps for iOS and Android. With Electron, it builds desktop applications like VS Code itself. One language, many environments.\n\n## Why Start With JavaScript?\n\nJavaScript is one of the most practical first languages you can learn. You do not need to install anything to run it — your browser already has a JavaScript engine built in. You can open the browser console right now and start coding. Feedback is immediate, visual, and satisfying.\n\nMore importantly, JavaScript skills transfer directly to real work. The web is everywhere, and nearly every company on the planet has web software. Learning JavaScript is one of the fastest paths from beginner to employed developer.",
      "code": "// This is JavaScript — run it in your browser console\nconsole.log(\"Hello, JavaScript!\");\nconsole.log(\"The web starts here.\");\n\n// JavaScript can do arithmetic\nconsole.log(10 + 5);  // 15\nconsole.log(2 ** 10); // 1024\n\n// It can work with text\nconst language = \"JavaScript\";\nconsole.log(`Welcome to ${language}!`);",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Open your browser right now, press F12, click Console, and type: console.log('Hello!'). You just ran JavaScript. No installation needed."
      },
      "keyPoints": [
        "JavaScript is the language that makes web pages interactive and responsive",
        "It runs natively in every modern browser — no setup required to get started",
        "Node.js allows JavaScript to run on servers, making it a full-stack language",
        "console.log() is your primary tool for displaying output and debugging",
        "One language powers web, mobile, desktop, and server applications"
      ],
      "tryIt": "Open your browser console (F12 → Console). Write three console.log() statements: one that prints your name, one that prints the result of 7 * 8, and one that prints a sentence about what you want to build with JavaScript."
    }
  },

  {
    "id": 2,
    "moduleId": 1,
    "moduleTitle": "Introduction to JavaScript",
    "title": "What Is JavaScript?",
    "type": "lesson",
    "content": {
      "body": "JavaScript is a high-level, interpreted programming language. High-level means it abstracts away the complex details of the computer — you write instructions in something close to human language, and the JavaScript engine handles memory management, execution, and hardware communication for you.\n\nInterpreted means your code does not need to be compiled into machine code before it runs. The JavaScript engine reads your source code directly and executes it. This makes development faster — you write code, refresh the page, and immediately see the result.\n\n## JavaScript Is Not Java\n\nDespite the similar name, JavaScript and Java are completely different languages with different syntax, different purposes, and different ecosystems. The name similarity is a historical accident — JavaScript was named to ride the marketing wave of Java's popularity in 1995. Do not let the name confuse you.\n\n## What JavaScript Can Do\n\nIn the browser: respond to clicks, validate forms, animate elements, fetch data without reloading pages, and build complete single-page applications.\n\nOn the server (Node.js): handle HTTP requests, read and write files, connect to databases, and build REST APIs.\n\nIn tools: run build pipelines, lint code, run tests, and automate development workflows.",
      "diagram": "flowchart TD\n    A[JavaScript Code] --> B[JavaScript Engine]\n    B --> C{Where does it run?}\n    C --> D[Browser\\nInteractive UIs]\n    C --> E[Node.js\\nAPIs & Backend]\n    C --> F[React Native\\nMobile Apps]\n    C --> G[Electron\\nDesktop Apps]\n    style A fill:#f7df1e,color:#1a1a1a,stroke:#f7df1e\n    style B fill:#323330,color:#fff,stroke:#323330",
      "diagramCaption": "JavaScript runs in browsers, servers, mobile, and desktop — one language for all platforms",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "JavaScript and Java are completely unrelated languages. They were both popular at the same time, and the name was a marketing decision. The similarities end at the name."
      },
      "keyPoints": [
        "JavaScript is high-level and interpreted — no compilation step required",
        "It is not related to Java despite the name similarity",
        "In browsers it handles UI interaction, animation, and API communication",
        "Node.js extends JavaScript to server-side development and tooling",
        "The same core language skills apply across web, mobile, desktop, and backend"
      ],
      "tryIt": "In your browser console, type: typeof 42 and press Enter. Then try typeof 'hello' and typeof true. What does JavaScript tell you about the types of these values?"
    }
  },

  {
    "id": 3,
    "moduleId": 1,
    "moduleTitle": "Introduction to JavaScript",
    "title": "Where JavaScript Runs",
    "type": "lesson",
    "content": {
      "body": "Understanding where JavaScript runs is essential to understanding how it behaves. JavaScript does not run in isolation — it always runs inside an environment that provides it with tools, context, and rules.\n\n## The Browser Environment\n\nWhen you write JavaScript for the browser, the environment provides access to the DOM (Document Object Model) — a live representation of the HTML on the page. You can use document.getElementById(), addEventListener(), and hundreds of other browser-specific APIs to interact with the page. The browser also provides window, navigator, fetch, localStorage, and many more.\n\n## The Node.js Environment\n\nNode.js gives JavaScript the ability to run outside the browser — on your computer or on a server. The Node.js environment does not have a DOM (there is no HTML page), but it provides different tools: access to the file system, the ability to create HTTP servers, environment variables, and npm — the world's largest package registry.\n\n## Why This Matters for Beginners\n\nWhen you see code that uses document or window, it is browser JavaScript. When you see code that uses require() or fs.readFile(), it is Node.js JavaScript. The core language is the same — variables, functions, loops, objects — but the environment determines which additional tools are available.",
      "code": "// Browser-specific (only works in a browser)\ndocument.getElementById('title').textContent = 'Hello!';\nwindow.alert('This is a browser alert');\n\n// Node.js-specific (only works in Node.js)\n// const fs = require('fs');\n// fs.readFileSync('data.txt', 'utf8');\n\n// Works everywhere — core JavaScript\nconst numbers = [1, 2, 3];\nconsole.log(numbers.map(n => n * 2));",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "console.log() works in both browser and Node.js. It is the one tool that works everywhere and is always your starting point for debugging."
      },
      "keyPoints": [
        "JavaScript always runs inside an environment that provides additional APIs",
        "The browser environment provides DOM APIs: document, window, fetch, addEventListener",
        "Node.js provides server-side APIs: file system access, HTTP server creation, process",
        "Core JavaScript — variables, functions, arrays, objects — is identical in both environments",
        "The environment determines which extra tools are available, not the language itself"
      ],
      "tryIt": "In your browser console, type document.title and press Enter. You just read the page title using the browser environment. Then try Math.PI — that works everywhere because it is core JavaScript, not environment-specific."
    }
  },

  {
    "id": 4,
    "moduleId": 1,
    "moduleTitle": "Introduction to JavaScript",
    "title": "How Computers Read Code",
    "type": "lesson",
    "content": {
      "body": "When you run a JavaScript file or paste code into the console, the JavaScript engine takes over. It reads your code from the very first line and executes instructions in order. This is called sequential execution and it is the default behaviour of every program.\n\n## The Execution Model\n\nJavaScript does not read the whole file and then run it all at once. It reads and executes one statement at a time, from top to bottom. This means if line 4 has an error, lines 1 through 3 will have already run by the time JavaScript stops.\n\n## When Errors Occur\n\nWhen JavaScript encounters something it cannot execute — a typo, an undefined variable, a type mismatch — it throws an error and stops executing. The error message tells you two things: what went wrong (the error type) and where it happened (the line number). Learning to read error messages is one of the most important skills in programming.\n\n## JavaScript Is Single-Threaded\n\nJavaScript runs on a single thread, meaning it can only do one thing at a time. This sounds like a limitation, but it is actually a design choice that makes JavaScript easier to reason about. The event loop handles asynchronous operations (like waiting for network data) without blocking the main thread — we will cover this in detail when we reach asynchronous JavaScript.",
      "diagram": "flowchart TD\n    A([\"Run JavaScript\"]) --> B[\"Read line 1\"]\n    B --> C{\"Valid syntax?\"}\n    C -->|Yes| D[\"Execute statement\"]\n    C -->|No| E[\"SyntaxError\\nStop & report line\"]\n    D --> F{\"More lines?\"}\n    F -->|Yes| G[\"Read next line\"]\n    G --> C\n    F -->|No| H([\"Program complete\"])\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "JavaScript executes top to bottom, one statement at a time, stopping immediately on errors",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "JavaScript stops at the FIRST error it finds. If you have errors on lines 3 and 7, you will only see the line 3 error until you fix it. Fix errors one at a time, always starting from the top."
      },
      "keyPoints": [
        "JavaScript executes code sequentially — top to bottom, one statement at a time",
        "Execution stops immediately when any error is encountered",
        "Error messages include the error type and the line number — always read them",
        "Lines before the error have already executed when JavaScript stops",
        "JavaScript is single-threaded, running one operation at a time on the main thread"
      ],
      "tryIt": "Write three console.log() statements. After the second one, add a line with a deliberate error (like consol.log('oops')). Run it and notice which lines executed and which did not. Then read the error message carefully."
    }
  },

  {
    "id": 5,
    "moduleId": 1,
    "moduleTitle": "Introduction to JavaScript",
    "title": "Your First JavaScript Output",
    "type": "lesson",
    "content": {
      "body": "console.log() is the most important tool you have as a beginner. It sends any value to the browser console or the Node.js terminal, making it visible to you. Think of it as JavaScript's way of talking back to you — telling you what values your code is working with at any given moment.\n\n## What console.log() Does\n\nconsole is a built-in object in both browser and Node.js environments. log() is one of its methods — an action it knows how to perform. When you call console.log(value), JavaScript evaluates whatever is inside the parentheses and prints the result.\n\nconsole.log() can accept multiple arguments separated by commas. It will print them all on the same line with spaces between them. This is useful when you want to see a label alongside a value: console.log('The score is:', score).\n\n## When to Use It\n\nAs a learner, use console.log() constantly. Print variable values to verify they hold what you expect. Print the result of expressions before assigning them. Print messages at key points in your program to trace execution. Professional developers also use it heavily during development — it is not a beginner tool, it is a universal debugging tool.",
      "code": "// Basic output\nconsole.log(\"Hello, JavaScript!\");\n\n// Numbers and calculations\nconsole.log(10 + 5);     // 15\nconsole.log(100 / 4);    // 25\n\n// Multiple values in one call\nconsole.log(\"Result:\", 7 * 8); // Result: 56\n\n// Strings with single or double quotes\nconsole.log('Single quotes work too');\n\n// Template literal (modern string)\nconst name = \"Alice\";\nconsole.log(`Hello, ${name}!`); // Hello, Alice!",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Open DevTools (F12) and click Console. You can type and run JavaScript directly there. This is your fastest way to experiment — no file needed."
      },
      "keyPoints": [
        "console.log() is the primary tool for displaying output and debugging in JavaScript",
        "It accepts any value: strings, numbers, booleans, arrays, objects",
        "Multiple arguments separated by commas are printed on the same line with spaces",
        "Use it constantly to verify that your code is doing what you think it is",
        "It works identically in both the browser console and Node.js terminal"
      ],
      "tryIt": "Use console.log() to print: your name, your age, the result of 365 * 24, and a sentence combining your name and city using the + operator to join strings. Verify each output looks exactly as expected."
    }
  },

  {
    "id": 6,
    "moduleId": 1,
    "moduleTitle": "Introduction to JavaScript",
    "title": "Understanding Errors",
    "type": "lesson",
    "content": {
      "body": "Every programmer sees errors every single day. Errors are not failures — they are the computer's way of telling you precisely what is wrong. Learning to read error messages calmly and systematically is one of the most important skills you will develop as a JavaScript developer.\n\n## The Three Most Common Error Types\n\n**SyntaxError** — JavaScript could not parse the line at all. Usually a missing quote, closing parenthesis, or bracket. The code never even ran. Example: console.log('Hello) — the quote is not closed.\n\n**ReferenceError** — You used a name that JavaScript does not recognise. Usually a typo in a variable name or using a variable before declaring it. Example: console.log(messsage) when the variable is called message.\n\n**TypeError** — You tried to do something with the wrong type of value. Example: calling a method on undefined, or adding a number to null in a way JavaScript cannot handle.\n\n## How to Read an Error\n\nAlways read error messages from the bottom up in a stack trace. The last line of the message is the actual error. The file name and line number appear after the colon. Resist the urge to randomly change things — read the message first, locate the line it points to, and fix that specific problem.",
      "code": "// SyntaxError — missing closing quote\n// console.log('Hello);\n\n// ReferenceError — variable not defined\n// console.log(messge); // typo: messge instead of message\n\n// TypeError — calling method on undefined\n// let x;\n// x.toUpperCase(); // x is undefined, not a string\n\n// The correct versions\nconsole.log('Hello');\nconst message = 'world';\nconsole.log(message);\nconsole.log(message.toUpperCase()); // WORLD",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "When you see an error, resist the urge to randomly change things. Read the message carefully — it almost always tells you exactly what is wrong and on which line."
      },
      "keyPoints": [
        "SyntaxError means JavaScript could not parse the code — check for missing quotes or brackets",
        "ReferenceError means you used a name JavaScript does not recognise — check for typos",
        "TypeError means the wrong type of value was used — check what the variable actually holds",
        "Read error messages bottom-up — the last line is the actual error description",
        "Errors are information, not failures — they tell you exactly what to fix"
      ],
      "tryIt": "Deliberately create three different errors: remove a closing parenthesis from console.log(), use a variable name you have not declared, and try calling .toUpperCase() on a number. Read each error message and identify which type it is."
    }
  },

  {
    "id": 7,
    "moduleId": 1,
    "moduleTitle": "Introduction to JavaScript",
    "title": "JavaScript in an HTML Page",
    "type": "lesson",
    "content": {
      "body": "JavaScript connects to HTML pages through the script tag. This tag tells the browser to stop rendering HTML for a moment, execute the JavaScript inside or linked by the tag, and then continue. Understanding how and where you place your script tag has significant consequences for how your page behaves.\n\n## Inline vs External Scripts\n\nYou can write JavaScript directly inside a script tag (inline) or link to a separate .js file using the src attribute. For anything beyond a few lines, always use a separate file. It keeps your HTML and JavaScript organised, allows the browser to cache the script file, and makes both files easier to read and maintain.\n\n## Where to Place the Script Tag\n\nPlace the script tag just before the closing body tag (</body>). This ensures the HTML has fully loaded before your JavaScript tries to interact with it. If you place the script tag in the head section, your code may run before the page elements exist, causing errors when you try to access them.\n\nAn alternative is to use the defer attribute in the head: `<script defer src='app.js'></script>`. defer tells the browser to download the script in parallel with HTML parsing and execute it after HTML is fully loaded.",
      "code": "<!-- In your HTML file -->\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>My First JS Page</title>\n  </head>\n  <body>\n    <h1 id=\"title\">Hello</h1>\n    <button id=\"btn\">Click me</button>\n\n    <!-- Script at the bottom of body -->\n    <script>\n      const title = document.getElementById('title');\n      title.textContent = 'Hello, JavaScript!';\n\n      document.getElementById('btn').addEventListener('click', () => {\n        alert('Button clicked!');\n      });\n    </script>\n  </body>\n</html>",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Place your script tag just before </body> or use the defer attribute in <head>. Either approach ensures HTML is ready before your JavaScript runs."
      },
      "keyPoints": [
        "The script tag connects JavaScript to an HTML page",
        "Use an external .js file with the src attribute for anything beyond a few lines",
        "Place script tags before the closing body tag to ensure HTML is loaded first",
        "The defer attribute in the head achieves the same result — load HTML first, run script after",
        "document.getElementById() lets JavaScript access and modify specific HTML elements"
      ],
      "tryIt": "Create an HTML file with a heading and a button. Add a script tag before </body>. Write JavaScript that changes the heading text when the button is clicked. Open the file in your browser and test it."
    }
  },

  {
    "id": 8,
    "moduleId": 1,
    "moduleTitle": "Introduction to JavaScript",
    "title": "How to Learn JavaScript Effectively",
    "type": "lesson",
    "content": {
      "body": "Learning to program is more like learning a physical skill than memorising facts. You can read about cycling for weeks and still fall off the bike. Programming competence comes from writing code repeatedly, making mistakes, fixing them, and building real things. Reading and watching tutorials builds understanding — writing code builds ability. You need both, but most learners over-invest in reading and under-invest in writing.\n\n## The Most Important Rules\n\n**Type everything.** Never copy-paste code from examples. Typing forces you to read every character, notice details, and build the muscle memory that makes syntax feel natural. Developers who copy-paste their way through tutorials struggle consistently when they have to write from scratch.\n\n**Break things deliberately.** Once you understand an example, change it. Remove a line and see what happens. Change a value and predict the output before you run it. Deliberately introduce an error and read the message. This is how deep understanding develops.\n\n**Practice every day.** Thirty minutes of daily practice beats a six-hour session once a week. Your brain consolidates learning while you sleep, so consistency gives you more consolidation cycles than intensity. Set a small daily goal and protect it.",
      "callout": {
        "type": "tip",
        "text": "Keep a learning log. After each session, write one thing you learned and one question you still have. Reflecting on what you did solidifies the learning and reveals gaps."
      },
      "keyPoints": [
        "Type all code yourself — never copy-paste from examples when you are learning",
        "Practice daily for 20-30 minutes rather than long infrequent sessions",
        "Break examples deliberately — change values, remove lines, predict results",
        "Build small programs from scratch as early as possible",
        "Reading builds understanding; writing builds ability — you need both but prioritise writing"
      ],
      "tryIt": "Without looking at any examples, write a JavaScript program from scratch that: declares three variables (name, age, city), prints a sentence that includes all three values using template literals, and then prints the age multiplied by 365."
    }
  },

  // =========================
  // Module 2: Variables & Values
  // =========================

  {
    "id": 9,
    "moduleId": 2,
    "moduleTitle": "Variables & Values",
    "title": "Why Variables Matter",
    "type": "lesson",
    "content": {
      "body": "Imagine you need to calculate a user's total order amount and use that number five times — to show it on screen, apply a discount, calculate tax, update a database, and send a confirmation email. Without variables, you would have to recalculate or retype that number in five places. If the price changes, you update five places and risk making mistakes.\n\nVariables solve this by letting you compute or receive a value once, store it under a name, and use that name wherever you need the value. Change the value in one place and every reference to it updates automatically.\n\n## Variables Make Code Readable\n\nA variable is also a form of documentation. Consider these two lines:\n\n```\nconsole.log(86400);          // What is this number?\nconsole.log(secondsPerDay);  // Immediately clear\n```\n\nThe second version tells the reader exactly what the number means. Good variable names are one of the most powerful tools for writing readable, maintainable code.\n\n## Variables Change\n\nThe word variable comes from vary — the value can change over time. A user's score starts at 0 and increases as they play. A cart total starts empty and grows as items are added. Variables represent the current state of things that change during program execution.",
      "code": "// Without a variable — value used three times\n// Hard to update, easy to make mistakes\nconsole.log(29.99 * 1.075); // with tax\nconsole.log(29.99 * 0.9);   // with discount\nconsole.log(29.99);\n\n// With a variable — update in one place\nconst price = 29.99;\nconsole.log(price * 1.075);  // with tax\nconsole.log(price * 0.9);    // with discount\nconsole.log(price);",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "If you find yourself writing the same value more than once, it should probably be a variable. Store it once, name it clearly, and reference the name everywhere else."
      },
      "keyPoints": [
        "Variables store a value once and let you reference it by name everywhere else",
        "Changing a variable value updates all references automatically — edit in one place",
        "Descriptive variable names make code self-documenting and easier to understand",
        "Variables represent the changing state of your program as it runs",
        "Using variables reduces the chance of introducing inconsistencies across your code"
      ],
      "tryIt": "Write a program that stores an item price, a tax rate (e.g. 0.075), and a discount rate (0.1). Calculate and print the price with tax, the discounted price, and the discounted price with tax applied. All calculations should reference your variables, not hardcoded numbers."
    }
  },

  {
    "id": 10,
    "moduleId": 2,
    "moduleTitle": "Variables & Values",
    "title": "Creating Variables with let",
    "type": "lesson",
    "content": {
      "body": "In JavaScript, you create a variable using a keyword followed by a name and an optional value. The most common keyword for mutable variables is let. The = sign is the assignment operator — it does not mean 'equal' the way it does in mathematics. It means 'take the value on the right and store it in the container named on the left'.\n\n## let vs var\n\nOlder JavaScript code uses the var keyword. You will see it in legacy code, but you should not write new code with var. var has confusing scoping rules — it is function-scoped instead of block-scoped, which means it can leak out of if blocks and loops in ways that cause bugs. let fixes this: a variable declared with let only exists within the block ({}) where it was declared.\n\n## Reassigning Variables\n\nWith let, you can change the value stored in a variable at any time. You reassign a variable by using its name again with the = operator, without the let keyword. The old value is discarded and the new value takes its place.\n\n## Dynamic Typing\n\nJavaScript is dynamically typed — you do not declare the type of a variable. JavaScript figures out the type from the value you assign. You can even reassign a variable to a completely different type (though this is often a sign of poor design).",
      "code": "// Creating a variable\nlet score = 0;\nconsole.log(score); // 0\n\n// Reassigning — no let keyword needed\nscore = 10;\nconsole.log(score); // 10\n\nscore = score + 5;\nconsole.log(score); // 15\n\n// let is block-scoped\nif (true) {\n  let localVar = \"only here\";\n  console.log(localVar); // works\n}\n// console.log(localVar); // ReferenceError — outside block\n\n// Avoid var in modern JavaScript\n// var leaks out of blocks, causing bugs",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Never use var in new JavaScript code. It has confusing function-scope behaviour that causes bugs. Always use let for values that change and const for values that do not."
      },
      "keyPoints": [
        "let declares a variable that can be reassigned later",
        "The = operator assigns a value — it does not test equality (=== does that)",
        "let is block-scoped — the variable only exists inside the {} where it was declared",
        "Avoid var — it is function-scoped and causes confusing behaviour in loops and if blocks",
        "JavaScript is dynamically typed — the type is determined by the assigned value"
      ],
      "tryIt": "Declare a variable called temperature set to 20. Print it. Reassign it to 35. Print it again. Then use the shorthand temperature += 5 to add 5 more. Print the final value. Verify the output at each step."
    }
  },

  {
    "id": 11,
    "moduleId": 2,
    "moduleTitle": "Variables & Values",
    "title": "Constants with const",
    "type": "lesson",
    "content": {
      "body": "const declares a constant — a variable whose binding cannot be reassigned after the initial assignment. If you try to reassign a const variable, JavaScript throws a TypeError immediately. This is not a limitation; it is a safety feature.\n\n## Use const by Default\n\nThe modern JavaScript convention is to use const for everything and only switch to let when you know a value will change. This makes your intent clear: when a reader sees const, they know this value will not change. When they see let, they know the value may change. Code with deliberate variable choices is easier to reason about and debug.\n\n## const Does Not Mean Immutable\n\nThis is an important distinction. const prevents reassignment of the variable binding — it does not make the value itself immutable. If you const an object or an array, you cannot reassign the variable to point to a different object or array, but you can still modify the properties of that object or the contents of that array.\n\n```js\nconst user = { name: 'Alice' };\nuser.name = 'Bob';      // Allowed — modifying property\nuser = { name: 'Eve' }; // TypeError — reassigning const\n```\n\nThis behaviour seems confusing at first but makes sense: const protects the reference (the address in memory), not the contents at that address.",
      "code": "// const — cannot be reassigned\nconst PI = 3.14159;\nconsole.log(PI);\n\n// PI = 3.14; // TypeError: Assignment to constant variable\n\n// const for objects — reference is fixed, contents can change\nconst user = { name: 'Alice', age: 25 };\nuser.age = 26; // Fine — modifying a property\nconsole.log(user.age); // 26\n\n// user = { name: 'Bob' }; // TypeError — cannot reassign const\n\n// Good default: use const unless you know you'll reassign\nconst API_URL = 'https://api.example.com';\nconst ITEMS_PER_PAGE = 20;\nconsole.log(API_URL, ITEMS_PER_PAGE);",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Default to const. Only switch to let when you know the variable will be reassigned. This habit makes your code clearer and prevents accidental mutations."
      },
      "keyPoints": [
        "const prevents a variable from being reassigned after its initial declaration",
        "Use const as your default — only use let when reassignment is intentional",
        "const on an object or array protects the reference, not the contents",
        "You can still modify object properties and array elements declared with const",
        "Constants written in SCREAMING_SNAKE_CASE (e.g. MAX_RETRIES) signal values that should never change"
      ],
      "tryIt": "Declare three constants: your birth year, your country, and a configuration object with a theme and language property. Try reassigning the country — catch and read the error. Then update the theme property inside the configuration object. Observe which is allowed and which is not."
    }
  },

  {
    "id": 12,
    "moduleId": 2,
    "moduleTitle": "Variables & Values",
    "title": "Naming Variables Well",
    "type": "lesson",
    "content": {
      "body": "Variable names are one of the most important design decisions you make in code. A well-named variable makes code self-documenting — a reader understands what a variable holds without needing a comment. A poorly named variable forces everyone (including future you) to trace through logic to figure out its purpose.\n\n## JavaScript Naming Rules\n\nVariable names must start with a letter, underscore (_), or dollar sign ($). They cannot start with a number. They are case-sensitive — score, Score, and SCORE are three different variables. They cannot use reserved words like if, for, let, or class.\n\n## camelCase — The JavaScript Standard\n\nJavaScript uses camelCase for variable and function names: the first word is lowercase, and each subsequent word begins with a capital letter. Examples: firstName, totalAmount, isLoggedIn, userProfile. This is the universal standard across all JavaScript codebases.\n\n## What to Avoid\n\nSingle-letter names (x, d, n) — acceptable only for short loop counters. Meaningless abbreviations (usrNm, ttlAmt). Generic names (data, value, temp, stuff). Numbered sequences (item1, item2, item3 — use an array instead). Misleading names that say something different from what the variable holds.",
      "code": "// Bad names — tell you nothing\nconst x = 25;\nconst d = new Date();\nconst usrNm = 'Alice';\nconst temp = getUserData();\n\n// Good names — immediately clear\nconst userAge = 25;\nconst today = new Date();\nconst userName = 'Alice';\nconst currentUser = getUserData();\n\n// camelCase is the JavaScript standard\nconst firstName = 'Alice';\nconst totalAmount = 99.99;\nconst isLoggedIn = false;\nconst maxRetryCount = 3;\n\n// SCREAMING_SNAKE_CASE for true constants\nconst MAX_CONNECTIONS = 100;\nconst DEFAULT_LANGUAGE = 'en';",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Spend time on names. A clear name eliminates the need for a comment. If you find yourself writing a comment to explain a variable, consider whether a better name would make the comment unnecessary."
      },
      "keyPoints": [
        "Variable names must start with a letter, _, or $ and cannot be reserved words",
        "JavaScript uses camelCase for variables and functions: totalPrice, isLoggedIn",
        "Names should describe what the variable holds — firstName not fn",
        "SCREAMING_SNAKE_CASE signals a value that should never change (MAX_USERS, API_KEY)",
        "Avoid single letters, abbreviations, and generic names like data, temp, value"
      ],
      "tryIt": "Rename these poorly named variables to follow JavaScript conventions: fn = 'Alice', TOTAL_COST = 99.99, usrlogged = true, x = [], max_retry = 3. Explain which naming convention each should use and why."
    }
  },

  {
    "id": 13,
    "moduleId": 2,
    "moduleTitle": "Variables & Values",
    "title": "Numbers in JavaScript",
    "type": "lesson",
    "content": {
      "body": "JavaScript has a single number type that covers both integers and decimals. Unlike most languages that have separate int and float types, JavaScript uses IEEE 754 double-precision floating-point format for all numbers. In practice, this means you write 42 and 3.14 the same way — JavaScript handles both as the same type.\n\n## Arithmetic Operators\n\nJavaScript supports all standard arithmetic: addition (+), subtraction (-), multiplication (*), division (/), exponentiation (**), and the modulus operator (%). The order of operations follows standard mathematics: exponentiation first, then multiplication and division, then addition and subtraction. Parentheses override everything.\n\n## Division Always Returns a Decimal\n\nUnlike Python where 10 // 3 gives 3, JavaScript's division operator always returns a float: 10 / 3 is 3.3333... To get an integer result, use Math.floor(), Math.ceil(), or Math.trunc().\n\n## Floating-Point Precision\n\nA well-known JavaScript quirk: 0.1 + 0.2 does not equal exactly 0.3. It gives 0.30000000000000004. This is not a JavaScript bug — it is a consequence of IEEE 754 floating-point representation. For financial calculations, either use integers (store prices in cents) or a decimal library.",
      "code": "// Basic arithmetic\nconsole.log(10 + 3);    // 13\nconsole.log(10 - 3);    // 7\nconsole.log(10 * 3);    // 30\nconsole.log(10 / 3);    // 3.3333...\nconsole.log(10 % 3);    // 1 (remainder)\nconsole.log(2 ** 10);   // 1024 (exponentiation)\n\n// Integer division\nconsole.log(Math.floor(10 / 3)); // 3\nconsole.log(Math.ceil(10 / 3));  // 4\n\n// Float precision quirk\nconsole.log(0.1 + 0.2);          // 0.30000000000000004\nconsole.log((0.1 + 0.2).toFixed(1)); // '0.3'\n\n// Useful math methods\nconsole.log(Math.abs(-5));  // 5\nconsole.log(Math.max(3, 7, 1)); // 7\nconsole.log(Math.round(4.7)); // 5",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "0.1 + 0.2 !== 0.3 in JavaScript. This is a floating-point representation issue, not a bug. Use toFixed() for display, and store financial values as integers (cents) to avoid it entirely."
      },
      "keyPoints": [
        "JavaScript has one number type for both integers and decimals — no separate int/float",
        "Division (/) always returns a decimal — use Math.floor() for integer results",
        "The modulus operator (%) returns the remainder — essential for even/odd checks and ranges",
        "Exponentiation uses **: 2 ** 8 equals 256",
        "Floating-point numbers have precision limits — 0.1 + 0.2 is not exactly 0.3"
      ],
      "tryIt": "Calculate: the number of seconds in a week, whether 42 is even or odd using %, the remainder when 100 is divided by 7, and 2 to the power of 32. Print each with a descriptive label using console.log()."
    }
  },

  {
    "id": 14,
    "moduleId": 2,
    "moduleTitle": "Variables & Values",
    "title": "Strings in JavaScript",
    "type": "lesson",
    "content": {
      "body": "A string is a sequence of characters — any text, whether a single letter or a complete document. In JavaScript, strings can be wrapped in single quotes, double quotes, or backticks. Single and double quotes behave identically. Backticks create template literals, which are more powerful and the preferred modern approach.\n\n## Template Literals\n\nTemplate literals (backtick strings) allow you to embed expressions directly inside a string using ${expression} syntax. Any JavaScript expression can go inside the braces: variables, calculations, function calls. This eliminates the awkward + concatenation that older JavaScript required.\n\n## String Methods\n\nStrings come with dozens of built-in methods. The most important ones for beginners: .toUpperCase() and .toLowerCase() for case conversion, .trim() for removing whitespace from both ends, .includes() for checking if a substring exists, .split() for breaking a string into an array, and .slice() for extracting a portion.\n\n## String Immutability\n\nStrings in JavaScript are immutable — once created, a string cannot be changed. Methods that appear to modify a string (like .toUpperCase()) actually return a new string. The original is unchanged. You must store the result in a variable if you want to use it.",
      "code": "// Three ways to create strings\nconst a = 'single quotes';\nconst b = \"double quotes\";\nconst c = `template literal`;\n\n// Template literals — embed expressions\nconst name = 'Alice';\nconst age = 25;\nconsole.log(`Hello, ${name}! You are ${age} years old.`);\nconsole.log(`Next year: ${age + 1}`);\n\n// Common string methods\nconsole.log('  hello  '.trim());      // 'hello'\nconsole.log('hello'.toUpperCase());   // 'HELLO'\nconsole.log('hello world'.includes('world')); // true\nconsole.log('a,b,c'.split(','));      // ['a', 'b', 'c']\nconsole.log('hello'.slice(1, 4));     // 'ell'\n\n// String length\nconsole.log('JavaScript'.length);     // 10",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Always use template literals (backticks) for strings that embed variables or expressions. They are cleaner than + concatenation and handle all edge cases correctly, including numbers."
      },
      "keyPoints": [
        "Strings can use single quotes, double quotes, or backticks — backticks are most powerful",
        "Template literals allow ${expression} embedding — preferred over string concatenation with +",
        "Strings are immutable — methods return new strings without modifying the original",
        ".length gives the character count, .includes() checks for substrings, .split() creates arrays",
        "String indexes start at 0 — the first character is string[0]"
      ],
      "tryIt": "Create a string with your full name. Print it in uppercase, lowercase, and with the first and last characters isolated using bracket notation (name[0] and name[name.length - 1]). Then split your full name into first and last name using .split(' ') and print each part separately."
    }
  },

  {
    "id": 15,
    "moduleId": 2,
    "moduleTitle": "Variables & Values",
    "title": "Booleans, undefined, and null",
    "type": "lesson",
    "content": {
      "body": "Booleans represent the simplest possible value: true or false. They are the result of every comparison and the input to every conditional decision. When you write if (isLoggedIn), JavaScript evaluates isLoggedIn as a boolean — if it is true, the block runs; if false, it does not.\n\n## Where Booleans Come From\n\nYou rarely create booleans by typing true or false directly. More often, they result from comparisons and logical operations: age >= 18, name === 'Alice', items.length > 0. These expressions evaluate to true or false at runtime depending on the current values.\n\n## undefined vs null\n\nJavaScript has two special values that represent the absence of a meaningful value.\n\n**undefined** is the automatic default. When you declare a variable without assigning a value, it is undefined. When you access an object property that does not exist, you get undefined. It means: this thing exists but has no value assigned.\n\n**null** is intentional emptiness. When you explicitly want to represent the absence of a value — a user field that has been cleared, an optional reference that has not been set — you use null. It means: this thing intentionally has no value right now.\n\nThe practical rule: undefined usually signals a bug or unfinished code; null signals a deliberate design choice.",
      "code": "// Boolean values\nconst isLoggedIn = true;\nconst hasError = false;\n\n// Booleans from comparisons\nconst age = 20;\nconsole.log(age >= 18);     // true\nconsole.log(age === 21);    // false\nconsole.log(age !== 21);    // true\n\n// undefined — declared but not assigned\nlet username;\nconsole.log(username);       // undefined\nconsole.log(typeof username); // 'undefined'\n\n// null — intentionally empty\nlet selectedUser = null;\nconsole.log(selectedUser);   // null\n\n// Checking for null or undefined\nconsole.log(username == null);  // true (loose — catches both)\nconsole.log(username === undefined); // true (strict)",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "undefined usually means something went wrong or was forgotten. null is set deliberately to mean 'no value'. When you see undefined where you expected a real value, look for an unassigned variable or missing object property."
      },
      "keyPoints": [
        "Booleans are true or false — the result of comparisons and the input to conditionals",
        "Booleans usually come from expressions like age >= 18, not from direct true/false literals",
        "undefined is JavaScript's automatic default — a variable declared but not assigned",
        "null is an intentional empty value set by the programmer to mean 'nothing here'",
        "Use == null to check for both null and undefined in one expression"
      ],
      "tryIt": "Declare a variable without assigning it and log its value and type. Then assign null to it and log it again. Create three comparison expressions that produce boolean results (one true, one false, one that depends on a variable you can change). Log all results with descriptive labels."
    }
  },

  // =========================
  // Module 3: Comparisons & Decisions
  // =========================

  {
    "id": 16,
    "moduleId": 3,
    "moduleTitle": "Comparisons & Decisions",
    "title": "Comparison Operators",
    "type": "lesson",
    "content": {
      "body": "Comparison operators evaluate two values and return a boolean result — either true or false. Every decision in your programs starts with a comparison. If the user's score is above 50, they pass. If the stock is below 10 items, show a warning. If the username matches the logged-in user, show edit controls.\n\n## Strict Equality: === and !==\n\nThe === operator (strict equality) checks that two values are both the same type and the same value. '5' === 5 is false because one is a string and one is a number. Use === for all equality checks — it behaves predictably and prevents an entire class of bugs.\n\nThe !== operator (strict inequality) is the opposite: it returns true when values are different in type or value.\n\n## Loose Equality: == and !=\n\nThe == operator performs type coercion before comparing — it converts values to the same type first. This leads to counterintuitive results: 0 == false is true, '' == false is true, null == undefined is true. These results are legal JavaScript but are surprising and error-prone. Avoid == in new code.\n\n## Relational Operators\n\n>, <, >=, and <= compare the relative size of values. With numbers, they work as expected. With strings, they compare alphabetically by Unicode code point.",
      "code": "// Strict equality — checks type AND value\nconsole.log(5 === 5);     // true\nconsole.log(5 === '5');   // false — different types\nconsole.log(5 !== '5');   // true\n\n// Relational comparisons\nconsole.log(10 > 5);      // true\nconsole.log(10 < 5);      // false\nconsole.log(10 >= 10);    // true\nconsole.log(10 <= 9);     // false\n\n// Avoid loose equality — confusing results\nconsole.log(0 == false);  // true (confusing!)\nconsole.log('' == false); // true (confusing!)\nconsole.log(5 == '5');    // true (confusing!)\n\n// Always use ===\nconsole.log(5 === 5);     // true and predictable",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Always use === and !== for equality checks. Never use == or != in new code. Loose equality coerces types in surprising ways that lead to bugs that are very difficult to trace."
      },
      "keyPoints": [
        "=== (strict equality) checks both type and value — 5 === '5' is false",
        "!== (strict inequality) returns true when values differ in type or value",
        "Always use === and !== — avoid == and != which do unpredictable type coercion",
        ">, <, >=, <= compare numbers by size and strings by Unicode order",
        "All comparison operators return a boolean: true or false"
      ],
      "tryIt": "Write comparisons for each of these and predict the result before running: 10 === 10, 10 === '10', 10 !== 10, 'apple' > 'banana', 0 === false, null === undefined. Run them and verify your predictions. Were any surprising?"
    }
  },

  {
    "id": 17,
    "moduleId": 3,
    "moduleTitle": "Comparisons & Decisions",
    "title": "The if Statement",
    "type": "lesson",
    "content": {
      "body": "The if statement is the fundamental decision-making structure in programming. It evaluates a condition — any expression that produces a boolean — and executes a block of code only when that condition is true. If the condition is false, the block is skipped entirely.\n\n## The Anatomy of an if Statement\n\nThe condition goes inside parentheses after the keyword if. The code to execute goes inside curly braces {} — this is called the block. The block can contain any number of statements. All of them either run or all of them are skipped, together, based on the single condition.\n\n## if...else — Handling Both Cases\n\nThe else clause provides a block that runs when the if condition is false. Together, if and else guarantee that exactly one of the two blocks will execute. Every case is handled — there is no situation where neither block runs and no situation where both blocks run.\n\n## else if — Multiple Conditions\n\nWhen you have more than two possible paths, chain else if clauses. JavaScript evaluates them top to bottom and executes the first block whose condition is true. The else at the end (if present) catches everything that did not match any condition. Order matters — more specific conditions should come first.",
      "code": "// Simple if\nconst score = 75;\nif (score >= 50) {\n  console.log('You passed');\n}\n\n// if...else — guaranteed one path executes\nif (score >= 50) {\n  console.log('You passed');\n} else {\n  console.log('You failed');\n}\n\n// else if — multiple paths\nif (score >= 90) {\n  console.log('Grade A');\n} else if (score >= 70) {\n  console.log('Grade B');\n} else if (score >= 50) {\n  console.log('Grade C');\n} else {\n  console.log('Fail');\n}\n// Prints: Grade B (score is 75)",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Always use curly braces {} even for single-line if blocks. Omitting them works syntactically but causes bugs when you add another line and forget the braces don't apply to it."
      },
      "keyPoints": [
        "if evaluates a condition and executes a block only when the condition is true",
        "else provides a block for the false case — exactly one of the two blocks always runs",
        "else if chains multiple conditions — checked top to bottom, first match wins",
        "Always use curly braces {} around if/else blocks, even for single statements",
        "Place more specific conditions before more general ones in else if chains"
      ],
      "tryIt": "Write a grading program: ask for a score variable (set it manually for now). Print 'Distinction' for 80+, 'Merit' for 60-79, 'Pass' for 40-59, and 'Fail' below 40. Test it with four different values that cover each case."
    }
  },

  {
    "id": 18,
    "moduleId": 3,
    "moduleTitle": "Comparisons & Decisions",
    "title": "Logical Operators",
    "type": "lesson",
    "content": {
      "body": "Logical operators combine multiple conditions into a single expression. Instead of writing nested if statements, you can express complex conditions in one clear line. There are three logical operators in JavaScript: && (AND), || (OR), and ! (NOT).\n\n## AND: && — Both Must Be True\n\nThe && operator returns true only when both conditions are true. If either condition is false, the result is false. Use it when you need multiple conditions to all hold simultaneously: if (age >= 18 && hasID) — the user must be both over 18 AND have an ID.\n\n## OR: || — At Least One Must Be True\n\nThe || operator returns true when at least one condition is true. It only returns false when both are false. Use it when any one of several conditions is sufficient: if (isAdmin || isModerator) — either role qualifies.\n\n## NOT: ! — Flip the Boolean\n\nThe ! operator inverts a boolean. !true is false. !false is true. It is often used to check the opposite of a condition: if (!isLoggedIn) — only runs when the user is NOT logged in.\n\n## Short-Circuit Evaluation\n\nJavaScript evaluates && and || lazily. With &&, if the left side is false, it does not evaluate the right side. With ||, if the left side is true, it does not evaluate the right side. This matters when the right side has side effects.",
      "code": "const age = 20;\nconst hasID = true;\nconst isAdmin = false;\nconst isModerator = true;\n\n// AND — both must be true\nconsole.log(age >= 18 && hasID); // true\nconsole.log(age >= 18 && !hasID); // false\n\n// OR — at least one must be true\nconsole.log(isAdmin || isModerator); // true\nconsole.log(isAdmin || false);       // false\n\n// NOT — invert\nconsole.log(!isAdmin);   // true\nconsole.log(!hasID);     // false\n\n// Combined conditions\nif (age >= 18 && hasID && !isAdmin) {\n  console.log('Regular authenticated user');\n}",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Read logical expressions aloud to verify their meaning. 'age >= 18 AND hasTicket' should both be true for the event. 'isAdmin OR isOwner' — either one qualifies. Speaking it helps catch logic errors."
      },
      "keyPoints": [
        "&& (AND) returns true only when both sides are true",
        "|| (OR) returns true when at least one side is true",
        "! (NOT) inverts a boolean — !true is false, !false is true",
        "Short-circuit: && stops at the first false, || stops at the first true",
        "Combine operators to express complex conditions without nested if statements"
      ],
      "tryIt": "Write conditions for: a user who is logged in AND has a premium account, a payment that was made by credit card OR PayPal, a task that is NOT completed, and a product that is in stock AND either on sale OR has free shipping."
    }
  },

  {
    "id": 19,
    "moduleId": 3,
    "moduleTitle": "Comparisons & Decisions",
    "title": "The switch Statement",
    "type": "lesson",
    "content": {
      "body": "The switch statement is an alternative to long else if chains when you are comparing one value against multiple possibilities. It is cleaner when you have three or more specific values to check, especially when each case has distinct logic.\n\n## How switch Works\n\nThe expression in switch() is evaluated once. JavaScript then compares the result against each case value using strict equality (===). When a match is found, execution begins at that case and continues downward until it hits a break statement or the end of the switch block. If no case matches, the optional default block runs.\n\n## The break Statement Is Critical\n\nWithout a break, JavaScript does not stop at the matching case — it continues executing the next case block too. This is called fall-through. Occasionally fall-through is intentional (when two cases share the same code), but most of the time a missing break is a bug. Always include break unless you deliberately intend fall-through.\n\n## When to Use switch vs else if\n\nUse switch when comparing one variable against many specific values (a command parser, a day of the week handler, a status code translator). Use else if when conditions are ranges or involve different variables (score >= 70, age < 18, name.includes('admin')).",
      "code": "const day = 'Wednesday';\n\nswitch (day) {\n  case 'Monday':\n    console.log('Start of the work week');\n    break;\n  case 'Wednesday':\n    console.log('Midweek');\n    break;\n  case 'Friday':\n    console.log('End of the work week');\n    break;\n  case 'Saturday':\n  case 'Sunday':\n    console.log('Weekend'); // Fall-through is intentional here\n    break;\n  default:\n    console.log('Another work day');\n}",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Always include break at the end of each case block unless you intentionally want fall-through. Forgetting break is one of the most common switch-related bugs."
      },
      "keyPoints": [
        "switch compares one value against multiple cases using strict equality (===)",
        "Execution starts at the matching case and continues until a break is hit",
        "Missing break causes fall-through — execution continues into the next case",
        "The default block runs when no case matches — it is optional but recommended",
        "Use switch for specific value matching; use else if for range or multi-variable conditions"
      ],
      "tryIt": "Write a switch statement that takes a month number (1-12) and prints the season. January-March: Summer (Southern Hemisphere), April-June: Autumn, July-September: Winter, October-December: Spring. Use fall-through to group months with the same season."
    }
  },

  // =========================
  // Module 4: Repeating Actions (Loops)
  // =========================

  {
    "id": 20,
    "moduleId": 4,
    "moduleTitle": "Repeating Actions (Loops)",
    "title": "Why Programs Repeat Actions",
    "type": "lesson",
    "content": {
      "body": "Repetition is one of the most fundamental patterns in programming. You want to send a notification to each of 10,000 users. You want to process every transaction in a day's sales report. You want to validate every field in a form. Writing the same code 10,000 times is not possible — and even writing it 10 times manually is fragile and error-prone.\n\nLoops solve this by running a block of code repeatedly until a condition tells them to stop. The logic is written once; the loop handles the repetition.\n\n## What Makes a Loop\n\nEvery loop needs three things: a starting state (where does the repetition begin?), a stopping condition (when should it end?), and an update step (what changes on each iteration to eventually reach the stopping condition?). A loop missing any of these either never runs or runs forever — an infinite loop that crashes your program.\n\n## Types of Loops in JavaScript\n\nJavaScript provides several loop types: for (best when you know how many iterations), while (best when you repeat until an unknown condition changes), do...while (similar to while but always runs at least once), for...of (iterates over arrays and other iterables), and for...in (iterates over object keys). We will cover each systematically.",
      "diagram": "flowchart TD\n    A[Start] --> B[Check condition]\n    B -->|true| C[Run loop body]\n    C --> D[Update state]\n    D --> B\n    B -->|false| E[Exit loop]\n    style A fill:#f7df1e,color:#1a1a1a\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Every loop follows the same pattern: check condition → run body → update → repeat",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "An infinite loop (one whose condition never becomes false) will crash your browser tab or Node.js process. Always ensure your loop has a clear stopping condition and that the update step actually moves toward it."
      },
      "keyPoints": [
        "Loops run a block of code repeatedly, eliminating manual repetition",
        "Every loop needs three things: a starting state, a stopping condition, and an update step",
        "Missing the update step causes an infinite loop that freezes or crashes your program",
        "JavaScript provides for, while, do...while, for...of, and for...in loops",
        "Loops make it possible to process any number of items with a fixed amount of code"
      ],
      "tryIt": "Without using a loop, write code that prints the numbers 1 through 5 — just five console.log() statements. Then rewrite it using a for loop. Observe how the loop version would scale to 1000 numbers with only one line changed."
    }
  },

  {
    "id": 21,
    "moduleId": 4,
    "moduleTitle": "Repeating Actions (Loops)",
    "title": "The for Loop",
    "type": "lesson",
    "content": {
      "body": "The for loop is the most common loop in JavaScript. It is ideal when you know in advance how many times you want to iterate — or more precisely, when your loop depends on a counter variable.\n\n## The Three Parts\n\nA for loop header has three parts, separated by semicolons, inside the parentheses:\n\n1. **Initialisation** — runs once before the loop starts. Typically declares the counter variable: `let i = 0`\n2. **Condition** — evaluated before each iteration. If true, the body runs. If false, the loop exits: `i < 5`\n3. **Update** — runs after each iteration. Typically increments the counter: `i++`\n\n## The Loop Counter i\n\nBy convention, loop counters use the name i (short for index). If you have nested loops, the inner loop uses j, and a third level uses k. These are the only acceptable single-letter variable names in well-written JavaScript.\n\n## Zero-Based Counting\n\nLoops typically start at 0 when iterating arrays (because array indexes start at 0). They start at 1 when counting human-readable numbers. The condition uses < array.length to avoid going out of bounds (remember: the last valid index is length - 1).",
      "code": "// Basic for loop — count from 1 to 5\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n// Output: 1, 2, 3, 4, 5\n\n// Count from 0 to 4 (common for arrays)\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n// Output: 0, 1, 2, 3, 4\n\n// Count down\nfor (let i = 5; i >= 1; i--) {\n  console.log(i);\n}\n// Output: 5, 4, 3, 2, 1\n\n// Count by 2\nfor (let i = 0; i <= 10; i += 2) {\n  console.log(i);\n}\n// Output: 0, 2, 4, 6, 8, 10",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Trace through your loop manually before running it. Write down the value of i at the start of each iteration, the condition check, and the update. This catches off-by-one errors before you run the code."
      },
      "keyPoints": [
        "The for loop has three parts: initialisation; condition; update — separated by semicolons",
        "Initialisation runs once before the loop; condition is checked before every iteration",
        "The update runs after each iteration — typically i++ to increment the counter",
        "Use let i = 0 with i < array.length when iterating over array indexes",
        "i++ increments by 1; i-- decrements; i += 2 increments by 2"
      ],
      "tryIt": "Write for loops that: print all even numbers from 2 to 20, print a multiplication table for 7 (7×1 through 7×10), and count down from 10 to 1 then print 'Blast off!'. Use descriptive console.log() labels for each output."
    }
  },

  {
    "id": 22,
    "moduleId": 4,
    "moduleTitle": "Repeating Actions (Loops)",
    "title": "The while Loop",
    "type": "lesson",
    "content": {
      "body": "The while loop repeats as long as its condition remains true. Unlike the for loop, which has the counter built into its header, the while loop gives you full control over when and how state changes. This makes it more flexible — and more dangerous if you forget to update the condition.\n\n## When to Use while Instead of for\n\nUse while when the number of iterations is not known in advance. Common scenarios: reading until you reach end of a file, retrying a network request until it succeeds, waiting until a user enters valid input, or processing items from a queue until it is empty. These situations depend on external conditions, not a predictable counter.\n\n## The do...while Variation\n\nThe do...while loop is like while, but with the condition checked at the end instead of the beginning. This guarantees the body executes at least once, even if the condition is initially false. It is less common but useful in specific situations — for example, showing a menu to a user and repeating until they choose to exit.\n\n## Protecting Against Infinite Loops\n\nWith while loops, you are fully responsible for ensuring the condition eventually becomes false. Before writing a while loop, always ask: what will change inside this loop that will eventually make the condition false?",
      "code": "// Basic while loop\nlet count = 1;\nwhile (count <= 5) {\n  console.log(count);\n  count++; // Critical — without this, infinite loop\n}\n\n// while with unknown iterations\nlet number = 256;\nlet halvings = 0;\nwhile (number > 1) {\n  number = Math.floor(number / 2);\n  halvings++;\n}\nconsole.log(`Halvings needed: ${halvings}`); // 8\n\n// do...while — runs at least once\nlet input = 0;\ndo {\n  console.log(`Attempt with input: ${input}`);\n  input++;\n} while (input < 3);\n// Prints 3 times: 0, 1, 2",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Every while loop must have something inside that eventually makes the condition false. Before writing a while loop, identify what changes each iteration and confirm it will eventually reach the exit condition."
      },
      "keyPoints": [
        "while repeats as long as its condition is true — checks condition before each iteration",
        "Use while when the number of iterations is unknown and depends on a changing condition",
        "do...while checks the condition after the body — guarantees at least one execution",
        "You are responsible for updating state inside while — no built-in update step",
        "For loops are cleaner when iterating a known count; while loops handle open-ended repetition"
      ],
      "tryIt": "Write a while loop that starts with a number (try 100) and keeps halving it (divide by 2 and round down) until it reaches 1. Count and print how many steps it took. Then rewrite the same logic as a for loop if possible — which is more natural here?"
    }
  },

  {
    "id": 23,
    "moduleId": 4,
    "moduleTitle": "Repeating Actions (Loops)",
    "title": "break and continue",
    "type": "lesson",
    "content": {
      "body": "Two statements give you fine-grained control over loop execution beyond the standard condition: break and continue.\n\n## break — Exit Immediately\n\nThe break statement terminates the loop immediately, regardless of whether the condition is still true. Execution jumps to the first statement after the loop. Use break when you have found what you were looking for and continuing would be wasteful — searching for a specific item in a list, for example.\n\n## continue — Skip This Iteration\n\nThe continue statement skips the rest of the current iteration and moves to the update step (in a for loop) or back to the condition check (in a while loop). Use continue when a specific iteration should be skipped — filtering out certain values while processing a list.\n\n## When to Use Them\n\nBreak and continue are powerful but can make code harder to follow if overused. A well-designed loop condition often eliminates the need for break. Array methods like filter() often eliminate the need for continue. Use them when they make the intent clearer, not just because they work.",
      "code": "// break — exit the loop early\nconst items = ['apple', 'banana', 'target', 'orange'];\nfor (let i = 0; i < items.length; i++) {\n  if (items[i] === 'target') {\n    console.log(`Found at index ${i}`);\n    break; // No need to keep searching\n  }\n}\n\n// continue — skip specific iterations\nfor (let i = 1; i <= 10; i++) {\n  if (i % 2 === 0) {\n    continue; // Skip even numbers\n  }\n  console.log(i); // Prints odd numbers: 1, 3, 5, 7, 9\n}\n\n// Practical: find first negative number\nconst numbers = [4, 2, -1, 7, -3];\nfor (const n of numbers) {\n  if (n < 0) {\n    console.log(`First negative: ${n}`);\n    break;\n  }\n}",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "Overusing break and continue can make loops hard to follow. If you find yourself using them frequently, consider whether the loop condition or an array method like filter() would express the intent more cleanly."
      },
      "keyPoints": [
        "break exits a loop immediately and jumps to the first statement after the loop",
        "continue skips the rest of the current iteration and moves to the next one",
        "Use break when you have found what you were looking for and further iteration is pointless",
        "Use continue to skip items that do not need processing without terminating the loop",
        "Both work inside for, while, and do...while loops"
      ],
      "tryIt": "Given an array of numbers [3, -1, 7, 2, -4, 8, -2, 5], write a loop that: (1) prints all positive numbers and stops when it finds the second negative number, and (2) in a separate loop, prints only the numbers greater than 4 using continue to skip the rest."
    }
  },

  {
    "id": 24,
    "moduleId": 4,
    "moduleTitle": "Repeating Actions (Loops)",
    "title": "for...of and for...in Loops",
    "type": "lesson",
    "content": {
      "body": "JavaScript provides two specialised loop forms that make iterating over collections more readable than a traditional for loop: for...of for arrays and other iterables, and for...in for object keys.\n\n## for...of — Iterating Over Values\n\nThe for...of loop iterates over the values of any iterable: arrays, strings, Maps, Sets, and more. You get each value directly, without managing an index counter. For most array iteration tasks, for...of is cleaner and less error-prone than a counter-based for loop. The one thing it cannot do is give you the current index — if you need the index, use a counter-based for loop or the array's entries() method.\n\n## for...in — Iterating Over Object Keys\n\nThe for...in loop iterates over the enumerable property keys of an object. You get the key name on each iteration, and use it to access the corresponding value. Important caveat: for...in also iterates over inherited properties from the prototype chain. Best practice is to always use hasOwnProperty() to filter, or better yet, use Object.keys() or Object.entries() with for...of instead.\n\n## Which to Use\n\nFor arrays: use for...of when you do not need the index, array methods (map, filter) for transformation, or counter-based for when you need the index. For objects: prefer Object.keys() or Object.entries() with for...of over for...in.",
      "code": "// for...of — clean value iteration\nconst fruits = ['apple', 'banana', 'orange'];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n// apple, banana, orange\n\n// for...of with strings\nfor (const char of 'hello') {\n  console.log(char);\n}\n// h, e, l, l, o\n\n// for...in — iterating object keys\nconst user = { name: 'Alice', age: 25, city: 'Lagos' };\nfor (const key in user) {\n  console.log(`${key}: ${user[key]}`);\n}\n// name: Alice, age: 25, city: Lagos\n\n// Preferred modern alternative for objects\nfor (const [key, value] of Object.entries(user)) {\n  console.log(`${key}: ${value}`);\n}",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Prefer for...of over traditional for loops when iterating arrays and you do not need the index. It is cleaner, handles edge cases automatically, and communicates intent more clearly."
      },
      "keyPoints": [
        "for...of iterates over the values of arrays, strings, Sets, Maps, and other iterables",
        "for...of is cleaner than counter-based for when you do not need the index",
        "for...in iterates over the enumerable keys of an object",
        "Prefer Object.keys() or Object.entries() with for...of over for...in for safety",
        "for...of with entries() gives both index and value: for (const [i, val] of arr.entries())"
      ],
      "tryIt": "Create an array of your five favourite foods and use for...of to print each one. Then create an object with properties for a book (title, author, year, pages) and use Object.entries() with for...of to print each property and its value as 'key: value'."
    }
  },

  // =========================
  // Module 5: Working with Lists (Arrays)
  // =========================

  {
    "id": 25,
    "moduleId": 5,
    "moduleTitle": "Working with Lists (Arrays)",
    "title": "What Is an Array?",
    "type": "lesson",
    "content": {
      "body": "An array is an ordered collection of values stored under a single variable name. Instead of declaring ten separate variables for ten items — item1, item2, item3 — you store all ten in one array and access each by its position.\n\n## Why Order Matters\n\nArrays are ordered: every item has a fixed position called its index. The first item is at index 0, the second at index 1, and so on. This zero-based indexing is universal across nearly all programming languages. It follows from how memory is addressed at the machine level and is simply the convention you learn to work with.\n\n## Arrays Are Flexible\n\nJavaScript arrays can hold any combination of value types — strings, numbers, booleans, objects, even other arrays. They grow and shrink dynamically as you add or remove items. There is no need to declare a size upfront.\n\n## When to Use an Array\n\nUse an array when you have a list of items that are conceptually similar — a list of names, a sequence of scores, a set of tasks, a collection of products. If each item is a separate entity with its own named properties, an object is the right choice. If you have a collection of similar entities, an array of objects combines both structures.",
      "code": "// Creating an array\nconst fruits = ['apple', 'banana', 'orange'];\nconsole.log(fruits); // ['apple', 'banana', 'orange']\n\n// Accessing by index (zero-based)\nconsole.log(fruits[0]); // 'apple'\nconsole.log(fruits[1]); // 'banana'\nconsole.log(fruits[2]); // 'orange'\nconsole.log(fruits[3]); // undefined — out of range\n\n// Arrays can hold mixed types\nconst mixed = [1, 'hello', true, null, { name: 'Bob' }];\nconsole.log(mixed[4].name); // 'Bob'\n\n// Array length\nconsole.log(fruits.length); // 3\nconsole.log(fruits[fruits.length - 1]); // 'orange' (last item)",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "Array indexes start at 0, not 1. The last valid index is always array.length - 1. Accessing an index beyond this returns undefined, not an error — so out-of-bounds access fails silently if you are not careful."
      },
      "keyPoints": [
        "Arrays store ordered collections of values under a single variable name",
        "Indexes are zero-based — the first item is at index 0, the last at length - 1",
        "JavaScript arrays can hold any mix of value types and grow dynamically",
        "Access items with array[index] — out-of-range access returns undefined",
        "Use arrays for lists of similar items; use objects for single entities with named properties"
      ],
      "tryIt": "Create an array of 5 cities you want to visit. Print the first and last city using index notation. Print the total number of cities using .length. Then access the middle item (index 2) and print it with a descriptive label."
    }
  },

  {
    "id": 26,
    "moduleId": 5,
    "moduleTitle": "Working with Lists (Arrays)",
    "title": "Modifying Arrays",
    "type": "lesson",
    "content": {
      "body": "Arrays are mutable — you can change their contents after creation. JavaScript provides methods for adding, removing, and modifying items. Understanding the key mutation methods and whether they modify the original array or return a new one is essential to avoiding bugs.\n\n## Adding Items\n\n**push()** adds one or more items to the end of the array and returns the new length. This is the most common way to add items and should be your default choice.\n\n**unshift()** adds one or more items to the beginning of the array. It is slower than push() because every existing item's index must be shifted up by one.\n\n## Removing Items\n\n**pop()** removes the last item and returns it. Useful when treating an array like a stack.\n\n**shift()** removes the first item and returns it. Like unshift(), it is slower because all remaining indexes shift down.\n\n**splice(start, deleteCount)** removes a specific number of items starting at a given index. It also optionally inserts new items in their place. splice() is the general-purpose tool for any insertion or deletion in the middle of an array.\n\n## Updating Items\n\nAssign directly by index: array[2] = 'new value'. This replaces the item at that position.",
      "code": "const tasks = ['design', 'code', 'test'];\n\n// Adding items\ntasks.push('deploy');        // adds to end\nconsole.log(tasks); // ['design', 'code', 'test', 'deploy']\n\ntasks.unshift('plan');       // adds to start\nconsole.log(tasks); // ['plan', 'design', 'code', 'test', 'deploy']\n\n// Removing items\nconst last = tasks.pop();    // removes from end\nconsole.log(last);  // 'deploy'\n\nconst first = tasks.shift(); // removes from start\nconsole.log(first); // 'plan'\n\n// Updating an item by index\ntasks[1] = 'build';\nconsole.log(tasks); // ['design', 'build', 'test']\n\n// splice — remove 1 item at index 1\ntasks.splice(1, 1);\nconsole.log(tasks); // ['design', 'test']",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "push() and pop() operate on the end of the array and are O(1) — very fast. shift() and unshift() operate on the start and are O(n) — slower on large arrays because every index must shift."
      },
      "keyPoints": [
        "push() adds to the end; pop() removes from the end — both are fast O(1) operations",
        "unshift() adds to the start; shift() removes from the start — slower O(n) operations",
        "Assign by index to update an item: array[i] = newValue",
        "splice(start, count) removes items from any position; it can also insert replacements",
        "pop() and shift() return the removed item — capture it if you need it"
      ],
      "tryIt": "Create an array representing a shopping cart: ['milk', 'eggs', 'bread']. Add 'butter' to the end. Add 'coffee' to the start. Remove the last item. Remove the first item. Replace 'eggs' with 'cheese'. Print the final cart."
    }
  },

  {
    "id": 27,
    "moduleId": 5,
    "moduleTitle": "Working with Lists (Arrays)",
    "title": "Array Methods — Searching and Slicing",
    "type": "lesson",
    "content": {
      "body": "Beyond adding and removing items, arrays provide methods for finding items, extracting portions, and combining arrays. These are some of the most commonly used tools in everyday JavaScript programming.\n\n## Searching\n\n**indexOf(value)** returns the index of the first occurrence of a value, or -1 if not found. Use it to check whether an item exists and where it is.\n\n**includes(value)** returns a boolean — true if the value exists anywhere in the array, false otherwise. Simpler than indexOf() when you only care whether an item exists, not where.\n\n**find(callback)** and **findIndex(callback)** search using a function (callback) that you provide. They are covered in detail in the Advanced Array Methods module but are introduced here for awareness.\n\n## Extracting and Combining\n\n**slice(start, end)** returns a new array containing items from index start up to (but not including) end. It does not modify the original array. Use it to extract a portion of an array safely.\n\n**concat(otherArray)** combines two arrays into a new array without modifying either original. The spread operator (...) is the modern alternative: [...array1, ...array2].\n\n**join(separator)** converts an array to a string, with items separated by the provided character.",
      "code": "const colours = ['red', 'green', 'blue', 'green'];\n\n// Searching\nconsole.log(colours.indexOf('green'));   // 1 (first occurrence)\nconsole.log(colours.indexOf('yellow'));  // -1 (not found)\nconsole.log(colours.includes('blue'));   // true\nconsole.log(colours.includes('purple')); // false\n\n// Slicing — extract a portion\nconst subset = colours.slice(1, 3);\nconsole.log(subset);    // ['green', 'blue']\nconsole.log(colours);   // unchanged\n\n// Joining\nconsole.log(colours.join(', ')); // 'red, green, blue, green'\n\n// Combining\nconst warm = ['red', 'orange'];\nconst cool = ['blue', 'purple'];\nconst all = [...warm, ...cool]; // modern spread syntax\nconsole.log(all); // ['red', 'orange', 'blue', 'purple']",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "slice() never modifies the original array — it always returns a new one. Use it freely whenever you need a copy or a subset without worrying about side effects."
      },
      "keyPoints": [
        "indexOf() returns the position of an item or -1 if not found",
        "includes() returns true/false — simpler when you only need existence, not position",
        "slice(start, end) extracts a portion into a new array without modifying the original",
        "concat() and the spread operator combine arrays into a new array",
        "join(separator) converts an array to a string — useful for display and formatting"
      ],
      "tryIt": "Given const scores = [85, 92, 78, 95, 88, 72, 95], find the index of the first 95, check whether 100 exists, extract the middle three scores using slice, join all scores into a comma-separated string, and create a new array that combines scores with [60, 70, 80]."
    }
  },

  // =========================
  // Module 6: Grouping Related Data (Objects)
  // =========================

  {
    "id": 28,
    "moduleId": 6,
    "moduleTitle": "Grouping Related Data (Objects)",
    "title": "What Is an Object?",
    "type": "lesson",
    "content": {
      "body": "An object is a collection of key–value pairs that describes a single entity. Where an array groups similar items in a sequence, an object groups related properties that together describe one thing — a user, a product, a configuration, a transaction.\n\nObjects are the most powerful and pervasive data structure in JavaScript. Everything that is not a primitive value (number, string, boolean, null, undefined, symbol) is an object. Arrays are objects. Functions are objects. The DOM elements you interact with in the browser are objects.\n\n## Key–Value Pairs\n\nEach piece of data in an object is stored as a property. A property has a key (the name, written without quotes in literal syntax) and a value (any JavaScript value — a string, number, boolean, array, function, or even another object).\n\n## Object Literals\n\nThe most common way to create an object is with an object literal: curly braces containing comma-separated key: value pairs. This syntax is direct, readable, and the standard approach for creating most objects in JavaScript.\n\n## Objects Describe Things\n\nUse an object when you are modelling a real-world entity with multiple named attributes. A user has a name, email, age, and role — these belong together in one object, not scattered across four separate variables.",
      "code": "// Object literal syntax\nconst user = {\n  name: 'Alice',\n  age: 25,\n  email: 'alice@example.com',\n  isActive: true\n};\n\nconsole.log(user);\n\n// Accessing properties with dot notation\nconsole.log(user.name);     // 'Alice'\nconsole.log(user.age);      // 25\nconsole.log(user.isActive); // true\n\n// An object can hold another object\nconst product = {\n  id: 42,\n  name: 'Laptop',\n  specs: {\n    ram: '16GB',\n    storage: '512GB'\n  }\n};\nconsole.log(product.specs.ram); // '16GB'",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "Objects describe single entities with named properties. Arrays list multiple similar items. When you are modelling one thing with distinct named attributes, use an object. When you have a collection of similar things, use an array."
      },
      "keyPoints": [
        "An object is a collection of key–value pairs that describes a single entity",
        "Properties are accessed with dot notation: object.propertyName",
        "Object values can be any type — strings, numbers, arrays, functions, other objects",
        "Object literals use curly braces {} with comma-separated key: value pairs",
        "Use objects for entities with named attributes; use arrays for lists of similar items"
      ],
      "tryIt": "Create an object for yourself: include name, age, city, and an array of three hobbies. Then create a nested object representing your most recent job or course, with properties for title, organization, and year. Access and print both the first hobby and the job title."
    }
  },

  {
    "id": 29,
    "moduleId": 6,
    "moduleTitle": "Grouping Related Data (Objects)",
    "title": "Reading and Updating Object Properties",
    "type": "lesson",
    "content": {
      "body": "Once you have an object, you need to read its values and update them. JavaScript provides two syntaxes for accessing object properties: dot notation and bracket notation.\n\n## Dot Notation\n\nDot notation is the most common and readable form: object.propertyName. It works whenever the property name is a valid JavaScript identifier — it starts with a letter and contains no spaces or special characters. This covers the vast majority of everyday property access.\n\n## Bracket Notation\n\nBracket notation uses a string inside square brackets: object['propertyName']. It works in all cases, including property names with spaces, names that start with numbers, and — most importantly — when the property name is stored in a variable. This last use case is the critical one: if you need to access a property whose name you do not know until runtime, bracket notation is the only option.\n\n## Adding and Updating Properties\n\nAssign to a property name to update it. If the property exists, its value is replaced. If the property does not exist, it is created. Objects are open — you can add new properties at any time after creation.\n\n## Deleting Properties\n\nThe delete operator removes a property from an object entirely: delete object.propertyName. After deletion, accessing that property returns undefined.",
      "code": "const car = {\n  brand: 'Toyota',\n  model: 'Corolla',\n  year: 2020\n};\n\n// Dot notation — most readable\nconsole.log(car.brand);  // 'Toyota'\nconsole.log(car.year);   // 2020\n\n// Bracket notation — useful with variables\nconst field = 'model';\nconsole.log(car[field]); // 'Corolla'\n\n// Updating an existing property\ncar.year = 2023;\nconsole.log(car.year); // 2023\n\n// Adding a new property\ncar.colour = 'silver';\nconsole.log(car.colour); // 'silver'\n\n// Deleting a property\ndelete car.colour;\nconsole.log(car.colour); // undefined",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Use dot notation by default. Switch to bracket notation only when the property name is dynamic (stored in a variable) or contains characters that make it an invalid identifier (spaces, hyphens)."
      },
      "keyPoints": [
        "Dot notation (object.key) is the standard — readable and concise",
        "Bracket notation (object['key'] or object[variable]) works with any key including dynamic ones",
        "Assigning to a property updates its value; assigning to a new key creates the property",
        "delete object.key removes a property — accessing it afterwards returns undefined",
        "Objects are open — you can add, update, or remove properties at any time"
      ],
      "tryIt": "Create a student object with name, grade, and subject. Read the name using dot notation. Read the grade using bracket notation with a variable key. Update the grade to a higher value. Add a new property called passed set to true. Delete the subject property. Print the final object."
    }
  },

  {
    "id": 30,
    "moduleId": 6,
    "moduleTitle": "Grouping Related Data (Objects)",
    "title": "Methods — Functions Inside Objects",
    "type": "lesson",
    "content": {
      "body": "Objects can hold functions as property values. A function stored in an object is called a method. Methods give objects behaviour — not just data, but actions the object can perform. This is the foundation of object-oriented programming: grouping data and the operations on that data together in one place.\n\n## The this Keyword\n\nInside a method, the this keyword refers to the object the method is called on. This gives the method access to the object's own properties without needing them passed as arguments. When you write user.greet(), inside the greet method, this is the user object.\n\n## Method Shorthand\n\nModern JavaScript provides a cleaner syntax for methods: instead of greet: function() {}, you write greet() {} directly inside the object. Both are equivalent but the shorthand is preferred for its clarity.\n\n## Arrow Functions and this\n\nImportant: arrow functions (=>) do not have their own this. If you use an arrow function as a method, this inside it will not refer to the object — it will inherit this from the surrounding context. For object methods that need to access object properties via this, always use regular function syntax.",
      "code": "const user = {\n  name: 'Alice',\n  age: 25,\n\n  // Method — function inside an object\n  greet() {\n    return `Hello, I am ${this.name}`;\n  },\n\n  // Method that modifies the object\n  birthday() {\n    this.age++;\n    console.log(`Happy birthday ${this.name}! Now ${this.age}.`);\n  }\n};\n\nconsole.log(user.greet());   // 'Hello, I am Alice'\nuser.birthday();              // 'Happy birthday Alice! Now 26.'\n\n// Arrow function — this does NOT work as expected\nconst broken = {\n  name: 'Bob',\n  greet: () => `Hello, ${this.name}` // this is not the object\n};\nconsole.log(broken.greet()); // 'Hello, undefined'",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Do not use arrow functions for object methods that need to access object properties via this. Arrow functions inherit this from the outer scope — inside an object method, they will not have the object as this."
      },
      "keyPoints": [
        "A method is a function stored as a property of an object",
        "Inside a method, this refers to the object the method is called on",
        "Use method shorthand syntax: greet() {} instead of greet: function() {}",
        "Arrow functions do not have their own this — avoid them for object methods",
        "Methods can read and modify the object's own properties using this.propertyName"
      ],
      "tryIt": "Create a bankAccount object with properties: owner, balance, and transactions (an empty array). Add three methods: deposit(amount) adds to balance and records the transaction, withdraw(amount) subtracts from balance if funds exist, and getSummary() returns a string describing the current balance."
    }
  },

  {
    "id": 31,
    "moduleId": 6,
    "moduleTitle": "Grouping Related Data (Objects)",
    "title": "Arrays of Objects",
    "type": "lesson",
    "content": {
      "body": "In real applications, data almost always comes as a list of structured items — a list of users, a catalogue of products, a set of transactions. This is represented in JavaScript as an array of objects: an array where each element is an object.\n\nThis structure is so universal that it is worth treating as a pattern to memorise. Every database query result, every API response, every spreadsheet represented in code — they are all arrays of objects.\n\n## Accessing Data\n\nTo get a specific object, use its array index: users[0]. To get a property of that object, chain dot notation: users[0].name. To loop through all objects, use a for...of loop or array methods.\n\n## Finding Specific Objects\n\nThe most common operations on arrays of objects: filtering by a property value (find all active users), finding a specific object (find the user with this email), sorting by a property (sort products by price), and transforming to a new shape (extract just the names into a flat array). These are covered thoroughly in the Advanced Array Methods module.\n\n## Updating Objects in an Array\n\nBecause objects in an array are references, you can access and modify them directly through the array. Changes to the object through one reference are visible everywhere that references the same object.",
      "code": "const users = [\n  { id: 1, name: 'Alice', role: 'admin', active: true },\n  { id: 2, name: 'Bob',   role: 'user',  active: false },\n  { id: 3, name: 'Carol', role: 'user',  active: true }\n];\n\n// Access a specific object\nconsole.log(users[0].name); // 'Alice'\n\n// Loop through all objects\nfor (const user of users) {\n  console.log(`${user.name} is ${user.active ? 'active' : 'inactive'}`);\n}\n\n// Find active users (preview of filter)\nconst activeUsers = users.filter(u => u.active);\nconsole.log(activeUsers.length); // 2\n\n// Update an object in the array\nusers[1].active = true;\nconsole.log(users[1].active); // true",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Arrays of objects are the most common data shape in JavaScript applications. API responses, database results, and user-created data almost always follow this pattern. Recognise it and you can handle most real-world data tasks."
      },
      "keyPoints": [
        "Arrays of objects represent collections of structured entities — the most common data shape",
        "Access object properties with array[index].property",
        "Loop over arrays of objects with for...of — each iteration gives you one object",
        "filter(), find(), map(), and sort() are the standard tools for working with arrays of objects",
        "Objects in arrays are references — modifying one through the array affects it everywhere"
      ],
      "tryIt": "Create an array of 4 product objects, each with id, name, price, and inStock. Loop through and print only the in-stock products. Find the most expensive product by looping and tracking the maximum. Print all product names as a comma-separated list using join()."
    }
  },

  // =========================
  // Module 7: Functions
  // =========================

  {
    "id": 32,
    "moduleId": 7,
    "moduleTitle": "Functions (Making Code Reusable)",
    "title": "Why Functions Exist",
    "type": "lesson",
    "content": {
      "body": "Without functions, a program is a long, linear sequence of statements. To repeat any logic, you retype it. To update a piece of behaviour, you find every place it was written and change each one. This approach does not scale. Even programs of modest size become impossible to maintain.\n\nFunctions solve this by naming and encapsulating a piece of logic. Write it once. Call it by name wherever you need it. Update it in one place when requirements change. This is the DRY principle: Don't Repeat Yourself.\n\n## Functions Are Also Abstractions\n\nBeyond reuse, functions are a tool for managing complexity. When you call calculateTax(price), you do not need to think about how tax is calculated — just that it is. The function name tells you what happens; the implementation is hidden inside. This lets you reason about large programs in terms of what they do rather than every individual step of how.\n\n## Functions as First-Class Values\n\nIn JavaScript, functions are first-class values — they can be stored in variables, passed as arguments to other functions, and returned from functions. This is what enables callbacks, higher-order functions, and the functional programming patterns used throughout modern JavaScript. Understanding that functions are values is one of the most important conceptual shifts in learning JavaScript.",
      "code": "// Without functions — logic repeated twice\nconst subtotal1 = 50;\nconst tax1 = subtotal1 * 0.075;\nconst total1 = subtotal1 + tax1;\nconsole.log(`Order 1 total: $${total1}`);\n\nconst subtotal2 = 120;\nconst tax2 = subtotal2 * 0.075; // duplicated logic\nconst total2 = subtotal2 + tax2;\nconsole.log(`Order 2 total: $${total2}`);\n\n// With a function — logic defined once\nfunction calculateTotal(subtotal) {\n  const tax = subtotal * 0.075;\n  return subtotal + tax;\n}\n\nconsole.log(`Order 1 total: $${calculateTotal(50)}`);\nconsole.log(`Order 2 total: $${calculateTotal(120)}`);\n// If tax rate changes, update in one place only",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "If you find yourself writing the same logic twice, extract it into a function. If you find yourself writing a comment to explain what a block of code does, that block is probably a candidate for a named function."
      },
      "keyPoints": [
        "Functions allow you to define logic once and call it many times by name",
        "Updating a function in one place updates every call to it automatically",
        "Functions abstract complexity — callers use them without needing to know the implementation",
        "JavaScript functions are first-class values — they can be stored, passed, and returned",
        "DRY (Don't Repeat Yourself) is the core principle that functions implement"
      ],
      "tryIt": "You have three products with prices 15.99, 42.50, and 8.75. Without functions, calculate the price with 8% tax for each. Then refactor: write an addTax(price, rate) function and call it three times. Notice how much cleaner the code is."
    }
  },

  {
    "id": 33,
    "moduleId": 7,
    "moduleTitle": "Functions (Making Code Reusable)",
    "title": "Declaring and Calling Functions",
    "type": "lesson",
    "content": {
      "body": "A function declaration gives a function a name, defines its parameters (inputs), and specifies the code it runs (the body). Declaring a function does nothing by itself — nothing runs until you explicitly call the function by name followed by parentheses.\n\n## Parameters and Arguments\n\nParameters are the placeholder variable names listed in the function definition. Arguments are the actual values you pass when calling the function. When the function runs, each parameter receives the corresponding argument value. Parameters behave like local variables inside the function — they only exist for the duration of that function call.\n\n## The return Statement\n\nreturn sends a value back to the code that called the function. The function immediately stops executing when it hits return. Without a return statement, a function implicitly returns undefined. Design functions that compute something to return that result — do not rely on console.log() inside functions for passing data; that only outputs to the console, it does not give the value back to the caller.\n\n## Function Declarations Are Hoisted\n\nFunction declarations are hoisted to the top of their scope. This means you can call a declared function before it appears in the source code. This works because JavaScript processes all declarations before executing any code in a scope.",
      "code": "// Function declaration\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Calling the function\nconsole.log(greet('Alice')); // 'Hello, Alice!'\nconsole.log(greet('Bob'));   // 'Hello, Bob!'\n\n// Multiple parameters\nfunction add(a, b) {\n  return a + b;\n}\n\nconst sum = add(10, 25);\nconsole.log(sum); // 35\n\n// Without return — returns undefined\nfunction sayHi(name) {\n  console.log(`Hi ${name}`);\n  // No return statement\n}\n\nconst result = sayHi('Alice'); // prints 'Hi Alice'\nconsole.log(result);            // undefined",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "A common beginner mistake is using console.log() inside a function instead of return. console.log() outputs to the console — it does not give the value back to the caller. Always use return when a function needs to produce a result."
      },
      "keyPoints": [
        "A function declaration uses the function keyword, a name, parameters, and a body",
        "Nothing runs when you declare a function — you must call it with functionName()",
        "Parameters are placeholders; arguments are the actual values passed at call time",
        "return sends a value back to the caller and stops the function immediately",
        "A function without return implicitly returns undefined"
      ],
      "tryIt": "Write a function called calculateArea(width, height) that returns the area. Write another called isEven(number) that returns true if the number is even. Write a third called fullName(first, last) that returns the full name. Call each function and log the results."
    }
  },

  {
    "id": 34,
    "moduleId": 7,
    "moduleTitle": "Functions (Making Code Reusable)",
    "title": "Arrow Functions",
    "type": "lesson",
    "content": {
      "body": "Arrow functions are a concise syntax for writing functions introduced in ES6. They use the => (arrow) notation instead of the function keyword. For simple functions, especially ones used as callbacks, arrow functions are significantly more readable than traditional function expressions.\n\n## The Syntax Variants\n\nArrow function syntax has several shorthand forms:\n\n- Full body with explicit return: `const add = (a, b) => { return a + b; }`\n- Implicit return (body is a single expression): `const add = (a, b) => a + b;`\n- Single parameter — parentheses optional: `const double = n => n * 2;`\n- No parameters: `const greet = () => 'Hello!';`\n\nThe implicit return form (no curly braces, no return keyword) only works for single-expression functions. If the function body needs more than one statement, use curly braces and explicit return.\n\n## Arrow Functions and this\n\nArrow functions do not have their own this binding — they inherit this from the surrounding lexical scope. This is the critical difference from regular functions. It makes arrow functions excellent for callbacks inside methods (where you want to access the outer object's this), but inappropriate for methods defined directly on objects.",
      "code": "// Traditional function expression\nconst multiply = function(a, b) {\n  return a * b;\n};\n\n// Arrow function — equivalent\nconst multiplyArrow = (a, b) => a * b;\n\nconsole.log(multiplyArrow(4, 5)); // 20\n\n// Single parameter\nconst double = n => n * 2;\nconsole.log(double(7)); // 14\n\n// No parameters\nconst getTimestamp = () => Date.now();\nconsole.log(getTimestamp());\n\n// Arrow functions shine as callbacks\nconst numbers = [1, 2, 3, 4, 5];\nconst squared = numbers.map(n => n ** 2);\nconsole.log(squared); // [1, 4, 9, 16, 25]",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "Arrow functions are not a replacement for all functions — they are ideal for short callbacks and expressions. For object methods and functions that need their own this, use regular function declarations or expressions."
      },
      "keyPoints": [
        "Arrow functions use => syntax and are more concise than traditional function expressions",
        "Single-expression arrow functions have an implicit return — no braces or return needed",
        "Arrow functions do not have their own this — they inherit it from the outer scope",
        "They are ideal for callbacks in array methods: array.map(n => n * 2)",
        "Do not use arrow functions for object methods that need to access the object via this"
      ],
      "tryIt": "Convert these function expressions to arrow functions: function square(n) { return n * n; }, function greet(name) { return 'Hi ' + name; }, function isPositive(n) { return n > 0; }. Then use one as a callback to filter an array of numbers, keeping only those greater than 10."
    }
  },

  {
    "id": 35,
    "moduleId": 7,
    "moduleTitle": "Functions (Making Code Reusable)",
    "title": "Scope and Closures",
    "type": "lesson",
    "content": {
      "body": "Scope defines where a variable is accessible in your code. Understanding scope prevents an entire category of bugs — the 'variable is not defined' and 'unexpected value' errors that often trace back to a misunderstanding of where variables live.\n\n## Block Scope\n\nVariables declared with let or const only exist within the block ({}) where they are declared. This is called block scope. A variable declared inside an if block, a for loop, or a function does not exist outside of it. This is intentional — it prevents variables from leaking into contexts where they have no meaning.\n\n## Lexical Scope\n\nJavaScript uses lexical scope — a function can access variables defined in any outer scope, but not variables defined in inner scopes. A function carries with it a reference to its surrounding scope at the time it was created.\n\n## Closures\n\nA closure is the combination of a function and the lexical environment it was defined in. When a function references variables from an outer scope, those variables are captured — they remain accessible even after the outer function has returned. Closures are used to create private state, factory functions, and callback functions that remember their context.",
      "code": "// Block scope\nlet x = 'outer';\nif (true) {\n  let x = 'inner'; // different variable\n  console.log(x);  // 'inner'\n}\nconsole.log(x); // 'outer' — unchanged\n\n// Lexical scope — inner can access outer\nfunction outer() {\n  const message = 'Hello from outer';\n  function inner() {\n    console.log(message); // accessible\n  }\n  inner();\n}\nouter();\n\n// Closure — function remembers its surrounding scope\nfunction makeCounter() {\n  let count = 0; // private to this function\n  return function() {\n    count++;\n    return count;\n  };\n}\nconst counter = makeCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "Closures are one of JavaScript's most powerful features. When a function is returned from another function, it keeps access to the variables of the function that created it — even after that outer function has finished executing."
      },
      "keyPoints": [
        "let and const are block-scoped — they only exist inside the {} where they are declared",
        "Inner functions can access variables from outer scopes (lexical scope)",
        "Outer functions cannot access variables declared inside inner functions",
        "A closure is a function that retains access to its outer scope even after that scope has closed",
        "Closures are used to create private state and remember context in callbacks"
      ],
      "tryIt": "Write a function makeMultiplier(factor) that returns a new function. The returned function should take a number and multiply it by factor. Create a double function and a triple function using makeMultiplier. Call both with the number 5 and verify the results."
    }
  },

  // =========================
  // Module 8: Modern JavaScript (ES6+)
  // =========================

  {
    "id": 36,
    "moduleId": 8,
    "moduleTitle": "Modern JavaScript (ES6+)",
    "title": "Template Literals",
    "type": "lesson",
    "content": {
      "body": "Template literals are string literals that use backticks (` `) instead of single or double quotes. They were introduced in ES6 and solve two longstanding problems with JavaScript strings: embedding variables and expressions inside strings, and writing multi-line strings cleanly.\n\n## Interpolation with ${}\n\nThe ${} syntax embeds any JavaScript expression directly inside a string. The expression is evaluated and its result is converted to a string and inserted. This works for variables, arithmetic, function calls, ternary expressions — any valid JavaScript.\n\nThe old concatenation approach: 'Hello, ' + name + '! You are ' + age + ' years old.' is error-prone (easy to forget spaces) and hard to read. Template literals replace this entirely: `Hello, ${name}! You are ${age} years old.`\n\n## Multi-line Strings\n\nWith regular strings, you need \\n to insert a line break. Template literals preserve actual line breaks — pressing Enter inside a template literal creates a new line in the resulting string.\n\n## Tagged Templates\n\nAn advanced feature: you can prefix a template literal with a function name. The function receives the string parts and interpolated values as separate arguments, allowing custom processing. This is used by libraries like styled-components and GraphQL query builders.",
      "code": "const name = 'Alice';\nconst score = 92;\nconst grade = score >= 90 ? 'A' : 'B';\n\n// Template literal with expression\nconsole.log(`${name} scored ${score} — Grade ${grade}`);\n\n// Expressions in ${}\nconsole.log(`In 5 years, I will be ${25 + 5} years old.`);\nconsole.log(`Pi to 2 places: ${Math.PI.toFixed(2)}`);\n\n// Multi-line string\nconst report = `\nStudent: ${name}\nScore: ${score}\nGrade: ${grade}\n`.trim();\nconsole.log(report);\n\n// Old way — hard to read\nconst old = 'Hi ' + name + ', your score is ' + score;\n// New way — clean\nconst modern = `Hi ${name}, your score is ${score}`;",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Always use template literals for any string that includes a variable or expression. Reserve single/double quote strings for static strings that do not need interpolation."
      },
      "keyPoints": [
        "Template literals use backticks and support ${expression} interpolation",
        "Any JavaScript expression can be embedded — variables, arithmetic, function calls, ternaries",
        "Multi-line strings work natively — no \\n needed",
        "Template literals are always the cleaner choice over string concatenation with +",
        "Tagged templates allow advanced processing — used by styled-components and SQL libraries"
      ],
      "tryIt": "Rewrite these concatenated strings as template literals: 'My name is ' + firstName + ' ' + lastName, 'The answer is ' + (a + b), 'Status: ' + (active ? 'online' : 'offline'). Then create a multi-line invoice string using a template literal with at least 4 interpolated values."
    }
  },

  {
    "id": 37,
    "moduleId": 8,
    "moduleTitle": "Modern JavaScript (ES6+)",
    "title": "Destructuring",
    "type": "lesson",
    "content": {
      "body": "Destructuring is a concise syntax for extracting values from arrays or properties from objects and assigning them to variables in a single statement. It replaces repetitive dot notation and array index access with clean, declarative assignment.\n\n## Array Destructuring\n\nWith arrays, positions determine the variable assignment. The first variable receives the first element, the second gets the second, and so on. You can skip elements using empty commas, and use the rest operator (...) to capture remaining elements into a new array.\n\n## Object Destructuring\n\nWith objects, the variable names must match the property names (or you use an alias with the colon syntax). Order does not matter — only the names. Object destructuring is extremely common in React and in function parameters when functions receive configuration objects.\n\n## Destructuring in Function Parameters\n\nYou can destructure directly in a function's parameter list. Instead of receiving an entire config object and accessing config.width, config.height, etc., the function can declare function resize({ width, height }) and use width and height directly. This is one of the most common uses of destructuring in real JavaScript codebases.",
      "code": "// Array destructuring\nconst coordinates = [10, 20, 30];\nconst [x, y, z] = coordinates;\nconsole.log(x, y, z); // 10 20 30\n\n// Skip elements\nconst [first, , third] = [1, 2, 3];\nconsole.log(first, third); // 1 3\n\n// Rest in destructuring\nconst [head, ...tail] = [1, 2, 3, 4, 5];\nconsole.log(head); // 1\nconsole.log(tail); // [2, 3, 4, 5]\n\n// Object destructuring\nconst user = { name: 'Alice', age: 25, role: 'admin' };\nconst { name, age } = user;\nconsole.log(name, age); // 'Alice' 25\n\n// Alias — rename the variable\nconst { name: userName, age: userAge } = user;\nconsole.log(userName); // 'Alice'\n\n// Destructuring in function parameters\nfunction display({ name, age }) {\n  console.log(`${name} is ${age}`);\n}\ndisplay(user); // 'Alice is 25'",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Destructuring is particularly powerful in function parameters. When a function accepts a configuration object, destructuring it in the parameter list makes the function's dependencies immediately visible without drilling into the object inside the body."
      },
      "keyPoints": [
        "Array destructuring assigns values by position: const [a, b] = array",
        "Object destructuring assigns values by property name: const { name, age } = obj",
        "Use a colon to rename variables: const { name: userName } = obj",
        "The rest operator in destructuring collects remaining items: const [head, ...rest] = array",
        "Destructuring in function parameters makes dependencies explicit without repetition"
      ],
      "tryIt": "Destructure a coordinates array [34.05, -118.24, 89] into latitude, longitude, and altitude. Then destructure this object: { firstName: 'Ada', lastName: 'Lovelace', yearBorn: 1815, country: 'UK' } into just firstName and yearBorn. Finally, write a function that accepts a user object and prints a greeting using parameter destructuring."
    }
  },

  {
    "id": 38,
    "moduleId": 8,
    "moduleTitle": "Modern JavaScript (ES6+)",
    "title": "Spread and Rest Operators",
    "type": "lesson",
    "content": {
      "body": "The spread operator (...) and rest parameter syntax share the same three-dot notation but serve opposite purposes. Spread expands an iterable into individual elements. Rest collects individual elements into an array. Which one is in play depends on context.\n\n## Spread — Expanding Into Elements\n\nIn a function call, spread expands an array into individual arguments: Math.max(...numbers). In an array literal, it copies all elements: [...original, newItem]. In an object literal, it copies all properties: { ...original, newProp: value }.\n\nSpread is the standard, immutable way to create modified copies of arrays and objects. Instead of mutating the original, you spread its contents into a new collection with your changes. This is fundamental to modern JavaScript and React state management.\n\n## Rest — Collecting Into an Array\n\nIn a function parameter list, ...rest collects all arguments beyond the named parameters into an array. This allows functions to accept any number of arguments without knowing how many will be passed. In destructuring, ...rest captures remaining elements.\n\nThe rest parameter must always be the last parameter — JavaScript needs to know which arguments to collect after the named ones.",
      "code": "// Spread — copying arrays\nconst original = [1, 2, 3];\nconst copy = [...original];\nconst extended = [...original, 4, 5];\nconsole.log(copy);     // [1, 2, 3]\nconsole.log(extended); // [1, 2, 3, 4, 5]\n\n// Spread — copying objects\nconst user = { name: 'Alice', age: 25 };\nconst updated = { ...user, age: 26 }; // age is overwritten\nconsole.log(updated); // { name: 'Alice', age: 26 }\n\n// Spread in function calls\nconst nums = [3, 1, 7, 2];\nconsole.log(Math.max(...nums)); // 7\n\n// Rest — collecting arguments\nfunction sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}\nconsole.log(sum(1, 2, 3, 4, 5)); // 15",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "Spread creates shallow copies — nested objects are still shared references. If your object contains other objects, changes to those inner objects will affect both the original and the copy."
      },
      "keyPoints": [
        "Spread (...) expands an array or object into individual elements",
        "Use spread to copy arrays/objects without mutating the original: [...arr], {...obj}",
        "Spread in object literals: later keys overwrite earlier ones — useful for updates",
        "Rest (...rest) in function parameters collects extra arguments into an array",
        "Spread creates shallow copies — nested references are shared, not deeply cloned"
      ],
      "tryIt": "Create an array of 5 numbers. Use spread to: create a copy with 6 added to the end, create a second copy with 0 added to the beginning, and pass all numbers to Math.min() to find the smallest. Then write a function using rest parameters that takes any number of strings and returns them joined with ' | '."
    }
  },

  {
    "id": 39,
    "moduleId": 8,
    "moduleTitle": "Modern JavaScript (ES6+)",
    "title": "Optional Chaining and Nullish Coalescing",
    "type": "lesson",
    "content": {
      "body": "Two modern JavaScript operators solve common defensive programming problems more elegantly than the traditional approaches: optional chaining (?.) and nullish coalescing (??).\n\n## Optional Chaining: ?.\n\nAccessing a property on null or undefined throws a TypeError. Traditional defensive code requires verbose null checks before every access: if (user && user.profile && user.profile.avatar) { ... }. Optional chaining short-circuits — if any part of the chain is null or undefined, the whole expression returns undefined instead of throwing.\n\n`user?.profile?.avatar` evaluates to undefined if user is null or if profile does not exist. No error, no crash. This is essential when working with API data where optional fields may or may not be present.\n\n## Nullish Coalescing: ??\n\nThe ?? operator returns the right-hand value when the left-hand value is null or undefined — but not for other falsy values. This is the critical difference from || (OR): || returns the right side for any falsy value (0, '', false, null, undefined). ?? returns the right side only for null and undefined.\n\nThis matters when 0 or empty string are valid values: displayCount ?? 0 — if displayCount is 0, ?? correctly keeps it. With ||, 0 || 0 would return the right-side 0 for the wrong reason, and 0 || 5 would return 5, discarding the legitimate 0.",
      "code": "// Optional chaining — safe navigation\nconst user = {\n  name: 'Alice',\n  profile: {\n    avatar: 'alice.jpg'\n  }\n};\n\nconsole.log(user?.profile?.avatar);   // 'alice.jpg'\nconsole.log(user?.settings?.theme);  // undefined (no error)\n\n// Optional chaining with methods\nconsole.log(user?.greet?.());        // undefined (no error)\n\n// Nullish coalescing — default for null/undefined only\nconst count = 0;\nconst name = '';\n\nconsole.log(count ?? 'default');  // 0 (0 is not null/undefined)\nconsole.log(count || 'default');  // 'default' (0 is falsy — wrong!)\n\nconsole.log(name ?? 'Anonymous'); // '' (not null/undefined)\nconsole.log(name || 'Anonymous'); // 'Anonymous' ('' is falsy — maybe wrong)\n\n// Combined\nconst theme = user?.settings?.theme ?? 'light';\nconsole.log(theme); // 'light' (settings is undefined)",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Use ?? instead of || when providing defaults for values where 0, false, or empty string are legitimate values you want to preserve. ?? only triggers for null and undefined."
      },
      "keyPoints": [
        "?. (optional chaining) short-circuits to undefined instead of throwing when accessing null/undefined",
        "user?.profile?.name is safe even if user or profile is null or undefined",
        "?? (nullish coalescing) returns the right side only when the left is null or undefined",
        "?? differs from || in that || also triggers for 0, false, and empty string",
        "Combine them: user?.settings?.theme ?? 'light' — safe access with a fallback"
      ],
      "tryIt": "Given an API response object where some fields may be missing: { user: { name: 'Alice', profile: null } }, safely access user.profile.bio and user.settings.language using optional chaining. Provide a default of 'No bio' and 'English' using nullish coalescing when the values are not present."
    }
  },

  // =========================
  // Module 9: Advanced Array Methods
  // =========================

  {
    "id": 40,
    "moduleId": 9,
    "moduleTitle": "Advanced Array Methods",
    "title": "Why Array Methods Exist",
    "type": "lesson",
    "content": {
      "body": "Traditional for loops work for array iteration, but they mix two concerns: how to loop (the counter, the condition, the index management) with what to do with each item. For large arrays and complex transformations, this mixing makes code harder to read and more error-prone.\n\nArray methods solve this by separating iteration from transformation. You pass a callback function that describes what to do with each item — the method handles how to iterate. The result is code that reads more like a description of intent than a sequence of mechanical instructions.\n\n## Functional Programming Style\n\nMost array methods — map, filter, reduce, find, some, every — follow a functional pattern: they take a callback that processes one item, and the method handles applying it to all items. These methods do not modify the original array — they return new arrays or values. Avoiding mutation is a key principle of functional programming.\n\n## Callbacks\n\nA callback is a function you pass as an argument to another function. The receiving function calls your callback at the appropriate time — in array methods, once per element. Arrow functions make callbacks concise: numbers.filter(n => n > 0) is immediately readable as 'filter numbers, keeping those where n > 0'.",
      "diagram": "flowchart LR\n    A[Original Array] --> B[Array Method]\n    B --> C[Callback Function]\n    C --> D[Applied to Each Item]\n    D --> E[New Array or Value]\n    style A fill:#f7df1e,color:#1a1a1a\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Array methods apply a callback to each element, returning a new result without modifying the original",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Think of array methods as transformations that describe what you want, not instructions for how to loop. 'Filter where active' instead of 'loop, check, push'. This shift in thinking is what makes functional code readable."
      },
      "keyPoints": [
        "Array methods separate iteration from transformation, making code more readable",
        "They take a callback function that processes one item — the method handles the iteration",
        "Most array methods (map, filter, reduce) do not modify the original array",
        "Callbacks are just functions passed as arguments — arrow functions make them concise",
        "Functional array methods express intent more clearly than manual for loops"
      ],
      "tryIt": "Take an array of 8 numbers including negative values and zeros. Using only for loops (no array methods), write code to: print all positive numbers, collect all numbers greater than 5 into a new array, and sum all the numbers. Note how much code this takes. You will compare this to array methods next."
    }
  },

  {
    "id": 41,
    "moduleId": 9,
    "moduleTitle": "Advanced Array Methods",
    "title": "forEach, map, and filter",
    "type": "lesson",
    "content": {
      "body": "The three most essential array methods for everyday JavaScript work are forEach, map, and filter. Understanding when to use each is fundamental to writing clean, readable code.\n\n## forEach — Iterate with Side Effects\n\nforEach calls a callback once for each element but returns undefined — it is used for side effects (logging, updating the DOM, triggering actions). It does not produce a new array. If you find yourself building an array inside a forEach, you should be using map or filter instead.\n\n## map — Transform Every Item\n\nmap creates a new array where every element is the result of applying the callback to the corresponding element in the original. The new array is always the same length as the original. Use map whenever you need a one-to-one transformation: double every number, extract a property from every object, convert every string to uppercase.\n\n## filter — Keep What Matches\n\nfilter creates a new array containing only the elements for which the callback returns true. The original array is unchanged. The result may be shorter than the original — any element for which the callback returns a falsy value is excluded. Use filter to select a subset based on a condition.",
      "code": "const numbers = [1, 2, 3, 4, 5, 6];\nconst users = [\n  { name: 'Alice', active: true },\n  { name: 'Bob', active: false },\n  { name: 'Carol', active: true }\n];\n\n// forEach — side effects only\nnumbers.forEach(n => console.log(n * 10));\n\n// map — transform every item\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10, 12]\n\nconst names = users.map(user => user.name);\nconsole.log(names); // ['Alice', 'Bob', 'Carol']\n\n// filter — keep what matches\nconst evens = numbers.filter(n => n % 2 === 0);\nconsole.log(evens); // [2, 4, 6]\n\nconst activeUsers = users.filter(user => user.active);\nconsole.log(activeUsers.length); // 2",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Pick the right tool: forEach for side effects (logging, DOM updates), map for transformation (returns new same-length array), filter for selection (returns shorter array). The wrong choice produces confusing, inefficient code."
      },
      "keyPoints": [
        "forEach iterates but returns undefined — use it only for side effects, not to build arrays",
        "map returns a new array of the same length with each element transformed by the callback",
        "filter returns a new array of elements for which the callback returned a truthy value",
        "Neither map nor filter modify the original array — they always return new arrays",
        "map and filter can be chained: array.filter(pred).map(transform)"
      ],
      "tryIt": "Given const products = [{name:'Laptop',price:999,inStock:true},{name:'Phone',price:499,inStock:false},{name:'Tablet',price:299,inStock:true}], use filter to get in-stock products, then use map on the result to get just the names. Also use map on the full list to add a 10% discounted price to each product."
    }
  },

  {
    "id": 42,
    "moduleId": 9,
    "moduleTitle": "Advanced Array Methods",
    "title": "reduce, find, and other methods",
    "type": "lesson",
    "content": {
      "body": "Beyond the core trio of forEach/map/filter, several other array methods cover important use cases: reduce for aggregation, find for searching, some and every for testing conditions, sort for ordering, and flat for flattening nested arrays.\n\n## reduce — Combine Into One Value\n\nreduce is the most powerful and most misunderstood array method. It processes every element and accumulates a single result — which can be a number, string, object, or even a new array. The callback receives an accumulator (the running result) and the current element. The second argument to reduce() is the initial value of the accumulator.\n\nCommon uses: summing all numbers, counting occurrences, grouping items by a property, building a lookup object from an array.\n\n## find and findIndex\n\nfind returns the first element that satisfies the callback, or undefined if none does. findIndex returns the index of the first match, or -1. Use these instead of a loop when searching for a specific item.\n\n## some and every\n\nsome returns true if at least one element satisfies the callback. every returns true only if all elements satisfy it. Both short-circuit — some stops at the first true, every stops at the first false.",
      "code": "const numbers = [1, 2, 3, 4, 5];\nconst products = [\n  { id: 1, name: 'Laptop', price: 999 },\n  { id: 2, name: 'Phone', price: 499 },\n  { id: 3, name: 'Tablet', price: 299 }\n];\n\n// reduce — sum all numbers\nconst sum = numbers.reduce((acc, n) => acc + n, 0);\nconsole.log(sum); // 15\n\n// reduce — group by property\nconst scores = [75, 82, 45, 90, 55, 88];\nconst passed = scores.reduce((count, s) => s >= 60 ? count + 1 : count, 0);\nconsole.log(`${passed} of ${scores.length} passed`);\n\n// find — first match\nconst tablet = products.find(p => p.name === 'Tablet');\nconsole.log(tablet?.price); // 299\n\n// some and every\nconsole.log(scores.some(s => s >= 90));    // true\nconsole.log(scores.every(s => s >= 60));   // false",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "reduce can replace any other array method — it is universal. But using it where map or filter is appropriate reduces clarity. Reserve reduce for genuine aggregation tasks where you are combining all elements into one result."
      },
      "keyPoints": [
        "reduce(callback, initialValue) combines all elements into a single value via an accumulator",
        "find() returns the first matching element; findIndex() returns its index",
        "some() returns true if any element passes the test; every() requires all to pass",
        "sort() sorts in place — provide a compare function for numbers: (a, b) => a - b",
        "flat(depth) flattens nested arrays — flat(Infinity) flattens completely"
      ],
      "tryIt": "Given const transactions = [120, -45, 200, -80, 350, -15], use reduce to: calculate the total balance, count how many are debits (negative), and find the largest credit. Then use some to check if any transaction exceeds 300, and every to check if all are non-zero."
    }
  },

// =========================
  // Module 10: Asynchronous JavaScript
  // =========================

  {
    "id": 43,
    "moduleId": 10,
    "moduleTitle": "Asynchronous JavaScript",
    "title": "Why Asynchronous Code Exists",
    "type": "lesson",
    "content": {
      "body": "JavaScript runs on a single thread — it can only execute one operation at a time. Most operations complete instantly: arithmetic, variable assignment, string manipulation. But some operations take time: fetching data from a server, reading a file from disk, waiting for a timer. If JavaScript simply paused and waited for each slow operation to finish before moving on, your entire application would freeze during that wait. Users could not click buttons, animations would stop, the page would appear broken.\n\nAsynchronous programming solves this by allowing JavaScript to start a slow operation and continue executing other code while it waits for the result. When the slow operation finishes, JavaScript comes back to handle the result.\n\n## The Event Loop\n\nThis is made possible by the event loop — a mechanism that monitors a call stack (where current code runs) and a callback queue (where pending callbacks wait). When the call stack is empty, the event loop picks the next callback from the queue and runs it. This allows JavaScript to be both single-threaded and non-blocking.",
      "diagram": "flowchart TD\n    A[\"Call fetch(url)\"] --> B[\"Start network request\"]\n    B --> C[\"Continue running other code\"]\n    C --> D{\"Response arrives?\"}\n    D -->|No| C\n    D -->|Yes| E[\"Run the callback\"]\n    style A fill:#f7df1e,color:#1a1a1a\n    style E fill:#dcfce7,stroke:#16a34a",
      "diagramCaption": "JavaScript starts the async operation and continues — the callback runs when the response arrives",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "Asynchronous code does not run in parallel — JavaScript is still single-threaded. It runs code, delegates slow work to the browser/Node.js environment, and handles the result when the work is done."
      },
      "keyPoints": [
        "JavaScript is single-threaded — blocking on slow operations would freeze the entire program",
        "Asynchronous code starts a slow operation and continues executing immediately",
        "The event loop checks the callback queue when the call stack is empty",
        "Browser APIs and Node.js handle slow work (network, file I/O) outside the JS thread",
        "When async work finishes, the callback is queued and eventually runs"
      ],
      "tryIt": "Run console.log('before'), then setTimeout(() => console.log('timeout'), 0), then console.log('after'). What order do they print? The timeout callback runs after 'after' even with 0ms delay. This demonstrates the event loop — the callback waits in the queue until the call stack is empty."
    }
  },

  {
    "id": 44,
    "moduleId": 10,
    "moduleTitle": "Asynchronous JavaScript",
    "title": "Callbacks",
    "type": "lesson",
    "content": {
      "body": "The first approach to handling async results in JavaScript was the callback: a function you pass as an argument to an async operation, to be called when the operation completes. setTimeout, addEventListener, and older Node.js file reading all use callbacks.\n\n## How Callbacks Work\n\nYou define what to do when the async operation finishes, and pass that definition as a function. The async function holds onto your callback and invokes it when the work is done — calling you back, hence the name.\n\n## The Problem with Callbacks\n\nCallbacks work for simple operations, but they compose poorly. When one async operation depends on the result of another, you nest callbacks. When that result triggers another async operation, you nest again. This creates callback hell: deeply nested code that is hard to read, hard to reason about, and hard to handle errors in.\n\n```js\ngetUser(id, function(user) {\n  getOrders(user.id, function(orders) {\n    getProduct(orders[0].productId, function(product) {\n      // Three levels deep — and growing\n    });\n  });\n});\n```\n\nPromises and async/await were invented specifically to eliminate this nesting.",
      "code": "// setTimeout — most common callback example\nsetTimeout(() => {\n  console.log('Runs after 2 seconds');\n}, 2000);\n\nconsole.log('This runs immediately');\n// Output order: 'This runs immediately', then 'Runs after 2 seconds'\n\n// Event listener — another callback pattern\ndocument.getElementById('btn')?.addEventListener('click', () => {\n  console.log('Button was clicked');\n});\n\n// Callback hell — hard to maintain\nfunction step1(callback) { setTimeout(() => callback('data1'), 100); }\nfunction step2(data, callback) { setTimeout(() => callback(data + '+data2'), 100); }\n\nstep1(function(result1) {\n  step2(result1, function(result2) {\n    console.log(result2); // 'data1+data2'\n  });\n});",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Callbacks are still everywhere — setTimeout, addEventListener, and many library APIs use them. Learn to read them. But for your own async logic that chains operations, use Promises and async/await instead."
      },
      "keyPoints": [
        "A callback is a function passed as an argument and called when an async operation completes",
        "setTimeout, setInterval, and addEventListener all use the callback pattern",
        "Callbacks work for simple async operations but compose poorly",
        "Nested callbacks (callback hell) are hard to read, debug, and handle errors in",
        "Promises and async/await solve the nesting problem — they are the modern replacement"
      ],
      "tryIt": "Write a function delay(ms) that returns nothing but calls console.log('Done!') after the given milliseconds using setTimeout. Call it with 1000, 500, and 2000. Notice the order of the outputs — they do not follow the order you called them in."
    }
  },

  {
    "id": 45,
    "moduleId": 10,
    "moduleTitle": "Asynchronous JavaScript",
    "title": "Promises",
    "type": "lesson",
    "content": {
      "body": "A Promise is an object representing the eventual completion or failure of an async operation. Instead of passing a callback into a function, the function returns a Promise and you attach handlers to it. This inverts the control flow and makes async code composable.\n\n## Promise States\n\nA Promise can be in one of three states: pending (the operation has started but not finished), fulfilled (the operation completed successfully, with a result value), or rejected (the operation failed, with a reason/error). A Promise transitions from pending to either fulfilled or rejected exactly once — it cannot go back or change state again.\n\n## Handling Promises\n\n.then(callback) runs when the Promise is fulfilled, receiving the result as its argument. .catch(callback) runs when the Promise is rejected, receiving the error. .finally(callback) runs regardless of outcome — useful for cleanup like hiding a loading spinner.\n\n## Promise Chaining\n\nThe power of Promises is chaining: each .then() can return a new value or a new Promise, and the next .then() receives that result. This replaces callback nesting with a flat, readable sequence of operations.",
      "code": "// Creating a Promise\nconst myPromise = new Promise((resolve, reject) => {\n  const success = true;\n  if (success) {\n    resolve('Operation succeeded');\n  } else {\n    reject(new Error('Operation failed'));\n  }\n});\n\n// Handling a Promise\nmyPromise\n  .then(result => {\n    console.log(result); // 'Operation succeeded'\n    return result.toUpperCase();\n  })\n  .then(upper => {\n    console.log(upper); // 'OPERATION SUCCEEDED'\n  })\n  .catch(error => {\n    console.log('Error:', error.message);\n  })\n  .finally(() => {\n    console.log('Always runs');\n  });",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "Each .then() in a chain receives the return value of the previous .then(). If a .then() returns a new Promise, the chain waits for that Promise to resolve before continuing. This is what makes Promise chaining so powerful."
      },
      "keyPoints": [
        "A Promise represents a future value — either a successful result or an error",
        "Promises have three states: pending, fulfilled, and rejected",
        ".then() handles the successful result; .catch() handles errors; .finally() runs always",
        "Returning a value or Promise from .then() passes it to the next .then() in the chain",
        "Promise chaining replaces nested callbacks with flat, readable async sequences"
      ],
      "tryIt": "Create a Promise that resolves with a random number after 1 second (use setTimeout inside the Promise constructor). Chain two .then() calls: first to double the number, then to log it with a label. Add a .catch() and a .finally(). Test what happens when you reject instead of resolve."
    }
  },

  {
    "id": 46,
    "moduleId": 10,
    "moduleTitle": "Asynchronous JavaScript",
    "title": "async and await",
    "type": "lesson",
    "content": {
      "body": "async/await is syntactic sugar over Promises. It lets you write asynchronous code that looks and reads like synchronous code, eliminating the visual noise of .then() chains while keeping the non-blocking behaviour underneath. async/await is the standard way to write async JavaScript today.\n\n## The async Keyword\n\nMarking a function with async makes two things happen: it allows the use of await inside it, and it makes the function return a Promise automatically (even if you write return 'value', the function actually returns Promise.resolve('value')).\n\n## The await Keyword\n\nawait pauses execution of the async function until the Promise settles, then returns the resolved value. It does not pause the entire program — other code outside the async function continues running. await can only be used inside an async function.\n\n## Error Handling with try/catch\n\nWith async/await, errors from rejected Promises are caught with try/catch blocks, exactly like synchronous errors. This is far cleaner than chaining .catch() — all your error handling is in one familiar pattern.",
      "code": "// Promise chain — readable but can get long\nfunction loadUserData(id) {\n  return fetch(`/api/users/${id}`)\n    .then(res => res.json())\n    .then(user => user)\n    .catch(err => console.error(err));\n}\n\n// async/await — reads like synchronous code\nasync function loadUserDataAsync(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    const user = await res.json();\n    return user;\n  } catch (error) {\n    console.error('Failed to load user:', error.message);\n    throw error; // re-throw for caller to handle\n  }\n}\n\n// Calling an async function\nasync function main() {\n  const user = await loadUserDataAsync(1);\n  console.log(user.name);\n}\n\nmain();",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "await can only be used inside an async function. If you try to use await at the top level of a module (outside any function), it will throw a SyntaxError in older environments. Modern environments support top-level await."
      },
      "keyPoints": [
        "async makes a function return a Promise and enables the use of await inside it",
        "await pauses the async function until a Promise settles, returning the resolved value",
        "await does not block the entire program — only the enclosing async function pauses",
        "Use try/catch for error handling with async/await — cleaner than .catch() chains",
        "async/await is syntactic sugar — Promises still power everything underneath"
      ],
      "tryIt": "Rewrite this Promise chain as async/await: fetch('/api/data').then(r => r.json()).then(d => console.log(d)).catch(e => console.error(e)). Add a try/catch block. Then write an async function that waits for two separate fetch calls in sequence and prints both results."
    }
  },

  {
    "id": 47,
    "moduleId": 10,
    "moduleTitle": "Asynchronous JavaScript",
    "title": "Promise.all and Parallel Requests",
    "type": "lesson",
    "content": {
      "body": "When you use await sequentially on multiple Promises, each waits for the previous to complete. If each takes one second, three operations take three seconds. Often you do not need to wait — you can run them in parallel and collect all results when every one has finished.\n\n## Promise.all\n\nPromise.all() takes an array of Promises and returns a new Promise that resolves when all of them have resolved. The resolved value is an array of results in the same order as the input Promises. If any one Promise rejects, Promise.all() rejects immediately with that error.\n\n## Promise.allSettled\n\nPromise.allSettled() also takes an array of Promises but never rejects. It waits for all to settle (either resolve or reject) and returns an array of result objects, each with a status of 'fulfilled' or 'rejected' and a value or reason. Use this when you want all results regardless of individual failures.\n\n## Promise.race and Promise.any\n\nPromise.race() resolves or rejects with the first Promise to settle. Promise.any() resolves with the first Promise to fulfill, ignoring rejections unless all reject.",
      "code": "// Sequential — slow (waits one by one)\nasync function loadSequential() {\n  const user = await fetch('/api/user').then(r => r.json());    // waits\n  const posts = await fetch('/api/posts').then(r => r.json()); // waits again\n  return { user, posts };\n}\n\n// Parallel — fast (both start simultaneously)\nasync function loadParallel() {\n  const [user, posts] = await Promise.all([\n    fetch('/api/user').then(r => r.json()),\n    fetch('/api/posts').then(r => r.json())\n  ]);\n  return { user, posts };\n}\n\n// allSettled — get all results even if some fail\nasync function loadSafe(userIds) {\n  const results = await Promise.allSettled(\n    userIds.map(id => fetch(`/api/users/${id}`).then(r => r.json()))\n  );\n  const successful = results\n    .filter(r => r.status === 'fulfilled')\n    .map(r => r.value);\n  return successful;\n}",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "When you have multiple independent async operations, always use Promise.all() instead of sequential awaits. This can reduce total wait time from the sum of all delays to just the longest single delay."
      },
      "keyPoints": [
        "Sequential await runs operations one after another — total time is the sum of all",
        "Promise.all() runs Promises in parallel — total time is the longest single operation",
        "Promise.all() rejects immediately if any Promise rejects",
        "Promise.allSettled() waits for all to settle, collecting both successes and failures",
        "Promise.race() resolves/rejects with whichever Promise settles first"
      ],
      "tryIt": "Create three simulated async operations using Promises that resolve after 1, 2, and 3 seconds respectively. First run them sequentially with await and measure total time. Then run them with Promise.all() and measure again. Log the time difference."
    }
  },

  // =========================
  // Module 11: Working with APIs & Fetching Data
  // =========================

  {
    "id": 48,
    "moduleId": 11,
    "moduleTitle": "Working with APIs & Fetching Data",
    "title": "What Is an API?",
    "type": "lesson",
    "content": {
      "body": "An API (Application Programming Interface) is a defined way for two pieces of software to communicate. When your JavaScript application needs data — weather information, user profiles, product listings, exchange rates — it requests that data from an API.\n\n## Web APIs and REST\n\nA web API is a server that receives HTTP requests and returns data. The most common architectural style is REST (Representational State Transfer). A REST API exposes resources at URL paths. You interact with those resources using HTTP methods: GET to retrieve data, POST to create new data, PUT or PATCH to update existing data, DELETE to remove data.\n\nA REST API for a blog might expose: GET /api/posts (all posts), GET /api/posts/42 (one post), POST /api/posts (create a post), DELETE /api/posts/42 (delete a post).\n\n## JSON — The Data Format\n\nAPIs send and receive data in JSON (JavaScript Object Notation) — a text format that looks almost identical to a JavaScript object literal. Keys are always in double quotes. Values can be strings, numbers, booleans, null, arrays, or nested objects. JSON cannot contain functions, comments, or undefined.",
      "code": "// JSON is the standard API data format\nconst jsonString = `{\n  \"id\": 1,\n  \"name\": \"Alice\",\n  \"email\": \"alice@example.com\",\n  \"roles\": [\"admin\", \"user\"],\n  \"settings\": {\n    \"theme\": \"dark\",\n    \"notifications\": true\n  }\n}`;\n\n// Parse JSON string to JavaScript object\nconst user = JSON.parse(jsonString);\nconsole.log(user.name);           // 'Alice'\nconsole.log(user.roles[0]);       // 'admin'\nconsole.log(user.settings.theme); // 'dark'\n\n// Convert JavaScript object to JSON string (to send to an API)\nconst payload = JSON.stringify({ name: 'Bob', age: 30 });\nconsole.log(payload); // '{\"name\":\"Bob\",\"age\":30}'",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "JSON keys must be in double quotes — single quotes are not valid JSON. JavaScript's JSON.parse() converts a JSON string to a JavaScript object, and JSON.stringify() converts an object back to a JSON string."
      },
      "keyPoints": [
        "An API defines how software communicates — web APIs serve data over HTTP",
        "REST APIs use URL paths for resources and HTTP methods for actions",
        "GET retrieves data; POST creates; PUT/PATCH updates; DELETE removes",
        "JSON is the standard data format — it looks like a JS object but has stricter rules",
        "JSON.parse() converts a JSON string to a JavaScript object; JSON.stringify() does the reverse"
      ],
      "tryIt": "Visit https://jsonplaceholder.typicode.com/users/1 in your browser. You are looking at a JSON API response. Identify the fields, types, and nested objects. Then in the console, paste and parse the JSON with JSON.parse() and access three different nested values."
    }
  },

  {
    "id": 49,
    "moduleId": 11,
    "moduleTitle": "Working with APIs & Fetching Data",
    "title": "Using fetch()",
    "type": "lesson",
    "content": {
      "body": "fetch() is the browser's built-in function for making HTTP requests. It returns a Promise that resolves to a Response object when the server replies. The Response object contains the HTTP status and methods to read the body.\n\n## Two-Step Process\n\nUsing fetch() is a two-step process: first await the Response object, then await parsing the body. The Response object has a .json() method that reads the body and parses it as JSON — this is itself an async operation, so it must be awaited.\n\n## Checking Response Status\n\nfetch() only rejects on network failures (no internet, DNS failure). A 404 Not Found or 500 Server Error does not reject the Promise — it resolves with a Response object whose ok property is false and whose status is the HTTP error code. You must check response.ok yourself and handle HTTP errors explicitly.\n\n## Sending Data with POST\n\nTo send data, pass a configuration object as the second argument to fetch(). Set method to 'POST', headers to include 'Content-Type': 'application/json', and body to JSON.stringify(yourData).",
      "code": "// Basic GET request\nasync function getUser(id) {\n  try {\n    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);\n\n    if (!response.ok) {\n      throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n    }\n\n    const user = await response.json();\n    return user;\n  } catch (error) {\n    console.error('Fetch failed:', error.message);\n    throw error;\n  }\n}\n\n// POST request — sending data\nasync function createPost(title, body) {\n  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ title, body, userId: 1 })\n  });\n  return await response.json();\n}\n\n// Use it\ngetUser(1).then(user => console.log(user.name));",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "fetch() only rejects on network errors. A 404 or 500 response does NOT reject — it resolves with a Response where response.ok is false. Always check response.ok before parsing the body."
      },
      "keyPoints": [
        "fetch(url) returns a Promise that resolves to a Response object",
        "await response.json() is a second async step to parse the response body",
        "response.ok is false for 4xx and 5xx HTTP errors — fetch() does not reject for these",
        "Always check response.ok and throw an error if false",
        "POST requests need method, headers with Content-Type, and a JSON.stringify() body"
      ],
      "tryIt": "Write an async function fetchPosts() that fetches https://jsonplaceholder.typicode.com/posts, checks response.ok, parses the JSON, and returns the first 5 posts' titles as an array. Handle errors with try/catch. Call it and log the result."
    }
  },

  {
    "id": 50,
    "moduleId": 11,
    "moduleTitle": "Working with APIs & Fetching Data",
    "title": "Displaying API Data in the DOM",
    "type": "lesson",
    "content": {
      "body": "Fetching data is only half the work — you also need to display it on the page. The most common pattern in JavaScript web development is: fetch data from an API, then use the DOM API to create elements and insert the data into the page.\n\n## The Pattern\n\nA typical data-display flow: show a loading indicator, make the fetch call, on success hide the loading indicator and render the data, on error hide the loading indicator and show an error message.\n\n## Building DOM Elements Programmatically\n\ndocument.createElement() creates a new element. Set its textContent or innerHTML (be careful with innerHTML and user data — prefer textContent). Append it to a container with container.appendChild() or container.insertAdjacentHTML().\n\nFor lists of items, the common pattern is to map each data item to an HTML string, join them, and set the container's innerHTML — or create elements one by one and append them.",
      "code": "async function displayUsers() {\n  const container = document.getElementById('users');\n\n  // Show loading state\n  container.textContent = 'Loading...';\n\n  try {\n    const response = await fetch('https://jsonplaceholder.typicode.com/users');\n    if (!response.ok) throw new Error('Failed to load');\n    const users = await response.json();\n\n    // Clear loading and render\n    container.innerHTML = users\n      .slice(0, 5)\n      .map(user => `\n        <div class=\"user-card\">\n          <h3>${user.name}</h3>\n          <p>Email: ${user.email}</p>\n          <p>City: ${user.address.city}</p>\n        </div>\n      `)\n      .join('');\n\n  } catch (error) {\n    container.textContent = `Error: ${error.message}`;\n  }\n}\n\ndisplayUsers();",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Never use innerHTML with data that comes from users or external sources without sanitising it first. An attacker can inject malicious scripts (XSS). Use textContent for user-generated text, and only use innerHTML for trusted, controlled HTML strings."
      },
      "keyPoints": [
        "The pattern: show loading → fetch → hide loading → render data or show error",
        "Map API data to HTML strings using .map() and .join('') for clean rendering",
        "textContent is safe for displaying text; innerHTML injects raw HTML",
        "Never use innerHTML with unsanitised user input — use textContent instead",
        "Always handle the error case and show a meaningful message to the user"
      ],
      "tryIt": "Create an HTML page with a div id='container'. Write a JavaScript function that fetches https://jsonplaceholder.typicode.com/todos?_limit=10 and displays each todo as a list item, marking completed ones with a strikethrough style. Show 'Loading...' while fetching."
    }
  },

  {
    "id": 51,
    "moduleId": 11,
    "moduleTitle": "Working with APIs & Fetching Data",
    "title": "Authentication and Headers",
    "type": "lesson",
    "content": {
      "body": "Most real APIs require authentication — proof that you are allowed to access their data. The most common mechanism for JavaScript applications is the Bearer token: a secret string (often a JWT — JSON Web Token) that you include in every request's Authorization header.\n\n## API Keys\n\nSome APIs use a simpler API key — a unique identifier for your application. You include it as a query parameter or header. API keys should never be hardcoded in frontend JavaScript code that is visible to users — they should be stored as environment variables on your server and proxied.\n\n## Common Request Headers\n\n- Content-Type: application/json — tells the server you are sending JSON\n- Authorization: Bearer {token} — authenticates your request\n- Accept: application/json — tells the server what format you expect in return\n\n## Reusable fetch Wrapper\n\nInstead of repeating headers in every fetch call, create a wrapper function that includes default headers and error handling. This is a common pattern in real applications and reduces duplication significantly.",
      "code": "// Authenticated fetch wrapper\nasync function apiFetch(url, options = {}) {\n  const token = localStorage.getItem('authToken');\n\n  const config = {\n    headers: {\n      'Content-Type': 'application/json',\n      'Accept': 'application/json',\n      ...(token ? { Authorization: `Bearer ${token}` } : {}),\n      ...options.headers\n    },\n    ...options\n  };\n\n  const response = await fetch(url, config);\n\n  if (!response.ok) {\n    if (response.status === 401) throw new Error('Unauthorised — please log in');\n    if (response.status === 403) throw new Error('Forbidden — insufficient permission');\n    throw new Error(`HTTP ${response.status}`);\n  }\n\n  return response.json();\n}\n\n// Clean usage\nconst profile = await apiFetch('/api/me');\nconst data = await apiFetch('/api/data', {\n  method: 'POST',\n  body: JSON.stringify({ key: 'value' })\n});",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Never store API keys or tokens in source code that gets committed to a public repository. Use environment variables on the server side, and never expose secret keys in frontend JavaScript."
      },
      "keyPoints": [
        "Most production APIs require authentication via tokens or API keys",
        "Bearer tokens go in the Authorization header: 'Authorization: Bearer {token}'",
        "API keys should never be hardcoded in frontend code — use server-side proxying",
        "A fetch wrapper function centralises headers, auth, and error handling",
        "Handle 401 (unauthorised) and 403 (forbidden) differently from other errors"
      ],
      "tryIt": "Write a reusable apiFetch(url, options) function that: always sends Content-Type and Accept headers, reads an auth token from a variable, adds it as a Bearer token if present, checks response.ok and throws with the status code, and returns parsed JSON. Test it with a public API."
    }
  },

  // =========================
  // Module 12: Recursion & the Call Stack
  // =========================

  {
    "id": 52,
    "moduleId": 12,
    "moduleTitle": "Recursion & the Call Stack",
    "title": "What Is Recursion?",
    "type": "lesson",
    "content": {
      "body": "Recursion is when a function calls itself as part of its own execution. This sounds circular — and it would be infinite without a critical ingredient: the base case. The base case is the condition that stops the recursion, returning a result without making another call.\n\n## Why Recursion Exists\n\nSome problems have a naturally recursive structure — their solution depends on solving a smaller version of the same problem. A file system's folders contain other folders. A tree has nodes that each contain other nodes. Parsing nested expressions requires reading sub-expressions. For these problems, recursion expresses the solution directly and elegantly, while an iterative approach requires managing complex state manually.\n\n## The Two Parts of Every Recursive Function\n\n1. **Base case** — the simplest version of the problem that can be solved directly, without a recursive call. Without this, the function calls itself forever until the call stack overflows.\n2. **Recursive case** — the function calls itself with a slightly simpler input, moving toward the base case.\n\nAlways define the base case first. Ask: what is the smallest possible input where I know the answer immediately?",
      "code": "// Countdown — simple recursion example\nfunction countdown(n) {\n  // Base case — stop when we reach 0\n  if (n <= 0) {\n    console.log('Blast off!');\n    return;\n  }\n\n  // Do the work for this call\n  console.log(n);\n\n  // Recursive case — call with smaller input\n  countdown(n - 1);\n}\n\ncountdown(5);\n// 5, 4, 3, 2, 1, Blast off!\n\n// Summing an array recursively\nfunction sumArray(arr) {\n  if (arr.length === 0) return 0;           // base case\n  return arr[0] + sumArray(arr.slice(1));   // recursive case\n}\n\nconsole.log(sumArray([1, 2, 3, 4, 5])); // 15",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Every recursive function MUST have a base case that is eventually reached. Without a base case, the function calls itself forever, filling the call stack until JavaScript throws a 'Maximum call stack size exceeded' error."
      },
      "keyPoints": [
        "Recursion is when a function calls itself — always with a simpler version of the problem",
        "The base case stops recursion — it returns a result without making another call",
        "The recursive case calls the function again, moving closer to the base case",
        "Every recursive function must have a base case that is always reachable",
        "Recursion is ideal for tree structures, nested data, and divide-and-conquer algorithms"
      ],
      "tryIt": "Write a recursive function power(base, exponent) that computes base to the power of exponent. The base case is exponent === 0 (anything to the 0 is 1). The recursive case is base * power(base, exponent - 1). Test it with power(2, 10) and verify it gives 1024."
    }
  },

  {
    "id": 53,
    "moduleId": 12,
    "moduleTitle": "Recursion & the Call Stack",
    "title": "The Call Stack",
    "type": "lesson",
    "content": {
      "body": "The call stack is JavaScript's bookkeeping mechanism for tracking which function is currently executing and where to return when it finishes. Every time a function is called, a stack frame is pushed onto the call stack. When a function returns, its frame is popped off.\n\n## How Recursion Uses the Stack\n\nEach recursive call adds a new frame to the stack. That frame holds the local variables and the return address for that particular call. The frames accumulate as the recursion goes deeper. When the base case is finally reached, the last frame returns, then the second-to-last frame resumes and returns, and so on — the stack unwinds.\n\n## Stack Overflow\n\nThe call stack has a finite size. If a recursive function goes too deep (too many pending calls), the stack fills up and JavaScript throws 'RangeError: Maximum call stack size exceeded'. This is called a stack overflow. It happens when: there is no base case, the base case is never reached, or the input is too large for recursion.\n\nFor deep recursion on large inputs, iterative solutions or tail-call optimisation are safer.",
      "code": "// Tracing the call stack manually\nfunction factorial(n) {\n  console.log(`Called with n = ${n}`);\n  if (n <= 1) return 1;                    // base case\n  const result = n * factorial(n - 1);    // recursive call\n  console.log(`Returning ${result} for n = ${n}`);\n  return result;\n}\n\nfactorial(4);\n// Called with n = 4\n// Called with n = 3\n// Called with n = 2\n// Called with n = 1  ← base case reached\n// Returning 1 for n = 2  ← unwinding\n// Returning 2 for n = 3\n// Returning 6 for n = 4\n// Result: 24\n\n// Stack overflow example — no stopping condition\n// function forever() { return forever(); }\n// forever(); // RangeError: Maximum call stack size exceeded",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Add console.log() at the start and end of your recursive function while learning. Seeing each call printed as it opens and each return printed as it closes makes the stack growth and unwinding concrete and easy to follow."
      },
      "keyPoints": [
        "The call stack tracks which functions are executing — each call pushes a frame",
        "When a function returns, its frame is popped and execution resumes at the calling point",
        "Recursive calls add frames to the stack — they accumulate until the base case is reached",
        "Stack overflow occurs when the stack fills up — caused by too-deep recursion or missing base case",
        "The stack unwinds when the base case returns — each pending call resolves in reverse order"
      ],
      "tryIt": "Write a recursive function fibonacci(n) that returns the nth Fibonacci number (0, 1, 1, 2, 3, 5, 8...). Base cases: fibonacci(0) returns 0, fibonacci(1) returns 1. Recursive case: fibonacci(n - 1) + fibonacci(n - 2). Test it for n = 0 through 10. Why does fibonacci(40) become slow?"
    }
  },

  {
    "id": 54,
    "moduleId": 12,
    "moduleTitle": "Recursion & the Call Stack",
    "title": "Practical Recursion — Traversing Nested Data",
    "type": "lesson",
    "content": {
      "body": "The most practical real-world use of recursion is traversing nested or tree-structured data where the depth is unknown. A file system, a comment thread with replies, a category hierarchy, a JSON response with nested objects — these cannot be processed cleanly with a fixed number of for loops because you do not know how deep they go.\n\n## Pattern: Recursive Tree Traversal\n\nFor any tree-shaped structure, the recursive pattern is:\n1. Process the current node\n2. For each child of the current node, recursively apply the same function\n\nThe base case is implicit — when a node has no children, the forEach over children does nothing, and the recursion naturally stops.\n\n## Flattening Nested Arrays\n\nRecursion also handles flattening arrays of unknown depth. The built-in flat(Infinity) does this natively, but implementing it manually is a good exercise in recursive thinking.",
      "code": "// Nested category structure\nconst categories = {\n  name: 'Electronics',\n  children: [\n    {\n      name: 'Computers',\n      children: [\n        { name: 'Laptops', children: [] },\n        { name: 'Desktops', children: [] }\n      ]\n    },\n    {\n      name: 'Phones',\n      children: [\n        { name: 'Smartphones', children: [] }\n      ]\n    }\n  ]\n};\n\n// Recursive traversal — unknown depth, no problem\nfunction printAll(node, depth = 0) {\n  const indent = '  '.repeat(depth);\n  console.log(`${indent}${node.name}`);\n  node.children.forEach(child => printAll(child, depth + 1));\n}\n\nprintAll(categories);\n\n// Recursive flatten\nfunction flatten(arr) {\n  return arr.reduce((flat, item) =>\n    Array.isArray(item) ? flat.concat(flatten(item)) : flat.concat(item)\n  , []);\n}\nconsole.log(flatten([1, [2, [3, [4]]]])); // [1, 2, 3, 4]",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "The key insight for tree recursion: your function does not need to know how deep the tree is. It handles one node and delegates the rest to recursive calls. The structure of the data drives the recursion."
      },
      "keyPoints": [
        "Recursion excels at tree-structured or nested data of unknown depth",
        "The pattern: process current node, then recursively process each child",
        "The base case is often implicit — a node with no children produces no recursive calls",
        "Use the depth parameter (incremented each call) to track nesting level if needed",
        "Real-world uses: file systems, comment threads, category trees, DOM traversal"
      ],
      "tryIt": "Given a nested comment object where each comment has text and replies[] (which can also have replies), write a recursive function countAllComments(comment) that counts the comment itself plus all its nested replies at any depth. Test with a structure 3 levels deep."
    }
  },

  // =========================
  // Module 13: Error Handling & Defensive Programming
  // =========================

  {
    "id": 55,
    "moduleId": 13,
    "moduleTitle": "Error Handling & Defensive Programming",
    "title": "Types of Errors in JavaScript",
    "type": "lesson",
    "content": {
      "body": "Not all errors are the same, and treating them all the same way leads to poor error handling. JavaScript has distinct error types, each pointing to a different root cause.\n\n## SyntaxError\n\nThe code could not be parsed at all — the structure is invalid JavaScript. Missing brackets, unclosed strings, reserved words used as variable names. SyntaxErrors prevent the entire script from running — they are caught before execution begins.\n\n## ReferenceError\n\nAn attempt was made to use a name that does not exist in the current scope. Common causes: typos in variable names, using a variable before it is declared, accessing a variable outside its block scope.\n\n## TypeError\n\nAn operation was attempted on the wrong type of value. Calling a non-function, accessing a property of null or undefined, calling array methods on a string. TypeErrors are the most common runtime error in JavaScript.\n\n## RangeError\n\nA value falls outside the allowed range. The most common: call stack size exceeded (infinite recursion), creating an array with a negative length.\n\n## Logical Errors\n\nThe code runs without any error but produces wrong results. These are the hardest to find — no error message, just incorrect behaviour. They require careful testing and debugging.",
      "code": "// SyntaxError — caught before execution\n// const x = {;  // Invalid syntax\n\n// ReferenceError — name not found\ntry {\n  console.log(undeclaredVar);\n} catch (e) {\n  console.log(e instanceof ReferenceError); // true\n  console.log(e.message); // 'undeclaredVar is not defined'\n}\n\n// TypeError — wrong type of value\ntry {\n  null.toString();\n} catch (e) {\n  console.log(e instanceof TypeError); // true\n  console.log(e.message); // 'Cannot read properties of null'\n}\n\n// RangeError — value out of range\ntry {\n  new Array(-1);\n} catch (e) {\n  console.log(e instanceof RangeError); // true\n}\n\n// Check error type in catch\ntry {\n  JSON.parse('invalid');\n} catch (e) {\n  if (e instanceof SyntaxError) {\n    console.log('Bad JSON format');\n  }\n}",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Use instanceof in your catch block to check what type of error was thrown. This lets you handle different error types differently — for example, showing a user-friendly message for NetworkError but logging a ReferenceError for debugging."
      },
      "keyPoints": [
        "SyntaxError: invalid code structure — prevents the script from running at all",
        "ReferenceError: using an undeclared or out-of-scope name",
        "TypeError: using the wrong type — most common is accessing a property on null or undefined",
        "RangeError: value outside allowed range — most commonly stack overflow",
        "Logical errors produce no exception but wrong results — found only through testing"
      ],
      "tryIt": "Deliberately trigger each of the four runtime error types (ReferenceError, TypeError, RangeError, and SyntaxError) in a controlled way. Wrap each in try/catch, use instanceof to identify the type, and log a descriptive message explaining what went wrong."
    }
  },

  {
    "id": 56,
    "moduleId": 13,
    "moduleTitle": "Error Handling & Defensive Programming",
    "title": "try / catch / finally",
    "type": "lesson",
    "content": {
      "body": "The try/catch/finally statement is JavaScript's primary mechanism for handling runtime errors. It lets you attempt risky operations, catch any errors that arise, and run cleanup code regardless of what happened.\n\n## try — The Risky Block\n\nCode inside try is monitored. If any statement throws an error, execution jumps immediately to the catch block. Statements after the error in the try block do not run.\n\n## catch — The Recovery Block\n\nThe catch block receives the error object as its parameter. You can read the error's message, type, and stack trace. Use this block to recover gracefully — log the error, show a user-friendly message, retry the operation, or set a fallback value.\n\n## finally — The Cleanup Block\n\nfinallyalways runs, regardless of whether try succeeded or catch was needed. Use it for cleanup that must happen in both cases: closing a database connection, hiding a loading spinner, releasing a lock. finally even runs if try or catch contains a return statement — it runs before the function returns.",
      "code": "async function loadData(url) {\n  let loadingVisible = true;\n  showLoading(); // show spinner\n\n  try {\n    const response = await fetch(url);\n\n    if (!response.ok) {\n      throw new Error(`HTTP error: ${response.status}`);\n    }\n\n    const data = await response.json();\n    render(data);         // display on page\n    return data;\n\n  } catch (error) {\n    // Handle specific error types\n    if (error instanceof TypeError) {\n      showError('Network unavailable. Check your connection.');\n    } else {\n      showError(`Failed to load: ${error.message}`);\n    }\n    console.error('[loadData]', error);\n\n  } finally {\n    hideLoading(); // always hide spinner\n    loadingVisible = false;\n  }\n}\n\n// Nested error handling\nfunction parseJSON(text) {\n  try {\n    return JSON.parse(text);\n  } catch {\n    return null; // return null on invalid JSON\n  }\n}",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "finally always runs — even if try exits with return or throw, even if catch exits with throw. This makes it the correct place for cleanup code that absolutely must run in all circumstances."
      },
      "keyPoints": [
        "try monitors a block — on error, execution jumps to catch immediately",
        "catch receives the error object with message, name, and stack properties",
        "finally always runs after try/catch — ideal for cleanup like hiding spinners",
        "finally runs even when try or catch contains a return or throw statement",
        "You can nest try/catch — catch can throw to propagate the error to an outer handler"
      ],
      "tryIt": "Write a function readConfig(jsonString) that: uses try/catch to parse the JSON string, returns a default config object { theme: 'light', language: 'en' } if parsing fails, and uses finally to log 'config loading finished' in both cases. Test it with valid JSON, invalid JSON, and an empty string."
    }
  },

  {
    "id": 57,
    "moduleId": 13,
    "moduleTitle": "Error Handling & Defensive Programming",
    "title": "Custom Errors and Defensive Programming",
    "type": "lesson",
    "content": {
      "body": "Throwing your own errors is a key part of writing robust code. When your function receives invalid input or encounters a situation it cannot handle, it should throw an error with a clear, actionable message rather than silently returning undefined or producing incorrect results.\n\n## Custom Error Classes\n\nYou can create custom error types by extending the built-in Error class. This allows callers to catch specific error types and handle them appropriately, rather than catching all errors the same way.\n\n## Defensive Programming\n\nDefensive programming means anticipating failures and writing code that handles them explicitly. Core principles:\n- Validate inputs at the start of every function\n- Use guard clauses — check for invalid states and throw or return early\n- Never trust external data (API responses, user input, local storage)\n- Make assumptions explicit by failing loudly when they are violated\n\nDefensive code is more verbose than optimistic code, but it is far more predictable in production.",
      "code": "// Custom error class\nclass ValidationError extends Error {\n  constructor(field, message) {\n    super(message);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\n\nclass NotFoundError extends Error {\n  constructor(resource, id) {\n    super(`${resource} with id ${id} not found`);\n    this.name = 'NotFoundError';\n    this.statusCode = 404;\n  }\n}\n\n// Defensive function with input validation\nfunction createUser(name, age, email) {\n  if (!name || typeof name !== 'string') {\n    throw new ValidationError('name', 'Name must be a non-empty string');\n  }\n  if (!Number.isInteger(age) || age < 0 || age > 150) {\n    throw new ValidationError('age', 'Age must be an integer between 0 and 150');\n  }\n  if (!email?.includes('@')) {\n    throw new ValidationError('email', 'Email must be a valid email address');\n  }\n  return { name, age, email };\n}\n\n// Handle specific error types\ntry {\n  createUser('', 25, 'alice@example.com');\n} catch (e) {\n  if (e instanceof ValidationError) {\n    console.log(`Invalid ${e.field}: ${e.message}`);\n  } else {\n    throw e; // re-throw unexpected errors\n  }\n}",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Re-throw errors you cannot handle. If you catch an error in a catch block and it is not the type you expected, throw it again so it propagates to a handler that can deal with it. Never silently swallow unexpected errors."
      },
      "keyPoints": [
        "Throw errors with clear messages when a function receives invalid input or encounters bad state",
        "Custom error classes (extending Error) enable catching specific error types",
        "Defensive programming validates inputs early — guard clauses throw before logic runs",
        "Never trust external data — validate API responses, user inputs, and stored values",
        "Re-throw errors you cannot handle so they reach the appropriate handler"
      ],
      "tryIt": "Create a custom NetworkError class that extends Error and includes a statusCode property. Write a function fetchUser(id) that throws ValidationError if id is not a positive integer, throws NotFoundError if the user does not exist, and throws NetworkError if the fetch fails. Handle each error type differently in a try/catch."
    }
  },

  // =========================
  // Module 14: Object-Oriented Programming (OOP)
  // =========================

  {
    "id": 58,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming (OOP)",
    "title": "Why OOP Exists",
    "type": "lesson",
    "content": {
      "body": "As programs grow, two problems emerge. First, data and the functions that operate on that data become separated across different parts of the code — a user object here, a updateUser() function there, a validateUser() function somewhere else. They belong together, but there is no structure enforcing that. Second, when you need many objects with the same shape and behaviour (hundreds of user accounts, thousands of product listings), creating each one manually with an object literal does not scale.\n\nObject-Oriented Programming (OOP) solves both problems by bundling data and behaviour into a single unit — the object — and providing classes as blueprints for creating many objects of the same kind.\n\n## The Four Pillars of OOP\n\n**Encapsulation** — bundle data and the functions that operate on it into one unit, and control what is accessible from outside.\n\n**Inheritance** — new classes can extend existing ones, inheriting their behaviour and adding or overriding as needed.\n\n**Polymorphism** — different classes can be used through the same interface, with each implementing behaviour in its own way.\n\n**Abstraction** — expose only what is necessary; hide the implementation details.",
      "code": "// Without OOP — data and logic scattered\nconst userName = 'Alice';\nconst userEmail = 'alice@example.com';\nconst userBalance = 1000;\n\nfunction deposit(amount) { /* which user's balance? */ }\nfunction withdraw(amount) { /* and here? */ }\n\n// With OOP — data and logic together\nclass BankAccount {\n  constructor(owner, initialBalance) {\n    this.owner = owner;\n    this.balance = initialBalance;\n    this.transactions = [];\n  }\n\n  deposit(amount) {\n    this.balance += amount;\n    this.transactions.push({ type: 'deposit', amount });\n  }\n\n  withdraw(amount) {\n    if (amount > this.balance) throw new Error('Insufficient funds');\n    this.balance -= amount;\n    this.transactions.push({ type: 'withdrawal', amount });\n  }\n\n  getSummary() {\n    return `${this.owner}: $${this.balance}`;\n  }\n}\n\nconst account = new BankAccount('Alice', 1000);\naccount.deposit(500);\nconsole.log(account.getSummary()); // Alice: $1500",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "OOP is a design paradigm, not a requirement. JavaScript supports multiple styles — functional, procedural, and OOP. Use classes when they add clarity and structure. Simple utility functions do not need to be in classes."
      },
      "keyPoints": [
        "OOP bundles data and behaviour into objects, keeping related logic together",
        "Classes are blueprints — they define structure and behaviour for creating multiple objects",
        "The four pillars: Encapsulation, Inheritance, Polymorphism, Abstraction",
        "Encapsulation prevents external code from directly manipulating internal state",
        "Use OOP when you have multiple instances of the same kind of entity with shared behaviour"
      ],
      "tryIt": "Model a library system without OOP: create variables for a book's title, author, and checked-out status, and write functions to check it out and return it. Then model the same system with a Book class. Compare the two — which is easier to scale to 100 books?"
    }
  },

  {
    "id": 59,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming (OOP)",
    "title": "Classes in JavaScript",
    "type": "lesson",
    "content": {
      "body": "JavaScript classes, introduced in ES6, provide a clean syntax for creating objects from a template. Under the hood, they are built on JavaScript's prototype system, but you do not need to understand prototypes to use classes effectively.\n\n## Class Anatomy\n\nA class declaration uses the class keyword followed by the class name (by convention, PascalCase). Inside, the constructor method runs when a new object is created — it receives the initialisation arguments and sets up the object's properties using this. Other methods defined in the class body are shared across all instances.\n\n## The new Keyword\n\nCreating an object from a class uses new ClassName(args). The new keyword creates a fresh object, sets up its prototype chain, calls the constructor with the given arguments, and returns the new object.\n\n## Instance vs Class Members\n\nProperties set with this.property in the constructor belong to each individual instance — each object has its own copy. Methods defined directly in the class body are shared across all instances via the prototype — they are not duplicated for each object.",
      "code": "class Product {\n  constructor(name, price, category) {\n    this.name = name;\n    this.price = price;\n    this.category = category;\n    this.reviews = [];\n  }\n\n  addReview(rating, comment) {\n    this.reviews.push({ rating, comment });\n  }\n\n  getAverageRating() {\n    if (this.reviews.length === 0) return 0;\n    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);\n    return (total / this.reviews.length).toFixed(1);\n  }\n\n  toString() {\n    return `${this.name} — $${this.price} (${this.category})`;\n  }\n}\n\nconst laptop = new Product('ThinkPad X1', 1299, 'Computers');\nlaptop.addReview(5, 'Excellent build quality');\nlaptop.addReview(4, 'Great keyboard');\n\nconsole.log(laptop.toString());\nconsole.log(`Average rating: ${laptop.getAverageRating()}`);\n\nconst phone = new Product('Pixel 8', 699, 'Phones');\n// Each instance has its own reviews array\nconsole.log(phone.reviews.length); // 0",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Name classes with PascalCase (User, BankAccount, Product). This convention signals that the identifier is a class — a blueprint to be instantiated with new — not a regular variable or function."
      },
      "keyPoints": [
        "class defines a blueprint; new ClassName() creates an instance from it",
        "The constructor method runs when new is called — it sets up the object's initial state",
        "Methods defined in the class body are shared across all instances (via prototype)",
        "Properties set with this.name in the constructor belong to each individual instance",
        "Use PascalCase for class names — this distinguishes them from regular variables"
      ],
      "tryIt": "Create a Circle class with radius as a constructor parameter. Add methods: area() returning π × r², perimeter() returning 2 × π × r, and describe() returning a string like 'Circle with radius 5 and area 78.54'. Create three circles with different radii and compare their areas."
    }
  },

  {
    "id": 60,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming (OOP)",
    "title": "Inheritance with extends",
    "type": "lesson",
    "content": {
      "body": "Inheritance lets one class (the child or subclass) extend another (the parent or superclass). The child inherits all the parent's methods and can add new ones or override existing ones. This avoids duplicating shared logic across multiple classes.\n\n## The extends Keyword\n\nclass Child extends Parent {…} sets up the inheritance relationship. The child automatically has access to all the parent's methods.\n\n## super — Calling the Parent\n\nIn the child's constructor, you must call super() before using this. super() calls the parent's constructor, which sets up the inherited properties. If you skip this, JavaScript throws a ReferenceError when you try to access this.\n\nsuper is also used to call parent methods that have been overridden: super.methodName() inside a child method calls the parent version of that method.\n\n## When to Use Inheritance\n\nInheritance is appropriate when the relationship is genuinely 'is a': a Dog is an Animal, an Admin is a User, an ElectricCar is a Car. If the relationship is better described as 'has a' (a Car has an Engine), use composition instead.",
      "code": "class Animal {\n  constructor(name, species) {\n    this.name = name;\n    this.species = species;\n    this.energy = 100;\n  }\n\n  eat(food) {\n    this.energy += 20;\n    console.log(`${this.name} eats ${food}. Energy: ${this.energy}`);\n  }\n\n  describe() {\n    return `${this.name} is a ${this.species}`;\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name, 'Canis lupus familiaris'); // call parent constructor\n    this.breed = breed;\n  }\n\n  // New method\n  bark() {\n    this.energy -= 5;\n    console.log('Woof!');\n  }\n\n  // Override parent method\n  describe() {\n    return `${super.describe()} (${this.breed})`; // extend parent version\n  }\n}\n\nconst rex = new Dog('Rex', 'German Shepherd');\nrex.eat('kibble'); // inherited\nrex.bark();         // dog-specific\nconsole.log(rex.describe()); // overridden",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Prefer shallow inheritance hierarchies. More than two levels deep (Grandparent → Parent → Child) becomes hard to follow and fragile. If you find yourself going deeper, composition (objects that contain other objects) is almost always a better design."
      },
      "keyPoints": [
        "extends creates a parent-child class relationship — the child inherits all parent methods",
        "super() in the constructor calls the parent's constructor — required before using this",
        "Child classes can add new methods and override inherited ones",
        "super.methodName() in an overriding method calls the parent's version",
        "Use inheritance for 'is a' relationships; use composition for 'has a' relationships"
      ],
      "tryIt": "Create a Vehicle class with make, model, and speed properties and methods: accelerate(amount) and brake(amount). Then create an ElectricVehicle class that extends Vehicle, adding a batteryLevel property and methods: charge() and getBatteryStatus(). Override toString() in both to show relevant details."
    }
  },

  {
    "id": 61,
    "moduleId": 14,
    "moduleTitle": "Object-Oriented Programming (OOP)",
    "title": "Encapsulation and Private Fields",
    "type": "lesson",
    "content": {
      "body": "Encapsulation is about controlling access to an object's internal state. If all properties are public — readable and writable from anywhere — other code can put the object in invalid states. Encapsulation prevents this by hiding internal data and exposing it only through controlled methods.\n\n## Private Fields with #\n\nModern JavaScript (ES2022+) supports true private fields using the # prefix. A private field can only be accessed inside the class — any attempt to access it from outside throws a SyntaxError. This is enforced by the language, not just by convention.\n\n## Getters and Setters\n\ngetters (get propertyName()) and setters (set propertyName(value)) let you expose controlled access to private fields. A getter is called like a property (no parentheses). A setter is called when you assign to the property name. This lets you add validation, logging, or computed values while keeping the external interface clean.",
      "code": "class BankAccount {\n  #balance;          // private field\n  #owner;\n  #transactionLog;\n\n  constructor(owner, initialBalance) {\n    if (initialBalance < 0) throw new Error('Balance cannot be negative');\n    this.#owner = owner;\n    this.#balance = initialBalance;\n    this.#transactionLog = [];\n  }\n\n  // Getter — read-only access\n  get balance() { return this.#balance; }\n  get owner() { return this.#owner; }\n\n  deposit(amount) {\n    if (amount <= 0) throw new Error('Deposit must be positive');\n    this.#balance += amount;\n    this.#transactionLog.push({ type: 'deposit', amount, date: new Date() });\n  }\n\n  withdraw(amount) {\n    if (amount > this.#balance) throw new Error('Insufficient funds');\n    this.#balance -= amount;\n    this.#transactionLog.push({ type: 'withdrawal', amount, date: new Date() });\n  }\n}\n\nconst account = new BankAccount('Alice', 500);\naccount.deposit(200);\nconsole.log(account.balance); // 700\n// account.#balance = 1000000; // SyntaxError — private!",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "Private fields (with #) are enforced by the language. The older convention of naming private fields with _ (like this._balance) was just a naming hint — nothing actually prevented external access. Use # for true privacy in modern JavaScript."
      },
      "keyPoints": [
        "Private fields (prefixed with #) can only be accessed inside the class",
        "Attempting to access a private field from outside the class throws a SyntaxError",
        "Getters (get prop()) expose read access to private fields without direct access",
        "Setters (set prop(value)) allow assignment while running validation logic",
        "Encapsulation prevents external code from putting objects into invalid states"
      ],
      "tryIt": "Create a Temperature class with a private #celsius field. Add a constructor, a celsius getter, and a fahrenheit getter that converts (C × 9/5 + 32). Add a celsius setter that validates the input is above absolute zero (-273.15°C). Test the getters and the validation."
    }
  },

  // =========================
  // Module 15: Modules & Code Organization
  // =========================

  {
    "id": 62,
    "moduleId": 15,
    "moduleTitle": "Modules & Code Organization",
    "title": "Why Modules Exist",
    "type": "lesson",
    "content": {
      "body": "Before JavaScript modules existed, all JavaScript on a page shared one global scope. Every script tag added its code to that same namespace. Variable names from different files could collide. Dependencies had to be loaded in exactly the right order. Code from third-party libraries could overwrite your variables without warning. This worked for small scripts but became unmanageable for large applications.\n\nModules solve this by giving each file its own private scope. Variables, functions, and classes defined inside a module are not visible to the outside world unless explicitly exported. Other modules import only what they need from specific files. Everything is explicit — no hidden global dependencies, no name collisions.\n\n## The ES Modules Standard\n\nES Modules (ESM) is the official JavaScript module system, introduced in ES2015 and now supported in all modern browsers and Node.js. It uses export to make things available to other modules and import to consume them.\n\nThe older CommonJS system (require() / module.exports) is still used in older Node.js code and some build tools. You will encounter both, but ESM is the standard for new code.",
      "code": "// Without modules — one big file, shared globals\n// user.js script (loaded first)\nvar currentUser = null;\nfunction setUser(u) { currentUser = u; }\n\n// shop.js script (loaded second)\nvar currentUser = 'overwritten'; // collision!\n\n// With modules — each file has private scope\n// user.js\nexport let currentUser = null;\nexport function setUser(u) { currentUser = u; }\n\n// shop.js\nimport { currentUser, setUser } from './user.js';\n// No collision — shop.js imports what it needs\n\n// main.js\nimport { setUser } from './user.js';\nsetUser({ name: 'Alice' });\nconsole.log('User set');",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "In HTML, add type='module' to your script tag to enable ES Module syntax: <script type='module' src='app.js'></script>. Module scripts are automatically deferred and have their own scope — they do not add anything to window."
      },
      "keyPoints": [
        "Before modules, all JavaScript shared one global scope — leading to collisions and hidden dependencies",
        "ES Modules give each file a private scope — nothing is global unless exported",
        "export makes values available; import consumes them — all dependencies are explicit",
        "Module files are loaded with <script type='module'> in browsers",
        "ESM is the modern standard; CommonJS (require/module.exports) is older Node.js style"
      ],
      "tryIt": "Create two files: math.js with exported functions add, subtract, multiply. Create main.js that imports all three and uses them. Test that a variable declared in math.js without export is not accessible in main.js. Run with Node.js using the .mjs extension or a package.json with \"type\": \"module\"."
    }
  },

  {
    "id": 63,
    "moduleId": 15,
    "moduleTitle": "Modules & Code Organization",
    "title": "Named and Default Exports",
    "type": "lesson",
    "content": {
      "body": "A module can export values in two ways: named exports (multiple, referenced by name) and a default export (one per module, imported without braces). Understanding both and when to use each is fundamental to working with JavaScript modules.\n\n## Named Exports\n\nNamed exports use the export keyword before a declaration, or a single export {} statement at the end of a file. Imports must use the exact same name in curly braces. Named exports encourage clarity — the consumer must know what they are importing, and the name appears in both files, making the relationship traceable.\n\n## Default Export\n\nEach module can have at most one default export: export default value. The importing file gives it any name it wants — no curly braces needed. Default exports are common for the main thing a module provides: a class, a function, or a configuration object.\n\n## Importing with Aliases\n\nYou can rename named imports on import: import { originalName as alias } from './module.js'. This resolves conflicts when two modules export the same name.",
      "code": "// math.js — named exports\nexport const PI = 3.14159;\n\nexport function add(a, b) { return a + b; }\nexport function subtract(a, b) { return a - b; }\nexport function multiply(a, b) { return a * b; }\n\n// logger.js — default export\nexport default function log(level, message) {\n  console.log(`[${level.toUpperCase()}] ${message}`);\n}\n\n// app.js — importing both\nimport log from './logger.js';          // default — any name\nimport { add, PI } from './math.js';    // named — exact names\nimport { subtract as minus } from './math.js'; // alias\n\nlog('info', `PI is approximately ${PI}`);\nconsole.log(add(2, 3));   // 5\nconsole.log(minus(10, 4)); // 6\n\n// Import everything from a module as a namespace object\nimport * as Math from './math.js';\nconsole.log(Math.PI, Math.multiply(3, 4));",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Prefer named exports for most things — they make dependencies explicit and refactoring tools can track them automatically. Use default exports for the primary export of a module (the main class or function the module is 'about')."
      },
      "keyPoints": [
        "Named exports: export const x = ..., imported as import { x } from './file.js'",
        "Default export: export default value, imported as import anything from './file.js'",
        "One default export per module; unlimited named exports",
        "Import aliases: import { name as alias } — resolves naming conflicts",
        "import * as Namespace from './file.js' imports everything as a namespace object"
      ],
      "tryIt": "Create a string-utils.js module with named exports for capitalise(str), truncate(str, max), and wordCount(str). Add a default export for a function format(str) that applies all three utilities. Import and use all of them in a main file, using an alias for at least one named export."
    }
  },

  {
    "id": 64,
    "moduleId": 15,
    "moduleTitle": "Modules & Code Organization",
    "title": "Project Structure Best Practices",
    "type": "lesson",
    "content": {
      "body": "How you organise files and folders is as important as how you write individual functions. Good structure makes a codebase navigable for new team members, encourages separation of concerns, and scales as the project grows.\n\n## Feature-Based Structure\n\nGroup files by feature (what they do) rather than by type (what they are). Instead of a flat folders/components/, folders/utils/, folders/services/ structure, organise by feature: folders/auth/ contains auth's components, utils, and services together. This keeps related code collocated — when you work on a feature, everything you need is in one place.\n\n## Barrel Files (index.js)\n\nA barrel file is an index.js in a folder that re-exports everything from the files in that folder. This lets consumers import from the folder path instead of knowing which specific file contains what: import { login, logout } from './auth' instead of import { login } from './auth/authService' and import { logout } from './auth/authUtils'.\n\n## Separation of Concerns\n\nEach module should have one clear responsibility. A module that fetches data, transforms it, and renders it has three responsibilities — split it. Modules that do one thing are easier to test, replace, and reason about.",
      "code": "// Good project structure\n/*\nsrc/\n  features/\n    auth/\n      index.js       ← barrel: re-exports login, logout, AuthGuard\n      authService.js ← API calls for auth\n      authHelpers.js ← utility functions\n      AuthGuard.js   ← component\n    products/\n      index.js\n      productService.js\n      ProductList.js\n  shared/\n    api.js         ← shared fetch wrapper\n    logger.js      ← shared logging\n  main.js\n*/\n\n// Barrel file: auth/index.js\nexport { login, logout, refreshToken } from './authService.js';\nexport { validateToken } from './authHelpers.js';\nexport { default as AuthGuard } from './AuthGuard.js';\n\n// Consumer — clean import\nimport { login, AuthGuard } from './features/auth/index.js';\n// Or even shorter (Node resolves index.js automatically)\nimport { login, AuthGuard } from './features/auth';",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "When in doubt, keep it simple. A flat structure works fine for small projects. Add folders when you find yourself scrolling past 8-10 files to find what you need. Structure should solve actual problems, not anticipated ones."
      },
      "keyPoints": [
        "Feature-based structure keeps related code collocated — better than type-based grouping",
        "Barrel files (index.js) re-export a folder's public API for clean external imports",
        "Each module should have one clear responsibility — split modules that do multiple things",
        "Avoid deep nesting — more than 3 levels of folders makes paths unwieldy",
        "Consistent naming conventions across files and exports make the codebase predictable"
      ],
      "tryIt": "Restructure a single-file app into modules. Take a JavaScript file that handles user authentication, product listing, and cart management. Extract each concern into a separate module file. Create a barrel index.js that re-exports the public API of each. Update the main file to use the new imports."
    }
  },

  // =========================
  // Module 16: Testing Fundamentals
  // =========================

  {
    "id": 65,
    "moduleId": 16,
    "moduleTitle": "Testing Fundamentals",
    "title": "Why Testing Matters",
    "type": "lesson",
    "content": {
      "body": "Every developer tests their code — the question is whether they do it manually and once, or automatically and repeatedly. Manual testing means opening the browser, clicking through scenarios, and verifying results by eye. This takes time, scales poorly, and gives no protection against regressions — bugs that are accidentally reintroduced when you change unrelated code.\n\nAutomated tests are code that calls your code and verifies the results. They run in milliseconds, can be run after every change, and build a safety net that grows with the codebase. When tests pass, you have confidence that existing behaviour is preserved. When a test fails, you know exactly what broke and where.\n\n## The Business Case for Testing\n\nBugs in production cost more than bugs caught in development. Testing is not a luxury — it is a professional practice that reduces debugging time, enables confident refactoring, and produces more maintainable software. Codebases without tests are fragile: every change risks breaking something unknown.\n\n## Testing in JavaScript\n\nThe dominant testing frameworks in JavaScript are Jest (from Meta, most popular), Vitest (similar API, faster, works with Vite), and Mocha with Chai. All follow the same fundamental patterns.",
      "code": "// A function we want to test\nfunction add(a, b) {\n  return a + b;\n}\n\nfunction divide(a, b) {\n  if (b === 0) throw new Error('Division by zero');\n  return a / b;\n}\n\n// Simple manual assertion testing (no framework)\nfunction assert(condition, message) {\n  if (!condition) throw new Error(`FAIL: ${message}`);\n  console.log(`PASS: ${message}`);\n}\n\nassert(add(2, 3) === 5, 'add(2, 3) should equal 5');\nassert(add(0, 0) === 0, 'add(0, 0) should equal 0');\nassert(add(-1, 1) === 0, 'add(-1, 1) should equal 0');\n\ntry {\n  divide(10, 0);\n  assert(false, 'divide by zero should throw');\n} catch (e) {\n  assert(e.message === 'Division by zero', 'Error message should match');\n}",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Start writing tests from day one, even simple ones. A codebase with 20% test coverage is easier to work on than one with 0%. The habit of writing tests as you build features is far easier to establish early than to retrofit later."
      },
      "keyPoints": [
        "Automated tests verify your code runs correctly and protect against future regressions",
        "Manual testing is slow, unreliable, and does not scale — automated tests run in milliseconds",
        "Tests enable confident refactoring — if tests pass after a change, behaviour is preserved",
        "Jest and Vitest are the dominant JavaScript testing frameworks",
        "A test is just code that calls your code and verifies the result"
      ],
      "tryIt": "Without a testing framework, write a test suite as a collection of assert() calls for a function isLeapYear(year) that returns true for leap years (divisible by 4, not by 100, unless also by 400). Test: 2024 (true), 1900 (false), 2000 (true), 2023 (false), 1600 (true)."
    }
  },

  {
    "id": 66,
    "moduleId": 16,
    "moduleTitle": "Testing Fundamentals",
    "title": "Writing Tests with Jest",
    "type": "lesson",
    "content": {
      "body": "Jest is the most widely used JavaScript testing framework. It provides a test runner, assertion library, mocking utilities, and coverage reporting in one package. You describe tests with human-readable labels, and Jest tells you which pass and which fail with clear output.\n\n## Test Structure — Arrange, Act, Assert\n\nEvery test follows the same three-phase pattern:\n1. **Arrange** — set up the inputs and initial state\n2. **Act** — call the function being tested\n3. **Assert** — verify the result matches your expectation\n\nKeeping this structure explicit makes tests easy to read and diagnose.\n\n## describe and test\n\ntest() (or its alias it()) defines a single test case. describe() groups related tests under a shared label. Nesting describe() blocks creates a hierarchy that maps to your module structure. Jest runs all test() blocks and reports results with the full path from the outermost describe() to the individual test.",
      "code": "// calculator.js — the code we're testing\nexport function add(a, b) { return a + b; }\nexport function divide(a, b) {\n  if (b === 0) throw new Error('Cannot divide by zero');\n  return a / b;\n}\n\n// calculator.test.js — Jest tests\nimport { add, divide } from './calculator.js';\n\ndescribe('add()', () => {\n  test('adds two positive numbers', () => {\n    // Arrange\n    const a = 2, b = 3;\n    // Act\n    const result = add(a, b);\n    // Assert\n    expect(result).toBe(5);\n  });\n\n  test('handles negative numbers', () => {\n    expect(add(-1, 1)).toBe(0);\n    expect(add(-5, -3)).toBe(-8);\n  });\n});\n\ndescribe('divide()', () => {\n  test('divides two numbers correctly', () => {\n    expect(divide(10, 2)).toBe(5);\n  });\n\n  test('throws when dividing by zero', () => {\n    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');\n  });\n});",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Name your tests as specific statements about expected behaviour: 'returns 0 for an empty array', 'throws ValidationError when name is empty'. A failing test's name should tell you immediately what is broken without reading the test body."
      },
      "keyPoints": [
        "test() (or it()) defines a single test case with a label and a function body",
        "describe() groups related tests — use it to mirror the structure of your module",
        "The Arrange-Act-Assert pattern keeps tests readable and diagnosable",
        "expect(value).toBe(expected) is the most common assertion — strict equality",
        "expect(() => fn()).toThrow() tests that a function throws an error"
      ],
      "tryIt": "Install Jest (npm install --save-dev jest). Write a module with functions validateEmail(email) and formatCurrency(amount, currency). Write test files for both with at least 4 test cases each, covering valid inputs, invalid inputs, and edge cases. Run jest and verify all tests pass."
    }
  },

  {
    "id": 67,
    "moduleId": 16,
    "moduleTitle": "Testing Fundamentals",
    "title": "What to Test and What Not To",
    "type": "lesson",
    "content": {
      "body": "Not everything should be tested, and testing the wrong things creates a brittle test suite that breaks whenever implementation details change, even when behaviour is correct.\n\n## Test Behaviour, Not Implementation\n\nTest what a function does — its inputs, outputs, and side effects — not how it does it internally. If you test that a particular internal variable holds a value, refactoring that code (while preserving the output) will break your tests. This is brittle. Test the public interface.\n\n## What to Test\n\n- Pure functions that compute a result from inputs\n- Functions that throw errors on invalid input\n- Functions that transform data (map, filter, format)\n- Critical business logic (pricing, validation, authentication)\n- Edge cases: empty arrays, null inputs, maximum values, empty strings\n\n## What Not to Test\n\n- Implementation details that are not part of the public API\n- Third-party libraries (test your use of them, not their internal logic)\n- Simple getters and setters with no logic\n- Code that is just wiring (calling one function then another)\n\n## Testing Edge Cases\n\nMost bugs hide in edge cases: what happens when the input is empty? What if the value is 0? What if the list has only one item? What if the string contains special characters? Test these explicitly.",
      "code": "// A function to test thoroughly\nfunction calculateDiscount(price, discountPercent, memberLevel) {\n  if (price < 0) throw new Error('Price cannot be negative');\n  if (discountPercent < 0 || discountPercent > 100) {\n    throw new RangeError('Discount must be between 0 and 100');\n  }\n\n  let discount = discountPercent / 100;\n  if (memberLevel === 'premium') discount += 0.05; // bonus 5%\n  if (memberLevel === 'vip') discount += 0.10;     // bonus 10%\n\n  const discountedPrice = price * (1 - discount);\n  return Math.max(0, Number(discountedPrice.toFixed(2)));\n}\n\n// Good tests — testing BEHAVIOUR\ndescribe('calculateDiscount', () => {\n  test('applies discount correctly', () =>\n    expect(calculateDiscount(100, 20, 'standard')).toBe(80));\n  test('adds premium member bonus', () =>\n    expect(calculateDiscount(100, 10, 'premium')).toBe(85));\n  test('never returns negative price', () =>\n    expect(calculateDiscount(10, 100, 'vip')).toBe(0));\n  test('throws for negative price', () =>\n    expect(() => calculateDiscount(-5, 10, 'standard')).toThrow());\n  test('throws for invalid discount', () =>\n    expect(() => calculateDiscount(100, 110, 'standard')).toThrow(RangeError));\n});",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "Edge cases are where bugs live. Before writing tests, ask: what is the minimum valid input? Maximum? What if a collection is empty? What if a required value is null? What happens at the boundary (exactly at the limit, just above, just below)?"
      },
      "keyPoints": [
        "Test behaviour (inputs and outputs) not implementation details (internal variables)",
        "Tests against implementation details break when you refactor — even when behaviour is correct",
        "Always test edge cases: empty inputs, zero, null, maximum values, boundary conditions",
        "Focus testing effort on critical business logic and code that handles data transformation",
        "Avoid testing third-party library internals — test your code's use of the library"
      ],
      "tryIt": "Write a function paginate(items, page, pageSize) that returns the correct slice of items for the given page. Then write a test suite covering: normal operation, page 1, last page, single-item array, empty array, and a page number beyond the end of the data."
    }
  },

  // =========================
  // Module 17: Tooling & Professional Workflow
  // =========================

  {
    "id": 68,
    "moduleId": 17,
    "moduleTitle": "Tooling & Professional Workflow",
    "title": "npm and package.json",
    "type": "lesson",
    "content": {
      "body": "npm (Node Package Manager) is the world's largest software registry and the standard tool for managing JavaScript project dependencies. Every professional JavaScript project starts with npm init, which creates a package.json — the project's configuration file and dependency manifest.\n\n## package.json Structure\n\nThe package.json file documents your project: its name, version, description, main entry point, and — most importantly — its dependencies. The dependencies field lists packages required to run the application. devDependencies lists packages only needed during development — testing frameworks, linters, build tools. Production deployments skip devDependencies.\n\n## npm Scripts\n\nThe scripts field defines shortcut commands. npm start, npm test, npm run build are conventional entry points. These scripts can run any command — starting a dev server, running tests, checking for linting errors, building for production. Consistent script names mean any developer on any project knows how to start and test it.\n\n## Lock Files\n\nnpm creates a package-lock.json that records the exact version of every installed package and its dependencies. Commit this file — it ensures every developer and every CI server installs the exact same package versions, eliminating 'works on my machine' problems.",
      "code": "// package.json — typical structure\n{\n  \"name\": \"my-app\",\n  \"version\": \"1.0.0\",\n  \"description\": \"A professional JavaScript application\",\n  \"main\": \"src/index.js\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"start\": \"node src/index.js\",\n    \"dev\": \"node --watch src/index.js\",\n    \"test\": \"jest\",\n    \"test:coverage\": \"jest --coverage\",\n    \"lint\": \"eslint src/\",\n    \"format\": \"prettier --write src/\",\n    \"build\": \"vite build\"\n  },\n  \"dependencies\": {\n    \"express\": \"^4.18.0\"\n  },\n  \"devDependencies\": {\n    \"jest\": \"^29.0.0\",\n    \"eslint\": \"^8.0.0\",\n    \"prettier\": \"^3.0.0\"\n  }\n}\n\n// Common npm commands\n// npm install         — install all dependencies\n// npm install express — add a dependency\n// npm install -D jest — add a devDependency\n// npm run test        — run the test script\n// npm run lint        — run the lint script",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Always commit package-lock.json to version control. Never commit node_modules/ — add it to .gitignore. Committing the lock file ensures reproducible installs; committing node_modules adds thousands of files that do not belong in your repository."
      },
      "keyPoints": [
        "npm manages project dependencies and scripts — the foundation of every JS project",
        "package.json is the project manifest: name, version, dependencies, and scripts",
        "dependencies run in production; devDependencies are development-only",
        "Scripts in package.json standardise how projects are started, tested, and built",
        "package-lock.json locks dependency versions — commit it, never commit node_modules"
      ],
      "tryIt": "Create a new project with npm init -y. Add a scripts section with start, test, and lint commands. Install jest as a devDependency. Write a simple function in src/math.js and a test in src/math.test.js. Configure the test script to run jest and verify npm test works."
    }
  },

  {
    "id": 69,
    "moduleId": 17,
    "moduleTitle": "Tooling & Professional Workflow",
    "title": "ESLint and Prettier",
    "type": "lesson",
    "content": {
      "body": "Two categories of code quality tools are standard in every professional JavaScript project: linters and formatters. They serve different purposes and work best together.\n\n## ESLint — The Linter\n\nA linter analyses your code statically — without running it — and reports problems. ESLint catches: using variables before they are declared, calling functions that do not exist, unreachable code, incorrect equality operators (== instead of ===), missing return statements, and hundreds of other potential bugs and style issues. It can even auto-fix some problems.\n\nESLint is configured in a .eslintrc.json or eslint.config.js file. You choose which rules to enforce or extend a community preset like 'eslint:recommended'.\n\n## Prettier — The Formatter\n\nPrettier is an opinionated code formatter. It has almost no configuration — it makes all formatting decisions for you, based on a minimal set of options (line length, quote style, semicolons). The benefit is eliminating all formatting debates from code reviews. Prettier is not a linter — it does not catch bugs, only formats code.\n\n## Editor Integration\n\nBoth tools integrate with VS Code and other editors. Configure 'format on save' to run Prettier automatically. Configure 'lint on save' to underline ESLint errors as you type. These integrations mean you get feedback without ever running a command.",
      "code": "// .eslintrc.json\n{\n  \"env\": {\n    \"browser\": true,\n    \"es2022\": true,\n    \"node\": true\n  },\n  \"extends\": [\"eslint:recommended\"],\n  \"parserOptions\": {\n    \"ecmaVersion\": 2022,\n    \"sourceType\": \"module\"\n  },\n  \"rules\": {\n    \"eqeqeq\": \"error\",\n    \"no-console\": \"warn\",\n    \"no-unused-vars\": \"error\",\n    \"prefer-const\": \"error\"\n  }\n}\n\n// .prettierrc\n{\n  \"semi\": true,\n  \"singleQuote\": true,\n  \"printWidth\": 80,\n  \"tabWidth\": 2,\n  \"trailingComma\": \"es5\"\n}\n\n// Running tools\n// npx eslint src/         — check for issues\n// npx eslint src/ --fix   — auto-fix where possible\n// npx prettier --write src/  — format all files",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Set up both ESLint and Prettier from day one of a new project. Retrofitting them to an existing codebase produces hundreds of warnings and requires a dedicated cleanup effort. Starting clean is far easier."
      },
      "keyPoints": [
        "ESLint is a linter — it analyses code for potential bugs and rule violations without running it",
        "Prettier is a formatter — it enforces consistent code style automatically",
        "ESLint catches bugs; Prettier handles formatting — they do different jobs",
        "Configure eslint:recommended as a base rule set and add project-specific rules",
        "Install VS Code extensions for both to get real-time feedback while coding"
      ],
      "tryIt": "Install eslint and prettier in a project. Create config files for both. Write code with deliberate style issues (double quotes, missing semicolons, unused variables, var instead of const). Run ESLint and identify all warnings. Run Prettier and observe what it changes automatically."
    }
  },

  {
    "id": 70,
    "moduleId": 17,
    "moduleTitle": "Tooling & Professional Workflow",
    "title": "Build Tools and Vite",
    "type": "lesson",
    "content": {
      "body": "Modern JavaScript applications typically cannot be served as raw source files — they use ESM imports, JSX, TypeScript, or features not supported in older browsers. Build tools process your source code and produce optimised output suitable for production.\n\n## What Build Tools Do\n\n**Bundling** — combining many JavaScript files into one (or a few) files, eliminating the overhead of hundreds of network requests.\n\n**Transpilation** — converting modern JavaScript (or TypeScript) into versions compatible with older browsers.\n\n**Minification** — removing whitespace, shortening variable names, and compressing the output to reduce file size.\n\n**Tree shaking** — detecting and removing exported code that is never imported anywhere, reducing bundle size.\n\n## Vite — The Modern Standard\n\nVite (French for 'fast') is the dominant modern build tool. During development, it serves files using native ES Modules — no bundling needed, which makes the development server start instantly regardless of project size. For production builds, it uses Rollup to produce optimised, minified bundles.",
      "code": "// Initialize a Vite project\n// npm create vite@latest my-app -- --template vanilla\n\n// vite.config.js\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({\n  root: 'src',\n  build: {\n    outDir: '../dist',\n    minify: 'terser',\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vendor: ['lodash', 'axios']  // split vendor code\n        }\n      }\n    }\n  },\n  server: {\n    port: 3000,\n    open: true     // open browser on start\n  }\n});\n\n// Common Vite commands\n// npm run dev    — start dev server with HMR\n// npm run build  — create optimised production build\n// npm run preview — preview the production build locally",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "For new projects, start with Vite. Run npm create vite@latest and choose your template. You get a properly configured development environment with hot module replacement, TypeScript support, and optimised builds without manual configuration."
      },
      "keyPoints": [
        "Build tools bundle, transpile, and minify source code for production deployment",
        "Bundling combines many files to reduce network requests; minification reduces file size",
        "Tree shaking removes unused exports — keeps bundles as small as possible",
        "Vite serves unbundled ESM in development for instant startup, then bundles for production",
        "npm run dev starts the development server; npm run build creates the production output"
      ],
      "tryIt": "Create a new Vite project using npm create vite@latest. Explore the generated folder structure. Start the dev server with npm run dev. Modify the main JavaScript file and observe hot module replacement updating the browser instantly. Run npm run build and inspect the dist/ folder."
    }
  },

  {
    "id": 71,
    "moduleId": 17,
    "moduleTitle": "Tooling & Professional Workflow",
    "title": "Git and Version Control",
    "type": "lesson",
    "content": {
      "body": "Git is the universal version control system for software development. It tracks every change to every file, lets you work on experimental features without affecting the main codebase, and enables collaboration across teams of any size. No professional software project runs without version control.\n\n## Core Concepts\n\n**Repository** — a directory tracked by Git, containing your project and its full history.\n\n**Commit** — a saved snapshot of the project at a point in time, with a description of what changed.\n\n**Branch** — a parallel version of the codebase. You create a branch to work on a feature, make commits on that branch, and then merge it back when the feature is complete. The main branch (conventionally main) stays clean and deployable.\n\n**Remote** — a copy of the repository on another server (GitHub, GitLab, Bitbucket). Push to share your changes, pull to receive others' changes.\n\n## The Professional Workflow\n\nPull latest → Create feature branch → Make commits → Open a pull request → Code review → Merge to main. This workflow, combined with automated tests that run on every push, is the foundation of professional software delivery.",
      "code": "# Initialise a new repository\ngit init\ngit add .gitignore README.md\ngit commit -m \"Initial project setup\"\n\n# Create and switch to a feature branch\ngit checkout -b feature/user-authentication\n\n# Work on the feature, then commit\ngit add src/auth/\ngit commit -m \"Add login and logout functionality\"\ngit commit -m \"Add JWT token validation\"\n\n# Push the branch to remote (GitHub)\ngit push origin feature/user-authentication\n# Open a pull request on GitHub, get review, then merge\n\n# Back on main, pull the merged changes\ngit checkout main\ngit pull origin main\n\n# Common daily commands\n# git status       — see what has changed\n# git diff         — see exact line changes\n# git log --oneline — see commit history\n# git stash        — temporarily save uncommitted changes",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Write commit messages that describe why, not just what. 'Fix bug' is useless. 'Fix login redirect failing on Safari due to cookie SameSite policy' is useful. Future you — and your teammates — will thank you."
      },
      "keyPoints": [
        "Git tracks all changes to your code — you can always go back to any previous state",
        "Commit often with clear messages — each commit should represent one logical change",
        "Branches let you work on features in isolation without affecting the main codebase",
        "The professional workflow: branch → commit → pull request → review → merge",
        "Always push to a remote repository (GitHub) — your local machine is not a backup"
      ],
      "tryIt": "Create a new Git repository for a small project. Create a .gitignore that excludes node_modules and .env. Make three commits with different features. Create a feature branch, make two commits, then merge it back to main. Run git log --oneline and read the history."
    }
  },

  // =========================
  // Module 18: Capstone Project
  // =========================

  {
    "id": 72,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "What the Capstone Is About",
    "type": "lesson",
    "content": {
      "body": "You have learned the complete JavaScript language — variables, functions, arrays, objects, classes, async/await, modules, and professional tooling. The capstone project is where you bring all of it together into a real, working application. Learning concepts in isolation is valuable; applying them together is how real competence develops.\n\n## The Capstone Project: A Public API Dashboard\n\nYou will build a multi-feature data dashboard that fetches live data from a public API, displays it meaningfully, and allows user interaction. Specifically: a task and data tracker that connects to two public APIs (JSONPlaceholder for users/posts and OpenWeatherMap for weather), allows filtering and sorting, and persists user preferences to localStorage.\n\n## What This Project Exercises\n\n- Async/await and fetch() for multiple API calls\n- DOM manipulation for dynamic rendering\n- Array methods (map, filter, sort, reduce) for data processing\n- Classes for data modelling\n- Modules for code organisation\n- Error handling for real-world failures\n- localStorage for persistence\n- Event listeners for user interaction\n\n## Approach: Build Incrementally\n\nDo not try to build everything at once. Start with fetching and displaying data. Then add filtering. Then sorting. Then local storage. Each step should result in a working, testable state.",
      "diagram": "flowchart TD\n    A[User visits page] --> B[Show loading state]\n    B --> C[Fetch data from APIs]\n    C --> D{All requests OK?}\n    D -->|Yes| E[Render data to DOM]\n    D -->|No| F[Show error message]\n    E --> G[User interacts]\n    G --> H[Filter / Sort data]\n    H --> I[Re-render results]\n    I --> J[Save preferences]\n    style A fill:#f7df1e,color:#1a1a1a\n    style F fill:#fee2e2,stroke:#dc2626",
      "diagramCaption": "The capstone application flow — from page load to interactive data display",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Read the full project requirements before writing any code. Sketch the data flow and component structure on paper first. Coding without a plan produces code that needs to be thrown away."
      },
      "keyPoints": [
        "The capstone integrates every concept: async, DOM, arrays, classes, modules, error handling",
        "Build incrementally — working state after each step is better than half-built features",
        "Fetch from multiple APIs and combine the results into a unified display",
        "Implement filtering and sorting as data transformations on the fetched array",
        "Use localStorage to remember user preferences across page refreshes"
      ],
      "tryIt": "Before writing code: sketch the HTML structure of your dashboard on paper. List all the data you will fetch and from where. List all user interactions (clicks, searches, selections). List all the JavaScript modules you will create. Only then open your editor."
    }
  },

  {
    "id": 73,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Project Architecture and Setup",
    "type": "lesson",
    "content": {
      "body": "Good architecture is decided before you write the first line of code. Retrofitting structure into a working but unorganised codebase is difficult and demoralising. Spend 20 minutes planning — it will save hours.\n\n## File Structure\n\nOrganise the project by feature with a shared utilities layer:\n- src/api/ — all fetch logic, one file per API\n- src/components/ — functions that create and update DOM sections\n- src/state/ — application state management\n- src/utils/ — helper functions (formatters, validators)\n- src/main.js — entry point that wires everything together\n\n## State Management\n\nMaintain a single state object that represents the current state of your application. This is the source of truth for what data has been loaded, what filters are active, and what the user's preferences are. When state changes, re-render the affected components. This unidirectional data flow — state drives the UI — is the foundational pattern of modern frameworks.\n\n## Initialisation\n\nThe main.js entry point should: register event listeners, load saved preferences from localStorage, fetch initial data, and render the initial view. Keep this file thin — it delegates to modules for the actual work.",
      "code": "// src/state/appState.js\nexport const state = {\n  users: [],\n  posts: [],\n  filter: '',\n  sortBy: 'name',\n  loading: false,\n  error: null\n};\n\nexport function setState(updates) {\n  Object.assign(state, updates);\n}\n\n// src/api/usersApi.js\nconst BASE_URL = 'https://jsonplaceholder.typicode.com';\n\nexport async function fetchUsers() {\n  const res = await fetch(`${BASE_URL}/users`);\n  if (!res.ok) throw new Error(`Users API: ${res.status}`);\n  return res.json();\n}\n\nexport async function fetchPosts(userId) {\n  const res = await fetch(`${BASE_URL}/posts?userId=${userId}`);\n  if (!res.ok) throw new Error(`Posts API: ${res.status}`);\n  return res.json();\n}\n\n// src/main.js\nimport { state, setState } from './state/appState.js';\nimport { fetchUsers } from './api/usersApi.js';\nimport { renderUserList } from './components/UserList.js';\n\nasync function init() {\n  setState({ loading: true });\n  try {\n    const users = await fetchUsers();\n    setState({ users, loading: false });\n    renderUserList(users);\n  } catch (error) {\n    setState({ error: error.message, loading: false });\n    renderError(error.message);\n  }\n}\n\ninit();",
      "language": "javascript",
      "callout": {
        "type": "note",
        "text": "State management does not have to be complex. For a small project, a simple state object with a setState function is sufficient. Understand the concept first — state drives the UI, user actions update state, state changes trigger re-renders."
      },
      "keyPoints": [
        "Plan file structure before writing code — organise by feature with a shared utilities layer",
        "Maintain a single state object as the source of truth for the entire application",
        "State changes should trigger re-renders — UI is a function of state",
        "Keep main.js thin — it wires modules together, delegates work to modules",
        "Separate API calls, DOM manipulation, and business logic into distinct modules"
      ],
      "tryIt": "Set up the project using Vite. Create the folder structure: src/api/, src/components/, src/state/, src/utils/. Create an empty appState.js with an initial state object. Create a usersApi.js with a fetchUsers function. Verify the project runs with npm run dev before adding any features."
    }
  },

  {
    "id": 74,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Building the Data Layer",
    "type": "lesson",
    "content": {
      "body": "The data layer is responsible for fetching, transforming, and preparing data for display. It is completely separate from the UI layer — functions in the data layer return data, they do not manipulate the DOM. This separation makes testing straightforward and allows the UI to change without touching data logic.\n\n## Fetching Multiple APIs\n\nThe dashboard fetches from two APIs simultaneously using Promise.all(). This maximises performance — both requests run in parallel. If either fails, the error is caught by the main init function's try/catch and displayed to the user.\n\n## Data Transformation\n\nRaw API data is rarely in exactly the right shape for display. A transformation function (often called a mapper or normaliser) converts raw API data into the shape your UI expects. This decouples your UI from the API's specific structure — if the API changes, you update one function, not the entire codebase.\n\n## Data Filtering and Sorting\n\nImplement filtering and sorting as pure functions: they take data and parameters, return transformed data, and have no side effects. This makes them trivially testable and reusable.",
      "code": "// src/api/usersApi.js\nexport async function fetchAllData() {\n  const [users, posts] = await Promise.all([\n    fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),\n    fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json())\n  ]);\n  return { users, posts };\n}\n\n// src/utils/dataTransform.js\n\n// Normalise: attach post count to each user\nexport function enrichUsersWithPostCount(users, posts) {\n  return users.map(user => ({\n    ...user,\n    postCount: posts.filter(p => p.userId === user.id).length\n  }));\n}\n\n// Filter by search term\nexport function filterUsers(users, searchTerm) {\n  if (!searchTerm) return users;\n  const term = searchTerm.toLowerCase();\n  return users.filter(u =>\n    u.name.toLowerCase().includes(term) ||\n    u.email.toLowerCase().includes(term) ||\n    u.address.city.toLowerCase().includes(term)\n  );\n}\n\n// Sort by field\nexport function sortUsers(users, sortBy) {\n  return [...users].sort((a, b) =>\n    a[sortBy]?.localeCompare(b[sortBy]) ?? 0\n  );\n}",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Keep your data transformation functions pure — they take input, return output, and cause no side effects. Pure functions are trivially testable: call with known input, assert the output. No mocking, no DOM setup, no async."
      },
      "keyPoints": [
        "The data layer fetches and transforms data — it never touches the DOM",
        "Use Promise.all() to fetch multiple APIs simultaneously",
        "Normaliser/mapper functions convert raw API data to the shape your UI needs",
        "Implement filter and sort as pure functions — input in, transformed array out",
        "Separating data logic from UI logic makes both independently testable"
      ],
      "tryIt": "Implement enrichUsersWithPostCount, filterUsers, and sortUsers as described. Write unit tests for each using Jest — they are pure functions so tests need no mocking. Test filterUsers with an empty search term, partial name match, city match, and no match case."
    }
  },

  {
    "id": 75,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Building the UI Layer",
    "type": "lesson",
    "content": {
      "body": "The UI layer takes data from the state object and renders it to the DOM. It responds to user events by updating state, which triggers re-renders. The UI should be driven entirely by state — if you know the state, you know exactly what the UI looks like.\n\n## Rendering Patterns\n\nThe simplest rendering approach is to clear a container and re-populate it from the current state on every update. This is inefficient at large scale but perfectly appropriate for a learning project. It is also conceptually simple — every render is a fresh reflection of the current state.\n\n## Event Listeners\n\nAttach event listeners to stable elements (those that exist in the initial HTML) rather than dynamically created ones. A search input, a sort dropdown, and a filter button all exist from page load — their listeners are registered once in init(). When they fire, they update state and call a render function.\n\n## User Feedback\n\nEvery async operation should communicate its state to the user: a loading indicator while data is being fetched, a success state when data is displayed, and an error state with a helpful message if something goes wrong. Users should never see a blank page with no explanation.",
      "code": "// src/components/UserList.js\nexport function renderUserList(users) {\n  const container = document.getElementById('user-list');\n\n  if (users.length === 0) {\n    container.innerHTML = '<p class=\"empty\">No users match your search.</p>';\n    return;\n  }\n\n  container.innerHTML = users.map(user => `\n    <article class=\"user-card\" data-id=\"${user.id}\">\n      <h3>${user.name}</h3>\n      <p class=\"email\"><a href=\"mailto:${user.email}\">${user.email}</a></p>\n      <p class=\"city\">📍 ${user.address.city}</p>\n      <span class=\"badge\">${user.postCount} posts</span>\n    </article>\n  `).join('');\n}\n\n// src/components/Controls.js\nexport function initControls(onSearch, onSort) {\n  const searchInput = document.getElementById('search');\n  const sortSelect = document.getElementById('sort-by');\n\n  searchInput.addEventListener('input', e => {\n    onSearch(e.target.value);\n  });\n\n  sortSelect.addEventListener('change', e => {\n    onSort(e.target.value);\n  });\n}\n\n// Loading/error states\nexport function showLoading() {\n  document.getElementById('status').textContent = 'Loading...';\n}\n\nexport function showError(message) {\n  document.getElementById('status').innerHTML =\n    `<span class=\"error\">⚠️ ${message}</span>`;\n}",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Attach event listeners to static elements in the HTML, not to dynamically rendered items. If you add a listener inside a render function, every re-render adds another listener — causing the handler to fire multiple times for one event."
      },
      "keyPoints": [
        "The UI layer renders state to the DOM — it should never contain business logic",
        "Re-render the entire list container on every state update — simple and predictable",
        "Attach event listeners to stable HTML elements in the init() function, not in render functions",
        "Always provide loading, success, and error states for every async operation",
        "Use data attributes (data-id) on rendered elements to reference associated data"
      ],
      "tryIt": "Implement the renderUserList function. Add a search input to your HTML. Implement a search handler: on every keystroke, filter the current users array using filterUsers() and re-render. Test that searching by name, email, and city all work correctly."
    }
  },

  {
    "id": 76,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Persistence with localStorage",
    "type": "lesson",
    "content": {
      "body": "localStorage is a simple key–value store in the browser that persists data across page refreshes and browser restarts. Unlike sessionStorage (which clears when the tab is closed) or cookies (which have complex rules), localStorage is straightforward: set a string, get a string, the data is there until you delete it.\n\nlocal storage is ideal for: user preferences (theme, language, sort order), draft content, recent searches, and authentication tokens (with appropriate security precautions).\n\n## Working with Objects\n\nlocalStorage can only store strings. To store objects and arrays, serialize them with JSON.stringify() when writing and parse with JSON.parse() when reading. Always wrap localStorage.getItem() calls in try/catch — JSON.parse() will throw if the stored data is corrupted or in an unexpected format.\n\n## Storage Limits\n\nlocalStorage has a limit of approximately 5-10MB depending on the browser. Do not use it for large datasets — it is for preferences and small pieces of user state. For significant data, use IndexedDB or a server database.\n\n## When to Save\n\nSave preferences immediately when the user changes them. Load preferences when the page initialises and apply them before the first render.",
      "code": "// src/utils/storage.js\nconst PREFS_KEY = 'dashboard-preferences';\n\nexport function savePreferences(prefs) {\n  try {\n    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));\n  } catch (error) {\n    console.warn('Could not save preferences:', error.message);\n  }\n}\n\nexport function loadPreferences() {\n  try {\n    const stored = localStorage.getItem(PREFS_KEY);\n    return stored ? JSON.parse(stored) : null;\n  } catch (error) {\n    console.warn('Could not load preferences:', error.message);\n    return null;\n  }\n}\n\nexport function clearPreferences() {\n  localStorage.removeItem(PREFS_KEY);\n}\n\n// Using it in main.js\nconst saved = loadPreferences();\nif (saved) {\n  setState({ sortBy: saved.sortBy, filter: saved.filter });\n  document.getElementById('sort-by').value = saved.sortBy;\n  document.getElementById('search').value = saved.filter;\n}\n\n// Save whenever preferences change\nfunction handleSort(sortBy) {\n  setState({ sortBy });\n  savePreferences({ sortBy, filter: state.filter });\n  renderUserList(filterUsers(sortUsers(state.users, sortBy), state.filter));\n}",
      "language": "javascript",
      "callout": {
        "type": "warning",
        "text": "Do not store sensitive data (passwords, personal information, session tokens for high-security apps) in localStorage. It is accessible via JavaScript and therefore vulnerable to XSS attacks. For sensitive data, use HttpOnly cookies set by the server."
      },
      "keyPoints": [
        "localStorage persists data across page refreshes and browser restarts as string key-value pairs",
        "Use JSON.stringify() to store objects and JSON.parse() to retrieve them",
        "Always wrap localStorage operations in try/catch — storage may be full or disabled",
        "Load and apply preferences before the first render; save immediately when they change",
        "Do not store sensitive data in localStorage — it is accessible via JavaScript"
      ],
      "tryIt": "Add localStorage persistence to your dashboard. Save sortBy and searchTerm whenever they change. On page load, read saved values and restore the UI to the previous state. Test by changing settings, refreshing the page, and verifying the previous state is restored."
    }
  },

  {
    "id": 77,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Error Handling in a Real Application",
    "type": "lesson",
    "content": {
      "body": "Real applications fail in unexpected ways: network requests timeout, APIs return unexpected data shapes, localStorage is full, users provide malformed input. A professional application handles these gracefully — the user always sees a meaningful message and the application remains functional.\n\n## Error Boundary Strategy\n\nHandle errors at the boundaries where outside data enters your application: API calls, localStorage reads, user input parsing. Inside these boundaries, trust your own code. Validate API responses before processing — check that expected fields exist, that arrays are actually arrays, that required values are not null.\n\n## User-Facing Error Messages\n\nError messages shown to users should be helpful, not technical. 'Failed to load users. Please check your connection and try again.' is helpful. 'TypeError: Cannot read properties of undefined (reading name)' is not. Log the technical error to the console for debugging; show the human-readable message in the UI.\n\n## Retry Logic\n\nFor transient failures (network timeouts, temporary server errors), offer a retry mechanism. A simple 'Retry' button that re-runs the init() function is often sufficient. For automatic retries, implement exponential backoff to avoid hammering a struggling server.",
      "code": "// Comprehensive error handling in the data layer\nasync function loadDashboard() {\n  showLoading();\n\n  try {\n    const { users, posts } = await fetchAllData();\n\n    // Validate API response shape\n    if (!Array.isArray(users)) {\n      throw new TypeError('API returned unexpected users format');\n    }\n\n    const enriched = enrichUsersWithPostCount(users, posts);\n    setState({ users: enriched, loading: false, error: null });\n    renderAll();\n\n  } catch (error) {\n    console.error('[loadDashboard]', error);\n\n    const message = error instanceof TypeError\n      ? 'Received unexpected data from server. Please try again later.'\n      : error.message.includes('Failed to fetch')\n        ? 'Unable to connect. Please check your internet connection.'\n        : `Something went wrong: ${error.message}`;\n\n    setState({ loading: false, error: message });\n    showError(message, () => loadDashboard()); // pass retry callback\n  }\n}\n\n// Error display with retry button\nfunction showError(message, onRetry) {\n  const container = document.getElementById('status');\n  container.innerHTML = `\n    <div class=\"error-state\">\n      <p>⚠️ ${message}</p>\n      <button id=\"retry-btn\">Try again</button>\n    </div>\n  `;\n  document.getElementById('retry-btn')?.addEventListener('click', onRetry);\n}",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Provide a retry button for any failed network operation. Users expect this, and it handles the most common case — a temporary network issue — without requiring a full page refresh."
      },
      "keyPoints": [
        "Handle errors at data boundaries — API calls, localStorage, user input parsing",
        "Show human-readable messages to users; log technical details to the console",
        "Validate API response shapes before processing — APIs can return unexpected data",
        "Categorise errors by type and show the most useful message for each category",
        "Offer a retry mechanism for transient failures — a simple retry button covers most cases"
      ],
      "tryIt": "Enhance your error handling to distinguish between: no internet connection (TypeError: Failed to fetch), HTTP errors (4xx/5xx), and data shape errors. Show a different message for each case. Add a retry button to the error state that re-runs the data loading function."
    }
  },

  {
    "id": 78,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "Polishing and Deployment",
    "type": "lesson",
    "content": {
      "body": "The difference between a working prototype and a production-ready application is polish: accessibility, performance, mobile responsiveness, and a deployment pipeline. These are not optional extras — they are part of building professional software.\n\n## Accessibility Basics\n\nAdd semantic HTML (article, section, nav, header, main). Every interactive element must be focusable with the keyboard and accessible with a screen reader. Loading states should be announced to screen readers using aria-live regions. Error messages should be linked to their triggering element with aria-describedby.\n\n## Performance Basics\n\nAvoid unnecessary re-renders. Debounce the search input — do not filter and re-render on every keystroke; wait until the user pauses typing (100-300ms). Cache fetched data in the state object so switching between views does not trigger new network requests.\n\n## Deploying to Netlify\n\nNetlify provides free hosting for static web applications. Connect your GitHub repository, specify the build command (npm run build) and publish directory (dist/). Every push to main triggers a new deployment automatically. Your project goes from localhost to a public URL in under a minute.",
      "code": "// Debounce — prevent rapid-fire re-renders during typing\nfunction debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\n// Usage: debounce search to 250ms\nconst handleSearch = debounce((searchTerm) => {\n  setState({ filter: searchTerm });\n  savePreferences({ sortBy: state.sortBy, filter: searchTerm });\n  renderUserList(\n    filterUsers(sortUsers(state.users, state.sortBy), searchTerm)\n  );\n}, 250);\n\ndocument.getElementById('search')\n  .addEventListener('input', e => handleSearch(e.target.value));\n\n// Netlify deployment — netlify.toml\n/*\n[build]\n  command = \"npm run build\"\n  publish = \"dist\"\n\n[[redirects]]\n  from = \"/*\"\n  to = \"/index.html\"\n  status = 200\n*/",
      "language": "javascript",
      "callout": {
        "type": "tip",
        "text": "Debounce any operation triggered by fast user input (search, scroll, resize). Without debouncing, a fast typist triggers 10 searches per second. With 250ms debounce, one search fires when they pause — dramatically reducing unnecessary work."
      },
      "keyPoints": [
        "Use semantic HTML elements for structure — they improve accessibility automatically",
        "Debounce search input to avoid re-rendering on every keystroke",
        "Cache fetched data in state — avoid redundant network requests when switching views",
        "Netlify and Vercel provide free, automated deployment from GitHub repositories",
        "Every push to main should trigger a deployment — continuous delivery from the start"
      ],
      "tryIt": "Add debouncing to your search input. Deploy your completed project to Netlify: create a netlify.toml with build settings, push to a GitHub repository, connect the repository to Netlify, and get a live URL. Share the URL — you have shipped a real JavaScript application."
    }
  },

  {
    "id": 79,
    "moduleId": 18,
    "moduleTitle": "Capstone Project",
    "title": "What Comes Next",
    "type": "lesson",
    "content": {
      "body": "You have completed the full JavaScript course. You can write structured, organised, tested, and deployable JavaScript. You understand the language deeply enough to build real applications and to learn new tools quickly. What you have is a strong foundation — the direction you build on it is yours to choose.\n\n## Immediate Next Steps\n\n**Practise building** — the most important thing you can do now is build more things. Build projects that interest you. Build clones of familiar applications. Build tools that solve a problem you actually have. Every project will teach you something the course could not.\n\n**Learn a framework** — React is the most widely deployed JavaScript framework. Vue and Svelte are excellent alternatives. All become much easier once you understand vanilla JavaScript deeply, which you now do.\n\n**Deepen JavaScript knowledge** — TypeScript adds static typing to JavaScript and is the standard in professional teams. Study design patterns. Learn about performance optimisation. Study the Web APIs you have not touched yet.\n\n## Career Readiness\n\nBuild a portfolio of at least three projects on GitHub. Contribute to an open source project. Solve JavaScript challenges on LeetCode or Codewars to sharpen algorithmic thinking. Apply to junior roles — you are ready.",
      "callout": {
        "type": "tip",
        "text": "The developers who progress fastest are those who build consistently and read other people's code. Pick an open source project you use, read its source code, and try to understand how it works. You will learn more in a week of this than in a month of tutorials."
      },
      "keyPoints": [
        "Build more projects immediately — practical application cements what you have learned",
        "React, Vue, or Svelte are natural next steps — your JavaScript foundation makes them accessible",
        "TypeScript adds safety to JavaScript — increasingly expected in professional roles",
        "Build a GitHub portfolio of real projects and contribute to open source",
        "Junior developer roles are accessible with a solid JavaScript foundation and evidence of building"
      ],
      "tryIt": "Choose your next project right now and write down: what it does, what APIs or data it uses, and which JavaScript concepts it will exercise. Commit to starting within 48 hours. The momentum you have built while completing this course is most valuable when you use it immediately."
    }
  }
];
