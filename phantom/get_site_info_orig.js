
var port = '8585';

//includes web server modules
var server = require('webserver').create();
var fs = require('fs');
var logfile = 'casper.log';

var service = server.listen(port, function(request, response) {

	var postData = JSON.parse(request.postRaw);

	var url = postData.website;
	var dataUrl = postData.ajaxUrl;
	var id = postData.businessId;

	var results = [];

	var crawler = require('./get_all_urls');

	var callback = function(urls) {

		var casper = require('casper').create({
			verbose: true,
			logLevel: "error",
			clientScripts: ["../js/jquery-1.10.2.min.js", "./URI.js"]
		});

		casper.on("remote.message", function(msg, t) {
			this.log("[REMOTE] "+msg, "error");
		});

		casper.on("error", function(msg, trace) {
			this.log(msg, "error");
		});

		casper.on('step.error', function(err) {
    		this.log("Step has failed: " + err, "error");
		});

		casper.on("log", function(entry) {
			console.log(entry.message);
			fs.write(logfile, entry.message+"\r\n", 'a');
		});

		casper.log("Casper initialized.", "info");
		
		casper.log("Parsing pages...", "info");
		casper.log(JSON.stringify(urls), "error");

		casper.start().each(urls, function parseThisUrl(self, url) {

			self.thenOpen(url, function parseUrlInner() {
				
				self.log("Parsing "+url, "info");
				var res = parsePage(this); 
				res.id = id;
				console.log(JSON.stringify(res));
				results.push(res);

				self.log("Page parsed; sending data.", "info");
				self.log(JSON.stringify(res), "error");
				//sendData(self, dataUrl, res);

				self.log("Data sent.", "info");
			});
		});
		/*
		casper.then(function() {
			debug("List: "+JSON.stringify(results));
		});*/

		casper.run(function() {
			this.log("Done", "info");
			response.statusCode = 200;
			response.write(JSON.stringify(results));
			response.close();
		});
	};

	crawler.allUrls(url, callback);

/*
	casper.run(function() {
	});
*/

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
				deadLinks: JSON.stringify([])
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

console.log('Server running on port ' + port);

var casper = require('casper').create();
casper.start().thenOpen("http://localhost:8585", {
	method: "POST",
	data: JSON.stringify({
		website: "http://tekalyze.com/",
		dataUrl: "",
		businessId: ""
	})
}).run();
