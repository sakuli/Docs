---
title : "Optical character recognition (OCR)"
date :  2020-12-18T13:55:46+01:00
weight : 10
---

# Optical character recognition (OCR)

**This feature is currently a tech preview!**

With optical character recognition (OCR) it is possible to convert screen content into text. In combination with Sakuli, 
OCR it is also possible to automate software based on the text shown on screen.

## OCR in Enterprise containers
- everything setup
- tesseract pre-installed
- just use ocr functionality in check/test

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
    "@sakuli/legacy-types": "next",
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
- `await _getTextFromRegion(region)`
- return text string

## Finding a screen region by text
- `await _getRegionByText(text, searchRegion?)`
- returns ThenableRegion

## Troubleshooting
- Low Screen resolution is better than higher screen resolutions
- Bigger fonts are better than smaller fonts
- high contrasts are better than low contrasts
- logging
  - Debug
    - provides tesseract call for reconstruction
    - provides insights on tesseract config 
    - provides insights on post processing
  - Trace
    - dumps received test from `_getTextFromRegion(region)`
    - dumps received alto xml from `_getRegionByText(text, searchRegion?)`
  
## Known issues
- Screenshots on mac