---
title : "Screenshot"
date :  2019-09-12T13:18:02+02:00
weight : 4
---

# Screenshot based Testing
A lot of E2E scenarios exceed the capabilities of browsers and webdrivers. This might include common use-cases like a drag and drop from the host system to a webpage or exporting a report into a spreadsheet or PDF-format. In these cases, your web-based tests can be extended to also validate behavior and invoke interactions outside the browser, all within a single test.

Of course, you can also use Sakulis native testing power on its own, e.g. rich-client testing of SAP, office or proprietary software systems. Sakuli accomplishes its native capabilities by scanning the whole screen (or a dedicated region) on a stand-alone computer or in headless container screens, searching for provided image patterns.

Screenshot based actions are relying on an abstract `Region` class, which represents an abstract region on the desktop.
When creating a new instance without parameters, a `Region` spans over the whole desktop.
But, it is also possible to create new regions by specifying `left`, `top`, `width` and `height` parameters.

The following example represents a test which drags a source element to a target region.
In this demo scenario, both source and target are both located on screen via template image.
To reproduce this scenario, you need to capture screenshots of the egg and the pan.

{{< highlight typescript >}}
(async () => {
    const testCase = new TestCase("native_keyboard_demo");
    const url = "https://codepen.io/naturalhanglider/full/jQMWoq";
    const screen = new Region();
    const env = new Environment();
    try {
        await _navigateTo(url);
        await env.setSimilarity(0.8);
        await screen
            .find("source_egg.png")
            .mouseMove()
            .dragAndDropTo(
                await screen.find("target_pan.png")
            );
        await _wait(3000);
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        testCase.saveResult();
    }
})();
{{< /highlight>}}

<!--self built wrapper with a frame and shaddow
<div style="background-color: #fff; padding: 20px; margin-top:10px; margin-bottom:10px; box-shadow: 0px 0px 5px #383838;">
</div>
-->

{{<video "/videos/FryAnEgg.mp4">}}


The `dragAndDropTo(...)` methods always move straight to the target region.
In order to follow a more complex path, it is also possible to perform the drag gesture manually.
Once the source image has been located on the screen, Sakuli moves the mouse to its location, presses and holds the left mouse button.
Afterwards, it locates the target image, moves the mouse there while still holding the mouse button and releases it, once it reaches the target location.
To reproduce this scenario, you need to capture screenshots of the egg and the pan.

{{< highlight typescript >}}
(async () => {
    const testCase = new TestCase("native_demo");
    const url = "https://codepen.io/naturalhanglider/full/jQMWoq";
    const screen = new Region();
    const env = new Environment();
    try {
        await _navigateTo(url);
        await env.setSimilarity(0.8);
        await screen
            .find("source_egg.png")
            .mouseMove()
            .mouseDown(MouseButton.LEFT)
            .setX(0)
            .setY(0)
            .mouseMove()
            .move(200, 700)
            .mouseMove();
        await screen.find("target_pan.png")
            .mouseMove()
            .mouseUp(MouseButton.LEFT);
        await _wait(3000);
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        testCase.saveResult();
    }
})();
{{< /highlight >}}

## How to Control the Mouse in a Sakuli Test

Before using a `region` it is best to instantiate a `region` over the entire display, to use it multiple times shown in
the examples above.

### Moving the mouse to a screenshot

To find a screenshot on the screen, you can use `find` or `waitForImage`. With `waitForImage` you can specify a timeout
in which Sakuli continuously searches for the screenshot. This is useful, when e.g. starting a program like excel.

{{< highlight typescript >}}
await screen.find("search_this_screenshot.jpg")
    .mouseMove();
    
//searches the screen for 5 seconds for the excel homescreen
await screen.waitForImage("excel_homescreen.jpg", 5000)
    .mouseMove();
{{< /highlight >}} 

`find` and `waitForImage` will return a `Region` for matched screenshots, so chaining as follows might not work, if the second
screenshot is not within the `Region` of the first one.
{{< highlight typescript >}}
await screen.find("google_search.png")
    .mouseMove()
    .find("browser_address_bar.jpg")
    .mouseMove();
{{< /highlight >}}

### Moving the mouse relative to current position
A method to change the position is to use the `move()` method. This allows us to shift the used region, e.g.
{{< highlight typescript >}}
await screen.find("login_mask.png")
    .mouseMove()
    .click()
    .type("MyUsername")
    //shifts the region 50px down to e.g. a password field
    .move(0,50)
    //moves the mouse according to the shifted region
    .mouseMove()
    .click()
    .type("MyPassword")
    //shifts the region 50px down and 50px to the right and moves the mouse to e.g. the login button
    .move(50,50)
    .mouseMove()
    .click();
})();
{{< /highlight >}}


### Moving the Mouse to an Absolute Position

As mentioned before, you need to create a region with a width and heigth of 1 and your x/y coordinates.
{{< highlight typescript >}}
//moves the mouse cursor to (100/200)
await new Region(100, 200, 1, 1).mouseMove();
{{< /highlight >}}

### Drag And Drop
There are two ways to use drag and drop. Firstly, you can use `dragAndDropTo()`, which drags from one point to another.
{{< highlight typescript >}}
await screen.find("drag_mouse_start.png").mouseMove().dragAndDropTo(new Region(200,200,1,1));

await new Region(300,300,1,1).mouseMove().dragAndDropTo(new Region(1000, 1000, 1, 1));

await new Region(0,0,1,1).mouseMove().dragAndDropTo(await screen.find("drag_mouse_end.png"));
{{< /highlight >}}

Using `mouseDown`/`mouseUp` allows us to drag and drop over multiple locations.
{{< highlight typescript >}}
await screen.find("drag_mouse_start.png")
    .mouseMove()
    .mouseDown(MouseButton.LEFT)
    .move(200,200)
    .mouseMove()
    .move(-100, -100)
    .mouseMove()
    .mouseUp(MouseButton.LEFT);
{{< /highlight >}}

`mouseUp`/`mouseDown` can be used with either `MouseButton.LEFT`, `MouseButton.MIDDLE` or `MouseButton.RIGHT`.


`Region` also provides methods to use the keyboards, which also are implemented by `Environment`. This allows for easy
chaining, like 
{{< highlight typescript >}}
await screen.find("google_search.png")
    .mouseMove()
    .click()
    .type("sakuli.io")
    //moves to the search button
    .move(-100, 100)
    .mouseMove()
    .click()
    .sleepMs(1000)
    //moves to the first search result
    .move(-400,100)
    .click();
{{< /highlight >}}
