import { exit } from "process";
import { readFileSync } from "fs";
import promptSync from "prompt-sync";

class Lox {
  hadError = false;

  runFile(path: string): void {
    let data: string;
    try {
      data = readFileSync(path, "utf8");
    } catch (err) {
      throw new Error("IOException");
    }
    this.run(data);
    if (this.hadError) {
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
      this.hadError = false;
    }
  }

  run(s: string) {
    const tokens = s.trim().split(/\s+/);
    tokens.forEach((token) => {
      console.log(token);
    });
  }

  error(line: number, message: string) {
    this.report(line, "", message);
  }

  report(line: number, where: string, message: string) {
    console.error("[line " + line + "] Error" + where + ": " + message);
    this.hadError = true;
  }
}

function main(): void {
  const lox = new Lox();
  if (process.argv.length > 3) {
    console.log("Usage: jslox [script]");
    exit(64);
  } else if (process.argv.length == 2) {
    lox.runFile(process.argv[1]);
  } else {
    lox.runPrompt();
  }
}

main();
