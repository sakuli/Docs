+++
title = "Waiting"
date =  2020-03-19T12:05:50+01:00
weight = 5
+++

# Waiting
In some cases, it might be required to wait for an animation to finish or for page to load dynamic content to use it in test cases or checks. To achieve this, Sakuli provides various options to wait a certain time or for a specified condition until test execution continues.

## Static wait

{{<highlight javascript>}}
// wait for three seconds
await _wait(3000);
{{</highlight>}}


## Wait for an element to be visible
{{<highlight javascript>}}
// wait for three seconds until the DIV "MyDiv" is visible
await _wait(3000, () => _isVisible(_div("MyDiv")));
{{</highlight>}}

## Wait for any condition to be met
It is possible to pass a boolean function (function returning `true` or `false`) as a second optional parameter of the `_wait()` action. Hence it is not only possible to wait until e.g. an item is visible on the website, but also for any boolean condition required in your use case. The [Sakuli fetch API](https://sakuli.io/apidoc/sakuli-legacy/interfaces/fetchapi.html) is a good point to start but you can also always define your own conditions in your test suite.  

{{<highlight javascript>}}
// wait at most three seconds until the first list item contains an entry "Sakuli".
await _wait(3000, () => _areEqual(_listItem(0), _listItem("Sakuli")));
{{</highlight>}}

{{<highlight javascript>}}
// wait at most three seconds until the textbox is enabled - e.g. after the form has been dynamically loaded.
await _wait(3000, () => _isEnabled(_textbox('enabled-input')));
{{</highlight>}}

{{<highlight javascript>}}
// wait at most three seconds until at least 10 products have been loaded.
await _wait(3000, () => _count('_div', 'product') >= 10);
{{</highlight>}}

## Wait until page stabilized
A very popular use case of the `wait()` function is to check for a certain element to be visible. Mostly this checks tries to verify that a certain asynchronous change has been finished. In some cases it is hard to identify an element to reliably ensure that such an asynchronous task has been finished. Therefore the [Sakuli action API](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html) provides a `_pageIsStable()` action.  

{{<highlight javascript>}}
// wait at most two seconds until the dom stabilized and check it in 200ms intervals.
await _pageIsStable();
{{</highlight>}}

{{<highlight javascript>}}
// wait at most five seconds until the dom stabilized and check it in 200ms intervals.
await _pageIsStable(5000);
{{</highlight>}}

{{<highlight javascript>}}
// wait at most five seconds until the dom stabilized and check it in 500ms intervals.
await _pageIsStable(5000, 500);
{{</highlight>}}

## Abort if page does not stabilize
In case the page is not able to stabilize in time, it might be required to abort the test case as e.g. a quality gate for loading the page has not been fulfilled. For such a use case, it is possible to wrap `_pageIsStable()` into assertions of the [Sakuli assertion API](https://sakuli.io/apidoc/sakuli-legacy/interfaces/assertionapi.html).

{{<highlight javascript>}}
// Wait for a stable DOM, stop test execution if it does not stabilize within timeout
await _assert(_pageIsStable());
{{</highlight>}}