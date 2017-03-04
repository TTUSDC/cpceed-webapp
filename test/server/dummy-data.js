export let auth = {
  "patty.lastname@ttu.edu": "patty123",
  "john.doesnt@ttu.edu": "john234",
  "sally.does@ttu.edu": "324sally"
};

export let emailToUid = {
  "patty.lastname@ttu.edu": "QveDEhTHWSgVbnL4NXrdD6rSvns1",
  "john.doesnt@ttu.edu": "hMXRXnHKQdbGmX9bwaZntRaJER03",
  "sally.does@ttu.edu": "k8fcP5IgEVcuVVaOTQWduYwheur1"
};

export let users = {
  "QveDEhTHWSgVbnL4NXrdD6rSvns1": {
    email: "patty.lastname@ttu.edu",
    firstName: "Patty",
    lastName: "PattysLastName",
    role: "ADMIN"
  },
  "hMXRXnHKQdbGmX9bwaZntRaJER03": {
    approvalStatus: true,
    email: "john.doesnt@ttu.edu",
    firstName: "John",
    lastName: "Doesnt",
    points: 0,
    role: "STUDENT",
    studentId: "110452"
  },
  "k8fcP5IgEVcuVVaOTQWduYwheur1": {
    approvalStatus: true,
    email: "sally.does@ttu.edu",
    firstName: "Sally",
    lastName: "Does",
    points: 0,
    role: "STUDENT",
    studentId: "110451"
  }
};

export let reports = {
  "QdbGmX9bwaOTQWduYw": {
    type: "event",
    student: "110451",
    event: "someevent"
  }
};

export let events = {
  "QWduYwX": {
    "contact" : "patty",
    "creator" : "patty",
    "datetime": "2017:05:08:07:00",
    "location": "Silicon Valley",
    "title": "GTC",
    "description": "GPU Technology Conference. The Largest and most important event of the year for GPU developers."
  },
  "SFSDVFDFHGQWduYwX":{
    "contact" : "creator",
    "creator" : "patty",
    "datetime" : "2017:11:24:08:00",
    "location" : "Bellevue, Washington",
    "title" : "CPP Con",
    "description" : "CppCon is the annual, week-long face-to-face gathering for the entire C++ community. The conference is organized by the C++ community for the community."
  },
  "asdfQWduYwzxvSFDX":{
    "contact" : "creator",
    "creator" : "patty",
    "datetime" : "2017:05:20:09:00",
    "location" : "United Supermarkets Arena",
    "title" : "Graduation",
    "description" : "TTU Commencemnt for the College of Engineering"
  }
};
