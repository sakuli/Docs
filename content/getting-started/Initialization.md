---
title : "Initialization"
date :  2019-09-10T15:26:17+02:00
weight : 2
---

# Initialize a project

This guide will get you started with writing Sakuli tests from scratch.
To follow this tutorial, you should create a new NPM project in an empty folder.

For this guide, we will assume that our working directory is `/tmp/sakuli_starter` on a *nix system, or `%Temp%\sakuli_starter` on a Windows machine.

To create a new, empty project, first run:

{{< highlight bash >}}
npm init
{{< /highlight >}}

This interactive prompt will ask you for some metadata regarding your project.
You can either modify these fields to your needs or just accept the defaults.

Once completed, you should see a short summary similar to the following snippet:

{{< highlight bash >}}
About to write to /tmp/sakuli_starter/package.json:

{
  "name": "sakuli_starter",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this OK? (yes)
{{< /highlight >}}

The empty project has been initialized after confirming the prompt.