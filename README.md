Node js sample application with es6, eslint, and babel transpiling configured
The server folder architecture can be changed based on requirement of application, for larger applications, logical separation into folder

* Runner.js file handles the Zero-downtime clustering of the node application

* Install eslint extension on VS Code and enable following setting in user settings
"eslint.autoFixOnSave": true
for auto fixing eslint errors in code.

Modules folder can be like the following:
/upload : /uploadModel
          /uploadHandler
          /uploadRouter
/post :   /postModel
          /postHandler
          /postRouter
          
Logical separation of apis and respective models + handlers for easier browsing through the application
