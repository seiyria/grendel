<?php include('dbobject.php'); ?>

<!DOCTYPE html>
<html>
    <head>
        <?php include('head.php'); ?>
        <title>Grendelients</title>
        <link href="css/jquery.dataTables.css" rel="stylesheet">
        <link href="css/dataTables.bootstrap.css" rel="stylesheet">
        <script src="js/jquery.dataTables.min.js"></script>
        <script src="js/dataTables.bootstrap.js"></script>
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
                                <th>Business Name</th>
                                <th>Address</th>
                                <th>Phone #</th>
                                <th>Website</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                                $business = new Business();
                                $array = $business->getAll("hidden=0", "name");
                                foreach($array as $busObj) {
                                    ?>
                                    <tr>
                                        <td><?=$busObj->name?></td>
                                        <td><?=$busObj->address?></td>
                                        <td><?=$busObj->phone?></td>
                                        <td><a href="<?=$busObj->website?>"><?=$busObj->website?></a></td>
                                        <td><button class='btn btn-primary' data-toggle="modal" data-id="<?=$busObj->businessinfo_id?>">More...</button></td>
                                        <td><button class='btn btn-primary <?=$busObj->website ?: 'disabled'?>'>Analysis</button></td>
                                    </tr>
                                    <?php
                                }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>