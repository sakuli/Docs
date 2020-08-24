---
title : "Sakuli Dashboard Configuration"
date :  2019-09-12T14:16:46+02:00
weight : 8
---

# Sakuli Dashboard Configuration

This section contains information on how to properly configure the Sakuli dashboard.

The Sakuli dashboard is configurable via environmental variables containing JSON.
Check out the different sections to get an example template and detailed information about how to set up your 
Sakuli dashboard.

| Environment variable                   | Description                                                                                  |
|----------------------------------------|----------------------------------------------------------------------------------------------|
| [DASHBOARD_CONFIG](#dashboard_config)  | configures the displays (ordering, url, actions, etc.) shown in the dashboard                |
| [ACTION_CONFIG](#action_config)        | (optional) available actions to perform on the cluster and corresponding display updates     |
| [CLUSTER_CONFIG](#cluster_config)      | (optional) configures the cluster access (cluster address, access token, etc.)               |
| [CRONJOB_CONFIG](#cronjob_config)      | (optional) configures a cronjob to schedule a specific action                                |
 
Here you can see a Sakuli Dashboard with an exemplary configuration and information about the different sections below.
 
{{<image "/images/sakuli-dashboard.png""The Sakuli-Dashboard explained">}} 

1. When hovering over the info button you can see the configurable tool tip.
2. This section represents the dashboards title.
3. You can display content in two different languages.
4. It is possible to choose between a row or column layout of the displays.

 
### DASHBOARD_CONFIG {#dashboard_config}

With the `DASHBOARD_CONFIG` you can define the order and description of the display and what you want to embed within the iFrames.
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

Let us examine the different sections:

1. The `index` defines the order for the displays on the Sakuli dashboard. 
2. The `messages` property is optional and can define the title using the `description` property and tool tip for the display using the `infoText`
property. The content can be displayed in german or english using the appropriate section.
3. The Sakuli dashboard embeds the `url` in an iFrame. 
4. The `actionIdentifier` property is optional and references to an action defined within the [ACTION_CONFIG](#action_config).

### ACTION_CONFIG (optional) {#action_config}

With the `ACTION_CONFIG` you can configure actions that can be triggered by users and cronjobs.
Here is a sample `ACTION_CONFIG` for the Sakuli dashboard. 

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

1. Action identifier that is referenced inside `DASHBOARD_CONFIG`.
2. Applies the Kubernetes/Openshift template on the cluster. In this case, the action represents a Kubernetes pod template
to start a Sakuli check.

**Important information**: In order to apply the actions to a cluster, a valid [CLUSTER_CONFIG](#cluster_config) must be provided.

### CLUSTER_CONFIG (optional) {#cluster_config}

With the `CLUSTER_CONFIG` you can enable the access to an existing cluster where you plan to execute your actions.
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

1. Cluster for hosting dashboard.
2. Name of Cluster: `<namespace>/<cluster-address>:<port>/<user>`
  Whereas in `<cluster-address>` every dot of the URL is replaced by a dash.
3. Cluster address and port number.
4. User to log onto cluster
5. Namespace of action

**Important information**: A valid [CLUSTER_CONFIG](#cluster_config) is required, as soon as you want to apply actions using 
[ACTION_CONFIG](#action_config), [DASHBOARD_CONFIG](#dashboard_config) and/or [CRONJOB_CONFIG](#cronjob_config) to a cluster.

### CRONJOB_CONFIG (optional) {#cronjob_config}
{{<highlight javascript>}}
{
    "schedule": "*/20 * * * *",
    "actionIdentifier": "your_action_id_123"
}
{{</highlight>}}

Schedule the action previously described in the [DASHBOARD_CONFIG](#dashboard_config) and [ACTION_CONFIG](#action_config).
The `actionIdentifier` has to be set accordingly.
The scheduling determined by the `schedule` property
has to be specified according to the time format
that is used by the [GNU crontab format](https://www.gnu.org/software/mcron/manual/html_node/Crontab-file.html) 

**Important information**: In order to apply scheduled actions to a cluster, a valid [CLUSTER_CONFIG](#cluster_config) must be provided.