<p align="center">
  <img src="images/logo.png" height="200px" width="200px"/>
  <br/>
  <h3 align="center">Tree-walk Interpreter</h3>
</p>
<br />

<p align="center">
  <a href="../../issues"><img src="https://img.shields.io/github/issues/aminbeigi/repo-README-template.svg?style=flat-square" /></a>
  <a href="../../pulls"><img src="https://img.shields.io/github/issues-pr/aminbeigi/repo-README-template.svg?style=flat-square" /></a>
  <img src="https://img.shields.io/github/license/aminbeigi/repo-README-template?style=flat-square">
</p>

## Description

This project is an entire language implementation including scanning, parsing and execution.

It's a TypeScript implementation of the Lox language tree-walking interpreter, inspired by Bob Nystrom's book [Crafting Interpreters](https://www.craftinginterpreters.com/). I chose to implement it in TypeScript, which led me to pay closer attention to the examples rather than directly translating the Java source code.

### Future work

At its current state, the interpreter functions as a basic arithmetic calculator. Future work involves extending the grammar to include variables, functions, and other language features.

## Running

To start the REPL:

```
git clone git@github.com:aminbeigi/tree-walk-interpreter.git
npm i
npm run build:start
```

To run a file:

```
git clone git@github.com:aminbeigi/tree-walk-interpreter.git
npm i
npm run build:start <filename>
```

## Lox Example

```
> (20 * (5 + 3) - (7 * 2)) / (4 + 2)
24.333333333333332
> (5 * 2) < (10 + 3)
true
> 20 + peanut_butter
[line 0] Error at 'peanut_butter': Expect expression.
```

## Contributions

Contributions are always welcome!  
Just make a [pull request](../../pulls).

## License

MIT license.
