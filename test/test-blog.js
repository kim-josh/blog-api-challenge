const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../app');

// This allows us to make HTTP requests to the server
chai.use(chaiHttp);

describe('Blog Posts', function() {
  // Starts the server. Return promise to avoid race condition
  before(function() {
    return runServer();
  });
  // Closes the server at the end of these tests.
  after(function() {
    return closeServer();
  })

  it('should list blog posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys(expectedKeys);
        });
      });
  });

  it('should add blog posts on POST', function() {
    const newBlog = {
      title: 'Winter is Coming',
      content: 'Lorem Ipsum',
      author: 'Josh Kim',
    };
    const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newBlog));
    return chai.request(app)
      .post('/blog-posts')
      .send(newBlog)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys(expectedKeys);
        res.body.title.should.equal(newBlog.title);
        res.body.content.should.equal(newBlog.content);
        res.body.author.should.equal(newBlog.author);
      });
  });

  it('should error if POST missing expected value', function() {
    const badRequestData = {};
    return chai.request(app)
      .post('/blog-posts')
      .send(badRequestData)
      .catch(function(res) {
        res.should.have.status(400);
      });
  });

  it('should update blog posts on PUT', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        const updatedBlog = Object.assign(res.body[0], {
          title: 'Winter is Here',
          content: 'You know nothing, Jon Snow'
        });
        return chai.request(app)
          .put(`/blog-posts/${res.body[0].id}`)
          .send(updatedBlog)
          .then(function(res) {
            res.should.have.status(204);
        });
      });
  });

  it('should delete blog posts on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});
