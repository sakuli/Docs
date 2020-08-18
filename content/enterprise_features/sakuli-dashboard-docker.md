---
title : "Sakuli Dashboard with Docker"
date :  2019-09-12T14:16:46+02:00
weight : 6
---

# Sakuli Dashboard with Docker

## Docker

### 1 Obtaining the image

The registered docker-hub user will then be able to pull the private image:

{{<highlight bash>}}
docker pull taconsol/sakuli-dashboard:<IMAGE_TAG>
{{</highlight>}}

The dashboard provides a `latest` tag, which is a tech-preview.

### 2 Running the Sakuli dashboard

{{< highlight bash >}}
docker run --rm \
 -p 8080:8080 \
 -e DASHBOARD_CONFIG="${DASHBOARD_CONFIG}" \
 -e ACTION_CONFIG="${ACTION_CONFIG}" \
 -e CLUSTER_CONFIG="${CLUSTER_CONFIG}" \
 -e CRONJOB_CONFIG="${CRONJOB_CONFIG}" \
 -e SAKULI_LICENSE_KEY="${SAKULI_LICENSE_KEY}" \
 taconsol/sakuli-dashboard
{{</ highlight >}}

Parameters:

- **\-\-rm**: The dashboard container will be removed after execution, not just stopped
- **-p**: Port forwarding to access the dashboard container on port 8080
- **-e**: Environment variable flags which are used to provide the `SAKULI_LICENSE_KEY` and configure the dashboard

## Docker-Compose

To start the dashboard via `docker-compose`, you can use the following `docker-compose.yml` template to configure the
dashboard.  

{{< highlight yaml >}}
version: "3"
services:
    sakuli:
        container_name: sakuli-dashboard
        image: taconsol/sakuli-dashboard
        ports:
            - 8080:8080
        environment:
            - DASHBOARD_CONFIG=${DASHBOARD_CONFIG}
            - ACTION_CONFIG=${ACTION_CONFIG}
            - CLUSTER_CONFIG=${CLUSTER_CONFIG}
            - CRONJOB_CONFIG=${CRONJOB_CONFIG}
            - SAKULI_LICENSE_KEY=${SAKULI_LICENSE_KEY}
{{</ highlight >}}

After creating the `docker-compose.yml` configuration file, you can start the dashboard with:
{{< highlight bash >}}
docker-compose up
{{</ highlight >}}