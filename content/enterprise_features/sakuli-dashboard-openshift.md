---
title : "Sakuli Dashboard on Openshift"
date :  2019-09-12T14:16:46+02:00
weight : 8
---

# Sakuli Dashboard on Openshift

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

Another secret for the sakuli-license-key is required,
so that the dashboard container can start.
{{<highlight bash>}}
oc create secret generic sakuli-license-key \
 --from-literal="SAKULI_LICENSE_KEY=${SAKULI_LICENSE_KEY}"
{{</highlight>}}

_**Note**: To handle any kind of credentials securely in the shell,
you should make sure that they never end up in the shell-history,
that most interactive shells maintain.  
The bash for example has a file, `.bash_history`,
where commands typed into the prompt are written to.
The file is located in the users home-directory.
If the `HISTCONTROL` variable is set tho `'ignoreboth'`,
you can prevent a command from being written to the history
by prepending it with a whitespace.  
Of course, such a configuration should be checked regularily._

After adding both secrets,
link them to your builder service account,
to make them available during the build.

{{<highlight bash>}}
oc secrets link builder dockerhub-sakuli-secret
{{</highlight>}}


Now you can import the image:

{{<highlight bash>}}
oc import-image sakuli-dashboard \
 --from=docker.io/taconsol/sakuli-dashboard \
 --confirm \
 --all=true
{{</highlight>}}

When using OpenShift v3.10 or v3.11, add the --reference-policy=local flag:

{{<highlight bash>}}
oc import-image sakuli-dashboard \
 --from=docker.io/taconsol/sakuli-dashboard \
 --confirm \
 --all \
 --reference-policy=local
{{</highlight>}}


## To start the sakuli-dashboard with oc:

Create the application:

{{<highlight bash>}}
oc new-app sakuli-dashboard \ 
 -e DASHBOARD_CONFIG="${DASHBOARD_CONFIG}"  \
 -e ACTION_CONFIG="${ACTION_CONFIG}"  \
 -e CLUSTER_CONFIG="${CLUSTER_CONFIG}"  \
 -e CRONJOB_CONFIG="${CRONJOB_CONFIG}" \
 -e SAKULI_LICENSE_KEY="${SAKULI_LICENSE_KEY}"
{{</highlight>}}

Expose the service:

{{<highlight bash>}}
oc expose svc/sakuli-dashboard
{{</highlight>}}


## To start the sakuli-dashboard with a template:

Use a template, for example:

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
              #change the address to your openshift registry and namespace
              image: 172.30.1.1:5000/myproject/sakuli-dashboard
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

The placeholders `<action configuration>`, `<cluster Configuration>`, `<dashboard configuration>` and `<cronjob configuration>` have to be replaced with valid configurations.

After configuring the template, run:

{{<highlight bash>}}
oc process -f <filename> | oc create -f -
{{</highlight>}}
Whereas `<filename>` is the name of a file containing the template above.

Expose the service to make the dashboard available to clients outside of your cluster:

{{<highlight bash>}}
oc expose svc/sakuli-dashboard
{{</highlight>}}