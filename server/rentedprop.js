Meteor.publish("rentedprops", function(propertyid){
    if(propertyid){
        return RentedProps.find({_id:new Meteor.Collection.ObjectID(propertyid)});
    }else{
        return RentedProps.find()
    }
});
