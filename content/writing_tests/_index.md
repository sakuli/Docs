---
title: "Writing Tests"
pre: "<i class='fas fa-chevron-right'></i>  "
date:  2019-09-10T15:23:43+02:00
weight: 2
---

# How to write Tests

With Sakuli v2+ we changed a lot under the hood and completely replaced the technology-stack. This resulted in a more flexible and future-ready architecture while preserving a maximum of backward compatibility.

## Major Changes to Sakuli v1 (Migration)

Nearly all functions and classes from Sakuli v1 are available in Sakuli v2+. They are provided by the [@sakuli/legacy](/apidoc/sakuli-legacy/interfaces/legacyapi) package.

### Async / Await

You might have wondered where the `await` keyword came from when you saw the Sakuli v2+ code. This resulted from the decision to use Node.js as the new runtime for Sakuli. The following section will describe the background of the async/await syntax and its use in Sakuli. If you are already familiar with JavaScript, you can skip this section since it contains a lot of basic information.

#### Why we need it

***TL; DR;***

- Due to the runtime and core libraries, asynchronous operations are required (and cannot be turned into synchronous operations)
- Async/Await is the most idiomatic way to handle asynchronous code in JavaScript

If you ever worked with Sakuli and followed our ["Getting started"](/Docs/start) guide, you might have noticed one of the most obvious paradigmatic changes regarding the test syntax: The wrapping `(async () => /*...*/)();` and the extensive use of `await`. This is due to the new runtime <a href="https://nodejs.org" target="_blank">Node.js</a> and its asynchronous nature. Node.js executes scripts in a single-thread and therefore makes heavy use of asynchronous operations avoiding to block the execution within the thread. The underlying JavaScript engine is <a href="https://v8.dev/" target="_blank">V8</a> (which also powers the JavaScript execution in <a href="https://www.chromium.org/Home" target="_blank">Chromium Browsers</a>). To make this asynchronous behavior possible, V8 uses a so called "Event-Loop" with a "Call-Stack" containing all deferred operations (like: reading a file, making a web-request, doing heavy computation and so on). <a href="https://www.youtube.com/watch?v=8aGhZQkoFbQ" target="_blank">This talk</a> explains this behavior in a short and entertaining way. A good illustration for the event loop is a (fast-food) restaurant, where you place an order at the counter and get a receiver that informs you when your food is ready. Now you can do something else in the meantime while not blocking other processes or being blocked by them until you get your food and can do further operations (e.g. eat your meal).

But how does all this effect Sakuli? Sakuli v1 was running within a Java Virtual Machine and the test scripts were executed within the <a href="https://developer.mozilla.org/de/docs/Rhino" target="_blank">V8</a> (JavaScript Runtime for the JVM) - its fundamental treatment of asynchronous operations completely differs compared to Node. Simply said, everything in Java is blocking until you make it non-blocking, while in Node (many) operations are non-blocking by default. In Java for example it is a rather common custom to run while-loops until the asynchronous operation sets its condition to false. This repl displays the basic idea: <a href="https://repl.it/@tnobody/non-blocking-vs-blockingjava" target="_blank">V8</a>.

 "Unfortunately", it is not (easily) possible to turn non-blocking operations into blocking operations in Node (<a href="https://repl.it/@tnobody/non-blocking-vs-blockingjs" target="_blank">have a look at this repl</a>) and Sakuli's core technologies (Selenium-WebDriver and nut.js) make heavy use of asynchronous operations. There are tools like <a href="https://www.npmjs.com/package/fibers" target="_blank">fibers</a> that can help you, but they rely on native (OS-dependent) libraries. Therefore, we have decided to avoid another OS specific library in Sakuli.

Last but not least: Using and writing asynchronous code is the most idiomatic way to write JavaScript nowadays. Using async/await is a kind of syntactic sugar, which lets us write asynchronous code like it would be synchronous just by using the `await` keyword. A short look back in the old days makes it clear how JavaScript landed there:

Back then, the most common way to handle asynchronous code was via callbacks. They were passed on to the asynchronous operation where they were executed as soon as the initial operation was finished. This approach was useful and acceptable for the usual JavaScript use-case during those days: Handling events in the DOM. But when Node was released and many browser applications became more and more complex, the developers ended up with a so called <a href="http://callbackhell.com/" target="_blank">callback hell</a>. To exit this callback hell, ES6 introduced the <a href="https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">Promise class</a>. The advantage of a Promise is its ability to chain with other Promises, making it way more elegant to write subsequent, dependent asynchronous operations. A good read on this topic can be found on chapter VIII of <a href="https://exploringjs.com/impatient-js/toc.html" target="_blank">JavaScript for impatient programmers</a>

#### The async wrapper

You might have noticed that if a testcase in Sakuli v2 is wrapped within `(async () => /*...*/)().then(done)` this construct it is called *Immediately Invoked Function Expression* (IIFE). Basically, it is the definition of a function that is immediately invoked. This pattern is widely used in JavaScript to preserve scopes and namespaces, since every symbol, which is defined at the top level of a script, becomes part of the global namespace and may potentially collide with other scripts. In the era of <a href="https://medium.com/fusebox/beginner-web-developers-use-a-bundler-31ab0c91d2f5" target="_blank">web bundler</a> and <a href="https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/" target="_blank">ES-modules</a> this use-case became more and more irrelevant. IIFE on the other hand still remains important after the introduction of async/await in JavaScript. One caveat of this syntax is, that the `await` keyword is only available within an asynchronous function - because the engine will wrap the whole body of this function within a Promise. That means, that in order to be able to make use of the `await` keyword, your code has to be executed within an asynchronous function. On the top level IIFE, we declare the actual function as `async` and can make use of `await`. Since the result of this function is automatically turned into a Promise, we can invoke `then` and pass the `done` function to it. `done` is a Sakuli specific function, which indicates to Sakuli that the testcase script is finished. There is currently a discussion on the <a href="https://github.com/tc39/proposal-top-level-await" target="_blank">JavaScript proposal in stage 3</a>, which would introduce a *top level await* in JavaScript.

If you want to avoid this construct completely, you can use the `then` function of a Promise. The example code of the <a href="/Docs/getting-started" target="_blank">Getting started</a> guide would look like this then:

{{< highlight typescript >}}

const testCase = new TestCase();

_navigateTo("https://sakuli.io")
    .then(_ => testCase.endOfStep("Open Landing Page", 5, 10))
    .then(_ => _click(_link("Getting started")))
    .then(_ => _click(_link("Initialization")))
    .then(_ => _highlight(_code("npm init")))
    .then(_ => testCase.endOfStep("Find npm init code sample"))
    .catch(e => testCase.handleException(e))
    .then(_ => testCase.saveResult())
    .then(done);

{{< / highlight >}}

This is also a totally valid format that can be used within Sakuli. However, this approach has two downsides:

- If you are less familiar with JavaScript, it could become harder to read and understand
- The examples mentioned in the Sakuli documentation will mostly use the await/async syntax

Due to those reasons, we would advise you not to use the `.then(...)` syntax, unless you are completely sure about what you are doing.

#### Async Functions

Most functions which implement the <a href="https://sahipro.com/docs/sahi-apis/index.html" target="_blank">Sahi DSL</a> - recognizable by a prefixed underscore - return a Promise. That means, that you should put an `await` in front of it. Exceptions from this pattern are [Accessor functions](/apidoc/sakuli-legacy/interfaces/accessorapi.html), which create query objects to access elements in the DOM. You can check if the function returns a Promise in the [API docs of SahiAPI](apidoc/sakuli-legacy/interfaces/sahiapi.html). If you are not sure that you need an `await`, you can put it anyway since the function will be executed as expected. Considering that this is not a good practice, we are working on tools which will help you identify async functions like <a href="https://github.com/sakuli/sakuli/tree/feature/ts-support" target="_blank">Typescript support</a>.

#### Thenable Classes

Sakuli has some classes - especially those for native interactions - which implement the <a href="https://de.wikipedia.org/wiki/Fluent_Interface" target="_blank">Fluent Interface pattern</a>, where you can chain method invocations on the same object. Unfortunately, this does not really play nice with asynchronous operations. Methods of a fluent API always return the object itself or at least an instance of the same class. But an asynchronous (and awaitable) method rather needs to return a Promise. To still accomplish the goal of backward compatibility, all classes implementing a fluent interface and including asynchronous methods are wrapped in a `Thenable<ClassName>` form of itself. This concept is highly inspired by Selenium-WebDrivers <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html" target="_blank">ThenableWebDriver</a>. From an end-user perspective, you can use the fluent interface almost like before, except of a little `await` at the beginning:

{{< highlight typescript >}}

// With Thenable classes; Assuming we are in the context of an async function
await screen.find('button.png').click();

// Without Thenable class
screen.find('button.png')
    .then(screen => screen.click());

{{< / highlight >}}

**Thenable Classes are**:

- [Application](/apidoc/sakuli-legacy/interfaces/thenableapplication.html)
- [Environment](/apidoc/sakuli-legacy/interfaces/thenableenvironment.html)
- [Region](/apidoc/sakuli-legacy/interfaces/thenableregion.html)

The technical trick behind this is, that there are two implementations: The actual class with the async functions and a `thenable` class, which implements the PromiseLike interface. The PromiseLike interface basically forces a `then` function to be implemented and is therefore "awaitable". The wrapper class also holds a Promise with the instance to the actual class. When a method of the thenable class is invoked, it delegates the call to the same method of the actual class and returns itself with the Promise given back by the actual method. Since the thenable class itself is a Promise, it will resolve to an instance of the actual class.

### _include and _includeDynamic

If you ever wrote larger or different testcases on the same system, you might have come up with a modularization of commonly used functions. For example, the login to a system is always the same in all testcases, so you put it into a separate file.

Sakuli v1 includes functions to load these files into your actual testcase: `_include` or `_includeDynamic`. The code usually looks like this:

`<TESTSUITE>/common/login.js`:
{{< highlight typescript >}}

function login($user, $password) {
    //... login logic
}

{{< / highlight >}}

`<TESTSUITE>/testcase/case.js`
{{< highlight typescript >}}

_include('../commons/login.js');

try {
    var testcase = new TestCase('');

    login('user', 'password');

    // actual test code
} catch(e) {
    testcase.handleException(e);
} finally {
    testcase.saveResults();
}

{{< / highlight >}}

Two interesting aspects can be observed here:

- Functions defined in the included script were added to the global namespace
- It is not an idiomatic way to require dependent code in JavaScript (nowadays)

Sakuli now introduces support for <a href="https://2ality.com/2014/09/es6-modules-final.html" target="_blank">ES-module syntax</a>. To adapt the example above, it has to be rewritten as follows:

<i class="fas fa-file"></i>  `<TESTSUITE>/common/login.js`
{{< highlight typescript >}}

export async function login($user, $password) {
    //... login logic
}

{{< / highlight >}}

<i class="fas fa-file"></i> `<TESTSUITE>/testcase/case.js`
{{< highlight typescript >}}

import {login} from './../commons/login';

try {
    var testcase = new TestCase('');

    await login('user', 'password');

    // actual test code
} catch(e) {
    testcase.handleException(e);
} finally {
    testcase.saveResults();
}

{{< / highlight >}}

Beside the added async/await keywords, we can see that the first line of each script changed. In the first script, all functions (or classes, enums, constants, etc) have to be explicitly exported by the script ("module" would be a more accurate term) if they should be used in other scripts. For the actual testcase script the `_include` function will be removed and replaced by an `import`. The `import` ensures that we only import symbols that are required in the current script and its *global* namespace. Each function required in the testcase script has to be imported explicitly. An alternative syntax is to import everything within its own namespace:

{{< highlight typescript >}}

import * as loginUtils from './../commons/login';

// omitting boilerplate code

await loginUtils.login('user', 'password');

{{< / highlight >}}