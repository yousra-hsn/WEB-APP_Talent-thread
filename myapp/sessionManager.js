const sessions = require("express-session");

module.exports = {
  init: () => {
    return sessions({
      secret: "AI16-P24-BENHASS",
      saveUninitialized: true,
      resave: false,
      cookie: {
        secure: false,
        httpOnly: true, // Ajout de l'attribut httpOnly
        maxAge: 3600 * 1000 // 60 minutes
      },
    });
  },

  createSession: function (session, mail, role) {
    session.isAuthenticated = true;
    session.userRole = role;
    session.userid = mail;
    session.lastActivity = Date.now();
    session.save((err) => {
      if (err) console.log(err);
    });
    console.log(`Session created for user: ${mail} with role: ${role}`);
    return session;
  },

  isConnected: (session, role) => {
    if (!session.isAuthenticated) return false;
    if (role && session.userRole !== role) return false;

    const maxInactiveTime = 30 * 60 * 1000; // 30 minutes
    if (Date.now() - session.lastActivity > maxInactiveTime) {
      console.log(`Session expired for user: ${session.userid}`);
      session.destroy();
      return false;
    }

    // Mettre à jour l'activité de l'utilisateur
    session.lastActivity = Date.now();
    console.log(`User ${session.userid} last activity updated to: ${new Date(session.lastActivity)}`);
    return true;
  },

  deleteSession: function (session) {
    session.destroy();
    console.log(`Session destroyed for user: ${session.userid}`);
  },
};
