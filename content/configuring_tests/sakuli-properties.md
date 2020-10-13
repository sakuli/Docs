+++
title = "Sakuli properties"
date =  2020-04-23T05:05:50+01:00
weight = 1
+++

# Sakuli Properties

## Project properties

| Property                                | Type: Default                                   | Comment / Example                                                                                                                                                     |
| --------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `testsuite.id`                          | String*: /                                      | Name of the suite shown in the output and used by the forwarder                                                                                                       |
| `testsuite.name`                        | String*: `${testsuite.id}`                      | Descriptive name for the current test suite                                                                                                                           |
| `testsuite.browser`                     | String: firefox                                 | Browser which is started by the WebDriver (it can be overridden by the `--browser` command line argument)                                                             |
| `testsuite.reuseBrowser`                | Boolean: true                                   | Configures whether the browser is reused after each testcase (it can be overridden by the `--reuseBrowser` command line argument) **(Available as tech preview)**     |
| `testsuite.warningTime`                 | Number: 0                                       | The warning runtime threshold (seconds) for suite execution. If the warning time is exceeded, the test suite will get the state 'WARNING'                             |
| `testsuite.criticalTime`                | Number: 0                                       | The critical runtime threshold (seconds) for suite execution. If the critical time is exceeded, the test suite will get the state 'CRITICAL'                          |
| `testsuite.uiOnly`                      | Boolean: false                                  | Configure whether a testsuite should run in ui-only mode or not. If true, no browser will be started. (it can be overridden by the `--ui-only` command line argument) |
| `sakuli.environment.similarity.default` | Number: 0.99                                    | Configures the minimum requires similarity for image based matching. Values in range 0 <= x <= 1                                                                      |
| `sakuli.typeDelay`                      | Number: 300                                     | Specifies the amount of time in ms to wait between keypresses                                                                                                         |
| `sakuli.encryption.key`                 | String: /                                       | Master key for en- and decryption                                                                                                                                     |
| `sakuli.log.folder`                     | String: `${project.rootDir}`/_logs              | Folder for log files                                                                                                                                                  |
| `sakuli.screenshot.onError`             | Boolean: true                                   | Enable / disable screenshots on error                                                                                                                                 |
| `sakuli.screenshot.dir`                 | String: `${project.rootDir}`/_logs/_screenshots | Folder for screenshot files (if activated)                                                                                                                            |
| `sakuli.screenshot.storage`             | String: `hierarchical`                          | Configures the way Sakuli stores the error screenshots **(Available from v2.4.0)**                                                                                    |
| `sakuli.mouse.action.delay`             | Number: 10                                      | Delay between mouse actions e.g. mouse button down, mouse button up, scroll, etc. in ms **(Available from v2.4.0)**                                                   |
| `sakuli.mouse.movement.speed`           | Number: 3000                                    | Configures the speed in pixels/second for mouse movement **(Available from v2.4.0)**                                                                                  |

### sakuli.screenshot.storage

**Available from v2.4.0**

There are currently two ways of saving error screenshots in `_logs`:

#### flat
Saves all error screenshots in `_screenshots`, e.g.
{{< highlight bash >}}
_logs
|-- sakuli.log
|-- _screenshots
    |-- 2020-01-01T00-00-00_error_testsuiteId_myFirstTestcase.png
    |-- 2020-01-01T00-00-00_error_testsuiteId_mySecondTestcase.png
    |-- 2020-01-01T01-01-01_error_testsuiteId_myFirstTestcase.png
{{< /highlight>}}

#### hierarchical
Saves the error screenshot in the respective testcase directory, e.g.
{{< highlight bash >}}
_logs
|-- sakuli.log
|-- _screenshots
    |-- testsuiteId_myFirstTestcase
    |   |-- 2020-01-01T00-00-00_error_testsuiteId_myFirstTestcase.png
    |   |-- 2020-01-01T01-01-01_error_testsuiteId_myFirstTestcase.png
    |-- testsuiteId_mySecondTestcase
        |-- 2020-01-01T00-00-00_error_testsuiteId_mySecondTestcase.png
{{< /highlight >}}

## Chrome properties

| Property            | Type: Default     | Comment / Example                                            |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| `selenium.chrome.arguments` | String*: / | Space separated list of Chrome arguments, e.g. --arg1 arg2 --arg3=value arg4=value |
| `selenium.chrome.headless` | Boolean: false | Enable / Disable headless mode |
| `selenium.chrome.windowSize.width` | Number: / | Browser window width |
| `selenium.chrome.windowSize.height` | Number: / | Browser window height |
| `selenium.chrome.excludeSwitches` | String*: / | Space separated list of Chrome command line switches to exclude that ChromeDriver by default passes when starting Chrome.  Do not prefix switches with '--' |
| `selenium.chrome.extensions` | String*: / | Comma separated list of extensions to install when launching Chrome. Each extension should be specified as the path to the packed CRX file |
| `selenium.chrome.binaryPath` | String: / | Sets the path to the Chrome binary to use |

## Firefox properties

| Property            | Type: Default     | Comment / Example                                            |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| `selenium.firefox.profile` | String: / | Sets the profile to use. The profile may be specified as the path to an existing Firefox profile to use as a template |
| `selenium.firefox.binary` | String: / | Sets the binary to use. The binary may be specified as the path to a Firefox executable \
| `selenium.firefox.proxy` | String: / | Sets the proxy settings for the new session |
| `selenium.firefox.useGeckoDriver` | Boolean: false | Boolean flag whether to use GeckoDriver or not |

## Edge properties

| Property            | Type: Default     | Comment / Example                                            |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| `selenium.edge.proxy` | String: / | Sets the proxy settings for the new session |
| `selenium.edge.pageLoadStrategy` | String: 'normal' | Sets the page load strategy for Edge. Supported values are 'normal', 'eager' and 'none' |

## InternetExplorer properties

| Property            | Type: Default     | Comment / Example                                            |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| `selenium.ie.introduceFlakinessByIgnoringProtectedModeSettings` | Boolean: false | Whether to disable the protected mode settings or not |
| `selenium.ie.ignoreZoomSetting` | Boolean: false | Indicates whether to skip the check that the browser's zoom level is set to 100% |
| `selenium.ie.initialBrowserUrl` | String: / | Sets the initial URL loaded when IE starts. Setting this option may cause browser instability |
| `selenium.ie.enablePersistentHover` | Boolean: true | Flag which configures whether to enable persistent mouse hovering (true by default) |
| `selenium.ie.enableElementCacheCleanup` | Boolean: true | Flag which configures whether the driver should attempt to remove obsolete WebElements from its internal cache on page navigation (true by default). Disabling this option will cause the driver to run with a larger memory footprint |
| `selenium.ie.requireWindowFocus` | Boolean: false | Flag which configures whether to require the IE window to have input focus before performing any user interactions (i.e. mouse or keyboard events). This option is disabled by default, but delivers much more accurate interaction events when enabled |
| `selenium.ie.browserAttachTimeout` | Number: 0 | Configures the timeout, in milliseconds, that the driver will attempt to located and attach to a newly opened instance of Internet Explorer. The default is zero, which indicates waiting indefinitely |
| `selenium.ie.forceCreateProcessApi` | Boolean: false | Flag which configures whether to launch Internet Explorer using the CreateProcess API. If this option is not specified, IE is launched using IELaunchURL, if available. For IE 8 and above, this option requires the TabProcGrowth registry value to be set to 0.
| `selenium.ie.arguments` | String*: / | Space separated list of command-line switches to use when launching Internet Explorer |
| `selenium.ie.usePerProcessProxy` | Boolean: / | Flag which configures whether proxies should be configured on a per-process basis. If not set, setting a proxy will configure the system proxy. The default behavior is to use the system proxy |
| `selenium.ie.ensureCleanSession` | Boolean: false | Flag which configures whether to clear the cache, cookies, history, and saved form data before starting the browser. Using this capability will clear session data for all running instances of Internet Explorer, including those started manually |
| `selenium.ie.logFile` | String: / | Sets the path to the log file the driver should log to |
| `selenium.ie.logLevel` | String: / | Sets the IEDriverServer's logging level |
| `selenium.ie.host` | String: / | Sets the IP address of the driver's host adapter |
| `selenium.ie.extractPath` | String: / | Sets the path of the temporary data directory to use |
| `selenium.ie.silent` | Boolean: false | Sets whether the driver should start in silent mode |
| `selenium.ie.proxy` | String: / | Sets the proxy settings for the new session |

## Selenium properties

| Property            | Type: Default     | Comment / Example                                            |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| `selenium.proxy` | String: / | Configuration parameters for using proxies in WebDriver |
| `selenium.httpAgent` | String: / | Sets the http agent to use for each request |
| `selenium.server` | String: / | Sets the URL of a remote WebDriver server to use. Once a remote URL has been specified, the builder direct all new clients to that server |
