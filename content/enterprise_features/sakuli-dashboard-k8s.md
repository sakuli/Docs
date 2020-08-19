---
title : "Sakuli Dashboard on Kubernetes"
date :  2019-09-12T14:16:46+02:00
weight : 7
---

# Sakuli Dashboard on Kubernetes

**Attention:** Only Sakuli Enterprise users will be eligible to access the private Sakuli Dashboard Docker images.

## Prerequisites
A Sakuli Dashboard setup on your Kubernetes cluster requires you to import the Sakuli Dashboard image from Docker Hub. In order to do so, please configure a secret storing your `<docker-username>` and `<docker-password>` and add it to your service account for authentication.

{{<highlight bash>}}
kubectl create secret docker-registry dockerhub-sakuli-secret \
 --docker-server=docker.io \
 --docker-username=<docker-username> \
 --docker-password=<docker-password> \
 --docker-email=unused
 
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "dockerhub-sakuli-secret"}]}'
{{</highlight>}}
 
Now it is possible to import the image from the secured registry.

You can start your Sakuli Dashboard using two different approaches:
- Set up the Sakuli Dashboard manually via [CLI](#k8s-cli).
- Set up the Sakuli Dashboard using a ready to use [template](#k8s-dashboard-template).
 
### Set up the Sakuli Dashboard manually {#k8s-cli}

As a first step, create a deployment based on the Sakuli Dashboard image and expose the service.
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
