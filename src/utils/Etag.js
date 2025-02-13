const crypto = require('crypto');

const generateEtag = (data) => {
  try {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateEtag,
};
