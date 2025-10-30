const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);
const cm=require("../common/function")
const cm1=cm.myFun()

const cm2=require("../common/constants")
const cm3=cm2.val
//const cm3=cm2.val1
const cm4=require("../common/add");
const myclass=require("../common/add");
const cm5=new myclass()




describe("Sample API Tests", () => {

    it("should return a 200 OK response for GET request", (done) => {
        expect(cm5.add(3,6)).to.eql(9)
        console.log(cm1.mainbaseurl)
        chai.request(cm1.mainbaseurl)
            .get(cm3.val1)
            .set("X-Powered-By","3")
            //.get(cm3)
            .end((err, res) => {
                cm5.verifyStatusCode(res,200)
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it("should return a 201 Created response for POST request", (done) => {
        const userData = {
            name:cm1.name,
            email:cm1.email 
        };

        
        setTimeout(() => {
            
            chai.request("https://reqres.in")
            .post('/api/users')
            .send(userData)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object').that.includes(userData);
                expect(res.body).to.have.property("name")
                done();
            }); 
        }, 5000);     
    }).timeout(9000)

    it("its peststore testcases",()=>{
        chai.request("https://petstore.swagger.io/v2/pet")
        .get("/2")
        .end((err,res)=>{
            cm5.verifyStatusCode(res,200)
            expect(res.body).to.have.header( "content-type", "application/json")
            expect(res.body).to.have.property("name").to.eql("Kevin")
            expect(res.body).to.have.property("name").to.eql("string")
            expect(res.body).to.have.property("name").to.be.a("string")
            expect(res.body).to.have.property("photoUrls").to.be.an("array")
            expect(res.body).to.have.property( "category").to.be.an("object")
            expect(res.body).to.have.property( "category").to.be.empty
            expect(res.body).to.have.property("name").to.be.empty
        })
const value={
    name:"ammu",
    email:"ammu@gmail.com"
}


            chai.request("https://petstore.swagger.io/v2/pet")
            .post("/3")
            .send(value)
            .end((err,res)=>{
                cm5.verifyStatusCode(res,201)
                expect(res.body).to.have.property("myvalue")

            })

        })

    })


    // Add more test cases as needed
