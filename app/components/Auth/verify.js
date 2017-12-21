export const checkEmail = (email) => {
  var output = '';

  if(/@ttu.edu$/.test(email) !== true) {
    output = 'Please use a TTU email address.';
  }

  return output;
}

export const checkPass = (password) => {
  var output = '';

  if(/^[\x00-\x7F]+$/.test(password) !== true) {
    // ASCII only
    output = 'Please use only ASCII characters.';
  } else if(password.length < 8) {
    // 8 characters long
    output = 'Please use at least 8 characters.';
  } else if(/[A-Z]/.test(password) !== true) {
    // 1 uppercase
    output = 'Please use at least one uppercase letter.';
  } else if(/[a-z]/.test(password) !== true) {
    // 1 lowercase
    output = 'Please use at least one lowercase letter.';
  } else if(/[0-9]/.test(password) !== true) {
    // 1 number
    output = 'Please use at least one number.';
  } else if(/[^A-Za-z0-9]/.test(password) !== true) {
    // 1 special character
    output = 'Please use at least one special character.';
  }

  return output;
}

export const checkConfirm = (password, confirm) => {
  var output = '';

  if(password !== confirm) {
    output = 'Please enter a matching password.';
  }

  return output;
}

export const checkID = (studentID) => {
  var output = '';

  if(/^[0-9]{8}$/.test(studentID) !== true) {
    output = 'Please use 8 numbers.';
  }

  return output;
}
