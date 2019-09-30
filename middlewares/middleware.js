function isAllowed(req, res, next) {
  if(req.session.isLogin)
    res.redirect('/home');
  else
    next();
}

function checkSession(req, res, next) {
    if(req.session.isLogin)
      next();
    else
      res.redirect('/');
}

function checkSuperAdmin(req, res, next) {
    if(req.session.data.role=="SuperAdmin")
      next();
    else
      res.redirect('/');
}

function checkSuperAdminOrCommunityManagers (req, res, next) {
    if(req.session.data.role=="SuperAdmin" || req.session.data.role=="CommunityManagers")
      next();
    else
      res.redirect('/');
}

// Exporting all the modules
module.exports.isAllowed = isAllowed;
module.exports.checkSession = checkSession;
module.exports.checkSuperAdmin = checkSuperAdmin;
module.exports.checkSuperAdminOrCommunityManagers = checkSuperAdminOrCommunityManagers;