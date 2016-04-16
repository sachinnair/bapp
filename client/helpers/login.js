Template.loginPage.helpers({
    isPropertyListing:function(){
        var routeName = FlowRouter.getRouteName();
        if(routeName == "properties")
            return false;
        else 
            return true;
    },
    isMyPropertyListing:function(){
        var routeName = FlowRouter.getRouteName();
        if(routeName == "myproperties")
            return false;
        else 
            return true;
    }
})
