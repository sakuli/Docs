---
title : "Container"
date : 2019-09-12T14:16:13+02:00
weight : 4
---
# Pre-configured Container

Once you obtained a Sakuli Enterprise license your docker-user will be granted access to the private Sakuli test container image.
This image is ready to go and ships with already installed:

- Sakuli
- Icinga2 / checkmk / OMD / Prometheus Forwarder 
- VNC / noVNC
- Chrome / Firefox (incl. webdriver)

## 1 Obtaining the Image

The registered docker-hub user will then be able to pull the private image:

{{<highlight bash>}}
docker pull taconsol/sakuli:<IMAGE_TAG>
{{</highlight>}}

Tech previews of Sakuli containers are published as `latest`.
We highly recommend specifying the exact version of Sakuli for productive tests/checks.

Containers are tagged according to Sakuli versions, so in order to use Sakuli v2.4.0-1 in a test, one would pull the following image:

{{<highlight bash>}}
docker pull taconsol/sakuli:2.1.2
{{</highlight>}}

You can find a list of available tags on <a href="https://cloud.docker.com/u/taconsol/repository/docker/taconsol/sakuli" target="_blank" rel="noopener">Dockerhub</a>

## 2 Running Sakuli Test Containers {#running-sakuli-test-containers}

Containerized Sakuli tests require a valid Sakuli license token which has to be provided via the `SAKULI_LICENSE_KEY` [environment variable](/docs/enterprise_features/#using-the-license-key).

Docker allows to pass environment variables along other parameters when starting a new container:

{{<highlight bash>}}
docker run \
    --rm \
    -p 5901:5901 \
    -p 6901:6901 \
    -e SAKULI_LICENSE_KEY=<YOUR SAKULI LICENSE KEY> \
    [--shm-size=2G] \
    taconsol/sakuli:2.4.0-1
{{</highlight>}}

Parameters:

- **\-\-rm**: The test container will be removed after execution, not just stopped
- **-p**: Port forwardings. VNC is available on port 5901, the HTML5 webVNC view is exposed on port 6901 on the Docker host
- **-e**: Environment variable flag which is used to provide the `SAKULI_LICENSE_KEY` to the container
- **--shm-size**: *(Optional Parameter)* Increases the size of the shared memory space of the container. The default value is 64MB. This might be required when testing larger websites. Indicators that a shared memory enlargement is required are container crashes, the erroneous loading of websites or `invalid session id` errors due to crashed browsers.  

> Sakuli Test Containers run as non-root user, the default UID is 1000.

## 3 Anatomy of a Containerized Sakuli Test

In general, the structure of a containerized Sakuli test does not differ from any other Sakuli test.
No changes are required when executing a test inside a container.
The only configuration we have to provide, is information about how and which suite should be executed.

## 4 Configuring a Containerized Test

The default behaviour of a Sakuli Test Container is to run `npm test` to execute a test suite,
so to run a custom test we have to:

1. Provide the test project to the container
2. Specify the location of the test suite inside the container
3. Configure what to execute on `npm test` within the test suite or project

### 4.1 Provide the test project to the container

There are various ways to provide test sources to a container:

- Bind mounts
- Extending a base image
- Clone a git repository

#### 4.1.1 Bind Mounts

When running a Docker container it is possible to mount a file or directory on the Docker host into a container.
This mechanism can be used to provide a Sakuli projects to a Sakuli container:

{{<highlight bash>}}
docker run \ 
    -v /path/to/test/project/on/host:/sakuli_project \
    -e SAKULI_LICENSE_KEY=<YOUR SAKULI LICENSE KEY> \
    taconsol/sakuli:2.4.0-1 /bin/bash
{{</highlight>}}

By adding the **-v** parameter we're mounting the root folder of a Sakuli project at `/path/to/test/project/on/host` on our host machine to `/sakuli_project` inside the container.
We are now able to execute a test suite inside the container via `sakuli run /sakuli_project/test_suite_folder`.

Bind mounts are easy to use and very useful during development.

For further information, please refer to the <a href="https://docs.docker.com/storage/bind-mounts/" target="_blank" rel="noopener">Docker documentation on bind mounts</a>

Instead of starting the test suite manually via `/bin/bash`, you could use the default entry point of the container.
To be able to do so, you have to specify the environment variable `SAKULI_TEST_SUITE` containing the path of the test suite to execute *inside* the container. 

{{<highlight bash>}}
docker run \
    -v /path/to/test/project/on/host:/sakuli_project \
    -e SAKULI_TEST_SUITE=/sakuli_project/test_suite_folder \
    -e SAKULI_LICENSE_KEY=<YOUR SAKULI LICENSE KEY> \
    taconsol/sakuli:2.4.0-1
{{</highlight>}}


#### 4.1.2 Extending a Base Image

Once you have a test suite which should be put into work. Binding mounts might become cumbersome and makes it hard
to reproduce certain state of the test project, suite or case. To ensure a reproducible environment, it would be feasible to
build an explicit Docker image for test execution.

We can do so by creating our own Dockerfile next to our project directory:

- <i class="fas fa-folder"></i> **/folder/containing/Dockerfile/and/project** 
- <i class="far fa-file"></i> **Dockerfile** 
- <i class="fas fa-folder"></i> **testsuite-a**     
- <i class="far fa-file"></i> **package.json** 
- <i class="far fa-file"></i> **...**

{{<highlight bash>}}
FROM taconsol/sakuli:2.4.0-1

ADD . \$HOME/sakuli_project
ENV SAKULI_TEST_SUITE \$HOME/sakuli_project/testsuite-a
{{</highlight>}}

Using this Dockerfile, we can now build our own test image by running the following command where the dockerfile is located:

{{<highlight bash>}}
docker build -t name-of-my-image .
{{</highlight>}}

We can now run the newly built image via:

{{<highlight bash>}}
docker run -e SAKULI_LICENSE_KEY=<YOUR SAKULI LICENSE KEY> name-of-my-image
{{</highlight>}}

> When working with added files and folders inside a container, one has to ensure correct file permissions for added files.

#### 4.1.3 Clone a git repository

**Available from v2.4.0**

The Sakuli container provides a mechanism to clone a git repository containing a sakuli project at container start
and subsequently executing a testsuite within it:
{{<highlight bash>}}
docker run -e GIT_URL=<REPOSITORY URL> -e GIT_CONTEXT_DIR=<RELATIVE PATH TO TESTSUITE> -e SAKULI_LICENSE_KEY=<YOUR SAKULI LICENSE KEY> taconsol/sakuli:2.4.0-1
{{</highlight>}}

`GIT_URL` specifies the URL of the repository to be cloned. To access a private repository, please ensure, your git service provides the possibility to authenticate via URL parameters. 
This is possible with common git services like [GitHub](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token), [Gitlab](https://docs.gitlab.com/ee/user/project/deploy_tokens/#git-clone-a-repository) and [Bitbucket](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html?_ga=2.213635799.231132925.1597055610-1046501904.1597055610).
To authenticate with a token on GitHub, use: `https://<token>@github.com/<username>/<repository.git>`.

`GIT_CONTEXT_DIR` is necessary to specify the path to the sakuli test suite inside the cloned repository.

### 4.2 Configure command on `npm test`

The main configuration file of a npm project is its `package.json` file.
Within this file it's possible to configure <a href="https://docs.npmjs.com/misc/scripts" target="_blank" rel="noopener">npm-scripts</a>, a handy way to execute scripts inside an npm project.

An empty project initialised via `npm init` already contains one script: `npm test`

{{<highlight js>}}
...
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1"
},
...
{{</highlight>}}

`npm test` is the default way of executing tests in a npm project, so Sakuli tests should be executed this way, too!

Since Sakuli is available in the container, we can run our test by simply calling `sakuli run ...` on `npm test`.
As your test suites are located within the same folder as our `package.json`, so a test suite can be run via:

{{<highlight js>}}
...
"scripts": {
"test": "sakuli run /path/to/your/test/suite"
},
...
{{</highlight>}}

Reusing the package.json on project level comes with one limitation: You have only one "test" script available. If you
decide to put multiple test suites into one project, we recommend putting a package.json on suite level as well.

{{<highlight js>}}
{
  "name": "test-suite",
  "version": "1.0.0",
  "scripts": {
    "test": "sakuli run ."
  }
}
{{</highlight>}}

> Please notice that this is just suitable if you plan to execute the suite in the container. 

#### 4.2.1 Troubleshooting

This topic covers possible errors when running containerized Sakuli tests.

#### 4.2.1.1 Additional dependencies
**(Available from v2.5.0)**
In case your test project requires additional dependencies, it's possible to run `npm install` before executing the Sakuli test.

{{<highlight js>}}
...
"scripts": {
"test": "npm i && sakuli run /path/to/your/test/suite"
},
...
{{</highlight>}}

The Container supports package installation, configurable via the environment variable
`INSTALL_PACKAGES=true`. This will install all packages defined in your `package.json` at container startup.

> **Note:** Package versions installed inside the container will be overwritten by the version defined in the `package.json`.  
> This might cause unexpected behavior, if overwriting e.g. Sakuli itself `(@sakuli/cli)` or forwarders.
> By installing third-party packages, the functionality of the packages and Sakuli itself can be impaired. 

## 5 Viewing / Configuring Test Execution

Sakuli test containers allow to configure specific details of their runtime environment.

### 5.1 VNC Access

Sakuli containers provide access to running containers via VNC on ports 5901 and 6901.
By specifying port forwarding (**-p**) it is possible to configure which ports will be used to connect to a running container on the host system.

{{<highlight bash>}}
docker run --rm -p 5901:5901 -p 6901:6901 -e SAKULI_LICENSE_KEY=<YOUR SAKULI LICENSE KEY> taconsol/sakuli:2.4.0-1
{{</highlight>}}

The example above forwards container ports 5901 and 6901 to the same ports on the host system.

{{<highlight bash>}}
docker run --rm -p 5000:5901 -p 6000:6901 -e SAKULI_LICENSE_KEY=<YOUR SAKULI LICENSE KEY> taconsol/sakuli:2.4.0-1
{{</highlight>}}

In this example container port 5901 is forwarded to port 5000 on the host system, port 6901 is forwarded to port 6000 on the host system.
`localhost:5000` would be used to connect to the container via VNC client, on `localhost:6000` a webVNC view is available in the browser.

> The default password to access a container via VNC is `vncpassword`. It is **highly** recommended changing this password in production environments. See section [#5.2](#5-2-configuring-vnc-access) for details.

### 5.2 Configuring VNC Access

The following VNC environment variables can be overwritten at the docker run phase to customize your desktop environment inside the container:

{{<highlight bash>}}
VNC_COL_DEPTH, default: 24 // Color depth

VNC_RESOLUTION, default: 1280x1024 // Screen resolution

VNC_PW, default: vncpassword // VNC password

VNC_VIEW_ONLY, default: false // Run in view only mode, no keyboard / mouse interaction possible
{{</highlight>}}

For example, the password for VNC could be set like this:

{{<highlight bash>}}
~\$ docker run -p 5901:5901 -p 6901:6901 -e VNC_PW=my-new-password taconsol/sakuli:2.4.0-1
{{</highlight>}}

### 5.3 Container User

Per default all container processes will be executed with user id 1000.

- Using root (user id 0):
  Add the \-\-user flag to your docker run command:
  {{<highlight bash>}}
  ~\$ docker run -it -p 5901:5901 -p 6901:6901 --user 0 taconsol/sakuli:2.4.0-1
  {{</highlight>}}

- Using user and group id of host system
  Add the \-\-user flag to your docker run command:
  {{<highlight bash>}}
  ~$ docker run -it -p 5901:5901 -p 6901:6901 --user $(id -u):\$(id -g) taconsol/sakuli:2.4.0-1
  {{</highlight>}}

## 6 Custom Certificates

Internal infrastructure often uses custom certificates with own root CAs etc.
Things like untrusted certificates cause Sakuli tests to fail, since no connection to a seemingly insecure host will be established (`InsecureCertificateError`).

Unfortunately, browsers use their own certificate store, which requires some additional work to add custom certificates.

#### 6.1 Adding Custom Certificates

In order to add custom certificates to a Sakuli container, one has to provide two things:

- A directory containing certificates for import (_.crt, _.cer, \*.pem)
- An environment variable called `SAKULI_TRUSTED_CERT_DIR` which holds the path to the directory where certificates for import are located inside the container

If the environment variable has been set, a startup script will pick up all certificates contained in the given folder
and import each of them to all available browser certificate stores within `$HOME`, supporting both `cert8.db` databases
for older browser versions as well as `cert9.db` files for recent browser versions.


#### 6.2 Sample

{{<highlight bash>}}
~$ docker run -v /path/to/certificates/:/certificate_import -e SAKULI_TRUSTED_CERT_DIR=/certificate_import/ taconsol/sakuli:2.4.0-1
{{</highlight>}}

#### 6.3 Firefox

By default, a Firefox test uses a new, blank profile for each test suite execution. In order to pick up the added certificates,
a Firefox profile containing the appropriate certificate database has to be specified via
`selenium.firefox.profile=/path/to/profile/folder` in `testsuite.properties`. In order to make this process easier, a
dedicated Firefox profile for use with certificates is located at `/headless/firefox-certificates` to be used, instead
of the generated profiles in `/headless/.mozilla/firefox/long_random_id.default`.

**Attention:** If this property is not set, added certificates will have no effect.

## 7 Remote desktop protocol (RDP) connections {#remote-connection-container}
There are use cases that cannot be covered with the standard Linux based Sakuli container e.g. testing software that is
only available for Microsoft Windows or automating processes in SAP. If you still want to leverage the flexibility and
scalability of a container based Sakuli execution, we provide the `sakuli-remote-connection` container. This image
ships with a [remmina](https://remmina.org/) installation to connect to a remote Windows machine using RDP.

### 7.1 RDP example

To start remmina with a prepared configuration, please ensure to mount the required config file into the container using
a volume or to create a base image with the configuration installed.  

Sakuli check:
{{<highlight typescript>}}
(async () => {
    const remmina = new Application(`remmina --connect <path/to/remmina/config.rdp>`);
    try {
        await remmina.open();
        await env.sleep(2); //wait for remmina to open
        await env.type(Key.TAB)
            .type(Key.TAB)
            .type(Key.ENTER); //accept certificate
        await env.paste("<Username>")
            .type(Key.TAB)
            .pasteAndDecrypt("<encryptedPassword>")
            .type(Key.TAB)
            .paste("<Windows IP or Hostname>")
            .type(Key.TAB)
            .type(Key.TAB)
            .type(Key.ENTER); //login to windows host
            
        // perform actions on host  
        
        await remmina.close();
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
{{</highlight>}}

Sample `config.rdp`:
{{<highlight typescript>}}
screen mode id:i:2
session bpp:i:64
compression:i:1
keyboardhook:i:2
displayconnectionbar:i:1
disable wallpaper:i:1
disable full window drag:i:1
allow desktop composition:i:0
allow font smoothing:i:0
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:35.158.200.121
audiomode:i:2
microphone:i:0
redirectprinters:i:0
redirectsmartcard:i:0
redirectcomports:i:0
redirectsmartcards:i:0
redirectclipboard:i:1
redirectposdevices:i:0
autoreconnection enabled:i:1
authentication level:i:0
prompt for credentials:i:1
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
precommand:s:
promptcredentialonce:i:1
drivestoredirect:s:
{{</highlight>}}

To execute test actions on the RDP host, we recommend to use keyboard shortcuts instead of image recognition 
to increase stability. In case you want to use Sakuli browser interaction in your check, it is required to install a 
Selenium Server on the Windows host and configure Sakuli to connect the browser functionality with the Selenium Server.  

## 8 Overview Environment Variables

| Environment Variable    | Default Value | Description                                                                                                      |
| ----------------------- | --------------| ---------------------------------------------------------------------------------------------------------------- |
| SAKULI_TEST_SUITE       |               | Path to Sakuli testsuite to be executed                                                                          |
| SAKULI_LICENSE_KEY      |               | Sakuli license to use the container                                                                              |
| VNC_COL_DEPTH           | 24            | Color depth of container monitor                                                                                 |
| VNC_RESOLUTION          | 1280x1024     | Screen resolution of container                                                                                   |
| VNC_PW                  | vncpassword   | Password to access NoVNC/VNC connection                                                                          |
| VNC_VIEW_ONLY           | false         | Enable/Disable view-only mode                                                                                    |
| NPM_TOKEN               |               | NPM token to access npmjs.com registry                                                                           |
| SAKULI_TRUSTED_CERT_DIR |               | Directory containing custom certificates for import                                                              |
| GIT_URL                 |               | URL of git repository                                                                                            |
| GIT_CONTEXT_DIR         |               | Path to Sakuli testsuite within the git repository                                                               |
| DEBUG                   | false         | Enables debug mode for container startup                                                                         |
| INSTALL_PACKAGES        | false         | Installs packages defined in the `package.json` at container startup **(Available from v2.5.0)**                 |
| LANGUAGE                | en_US:en      | Changes Language for Chrome (available values: en_US:en, de_DE:de) <a href="https://help.ubuntu.com/community/EnvironmentVariables#The_LANGUAGE_priority_list" target="_blank">(System variable of Ubuntu)</a> **(available in tech preview)** | 
| LC_ALL                  | en_US.UTF-8   | Changes Language for Firefox (available values: en_US.UTF-8, de_DE.utf-8) <a href="https://help.ubuntu.com/community/EnvironmentVariables#The_LANGUAGE_priority_list" target="_blank">(System variable of Ubuntu)</a> **(available in tech preview)** |
