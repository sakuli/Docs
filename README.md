# Sakuli Web Page for Documentation

# prerequisites
*  hugo

# start the server locally
After cloning the project to your local host, switch into the root folder via the command prompt and type
`hugo server`
then go into the browser and navigate to server via the url
[http://localhost:1313/](url)

# add pages
All pages are contained in ./contents folder. To create a new page simply type from root directory
`hugo new path/foo.md`
and a new page will be created. So for a sub topic ./contents/subtopic/foo.md the command should look like
`hugo new subtopic/foo.md`. The page will be implemented automatically and its title should be displayed according to the theme 
in the left menu-bar.

# Travis CI
This repository has two branches:
  1) Dev: Developtment Branch
  2) Master: Output branch

Before pushing you need to run a hugo command `hugo -b /Docs`. This will build the page in the public-folder (sub-Dir) with `/Docs` as the base url of your landing page. After pushing to the Dev-branch, [github-pages](https://pages.github.com/) will (ONLY) take the `./public`-dir from the dev-branch and mirror it at the master-branch. If you now start a [Travis](https://travis-ci.com/) job within your account and project it will grab the content from this master-branch and make it visitable under `<your username on github>.github.io/Docs/`.

### Take page offline
Navigate to settings of this Repo - https://github.com/IamR0oT/Docs/settings/ and go to options/github pages and change the source option from master to none. In order to make the page visible again, reverse this procedure (vice versa).
