<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
        <a class="brand" href="#">Grendel</a>
            <?php build_nav(); ?>
        <?php

        ?>
    </div>
</div>

<?php
function is_current($name) { 
    return basename($_SERVER['SCRIPT_NAME']) == $name;
}

function build_nav() {
    ?>
    <ul class="nav">
    <?php

    $current = '';

    $pages = array("Home" => "index.php",
                   "Search" => "map.php",
                   "Businesses" => "clients.php");

    foreach($pages as $name=>$loc) {
        if(!$current) $current = is_current($loc) ? $loc : '';
        ?>
        <li<?=is_current($loc) ? " class='active'" : ''?>><a href="<?=$loc?>"><?=$name?></a></li>

        <?php
    }
    ?>
    </ul>
    <?php
    
    if(file_exists(basename($current, ".php")."_nav.php"))
        include(basename($current, ".php")."_nav.php");
}
?>