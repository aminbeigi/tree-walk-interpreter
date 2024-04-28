import type { TokenType } from "./TokenType";

export class Token {
  type: TokenType;
  lexeme: string;
  literal: string | number | null;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: string | number | null, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString(s: string): string {
    return this.type + " " + this.lexeme + " " + this.literal;
  }
}
