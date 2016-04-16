
Meteor.publish("listmyprop",function(){
    
    hostemail = Meteor.users.findOne({_id:this.userId}).emails[0].address;
    return RentedProps.find({"owner.email":hostemail});
})
