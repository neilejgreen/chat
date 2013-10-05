
var roster = function(){
	var members = [];

	var addMember = function(nickname){
		members.push(nickname);
	};

	var removeMember = function(nickname){
		var location = members.indexOf(nickname);
		
		if(location >= 0){
			members.splice(location, 1);
		}
	};

	return {
		addMember:addMember,
		removeMember:removeMember,
		getMembers : function(){return members}
	};
};

module.exports = roster;