var should = require('chai').should(),
expect = require('chai').expect,
supertest = require('supertest'),
api = supertest('http://localhost:3000');

describe('User', function() {

  var location1;
  var location2;
  var location3;
  var locations = [location1, location2, location3];

  before(function(done){

    api.post('/locations')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      addressStreet: "111 Main St",
      addressCity: "Portland",
      addressState: "OR",
      addressZip: "97209",
      userId: 1
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      location1 = res.body;
    });


    api.post('/locations')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      addressStreet: "222 Main St",
      addressCity: "Portland",
      addressState: "OR",
      addressZip: "97209",
      userId: 2
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      location2 = res.body;
    });

    api.post('/locations')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      addressStreet: "333 Main St",
      addressCity: "Portland",
      addressState: "OR",
      addressZip: "97209",
      userId: 3
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      location3 = res.body;
      done();
    });
  });

  it('should return a 200 response', function(done) {
    api.get('/users/1')
    .set('Accept', 'application/json')
    .expect(200,done);
  });

  it('should be an object with keys and values', function(done) {
    api.get('/users/1')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
      expect(res.body).to.have.property("name");
      expect(res.body.name).to.not.equal(null);
      expect(res.body).to.have.property("email");
      expect(res.body.email).to.not.equal(null);
      expect(res.body).to.have.property("phoneNumber");
      expect(res.body.phoneNumber).to.not.equal(null);
      expect(res.body).to.have.property("role");
      expect(res.body.role).to.not.equal(null);
      done();
    });
  });

  it('should have a 10 digit phone number', function(done) {
    api.get('/users/1')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
      expect(res.body.phoneNumber.length).to.equal(10);
      done();
    });
  });

  it('should have the role of admin', function(done) {
    api.get('/users/1')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
      expect(res.body.role).to.equal("admin");
      done();
    });
  });

  it('should be updated with a new name', function(done) {
    api.put('/users/1')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      name: "Kevin",
      email: "kevin@example.com",
      phoneNumber: "9998887777",
      role: "editor"
    })
    .expect(200)
    .end(function(err, res) {
      expect(res.body.name).to.equal("Kevin");
      expect(res.body.email).to.equal("kevin@example.com");
      expect(res.body.phoneNumber).to.equal("9998887777");
      expect(res.body.role).to.equal("editor");
      done();
    });
  });

  it('should access their own locations', function(done) {
    api.get('/users/1/location')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      userId: 1
    })
    .expect(200)
    .end(function(err, res) {
      expect(res.body.userId).to.equal(1);
      expect(res.body.addressCity).to.equal("Portland");
      done();
    });
  });


  it('should not be able to access other users locations', function(done) {
    api.get('/users/2/location')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      userId: 1
    })
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      expect(res.error.text).to.equal("Unauthorized");
      done();
    });
  });

});
