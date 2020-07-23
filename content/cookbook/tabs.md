+++
title = "Tabs"
date =  2020-07-20T12:41:40+01:00
weight = 5
+++

# How can I handle tabs in Sakuli?

The simplest way to switch the tab is based on the position of the tab. This snippet for example, will switch to the second tab of the browser.
{{<highlight javascript>}}
let handles = await driver.getAllWindowHandles();
await driver.switchTo().window(handles[1]);
{{</highlight>}}

To switch back to the first tab, we can then use:
{{<highlight javascript>}}
await driver.switchTo().window(handles[0]);
{{</highlight>}}

When you are finished with the tab, you can close it with `driver.close()`. Afterward, we need to change the focus back to one of the open tabs.
{{<highlight javascript>}}
await driver.close();
await driver.switchTo().window(handles[0]]);
{{</highlight>}}

**Note**: if there is only one tab open and `driver.close()` is used, the browser will be closed. This would severely affect the functionality of Sakuli.
