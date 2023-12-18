// index.js

/*  EXPRESS */
const axios = require('axios');


const express = require('express');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.get('/', function(req, res) {
  res.render('pages/auth');
});

app.get('/success', (req, res) => {
    res.render('pages/success', {user: userProfile});
  });



const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));

/*  PASSPORT SETUP  */

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

app.get('/logout', function(req, res){
  console.log(req.user.accessToken)
  const accessToken = req.user.accessToken; // Substitua pelo campo correto do seu usuário

  axios.post(`https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`)
      .then(response => {
          // Lógica para tratar a resposta (não é necessário agir sobre ela)
          req.logout();
          res.redirect('/');
      })
      .catch(error => {
          // Lógica para tratar erros
          console.error(error);
          res.redirect('/');
      });
});

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '862939908913-717fltosd6hit928dne2p8h893eba9dr.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });