/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

"use strict";

// Base URL for APIs - replace {Host} and {Tenant ID} using the values available 
// from the "i" information icon at the top left of the WCH screen 
const baseTenantUrl = "https://{Host}/api/{Tenant ID}";

// Content Hub blueid username and password - replace these or add code to get these from inputs
const username = "[username]";
const password = "[password]";

const basicAuthUrl = baseTenantUrl + "/login/v1/basicauth";
const searchService = baseTenantUrl + "/authoring/v1/search";

// Generic search function
function search(searchParams, cb) {
    // console.log('searchParams is: ', searchParams);
    var requestOptions = {
        xhrFields: {
            withCredentials: true
        },
        url: basicAuthUrl,
        headers: {
            "Authorization": "Basic " + btoa(username + ":" + password)
        }
    };
    $.ajax(requestOptions).done(function(data, textStatus, request) {
        var searchURL = searchService + "?" + searchParams;
        var reqOptions = {
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            url: searchURL,
        };
        $.ajax(reqOptions).done(function(json) {
            cb(json);
        });
    }).fail(function(request, textStatus, err) {
        alert("Content Hub Login returned an error: " + err);
    });
}

// Builds a map of asset name to URL, then processes all the tags that use the data-wch- attributes and set URLs
function processReferences(documents) {
    // console.log('documents: ', JSON.stringify(documents, null, 4));

    // create map - asset name to document.links.media.href
    var assetMap = documents.reduce(function(total, current) {
        var doc = current['document'];
        if (doc.links && doc.links.media) {
            // Generate direct Akamai URL for asset:
            var akamaiUrl = baseTenantUrl.replace('/api','') + doc.path
            if (total[current.name] !== undefined) {
                console.log('Skipping duplicate asset with name', current.name);
            }
            else 
            {
             total[current.name] = akamaiUrl;
                  
            }
        }
        return total;
    }, {});
    // console.log('assetMap ', JSON.stringify(assetMap, null, 4));
    // Iterate through all elements with attribute data-wch-asset-src
    $("[data-wch-asset-src]").each(function(index, item) {
        var assetName = $(this).attr("data-wch-asset-src");
        var assetUrl = assetMap[assetName];
        console.log('src assetName ', assetName, ' source ', assetUrl);
        // set src attribute to the source from search results
        if (assetUrl) {
            $(this).attr("src", assetMap[assetName]);
        }
    });
    // Now do all elements with attribute data-wch-asset-href
    $("[data-wch-asset-href]").each(function(index, item) {
        var assetName = $(this).attr("data-wch-asset-href");
        var assetUrl = assetMap[assetName];
        console.log('href assetName ', assetName, ' source ', assetUrl);
        // set src attribute to the source from search results
        if (assetUrl) {
            $(this).attr("href", assetUrl);
        }
    });

    // Now process any data-wch-asset-background-image
    $("[data-wch-asset-background-image]").each(function(index, item) {
        var assetName = $(this).attr("data-wch-asset-background-image");
        // add suffix for current screen size (-mobile for smartphone; -tablet for tablet)
        // @todo use configuration for the names and for the breakpoints instead of hard-coding
        var preferredAssetName = assetName;
        var ext = assetName.substr(assetName.lastIndexOf('.'));
        var base = assetName.substr(0, assetName.lastIndexOf('.'));
        if ($(window).width() < 575) {
            preferredAssetName = base + "-mobile" + ext;
        } else if ($(window).width() < 1000) {
            preferredAssetName = base + "-tablet" + ext;
        }
        var assetUrl = assetMap[preferredAssetName];
        if (!assetUrl) {
            // console.log('using fallback for ', preferredAssetName);
            assetUrl = assetMap[assetName];
        }
        console.log('background-image assetName ', assetName, ' source ', assetUrl);
        // set src attribute to the source from search results
        if (assetUrl) {
            $(this).css('background-image', 'url(' + assetUrl + ')');
        }
    });
}

function updatePageAssetReferences() {
    // search for assets, returning complete document element as JSON
    var searchParams = "q=*:*&fl=name,document:[json]&fq=classification:asset&sort=lastModified%20desc&rows=500";
    var tags = [];
    // See if there are any data-wch-search-tags attributes that set tags to scope the search, e.g., to a page
    $("[data-wch-search-tags]").each(function(index, item) {
        var tagsStr = $(this).attr("data-wch-search-tags");
        var tagsParsed = tagsStr.split(',');
        tags = tags.concat(tagsParsed);
    });
    console.log('tags: ', JSON.stringify(tags, null, 4));
    if (tags.length > 0) {
        searchParams = searchParams + "&fq=tags:(" + tags.join(' OR ') + ')';
    }
    // add tags to search: &fq=tags:(beach OR summer)
    console.log('searchParams ', searchParams);
    // @todo - use local storage to cache the search results
    search(searchParams, function(results) {
        if (results.documents) {
            processReferences(results.documents);
        }
    });
}

document.addEventListener("DOMContentLoaded", (function() {
    updatePageAssetReferences();
}));