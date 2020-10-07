import { AuthenticationService } from '../src/services/authentication';
import { SignUp } from '../src/types/authentication';
import { Server } from '../src/server'
import request from "supertest";
const expressApp = new Server();

try {
  expressApp.Start();
} catch (e) {
  console.error(e);
}


// describe('Post Endpoints', () => {
//   it('should create a new post', async () => {
//     const res = await request(expressApp.app)
//       .get('/user');

//     console.log(res);

//     expect(res.statusCode).toEqual(200)
//     //expect(res.body).toHaveProperty('post')
//   })
// })

describe("User Sign up", () => {
  test(`Password Policy Validation`, async () => {
    const res = await request(expressApp.app)
      .post('/auth/signup')
      .send({
        "preferred_username": "noPassword@gmail.com",
        "password": "123",
        "accepted_legal_version": "1.0.1",
        "given_name": "foo",
        "family_name": "bar"
      })
    expect(res.statusCode).toEqual(406)
    expect(res.body).toHaveProperty('name')
  }, 30000);
  test(`Valid Signup`, async () => {
    const res = await request(expressApp.app)
      .post('/auth/signup')
      .send({
        "preferred_username": "test@gmail.com",
        "accepted_legal_version": "1.0.1",
        "password": "Password@1",
        "given_name": "foo",
        "family_name": "bar"
      })
    expect(res.statusCode).toEqual(409)
  }, 30000);
})



