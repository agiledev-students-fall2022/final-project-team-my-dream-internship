import { server, close } from "../server";
let chai = require("chai");
let chaiHttp = require("chai-http");

chai.use(chaiHttp);
// This is a template how to write a test on Express routes
// describe("GET request to /get_test route", () => {
//   it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
//     chai
//       .request(server)
//       .get("/get_test")
//       .end((err, res) => {
//         chai.expect(res.status).to.equal(200);
//         chai.expect(typeof res.body).to.equal("object");
//         chai.expect(res.ok).to.equal(true);
//         close();
//         done(); // resolve the Promise that these tests create so mocha can move on
//       });
//   });
// });

describe("GET request to /get_internships route", () => {
  it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
    chai
      .request(server)
      .get("/get_internships")
      .query({ maxLen: 3 })
      .end((err, res) => {
        chai.expect(res.status).to.equal(200);
        chai.expect(typeof res.body).to.equal("object");
        chai.expect(res.body.length).to.be.greaterThanOrEqual(1);
        chai.expect(res.ok).to.equal(true);
        close();
        done(); // resolve the Promise that these tests create so mocha can move on
      });
  });
});
