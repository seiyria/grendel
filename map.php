<!DOCTYPE html>
<html>
    <head>
        <?php include('head.php'); ?>
        <title>Tekalyze: Map</title>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA8CuF_kzIzVfBBhpsbH43HjTl9uQz5VuE&sensor=true&libraries=places"></script>
        <script src="js/map.init.js"></script>
        <script src="js/map.js"></script>
    </head>
    <body>
        <?php include('nav.php'); ?>
        <div class="container" id="main">
            <div class="row">
                <div class="span7" id="map-container">
                    <div id="map-canvas"></div>
                </div>
                <div class="span3" id="nearby-container">
                    <h1>Nearby:</h1>
                    <ul id="nearby">
                    </ul>
                </div>
            </div>
            <?php include('footer.php'); ?>
        </div>
    </body>
</html>