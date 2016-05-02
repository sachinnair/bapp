Meteor.publish("rentedprops", function(propertyid){
    if(propertyid){
        var propId = null;
        try{
            propId = new Meteor.Collection.ObjectID(propertyid)
        }
        catch(e){
            if(typeof propertyid === 'string'){
                propId = propertyid
            }
        }
        finally{
            return RentedProps.find({_id: propId});
        }
    }else{
        return RentedProps.find()
    }
});
