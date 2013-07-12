
/*
Global Functions
*/

function $$(id) { 
	return $("#"+id); 
}

/*
Global Data
*/

var CompanyData = function() {
	return {
		address: null,
		phone_number: null,
		intl_phone_number: null,
		name: null,
		rating: null,
		types: null,
		website: null
	};
};