const validateEmail = async (email) => {
  var tester =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!email) return false;

  var emailParts = email.split("@");

  if (emailParts.length !== 2) return false;

  var account = emailParts[0];
  var address = emailParts[1];

  if (account.length > 64) return false;
  else if (address.length > 255) return false;

  var domainParts = address.split(".");

  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return tester.test(email);
};

const validatePassword = async (password) => {
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  var tester =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return tester.test(password);
};

export { validateEmail, validatePassword };
