var propertyid;

Template.bargainspace.onCreated(function(){
    var self = this;

    propertyid = FlowRouter.getParam("propertyid");

    self.isbudgetlocked = new ReactiveVar("");
    self.autorun(function(){
        self.subscribe('bargainmode2', propertyid, function(){
        });
        self.subscribe('rentedprops',propertyid, function(){
        });
    })
});


Template.bargainspace.helpers({
    messagefromserver: function(){
        return "No message for now"
    },
    bargainattempts:function(){
        bargainattempts = Bargain.find().fetch().reverse()   
        // console.log(bargainattempts);
        if(bargainattempts.length > 0){
            lastbargainattempt = bargainattempts[0]
            lastbargainattempt["islatest"] = true
            bargainattempts[0] = lastbargainattempt;
        }    
        return bargainattempts;
    },
    isBudgetLocked:function(){
        return Template.instance().isbudgetlocked.get();
    }
})


Template.bargainspace.events({
    'click .finalbudget':function(ev, tmpl){
        ev.preventDefault();
        var minbudget = tmpl.$(".minbudget").val();
        var maxbudget = tmpl.$(".maxbudget").val();
        Meteor.call('checkBudgetOverlap',minbudget, maxbudget, propertyid
        , function(err, res){
            if(res)
                tmpl.isbudgetlocked.set("disabled");
        });
        return true; 
    }
})

Template.quoteprice.events({
    'click .bargain':function(ev,tmpl){
        ev.preventDefault();
        var bidprice = tmpl.$(".bargainprice").val();
        var minbudget = $(".minbudget").val();
        var maxbudget = $(".maxbudget").val();
        var budget = {min:minbudget, max:maxbudget};
        Meteor.call("makebid", propertyid,bidprice,budget);
        return false;
    }
})
