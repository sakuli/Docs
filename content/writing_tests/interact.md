---
title : "Interact"
date :  2019-09-12T13:18:18+02:00
weight : 3
---

# Interacting with the environment

In addition to screenshot-based test actions, Sakuli is capable of utilizing your keyboard, clipboard and environment variables.
All these features are incorporated with the `ThenableEnvironment` interface.

### Environment variable
To get a environment variable you can use `getEnv(key)` or `getEnvMasked(key)`. Only difference between these two is the
log output. `getEnv(key)` will also output `key` unlike `getEnvMasked(key)`.
{{< highlight typescript >}}
const env = new Environment();
const path = await env.getEnv("PATH");

const homeDir = await env.getEnvMasked("HOME");
{{< /highlight >}}`

### Properties
You also might want to read some properties of your `sakuli.properties`/`testsuite.properties` file.
{{< highlight typerscript >}}
const env = new Environment();

const id = await env.getProperty("testsuite.id");
const browser = await env.getPropertyMasked("testsuite.) 
{{< /highlight >}}

Only difference
between these `getProperty(key)` and `getPropertyMasked(key)` is the log output. `getEnv(key)` will also output `key` unlike `getEnvMasked(key)`.

### getSimilarity/setSimilarity
For screenshot-based testing you can set the similarity in your `testsuite.properties` or `sakuli.propoerties` file as 
`sakuli.environment.similarity.default=0.99`. But you might want to adjust the similarity during the test. This is possible
with `setSimilarity(number)`.
{{< highlight typescript >}}
const env = new Environment();

await env.setSimilarity(0.83);   

//resets to the similarity set in sakuli.environment.similarity.default
await env.resetSimilarity()

const currentSimilarity = await env.getSimilarity();
{{< /highlight >}} 

### Screenshots
You can also take Screenshot during a Sakuli test, which will be saved on testsuite level.
{{< highlight typescript >}}
const env = new Environment();

//creates a screenshot with the filename "screenshot_during_test.png"
await env.takeScreenshot("screenshot_during_test.png");

//creates a screenshot with the filename "2020-02-29T23-59-59_screenshot_during_test.png"
await env.takeScreenshotWithTimestamp("screenshot_during_test.png");
{{< /highlight >}}

### Commands
With the `ThenableEnvironment` you can also run terminal commands. If the second parameter is set to true, Sakuli throws
an exception if the command exits with a code other than 0.
`runCommand` returns a <a href="https://sakuli.io/apidoc/sakuli-legacy/classes/commandlineresult.html" target="_blank">Command Line Result</a>.

{{< highlight typescript >}}
const env = new Environment();
const fileList = await env.runCommand("ls -al")

// both will never throw an exception even though sudo privileges are needed 
await env.runCommand("dpkg -i some_package.deb");
await env.runCommand("dpkg -i some_package.deb", false);

//this will throw an exception
await env.runCommand("dpkg -i some_package.deb", true);
{{< /highlight >}}

### OS
You can use this to identify your operating system
{{< highlight typescript >}}
const env = new Environment();
const os = await env.getOsIdentifier();

await env.isDarwin();
await env.isLinux();
await env.isWindows();
{{< /highlight >}}

## Keyboard actions

The following snippet shows a possible use-case for native keyboard actions.
When initiating a download in Firefox, a native file download dialog opens.
To start the download, we need to accept the file dialog, something that is not possible within the capabilities of Selenium.
With Sakuli you get the opportunity to work around this problem, just like a real user would do.
We can accept the file dialog by simply pressing the `Enter` button.
Use Firefox as a browser for this test to work, as Chrome simply downloads the file without user interaction:

{{< highlight typescript >}}
(async () => {
    const testCase = new TestCase("test");
    const url = "https://nodejs.org/en/";
    const env = new Environment();
    try {
        await _navigateTo(url);
        await _click(_link("ABOUT"));
        await _click(_link("Releases"));
        await _click(_link("Dubnium"));
        await _highlight(_link(/node-v10.\d{1,}.\d{1,}.tar.gz/));
        await _click(_link(/node-v10.\d{1,}.\d{1,}.tar.gz/));
        await _wait(3000); //wait for browser pop-up to activate
        await env.keyDown(Key.ENTER);
        await env.keyUp(Key.ENTER);
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        testCase.saveResult();
    }
})();
{{< /highlight >}}

It is even possible to change the download location dynamically in some environments, by entering a new save path via: 

{{< highlight typescript >}}
await env.type("/new/path/to/file");
{{< /highlight >}}

### Key Class
Sometimes it is necessary to use control keys to navigate through a application. For such a case you can use the `Key` class.
A list of all Keys can be found in our <a href="https://sakuli.io/apidoc/sakuli-legacy/classes/key.html" target="_blank">Legacy API docs</a>.
{{< highlight typescript >}}
const env = new Environment();

// open new tab in a browser
await env.type(Key.T, Key.CTRL);
// alternatively
await env.type("t", Key.CTRL);

// open a terminal in Ubuntu using two control keys
await env.type(Key.T, Key.CTRL, Key.ALT);
{{< /highlight >}}


### type/paste vs keyDown/keyUp
As you might have noticed, there are multiple ways to simulate keyboard input with Sakuli. On the one hand we have
`type(text: string, ...optModifiers: Key[])` and `paste(text: string)` and on the other hand there is `keyDown(...keys: Key[])`
with `keyUp(...keys: Key[])`.
If you just want to input text into a textbox, you might want to use `paste` because it just
pastes the text whereas `type` "simulates" the enduser and types every letter individually. With `type` it is also possible
to use modifier keys such as CTRL, CMD or ALT. So if you want to use a shortcut like opening a new Tab in a browser with
CTRL+T, you can handle it with `env.type(Key.T, Key.CTRL)`.
`keyDown`/`keyUp` is useful when you need a key pressed such as ctrl-click a link. This will open the link in a new tab.
{{< highlight typescript >}}
const env = new Environment();

await env.paste("Just paste this text somewhere");

await env.type("pls write this all in capital letters", Key.SHIFT);
//open print dialog
await env.type(Key.P, Key.CTRL);

await env.keyDown(Key.CTRL);
//click links to open in a new Tab or do something else
await env.keyUp(Key.CTRL);
{{< /highlight >}}

### Clipboard
You can also utilize the clipboard to paste a text.
{{< highlight typescript >}}
const env = new Environment();

//just presses CTRL+C
await env.copyIntoClipboard;

const clipboard = await env.getClipboard();

//just presses CTRL+V
await env.pasteClipboard()

await env.setClipboard("set this string into the clipboard");

{{< /highlight >}}

### Mouse Wheel
{{< highlight typescript >}}
const env = new Environment();
//scrolls down on a webpage 
await env.mouseWheelDown(10)

//scrolls up
await env.mouseWheelUp(5);
{{< /highlight >}}

### sleep
Similar to `_wait` in a Sakuli webtest, you can use `sleep(number)` or `sleepMs(number)` to wait on e.g. excel to start.
{{< highlight typescript >}}
const env = new Environment();

//waits 5 seconds
await env.sleep(5);

//waits 1 second
await env.sleepMs(1000);
{{< /highlight >}}

## Secrets

Many E2E tests require some kind of login.
While there is no problem in general, it still requires some mechanism to handle credentials.
Providing credentials via environment variable is a common practice, but it still is inconvenient when deploying the testcase to another system, since every single environment variable has to be migrated too.

Sakuli comes with a built-in mechanism to deal with sensitive data in testcases.
It uses a single masterkey, generated by Sakuli itself, to de- or encrypt secrets used in testcases.

Running

{{< highlight typescript >}}
npx sakuli create masterkey
{{< /highlight >}}

will generate a new masterkey, which should be exported as an environment variable `SAKULI_ENCRYPTION_KEY`.

Once the masterkey has been exported, secrets can be encrypted by running:

{{< highlight typescript >}}
npx sakuli encrypt "super secret string"
{{< /highlight >}}

These encrypted secrets can now be stored safely inside your testfile. The `ThenableEnvironment` interface provides methods to decrypt these secrets during test execution.

{{< highlight typescript >}}
await env.typeAndDecrypt("$ENCRYPTED_SECRET");
// alternatively, via clipboard
await env.pasteAndDecrypt("$ENCRYPTED_SECRET");

const secret = await env.decryptSecret("$ENCRYPTED_SECRET");
{{< /highlight >}}
