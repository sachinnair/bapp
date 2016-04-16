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
        // var arryRentdprops = RentedProps.find({},{transform:function(entry){
        //     // entry.collapsed = Template.instance().iscollapsed.get();
        //     // entry.collapsed = new ReactiveVar(false); 
        //     console.log(entry.collapsed, "It should toggle");
        //     entry.collapsed = entry.collapsed || false;
        //     console.log(entry);
        //     return entry;
        
        var arryRentdprops = RentedProps.find({},{transform:function(x){
            var propid = x._id._str;
            x.bargainhistory = Bargain.find({propertyid:propid, modeofpayment:"method2", guestofferstatus:"pending"}).fetch();
            return x;
        }});
        return arryRentdprops;
    },
    propid:function(){
        return Template.instance().get();
    },
    attemptedbargain: function(propid){
        var retdata = Bargain.find({propertyid:propid, modeofpayment:"method2", guestofferstatus:"pending"}).fetch();
        return retdata;
    }
    //collapsed:function(){
    //    return Template.instance().iscollapsed.get()
    //}
})

Template.myproperty.events({
    "click .viewbids":function(ev, tmpl){
        console.log("renderd")
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
        debugger;
        newaskingprice = tmpl.$(".newaskprice").val()
        Meteor.call("hostdeclines", propid, guestemail, newaskingprice,function(){

        })
    }
})

