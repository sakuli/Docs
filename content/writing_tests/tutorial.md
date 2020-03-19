---
title : "Tutorial"
date :  2019-09-12T13:16:37+02:00
weight : 7
---

# Tutorial

After learning about the native and DOM-based testing capabilities of Sakuli, show a demonstration what you probably need
to set up a monitoring check. The 10 do's and don'ts is a nice guideline to start, on what should be checked.

We will use the sakuli docs page, which you are on right now, but starting from the sakuli.io page.
The complete test will be at the bottom of the page.

## Setting up a Sakuli Test Suite

Sakuli will bootstrap a test suite with following command. A detailed explanation on what files are needed, can be found
[in anatomy chapter](anatomy.md).
{{< highlight bash >}}
npx @sakuli/cli create project . --package
npm i
{{< /highlight >}}

### Typescript

This step is optional but we recommend using typescript. For example, in case of a missing `await` typescript will throw
an error during compilation. But this tutorial will also work if you decide to not use typescript.
 
{{< highlight bash >}}
npx sakuli enable-typescript .
{{< /highlight >}}

We also need to rename `sakuli_test_suite/case1/check.js` to `check.ts`

## Native-testing Tutorial

The example for this tutorial is to open the `10 Step Guide to E2E Monitoring` whitepaper only with native interaction
and download the . For this we are going to set `testsuite.uiOnly=true` in the testsuite.properties.

First we are going to open a chromium browser and navigate to the whitepaper section to download the whitepaper.
{{< highlight typescript >}}
(async () => {
  const tc = new TestCase();
  const env = new Environment();
  const chromium = new Application('chromium-browser --incognito');
  const screen = new Region();

  await tc.addImagePaths('./assets');
  try {
    await env.setSimilarity(0.99);

    await chromium.setSleepTime(3);
    await chromium.open();

    await env.type('sakuli.io/wp')
      .type(Key.ENTER)
      .getRegionFromFocusedWindow()
      .waitForImage('open_whitepaper.png', 3)
      .mouseMove()
      .click();
    tc.endOfStep('open whitepaper');

  } catch (e) {
    await tc.handleException(e);
  } finally {
    tc.saveResult();
  }
})();
{{< /highlight >}}

So let's have a closer look on the code. First we are want to open the chromium in incognito mode so we added the parameter.

Because we are going to use multiple screenshot, we are going to add them to a new folder to remove cluttering of the
testcase folder. Hence you need to use `tc.addImagePaths("./assets")` to tell Sakuli to look into this folder. The base
directory during the Sakuli test is the corresponding testcase folder.

Next we are setting the similarity level for image recognition. The higher the value you choose, the higher the matching
score must be. You can change this during your test.

After this we are setting the sleeptime of our application, which is just a timeout after trying to open the application.
This time is needed because the operating system needs to load the application.

After the chromium browser is opened we type the url we want to navigate to. Now we can get the region of the desktop to
search for icon of the whitepaper:
<img src="/images/tutorial/open_whitepaper.png" />

After clicking the icon the whitepaper will open in a new tab. Now we want to verify whether the whitepaper was opened
correctly. So we try to find it with to following screenshot.
<img src="/images/tutorial/whitepaper.png" />

So we add the following lines to our test

{{< highlight typescript >}}
await env.setSimilarity(0.98);
await screen.waitForImage('whitepaper.png', 3);
tc.endOfStep('validate open whitepaper');
{{< /highlight >}}

The last step is to print this whitepaper as a pdf. We can do this with the following code
{{< highlight typescript >}}
await env.type(Key.P, Key.CTRL)
  .getRegionFromFocusedWindow()
  .waitForImage("print_dialog.png",2)
  .mouseMove()
  .click()
  .sleep(1)
  .type("sakuli-tutorial")
  .type(Key.ENTER);
tc.endOfStep("download whitepaper");
{{< /highlight >}}

With `CTRL+P` we open the print dialog which could look like this.
<img src="/images/tutorial/print_dialog.png" />

Now we need to move the mouse to the save button and click. So we need to find the following image
<img src="/images/tutorial/print_dialog_save.png" />

Afterwards another pop up dialog appears, which allows us to change the name of the pdf-file.
For this instance we want to name it `sakuli-tutorial`.
In the end we need to press enter to save the file.

So the full Sakuli test should look like this.

{{< highlight typescript >}}
(async () => {
  const tc = new TestCase();
  const env = new Environment();
  const chromium = new Application('chromium-browser --incognito');
  const screen = new Region();

  await tc.addImagePaths('./assets');
  try {
    await env.setSimilarity(0.99);

    await chromium.setSleepTime(3);
    await chromium.open();

    await env.type('sakuli.io/wp')
      .type(Key.ENTER)
      .getRegionFromFocusedWindow()
      .waitForImage('open_whitepaper.png', 3)
      .mouseMove()
      .click();
    tc.endOfStep('open whitepaper');

    await env.setSimilarity(0.98);
    await screen.waitForImage('whitepaper.png', 3);
    tc.endOfStep('validate open whitepaper');

    await env.type(Key.P, Key.CTRL)
      .getRegionFromFocusedWindow()
      .waitForImage("print_dialog_save.png",2)
      .mouseMove()
      .click()
      .sleep(1)
      .type("sakuli-tutorial")
      .type(Key.ENTER);
    tc.endOfStep("download whitepaper");

    await chromium.close();
  } catch (e) {
    await tc.handleException(e);
  } finally {
    tc.saveResult();
  }
})();
{{< /highlight >}}



# Combining DOM and Native Testing

When the `testsuite.uiOnly` is set to `false`, you can use both simultaneously. For our example above we can remove opening
chromium with application and navigation to sakuli.io/wp via the address bar just with `_navigateTo()` as wells as for the click afterwards.

{{< highlight typescript >}}
(async () => {
  const tc = new TestCase();
  const env = new Environment();
  const screen = new Region();

  await tc.addImagePaths('./assets');
  try {
    await env.setSimilarity(0.99);

    await _navigateTo("https://sakuli.io/wp");
    await _click(_image(0, _in(_div("flexedContainer"))));
    tc.endOfStep('open whitepaper');

    await screen.waitForImage('whitepaper.png', 3);
    tc.endOfStep('validate open whitepaper');

    await env.type(Key.P, Key.CTRL)
      .getRegionFromFocusedWindow()
      .waitForImage("print_dialog.png",2)
      .mouseMove()
      .click()
      .sleep(1)
      .type("sakuli-tutorial")
      .type(Key.ENTER);
    tc.endOfStep("download whitepaper");

  } catch (e) {
    await tc.handleException(e);
  } finally {
    tc.saveResult();
  }
})();
{{< /highlight >}}