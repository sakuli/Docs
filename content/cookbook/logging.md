+++
title = "Logging"
date =  2020-04-23T05:05:50+01:00
weight = 5
+++

# Logging

## Log Levels

There are currently five log levels implemented:

- Trace
- Debug
- Info
- Warn
- Error

## Logging to sakuli.log

The default log level in Sakuli is `Info`. This means all log levels starting from `Info` and below are logged to
`sakuli.log`. You can configure the log level via `log.level` in your `testsuite.properties` file, e.g.
{{< highlight bash >}}
log.level=DEBUG
{{< /highlight >}}


Logging is done via the `Logger` object within a testcase. It provides several methods to log at the respective log level:
{{< highlight typescript >}}
Logger.logDebug("This will be logged on debug level");

Logger.logInfo("This will be logged on info level");

Logger.logWarning("This will be logged on warning level");

Logger.logError("This will be logged on error level");
{{< /highlight >}}
