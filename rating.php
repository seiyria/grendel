<?php


function calculateRating($business) {

	if(!$business->website) return 0;

	$busObj = new BusinessInfo();

	$allObjs = $busObj->find(
		array("businessinfo_id"=>
			isset($business->businessinfo_id) ? 
					$business->businessinfo_id : 
					$business->id
			)
		);

	if(count($allObjs) == 0) {
		return;
	}

	$totalRating = 0;
	$totalCount = count($allObjs);

	foreach($allObjs as $key=>$curObj) {
		$totalRating += individualPageRating($curObj);
	}

	return $totalRating/$totalCount;
}

function individualPageRating($curObj) {
	$rating = 5.0;

	$plugin = json_decode($curObj->plugin_analysis);
	$mobile = json_decode($curObj->mobile_analysis);

	//@Meta Tags---If there are no meta tags, the rating is reduced by 1 star.
	if(!$curObj->meta_tags) $rating -= 1;

	//@Plugin Analysis---If any of these are present, the rating is reduced by 1.5 stars.
	if(assertAny($plugin, true)) $rating -= 1.5;

	//@Mobile Analysis---If there are no mobile toolkits/mobile websites present, the rating is reduced by 2 stars.
	if(assertAll($mobile, false)) $rating -= 2; 

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