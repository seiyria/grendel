<?php

require_once('dbobject.php');

if(isset($_POST["action"]) && !empty($_POST["action"])) {
	
	header('Content Type: application/json');
	switch($_POST["action"]) {
		case "add": 	addNewBusiness($_POST["data"]); return;
		case "get": 	getBusiness($_POST["id"]); return;
		default: return;
	}
}

function addNewBusiness($data) {
	$business = json_decode($data);

	$busObj = new Business();

	if(count($busObj->find(array(
		'address' => $business->address
	))) > 0) return;

	//literally zero fucks if the variable doesn't exist
	@$busObj->name = $business->name ?: '';
	@$busObj->address = $business->address ?: '';
	@$busObj->phone = $business->phone_number ?: '';
	@$busObj->intl_phone = $business->intl_phone_number ?: '';
	@$busObj->type = implode(", ", $business->types ?: array());
	@$busObj->website = $business->website ?: '';
	$busObj->insert();
}

function getBusiness($id) {
	$busObj = new Business();
	$busObj->load($id);
	echo "
	<div class='modal hide fade'>
	    <div class='modal-header'>
	        <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>
	        <h3 id='name'>$busObj->name</h3>
	    </div>
	    <div class='modal-body'>
	        <div class='form-horizontal'>
	        	<div class='control-group'>
	        		<label class='control-label'>Address</label>
	        		<div class='controls'>$busObj->address</div>
	        	</div>
	        	<div class='control-group'>
	        		<label class='control-label'>Phone Number</label>
	        		<div class='controls'>$busObj->phone</div>
	        	</div>
	        	<div class='control-group'>
	        		<label class='control-label'>Int'l Phone Number</label>
	        		<div class='controls'>$busObj->intl_phone</div>
	        	</div>
	        	<div class='control-group'>
	        		<label class='control-label'>Types</label>
	        		<div class='controls'>$busObj->type</div>
	        	</div>
	        	<div class='control-group'>
	        		<label class='control-label'>Website</label>
	        		<div class='controls'><a href='$busObj->website'>$busObj->website</a></div>
	        	</div>
	        </div>
	    </div>
	    <div class='modal-footer'>
	        <a href='#' class='btn' data-dismiss='modal'>Close</a>
	    </div>
	</div>
	";
}

?>