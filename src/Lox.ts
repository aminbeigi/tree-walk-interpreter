import { exit } from "process";
import { readFileSync } from "fs";
import promptSync from "prompt-sync";
import { Scanner } from "./Scanner";

export class Lox {
  static hadError = false;

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
    tokens.forEach((token) => {
      console.log(token);
    });
  }

  static error(line: number, message: string): void {
    Lox.report(line, "", message);
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
  } else if (process.argv.length == 3) {
    lox.runFile(process.argv[2]);
  } else {
    lox.runPrompt();
  }
}

main();
