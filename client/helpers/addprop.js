Template.addprop.events({
    'submit form':function (ev, tmpl){
        ev.preventDefault();
        data = {
            name:  ev.target.propname.value
            ,location: ev.target.location.value
            ,price:{
                min: parseInt(ev.target.minprice.value)
                ,max: parseInt(ev.target.maxprice.value)}
            ,owner: {
                name: "test" 
                , email: Meteor.user().emails[0].address
                , contact: ""    }
            ,createdAt: new Date()
            ,displayPrice: (parseInt(ev.target.minprice.value) + parseInt(ev.target.maxprice.value))/2
        }        
        Meteor.call("rentedprop.add", data, function(){
            tmpl.$(".container form input[type!=submit]").val("");
            alert("Property added successfully");
        });
    }
})
