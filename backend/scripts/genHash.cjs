const bcrypt = require('bcrypt');
const password = process.argv[2] || 'Password123!';
(async () => {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
  } catch (e) {
    console.error('ERROR', e.message || e);
    process.exit(1);
  }
})();
