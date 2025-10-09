const chai=require("chai")
const myval2=require("chai-http")
 const val=require("../utils/common")
 const value=new val()

const val1=chai.expect
chai.use(myval2)

describe("welcme this is my first test case,",()=>{
    
it('welcome this is my test inside it block',()=>{
    const userData1={
        
            "name":"saranya",
            "job":"te",
            "id":"1"
           }

//myval.request("https://reqres.in/")
chai.request("https://reqres.in/")
.post("/api/users")
.send(userData1)
.end((res,err)=>{
    val1(res).to.be.an("object").that.includes(userData1)
    val1(res.body).to.have.property("name")
    val1(res).to.have.status(201)
    val1(err).to.be.null
    done();
})
})
it('welcome this is my test inside it block2',()=>{
    const userData1={
        
            "name":"saranya1",
            "job":"te1",
            "id":"11"
           }

//myval.request("https://reqres.in/")
chai.request("https://reqres.in/")
.put("/api/users/1")
.send(userData1)
.end((res,err)=>{
    val1(res).to.be.an("object").that.includes(userData1)
    val1(res.body).to.have.property("name")
    val1(res).to.have.status(201)
    done();
})
})
it('welcome this is my test inside it block3',()=>{


//myval.request("https://reqres.in/")
chai.request("https://reqres.in/")
.get("/api/users/11")

.end((res,err)=>{
    val1(res).to.be.an("object")
    val1(res.body).to.have.property("name")
    val1(res).to.have.status(200)
    done();
})
})
it('welcome this is my test inside it block4',()=>{


   // myval.request("https://reqres.in/")
   chai.request("https://reqres.in/")
  .delete("/api/users/11")
    
    .end((res,err)=>{
        val1(res).to.be.an("object")
        val1(res.body).to.have.property("name")
        val1(res).to.have.status(204)
        done();
    })
    })
    it('welcome this is my test inside it block5',()=>{
const pro=new Promise((resolve,reject)=>{
    setTimeout(() => {
        var name=value.calladd(3,5)
        console.log(name)
        val1(name).to.equal(8)
        value.callanother(value.callanother1)
                
                    
                   
    },1000);
})
.then((message)=>{
    console.log("promise ersolved")
})
.catch((err)=>{
    console.log("not resolved")
})
    })

        })

