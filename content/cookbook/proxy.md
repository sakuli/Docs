+++
title = "Container and Proxies"
date =  2019-12-16T11:50:07+01:00
weight = 5
+++

# Container behind Proxies

To configure a proxy within your docker container, set one or both of the following environment variables within your docker run command.

{{<highlight bash>}}
-e HTTP_PROXY=http://server-ip:port/
-e HTTPS_PROXY=http(s)://server-ip:port/ 
{{</highlight >}}

Use a HTTP_PROXY for http target sites and HTTPS_PROXY for https sites, if you switch between secure and insecure sites or just to be sure not to worry about it, you can also define both proxies at the same time, e.g. like this:

{{<highlight bash>}}
docker run --rm -p 5901:5901 -p 6901:6901 -e HTTP_PROXY=http://server-ip:port/ -e HTTPS_PROXY=http(s)://server-ip:port/ -e SAKULI_LICENSE_KEY=yourLicenseKey taconsol/sakuli:2.2.0
{{</highlight >}}