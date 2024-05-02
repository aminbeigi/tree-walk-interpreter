import { Binary, Expr, Grouping, Literal, Unary, Visitor } from "./Ast";
import { Lox } from "./Lox";
import { RuntimeError } from "./RuntimeError";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Interpreter implements Visitor<unknown> {
  interpret(expression: Expr): void {
    try {
      const value = this.evaluate(expression);
      const res = this.stringify(value);
      console.log(res);
    } catch (error: unknown) {
      if (error instanceof RuntimeError) {
        Lox.runtimeError(error);
      }
      throw error;
    }
  }

  visitLiteralExpr(expr: Literal): string | number | boolean | null {
    return expr.value;
  }

  visitGroupingExpr(expr: Grouping): string | number | boolean | null {
    return this.evaluate(expr.expression);
  }

  visitBinaryExpr(expr: Binary): string | number | boolean | null {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.BANG_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return this.isEqual(left, right);
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) >= Number(right);
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) <= Number(right);
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) - Number(right);
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) / Number(right);
      case TokenType.PLUS:
        this.checkNumberOperands(expr.operator, left, right);
        if (typeof left === "number" && typeof right === "number") {
          return Number(left) + Number(right);
        }
        if (typeof left === "string" && typeof right === "string") {
          return String(left) + String(right);
        }
        throw new RuntimeError(expr.operator, "Operands must be numbers.");
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) * Number(right);
    }

    return null;
  }

  visitUnaryExpr(expr: Unary): number | boolean | null {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -Number(right);
    }
    return null;
  }

  private checkNumberOperand(operator: Token, operand: unknown): void {
    if (typeof operand === "number") {
      return;
    }
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  private checkNumberOperands(operator: Token, left: unknown, right: unknown): void {
    if (typeof left === "number" && typeof right === "number") {
      return;
    }

    throw new RuntimeError(operator, "Operands must be numbers.");
  }

  private isTruthy(object: unknown): boolean {
    if (object === null) {
      return false;
    }
    if (typeof object === "boolean") {
      return Boolean(object);
    }
    return true;
  }

  private evaluate(expr: Expr): string | number | boolean | null {
    return expr.accept(this);
  }

  private isEqual(a: unknown, b: unknown) {
    if (a === null && b === null) {
      return true;
    }
    if (a === null) {
      return false;
    }
    return a === b;
  }

  private stringify(object: unknown): string {
    if (!object) {
      return "nil";
    }

    if (typeof object === "number") {
      let text = object.toString();
      if (text.endsWith(".0")) {
        text = text.substring(0, text.length - 2);
      }
      return text;
    }

    return object.toString();
  }
}