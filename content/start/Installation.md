---
title : "Installation"
date :  2019-09-10T15:29:27+02:00
weight : 3
---

# Installation Process

The following steps are required to set up Sakuli to work with multiple browsers.
Once the initial setup is done, we will dive right into our first test.

## WebDriver Installation

Sakuli utilizes the [WebDriver protocol](https://www.w3.org/TR/webdriver1/) to remote control browsers during test execution.
In addition to the browser itself, you need to install the corresponding WebDriver as well.
Several wrapper packages can be found on [npmjs.com](https://npmjs.com), which allow the installation of the required binaries via `npm`.

Since some users encountered issues with geckodriver on Firefox, we recommend using chromedriver for now. We are working on fixes and workarounds for geckodriver.

Therefore, Chrome is the preferred browser for running Sakuli tests at the moment. A suitable WebDriver can be installed via: 

{{< highlight bash >}}
npm i chromedriver
{{< /highlight >}}

or

{{< highlight bash >}}
yarn add chromedriver
{{< /highlight >}}

There are also WebDriver packages for [IE](https://www.npmjs.com/package/iedriver) and [Edge](https://www.npmjs.com/package/edgedriver).
macOS already ships a WebDriver for Safari, so there is no need to install an additional package.

Attention: Be careful to install the correct version of a WebDriver package according to the installed browser version. To install e.g. ChromeDriver for Chrome 73 you have to install:

{{< highlight bash >}}
npm i chromedriver@73.0.0
{{< /highlight >}}

Sakuli is not limited to work with only a single browser.
When installing multiple WebDriver packages, you can easily switch between different browsers.

Regarding Windows Users: You will have to manually add the respective WebDriver location to your system `PATH`, otherwise Sakuli will not be able to find and use it. Once you installed a WebDriver package via NPM, you will be prompted with its installation path, so you can easily add it to your `%PATH%` variable.

Sample path:
{{< highlight bash >}}
%USERPROFILE%\\AppData\\Roaming\\npm\\node_modules\\chromedriver\\lib\\chromedriver\\
{{< /highlight >}}

## Sakuli Installation

### 3rd-party dependencies

One of Sakuli's core components, [nut.js](https://github.com/nut-tree/nut-js), requires OpenCV.
Sakuli ships a pre-built version of OpenCV. Nonetheless, the installation still requires some 3rd-party dependencies.

### Windows

In order to install and run Sakuli on Windows you need two additional tools: [Python 2](https://www.python.org/downloads/windows/) and the [Windows Build Tools](https://www.microsoft.com/en-us/download/details.aspx?id=48159). 

To avoid eventual installation problems for Windows users we recommend to first install Python 2 on your system separately by downloading the required version from the official web page. Afterwards you can install the Windows Build Tools manually or via NPM using: 

{{< highlight bash >}}
npm install --global windows-build-tools
{{< /highlight >}}

or

{{< highlight bash >}}
yarn global add windows-build-tools
{{< /highlight >}}

In case of errors while installing the Windows Build Tools package via `npm`, please make sure that the PowerShell is available on your system `PATH`. Additionally, you should install the Windows Build Tools by using the PowerShell in administrative mode.  
See [this issue](https://github.com/felixrieseberg/windows-build-tools/issues/20#issuecomment-373885943) for further reference.

### macOS

On macOS, Xcode command line tools are required.
You can install them by running:
{{< highlight bash >}}
xcode-select --install
{{< /highlight >}}

### Linux

Depending on your distribution, Linux setups may differ.

In general, Sakuli requires:

- Python 2
- g++
- make
- libXtst
- libPng

Installation on *buntu:
{{< highlight bash >}}
sudo apt-get install build-essential python libxtst-dev libpng++-dev
{{< /highlight >}}

The installation process is an open issue and will be improved in the near future, so using Sakuli will become even more enjoyable!

### Sakuli Installation

We will now install Sakuli in our newly created project by running:

{{< highlight bash >}}
npm i @sakuli/cli
{{< /highlight >}}

or

{{< highlight bash >}}
yarn add @sakuli/cli
{{< /highlight >}}

This will install Sakuli and its required dependencies.

### Reference

- [opencv4nodejs](https://github.com/justadudewhohacks/opencv4nodejs#how-to-install)
- [robotjs](http://robotjs.io/docs/building)



