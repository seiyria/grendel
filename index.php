<?php

?>
<!DOCTYPE html>
<html>
	<head>
	    <?php include('head.php'); ?>
	    <title>Tekalyze</title><style type="text/css">
      body {
        padding-top: 20px;
        padding-bottom: 60px;
      }

      /* Custom container */
      .container {
        margin: 0 auto;
        max-width: 1000px;
      }
      .container > hr {
        margin: 60px 0;
      }

      /* Main marketing message and sign up button */
      .jumbotron {
        margin: 80px 0;
        text-align: center;
      }
      .jumbotron h1 {
        font-size: 100px;
        line-height: 1;
      }
      .jumbotron .lead {
        font-size: 24px;
        line-height: 1.25;
      }
      .jumbotron .btn {
        font-size: 21px;
        padding: 14px 24px;
      }

      /* Supporting marketing content */
      .marketing {
        margin: 60px 0;
      }
      .marketing p + h4 {
        margin-top: 28px;
      }
    </style>
	</head>
	<body>
        <?php include('nav.php'); ?>
        <div class="container">
			<div class="jumbotron">
				<h1>Tekalyze!</h1>
				<p class="lead">For web developers, by web developers. Get all of the information you need to make a convincing sales pitch and boost your income!</p>
				<a class="btn btn-large btn-success" href="#">Get started!</a>
			</div>

			<hr>

			<div class="row-fluid">
				<div class="span4">
					<h2>Search</h2>
					<p>Find nearby businesses that are in desperate need of a website redesign! All businesses you find on the map will have their website analyzed. If they don't have a website, give them a call or send them a letter!</p>
				</div>
				<div class="span4">
					<h2>Browse</h2>
					<p>Check out the huge list of businesses in the US! Sort them by our name, location, or our rating scale! Our rating scale is constantly undergoing changes as we receive feedback from our users.</p>
				</div>
				<div class="span4">
					<h2>Contact</h2>
					<p>After reviewing the website and making notes for improvement, go forth and contact the business! We can't make any guarantees, but we can wish you luck!</p>
				</div>
			</div>

			<hr>

			<div class="footer">
				<p>© TEKDice 2013</p>
			</div>
		</div>
	</body>
</html>