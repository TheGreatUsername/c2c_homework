# c2c_homework
The first thing to do to get it running is to create a folder for the react project, such as c2c_homework_react. 
Next, cd into that folder and run this command (including the . at the end)

    npx create-react-app .
    
Now copy and paste the files from the react folder on this repo into the src folder on your new project, replacing all duplicate files. 

Next, create a c2c_homework folder in the Sites folder on your Mac and copy the files in the php folder on this repo into the new c2c_homework folder.

Now go back into the src folder in the react project and change the phpdir variable in the App.js file to use your computer username. 

Now make sure Apache is running with this command. If you don't have Apache set up yet I used this tutorial (https://discussions.apple.com/docs/DOC-250001766)

    sudo launchctl load -w /System/Library/LaunchDaemons/org.apache.httpd.plist
    
And then cd into the c2c_homework_react folder we created in the beginning and after that run this command

    npm start
