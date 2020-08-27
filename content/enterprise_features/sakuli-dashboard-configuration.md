---
title : "Sakuli Dashboard Configuration"
date :  2019-09-12T14:16:46+02:00
weight : 8
---

# Sakuli Dashboard Configuration

This section contains information on how to configure the Sakuli dashboard.

The Sakuli dashboard is configurable via environmental variables containing JSON documents.
Check out the different sections to get example templates and detailed information about how to set up your 
Sakuli dashboard.

| Environment variable                   | Description                                                                       |
|----------------------------------------|-----------------------------------------------------------------------------------|
| [DASHBOARD_CONFIG](#dashboard_config)  | Configures the displays (ordering, url, action buttons, etc.) shown in the dashboard     |
| [ACTION_CONFIG](#action_config)        | Available actions to perform on the cluster and corresponding display updates     |
| [CLUSTER_CONFIG](#cluster_config)      | Configures the cluster access (cluster address, access token, etc.)               |
| [CRONJOB_CONFIG](#cronjob_config)      | Configures a cronjob to schedule a specific action                                |
 
The following picture shows a Sakuli Dashboard with an exemplary configuration and information about the different sections below.
 
{{<image "/images/sakuli-dashboard.png""The Sakuli-Dashboard explained">}} 

1. When hovering over the info button you can see the configurable tool tip.
2. This section represents the dashboards title.
3. You can display content in German or English.
4. It is possible to choose between a row or column layout of the displays.

 
### DASHBOARD_CONFIG {#dashboard_config}

The `DASHBOARD_CONFIG` defines the order and description of displays and the resources to embed within the iFrames.
Here is a sample `DASHBOARD_CONFIG` for the Sakuli dashboard. 

{{<highlight javascript>}}
{
   "displays":[                                                         
      {
         "index":1,                                                         //1                           
         "messages": {                                                      //2
             "de": {
                "description": "Ihr Kubernetes Service",
                "infoText": "Lorem ipsum dolor sit amet"
             },
             "en": {
                "description": "Your Kubernetes service",
                "infoText": "Lorem ipsum dolor sit amet"
             }
         },
         "url":"https://your-cluster.com",                                         //3
         "actionIdentifier":"your_action_id_123"                                   //4         
      },
      {
         "index":2,
         "messages": {
             "de": {
                "description": "Dokumentation von Sakuli"
             },
             "en": {
                "description": "Documentation of Sakuli"
             }
         },
         "url":"https://sakuli.io/docs"
      }
   ]
}
{{</highlight>}}


1. The `index` defines the order for the displays on the Sakuli dashboard. 
2. Separated by language, the optional `messages` property specifies the title of a display using the `description` property and tool tip using the `infoText`
property. The content can be displayed in German or English.
3. The `url` property embeds the corresponding website in the iFrame of the display. 
4. The `actionIdentifier` property is optional and references to an action defined within the [ACTION_CONFIG](#action_config).

### ACTION_CONFIG {#action_config}

The `ACTION_CONFIG` configures the actions triggered by users or cronjobs.

{{<highlight javascript>}}
{
   "actions":[
      {
         "actionIdentifier":"your_action_id_123",    //1
         "action": {                                 //2
            "metadata": {
              "labels": {
                "app": "sakuli"
              },
              "name":"sakuli"
            },
            "spec": {
              "containers": [
                {
                  "name": "sakuli",
                  "image": "taconsol/sakuli:latest",
                  "env": [
                    {
                      "name": "VNC_VIEW_ONLY",
                      "value": "true"
                    },
                    {
                      "name": "SAKULI_ENCRYPTION_KEY",
                      "valueFrom": {
                        "secretKeyRef": {
                          "name": "sakuli-encryption-key",
                          "key": "key"
                        }
                      }
                    }
                  ]
                }
              ],
              "restartPolicy": "Never"
            }
         }
      }
   ]
}
{{</highlight>}}

1. Action identifier that is referenced inside `DASHBOARD_CONFIG` or `CRONJOB_CONFIG`.
2. Kubernetes/Openshift pod template to be applied on the cluster. Currently only Pod configurations are supported.

### CLUSTER_CONFIG {#cluster_config}

The `CLUSTER_CONFIG` is required to connect to an existing cluster where you want to execute your actions.

{{<highlight javascript>}}
{
   "cluster":{                                              //1
      "name":"sakuli/examplecluster-com:443/developer",     //2           
      "server":"http://examplecluster.com:443"              //3
   },
   "user":{                                                 //4
      "name":"developer",         
      "token":"<login-token>"     
   },
   "namespace":"sakuli"                                     //5
}
{{</highlight>}}

1. Cluster to execute actions on.
2. Cluster name.
3. Cluster address and port number.
4. User to log onto cluster
5. Namespace to execute actions in.

### CRONJOB_CONFIG {#cronjob_config}
{{<highlight javascript>}}
{
    "schedule": "*/20 * * * *",
    "actionIdentifier": "your_action_id_123"
}
{{</highlight>}}

Schedules one action specified in [ACTION_CONFIG](#action_config).
The `actionIdentifier` has to be set accordingly.
The scheduling determined by the `schedule` property
has to be specified according to the time format
that is used by the [GNU crontab format](https://www.gnu.org/software/mcron/manual/html_node/Crontab-file.html) 
