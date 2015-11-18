
  /*
  Resource Library v0.0.1
  TODO: update pagination, content generation, add different display
  options (grid,list,etc.), integrate with program wrapper
  */


(function(window){
  //Library Constructor
  function Library(el,data, settings) {
    this.el = document.getElementById(el);
    this.data = data;
    this.settings = settings || {};
    this.uid = 0;
    this.pageIndex = 0;
    this.pages;
    this.pageNavigation;
    //init
    this.generateLibrary();
    this.events();
  }

  //init function
  Library.prototype.generateLibrary = function(){
    var lib = this;
    var libraryItems = this.data;

    /* create pagination navigation bar */
    lib.pageNavigation = document.createElement("ul");
    lib.pageNavigation.className = "pageNavigation";
    /* Using hardcoded class name for now, will add option
     to your own later */
    lib.el.className="lib-wrapper";

    /* Create page array and first page. Page array contains the pages of
    content listings, seperated by the listing count defined in settings.
    Pages are created with the generatePaging function */
     var page = [];
    _generatePaging();

    //Loop through all library items, creating listings for each
    for(var i = 0; i < libraryItems.length; i++) {

      /* Check the current listing count against the listings per page setting,
      and create a new page if the limit has been hit */
      if(i > 0 && i % this.settings.listingsPerPage === 0) {

        //If over listing per page post page to library container
        lib.el.appendChild(page[this.pageIndex]);

        _generatePaging();

        //Generates current listing on new page
        _createListing(libraryItems[i],page[this.pageIndex]);
      }
      else {
        // Generate current listing on page
        _createListing(libraryItems[i],page[this.pageIndex]);
      }
    }
    //Adds pages to the library container
    lib.el.appendChild(page[this.pageIndex]);
    lib.el.appendChild(lib.pageNavigation);

    //----------------------------//
    //--   'Private' functions  --//
    //----------------------------//

    function _createListing(item, page) {
      var type = item.listingType;
      var listing = document.createElement("div");
      var content = _createContent(item,lib);

      listing.id = "Lib-" + lib.uid++;
      listing.className = "lib-item";
      listing.setAttribute('data-lib-type', type);
      listing.appendChild(content);

      return page.appendChild(listing);
    }

    function _createContent(item) {
        var content = document.createElement("span");

        /* TODO: Replace innerHTML with createElement, add extra options
        for additional content types and seperate generators. */
        content.className = "article lib-content";
        // Image
        content.innerHTML += "<img class=\"lib-thumb\" src=\"" + item.thumbnail +"\" />";
        // Title
        content.innerHTML += "<span class=\"lib-title\">" + item.title + "</span>";
        // Text
        content.innerHTML += "<p>" + item.text + "</p>";
        // Button
        content.innerHTML += "<a class=\"lib-button\" href=\"" + item.src + "\"></a>";

        return content;
      }

      /*  Create pages and pagination elements
      TODO: set elipsis for inbetween pages (ie 1,2...6,7),
      reflow pages upon display change*/
      function _generatePaging() {
        //Increment page index and create new page
        lib.pageIndex++;

        /* Create li item for pagination list, will be used to change
        between listing pages. Using data-* attributes for now. */
        var paginationEl = document.createElement("li");
        paginationEl.className = "pagination-nav-li";
        paginationEl.innerHTML = lib.pageIndex;
        paginationEl.setAttribute('data-page-index', lib.pageIndex);
        //Append the current item to the pagination list
        lib.pageNavigation.appendChild(paginationEl);

        /* Create a new page */
        page[lib.pageIndex] = document.createElement("div");
        page[lib.pageIndex].className = "lib-page";
        page[lib.pageIndex].setAttribute('data-page-index', lib.pageIndex);
        //initially hide all pages but first
        if(lib.pageIndex === 1) {
          page[lib.pageIndex].className = "lib-page show";
        }
      }
  };

  Library.prototype.events = function(){
    /* TODO: add view switch event */
    var lib = this;

    lib.pageNavigation.addEventListener("click", _onNavClick);

    //----------------------------//
    //--   'Private' functions  --//
    //----------------------------//

    function _onNavClick(event) {
      var target = event.target;

      if(target.className === "pagination-nav-li") {
        var currentIndex = target.getAttribute("data-page-index");
        var pages = lib.el.getElementsByClassName("lib-page");

        for(var i = 0; i < pages.length; i++) {
          if(pages[i].getAttribute("data-page-index") === currentIndex){
            pages[i].className = "lib-page show";
          } else {
            pages[i].className = "lib-page hide";
          }
        }
      }
    }
  };

  window.Library = Library;

}(window));
