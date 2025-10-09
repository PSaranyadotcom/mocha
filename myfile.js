var myvak=require("../utils/file")
var chai=require("chai")
const val=new myvak()
var sinon=require("sinon")
var expect=chai.expect
describe("this is my test",()=>{
    it("welocme this is my first test case",()=>{
        expect(val.add(2,9)).to.equal(11)
    })
    it("welocme this is my 2nd test case",()=>{
        var spy=sinon.spy(val,"add")// doubt in this line
        val.callAnotherFunction(4,7)
       
        expect((spy.calledOnce)).to.be.true
        expect((spy.calledWith(4,7))).to.be.true

    })
    it("welocme this is my 3rd test case",()=>{
        var myclbk=sinon.spy()
        val.callBackFunction(myclbk)
        
        expect((myclbk.calledOnce)).to.be.true
    })
})