# Sakuli Web Page for Documentation

# prerequisites
*  hugo

# start the server
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
