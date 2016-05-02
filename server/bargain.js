Meteor.publish("bargain", function(){
    var varargs;
    varargs = arguments;
    var propertyid = (ref = arguments[0], ref !== undefined ? ref: {$ne:null});
    var host = (ref = arguments[1], ref !== undefined ? ref: {$ne:null});
    var guest = (ref = arguments[2], ref !== undefined ? ref : {$ne:null});
    var greaterthandate = (ref = arguments[3], ref !== undefined ? new Date(ref) : new Date('1900-01-01'));
    return Bargain.find({propertyid:propertyid,host:host,guest:guest,createdAt:{$gte:greaterthandate},modeofpayment:{$exists:false}});
})

Meteor.publish('bargainmode2', function(filter, options){
    var userid = this.userId;
    var guestemail =  Meteor.users.findOne({_id: this.userId}).emails[0].address;
    var filter = {modeofpayment:"method2", propertyid: filter, guest:guestemail, hostofferstatus:{$in:["pending","declined"]}}
    return Bargain.find(filter);
})


checkbudgetoverlap = function(propertyid, minprice, maxprice){
    calluserservice();

    if(this.connection==null){

        var oid,oRentedprop;
        
        try{
            oid = new Meteor.Collection.ObjectID(propertyid);
        }
        catch(e){
            if(typeof propertyid == 'string'){
                oid = propertyid;
            }
        }
        finally{
            oRentedprop = RentedProps.findOne(oid);
        }

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
    var oid;
    try{
        oid = new Meteor.Collection.ObjectID(propertyid);
    }
    catch(e){
        if(typeof propertyid == 'string'){
            oid = propertyid;
        }
    }
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
