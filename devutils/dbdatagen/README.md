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

## Gen Script
To generate data, you need to pass in a 'script', a JSON file with what you want generated. This allows you to specify exactly what you want generated.
The way this works is you define a JSON object for each 'thing' you want generated filling in all the required information.
After that, you can specify any additional information you want in that object, or leave if blank if it doesn't matter.
For the data you don't care about, datagen will auto-fill it with random data!
**Note: As of now, there is _no_ data validation on the JSON, so be careful!**

You should use the name `gen-script.json` for the file and put it in `devutils/dbdatagen/`, because the `.gitignore` handles that case.

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
  ]
}
```


And this snippet contains **all** the info you can override, with markings next to the required information. The values do **not** represent what the program puts in when you don't specify.

```JSON
{
  "people":[
    {
      "role": "admin", REQUIRED
      "email": "dummyadmin@email.com",
      "displayName": "displayAdmin",
      "firstName": "firstname",
      "lastName": "lastname",
      "password": "password"
    },
    {
      "role": "student", REQUIRED
      "email": "dummystudent@email.com",
      "displayName": "displayStudent",
      "firstName": "firstnames",
      "lastName": "lastnames",
      "password": "password",
      "points": 0,
      "studentId": "123456",
      "approvalStatus": false
    }
  ]
}
```
