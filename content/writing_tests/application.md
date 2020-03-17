---
title : "Native applications"
date :  2019-09-12T13:18:58+02:00
weight : 5
---

# Interacting with a native application

Now that we have covered how to interact with an operating system and used screenshot based testing
capabilities of Sakuli, we can move on how to utilize one or multiple applications.
All features are incorporated in the <a href="https://sakuli.io/apidoc/sakuli-legacy/interfaces/thenableapplication.html" target="_blank">ThenableApplication Interface</a>.


### Open an application

To open an application, you enter the path to the application or respectively the application name, if you already
added it to your PATH environment variable. If your path contains spaces, you can escape them with `\\` because parameters
are separated with spaces.
{{< highlight typescript >}}
// path to excel 'C:\\path to excel dir\excel.exe'
const excel = new Application("C:\\path\\ to\\ excel\\ dir\excel.exe");

// open browser with parameters
const chromium = new Application("chromium-browser --incognito --proxy-server=localhost:1234");

// path to chrome is e.g. 'C:\\Program\\ Files\google-chrome\chrome.exe'
const chrome = new Application("C:\\Program\\ Files\google-chrome\chrome.exe --incognito");
{{< /highlight >}}

With `setSleepTime(seconds)` you can set the waiting time after opening an application. This is particularly useful for
larger applications that have an initial loading time.
{{< highlight typescript >}}
const calc = new Application("gnome-calculator");
//sleepTime of 1 second
await calc.setSleepTime(1)
    .open();
{{< /highlight >}}



### Closing an application
You can either use `close()` or `kill()`. `close()` sends a `SIGTERM` signal and `kill()` a `SIGKILL` signal to end the
process.

{{< highlight typescript >}}
await calc = new Application('gnome-calculator');

await calc.close();
await calc.kill();


//throws an exception if ending the process fails
await calc.close(false);
await calc.kill(false);
{{< /highlight >}}

### Combining with Region

Currently (Sakuli v2.3.0) it is not possible to get the region from the application or the focused window. Therefore the
following methods will return the desktop instead.

{{< highlight typescript >}}
const calc = new Application('gnome-calculator');

await calc.open()
    .getRegion()
    .mouseMove()
    .click();
    
await calc.open()
    .getRegionForWindow()
    .mouseMove()
    .click();
{{< /highlight >}}
