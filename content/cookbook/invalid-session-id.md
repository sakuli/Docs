+++
title = "Error: Invalid session id"
date =  2020-02-03T15:25:42+01:00
weight = 5
+++

# Oh noes! Sakuli crashed with an _"Invalid session id"_ error!
When Sakuli crashes with an _"Invalid session id"_ error, the webdriver itself crashed or least closed the session
the Sakuli test or check is using. Such a behavior mostly occurs, when the provided resources for the Sakuli execution
are insufficient. When testing bigger websites, please check if enough SHM space is available.

1. [Running Sakuli container with --shm-size]({{< relref "../enterprise_features/container.md/#running-sakuli-test-containers" >}})
2. [Increasing shared memory on openshift]({{< relref "../enterprise_features/s2i.md/#increasing-shared-memory-of-sakuli-on-openshift" >}})