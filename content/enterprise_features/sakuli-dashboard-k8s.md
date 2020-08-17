---
title : "Sakuli Dashboard on Kubernetes"
date :  2019-09-12T14:16:46+02:00
weight : 7
---

# Sakuli Dashboard on Kubernetes

Once you obtained a Sakuli Enterprise license your docker-user will be granted access to the private Sakuli dashboard image.

## Setup
To setup the Sakuli dashboard on your Kubernetes cluster, it is required to import the images from 
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
 
 To be able to start the Sakuli dashboard you also need to create a secret containing your license key.
 
 {{<highlight bash>}}
kubectl create secret generic sakuli-license-key \
 --from-literal="SAKULI_LICENSE_KEY=${SAKULI_LICENSE_KEY}"
 {{</highlight>}}
 
Now it is possible to import the image from the secured registry.
 
### Dashboard template for Kubernetes 

The following config template is ready to use to configure and deploy your Sakuli dashboard.
Just copy and save the dashboard template bellow as `dashboard-template.yml`. Furthermore add your dashboard, action, 
cluster and cronjob configurations listed under ConfigMap.

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
          image: taconsol/sakuli-dashboard
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

To install the setup on your Kubernetes cluster, just use the following command.

{{<highlight bash>}}
kubectl apply -f dashboard-template.yml
{{</highlight>}}  