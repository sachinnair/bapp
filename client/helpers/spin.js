// var bidroundno = new ReactiveDict;
/* Try and understand how to obtain data associated with template/view similar to @model.get() */


var updateBargain = function(data){
    var propertyid = FlowRouter.getParam("propertyid");
    var oid = new Meteor.Collection.ObjectID(propertyid);
    var oRentedProp = RentedProps.findOne(oid);
    // var datepastmonth = moment().subtract(1,'months');
    var datepastmonth = new Date('2016-02-20')// moment().subtract(1,'months');
    selector = {
        propertyid: propertyid
        , host:oRentedProp.owner.email
        , guest:Meteor.user().emails[0].address
        , createdAt:{$gte: datepastmonth}
    }
    Meteor.call("updatebargain", selector, {$set:data});
}

var recordBargain = function(bidno){
    var propertyid = FlowRouter.getParam("propertyid");
    var oid = new Meteor.Collection.ObjectID(propertyid);
    var oRentedProp = RentedProps.findOne(oid);
    var bidroundno = bidno || 0;
    // var bidroundno = bidroundno.get("roundno") || 0;
    // bidroundno.set("roundno", ++bidroundno);
    data = {  
        propertyid:propertyid 
        , bidroundno:bidroundno 
        , askingprice:luckyprice
        , bidprice:null /* host has already specified a range within which he would settle for deal */
        , guest:Meteor.user().emails[0].address
        , host:oRentedProp.owner.email
        , guestofferstatus: 'declined'/* <accept, pullout, declined > */
        , hostofferstatus: null /*always accepted as it falls under host's price range */
        , createdAt: new Date()
    }
    Meteor.call("recordbargain", data);
}

var spinwheel = function(minPrice, maxPrice){
  return Math.round(minPrice + Math.random() * (maxPrice - minPrice), 2)
};

var luckyprice = 0;

Template.spinview.onCreated(function(){
    var self = this;
    self.autorun(function(){
        var propertyid = FlowRouter.getParam("propertyid");
        self.subscribe("rentedprops", propertyid, function(){
            var oid = new Meteor.Collection.ObjectID(propertyid);
            var oRentedProp = RentedProps.findOne(oid);
            // var datepastmonth = moment().subtract(1,'months');
            var datepastmonth = moment().subtract(1,'months').format('YYYY-MM-DD');
            self.subscribe("bargain", propertyid, oRentedProp.owner.email, Meteor.user().emails[0].address, datepastmonth);// Just return total number of entries in bargain (bargainhistory)
        })

        
    });
});


Template.spinview.helpers({
  luckyprice:function(){
    // Insert roll info into bargain collection
    // Method.call();
    var propertyid = FlowRouter.getParam("propertyid");
    var oid = new Meteor.Collection.ObjectID(propertyid);
    var oRentedProp = RentedProps.findOne(oid);
    // bidroundno.get('bidroundno')
    bidno = Bargain.find().fetch().length
    if(bidno == 0){
        luckyprice = (oRentedProp.price.min + oRentedProp.price.max)/2;
    }else if(bidno < 5){ // should give bidroundno
        luckyprice = spinwheel(oRentedProp.price.min, oRentedProp.price.max);
    }
    return luckyprice;
    //price = Session.get("selectedprop").price;
    //return spinwheel(price.min, price.max);
  },
});

var selector;

Template.spinhistory.onCreated(function(){
    var self = this;
    self.autorun(function(){
        var propertyid = FlowRouter.getParam("propertyid");
        self.subscribe("rentedprops", propertyid, function(){
            var oid = new Meteor.Collection.ObjectID(propertyid);
            var oRentedProp = RentedProps.findOne(oid);
            var datepastmonth = moment().subtract(1,'months').format('YYYY-MM-DD');
            self.subscribe("bargain", propertyid, oRentedProp.owner.email, Meteor.user().emails[0].address, datepastmonth);// Just return total number of entries in bargain (bargainhistory)
        });
    });
});

Template.spinhistory.helpers({
  bargainhistory:function(){
      return Bargain.find().fetch().reverse();
  }
})

Template.spinview.events({
    'click .accept':function(ev){
        // would only update already existing document in collection
        ev.preventDefault();
        data = {
            offerstatus: "accepted"
        }
        updateBargain(data);
    },
    'click .pullout':function(ev){
        // would only update already existing document in collection
        ev.preventDefault();
        data = {
            offerstatus: "pulledout"
        }
        updateBargain(data);
    },
    'click .rollluck':function(ev, tmpl){
        // would always create new entry into bargains collection
        ev.preventDefault();
        //data = {
        //    offerstatus: "declined"
        //}
        //updateBargain(data);
        // default is always declined
        //
        bargainroundno = Bargain.find().fetch().length
        if(bargainroundno < 5){
            recordBargain(bargainroundno);
        }
        
        // Blaze.render(tmpl.view, document.body);
    }
});

