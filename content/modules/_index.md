---
title : "Modules"
pre : "<i class='fas fa-chevron-right'></i>  "
date :  2019-09-12T14:16:46+02:00
weight : 4
---

# Modules

## Assisted Setup

It is assumed that you have setup your environment as described in the [Getting Started Guide](/docs/getting-started).

On the commandline, navigate to the root folder of your Sakuli project (where the `package.json` file is located) and run the following command:

{{<highlight bash>}}
npx sakuli enable-modules
{{</highlight>}}

The prompt asks you about the features which you want to activate. You can use <kbd>↑</kbd> and <kbd>↓</kbd> to navigate the cursor and <kbd>SPACE</kbd> to select or deselect a feature. Pressing <kbd>ENTER</kbd> will submit your selection and start the setup process.

{{<highlight bash>}}
? Please select the modules to bootstrap (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ Forwarding to Icinga2
 ◯ Forwarding to checkmk
 ◯ Forwarding to OMD
 ◯ Forwarding to Prometheus
 ◯ Optical Character Recognition (OCR) Plug-in
{{</highlight>}}

Sakuli will then install and preconfigure the selected features in your project.

You can now just start using your feature:

- [Forwarding to Icinga2](/docs/modules/icinga/)
- [Forwarding to checkmk](/docs/modules/check/)
- [Forwarding to OMD](/docs/modules/omd/)
- [Forwarding to Prometheus](/docs/modules/prometheus/)
- [Optical Character Recognition (OCR) Plug-in](/docs/modules/ocr)

The next sections is about how to setup the features manually and in more detail.

## Manual Setup

The manual setup is described in the corresponding module

- [checkmk](check)
- [Icinga2](icinga)
- [OMD](omd)
- [Prometheus](prometheus)
- [Optical character recognition (OCR)](ocr)
