---
title : "Optical character recognition (OCR)"
date :  2020-12-18T13:55:46+01:00
weight : 10
---

# Optical character recognition (OCR)

**This feature is currently a tech preview!**

With optical character recognition (OCR) it is possible to convert screen content into text. In combination with Sakuli, 
OCR it is also possible to automate software based on the text shown on screen.

## OCR in enterprise containers
Sakuli enterprise containers ship with a complete setup to use the OCR features of Sakuli. OCR features can be used
without any further set up. Please have a look at the 
[enterprise containers documentation](/docs/enterprise_features/container) for more information about container usage.

## Installing Sakuli OCR
Installing the OCR module of Sakuli on a workstation or virtual machine is possible, but requires some additional steps
and dependencies. We recommend, to use the ready-to-use enterprise container for most use cases. A native installation
should only be considered, if the enterprise containers don't fit the requirements of your check.

### Add OCR module to package.json
To add the OCR module, please add `"@sakuli/ocr": "next"` to your `package.json`.

```json
{
  "name": "sakuli-project",
  "version": "0.8.15",
  "scripts": {
    "test": "sakuli run test-suite"
  },
  "dependencies": {
    "@sakuli/cli": "next",
    "@sakuli/ocr": "next"
  }
}
```

After altering your `package.json`, the module can be installed with `npm install` on command line.

> Please make sure that you have access to the enterprise npm package repository as well as a valid license of Level M
> or higher. For more information on how to set up your access to enterprise packages, please have a look at the 
> [enterprise features documentation](/docs/enterprise_features).

### Installing Tesseract
Sakuli OCR uses Tesseract to read text from the screen. For performance and quality reasons, a native installation of 
tesseract is required. Please ensure to install a Tesseract version >= **4.1.1**. For more information on how to obtain
and install Tesseract on your machine, please have a look at the
[official Tesseract documentation](https://github.com/tesseract-ocr/tessdoc/blob/master/Downloads.md).

## Extracting text from screen
To read text from the screen, Sakuli OCR ships with the test step `_getTextFromRegion()`. The function returns all text
on the screen including line feeds.

### Reading the whole screen
```typescript
const text = await _getTextFromRegion(new Region());
```

### Reading text from a specific region
```typescript
const regionToRead = new Region(50, 100, 400, 50);
const textOfRegion = await _getTextFromRegion(regionToRead);
```

`new Region(100, 100, 400, 50);` creates a region with the following specification:
- x = 50 px
- y = 100 px
- width: 400 px
- height: 50 px

The constant `textOfRegion` will only contain the text from this specific region of the screen.


## Finding a screen region by text
With Sakuli, it is also possible to automate software based on the text shown on the screen. `_getRegionByText()`
provides the possibility to search for a specified text on the screen or in a specified region of the screen. Once the
location of the text is determined, it is possible to e.g. move the mouse to the location and click on it. 

```typescript
await _getRegionByText("Continue").click();
```
This sample would search the screen for the text "Continue" and subsequently click on it.

```typescript
const searchRegion = new Region(50, 100, 400, 50);
await _getRegionByText("Continue", searchRegion).click();
```

`new Region(100, 100, 400, 50);` creates a region with the following specification:
- x = 50 px
- y = 100 px
- width: 400 px
- height: 50 px

In this sample, the search for the text "Continue" would be limited to the specified screen region.

## Combining OCR features
One common use case would be to extract text from a certain region of the screen e.g. from an offer or invoice for
further validation.   

![offer](/images/consol_offer.png)

```typescript {hl_lines=["5-6"]}
(async () => {
  const testCase = new TestCase("Check offer");
  try {
    // ...
    const offerNumberRegion = await _getRegionByText("offer number").grow(10);
    const offerNumber = await _getTextFromRegion(offerNumberRegion);
    
    const expectedOrderNumber = /42-XBC-09453/;
    await _assert(Promise.resolve(!!offerNumber.match(expectedOrderNumber)),
      `Found ${offerNumber} instead of ${expectedOrderNumber}`);
    // ...
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();
```

This check would search for the "offer number" in the pdf, extract the whole offer number and compare it to an expected
value.

## Troubleshooting
The quality of OCR results highly depends on the screen content. Here are some aspects to consider when OCR does not
recognize the text you expect:

- A lower screen resolution might help due to bigger fonts
- Bigger fonts are better than smaller fonts
- High contrasts are helpful. Reading yellow text from white background might cause issues.
  
In case you want to have some insights in what tesseract "sees" through a Sakuli automation, you can easily adapt log
levels to show details of the OCR process.

- Debug Level
  - provides the tesseract cli call for reconstruction purposes
  - provides the tesseract config on cli level 
  - provide details on post processing of the screen content
- Trace Level
  - writes the received text from `_getTextFromRegion()` to the logs
  - write the received alto xml from `_getRegionByText()` to the logs
  
## Known issues
- There is currently a bug in an upstream library causing [issues with OCR on macOS](https://github.com/nut-tree/nut.js/issues/194).