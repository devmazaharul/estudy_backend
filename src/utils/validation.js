const nameValidation = (name) => {
  const nameRegex = /^[A-Za-z][A-Za-z'-]{0,49}(?: [A-Za-z][A-Za-z'-]{0,49})*$/;

  return nameRegex.test(name);
};

const emailValidation = (name) => {
  const regex =
    /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
  return regex.test(name);
};

const validatePhoneNumber = (phone) => {
  const regex = /^01[3-9]\d{8}$/;
  return regex.test(phone);
};

module.exports = {
  nameValidation,
  emailValidation,
  validatePhoneNumber,
};
