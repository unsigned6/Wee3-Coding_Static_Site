$(function () {
	$("#navbarToggle").blur(function (event) {
		var screeWidth = window.innerWidth;
		if (screeWidth < 768) {
			$("#collapsable-nav").collapse('hide');
		}
	});
});

(function (global) {
  var dc = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl =
  "https://davids-restaurant.herokuapp.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  // function for inserting innerHTML
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified bu 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  var switchMenuToActive = function () {
    // remove 'active' from button
    var classes = document.querySelector("#navHomeButton").className;
    
    classes = classes.replace(new RegExp("active", "g"), "");
    
    document.querySelector("#navHomeButton").className = classes;

    console.log(document.querySelector("#navMenuButton").className);

    classes = document.querySelector("#navMenuButton").className;

    if (classes.indexOf("active") == -1) {
      classes += " active";
      console.log(classes);
      document.querySelector("#navMenuButton").className = classes;
    }
  };

  // On page load (befor images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml, 
      function (responseText) {
        document.querySelector("#main-content")
          .innerHTML = responseText;
      }, 
      false);
  });

  // Load menu categories view
  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowCategoriesHTML);
  };

  // Load menu items view
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort,
      buildAndShowMenuItemsHTML);
  };  

  // Builds htmls for the categories page based on data from the server
  function buildAndShowCategoriesHTML(categories) {
    // Load title snippet of categories page
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // Retrieve single category snippet
        $ajaxUtils.sendGetRequest(
            categoryHtml,
            function (categoryHtml) {
              switchMenuToActive();

              var categoryViewHtml = 
                buildCategoriesViewHTML(categories,
                                            categoriesTitleHtml,
                                            categoryHtml);
                insertHtml("#main-content", categoryViewHtml);
            },
            false);
      },
      false);
  };

  function buildCategoriesViewHTML(categories,
                                    categoriesTitleHtml,
                                    categoryHtml) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";
    // Loop over categories
    for (var i = 0; i < categories.length; i++) {
      // insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html = 
        insertProperty(html, "name", name);
      html = 
        insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }

  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    // load title menu items page
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        // retrieve single menu item snippet
        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          function (menuItemHtml) {
            switchMenuToActive();

            var menuItemsViewHtml = 
              buildMenuItemsViewHTML(categoryMenuItems,
                                     menuItemsTitleHtml,
                                     menuItemHtml);
              insertHtml("#main-content", menuItemsViewHtml);
          },
          false);
      },
      false);
  }

  function buildMenuItemsViewHTML(categoryMenuItems,
                                  menuItemsTitleHtml,
                                  menuItemHtml) {
    menuItemsTitleHtml = 
      insertProperty(menuItemsTitleHtml,
                     "name",
                     categoryMenuItems.category.name);
    menuItemsTitleHtml = 
      insertProperty(menuItemsTitleHtml,
                     "special_instructions",
                     categoryMenuItems.category.special_instructions);

    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";

    var menuItems = categoryMenuItems.menu_items;
    var catShortName = categoryMenuItems.category.short_name;
    // loop over menu items
    for (var i = 0; i < menuItems.length; i++) {
      var html = menuItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertItemPrice(html, "price_small", menuItems[i].price_small);
      html = insertItemPortionNme(html, "small_portion_name", menuItems[i].small_portion_name);
      html = insertItemPrice(html, "price_large", menuItems[i].price_large);
      html = insertItemPortionNme(html, "large_portion_name", menuItems[i].large_portion_name);
      html = insertProperty(html, "name", menuItems[i].name);
      html = insertProperty(html, "description", menuItems[i].description);

      if (i % 2 != 0) {
        html +=
          "<div class='clearfix visible-lg-block visible-md-block'></div>";
      }
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }

  function insertItemPrice(html,
                           pricePropName,
                           priceValue) {
    // If not specified, replace with empry string
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    }

    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }

  function insertItemPortionNme(html,
                                portionPropName,
                                portionValue) {
    if (!portionValue) {
    return insertProperty(html, portionPropName, "");
    }

    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }

  global.$dc = dc;
})(window);