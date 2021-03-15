+++
title = "Logging"
date =  2020-04-23T05:05:50+01:00
weight = 2
+++

# Logging

## Log levels

The default log level in Sakuli is `Info`. This means all log levels starting from `Info` and below are logged to
`sakuli.log`. You can configure the log level via `log.level` in your `testsuite.properties` file, e.g.
{{< highlight bash >}}
log.level=DEBUG
{{< /highlight >}}

There are currently five log levels implemented:

| Log level | Description                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Trace     | Highly increased verbosity. Provides deep insights into code execution.                                                                     |
| Debug     | Increased verbosity. Logs additional technical details about the test execution.                                                            |
| Info      | Information about test execution.                                                                                                           |
| Warn      | Something strange happened. The test execution is not critically disturbed and user interaction is not necessarily required in first place. |
| Error     | The test errored. Test execution will be terminated as soon as possible. User interaction is required.                                      |

## Log modes
**(Available from v2.5.0)**

| config | Description |
| ------ | ----------- |
| log.mode=logfile | (default) Log messages are written into log file
| log.mode=ci      | Log messages are written to stdout and log file for downwards compatibility

*In case you want to set the log mode via environment variables, please use `LOG_MODE` with the appropriate value.
Log modes set via environment variables will be overwritten by log mode configurations from property files.*

### Log mode 'logFile'
| sakuli.properties config | environment config | 
| ------------------------ | ------------------ |
| `log.mode=logFile`       | `log.mode=logFile` |

The default log mode is `logFile`. With this setting, Sakuli puts its log output into a log file under consideration 
of the given log configuration. The standard console output instead shows an overview of the test execution.   


| Console output                                      | Logfile output                           | 
| --------------------------------------------------- | ---------------------------------------- |
| ![print_dialog](/docs/images/console_default_output.png) | ![print_dialog](/docs/images/logfile_cat.png) |

### Log mode 'ci'
| sakuli.properties config | environment config | 
| ------------------------ | ------------------ |
| `log.mode=ci`            | `log.mode=ci`      |

As Sakuli is often used within CI/CD environments in the stage of E2E Tests, working with log files e.g. inside a
container or in a build system is not convenient. Therefore, Sakuli comes with the option to redirect the log output to
the standard output. This mode suppresses the standard overview display of the test execution.


| Console output                                 | Logfile output                              | 
| ---------------------------------------------- | ------------------------------------------- |
| ![print_dialog](/docs/images/console_ci_output.png) | ![print_dialog](/docs/images/logfile_ci_cat.png) |
