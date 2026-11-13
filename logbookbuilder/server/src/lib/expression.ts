/**
 * Safe AST-based expression evaluator for calculated fields.
 *
 * Supports:
 *   - Arithmetic:   +  -  *  /  %
 *   - Comparison:   >  <  >=  <=  ==  !=
 *   - Logical:      &&  ||  !
 *   - Math:         round()  floor()  ceil()  abs()  min()  max()  sqrt()  pow()
 *   - Conditional:  if(condition, trueValue, falseValue)
 *   - Field refs:   {ColumnName}  resolved from the provided context
 *
 * No eval(), no Function(), no dynamic code execution.
 */

type TokenType =
  | "NUMBER" | "STRING" | "IDENT" | "FIELD_REF"
  | "PLUS" | "MINUS" | "STAR" | "SLASH" | "PERCENT"
  | "EQ" | "NEQ" | "LT" | "LTE" | "GT" | "GTE"
  | "AND" | "OR" | "BANG"
  | "LPAREN" | "RPAREN" | "COMMA"
  | "EOF";

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (/\s/.test(ch)) { i++; continue; }

    if (ch === "{") {
      const end = expr.indexOf("}", i);
      if (end === -1) throw new Error("Unclosed field reference '{'");
      tokens.push({ type: "FIELD_REF", value: expr.slice(i + 1, end) });
      i = end + 1;
      continue;
    }

    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(expr[i + 1] ?? ""))) {
      let num = "";
      while (i < expr.length && /[0-9.]/.test(expr[i])) num += expr[i++];
      tokens.push({ type: "NUMBER", value: num });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let ident = "";
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) ident += expr[i++];
      tokens.push({ type: "IDENT", value: ident });
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch; let str = ""; i++;
      while (i < expr.length && expr[i] !== quote) str += expr[i++];
      i++;
      tokens.push({ type: "STRING", value: str });
      continue;
    }

    if (ch === "&" && expr[i + 1] === "&") { tokens.push({ type: "AND", value: "&&" }); i += 2; continue; }
    if (ch === "|" && expr[i + 1] === "|") { tokens.push({ type: "OR", value: "||" }); i += 2; continue; }
    if (ch === "=" && expr[i + 1] === "=") { tokens.push({ type: "EQ", value: "==" }); i += 2; continue; }
    if (ch === "!" && expr[i + 1] === "=") { tokens.push({ type: "NEQ", value: "!=" }); i += 2; continue; }
    if (ch === "<" && expr[i + 1] === "=") { tokens.push({ type: "LTE", value: "<=" }); i += 2; continue; }
    if (ch === ">" && expr[i + 1] === "=") { tokens.push({ type: "GTE", value: ">=" }); i += 2; continue; }
    if (ch === "<") { tokens.push({ type: "LT", value: "<" }); i++; continue; }
    if (ch === ">") { tokens.push({ type: "GT", value: ">" }); i++; continue; }
    if (ch === "!") { tokens.push({ type: "BANG", value: "!" }); i++; continue; }
    if (ch === "+") { tokens.push({ type: "PLUS", value: "+" }); i++; continue; }
    if (ch === "-") { tokens.push({ type: "MINUS", value: "-" }); i++; continue; }
    if (ch === "*") { tokens.push({ type: "STAR", value: "*" }); i++; continue; }
    if (ch === "/") { tokens.push({ type: "SLASH", value: "/" }); i++; continue; }
    if (ch === "%") { tokens.push({ type: "PERCENT", value: "%" }); i++; continue; }
    if (ch === "(") { tokens.push({ type: "LPAREN", value: "(" }); i++; continue; }
    if (ch === ")") { tokens.push({ type: "RPAREN", value: ")" }); i++; continue; }
    if (ch === ",") { tokens.push({ type: "COMMA", value: "," }); i++; continue; }

    throw new Error(`Unexpected character: '${ch}'`);
  }

  tokens.push({ type: "EOF", value: "" });
  return tokens;
}

type ExprValue = number | boolean | string | null;

class Parser {
  private pos = 0;
  constructor(private tokens: Token[]) {}

  private peek(): Token { return this.tokens[this.pos]; }
  private consume(): Token { return this.tokens[this.pos++]; }
  private expect(type: TokenType): Token {
    const t = this.consume();
    if (t.type !== type) throw new Error(`Expected ${type}, got ${t.type}`);
    return t;
  }

  parse(context: Record<string, ExprValue>): ExprValue {
    const result = this.parseOr(context);
    if (this.peek().type !== "EOF") throw new Error("Unexpected token after expression");
    return result;
  }

  private parseOr(ctx: Record<string, ExprValue>): ExprValue {
    let left = this.parseAnd(ctx);
    while (this.peek().type === "OR") {
      this.consume();
      const right = this.parseAnd(ctx);
      left = Boolean(left) || Boolean(right);
    }
    return left;
  }

  private parseAnd(ctx: Record<string, ExprValue>): ExprValue {
    let left = this.parseEquality(ctx);
    while (this.peek().type === "AND") {
      this.consume();
      const right = this.parseEquality(ctx);
      left = Boolean(left) && Boolean(right);
    }
    return left;
  }

  private parseEquality(ctx: Record<string, ExprValue>): ExprValue {
    let left = this.parseComparison(ctx);
    while (this.peek().type === "EQ" || this.peek().type === "NEQ") {
      const op = this.consume().type;
      const right = this.parseComparison(ctx);
      left = op === "EQ" ? left == right : left != right;
    }
    return left;
  }

  private parseComparison(ctx: Record<string, ExprValue>): ExprValue {
    let left = this.parseAddSub(ctx);
    const t = this.peek().type;
    if (t === "LT" || t === "LTE" || t === "GT" || t === "GTE") {
      const op = this.consume().type;
      const right = this.parseAddSub(ctx);
      const l = Number(left); const r = Number(right);
      if (op === "LT") return l < r;
      if (op === "LTE") return l <= r;
      if (op === "GT") return l > r;
      return l >= r;
    }
    return left;
  }

  private parseAddSub(ctx: Record<string, ExprValue>): ExprValue {
    let left = this.parseMulDiv(ctx);
    while (this.peek().type === "PLUS" || this.peek().type === "MINUS") {
      const op = this.consume().type;
      const right = this.parseMulDiv(ctx);
      left = op === "PLUS" ? Number(left) + Number(right) : Number(left) - Number(right);
    }
    return left;
  }

  private parseMulDiv(ctx: Record<string, ExprValue>): ExprValue {
    let left = this.parseUnary(ctx);
    while (["STAR", "SLASH", "PERCENT"].includes(this.peek().type)) {
      const op = this.consume().type;
      const right = this.parseUnary(ctx);
      const l = Number(left); const r = Number(right);
      if (op === "STAR") left = l * r;
      else if (op === "SLASH") { if (r === 0) throw new Error("Division by zero"); left = l / r; }
      else left = l % r;
    }
    return left;
  }

  private parseUnary(ctx: Record<string, ExprValue>): ExprValue {
    if (this.peek().type === "MINUS") { this.consume(); return -Number(this.parsePrimary(ctx)); }
    if (this.peek().type === "BANG") { this.consume(); return !this.parsePrimary(ctx); }
    return this.parsePrimary(ctx);
  }

  private parsePrimary(ctx: Record<string, ExprValue>): ExprValue {
    const t = this.peek();

    if (t.type === "NUMBER") { this.consume(); return parseFloat(t.value); }
    if (t.type === "STRING") { this.consume(); return t.value; }
    if (t.type === "FIELD_REF") {
      this.consume();
      if (!(t.value in ctx)) throw new Error(`Unknown field reference: {${t.value}}`);
      return ctx[t.value];
    }

    if (t.type === "IDENT") {
      const name = t.value;
      if (name === "true") { this.consume(); return true; }
      if (name === "false") { this.consume(); return false; }
      if (name === "null") { this.consume(); return null; }

      // Built-in functions
      this.consume();
      this.expect("LPAREN");
      const args: ExprValue[] = [];
      while (this.peek().type !== "RPAREN") {
        args.push(this.parseOr(ctx));
        if (this.peek().type === "COMMA") this.consume();
      }
      this.expect("RPAREN");

      switch (name) {
        case "round": return Math.round(Number(args[0]) * Math.pow(10, Number(args[1] ?? 0))) / Math.pow(10, Number(args[1] ?? 0));
        case "floor": return Math.floor(Number(args[0]));
        case "ceil": return Math.ceil(Number(args[0]));
        case "abs": return Math.abs(Number(args[0]));
        case "min": return Math.min(...args.map(Number));
        case "max": return Math.max(...args.map(Number));
        case "sqrt": return Math.sqrt(Number(args[0]));
        case "pow": return Math.pow(Number(args[0]), Number(args[1]));
        case "if": return args[0] ? args[1] : args[2];
        default: throw new Error(`Unknown function: ${name}()`);
      }
    }

    if (t.type === "LPAREN") {
      this.consume();
      const val = this.parseOr(ctx);
      this.expect("RPAREN");
      return val;
    }

    throw new Error(`Unexpected token: ${t.type} ('${t.value}')`);
  }
}

export interface EvaluationResult {
  value: ExprValue;
  error?: string;
}

export function evaluateExpression(
  expression: string,
  context: Record<string, ExprValue>
): EvaluationResult {
  try {
    const tokens = tokenize(expression);
    const parser = new Parser(tokens);
    const value = parser.parse(context);
    return { value };
  } catch (err) {
    return { value: null, error: err instanceof Error ? err.message : String(err) };
  }
}

export function validateExpression(expression: string): { valid: boolean; error?: string } {
  // Validate with a dummy context that returns 1 for all field refs
  const proxyContext = new Proxy({} as Record<string, ExprValue>, {
    get: () => 1,
    has: () => true,
  });
  const result = evaluateExpression(expression, proxyContext);
  return result.error ? { valid: false, error: result.error } : { valid: true };
}
