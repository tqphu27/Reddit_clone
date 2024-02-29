var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require("../src/index");
var should = chai.should();
chai.use(chaiHttp);


describe('Blobs', function() {
  let token;
  let user_id;

  it('should add a /login POST', function(done) {
    chai.request(server)
      .post('/v1/auth/login')
      .send({ username: "tranphu27", password: "phu123@" })
      .end(function(err, res){
        res.should.have.status(200);
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.have.property("accessToken");
        token = res.body.accessToken;
        user_id = res.body._id
        done();
      });
  });

  it('should list ALL news GET', function(done) {
    chai.request(server)
      .get('/v1/news')
      .set('token', `Bearer ${token}`)
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });

  it('should list ALL post GET', function(done) {
    chai.request(server)
      .get(`/v1/post/user/${user_id}`)
      .set('token', `Bearer ${token}`)
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });

  it('should list ALL post GET', function(done) {
    chai.request(server)
      .get(`/v1/post/user/123`)
      .set('token', `Bearer ${token}`)
      .end(function(err, res){
        res.should.have.status(200);
        chai.expect(res.body).to.have.property("data");
        chai.expect(res.body.data).to.be.an('array').that.has.lengthOf(0);
        done();
      });
  });

  it('should update a SINGLE blob on /blob/<id> PUT');
  it('should delete a SINGLE blob on /blob/<id> DELETE');
});