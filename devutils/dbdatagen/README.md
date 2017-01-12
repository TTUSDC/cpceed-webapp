# Database Data Generator
Generates random data to fill the database.
This script uses firebase-admin which needs authentication.

Instructions for setting that up on your machine are as follows:  
1. Go to **project settings => service accounts => firebase admin sdk** in the firebase console for the app  
2. Click on **generate private key** and rename the file to `cpceed-firebase-admin-key.json` before saving to `CPCEEDWebApp/devutils/dbdatagen/`

Further help can be found [here](https://firebase.google.com/docs/database/admin/start).

# Usage

```
  Usage: datagen [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -g, --gen <genfile>     Generate data using passed in file as template
    -d, --delete <uidfile>  Delete all UIDs listed in file
```

## Generating Data
To generate data, you need to pass in a 'script', a JSON file with what you want generated. This allows you to specify exactly what you want generated.
The way this works is you define a JSON object for each 'thing' you want generated filling in all the required information.
After that, you can specify any additional information you want in that object, or leave if blank if it doesn't matter.
For the data you don't care about, datagen will auto-fill it with random data!
**Note: As of now, there is _no_ data validation on the JSON, so be careful!**

You should use the name `gen-script.json` for the file and put it in `devutils/dbdatagen/`, because the `.gitignore` handles that case.


## Deleting Data
By calling the `delete` option, you are expected to pass in a file containing the UIDs of the people you wish to delete, 1 per line, like so
```
laq4wrjwal34rj
awsfkljw34f43f
```

## Points
The `point` option resets the `/aepoints` database reference to match what is in the [aepoints.json](./data/aepoints.json) file.


# Generation Script

This snippet contains a skeleton of what is **required** for the script with two people for example.
```JSON
{
  "people":[
    {
      "role": "admin"
    },
    {
      "role": "student"
    }
  ],
  "events":[],
}
```

## Full Example
And this snippet contains **all** the info you can override. The values do **not** represent what the program puts in when you don't specify.

```JSON
{
  "people":[
    {
      "role": "admin",
      "email": "dummyadmin@email.com",
      "displayName": "displayAdmin",
      "firstName": "firstname",
      "lastName": "lastname",
      "password": "password",
      "ref" : "adminref123"
    },
    {
      "role": "student",
      "email": "dummystudent@email.com",
      "displayName": "displayStudent",
      "firstName": "firstnames",
      "lastName": "lastnames",
      "password": "password",
      "points": 0,
      "studentId": "123456",
      "approvalStatus": false
    }
  ],
  "events" : [
    {
      "creator" : "Linus Torvalds",
      "contact" : "Chris Anderson",
      "category" : "other",
      "datetime" : "2016:02:17:8:30",
      "location" : "Vancouver, Canada",
      "title" : "The Mind Behind Linux",
      "description" : "Ted Talk with Linus Torvalds given by TED Curator, Chris Anderson"
    }
  ]
}
```
## Data Fields
Below is a guide to all the keys in the objects above and the requirements on their values.
### People
Database Reference: `/users`
- role (**REQUIRED**  )
  - Type: ENUM { admin, student }
- displayName
  - Type: String
  - Description: Used by Firebase
- email /firstName / lastName / password
  - Type: String
- ref
  - Type: String
  - Description: This is used to reference the user in other parts of the script like events and reports. Upon creation of the user, the ref value will be replaced by the UID of that user. **All ref values MUST be unique per user**

### Events
- creator
  - Type: String (Either the user UID from the Firebase or a ref of a person described above.)
  - Description: The user that created the event. Important for determining who can see the event

- contact
  - Type: String
  - Description: Who to contact about the event, in case the creator isn't the one who should be contacted.
  - Generation: If no contact is provided, the generator auto-fills it with whatever the 'creator' holds.

- category
  - Type: ENUM { first, professor, staff, outreach, community, other, mentor, career}
  - Description: Allow the correct category in the student's points to be incremented

- datetime
  - Type: String in format(YYYY:MM:DD:HH:MM)
  - Description: When the event will be held, lets users know when they should attend the event

- location:
  - Type: String
  - Description: Where the event will be held, allows users to navigate to the event

- title
  - Type: String
  - Description: Give users a way of referring to the event. This could be important for signage guiding students to events  

- description
  - Type: String
  - Description: An explanation of what the event is about. Give students more information to use when deciding whether they want to attend an event
