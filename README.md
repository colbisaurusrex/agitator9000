# Welcome to the Agitator 9000
This program allows you to enter your address to find state and federal officials that represent you in either the legislative or executive branch.

The Agitator 9000 empowers you to quickly and easily produce a letter to send to an official of your choosing by answering a few questions about your location. Once the The Agitator 9000 determines who your representative is, you simply type a message and download the letter it produces. Done and done.

### Important for anyone inspecting the code 👀.
There are two different versions of this program that function exactly the same.  There are two folders, `withlibraries` and `withoutlibraries`. The first contains a version of the program in which I use modules, like `axios`, to accomplish certain tasks. The other, `withoutlibraries`, strips away all abstractions and written only in Vanilla JS & Node.js. This was to demonstrate what is going on "under the hood" so to speak. It uses `Promises`, accesses the `process` api to prompt the user and other fun stuff.

## To use this program
This is a command line Node program.

If you are using the `withlibraries` version, you must run the `npm install` command to install dependenices.

From there, you must run the `npm start` command to run the program.

If you are using the `withoutlibraries` version, you only need to run `npm start` to run the program. There are no dependencies.

Easy-peasy. Follow the steps of the program and you'll be civilly disobedient in no time.
