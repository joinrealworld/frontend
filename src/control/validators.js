import validator from "validator";

export default {
  creditCard: (rule, value = "") => {
    return rule === true
      ? validator.isCreditCard(value)
      : !validator.isCreditCard(value);
  },
  email: (rule, value = "") => {
    return rule === true ? validator.isEmail(value) : !validator.isEmail(value);
  },
  equals: (rule, value = "") => {
    return validator.equals(value, rule);
  },
  expiryDate: (rule, value = "") => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(value);
  },
  cvv: (rule, value = "") => {
    const regex1 = /^[0-9]{3}$/;
    const regex2 = /^[0-9]{4}$/;
    return regex1.test(value) || regex2.test(value);
  },
  billingAddress: (rule, value = "") => {
    const regex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
    return regex.test(value);
  },
  matches: (rule, value = "") => {
    return rule === value;
  },
  minLength: (rule, value = "") => {
    return value.length >= rule;
  },
  phone: (rule, value = "") => {
    return rule === true
      ? validator.isMobilePhone(value)
      : !validator.isMobilePhone(value);
  },
  postalCode: (rule, value = "") => {
    return rule === true
      ? validator.isPostalCode(value)
      : !validator.isPostalCode(value);
  },
  required: (rule, value = "", isCheckedInput) => {
    if (!isCheckedInput) {
      return rule === true
        ? value && value.trim() !== ""
        : value && value.trim() === "";
    }

    if (isCheckedInput) {
      return rule === true ? value : !value;
    }
  },
  semVer: (rule, value = "") => {
    return rule === true
      ? validator.isSemVer(value)
      : !validator.isSemVer(value);
  },
  slug: (rule, value = "") => {
    return rule === true ? validator.isSlug(value) : !validator.isSlug(value);
  },
  strongPassword: (rule, value = "") => {
    return rule === true
      ? validator.isStrongPassword(value)
      : !validator.isStrongPassword(value);
  },
  url: (rule, value = "") => {
    return rule === true ? validator.isURL(value) : !validator.isURL(value);
  },
  vat: (rule, value = "") => {
    return rule === true ? validator.isVAT(value) : !validator.isVAT(value);
  },
};
