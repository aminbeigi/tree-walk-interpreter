import { Lox } from "./Lox";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Scanner {
  source: string;
  tokens: Token[] = [];
  start = 0;
  current = 0;
  line = 0;
  static keywords: { [keyword: string]: TokenType } = {
    and: TokenType.AND,
    class: TokenType.CLASS,
    else: TokenType.ELSE,
    false: TokenType.FALSE,
    for: TokenType.FOR,
    fun: TokenType.FUN,
    if: TokenType.IF,
    nil: TokenType.NIL,
    or: TokenType.OR,
    print: TokenType.PRINT,
    return: TokenType.RETURN,
    super: TokenType.SUPER,
    this: TokenType.THIS,
    true: TokenType.TRUE,
    var: TokenType.VAR,
    while: TokenType.WHILE,
  };

  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    const token = new Token(TokenType.EOF, "", null, this.line);
    this.tokens.push(token);
    return this.tokens;
  }

  scanToken(): void {
    const char: string = this.advance();
    switch (char) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;
      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case "/":
        if (this.match("/")) {
          while (this.peek() !== "\n" && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        // ignore whitespace
        break;
      case "\n":
        ++this.line;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        } else {
          Lox.error(this.line, "Unexpected character.");
        }
        break;
    }
  }

  identifier(): void {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    let type = Scanner.keywords[text];

    if (!type) {
      type = TokenType.IDENTIFIER;
    }

    this.addToken(type);
  }

  number(): void {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // look for a fractional part
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      // consume the "."
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const literal = Number(this.source.substring(this.start, this.current));
    this.addToken(TokenType.NUMBER, literal);
  }

  string(): void {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") {
        ++this.line;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      Lox.error(this.line, "Unterminated string.");
      return;
    }

    this.advance();

    // trim the surrounding quotes
    const value = this.source.substring(this.start + 1, this.current - 1);
    return this.addToken(TokenType.STRING, value);
  }

  match(expected: string): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    if (this.source.charAt(this.current) != expected) {
      return false;
    }

    ++this.current;
    return true;
  }

  peek(): string {
    if (this.isAtEnd()) {
      return "\0";
    }
    return this.source.charAt(this.current);
  }

  peekNext(): string {
    if (this.current + 1 >= this.source.length) {
      return "\0";
    }
    return this.source.charAt(this.current + 1);
  }

  isAlpha(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === "_";
  }

  isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  advance(): string {
    return this.source.charAt(this.current++);
  }

  isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  addToken(type: TokenType, literal?: string | number | null): void {
    const text = this.source.substring(this.start, this.current);
    const token = new Token(type, text, literal === undefined ? null : literal, this.line);
    this.tokens.push(token);
  }
}
