
var port = '8585';

//includes web server modules
var server = require('webserver').create();
var fs = require('fs');
var logfile = 'casper.log';

var service = server.listen(port, function(request, response) {

	fs.write(logfile, "Request received.\r\n", 'a');

	var postData = JSON.parse(request.postRaw);

	//TODO full scraping: https://gist.github.com/n1k0/4509789

	var casper = require('casper').create({
		verbose: true
	});

	casper.options.clientScripts = ["../js/jquery-1.10.2.min.js", "./URI.js"];

	fs.write(logfile, "Casper initialized.\r\n", 'a');

	casper.on("page.error", function(msg, t) {
		fs.write(logfile, "[ERROR] "+msg+"\r\n", 'a');
	})

	var url = postData.website;
	var dataUrl = postData.ajaxUrl;
	var id = postData.businessId;

	var results = [];

	fs.write(logfile, "Parsing page...\r\n", 'a');

	//basic page parsing
	casper.start(url, 
		function() { 
			var res = parsePage(this); 
			res.id = id;
			results.push(res);
		}
	);

	fs.write(logfile, "Page parsed; sending data.\r\n", 'a');

	casper.then(function() {
		sendData(casper, dataUrl, results[0]);
	});

	fs.write(logfile, "Data sent.\r\n", 'a');

	//debug display of site info

	casper.then(function() {
		//this.echo("List: "+JSON.stringify(results));
	});


	casper.run(function() {
		response.statusCode = 200;
		response.write(JSON.stringify(results));
		response.close();
	});

	fs.write(logfile, "Done.\r\n", 'a');

	function sendData(casper, dataUrl, data) {

		casper.open(dataUrl, {
			method: "post",
			data: {
				action: "analysis",
				businessId: data.id,
				page: data.uri.authority+data.uri.path,
				pluginStr: JSON.stringify(data.plugins),
				mobileStr: JSON.stringify(data.isResponsive),
				metaTags: data.metaTags,
				hasContact: data.hasContact,
				deadLinks: 0
			}
		});
	}

	function parsePage(casper) {

		var result = casper.evaluate(function(url) {

			var uri = new URI(url);

			var ret = {};

			ret.uri = {};
			ret.uri.domain = uri.domain();
			ret.uri.protocol = uri.protocol();
			ret.uri.path = uri.path();
			ret.uri.authority = uri.authority();

			var flashSelector = "embed[type='application/x-shockwave-flash'], object[type='application/x-shockwave-flash']";
			var javaSelector = "embed[type='application/x-java-applet'], object[type='application/x-java-applet'], applet";
			var silverLightSelector = "embed[type='application/x-silverlight-2'], object[type='application/x-silverlight-2']";

			var metaTags = "meta[name='keywords']";

			var skeletonSelector = "link[href*='skeleton']";
			var bootstrapSelector = "script[src*='bootstrap'],link[href*='bootstrap']";
			var foundationSelector = "script[src*='foundation'],link[href*='foundation']";
			var jqueryMobileSelector = "script[src*='jquery.mobile'],link[href*='jquery.mobile']";

			var selFun = function(selector) {
				return $(selector).length != 0;
			};

			ret.plugins = {};

	    	ret.plugins.hasJava = selFun(javaSelector);
	    	ret.plugins.hasFlash = selFun(flashSelector);
	    	ret.plugins.hasSilverlight = selFun(silverLightSelector);

	    	ret.metaTags = $(metaTags).text();

	    	ret.hasContact = $("body").text().toLowerCase().indexOf('contact') !== -1;

		    ret.isResponsive = {
		    	usesSkeleton: selFun(skeletonSelector),
		    	usesBootstrap: selFun(bootstrapSelector),
		    	usesFoundation: selFun(foundationSelector),
		    	usesJqueryMobile: selFun(jqueryMobileSelector)
		    };

	    	return ret;
		});

		
		result.whoisLink = "http://whois.net/whois/"+result.uri.domain;
		casper.open(result.uri.protocol+"://m."+result.uri.domain);
		casper.then(function() {
			result.isResponsive.hasMDotPage = !(this.currentHTTPStatus == 404 || this.currentHTTPStatus == null)
		});

		return result;
	}

});
fs.write(logfile, 'Server running on port '+port+'\r\n', 'a');
console.log('Server running on port ' + port);
