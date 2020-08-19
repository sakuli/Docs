---
title : "Sakuli Dashboard on Openshift"
date :  2019-09-12T14:16:46+02:00
weight : 8
---

# Sakuli Dashboard on Openshift

**Attention:** Only Sakuli Enterprise users will be eligible to access the private Sakuli Dashboard Docker images.

## Prerequisites

To setup a dashboard container on your OpenShift cluster,
you have to import the images from `taconsol/sakuli-dashboard`.
In order to authenticate to docker.io during build,
you have to create a docker registry secret with your
`<docker-username>`
and `<docker-password>`.

{{<highlight bash>}}
oc create secret docker-registry dockerhub-sakuli-secret \
 --docker-server=docker.io \
 --docker-username=<docker-username> \
 --docker-password=<docker-password> \
 --docker-email=unused
{{</highlight>}}

Enable access to the secret from the default service account:

{{<highlight bash>}}
oc secrets link default dockerhub-sakuli-secret --for=pull
{{</highlight>}}


Now you can import the image:

{{<highlight bash>}}
oc import-image sakuli-dashboard \
 --from=docker.io/taconsol/sakuli-dashboard \
 --confirm \
 --scheduled=true \
 --all=true
{{</highlight>}}

When using OpenShift v3.10 or v3.11, add the `--reference-policy=local` flag:

{{<highlight bash>}}
oc import-image sakuli-dashboard \
 --from=docker.io/taconsol/sakuli-dashboard \
 --confirm \
 --scheduled=true \
 --all \
 --reference-policy=local
{{</highlight>}}

*Note: The `oc import-image` statement is configured to not only import all available sakuli-dashboard images but also to
check for updates automatically.*

You can start your Sakuli dashboard using two different approaches:
- Start the Sakuli dashboard via CLI with [oc](#oc).
- Start the Sakuli dashboard using a ready to use [template](#dashboard-template).

## Starting the Sakuli dashboard with oc {#oc}

To create the application with the openshift client, you can use the `new-app` command. You can add environment variables
via the `-e` parameter.

{{<highlight bash>}}
oc new-app sakuli-dashboard \ 
 -e DASHBOARD_CONFIG="${DASHBOARD_CONFIG}"  \
 -e ACTION_CONFIG="${ACTION_CONFIG}"  \
 -e CLUSTER_CONFIG="${CLUSTER_CONFIG}"  \
 -e CRONJOB_CONFIG="${CRONJOB_CONFIG}" \
 -e SAKULI_LICENSE_KEY="${SAKULI_LICENSE_KEY}"
{{</highlight>}}

Now you need to expose your service, to make it available outside your cluster.

{{<highlight bash>}}
oc expose svc/sakuli-dashboard
{{</highlight>}}


## Set up the Sakuli Dashboard using a ready to use template {#oc-dashboard-template}

The Sakuli Dashboard OpenShift template references the Sakuli license key via a secret.
So before applying the template, please add your license key secret first.

{{<highlight bash>}}
oc create secret generic sakuli-license-key \
 --from-literal="SAKULI_LICENSE_KEY=${SAKULI_LICENSE_KEY}"
{{</highlight>}}


The following ready-to-use template will configure a Sakuli Dashboard and deploy it to your cluster
Just copy and save the dashboard template below as `dashboard-template.yml`. Furthermore, add your dashboard, action, 
cluster and cronjob configurations listed under ConfigMap as well as the image tag.

{{<highlight yml>}}
apiVersion: v1
kind: Template
metadata:
  name: ${SERVICE_NAME}
objects:
  - apiVersion: v1
    kind: DeploymentConfig
    metadata:
      name: ${SERVICE_NAME}
      labels:
        app: ${SERVICE_NAME}
    spec:
      replicas: 1
      selector:
        app: ${SERVICE_NAME}
      template:
        metadata:
          labels:
            app: ${SERVICE_NAME}
        spec:
          containers:
            - name: ${SERVICE_NAME}
              #change the address to your openshift registry, your namespace and the image tag you want to use
              image: ${OPENSHIFT_REGISTRY_ADDRESS}/${NAMESPACE}/sakuli-dashboard:${IMAGE_TAG}
              imagePullPolicy: Always
              ports:
                - containerPort: 8080
                  protocol: TCP
              env:
                - name: ACTION_CONFIG
                  valueFrom:
                    configMapKeyRef:
                      name: ${SERVICE_NAME}
                      key: ACTION_CONFIG
                - name: DASHBOARD_CONFIG
                  valueFrom:
                    configMapKeyRef:
                      name: ${SERVICE_NAME}
                      key: DASHBOARD_CONFIG
                - name: CLUSTER_CONFIG
                  valueFrom:
                    configMapKeyRef:
                      name: ${SERVICE_NAME}
                      key: CLUSTER_CONFIG
                - name: CRONJOB_CONFIG
                  valueFrom:
                    configMapKeyRef:
                      name: ${SERVICE_NAME}
                      key: CRONJOB_CONFIG
                - name: SAKULI_LICENSE_KEY
                  valueFrom:
                    secretKeyRef:
                      name: sakuli-license-key
                      key: SAKULI_LICENSE_KEY
      triggers:
        - type: ConfigChange
  - apiVersion: v1
    kind: Service
    metadata:
      name: ${SERVICE_NAME}
      labels:
        app: ${SERVICE_NAME}
    spec:
      ports:
        - name: 8080-tcp
          port: 8080
          protocol: TCP
          targetPort: 8080
      selector:
        app: ${SERVICE_NAME}
  - apiVersion: v1
    kind: ConfigMap
    metadata:
      name: ${SERVICE_NAME}
    data:
      ACTION_CONFIG: >-
        <action configuration>
      CLUSTER_CONFIG: >-
        <cluster Configuration>
      DASHBOARD_CONFIG: >-
        <dashboard configuration>
      CRONJOB_CONFIG: >-
        <cronjob configuration>
parameters:
  - name: SERVICE_NAME
    description: Service name for dashboard
    value: sakuli-dashboard
{{</highlight>}}

After configuring the template, run:

{{<highlight bash>}}
oc process -f <filename> | oc create -f -
{{</highlight>}}
Whereas `<filename>` is the name of a file containing the template above.

Expose the service to make the dashboard available to clients outside of your cluster:

{{<highlight bash>}}
oc expose svc/sakuli-dashboard
{{</highlight>}}
