Meteor.publish('bargainmode2', function(filter, options){
    userid = this.userId;
    guestemail =  Meteor.users.findOne({_id: this.userId}).emails[0].address;
    filter = {modeofpayment:"method2", propertyid: filter, guest:guestemail, hostofferstatus:{$in:["pending","declined"]}}
    return Bargain.find(filter);
})


checkbudgetoverlap = function(propertyid, minprice, maxprice){
    if(this.connection==null){
        var oRentedprop = RentedProps.findOne({_id:new Meteor.Collection.ObjectID(propertyid)});

        if(maxprice > oRentedprop.price.min){
            return true;
        }
        else
            return false;
    }
}

var invalidatepreviousbid = function(propertyid){
    var guest = Meteor.user().emails[0].address;

    // TODO: multi -> single document update
    Bargain.update({propertyid:propertyid, guest:guest,modeofpayment:"method2"},{$set:{hostofferstatus:"declined", closedAt:new Date()}},{multi:true});
}

var getlastbiddetails = function(propertyid, guestemail){

    var roundno = 1, latestaskingprice = null
    var latestbid = Bargain.findOne({modeofpayment:"method2",propertyid:propertyid, guest:guestemail},{sort:{createdAt:-1}});
    if(latestbid != undefined && latestbid != null){
       if(latestbid["bidno"] != undefined && latestbid["bidno"] != null)
           roundno = ++latestbid["bidno"];
       if(latestbid["newaskingprice"]!=undefined && latestbid["newaskingprice"]!=null)
           latestaskingprice = latestbid["newaskingprice"];
       else
           latestaskingprice = latestbid["askingprice"]
    }    
    return {bidno:roundno, askingprice:latestaskingprice};
}

makebid = function(propertyid, bidprice, budget){
    // Get rented prop details 
    // get lastasking price
    // get host details - through rent prop details
    var oid = new Meteor.Collection.ObjectID(propertyid);
    var guestemail = Meteor.user().emails[0].address;
    var lastbiddetails = getlastbiddetails(propertyid, guestemail);
    var propdetails = RentedProps.findOne({_id:oid}, {fields:{"price.min":1,"price.max":1, "owner.email":1, "displayprice":1}})
    if(lastbiddetails.askingprice == null){
        lastbiddetails.askingprice = propdetails.displayprice;
    }
    var hostemail = propdetails.owner.email;

    data = {
        bidno: lastbiddetails.bidno
        ,modeofpayment: "method2"
        ,propertyid: propertyid
        ,guest: guestemail
        ,guestbudget: budget
        ,bidprice: bidprice
        ,guestofferstatus:"pending"
        ,host: hostemail
        ,hostbudget: {min:propdetails.price.min,max:propdetails.price.max}
        ,askingprice:lastbiddetails.askingprice
        ,createdAt: new Date()
    }

    if(!checkbudgetoverlap(propertyid,budget.min, budget.max)){
        data["sysmanipulatedbidprice"] = budget.max;
    }

    invalidatepreviousbid(propertyid);
    return data;
}
