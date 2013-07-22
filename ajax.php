<?php
error_reporting(E_ALL); 
ini_set( 'display_errors','1');

require_once('dbobject.php');

if(isset($_POST["action"]) && !empty($_POST["action"])) {
	
	header('Content Type: application/json');
	switch($_POST["action"]) {
		case "add": 	addNewBusiness($_POST["data"]); return;
		case "get": 	getBusiness($_POST["id"]); return;
		case "analyze": analyzeBusiness($_POST["id"], $_POST["site"], true); return;
		case "analysis":addBusinessAnalysis($_POST["businessId"],$_POST["page"],$_POST["pluginStr"],$_POST["metaTags"],$_POST["mobileStr"],$_POST["hasContact"],$_POST["deadLinks"]); return;
		case "flag":	flagBusiness($_POST["id"], $_POST["name"]);
		default: return;
	}
}

function flagBusiness($id, $name) {
	sendErrorEmail("#F1A6", "Tekalyze Reporter", "$name [$id] was reported. Please look into it.");

	$busObj = new Business();
	$busObj->load($id);
	$busObj->reported = 1;
	$busObj->update();
}

function addNewBusiness($data) {
	$business = json_decode($data);

	$busObj = new Business();

	if(count($busObj->find(array(
		'address' => $business->address
	))) > 0) return;

	$busObj->name = isset($business->name) ? $business->name : '';
	$busObj->address = isset($business->address) ? $business->address : '';
	$busObj->phone = isset($business->phone_number) ? $business->phone_number : '';
	$busObj->intl_phone = isset($business->intl_phone_number) ? $business->intl_phone_number : '';
	$busObj->type = implode(", ", isset($business->types) ? $business->types : array());
	$busObj->website = isset($business->website) ? $business->website : '';
	$busObj->insert();

	if($busObj->website) {
		analyzeBusiness($busObj->id, $busObj->website);
	}
}

function analyzeBusiness($businessId, $website, $display = false) {

	$busInfoObj = new BusinessInfo();
	$hasBusinessInfo = count($busInfoObj->find(array("businessinfo_id"=>$businessId))) > 0;

	if(!$hasBusinessInfo) {
		$ajaxUrl = "http://".$_SERVER["SERVER_NAME"].$_SERVER["PHP_SELF"];

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "localhost:8585");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POST, true);

		$data = array(
		    'ajaxUrl' => $ajaxUrl,
		    'businessId' => $businessId,
		    'website' => $website
		);

		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		$output = curl_exec($ch);
		$info = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		if($info == 404 || !$info) {
			showAnalysisError("#1AF");
			return;
		}
	}

	if($display) {
		showBusinessAnalysis($businessId);
	}
}

function addBusinessAnalysis($businessId, $page, $pluginStr, $metaTags, $mobileStr, $hasContact, $deadLinks) {

	$busInfoObj = new BusinessInfo();
	$hasBusinessInfo = count($busInfoObj->find(array("businessinfo_id"=>$businessId))) > 0;

	if($hasBusinessInfo) return;
	$busObj = new BusinessInfo();
	$busObj->businessinfo_id = $businessId;
	$busObj->page = $page;
	$busObj->plugin_analysis = $pluginStr;
	$busObj->meta_tags = $metaTags;
	$busObj->mobile_analysis = $mobileStr;
	$busObj->has_contact_info_on_site = $hasContact ? 1 : 0;
	$busObj->dead_links = $deadLinks;
	$busObj->insert();
}

function showAnalysisError($code) {
	sendErrorEmail($code);
	echo "
	<div class='modal hide fade'>
	    <div class='modal-header'>
	        <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>
	        <h3 id='name'>Analysis Server Error (Code $code)</h3>
	    </div>
	    <div class='modal-body'>
	    	<p>
	    		It seems like the analysis server is currently down! The developer has been notified of this issue. Thanks for finding a problem!
	    	</p>
	    </div>
	    <div class='modal-footer'>
	        <a href='#' class='btn' data-dismiss='modal'>Close</a>
	    </div>
	</div>
	";
}

function showBusinessAnalysis($businessId) {
	$business = new Business();
	$business->load($businessId);

	$busObj = new BusinessInfo();
	$allObjs = $busObj->find(array("businessinfo_id"=>$businessId));

	if(count($allObjs) == 0) {
		showAnalysisError("#1C0");
		return;
	}

	$curObj = $allObjs[count($allObjs)-1];
	$mobileData = json_decode(isset($curObj->mobile_analysis) ? $curObj->mobile_analysis : '');
	$plugins = json_decode(isset($curObj->plugin_analysis) ? $curObj->plugin_analysis : '');
	$pluginString = buildTable($plugins);
	$mobileString = buildTable($mobileData);
	echo "
	<div class='modal hide fade'>
	    <div class='modal-header'>
	        <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>
	        <h3 id='name'>Analysis For $business->name</h3>
	    </div>
	    <div class='modal-body'>
	    	<h4 class='pagination-centered'>Frontpage Analysis</h4>
	        <div class='form-horizontal'>

	        	<div class='control-group'>
	        		<label class='control-label'>
	        			<span class='icon-bookmark' rel='tooltip' title='The verbatim content of the <meta keywords> tag.'>
	        				<span class='text'>Meta Tags</span>
	        			</span>
	        		</label>
	        		<div class='controls'>".($curObj->meta_tags ?: 'None')."</div>
	        	</div>

	        	<div class='control-group'>
	        		<label class='control-label'>
	        			<span class='icon-bookmark' rel='tooltip' title='A simple check for staple toolkits.'>
	        				<span class='text'>Responsive Analysis</span>
	        			</span></label>
	        		<div class='controls'>".$mobileString."</div>
	        	</div>

	        	<div class='control-group'>
	        		<label class='control-label'>
	        			<span class='icon-bookmark' rel='tooltip' title='A simple check for objects that can be replaced with HTML5 equivalents.'>
	        				<span class='text'>Plugin Analysis</span>
	        			</span></label>
	        		<div class='controls'>".$pluginString."</div>
	        	</div>

	        	<div class='control-group'>
	        		<label class='control-label'>
	        			<span class='icon-bookmark' rel='tooltip' title='A check for the string literal \"Contact\" on the page.'>
	        				<span class='text'>Has Contact Info</span>
	        			</span></label>
	        		<div class='controls'>".boolToStr($curObj->has_contact_info_on_site)."</div>
	        	</div>
	        </div>
	    </div>
	    <div class='modal-footer'>
	    	<div class='pull-left'>
	    		<span class='last-analysis'>".dateString($curObj->last_analysis)."</span>
	    	</div>
	        <div class='pull-right'>
		        <button class='btn btn-info icon-user info' data-id='$businessId' data-dismiss='modal' data-toggle='modal' > <span class='textReset'>Profile</span></button>
		        <button class='btn icon-remove' data-dismiss='modal'> Close</button>
	        </div>
	    </div>
	</div>
	";
}

function dateString($timeStr) {
	return "Last analysis was on ".date('F j, Y', strtotime($timeStr))." at ".date('h:i:s A', strtotime($timeStr));
}

function buildTable($obj) {
	$conversion = array(
		"usesBootstrap" => "Bootstrap",
		"usesFoundation" => "Foundation",
		"usesSkeleton" => "Skeleton",
		"usesJqueryMobile" => "jQuery Mobile",
		"hasFlash" => "Flash",
		"hasJava" => "Java Applets",
		"hasSilverlight" => "Silverlight",
		"hasMDotPage" => "Mobile Subdomain"
	);
	$str = '<table class="table table-striped table-condensed table-bordered" style="clear: none;"><tbody>';
	foreach($obj as $key=>$val) {
		if(!isset($conversion[$key])) continue;
		$str .= "<tr>" 
			 .  "<td>".$conversion[$key]."</td>" 
			 .  "<td width='30%'>".boolToStr($val)."</td>" 
			 .  "</tr>";
	}
	$str .= "</tbody></table>";
	return $str;
}

function boolToStr($bool) {
	return $bool ? "Yes" : "No";
}

function getBusiness($id) {
	$busObj = new Business();
	$busObj->load($id);
	echo "
	<div class='modal hide fade'>
	    <div class='modal-header'>
	        <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>
	        <h3 class='name'>$busObj->name</h3>
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
	        		<div class='controls'><a href='$busObj->website'><span class='trunc'>$busObj->website</span></a></div>
	        	</div>
	        </div>
	    </div>
	    <div class='modal-footer'>
	        <div class='pull-right'>
		        <button 
		        class='btn btn-warning icon-flag flag-content ".($busObj->reported ? "disabled" : "")."' 
		        data-id='$busObj->id'
		        title='".flagContentTooltip($busObj->reported)."'
		        rel='tooltip'> 
		        <span class='textReset'>Flag Content</span></button>
		        <button class='btn btn-info icon-time analyze' data-dismiss='modal' data-toggle='modal' data-id='$busObj->id' data-url='$busObj->website'> <span class='textReset'>Analysis</span></button>
		        <button class='btn icon-remove' data-dismiss='modal'> Close</button>
	        </div>
	    </div>
	</div>
	";
}

function flagContentTooltip($isFlagged) {
	return $isFlagged ? "This content has already been flagged." : "Flagging content means it will be considered for removal from the system. Report only if content is missing all useful data, please!";
}

function sendErrorEmail($code, $from = "Tekalyze", $body = "Fix this error.") {
	include("lib/class.phpmailer.php");
	$mail  = new PHPMailer();   
	$mail->IsSMTP();

	$mail->SMTPAuth   = true;
	$mail->SMTPSecure = "ssl";
	$mail->Host       = "smtp.gmail.com";
	$mail->Port       = 465;
	$mail->Username   = "notify@tekdice.com";
	$mail->Password   = "n0t1fYDA3m0N";

	$mail->From       = "notify@tekdice.com";
	$mail->FromName   = $from;
	$mail->Subject    = "Error: Code $code";
	$mail->MsgHTML($body);

	$mail->AddAddress("kyle@seiyria.com","Kyle Kemp");
	$mail->IsHTML(true);

	$mail->Send();
		//echo "Mailer Error: " . $mail->ErrorInfo;
	//else  
		//echo "Message sent!";
}

?>