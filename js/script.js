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
    console.log("check!");
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowCategoriesHTML);
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
  };

  global.$dc = dc;
})(window);