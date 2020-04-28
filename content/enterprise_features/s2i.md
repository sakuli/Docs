---
title : "S2I Image"
date : 2019-09-12T14:16:13+02:00
weight : 5
---
# S2I Image

Sakuli enterprise comes with ready-to-use <a href="https://github.com/openshift/source-to-image" target="_blank">source to image (S2I)</a> containers for RedHat OpenShift. Using this builder container, it is easily possible to create deployable Sakuli images
shipped with a test suite straight from your code repository.

## Setup
To setup the source to image builds on your OpenShift cluster, it is required to import the images from 
`taconsol/sakuli-s2i`. To achieve this, you have to create a docker-registry secret with your `<docker-username>` and
`<docker-password>` and link it to your `builder` service account to authenticate on docker.io during build.
Once you obtained a Sakuli Enterprise license your Docker user will be granted access to the private Sakuli S2I images.

{{<highlight bash "hl_lines=3 4">}}
oc create secret docker-registry dockerhub-sakuli-secret \
    --docker-server=docker.io \
    --docker-username=<docker-username> \
    --docker-password=<docker-password> \
    --docker-email=unused

oc secrets link builder dockerhub-sakuli-secret
{{</highlight>}}

After you've created and linked the secret, you can import the images from the secured registry.

{{<highlight bash>}}
oc import-image sakuli-s2i \
    --from=docker.io/taconsol/sakuli-s2i \
    --confirm \
    --scheduled=true \
    --all=true
{{</highlight>}}
*Note: The `oc import-image` statement is configured to not only import all available Sakuli S2I images but also to
check for updates automatically.*
## Adding Custom Certificates

The following requirements have to be met to add custom certificates to a Sakuli S2I build:

- An OpenShift secret holding custom certificates
- A volume mount for the required certificates
- An environment variable called `SAKULI_TRUSTED_CERT_DIR` which holds the path to the directory where certificates for import are located inside the container

### Certificate Secret

{{<highlight bash>}}
oc create secret generic custom-certs \
    --from-file=my-first-cert.cer=/path/to/first/cert.cer \
    --from-file=another-cert.crt=/path/to/another/cert.crt \
    --from-file=last-cert.pem=/path/to/last/cert.pem
{{</highlight>}}

The above snippet will create a new secret called `custom-certs` which holds three key-value pairs storing our certificates.

### Certificate Volume Mount

The next step to include custom certificates is to mount them in a test container.

{{<highlight bash>}}
spec:
  containers:
  - name: ...
    image: ...
    volumeMounts:
      - name: custom-certs
        mountPath: /etc/custom-certs
  volumes:
  - name: custom-certs
    secret:
        secretName: custom-certs
{{</highlight>}}

We are defining a volume `custom-certs` which holds the content of our previously generated secrets.
By mounting this volume in our test container we're able to provide the custom certificates to the container at runtime.

If one does not want to mount all certificates, certificates can be selected via `subPath`:

{{<highlight bash "hl_lines=7 8 10 11">}}
spec:
  containers:
  - name: ...
    image: ...
    volumeMounts:
      - name: custom-certs
        subPath: first-cert.cer
        mountPath: /etc/custom-certs/first-cert.cer
      - name: custom-certs
        subPath: another-cert.crt
        mountPath: /etc/custom-certs/another-cert.crt
  volumes:
  - name: custom-certs
    secret:
        secretName: custom-certs
{{</highlight>}}

### SAKULI_TRUSTED_CERT_DIR Variable

The final step to enable custom certificates is to provide the certificate location via environment variable:

{{<highlight bash "hl_lines=5 6 7">}}
spec:
  containers:
  - name: ...
    image: ...
    env:
      - name: SAKULI_TRUSTED_CERT_DIR
        value: /etc/custom-certs
    volumeMounts:
      - name: custom-certs
        mountPath: /etc/custom-certs
  volumes:
  - name: custom-certs
    secret:
        secretName: custom-certs
{{</highlight>}}

#### Firefox

By default, a Firefox test uses a new, blank profile for each test run. In order to pick up the added certificates, a Firefox profile containing the appropriate certificate database has to be specified via `selenium.firefox.profile=/path/to/profile/folder` in `testsuite.properties`. In order to make this process easier, a dedicated Firefox profile for use with certificates is located at `/headless/firefox-certificates` to be used, instead of the generated profiles in `/headless/.mozilla/firefox/long_random_id.default`.

**Attention:** If this property is not set, added certificates will have no effect.

## Creating an S2I build {#create-s2i-build}
The following build-config template is ready to use to create Sakuli S2I builds for various repositories and test suites.
Just copy and save the [S2I build template](#s2i-template) as `sakuli-s2i-build-template.yml`. To process the template
some additional information is required that are not part of the template. First of all, you have to provide a
`SAKULI_LICENSE_KEY` to be able to execute the images resulting from the build process and you have to specify the
repository to pull the test case from as `TESTSUITE_REPOSITORY_URL`. To install such a basic setup on your OpenShift
cluster, just use the following command and replace the placeholder with actual values.

{{<highlight bash "hl_lines=2 3">}}
oc process -f sakuli-s2i-build-template.yml \
    SAKULI_LICENSE_KEY=<SAKULI_LICENSE_KEY> \
    TESTSUITE_REPOSITORY_URL=<TESTSUITE_REPOSITORY_URL> | oc apply -f -
{{</highlight>}}

### Advanced S2I build configuration
The provided template comes with a lot of optional parameter to customize your build process. The following table
contains all available parameters. Additional parameters are specified in the same way as seen in the
[Creating an S2I build](#create-s2i-build) section.

<table>
    <tr>
        <th>Parameter</th>
        <th>Optional</th>
        <th>Description</th>
        <th>Default value</th>
    </tr>
    <tr>
        <td>SAKULI_LICENSE_KEY</td>
        <td>NO</td>
        <td>Sakuli2 License key.</td>
        <td></td>
    </tr>
    <tr>
        <td>TESTSUITE_REPOSITORY_URL</td>
        <td>NO</td>
        <td>Git source URL containing the test suite.</td>
        <td></td>
    </tr>
    <tr>
        <td>TESTSUITE_REPOSITORY_REF</td>
        <td>YES</td>
        <td>Git branch/tag reference.</td>
        <td>master</td>
    </tr>
    <tr>
        <td>IMAGE</td>
        <td>YES</td>
        <td>Name for the target image to be build.</td>
        <td>sakuli-s2i-testsuite</td>
    </tr>
    <tr>
        <td>IMAGE_TAG</td>
        <td>YES</td>
        <td>Tag to push build images to.</td>
        <td>latest</td>
    </tr>
    <tr>
        <td>TESTSUITE_CONTEXT_DIR</td>
        <td>YES</td>
        <td>Source folder where the test suite is located.</td>
        <td></td>
    </tr>
    <tr>
        <td>TESTSUITE_REPOSITORY_SECRET</td>
        <td>YES</td>
        <td>Secret to access the testsuite repository.</td>
        <td></td>
    </tr>
    <tr>
        <td>BUILDER_IMAGE</td>
        <td>YES</td>
        <td>Name of the builder image.</td>
        <td>sakuli-s2i</td>
    </tr>
    <tr>
        <td>BUILDER_IMAGE_TAG</td>
        <td>YES</td>
        <td>Tag of the builder image to use.</td>
        <td>latest</td>
    </tr>
</table>

## S2I build template {#s2i-template}
{{<highlight yml>}}
apiVersion: v1
kind: Template
labels:
  template: sakuli-s2i-testsuite-image-build
metadata:
  annotations:
    description: Build config to create a ready to run Sakuli2 container with the specified testsuite
    tags: consol, sakuli2, custom-image, s2i, source-to-image
  name: sakuli-s2i-testsuite-image-build
parameters:
  - description: Name for the target image of the build.
    name: IMAGE
    required: true
    value: sakuli-s2i-testsuite

  - description: Image tag of the target image.
    name: IMAGE_TAG
    required: true
    value: latest

  - description: Sakuli2 License key.
    name: SAKULI_LICENSE_KEY
    required: true

  - description: Git source URL containing the test suite.
    name: TESTSUITE_REPOSITORY_URL
    required: true

  - description: Git branch/tag reference.
    name: TESTSUITE_REPOSITORY_REF
    value: "master"
    required: true

  - description: Source folder where the test suite is located.
    name: TESTSUITE_CONTEXT_DIR

  - description: Secret to access the testsuite repository.
    name: TESTSUITE_REPOSITORY_SECRET

  - description: Name of the builder image.
    name: BUILDER_IMAGE
    required: true
    value: sakuli-s2i

  - description: Tag of the builder image to use.
    name: BUILDER_IMAGE_TAG
    required: true
    value: latest

objects:
  - apiVersion: v1
    kind: ImageStream
    metadata:
      labels:
        application: ${IMAGE}
      name: ${IMAGE}

  - apiVersion: v1
    kind: BuildConfig
    metadata:
      labels:
        build: ${IMAGE}
      name: ${IMAGE}
    spec:
      output:
        to:
          kind: ImageStreamTag
          name: ${IMAGE}:${IMAGE_TAG}
      source:
        type: Git
        git:
          ref: ${TESTSUITE_REPOSITORY_REF}
          uri: ${TESTSUITE_REPOSITORY_URL}
        contextDir: ${TESTSUITE_CONTEXT_DIR}
        sourceSecret:
          name: ${TESTSUITE_REPOSITORY_SECRET}
      strategy:
        type: Source
        sourceStrategy:
          from:
            kind: ImageStreamTag
            name: ${BUILDER_IMAGE}:${BUILDER_IMAGE_TAG}
          env:
            - name: "SAKULI_LICENSE_KEY"
              value: ${SAKULI_LICENSE_KEY}
      triggers:
        - imageChange: {}
          type: ImageChange
        - type: ConfigChange
{{</highlight>}}

### Increasing shared memory of a Sakuli containers on OpenShift {#increasing-shared-memory-of-sakuli-on-openshift}
The result of an S2I build is a ready to run Sakuli container that can be deployed on OpenShift as a Pod, Job or CronJob.   
Depending on the size of the websites to be tested, it might be required to provide more shared memory space to the
container. Indicators that a shared memory enlargement is required are container crashes, the erroneous loading of
websites or `invalid session id` errors due to crashed browsers. In order to do so, two steps are required.

1. Creating a volume to be used as shared memory
2. Mounting the shared memory volume into the container

The following snippet shows the required configuration for a Pod deployment: 
```yaml
apiVersion: v1
id: sakuli-test
kind: Pod
metadata:
  name: sakuli-test
  labels:
    name: sakuli-test
spec:
  volumes:                          
    - name: dshm
      emptyDir:
        medium: Memory
  containers:
    - image: mySakuliTest:latest
      name: mySakuliTest
      ...
      volumeMounts:                 
        - mountPath: /dev/shm
          name: dshm
```
 More information concerning shared memory on OpenShift can be found in the
 [OKD Documentation](https://docs.okd.io/latest/dev_guide/shared_memory.html).
 
## Troubleshooting
 
### pulling image error : ...
 
 **Affected OpenShift versions:** 3.10, 3.11
 
 So far, this error occurred on 3.10 and 3.11 clusters when trying to pull our s2i image from our private Dockerhub repo.
 A workaround to solve this issue was to use `reference-policy=local` on the sakuli-s2i image stream.
 
 ```bash
 oc import-image sakuli-s2i \
     --from=docker.io/taconsol/sakuli-s2i \
     --confirm \
     --scheduled=true \
     --all \
     --reference-policy=local
 ```
