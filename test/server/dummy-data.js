module.exports = {
  auth: {
    "patty.lastname@ttu.edu": "patty123",
    "john.doesnt@ttu.edu": "john234",
    "sally.does@ttu.edu": "324sally"
  },
  emailToUid: {
    "patty.lastname@ttu.edu": "QveDEhTHWSgVbnL4NXrdD6rSvns1",
    "john.doesnt@ttu.edu": "hMXRXnHKQdbGmX9bwaZntRaJER03",
    "sally.does@ttu.edu": "k8fcP5IgEVcuVVaOTQWduYwheur1"
  },
  users: {
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
  },
  reports: {
    "QdbGmX9bwaOTQWduYw": {
      type: "event",
      student: "110451",
      event: "someevent"
    }
  },
  events: {
    "QWduYwX": {
      "datetime": "2017:05:08:07:00",
      "location": "Silicon Valley",
      "title": "GTC",
      "description": "GPU Technology Conference. The Largest and most important event of the year for GPU developers."
    }
  }
}
