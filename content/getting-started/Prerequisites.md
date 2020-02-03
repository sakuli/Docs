---
title : "Prerequisites"
date  :  2019-09-10T15:25:53+02:00
weight : 1
---

# What you need

Sakuli is built and tested against the current LTS version of Node.js.
In order to be able to run Sakuli on your system, we will assume that you have a Node v12 (lts/erbium) installed on it.

To install Node on your system, you can either go to the <a href="https://nodejs.org/en/" target="_blank">Node website</a> or you can use tools like <a href="https://github.com/nvm-sh/nvm" target="_blank">Node Version Manager</a> utility to manage various Node versions on a per-user basis. In general, a per-user installation is the preferred way since it runs in an unprivileged mode.

## Attention

There's an issue regarding Sakuli in combination with node versions >= 12.13.1 on macOS (see [#2398](https://github.com/nodejs/help/issues/2398)) which causes Sakuli tests to break when using native actions like `env.type(...)`.

If you happen to run into this issue, please try downgrading to node v12.13.0 to run your tests.
We are sorry for this inconvenience and are trying to resolve the issue.
