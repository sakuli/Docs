---
title : "Sakuli Dashboard Configuration"
date :  2019-09-12T14:16:46+02:00
weight : 8
---

# Sakuli Dashboard Configuration

This section contains information on how to properly configure the Sakuli dashboard.

The Sakuli dashboard is configurable via environmental variables which are formatted as JSON.
Check out the different sections to get an example template and detailed information about how to set up your 
Sakuli dashboard.

| Environment variable                   | Description                                                                       |
|----------------------------------------|-----------------------------------------------------------------------------------|
| [DASHBOARD_CONFIG](#dashboard_config)  | configures the displays (ordering, url, actions, etc.) shown in the dashboard     |
| [ACTION_CONFIG](#action_config)        | available actions to perform on the cluster and corresponding display updates     |
| [CLUSTER_CONFIG](#cluster_config)      | configures the cluster access (cluster address, access token, etc.)               |
| [CRONJOB_CONFIG](#cronjob_config)      | configures a cronjob to schedule a specific action                                |
 
Here you can see a Sakuli Dashboard with an exemplary configuration and information about the different sections below.
 
{{<image "/images/sakuli-dashboard.png""The Sakuli-Dashboard explained">}} 

1. When hovering over the info button you can see the configurable tool tip.
2. This section represents the dashboards title.
3. It is possible to choose between a row or column layout of the displays.
4. You can display content in two different languages.
 
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

### ACTION_CONFIG {#action_config}

### CLUSTER_CONFIG {#cluster_config}

### CRONJOB_CONFIG {#cronjob_config}




