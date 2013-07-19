
/*
Global Functions
*/

function $$(id) { 
	return $("#"+id); 
}

function isModalActive() {
	return $(".modal-backdrop").length > 0;
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