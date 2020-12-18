---
title : "Optical character recognition (OCR)"
date :  2020-12-18T13:55:46+01:00
weight : 10
---

# Optical character recognition (OCR)

## Installing Sakuli OCR
- npm private repo access
- min M-License
- add `@sakuli/ocr` to package.json + `npm i`
- Tesseract >= 4.1.1 hard dependency
- known issues
  - Screenshots on mac

## OCR in Enterprise containers
- everything setup
- tesseract pre-installed
- just use ocr functionality in check/test

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