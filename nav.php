<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
    <a class="brand" href="#">Grendel</a>
    <ul class="nav">
        <?php build_nav(); ?>
    </ul>
    <ul class="nav pull-right">
        <li id="status"><a href="#">OK</a></li>
        <li><a href="#">Location:</a></li>
        <li id="lat"><a href="#">latitude</a></li>
        <li id="lon"><a href="#">longitude</a></li>
    </ul>
    </div>
</div>

<?php
function is_current($name) { 
    return basename($_SERVER['SCRIPT_NAME']) == $name;
}

function build_nav() {
    $pages = array("Home" => "index.php",
                   "Search" => "map.php",
                   "Clients" => "clients.php");

    foreach($pages as $name=>$loc) {
        ?>

        <li<?=is_current($loc) ? " class='active'" : ''?>><a href="<?=$loc?>"><?=$name?></a></li>

        <?php
    }
}
?>