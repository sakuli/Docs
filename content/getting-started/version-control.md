+++
title = "Version control systems"
date = 2020-04-03T09:00:42+02:00
weight = 5
+++

# Version control systems
We highly recommend using version control systems for your test/check files, configs, etc. This ensures that changes are tracked, eases development processes as well as backup strategies and allows to release versions of tests/checks in relation to a certain version of your system under test. During test/check execution, Sakuli creates various files like logs and error screenshots which should be ignored when using version control. Common version control systems support strategies to ignore files and folders. Here are prepared configurations for you to use with Sakuli. 

## Git
To ignore files and folders in Git, a `.gitignore` file is used. The following snippet contains the config for Sakuli.

{{<highlight text>}}
#Sakuli 
*.steps.cache
**/_logs
{{</highlight>}}

For more information about `.gitingore` files, please have a look at the [official git documentation](https://git-scm.com/docs/gitignore).
