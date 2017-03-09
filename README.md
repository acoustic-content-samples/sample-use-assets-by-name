# sample-use-assets-by-name
Sample showing how IBM Watson Content Hub (WCH) assets can be used in a page or application by name

### Overview
Any assets such as image files that are uploaded into WCH are automatically published and available for retrieval via the Akamai CDN provided with Content Hub. The assets are retrieved with a URL that includes the asset "path" value.

This sample includes helper code that lets you reference Content Hub assets using the asset name instead of the asset path. The asset name can be edited in the Content Hub user interface, while the asset path is assigned automatically and is not editable in Content Hub. The sample uses client JS code to dynamically update the page HTML with the Akamai CDN URL for each asset reference. This allows you to upload a new version of an asset file in Content Hub and have your page automatically reference the new asset. 

### Handling of duplicate asset names and filtering by tags
In Content Hub it is possible to have multiple assets with the same name. This sample code will use the most recent asset in this case. Since the asset name is editable you can also assign unique names if you want. With this sample you can also use tags to filter the assets that are used for an HTML page. See the description of the data-wch-search-tags attribute below for information. For example, you could have multiple assets named "banner.jpg" and use tagging to indicate which one is used for a specific page.


### Referencing assets in HTML pages

There are three HTML tag attributes available for dynamically generating URLs to WCH assets.

For a src attribute, use the data-wch-asset-src attribute to specify the asset name:
```
<img data-wch-asset-src="village.jpg" src=""></img>
```

For an href attribute, use data-wch-asset-href:
```
<a data-wch-asset-href="one-slide-wch.pdf" height="200">One Slide on Watson Content Hub</a>
```

To set the background-image value in a style attribute, use data-wch-asset-background-image:
```
<div class="digital-hero" data-wch-asset-background-image="cognitive-digital-top-header.jpg">
```

The code uses the Content Hub search API to find assets and then generates a mapping from name to URL. The search can be scoped to one or more WCH tags by using the data-wch-search-tags attribute somewhere on the page, like this:
```
<body data-wch-search-tags="promo-offers,common">
```

### Running the sample

#### 1. Download the files

Clone or download the repository folder into any folder on your workstation. (Use [Clone or Download](https://help.github.com/articles/cloning-a-repository/) button on the Github repository home page).

#### 2. Update the baseTenantUrl and serverBaseUrl

This sample includes baseTenantUrl and serverBaseUrl values set in the assets-by-name.js file in the public directory. Update those values for your tenant. To obtain the baseTenantUrl, in the IBM Watson Content Hub user interface, click the "i" information icon at the top left of the screen next to where it says IBM Watson Content Hub. The pop-up window shows your host and tenant ID. Use this information to update the value of baseTenantUrl. For example it might look something like this:

const baseTenantUrl = "https://my12.digitalexperience.ibm.com/api/12345678-9abc-def0-1234-56789abcdef0";

The serverBaseUrl will include just the first part of that, similar to this:

const serverBaseUrl = "https://my12.digitalexperience.ibm.com";

#### 3. Edit the asset names in index.html if necessary

The sample HTML includes references to three .jpg image assets, illustrating the three types of HTML URL supported by the sample. If you have uploaded the [sample-article-content](https://github.com/ibm-wch/sample-article-content) content, you will already have the three named assets. If not, you can edit the three data-wch-* tags in index.html to use asset names that you have in your tenant. 

#### 4. Load index.html in a browser
You can do this right from the file system in Firefox, Chrome, or Safari browsers. Alternatively you can make the files available on any web server and open the html files in a browser using your web server URL.

