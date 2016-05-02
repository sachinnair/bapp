Template.myproperty.onCreated(function(){
    var self = this;
    self.iscollapsed = new ReactiveVar(false);
    self.autorun(function(){
        self.subscribe("listmyprop", function(){
        });
        self.subscribe("bidagainstproperty", function(){
        });
    })
})


Template.myproperty.helpers({
    rentedprops:function(){
        
        var arryRentdprops = RentedProps.find({},{transform:function(x){
            var propid = x._id._str == undefined? x._id : x._id._str;
            x.bargainhistory = Bargain.find({propertyid:propid, modeofpayment:"method2", guestofferstatus:"pending"}).fetch();
            return x;
        }});
        return arryRentdprops;
    },
    propid:function(){
        return Template.instance().get();
    },
    attemptedbargain: function(propid){
        if(typeof propid != 'string'){
            propid = propid._str
        }

        var retdata = Bargain.find({propertyid:propid, modeofpayment:"method2", guestofferstatus:"pending"}).fetch();
        return retdata;
    }
})

Template.myproperty.events({
    "click .viewbids":function(ev, tmpl){
        return true;
    }
})

Template.receivedbids.onCreated(function(){
    console.log("Rendering");
})


Template.receivedbids.events({
    "click .decline":function(ev, tmpl){
        guestemail= this.guest;
        propid = this.propertyid;
        newaskingprice = tmpl.$(".newaskprice").val()
        Meteor.call("hostdeclines", propid, guestemail, newaskingprice,function(){

        })
    }
})

