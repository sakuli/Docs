---
title: "Getting Started"
pre: "<i class='fas fa-chevron-right'></i>  "
date:  2019-09-10T15:21:15+02:00
weight: 1
---

# Easy Start
The following video shows a quick introduction on how to install and bootstrap **Sakuli** and how to setup and start your first UI-Test on a MAC computer. For a detailed installation procedure, please click the green arrow to the right or navigate through the table of content on the left navigation pane.

{{<video "/videos/GettingStarted_v2.mp4">}}

## Steps to reproduce Easy Start
Prerequisite is a Node v12 (lts/erbium) installation on your Mac.

{{< highlight bash >}}
npm init
{{< /highlight >}}

Accept all questions with Enter key.

{{< highlight bash >}}
npm i @sakuli/cli
{{< /highlight >}}

{{< highlight bash >}}
npm i chromedriver
{{< /highlight >}}

{{< highlight bash >}}
npx sakuli create project . my-demo
{{< /highlight >}}

Open the file `check.js`and insert the following Test-Script:

{{< highlight typescript >}}
(async () => {
    const testCase = new TestCase();
    try {
        await _navigateTo("https://sakuli.io");
        testCase.endOfStep("Open Landing Page", 5, 10);
        await _click(_link("Getting started"));
        await _click(_link("Initialization"));
        testCase.endOfStep("Navigate to Initialization Section", 3, 5);
        await _highlight(_code("npm init"));
        testCase.endOfStep("Find npm init code sample");
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
{{< /highlight >}}

{{< highlight bash >}}
npx sakuli run my-demo
{{< /highlight >}}
