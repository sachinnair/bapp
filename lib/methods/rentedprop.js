Meteor.methods({
    'rentedprop.add':function(data){
        RentedProps.insert(data);
    }
})
