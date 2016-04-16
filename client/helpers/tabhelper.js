var toggletabs = function(ev, tmpl){
    $(tmpl.findAll("li.paymentmodes")).removeClass('active');
    $(ev.toElement).parent().addClass('active');
}


Template.tabbedview.events({
	"click #method1":function(ev,tmpl){
                toggletabs(ev, tmpl);
                BlazeLayout.render("SiteTemplate", {top:"loginPage", middle:"full_rentdetails", bottom:"tabbedview" , paymentmode:"spinview"});
	},
	"click #method2":function(ev,tmpl){
                toggletabs(ev, tmpl);
                BlazeLayout.render("SiteTemplate", {top:"loginPage", middle:"full_rentdetails", bottom:"tabbedview" , paymentmode:"bargainspace"});
	}
});
