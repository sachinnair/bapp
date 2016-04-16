// accountServer = new AccountsServer(Meteor.server);

Meteor.publish("rentedprops", function(propertyid){
    if(propertyid){
        console.log("Using propertyid")
        return RentedProps.find({_id:new Meteor.Collection.ObjectID(propertyid)});
    }else{
        console.log("without propertyid")
        return RentedProps.find()
    }
});


Meteor.publish("bargain", function(){
    var varargs;
    varargs = arguments;
    propertyid = (ref = arguments[0], ref !== undefined ? ref: {$ne:null});
    host = (ref = arguments[1], ref !== undefined ? ref: {$ne:null});
    guest = (ref = arguments[2], ref !== undefined ? ref : {$ne:null});
    greaterthandate = (ref = arguments[3], ref !== undefined ? new Date(ref) : new Date('1900-01-01'));
    // console.log(Bargain.find({propertyid:propertyid,host:host,guest:guest,createdAt:{$gte:greaterthandate}}).fetch());
    return Bargain.find({propertyid:propertyid,host:host,guest:guest,createdAt:{$gte:greaterthandate},modeofpayment:{$exists:false}});
})

Accounts.onLogin(function(){
  if (Meteor.userId()) {
    console.log("Successful login");
    username = Meteor.user({},{"emails.address":true});
  } else {
    return "Anonymous";
  }
})


Accounts.onCreateUser(function(options, user) {
    console.log(user);
    return user;
});
