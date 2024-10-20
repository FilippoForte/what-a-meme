// imports
import MemeDAO from './dao-memes.mjs';
import UserDao from './dao-users.mjs';
import GameDao from './dao-games.mjs';
import express, { response } from 'express';
import cors from 'cors'; // CORS middleware
import morgan from 'morgan';
import passport from 'passport';                              // authentication middleware
import { Strategy as LocalStrategy } from 'passport-local';   // authentication strategy (username and password)
import session from 'express-session';

const userDao = new UserDao();
const memesDao = new MemeDAO();
const gamesDao = new GameDao();

const app = express();
app.use(express.json()); 
app.use(express.static("Images"));
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));

app.use(session({
  secret: "Esame di App Web",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await userDao.getUserByCredentials(username, password);
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await userDao.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

/*** Users APIs ***/

// POST /api/sessions
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);

        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUserByCredentials() in LocalStratecy Verify Function
        return res.json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'User Not Authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// GET /api/session/current
// This route is used for loggin out the current user.
app.post('/api/sessions/current/games', (req, res) => {
  if(req.isAuthenticated()) {
    userDao.getUserGames(req.user.id)
    .then(games => res.json(games))
    .catch((err) => res.status(500).json(err));
  }else{
    res.status(401).json({error: "User Not Authenticated"});
  }
});


/*** Meme APIs ***/

app.post('/api/memes', (req, res) => {
  memesDao.getMemes(req.body.count)
    .then(meme => res.json(meme))
    .catch((err) => res.status(500).json(err));
});

app.post('/api/meme/checkAnswer', (req, res) => {
  memesDao.checkAnswer(req.body.memeId, req.body.captionId)
  .then(response => res.json(response))
  .catch((err) => res.status(500).json(err))
})

app.post('/api/meme/getAnswers', (req, res) => {
  memesDao.getAnswers(req.body.memeId)
  .then(response => res.json(response))
  .catch((err) => res.status(500).json(err))
})


/*** Game APIs ***/

app.post('/api/saveRounds', (req, res) => {
  gamesDao.saveRounds(req.body.roundsData, req.body.userId )
  .catch((err) => res.status(500).json(err))
});


const port = 3001;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
