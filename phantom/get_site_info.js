
var fs = require('fs');

var crawlWebsite = function(url, dataUrl, id, jqpath, uripath, urlModule, exitFunc) {

	var results = [];

	var crawler = require(urlModule);

	var callback = function(urls) {

		var casper = require('casper').create({
			verbose: true,
			logLevel: "error",
			clientScripts: [jqpath, uripath]
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
			//fs.write(logfile, entry.message+"\r\n", 'a');
		});

		casper.log("Casper initialized.", "info");
		
		casper.log("Parsing pages...", "info");

		casper.log("Initializing parse.", "info");
		analysisStatus(dataUrl, id, 1);

		var getUrlsFor = function(url) {
			return copyData.filter(function(urlData) {
				return url == urlData.source;
			});
		}

		var copyData = urls;

		urls = urls.filter(function(linkData) {
            return linkData.status == 200;
        });

		casper.start().each(urls, function parseThisUrl(self, urlData) {

			var url = urlData.url;

			self.thenOpen(url, function parseUrlInner() {
				
				self.log("Parsing "+url, "info");
				var res = parsePage(this); 
				res.id = id;
				res.urls = getUrlsFor(url);
				results.push(res);
			});
		});

		casper.then(function sendData() {
			casper.log("Sending data.", "info");
			sendAllData(casper, dataUrl, results);
			casper.log("Cleaning up session.", "info");
			analysisStatus(dataUrl, id, 0);
		});

		casper.run(function sendResponse() {
			casper.log("Done", "info");
			exitFunc();
		});
	};

	function uniquify(array) {
		var retArr = [];
		for(var x=0; x<array.length; x++) {

			var found = false;

			for(var y=0; y<retArr.length; y++) {
				if(retArr[y].page == array[x].page) found = true;
			}

			if(!found) 
				retArr.push(array[x]);
		}

		return retArr;
	}

	function sendAllData(casper, dataUrl, data) {

		var send = [];

		for(var x in data) {
			send.push(formatDataObject(data[x]));
		}

		casper.log("Cleaning up data.", "info");
		send = uniquify(send);

		casper.open(dataUrl, {
			method: "post",
			data: {
				action: "mass",
				items: JSON.stringify(send)
			}
		});
	}

	function formatDataObject(data) {
		return {
			businessId: data.id,
			page: data.uri.authority+data.uri.path,
			pluginStr: data.plugins,
			mobileStr: data.isResponsive,
			metaTags: data.metaTags,
			hasContact: data.hasContact,
			deadLinks: data.urls
		};
	}

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
				deadLinks: JSON.stringify(data.urls)
			}
		});
	}

	function analysisStatus(dataUrl, id, status) {
		require('casper').create().start().thenOpen(dataUrl, {
			method: "post",
			data: {
				action: "toggle",
				id: id,
				status: status
			}
		}).run(function(){});
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

	crawler.allUrls(url, jqpath, logfile, callback);

};

var casper = require('casper').create();
var dataUrl = casper.cli.get("data-url") || "http://localhost/grendel/ajax.php";
var id = casper.cli.get("id") || "1";
var url = casper.cli.get("url");
var jQueryPath = casper.cli.get("jquery-path") || "../js/jquery-1.10.2.min.js";
var URIPath = casper.cli.get("uri-path") || "./URI.js"; 
var logfile = casper.cli.get("log-path") || "casper.local.log";
var urlModule = casper.cli.get("url-module-path") || "./get_all_urls";

crawlWebsite(url, dataUrl, id, jQueryPath, URIPath, urlModule, function() {
	casper.exit();
});