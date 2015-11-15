var frisby = require('frisby');
var token = null;



// SIGN UP ////////////////////////////////////////////////////////////////////////////////////////

frisby.create('Sign up test user')
  .post('http://localhost:3000/signup', {
    login: 'testlogin',
    password: 'testpassword',
    email: 'test@server.com',
    firstName: 'Restowy',
    lastName: 'Testowy'
  })
  .expectStatus(200)
.toss();

frisby.create('Sign up already existing user')
  .post('http://localhost:3000/signup', {
    login: 'testlogin',
    password: 'testpassword',
    email: 'test@server.com',
    firstName: 'Restowy',
    lastName: 'Testowy'
  })
  .expectStatus(409)
  .expectJSONTypes({
    message: String
  })
  .expectBodyContains('User already exists.WriteError({\\\"code\\\":11000')
.toss();

frisby.create('Sign up without body params')
  .post('http://localhost:3000/signup')
  .expectStatus(400)
  .expectJSON({
    message: "Request must consist of parameters: login, password, email, firstName, lastName."
  })
.toss();


  
// LOGIN //////////////////////////////////////////////////////////////////////////////////////////

frisby.create('Login without body params')
  .post('http://localhost:3000/login')
  .expectStatus(400)
  .expectJSON({
    message: "Missing login or password."
  })
.toss();

frisby.create('Login with bad login')
  .post('http://localhost:3000/login', {
    login: "testlogin_",
    password: "testpassword"
  })
  .expectStatus(404)
  .expectJSON({
    message: 'Authentication failed. Cannot find user testlogin_'
  })
.toss();

frisby.create('Login with bad password')
  .post('http://localhost:3000/login', {
    login: "testlogin",
    password: "testpassword_"
  })
  .expectStatus(403)
  .expectJSON({
    message: 'Authentication failed. Wrong password.'
  })
.toss();

frisby.create('Login with correct credentials')
  .post('http://localhost:3000/login', {
    login: "testlogin",
    password: "testpassword"
  })
  .expectStatus(200)
  .expectJSON({
    login: 'testlogin'
  })
  .expectJSONTypes({
    login: String,
    token: String
  })
  .afterJSON(function(json) {
    token = json.token;
    console.log('X-ACCESS-TOKEN: ' + token);
    
    
    
// USER /////////////////////////////////////////////////////////////////////////////////
    
    frisby.create('Get all users without a token')
      .get('http://localhost:3000/user/all')
      .expectStatus(403)
      .expectJSON({
        message: "No token provided."
      })
    .toss();

    frisby.create('Get all users with wrong token')
      .get('http://localhost:3000/user/all')
      .addHeader('x-access-token', '1234567890abcdefghijklmnopqrstuvwxyz')
      .expectStatus(403)
      .expectJSON({
        message: "Failed to authenticate token."
      })
    .toss();

    frisby.create('Get all users')
      .get('http://localhost:3000/user/all')
      .addHeader('x-access-token', token)
      .expectStatus(200)
    .toss();
    
    frisby.create('Get user with no token')
      .get('http://localhost:3000/user/testlogin')
      .expectStatus(403)
      .expectJSON({
        message: "No token provided."
      })
    .toss();

    frisby.create('Get user with wrong token')
      .get('http://localhost:3000/user/testlogin')
      .addHeader('x-access-token', '1234567890abcdefghijklmnopqrstuvwxyz')
      .expectStatus(403)
      .expectJSON({
        message: "Failed to authenticate token."
      })
    .toss();

    frisby.create('Get user')
      .get('http://localhost:3000/user/testlogin')
      .addHeader('x-access-token', token)
      .expectStatus(200)
      .expectJSON({
        user: {
          login: 'testlogin',
          password: 'testpassword',
          email: 'test@server.com',
          firstName: 'Restowy',
          lastName: 'Testowy'
        }        
      })
    .toss();
    
    frisby.create('Get non-existing user')
      .get('http://localhost:3000/user/___________')
      .addHeader('x-access-token', token)
      .expectStatus(404)
      .expectJSON({
        message: "Cannot find user with login ___________"
      })
    .toss();
    
    
    
// TRIP /////////////////////////////////////////////////////////////////////////////////
    
    frisby.create('Post new trip without token')
      .post('http://localhost:3000/trip', {
        name: 'New test trip',
        description: 'This is a test trip'
      })
      .expectStatus(403)
      .expectJSON({
        message: "No token provided."
      })
    .toss();

    frisby.create('Post new trip with wrong token')
      .post('http://localhost:3000/trip', {
        name: 'New test trip',
        description: 'This is a test trip'
      })
      .addHeader('x-access-token', '1234567890abcdefghijklmnopqrstuvwxyz')
      .expectStatus(403)
      .expectJSON({
        message: "Failed to authenticate token."
      })
    .toss();

    frisby.create('Post new trip')
      .post('http://localhost:3000/trip', {
        name: 'New test trip',
        description: 'This is a test trip'
      })
      .addHeader('x-access-token', token)
      .expectStatus(200)
      .expectJSONTypes({
        tripId: String
      })
    .toss();
    
  })
.toss();