---
title : "Enterprise Features"
pre : "<i class='fas fa-chevron-right'></i>  "
date :  2019-09-12T14:16:46+02:00
weight : 3
---

# Enterprise Features

Some features of Sakuli require an enterprise license. Please consult our [overview](/Docs/enterprise) to see and request packages and prices. After you registered for an enterprise subscription, you will get a license-key and an NPM access token which are required to use enterprise features.

## Using License Information

With your active [Sakuli Enterprise](/Docs/enterprise) subscription you will receive an email with:

- _Sakuli license-key_ - Contains information about your subscription and is used by Sakuli itself
- and a _NPM-Token_ - Allows access to Sakuli's private enterprise packages on NPM

There are several ways to handle these information. The most simple way for setting up your enterprise features is as follows (_substitute the placeholders between the chevrons with the appropriate values_):


### Global configuration
The most simple way to get your enterprise features to work is the following configuration (_substitute the placeholders marked by the angle-brackets with its appropriate values_):

_On Unix / OSX_
{{<highlight bash>}}
echo "//registry.npmjs.org/:_authToken=<Put your personal NPM-TOKEN here>" > ~/.npmrc
echo "export SAKULI_LICENSE_KEY=<Put your personal SAKULI-LICENSE-KEY here>" >> ~/.bashrc
{{</highlight>}}

_On Windows_
{{<highlight bash>}}
echo //registry.npmjs.org/:_authToken=<Put your personal NPM-TOKEN here> > %USERPROFILE%\.npmrc
setx SAKULI_LICENSE_KEY=<Put your personal SAKULI-LICENSE-KEY here>
{{</highlight>}}



The environment variables might not take effect in the command-line window where the commands above are entered. So you might need to open a new commandline when running the Sakuli command.


These commands will set the NPM-Token and License Key globally. This is good for a first setup on your machine but might have some shortcomings in more advanced situations. The following paragraphs describe alternative ways to provide NPM-Token and License information to your Sakuli installation.

Now you are ready to go for using Sakuli with its enterprise features like

- [Check_MK](check)
- [Icinga2](icinga)
- [OMD](omd)

### Per-Project configuration of NPM-Token

You can set the NPM-Token for each project by adding a `.npmrc` file to your project's root directory:

_On Unix / OSX_
{{<highlight bash>}}
# cd path/to/project
echo "//registry.npmjs.org/:_authToken=<Put your personal NPM-TOKEN here>" > .npmrc
{{</highlight>}}

_On Windows_
{{<highlight bash>}}
# cd path/to/project
echo //registry.npmjs.org/:_authToken=<Put your personal NPM-TOKEN here> > .npmrc
{{</highlight>}}

This command will create an `.npmrc` file with the necessary token configuration inside your specific project folder. Every upcoming `npm install` will use this configuration.

### Per-Project configuration with environment variable
If you don't like to save the token in a file (because this file might be shared) you can configure it to use an [environment variable](#more-about-environment-variables):

_On Unix / OSX_
{{<highlight bash>}}
echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > ~/.npmrc
{{</highlight>}}

_On Windows_
{{<highlight bash>}}
echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > %USERPROFILE%\.npmrc
{{</highlight>}}

_On Unix / OSX_
{{<highlight bash>}}
NPM_TOKEN=<Put your personal NPM-TOKEN here> npm i <ENTERPRISE-PACKAGE>
{{</highlight>}}

_On Windows_
{{<highlight bash>}}
set NPM_TOKEN=<Put your personal NPM-TOKEN here>
npm i <ENTERPRISE-PACKAGE>
{{</highlight>}}

This approach is frequently used in automation scenarios such as CI/CD pipelines and projects that are shared (e.g. via version control systems).

It is usually not necessary to persist the token since you will seldomly run `npm install` that often.


## Using the License-Key

The license-key contains information about your subscription which will be checked by enterprise components before they are executed. In order to provide this License-Key to Sakuli you also have to set it as an environment variable. Because the license-key is read on every single test execution it is useful to store it persistently on your system or set it in a script where the actual test is also called.

The name of the environment variable for the license-key is `SAKULI_LICENSE_KEY`.

## More about Environment Variables

> An environment variable is a dynamic-named value that can affect the way running processes will behave on a computer.
> They are part of the environment in which a process runs. For example, a running process can query the value of the TEMP environment variable to discover a suitable location to store temporary files, or the HOME or USERPROFILE variable to find the directory structure owned by the user running the process.

\- <a href="https://en.wikipedia.org/wiki/Environment_variable" target="_blank">Wikipedia, 08/2019</a>

So basically an environment variable is just a simple key-value pair provided to a certain process e.g. `VAR_NAME=VALUE`. They can be set for each process or system-wide - so that they become accessible for each upcoming process.

The approach for integrating an environment variable depends on the respective operating system.

### On Windows

To set up an environment variable on Windows you have to:

- Open _Start-Menu_ and type <kbd>env</kbd> into the search mask
  - An entry **'Edit the system environment variables'** should appear (click on it)
- After the _System Properties_ dialog showed up
  - Go to the _Advanced_ tab
  - Click on the button _Environment Variables_ (at the bottom of the dialog)
- You should see two tables including _Variable_ and _Value_ columns for _User Variables_ and _System variables_

There you can set, edit or delete environment variables permanently on your system (it is recommended to edit the system variables table if possible). A more detailed guide can be found <a href="https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/" target="_blank">here</a>.

Alternatively you can use <a href="https://www.rapidee.com/en/about" target="_blank">Rapid Environment Editor</a> which is a nice tool for editing environment variables on Windows.

In case of a more restrictive environment - where it is not possible to edit environment variables that easily - you can set them in a batch script:

`run-sakuli.bat`
{{<highlight batch>}}
SET SAKULI_LICENSE_KEY=<PERSONAL_LICENSE>
sakuli run .
{{</highlight>}}

### On Linux or OSX

On Linux or OSX it is usually a file which sets up the environment for certain processes:

- `~/.bashrc` on Linux
- `~/.profile` on OSX

These files can be changed with every text editor to add, edit or remove environment variables. An environment variable is defined by:

{{<highlight bash>}}
export VARIABLE_NAME=VALUE
{{</highlight>}}

A new variable can be added with the command:

{{<highlight bash>}}
echo "export VARIABLE_NAME=VALUE" >> ~/.bashrc  # Linux
echo "export VARIABLE_NAME=VALUE" >> ~/.profile # OSX
{{</highlight>}}
