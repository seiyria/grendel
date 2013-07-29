<?php

?>
<!DOCTYPE html>
<html>
	<head>
	    <?php include('head.php'); ?>
	    <title>Tekalyze: About</title>
	    <script>
	    	$(function() {
	    		$("#navbar-affix").affix();
	    	});
	    </script>
	</head>
	<body>
        <?php include('nav.php'); ?>
        <div class="container" id="main">
        	<div class="row">
        		<div class="span3">
        			<div class="sidebar">
	        			<ul class="nav nav-list affix" id="navbar-affix">
	        				<li>
	        					<a href="#top"><i class="icon-chevron-right"></i> About</a>
	        				</li>
	        				<li>
	        					<a href="#scale"><i class="icon-chevron-right"></i> Website Rating Scale</a>
	        				</li>
	        				<li>
	        					<a href="#faq"><i class="icon-chevron-right"></i> FAQ</a>
	        				</li>
	        			</ul>
	        		</div>
        		</div>
        		<div class="span6 offset1" id="secondary">
					<section id="about">
        				<h1>About</h1>
        				<p>
        					Tekalyze is a system that helps web developers find prospective clients by analyzing websites of businesses nearby to you! 
        				</p>
        				<p>
        					Tekalyze was started by a person (me!) who wanted to make finding freelance clients easier. This idea went through discussion for a while, when it eventually got a solid form (that's what you see now!). It's under constant development, as time allows, so things will likely be changing rapidly.
        				</p>
        			</section>
					<br>
					<section id="scale">
        				<h1>Rating Scale</h1>
        				<p>
        					The website rating scale is a very simple algorithm. Over time, it will get more complex, taking into account more criteria.
        				</p>
	        			<table class="table table-striped pagination-centered" id="ratings">
	        				<thead>
	        					<tr>
	        						<th>Content Type</th>
	        						<th>Description</th>
	        					</tr>
	        				</thead>
	        				<tbody>
					        	<?php
					        		$file = explode("\n", file_get_contents("rating.php"));
					        		foreach($file as $row=>$data) {
					        			$line = trim($data);
					        			if(strpos($line, "//@") === false) continue;

					        			$lineData = explode("---", substr($line, 3));
					        			?>
					        			<tr>
					        				<td><?=$lineData[0]?></td>
					        				<td><?=$lineData[1]?></td>
					        			</tr>
					        			<?php
					        		}
					        	?>
					       	</tbody>
					    </table>
					</section>
					<br>
					<section id="faq">
						<h1>Frequently Asked Questions</h1>
						<p>There haven't been any questions yet! <a href="mailto: kyle@tekdice.com?subject=Tekalyze FAQ">Send me some!</a></p>
					</section>
        		</div>
        	</div>
            <?php include('footer.php'); ?>
		</div>
	</body>
</html>