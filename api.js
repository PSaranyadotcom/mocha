const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);
const myclass = require("../utils/common.js")
const instance = new myclass();

describe("Sample API Tests", () => {

    it("should return a 200 OK response for GET request", (done) => {
        chai.request("https://reqres.in")
            .get('/api/users?page=2')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });

        console.log(instance.add(1,2))
    });

    it("should return a 201 Created response for POST request", (done) => {
        const userData = {
            name: "John Doe",
            job: "Engineer"
        };

        chai.request("https://reqres.in")
            .post('/api/users')
            .send(userData)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object').that.includes(userData);
                done();
            });
    });

    // Add more test cases as needed
});
