<?php 
include('dbobject.php'); 
?>

<!DOCTYPE html>
<html>
    <head>
        <?php include('head.php'); ?>
        <title>Tekalyze: Businesses</title>
        <link href="css/jquery.dataTables.css" rel="stylesheet">
        <link href="css/dataTables.bootstrap.css" rel="stylesheet">
        <script src="js/jquery.dataTables.min.js"></script>
        <script src="js/dataTables.bootstrap.js"></script>
        <script src="js/jquery.raty.min.js"></script>
        <script src="js/jquery.truncate.min.js"></script>
        <script src="js/jquery.livequery.js"></script>
        <script src="js/jquery.blockUI.js"></script>
        <script src="js/client.js"></script>
    </head>
    <body>
        <?php include('nav.php'); ?>
        <div class="container" id="main">
            <div class="row">
                <div class="span12">
                    <table id="clients" class="table table-striped">
                        <thead>
                            <tr>
                                <th>Business</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Website</th>
                                <th>Rating</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                                include_once('rating.php');
                                $business = new Business();
                                $array = $business->getAll("hidden=0", "name");
                                foreach($array as $busObj) {
                                    $rating = calculateRating($busObj);
                                    ?>
                                    <tr>
                                        <td><?=$busObj->name?></td>
                                        <td><?=$busObj->address?></td>
                                        <td class="phone-number"><?=$busObj->phone?></td>
                                        <td><a href="<?=$busObj->website?>"><span class="trunc"><?=$busObj->website?></span></a></td>
                                        <td><div class="rating" data-score="<?=$rating?>"><span style='display: none;'><?=$rating?></span></div></td>
                                        <td><button class='btn btn-primary info icon-user' data-toggle="modal" data-id="<?=$busObj->businessinfo_id?>">
                                            <span class='textReset'>Profile</span>
                                        </button></td>
                                        <td><button 
                                            class='btn btn-primary icon-time analyze <?=$busObj->website ? '' : 'disabled'?>' 
                                            data-id="<?=$busObj->businessinfo_id?>" 
                                            data-url="<?=$busObj->website?>" 
                                            data-toggle="modal"
                                            title="<?=$busObj->website ? '' : 'No analysis is available for this business.'?>"
                                            rel="tooltip">
                                            <span class='textReset'>Analysis<span>
                                        </button></td>
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