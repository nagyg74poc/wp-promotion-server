import * as crypto from 'crypto';

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function genRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length);
  /** return required number of characters */
}

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function sha512(password, salt) {
  const hash = crypto.createHmac('sha512', salt);
  /** Hashing algorithm sha512 */
  hash.update(password);
  const passwordHash = hash.digest('hex');
  return {
    salt,
    passwordHash,
  };
}

function saltHashPassword(userpassword) {
  const salt = genRandomString(16);
  /** Gives us salt of length 16 */
  try {
    return sha512(userpassword, salt);
  } catch (e) {
    throw new Error(e);
  }
}

function validate(password, salt, hash) {
  try {
    const testHash = sha512(password, salt);
    return  testHash.passwordHash === hash;
  } catch (e) {
    throw new Error(e);
  }
}

export const PwUtil = {
  validate,
  encrypt: saltHashPassword,
};