+++
title = "Tabs"
date =  2020-07-20T12:41:40+01:00
weight = 5
+++

# How can I handle tabs in Sakuli?

### Switch focus to another tab

The simplest way to switch the tab is based on the position of the tab. This snippet, for example, will switch to the second tab of the browser.
{{<highlight javascript>}}
let handles = await driver.getAllWindowHandles();
await driver.switchTo().window(handles[1]);
{{</highlight>}}

To switch back to the first tab, we can use:
{{<highlight javascript>}}
await driver.switchTo().window(handles[0]);
{{</highlight>}}


### Closing a tab

You can close the **currently focused** tab with:
{{<highlight javascript>}}
await driver.close()
{{</highlight>}}

**Note**: if there is only one tab open and `driver.close()` is used, the browser will be closed. This would severely affect the functionality of Sakuli.


### Example

The following snippet shows how to work with tabs. First, a link is clicked which opens a new tab.
Then a code box is highlighted, the tab is closed again and the focus switches back to the original tab.

{{<highlight javascript>}}
(async () => {
  const tc = new TestCase("Demonstration on how to handle tabs");
  try{
    await _navigateTo("https://sakuli.io");
    await _click(_link("Docs"));

    //switch focus to the opened tab
    let handles = await driver.getAllWindowHandles();
    await driver.switchTo().window(handles[1]);

    //do some stuff on the new tab
    await _highlight(_code("npm init"))

    //close the tab and switch back to the first tab
    await driver.close()
    await driver.switchTo().window(handles[0]);

    //the focus is back to sakuli.io
    await _highlight(_link("Features"));
  } catch (e) {
    await tc.handleException(e);
  } finally {
    tc.saveResult();
  }
})();
{{</highlight>}}

