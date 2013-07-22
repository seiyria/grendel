<?php
function calculateRating($business) {

	if(!$business->website) return 0;

	$busObj = new BusinessInfo();
	$allObjs = $busObj->find(array("businessinfo_id"=>$business->businessinfo_id));

	if(count($allObjs) == 0) {
		return;
	}

	$rating = 5;

	$curObj = $allObjs[count($allObjs)-1];

	$plugin = json_decode($curObj->plugin_analysis);
	$mobile = json_decode($curObj->mobile_analysis);

	if(!$curObj->meta_tags) $rating -= 1;
	if(assertAny($plugin, true)) $rating -= 1.5;
	if(assertAll($mobile, false)) $rating -= 2;  
	//dead links


	return $rating;
}

function assertAll($obj, $test) {
	foreach($obj as $var=>$val) {
		if($val != $test) return false;
	}
	return true;
}

function assertAny($obj, $test) {
	foreach($obj as $var=>$val) {
		if($val == $test) return true;
	}
	return false;
}
?>