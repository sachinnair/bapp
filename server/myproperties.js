Meteor.publish("bidagainstproperty",function(){
    hostemail = Meteor.users.findOne({_id:this.userId}).emails[0].address;
    return Bargain.find({"host":hostemail});
})


var invalidatepreviousbid = function(propertyid, guest, newaskingprice){
    updatedata = {hostofferstatus:"pending", guestofferstatus:"declined", modifiedAt:new Date()}
    if(newaskingprice != null && newaskingprice != undefined)
        updatedata["newaskingprice"] = newaskingprice;
    // TODO: multi -> single document update
    console.log(updatedata);
    Bargain.update({propertyid:propertyid, guest:guest,modeofpayment:"method2", guestofferstatus:"pending"},{$set:updatedata},{multi:true});
}


hostdeclinesoffer = function(propertyid, guest, newaskingprice){
    invalidatepreviousbid(propertyid, guest, newaskingprice);
}
