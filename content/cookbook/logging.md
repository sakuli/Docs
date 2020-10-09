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

## Log modes
*Available as tech preview in the `@next` releases.*

| config | Description |
| ------ | ----------- |
| log.mode=logfile
| log.mode=ci

*In case you want to set the log mode via environment variables, please use `LOG_MODE` with the appropriate value.
Log modes set via environment variables are overwriting log mode configurations from property files.*

### Log mode 'logFile'
```
log.mode=logFile
LOG_MODE=logFile
```

The log mode `logFile` is default. With this setting, Sakuli puts its log output into a log file under consideration 
of the given log configuration. The standard console output instead shows an overview of the test execution.   

### Log mode 'ci'
```
log.mode=ci
LOG_MODE=ci
```

As Sakuli is often used within CI/CD environments in the stage of E2E Tests, working with log files e.g. inside a
container or in a build system is not convenient. Therefore, Sakuli comes with the option to redirect the log output to
the standard output. This mode suppresses the standard overview display of the test execution.