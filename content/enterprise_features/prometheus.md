---
title : "Prometheus Fowarder"
date : 2020-03-10T17:26:00+02:00
weight : 2
---

# Prometheus Forwarder

**Available from version 2.3.0**

Add the forwarder manually as follows:

{{<highlight bash>}}
npm i @sakuli/forwarder-prometheus
{{</highlight>}}

Installation of any enterprise feature requires a proper setup of your license information. You can find further information in the [enterprise section](/docs/enterprise#using-licences-information).


## Push gateway
It is assumed that a push gateway is available in your monitoring setup. As Sakuli checks are not constantly available like e.g. a Webservice, it is required to use a Prometheus push gateway to provide a scraping endpoint for Prometheus to obtain measurements gathered by Sakuli.

## Forwarder configuration

Configuration is located in `sakuli.properties` within the root folder of your project or respectively in `testsuite.properties` in your testsuite folders for testsuite specific configuration:

| Property                               | Default | Effect                                                                                         |
|----------------------------------------|---------|------------------------------------------------------------------------------------------------|
| `sakuli.forwarder.prometheus.enabled`  | `false` | Enables forwarding to prometheus push gateway                                                  |
| `sakuli.forwarder.prometheus.api.host` |         | Hostname of the prometheus push gateway                                                        |
| `sakuli.forwarder.prometheus.api.port` | `9091`  | Port of the prometheus push gateway service                                                    |
| `sakuli.forwarder.prometheus.api.job`  |         | Name of the job the metrics relate to. E.g. `e2e-monitoring-for-my-very-important-application` |


### Example configuration

{{<highlight properties>}}
sakuli.forwarder.prometheus.enabled=true
sakuli.forwarder.prometheus.api.host=prom.push.gateway.mydomain.com
sakuli.forwarder.prometheus.api.port=9091
sakuli.forwarder.prometheus.api.job=my-app-e2e-monitoring
{{</highlight>}}
