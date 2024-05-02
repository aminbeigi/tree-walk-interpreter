import { exit } from "process";
import { readFileSync } from "fs";
import promptSync from "prompt-sync";
import { Scanner } from "./Scanner";
import { Token } from "./Token";
import { TokenType } from "./TokenType";
import { Parser } from "./Parser";
import { AstPrinter } from "./AstPrinter";
import { RuntimeError } from "./RuntimeError";
import { Interpreter } from "./Interpreter";

export class Lox {
  private static interpreter = new Interpreter();
  static hadError = false;
  static hadRuntimeError = false;

  runFile(path: string): void {
    let data: string;
    try {
      data = readFileSync(path, "utf8");
    } catch (err) {
      throw new Error("IOException");
    }
    this.run(data);
    if (Lox.hadError) {
      exit(65);
    }
    if (Lox.hadRuntimeError) {
      exit(70);
    }
  }

  runPrompt(): void {
    const prompt = promptSync({ sigint: true });
    while (true) {
      const input = prompt("> ");
      if (input === null || input.trim() === "") {
        exit(0);
      }
      this.run(input);
      Lox.hadError = false;
    }
  }

  run(source: string): void {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const expression = parser.parse();

    if (Lox.hadError) {
      return;
    }

    if (expression) {
      const res = Lox.interpreter.interpret(expression);
      console.log(res);
    }

    //const astPrinter = new AstPrinter();
    //if (expression) {
    //  console.log(astPrinter.print(expression));
    //}
  }

  static error(token: Token, message: string): void {
    if (token.type === TokenType.EOF) {
      this.report(token.line, " at end", message);
    } else {
      this.report(token.line, " at '" + token.lexeme + "'", message);
    }
  }

  static runtimeError(error: RuntimeError): void {
    console.error(error.message + "\n[line " + error.token.line + "]");
    Lox.hadRuntimeError = true;
  }

  static report(line: number, where: string, message: string): void {
    console.error("[line " + line + "] Error" + where + ": " + message);
    Lox.hadError = true;
  }
}

function main(): void {
  const lox = new Lox();
  if (process.argv.length > 4) {
    console.log("Usage: jslox [script]");
    exit(64);
  } else if (process.argv.length === 3) {
    lox.runFile(process.argv[2]);
  } else {
    lox.runPrompt();
  }
}

if (require.main === module) {
  main();
}
