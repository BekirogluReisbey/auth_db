const csrf = require("csurf");

const csrfProtection = csrf({
  cookie: true,  // CSRF-Token wird in einem Cookie gespeichert
  ignoreMethods: ["GET", "HEAD", "OPTIONS"],  // Nur POST, PUT, DELETE geschützt
});

module.exports = csrfProtection;
