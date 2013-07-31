
var require = patchRequire(require);

var casper;

var checked = [];
var currentLink = 0;
var fs = require('fs');
var upTo = 1000;
var url;
var baseUrl;
var links = [];
var utils = require('utils');
var f = utils.format;
 

function uniquify(array) {
    var retArr = [];
    for(var x=0; x<array.length; x++) {

        var found = false;

        for(var y=0; y<retArr.length; y++) {
            if(retArr[y].url == array[x].url) found = true;
        }

        if(!found) 
            retArr.push(array[x]);
    }

    return retArr;
}

function absPath(url, base) {
    return new URI(url).resolve(new URI(base)).toString();
}
 
// Opens the page, perform tests and fetch next links
function crawl(urlData) {

    var link = urlData.url;

    this.start().then(function startCrawl() {
        this.open(link);
    });

    this.then(function evalStatus() {
        if (this.currentHTTPStatus === 404) {
            this.log(link + ' is missing (HTTP 404)', "warning");
        } else if (this.currentHTTPStatus === 500) {
            this.log(link + ' is broken (HTTP 500)', "warning");
        } else if(this.currentHTTPStatus == null) {
            this.log(link + ' is probably not present (HTTP null)', "warning");
        } else {
            this.log(link + f(' is okay (HTTP %s)', this.currentHTTPStatus), "warning");
        }

        var newUrlData = {
            url: urlData.url,
            source: urlData.source,
            status: this.currentHTTPStatus
        };

        checked.push(newUrlData);
    });

    this.then(function cleanList() {
        var newLinks = searchLinks.call(this, link);
        links = uniquify(links.concat(newLinks));
    });
}
 
// Fetch all <a> elements from the page and return
// the ones which contains a href starting with 'http://'
function searchLinks(rootUrl) {
    var arr = this.evaluate(function _fetchInternalLinks() {
        return jQuery("a[href]:not(a[href*='forum'])")
                .filter(function filterFetchInternal() {
                    return jQuery(this).attr('href').indexOf('#') === -1;
                }).map(function mapFetchInternal(i, e) {
                    return jQuery(this).attr('href');
                });

    });
    return cleanLinks(arr, rootUrl, this.getCurrentUrl());
}
 
// Clean links
function cleanLinks(urls, referrer, base) {
    return utils.unique(urls).filter(function(url) {
        return url.indexOf(baseUrl) === 0 || !new RegExp('^(http)').test(url);
    }).map(function(url) {
        return {url: absPath(url, base), source: referrer };
    }).filter(function(url) {
        return checked.indexOf(url) === -1;
    });
}
 
// As long as it has a next link, and is under the maximum limit, will keep running
function check(callback) {
    if (links[currentLink] && currentLink < upTo) {
        crawl.call(this, links[currentLink]);
        currentLink++;
        this.run(function runCheck() {
            check.call(this, callback);
        });
    } else {
        callback(checked);
    }
}
 
function process(callback) {
    casper.start().then(function urlGrab() {
        this.log("Starting URL grabbing process", "info");
    }).run(function() {
        check.call(this, callback);
    });
}

exports.allUrls = function(argUrl, jqpath, logfile, callback) {

    url = baseUrl = argUrl;
    links = [{url: url, source: url}];

    casper = require("casper").create({
        clientScripts: [jqpath],
        pageSettings: {
            loadImages: false,
            loadPlugins: false
        }
    });

    casper.on("log", function(entry) {
        fs.write(logfile, entry.message+"\r\n", 'a');
        console.log(entry.message);
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

    if (!url) {
        casper.warn('No url passed, aborting.').exit();
    }

    casper.start('https://js-uri.googlecode.com/svn/trunk/lib/URI.js', function() {
        var scriptCode = this.getPageContent() + '; return URI;';
        window.URI = new Function(scriptCode)();
        if (typeof window.URI !== "function") {
            this.warn('Could not setup URI.js').exit();
        }
    }).run(function() {
        process.call(this, callback);
    });
}