---
title : "Sakuli Dashboard on Kubernetes"
date :  2019-09-12T14:16:46+02:00
weight : 7
---

# Sakuli Dashboard on Kubernetes

Once you obtained a Sakuli Enterprise license your docker-user will be granted access to the private Sakuli dashboard image.

## Prerequisites
To setup the Sakuli dashboard on your Kubernetes cluster, it is required to import the image from 
`taconsol/sakuli-dashboard`. To achieve this, you have to create a docker-registry secret with your `<docker-username>` and
`<docker-password>` and add it to your service account to authenticate on docker.io during build.

{{<highlight bash>}}
kubectl create secret docker-registry dockerhub-sakuli-secret \
 --docker-server=docker.io \
 --docker-username=<docker-username> \
 --docker-password=<docker-password> \
 --docker-email=unused
 
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "dockerhub-sakuli-secret"}]}'
{{</highlight>}}
 
Now it is possible to import the image from the secured registry.

You can start your Sakuli dashboard using two different approaches:
- Start the Sakuli dashboard via CLI with [kubectl](#kubectl).
- Start the Sakuli dashboard using a ready to use [template](#dashboard-template).
 
### Starting the Sakuli dashboard with kubectl {#kubectl}

First you have to create your deployment based on the Sakuli dashboard image you want to use and expose your service.
The Sakuli dashboard provides a `latest` tag, which is a tech-preview.
For a stable version, specify the exact version to ensure consistency.

{{<highlight bash>}}
kubectl create deployment sakuli-dashbaord --image=taconsol/sakuli-dashboard:<IMAGE_TAG>

kubectl expose deployment sakuli-dashboard --type=LoadBalancer --port=8080
{{</highlight>}}

The `--type=LoadBalancer` flag is important to make your service available outside your cluster.

Now you have to add your Sakuli dashboard configurations such as the dashboard, action, cluster and cronjob configs and your 
Sakuli license key to the environment of your deployment.

{{<highlight bash>}}
kubectl set env deployment/sakuli-dashboard --overwrite \
 DASHBOARD_CONFIG="${DASHBOARD_CONFIG}" \
 ACTION_CONFIG="${ACTION_CONFIG}" \
 CLUSTER_CONFIG="${CLUSTER_CONFIG}" \
 CRONJOB_CONFIG="${CRONJOB_CONFIG}" \
 SAKULI_LICENSE_KEY="${SAKULI_LICENSE_KEY}"
{{</highlight>}}

### Starting the Sakuli dashboard with a template {#dashboard-template}

An XL Sakuli license key is required to start the Sakuli dashboard. You can add your license key with a secret, which is
then referenced to the deployment in the template.
 
{{<highlight bash>}}
kubectl create secret generic sakuli-license-key \
 --from-literal="SAKULI_LICENSE_KEY=${SAKULI_LICENSE_KEY}"
{{</highlight>}}

The following config template is ready to use to configure and deploy your Sakuli dashboard.
Just copy and save the dashboard template bellow as `dashboard-template.yml`. Furthermore, add your dashboard, action, 
cluster and cronjob configurations listed under ConfigMap as well as the image tag.

{{<highlight yaml>}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sakuli-dashboard
  labels:
    app: sakuli-dashboard
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sakuli-dashboard
  template:
    metadata:
      labels:
        app: sakuli-dashboard
    spec:
      containers:
        - name: sakuli-dashboard
          # Specify the Sakuli dashboard version you want to use
          image: taconsol/sakuli-dashboard:${IMAGE_TAG}
          imagePullPolicy: Always
          env:
            - name: ACTION_CONFIG
              valueFrom:
                configMapKeyRef:
                  name: sakuli-dashboard
                  key: ACTION_CONFIG
            - name: CLUSTER_CONFIG
              valueFrom:
                configMapKeyRef:
                  name: sakuli-dashboard
                  key: CLUSTER_CONFIG
            - name: DASHBOARD_CONFIG
              valueFrom:
                configMapKeyRef:
                  name: sakuli-dashboard
                  key: DASHBOARD_CONFIG
            - name: CRONJOB_CONFIG
              valueFrom:
                configMapKeyRef:
                  name: sakuli-dashboard
                  key: CRONJOB_CONFIG
            - name: SAKULI_LICENSE_KEY
              valueFrom:
                secretKeyRef:
                  name: sakuli-license-key
                  key: SAKULI_LICENSE_KEY
---
apiVersion: v1
kind: Service
metadata:
  name: sakuli-dashboard
spec:
  selector:
    app: sakuli-dashboard
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
  type: LoadBalancer
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: sakuli-dashboard
data:
  DASHBOARD_CONFIG: >-
    Dashboard configuration
  ACTION_CONFIG: >-
    Action configuration
  CLUSTER_CONFIG: >-
    Cluster configuration
  CRONJOB_CONFIG: >-
    Cronjob configuration
{{</highlight>}}  

To create the deployment in your Kubernetes cluster, just use the following command.

{{<highlight bash>}}
kubectl apply -f dashboard-template.yml
{{</highlight>}}  