# COP4311-Group-30-Contact-Manager
Welcome to **UCF**'s COP4331C Group 30's git page.\
This is the source control for our project that is hosted on http://spadecontactmanager.com/.
## Contents of Repository
This repository contains the both the front-end and the back-end of the project.

The front-end uses consists of only HTML, CSS5 (some generated with SASS), and javascript.
To be particular, bootstrap was used mostly for creating the modals in the user hub and jQuery was used for the logic of the front-end as well as to make the page an SPA - mimicking frameworks such as React, which were not allowed in this project.

The back-end is a RESTFUL API written in php and interacts with our MySQL database with use of `mysqli`.\
It also has password hashing, JWT session validation, and consistent error reporting.
