Template.mini_rentdetails.helpers({
  rentedprops: function(){
    Meteor.subscribe("rentedprops");
    return RentedProps.find().map(function(x){x.avgprice= (x.price.max + x.price.min)/2; return x;});
    // return [{name:"se view",price:{min:0,max:100},location:"berlin"}];
  }
});


Template.mini_rentdetails.events({
  "click .getquote": function(ev, tmpl){
    ev.preventDefault();
    // this returns the ref of document from mongo collection:
    var propertyid = this._id._str;
    FlowRouter.go("/properties/:propertyid", {propertyid: propertyid});
    Session.set("selectedprop", this);
    return this;
  }
});

Template.full_rentdetails.onCreated(function(){
    var self = this;
    self.autorun(function(){
        var propertyid = FlowRouter.getParam("propertyid");
        self.subscribe("rentedprops", propertyid);
    });
});

Template.full_rentdetails.helpers({
  rentedprop: function(){
    //Meteor.subsribe("rentedprops")
    var propertyid = FlowRouter.getParam("propertyid");
    var oid = new Meteor.Collection.ObjectID(propertyid);
    var oRentedProp = RentedProps.findOne(oid);
    oRentedProp.avgprice = (oRentedProp.price.max + oRentedProp.price.min)/2
    return oRentedProp;
    // return Session.get("selectedprop");
  }
});
