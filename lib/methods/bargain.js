Meteor.methods({
    recordbargain: function(data){
        // collection.insert(data);
        console.log("bargain value entered")
        Bargain.insert(data);
        return true;
    },
    updatebargain:function(selector, data){
        console.log("bargain value updated")
        Bargain.update({});
        return false;
    },
    checkBudgetOverlap:function(minprice, maxprice, propertyid){
        if(Meteor.isServer){
            // Meteor._sleepForMs(5000);
            somevalue = checkbudgetoverlap(propertyid, minprice, maxprice);
            return somevalue;
        }
        else{
            return true;
        }
    },
    makebid: function(propertyid, bidprice, budget){
        data = {propertyid:propertyid, bidprice:bidprice, budget:budget}

        if(Meteor.isServer){
            data = makebid(propertyid, bidprice, budget);
        }
        
        return Bargain.insert(data);
    },
    hostdeclines: function(propertyid, guest, newaskingprice){
        if(Meteor.isServer){
            hostdeclinesoffer(propertyid, guest, newaskingprice);
        }
        return true;
    }
})
