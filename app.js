const express = require('express');
const morgan = require('morgan');
const blogPostsRouter = require('./blog-posts');
const app = express();

// logs the HTTP layer
app.use(morgan('common'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

app.use('/blog-posts', blogPostsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is running on port${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing the server');
    server.close(err => {
      if(err) {
        reject(err);
        // To ensure that we don't also call resolve()
        return;
      }
      resolve();
    });
  });
}

// this checks to see if the module was run directly in the CL as in node xxx.js
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
