const { getUser } = require("../services/auth");

function checkForAuthentication(req, res, next){
  const tokenCookies = req.cookies?.token;
  req.user = null;

  if (!tokenCookies) return next();
  
  const token = tokenCookies;
  const user = getUser(token);

  req.user = user;
  return next();
}

// assing role admin/normal
function restrictTo(roles = []){
  return function(req, res, next){
    if (!req.user) return res.redirect("/login");

    if (!roles.includes(req.user.role)) return res.end("Unauthorized");

    return next();
  };
}


// async function restrictToLoggedinUserOnly(req, res, next) {
//   const userUid = req.headers["authorization"];

//   if (!userUid) return res.redirect("/login");
//   const token = userUid.split("Bearer ")[1];
//   const user = getUser(token);

//   if (!user) return res.redirect("/login");

//   req.user = user;
//   next();
// }

// async function checkAuth(req, res, next) {
//   const userUid = req.headers["authorization"];
//   // const userUid = req.cookies?.uid;
//   const token = userUid.split("Bearer ")[1];

//   const user = getUser(token);

//   req.user = user;
//   next();
// }

module.exports = {
  checkForAuthentication,
  restrictTo,
};