+++
title = "Run Container"
date =  2019-12-16T18:57:44+01:00
weight = 5
+++

# How to run a Container with Sakuli Tests
> Sakuli Container are only available with an active Sakuli subscription.

The following how-to aims to help unexperienced users getting started with Sakuli Containers. 
A Sakuli Container ships with pre-installed Sakuli, Monitoring forwarder and other additional features, it is not necessary to install anything on your docker-host, except for docker.

## Download the image
With your logged-in docker-user (which is authorized to access the repository with an active subscription), you first need to download the Sakuli image:
{{<highlight bash>}}
docker pull taconsol/sakuli:2.2.0
{{</highlight >}}

## Folder structure and necessary files
You will need a proper Sakuli Test setup on your docker-host. Do one of the following to bootstrap this setup:

Either clone the Git Repository
{{<highlight bash>}}
git clone git@github.com:sakuli/container_bootstrap.git sakuli-container_bootstrap
{{</highlight >}}

OR


Download the following ZIP
{{<link_remote "https://github.com/sakuli/container_bootstrap/zipball/master/""Download as ZIP">}}

After cloning the repo / unzipping the file, you will have a folder structure like this with the proper files to run a test using a Sakuli container:
{{<image "/images/folderStructureContainerTest.png""Showing the folder structure in a Editor">}}

## Run
Open a terminal and navigate to the folder "sakuli-container_bootstrap*".
Within this folder, run the following docker command (you will have to insert your active Sakuli License Key):
{{<highlight bash>}}
docker run --rm -v $(pwd):/suite -p 5901:5901 -p 6901:6901 -e SAKULI_TEST_SUITE=/suite -e SAKULI_LICENSE_KEY=YourLicenseKey taconsol/sakuli:2.2.0
{{</highlight >}}

## Watch the magic
You can use the noVNC feature to have a live-view of what is happening within the Container by opening the following link on your docker-host while the container is running and a test is executed:
http://localhost:6901/?password=vncpassword

## What´s more?
Have a look at our Enterprise documentation about Container, Forwarder etc. to get a more in-depth knowledge on what is happening and on how to customize the execution of Sakuli tests.