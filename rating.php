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

	//display total dead links
	//$dead = 0;

	foreach($allObjs as $key=>$curObj) {
		$totalRating += individualPageRating($curObj);
		//$dead += countDeadLinks()
	}

	return $totalRating/$totalCount;
}

function individualPageRating($curObj) {
	$rating = 5.0;

	$plugin = json_decode($curObj->plugin_analysis);
	$mobile = json_decode($curObj->mobile_analysis);

	//@Meta Tags---If there are no meta tags, the rating is reduced by 0.5 stars.
	if(!$curObj->meta_tags) $rating -= 0.5;

	//@Plugin Analysis---If any of these are present, the rating is reduced by 1.5 stars.
	if(assertAny($plugin, true)) $rating -= 1.5;

	//@Mobile Analysis---If there are no mobile toolkits/mobile websites present, the rating is reduced by 1.5 stars.
	if(assertAll($mobile, false)) $rating -= 1.5; 

	//@Dead links---If there are any dead links, the score will be decreased by 0.1 stars per link, up to a max of 1.
	$dead = countDeadLinks(json_decode($curObj->dead_links));
	$rating -= min(1, $dead*0.1);

	return $rating;
}

function countDeadLinks($arr) {
	$dead = 0;
	foreach($arr as $linkObj) {
		if($linkObj->status != 200) $dead++;
	}
	return $dead;
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