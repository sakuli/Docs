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

| Environment variable                            | Description                                                                              |
|-------------------------------------------------|------------------------------------------------------------------------------------------|
| [DASHBOARD_CONFIG](#dashboard_config)           | Configures the displays (ordering, url, action buttons, etc.) shown in the dashboard     |
| [ACTION_CONFIG](#action_config)                 | (optional) Available actions to perform on the cluster and corresponding display updates |
| [CLUSTER_CONFIG](#cluster_config)               | (optional) Configures the cluster access (cluster address, access token, etc.)           |
| [CRONJOB_CONFIG](#cronjob_config)               | (optional) Configures a cronjob to schedule a specific action                            |
| [AUTHENTICATION_CONFIG](#authentication_config) | (optional) Configures the user authentication                                            |
 
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
         "type": "logs",                                                           //5
         "messages": {
             "de": {
                "description": "Kubernetes Logs",
                "infoText": "Lorem ipsum dolor sit amet"
             },
             "en": {
                "description": "Kubernetes Logs",
                "infoText": "Lorem ipsum dolor sit amet"
             }
         },
         "actionIdentifier":"your_action_id_123"
      }
   ],
   "defaultLayout": "row"                                                           //6
}
{{</highlight>}}


1. The `index` defines the order for the displays on the Sakuli dashboard. (**mandatory field**)
2. Separated by language, the optional `messages` property specifies the title of a display using the `description` property and tool tip using the `infoText`
property. The content can be displayed in German or English. (optional field)
3. The `url` property embeds the corresponding website in the iFrame of the display. (**mandatory field**)
4. The `actionIdentifier` references to an action defined within the [ACTION_CONFIG](#action_config). (optional field)
5. The `type` defines the kind of information to be displayed. It can either be "website" or "logs" while "website" is the default. Log displays require a reference to an action defined within the [ACTION_CONFIG](#action_config). (optional field)
6. The optional `defaultLayout` config specifies the initial layout the dashboard is shown in. (optional field)

### ACTION_CONFIG (optional) {#action_config}

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

1. Action identifier that is referenced inside `DASHBOARD_CONFIG` or `CRONJOB_CONFIG`. (**mandatory field**)
2. Kubernetes/Openshift pod template to be applied on the cluster. Currently only Pod configurations are supported. (**mandatory field**)

**Important information**: In order to apply actions to a cluster, a valid [CLUSTER_CONFIG](#cluster_config) must be provided.

### CLUSTER_CONFIG (optional) {#cluster_config}

The `CLUSTER_CONFIG` is required to connect to an existing cluster where you want to execute your actions.

{{<highlight javascript>}}
{
   "cluster":{                                              //1
      "name":"sakuli/examplecluster-com:443/developer",     //2           
      "server":"http://examplecluster.com:443"              //3
   },
   "user":{                                                 //4
      "name":"developer",                                   //5
      "token":"<login-token>"                               //6
   },
   "namespace":"sakuli"                                     //7
}
{{</highlight>}}

1. Cluster to execute actions on. (**mandatory field**)
2. Cluster name. (**mandatory field**)
3. Cluster address and port number. (**mandatory field**)
4. User to log onto the cluster (**mandatory field**)
5. Username for the cluster (**mandatory field**)
6. Token of the user (**mandatory field**)
7. Namespace to execute actions in. (**mandatory field**)

**Important information**: A valid [CLUSTER_CONFIG](#cluster_config) is required, as soon as you want to apply actions using 
[ACTION_CONFIG](#action_config) and/or [CRONJOB_CONFIG](#cronjob_config) to a cluster.

### CRONJOB_CONFIG (optional) {#cronjob_config}
{{<highlight javascript>}}
{
    "schedule": "*/20 * * * *",                             //1
    "actionIdentifier": "your_action_id_123"                //2
}
{{</highlight>}}

Schedules one action specified in [ACTION_CONFIG](#action_config).
1. The `actionIdentifier` has to be set accordingly. (**mandatory field**)
2. The scheduling determined by the `schedule` property
has to be specified according to the time format
that is used by the [GNU crontab format](https://www.gnu.org/software/mcron/manual/html_node/Crontab-file.html) (**mandatory field**) 

**Important information**: In order to apply scheduled actions to a cluster, a valid [ACTION_CONFIG](#action_config) and [CLUSTER_CONFIG](#cluster_config) must be provided.

### AUTHENTICATION_CONFIG (optional) {#authentication_config} 
**(Since version 2.2.0)**
{{<highlight javascript>}}
{
  "users": {                                                                                        //1
    "iron": "$argon2i$v=19$m=4096,t=3,p=1$MVhBOXIxRndsb1Y4TmpwVg$4dfLPfU7jrOx2wo1Df+cyQ",
    "amazing": "$argon2i$v=19$m=4096,t=3,p=1$N2l1R2l6ZWduUUtqNFhTTA$w5ntmRlKsp9XyyAZTTUAkA",
    "incredible": "$argon2i$v=19$m=4096,t=3,p=1$UGRlaHFUekZNU05hR0Njaw$CGN3FSY84u6KUlOFZJn8jA"
  },
  "jwtTokenSecret": "54208a45-0a3c-4736-927e-6706c3c18b71",                                         //2
  "jwtRefreshTokenSecret": "b78d6873-f16d-4a3d-ae11-77c1702d84f0"                                   //3
}
{{</highlight>}}

1. The `users` with access to the dashboard. Each entry consists of `"<username>": "<argon2i hashed password>"`. In this case
   1. iron: man
   2. amazing: spiderman
   3. incredible: hulk
2. The secret used to generate and validate jwt token.
3. The secret used to generate and validate jwt refresh token.

**Note: Please use the `AUTHENTICATION_CONFIG` above for testing purposes only.**  

If an `AUTHENTICATION_CONFIG` is specified, a user without a valid set of jwt tokens is redirected to a login page. After a
successful login, the user is redirected to the actual dashboard view. The current set of jwt tokens is stored locally.
As long as this set is valid, the user does not have to perform a login again. 
If no `AUTHENTICATION_CONFIG` is specified, the user is able to access the dashboard view directly.

> If you're going to use horizontal scaling, please ensure to use the same set of token secrets and users for your scaled
> deployment so that every user is able to connect and authenticate with every deployed instance smoothly.

#### Generating argon2i password hashes
To generate argon2i password hashes, you can use every argon2i hash generator you trust. The generation and validation of
argon2 hashes can be modified by specifying various parameters. If you want to learn more about the parameter and how to
choose them concerning your use case, please have a look at the article 
<a href="https://www.twelve21.io/how-to-choose-the-right-parameters-for-argon2" target="_blank">How to Choose the Right Parameters for Argon2</a>
by <a href="https://www.twelve21.io/author/bryan-burman/" target="_blank">Bryan Burman</a>.

Here are two possibilities to generate argon2i hashes.
1. Use the npm library `argon2-cli`.
```
~>$ echo -n "$up3r$3cr37P4ssw0rd" | npx argon2-cli
Type: 		Argon2i
Iterations: 	3
Memory: 	4096 KiB
Parallelism: 	1
Encoded: 	$argon2i$v=19$m=4096,t=3,p=1$MxxqTJgaJ+LEEOjo4/wlFw$uka9IMGj54ooMvHjCQeRuig9yY/hcnCK6Kly5s2ohZI
0.008 seconds
Verification ok
```
2. Create your hashes on <a href="https://argon2.online/" target="_blank">argon2.online</a>. We recommend configuring the hash generator as follows:
   - Salt: random generated
   - Parallelism Factor: 1
   - Memory Cost: 4096 KiB
   - Iterations: 3
   - Hash Length: 32