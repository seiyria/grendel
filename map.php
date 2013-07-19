<!DOCTYPE html>
<html>
    <head>
        <?php include('head.php'); ?>
        <title>Grendel: Map</title>
        <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&libraries=places&key=AIzaSyA8CuF_kzIzVfBBhpsbH43HjTl9uQz5VuE"></script>
        <script src="js/map.init.js"></script>
        <script src="js/map.js"></script>
    </head>
    <body>
        <?php include('nav.php'); ?>
        <div class="container" id="main">
            <div class="row">
                <div class="span8" id="map-container">
                    <div id="map-canvas"></div>
                </div>
                <div class="span3" id="nearby-container">
                    <h1>Nearby:</h1>
                    <ul id="nearby">
                    </ul>
                </div>
            </div>
        </div>
    </body>
</html>