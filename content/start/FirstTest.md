---
title : "First Setup"
date :  2019-09-10T15:30:30+02:00
weight : 4
---

# Setup

## Setup your first Test
Since we wanted to keep Sakuli mostly compatible to v1, the file layout looks basically the same for testsuites.

Each testsuite is located in its own particular folder. Generally, a testsuite represents the system you want to test. Therefore, you need to create that folder in your project root (where the package.json file is located):

{{< highlight bash >}}
mkdir my-sut
{{< /highlight >}}

To describe the testsuite and its testcases, two additional files are needed: `testsuite.properties` and `testsuite.suite`. These files are required for backwards compatibility (they might not be necessary in the future but will at least be supported). These files should be added to the `my-sut` folder:

{{< highlight bash >}}
cd my-sut
echo > testsuite.suite 
echo > testsuite.properties
{{< /highlight >}}

We can add the following contents to `testsuite.properties`:

{{< highlight bash >}}
echo testsuite.id=my-sut > testsuite.properties
{{< /highlight >}}

This is the minimum configuration for using Sakuli. The `.properties` file adds some metadata needed by the Sakuli-Runtime and can be changed to configure other things like forwarders or the default browser for the execution.

The `testsuite.suite` file tells Sakuli which testcases are running. The format is:

{{< highlight bash >}}
<FOLDER-NAME>/<FILE-NAME>.js <START_URL>
{{< /highlight >}}

The actual testcase file must be placed inside a folder (this is due to the format forced by Sahi in Sakuli v1). The start-url also needs to be added but has no effect in v2+.

With this in mind, we can add a testcase file:

{{< highlight bash >}}
mkdir my-testcase
echo > my-testcase/testcase.js
{{< /highlight >}}

And add the following information to the `testsuite.suite` file:

{{< highlight bash >}}
echo my-testcase/testcase.js https://sakuli.io > testsuite.suite
{{< /highlight >}}

After the setup you can add the actual testcode to `my-testcase/testcase.js`:

{{< highlight typescript >}}

(async () => {  // 1
    const testCase = new TestCase(); // 2
    try {
        // actual testcode goes here
    } catch (e) {
        await testCase.handleException(e); // 3
    } finally {
        await testCase.saveResult(); // 4
    }
})().then(done); // 5

{{< /highlight >}}

Let us examine this piece of code:

1. The whole test is wrapped in an async immediate invoked function. It allows us to use the async/await syntax of ES6. Since Sakuli makes heavy use of async operations, it makes your code more readable.
2. To provide Sakuli information about our actual testcase, we create a TestCase object, which handles the execution of a testcase.
3. If any error occurs during testing, it will be redirected to the TestCase object. It triggers Sakuli's internal error handling e.g. taking a screenshot of the actual failed test execution.
4. Regardless of a failed or passed test execution, Sakuli saves all results. This is more like a legacy artifact and will be removed in the future.
5. When the async code within the main function (see 1.) is completed, a callback passed to the `then` function is invoked. `done` is a global function, which is injected by Sakuli and which tells the engine that the test execution is over (in theory you could call this function `done()` but the syntax above is recommended).

## Write your first test
Let us write a simple test using the Sakuli.io homepage as test subject. This test will verify if our "Getting Started" guide that you are reading at this very moment is still accessible.

{{< highlight typescript  >}}

(async () => {
    const testCase = new TestCase();
    try {
        await _navigateTo("https://sakuli.io");                  // 1
        testCase.endOfStep("Open Landing Page", 5, 10);          // 2
        await _click(_link("Getting started"));                  // 3
        testCase.endOfStep("Navigate to Getting Started", 3, 5);
        await _highlight(_code("npm init"));                     // 4
        testCase.endOfStep("Find npm init code sample");
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})().then(done);

{{< /highlight >}}

1. Since we are dealing with a web test, the first thing we want to do is to `_navigateTo` our target page. Instead of manually setting up the correct WebDriver instance, we just have to provide a target URL. Sakuli will take care of the rest for us. `await` indicates that we are patiently waiting for our page to load before we continue with our next testing step.
2. Once our initial page load has been completed, it is of our great interest to know how long it took to render. When it comes to runtime, Sakuli does not only measure the execution time of testcases, but also allows to split a single testcase into several logical steps. This way it becomes possible to accurately measure the runtime of certain processes like e.g. *login*, *shopping cart*, *checkout* and so on. By calling `testCase.endOfStep("Open Landing Page", 5, 10);`, we are ending our first step, the initial page load. Additionally, it is also possible to specify `warning` and `critical` thresholds for each step. Whenever a step exceeds one of these values, the result will change from `OK` to `WARNING` or `CRITICAL`.
3. With Sakuli it becomes very easy to interact with web elements. In our current example, we want to `_click` a `_link` which is identified by some given text. Once again, we do not have to take care of many details, as Sakuli will do most of the heavy lifting for us. We are just passing the link text to Sakuli, which will search for our desired element using multiple identifiers. This way we do not have to worry about using an ID, a CSS selector or something else to identify our element. As we have already seen in our first test action, `await` will wait until the test action has been completed.
4. In some cases, it is really helpful to visually verify test execution. Sakuli comes with a built-in `_highlight` function, which will highlight an element with a bright red border. Although being useful, `_highlight` should be used carefully since it will increase the overall testing runtime.

## Execute your first test

Since Sakuli 2 is built with Node, there are at least two different ways to execute a Sakuli test. We will take a look at each one of them.
Organizing tests as NPM projects makes it easier for you to distribute testcode.
Everything required to execute the test is described in a project config, so tests should be ready to use after running `npm install` inside a project. 👍

### [npx](https://www.npmjs.com/package/npx)

Because of the way we have set up and configured our project in this guide, Sakuli is only available to this particular project. `npx` is a really handy tool, which allows us to execute our Sakuli CLI directly from the command line, even though we did not add it to the system `PATH`.

In order to run our first test, we just have to execute `npx sakuli run my-sut` inside our project folder (e.g. `/tmp/sakuli_starter` on *nix).
By default, Sakuli will pick up the browser configured in the `testsuite.properties` file, but with npx it is possible to change the browser on the fly:
<img src="/images/gettingstarted/simple_sakuli_test.png" alt="Successful Sakuli test execution" style="max-width: 400px; float:right" />

{{< highlight bash >}}npx sakuli run my-sut --browser chrome{{< /highlight >}}
This command will execute our test in Chrome.

Regardless of the browser choice, as long as our site did not slow down, you should see a successful test result, similar to the image on the right.
The advantage of running your tests with `npx` is the flexibility to easily customize your test runs without having to edit files.