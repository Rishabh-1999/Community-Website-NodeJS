function isAllowed(req, res, next) {
  if (req.isAuthenticated())
    res.redirect("/home");
  else
    next();
}

function checkSession(req, res, next) {
  if (req.isAuthenticated())
    next();
  else
    res.redirect('/');
}

function checkSuperAdmin(req, res, next) {
  if (req.session.passport.user.role == "SuperAdmin")
    next();
  else
    res.redirect("/");
}

function checkSuperAdminOrCommunityManagers(req, res, next) {
  if (
    req.session.passport.user.role == "SuperAdmin" ||
    req.session.passport.user.role == "CommunityManagers"
  )
    next();
  else
    res.redirect("/");
}

// Exporting all the modules
module.exports.isAllowed = isAllowed;
module.exports.checkSession = checkSession;
module.exports.checkSuperAdmin = checkSuperAdmin;
module.exports.checkSuperAdminOrCommunityManagers = checkSuperAdminOrCommunityManagers;