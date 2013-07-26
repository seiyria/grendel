
var require = patchRequire(require);

var casper = require("casper").create({
    clientScripts: ["../js/jquery-1.10.2.min.js"],
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    }
});

var checked = [];
var currentLink = 0;
var fs = require('fs');
var upTo = 100;
var url;
var baseUrl;
var links = [];
var utils = require('utils');
var f = utils.format;
 
function absPath(url, base) {
    return new URI(url).resolve(new URI(base)).toString();
}
 
// Clean links
function cleanLinks(urls, base) {
    return utils.unique(urls).filter(function(url) {
        return url.indexOf(baseUrl) === 0 || !new RegExp('^(http)').test(url);
    }).map(function(url) {
        return absPath(url, base);
    }).filter(function(url) {
        return checked.indexOf(url) === -1;
    });
}
 
// Opens the page, perform tests and fetch next links
function crawl(link) {
    this.start().then(function() {
        this.open(link);
        checked.push(link);
    });
    this.then(function() {
        if (this.currentHTTPStatus === 404) {
            this.warn(link + ' is missing (HTTP 404)');
        } else if (this.currentHTTPStatus === 500) {
            this.warn(link + ' is broken (HTTP 500)');
        } else {
            this.echo(link + f(' is okay (HTTP %s)', this.currentHTTPStatus));
        }
    });
    this.then(function() {
        var newLinks = searchLinks.call(this);
        links = links.concat(newLinks).filter(function(url) {
            return checked.indexOf(url) === -1;
        });
    });
}
 
// Fetch all <a> elements from the page and return
// the ones which contains a href starting with 'http://'
function searchLinks() {
    return cleanLinks(this.evaluate(function _fetchInternalLinks() {
        
        return jQuery("a[href]:not(a[href*='forum'])")
                .filter(function() {
                    return jQuery(this).attr('href').indexOf('#') === -1;
                }).map(function(i, e) {
                    return jQuery(this).attr('href');
                });
    }), this.getCurrentUrl());
}
 
// As long as it has a next link, and is under the maximum limit, will keep running
function check(callback) {
    if (links[currentLink] && currentLink < upTo) {
        crawl.call(this, links[currentLink]);
        currentLink++;
        this.run(function() {
            check.call(this, callback);
        });
    } else {
        callback(checked);
    }
}
 
function process(callback) {
    casper.start().then(function() {
        this.log("Starting URL grabbing process", "info");
    }).run(function() {
        check.call(this, callback);
    });
}

exports.allUrls = function(argUrl, callback) {

    url = baseUrl = argUrl;
    links = [url];

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