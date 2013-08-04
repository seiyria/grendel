<!DOCTYPE html>
<html>
	<head>
	    <?php include('head.php'); ?>
	    <title>Tekalyze: Subscribe</title>
        <script src="js/verimail.jquery.min.js"></script>
	    <script>
	    	$(function() {
                $("input#email").verimail({
                    messageElement: "span#validation"
                });

                $("input#email").keydown(function() {
                    $("#validation").removeClass('hidden');
                    var status = $(this).getVerimailStatus();
                    if(status == "success") {
                        $("#validation").removeClass('label-important').addClass('label-success');
                    } else {
                        $("#validation").removeClass('label-success').addClass('label-important');
                    }
                })

	    		$(".subscribe").click(function() {
        			ga('send', 'event', 'Subscription Features', 'click', 'Subscribe');
	    		});

                $("#submit").click(function() {
                    if($("#email").getVerimailStatus() != "success") return;
                    ga('send', 'event', 'Subscription Dialog', 'click', 'Submit email');
                    $.ajax({
                        url: "ajax.php",
                        method: "POST",
                        data: {
                            action: "addUser",
                            email: $("#email").val()
                        }
                    });
                    $("#email").val('');
                    $("#validation").text("Thanks for your support!");
                });

                $("#nosubmit").click(function(){ 
                    ga('send', 'event', 'Subscription Dialog', 'click', 'Cancel email submit');

                });
	    	});
	    </script>
	</head>
	<body>
        <?php include('nav.php'); ?>
        <div class="container" id="main">
        	<div class="row">
        		<div class="span10">
        			<h1 class="pagination-centered">Subscription Information</h1>
        			<br>
        			<p class="lead">
        				For a limited time, subscribe to Tekalyze at $14.99/month and get access to all of these fantastic features for life! I started this project as a side-project, but it really blew up, and keeping it on the server isn't cheap. I'm asking what I think is the bare minimum to keep this boat afloat.
        			</p>
                    <br>
        			<br>
        			<div class="pagination-centered">
                        <button class="subscribe btn btn-large btn-info" data-toggle="modal" href="#subModal">Subscribe for $14.99/month</button>
                    </div>
        			<br>
        			<p class="pagination-centered">
        				Below is a comprehensive comparison of the free version and the subscription version.
        			</p>
        			<table class="table table-striped pagination-centered">
        				<thead>
        					<tr>
        						<th></th>
        						<th>Free Trial</th>
        						<th>Subscription</th>
        					</tr>
        				</thead>
        				<tbody>
        					<tr>
        						<td>Browse company catalog</td>
        						<td><i class="icon-check"></i></td>
        						<td><i class="icon-check"></i></td>
        					</tr>
        					<tr>
        						<td>Get basic company information</td>
        						<td><i class="icon-check"></i></td>
        						<td><i class="icon-check"></i></td>
        					</tr>
        					<tr>
        						<td>Get basic company analysis</td>
        						<td><i class="icon-check"></i></td>
        						<td><i class="icon-check"></i></td>
        					</tr>
        					<tr>
        						<td>Star companies for later</td>
        						<td><i class="icon-remove"></i></td>
        						<td><i class="icon-check"></i></td>
        					</tr>
        					<tr>
        						<td>Access full analytics for a website (<a href="sampleanalysis.php" target="_blank">see a sample</a>)</td>
        						<td><i class="icon-remove"></i></td>
        						<td><i class="icon-check"></i></td>
        					</tr>
        					<tr>
        						<td>Export company site analytics to various formats</td>
        						<td><i class="icon-remove"></i></td>
        						<td><i class="icon-check"></i></td>
        					</tr>
        					<tr>
        						<td>Advanced search for companies near you in the catalog</td>
        						<td><i class="icon-remove"></i></td>
        						<td><i class="icon-check"></i></td>
        					</tr>
        					<tr>
        						<td>Fund future development of Tekalyze</td>
        						<td><i class="icon-remove"></i></td>
        						<td><i class="icon-check"></i></td>
        					</tr>
				       	</tbody>
				    </table>
        		</div>
        	</div>
            <?php include('footer.php'); ?>
		</div>
        <div id="subModal" class="modal hide fade">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3>Subscribe</h3>
            </div>
            <div class="modal-body">
                <p>Since I'm still trying to gauge interest, you currently can't pay for a subscription. However, letting me know by putting your email in the form will help me see the general level of interest, and of course I will contact everyone when the service goes live! Thanks for your support, and feel free to keep checking the app out!</p>
                <input type="text" id="email" class="email input-block-level" required="required" placeholder="Your email address" />
            </div>
            <div class="modal-footer">
                <span class="pull-left label hidden" id="validation"></span>
                <a href="#" id="submit" class="btn btn-primary" id="submit">Submit</a>
                <a href="#" id="nosubmit" class="btn btn-danger" data-dismiss="modal">Close</a>
            </div>
        </div>
	</body>
</html>