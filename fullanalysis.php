<?php 
include('dbobject.php'); 
?>

<!DOCTYPE html>
<html>
    <head>
        <?php include('head.php'); ?>
        <?php
            if(!isset($_GET["id"])) {
                die("There's no business to analyze.");
            }

            include_once('rating.php');

            $business = new Business();
            $business->load($_GET["id"]);

            $overall_rating = round(calculateRating($business), 2);
        ?>
        <title>Tekalyze: <?=$business->name?></title>
        <link href="css/jquery.dataTables.css" rel="stylesheet">
        <link href="css/dataTables.bootstrap.css" rel="stylesheet">
        <script src="js/jquery.dataTables.min.js"></script>
        <script src="js/dataTables.bootstrap.js"></script>
        <script src="js/jquery.raty.min.js"></script>
        <script src="js/fullanalysis.js"></script>
    </head>
    <body>
        <?php include('nav.php'); ?>
        <div class="container" id="main">
            <div class="row">
                <h1 class="pagination-centered">Full Analysis for <?=$business->name?></h1>
                <h3 class="pagination-centered">Overall rating: <span class="rating" data-score="<?=$overall_rating?>"><span style='display: none;'><?=$overall_rating?></span></span> <small>(<?=$overall_rating?>)</small></h3>
            </div>
            <div class="row">
                <div class="span10">
                    <table id="analysis" class="table table-striped" style="table-layout: fixed; width: 100%">
                        <thead>
                            <tr>
                                <th>Page</th>
                                <th>Plugins</th>
                                <th>Meta Tags</th>
                                <th>Dead Links</th>
                                <th>Mobile Info</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                                $infoarray = new BusinessInfo();
                                $array = $infoarray->getAll("businessinfo_id=$business->id");
                                foreach($array as $busObj) {
                                    $rating = round(individualPageRating($busObj), 2);
                                    ?>
                                    <tr>
                                        <td><a target="_blank" href="http://<?=$busObj->page?>"><?=$busObj->page?></a></td>
                                        <td><?=$busObj->plugin_analysis?></td>
                                        <td><?=$busObj->meta_tags?></td>
                                        <td><?=countDeadLinks(json_decode($busObj->dead_links))?></td>
                                        <td><?=$busObj->mobile_analysis?></td>
                                        <td>
                                            <div class="rating" data-score="<?=$rating?>">
                                                <span style='display: none;'><?=$rating?></span>
                                            </div>
                                            <div class="pagination-centered">
                                                <small>(<?=$rating?>)</small>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php
                                }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <?php include('footer.php'); ?>
        </div>
        <div id="loader" style="display: none;">
            <img src="img/ajax-loader.gif" />
        </div>
    </body>
</html>