# Copilot Coding Guidelines

## Section 0: Guiding Principles

These guidelines help us write code that is effective and easy to work with. When writing or modifying code, prioritize the following:

*   **0.1 Clarity and Maintainability:**
    *   Write code that is straightforward to read, understand, modify, and debug (e.g., through modularity).
    *   **Performance is secondary:** Avoid complexity for premature optimization. Clear, correct code is preferred.
    *   **Trust Contracts:** Assume callers adhere to function contracts. Avoid excessive defensive programming for contract violations.

*   **0.2 Functional Programming:**
    *   Favor functional programming paradigms like pure functions and avoiding side effects where practical. See Section C for detailed rules.

*   **0.3 Design for Testability:**
    *   Structure code to be inherently testable (e.g., small, focused functions/modules with clear interfaces and limited dependencies). Avoid adding logic solely for testing purposes.

---

## Section A: Types and Variables

*   **A1:** Never use `any` unless it's already in the code. If you do see the need for `any`, ask what to do.
*   **A2:** Avoid `let` except in closures. Use `const` by default to promote immutability.
*   **A3:** Avoid having overly complex types directly in function declarations. Create a type alias instead.
*   **A4:** Functions may have up to 2 positional parameters. For more complex signatures, use a parameter object (has to be the last or only parameter). Extract a type alias for the parameter object if it becomes complex.
*   **A5:** Favor named functions (`function name() {}`) over arrow functions (`const name = () => {}`) for functions defined at the module root or as class methods.
*   **A6:** While camelCase is the standard, snake_case is permissible if it aligns directly with external schemas (e.g., JSON keys from an API, YAML configuration).
*   **A7:** Name functions, variables and parameters after what they contain, not what they will be used for. For example, avoid staring a variable name with "should". (reasonable exceptions apply)

---

## Section B: Data Structures and Immutability

This section outlines how data should be structured and handled, emphasizing simplicity and predictability.

*   **B1: Prefer Plain Data Structures:**
    *   Use standard JavaScript objects (`{}`), arrays (`[]`), and primitives as the default for structuring data.
    *   Avoid using classes for data representation unless they provide significant behavioral advantages.
    *   Use specialized data structures like `Map` or `Set` only when their specific performance characteristics or API (e.g., non-string keys for `Map`) are demonstrably necessary and justified. Simple array/object operations (`find`, `includes`, `Object.keys`, etc.) are often sufficient.

*   **B2: Embrace Immutability:**
    *   Treat data as immutable. Do not modify objects or arrays directly after creation.
    *   To "update" data, create new objects or arrays with the desired changes.
    *   **Preferred Techniques:** Use spread syntax (`{...obj, prop: newVal}`, `[...arr, newItem]`), array methods that return new arrays (`map`, `filter`, `reduce`, `slice`, `concat`), and `Object.assign({}, ...)`.
    *   **Avoid:** Methods that mutate in place (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`), direct property assignment (`obj.prop = val`), and `delete`.

*   **B3: Avoid Empty Initializers for Immediate Population:**
    *   Do not initialize an empty object (`{}`) or array (`[]`) if it's immediately populated in subsequent steps.
    *   Instead, construct the data structure directly using methods like `Array.from`, `Object.fromEntries`, functional methods (`map`, `flatMap`, `reduce`), or spread syntax during creation.

*   **B4: Trust Object Structure:**
    *   Assume objects conform to their expected shape based on type definitions or context.
    *   Avoid unnecessary defensive checks like `hasOwnProperty`.

---

## Section C: Functional Programming

This section focuses on applying functional programming principles to improve code clarity and predictability.

*   **C1: Favor Functions Over Classes:**
    *   Use functions as the primary building blocks for logic.
    *   Avoid classes unless modeling entities with significant internal state and associated behavior, or when interfacing with frameworks requiring them. Plain functions and modules are generally preferred.

*   **C2: Prefer Functional Iteration:**
    *   Use functional array methods like `forEach`, `map`, `filter`, `reduce`, `flatMap`, `some`, `every`, etc., over imperative loops (`for`, `while`, `do...while`).

*   **C3: Aim for Pure Functions:**
    *   Strive to write pure functions where possible – functions whose output depends only on their input arguments and which have no side effects (e.g., modifying external state, logging, network requests).
    *   Isolate necessary side effects into specific functions or modules.

*   **C4: Use Chaining for Readability:**
    *   Prefer chaining functional method calls (`array.filter(...).map(...)`) or using inline calls over creating numerous intermediate variables when it enhances readability and flow.

*   **C5: Leverage Utility Libraries (If Present):**
    *   If utility libraries like Lodash/FP are already part of the project, utilize their functions when they can simplify code or reduce boilerplate compared to native methods (e.g., complex object manipulations).

*   **C6: Maintain Single Source of Truth:**
    *   Ensure that any piece of data originates from a single, authoritative source to avoid inconsistencies. Pass data explicitly rather than relying on shared mutable state.

---

## Section D: Control Flow & Structure

This section provides guidelines for structuring code logic, focusing on avoiding excessive nesting and handling asynchronous operations effectively.

*   **D1: Avoid Deep Nesting - Functions:**
    *   Do not nest function definitions directly within other functions, except when passing anonymous functions (arrow functions or `function` expressions) as arguments (e.g., callbacks, array methods). Define helper functions at the module level or as methods if within a class.

*   **D2: Avoid Deep Nesting - Conditionals:**
    *   Avoid nesting `if` statements directly within other `if` or `else` blocks.
    *   Use `else if`, ternary operators (`condition ? val1 : val2`), logical operators (`&&`, `||`), or extract logic into separate functions to flatten conditional structures. Early returns (guard clauses) can also help.

*   **D3: Avoid Deep Nesting - Loops:**
    *   Avoid nesting loops directly within other loops.
    *   Consider using chained functional methods (e.g., `flatMap`), extracting the inner loop logic into a helper function, or rethinking the data structure or algorithm to prevent nested iteration.

*   **D4: Prefer `async/await`:**
    *   Use `async/await` syntax for handling promises, as it generally leads to more readable asynchronous code compared to long `.then()` chains.

*   **D5: Handle Concurrent Operations:**
    *   Use `Promise.all` when you need multiple independent asynchronous operations to complete successfully before proceeding.
    *   Use `Promise.allSettled` when you need to wait for multiple operations to finish, regardless of whether they succeed or fail. Avoid sequential `await` calls for operations that could run concurrently.

---

## Section E: Error Handling and Validation

Proper error handling and data validation are crucial for robust applications. This section outlines expectations for dealing with potential issues.

*   **E1: Use Errors for Exceptional Conditions:**
    *   Throw `Error` objects (or custom subclasses inheriting from `Error`) only for genuinely exceptional situations or violations of function contracts that prevent successful execution. Do not use error throwing for normal control flow.

*   **E2: Trust Internal Callers, Validate External Data:**
    *   **Internal Code:** Within the application's own codebase, trust that functions are called according to their defined contracts (types, documented preconditions). Avoid redundant checks for conditions that violate the contract (See Principle 0.1).
    *   **External Boundaries:** Rigorously validate data received from external sources (e.g., API responses, file inputs, user input, database results) at the boundary where it enters the system. Use validation libraries (like Zod, if available) or explicit checks to ensure data conforms to expected schemas *before* passing it deeper into the application logic. Throw specific validation errors if data is invalid.

*   **E3: Handle Errors Appropriately:**
    *   Catch errors where you can meaningfully handle them (e.g., retry an operation, return a default value, transform the error into a user-friendly message).
    *   Avoid overly broad `catch (e)` blocks. Catch specific error types if possible.
    *   If an error cannot be handled at the current level, either let it propagate up the call stack or re-throw it.

*   **E4: Use `cause` When Re-throwing:**
    *   When catching an error and throwing a new, potentially more specific error, include the original error in the `cause` property of the new error. This preserves the original context for debugging.
    *   Example: `throw new SpecificError("Failed due to underlying issue", { cause: originalError });`

*   **E5: Handle Promise Rejections:**
    *   Ensure all promises handle potential rejections. Use `try...catch` blocks with `await` or attach a `.catch()` handler to promise chains. Unhandled promise rejections can terminate the application or lead to unpredictable behavior.

*   **E6: Avoid `console.error`/`warn` for Error Handling:**
    *   Do not use `console.error` or `console.warn` as the primary mechanism for reporting or handling errors that should interrupt execution flow. Use `throw` instead. Logging may be appropriate within error handling blocks or for non-critical warnings, but should not replace proper error propagation.

---

## Section F: CSS and Style Guidelines

*   **F1: Use CSS Variables for Colors:**
    *   Define all color values as CSS variables at the `:root` level. Use these variables exclusively throughout your CSS. Consolidate near-identical colors into a single variable.

*   **F2: Utility-First Spacing:**
    *   Use utility classes for margin and padding (e.g., `.padding-md`, `.margin-x-auto`). Avoid embedding spacing directly in element-specific rules unless absolutely necessary.
    *   For axis-specific spacing, use classes like `.padding-x-xl` or `.margin-y-md` as needed, but do not create every possible combination unless required. Use `t`,`b`,`l`,`r` for top, bottom, left, and right.

*   **F3: Layout in TSX, Not CSS:**
    *   All layout-related properties (e.g., `display`, `flex`, `align-items`, `justify-content`, `width`, `height`, `z-index`) should be set via inline styles or style props in TSX/JSX files, not in CSS files.
    *   Use CSS only for color, background, border, font, and spacing utilities.

*   **F4: Avoid Redundant or Unused Rules:**
    *   Regularly audit CSS files for unused or redundant rules, especially after refactoring components or moving layout to TSX.

# Copilot User and Tool Interaction Guidelines

* Personality: This is a hobby project. If the user is frustrated, don't be apologetic, be frustrated also. If the user is cussing, you can also cuss.
* When asked a question, don't interpret it as an instruction or request to do anything other than answering the question.
* After every use of the insert_edit_into_file tool, always use the get_errors tool on the edited file(s) before doing anything else. Do not proceed until you have confirmed the code is error-free or have reported the errors to the user. This is mandatory for every code change. You do not have to fix issues you did not cause.
* If the user talks about compile issues, also use "Get Rroblems" to check for the issue directly.
* Test your theories. If you are looking for a bug, don't just make an assumption about the "root cause" and ipmlement a fix based on that, make a change that proves or disproves your theory
* You have access to documenation through the "context7" tool. Use it genrioiusly when working with libraries or frameworks. When you run in to bugs. When you need snippets. When you implement new features. When the compile error is non-obvious. All the time.
* Do not be too eager implementing changes or fixes. If user says "lets work on X", ask them to clarify what they want to be done next. If they ask a question "how do we do Y", answer it and ask if they want the solution implemented.
* Wait for the user to say something like "lets implement this" or something imperative like this. "Can you do it?" is NOT an imperative.
