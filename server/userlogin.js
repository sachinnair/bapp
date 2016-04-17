
Accounts.onLogin(function(){
  if (Meteor.userId()) {
    username = Meteor.user({},{"emails.address":true});
  } else {
    return "Anonymous";
  }
})


Accounts.onCreateUser(function(options, user) {
    // create neo4j user node
    // create scores entry in redis
    // insert into elasticsearch user details
    return user;
});
