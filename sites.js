function start(AEM) {
  endSpurt = false;
  if (AEM) {
    URLStem = "https://preview-internet.zeiss.com";
    listModules("https://preview-internet.zeiss.com/content/zeiss-aem-app/example/international/website/en/modules.html", true);
    $('#moduleSelector').on('change', function () {
      if (!endSpurt){
        understandModulePage($('#moduleSelector').val(), true, URLStem);
      } else {
        renderModule(list[$("#moduleSelector").val()], true)
      }
      
    });
  } else {
    URLStem = "https://development.frontend.webdev.zeiss.com";
    listModules("https://development.frontend.webdev.zeiss.com/components/modules", false);
    $('#moduleSelector').on('change', function () {
      understandModulePage($('#moduleSelector').val(), false, URLStem);
    });
  }
}

var endSpurt = false;
var list = [];

//Read the module list and insert all choices into our dropdown
function listModules(URL, AEM) {
  if (!AEM) {
    header = {
      "Authorization": "Basic " + btoa("" + ":" + "")
    };
  } else {
    header = {};
  }
  $.ajax
  ({
    type: "GET",
    credentials: 'same-origin',
    redirect: 'follow',
    agent: null,
    url: URL,
    headers: header,
    // For recognised module in moduleSite
    // insert entry in the dropdown with id "moduleSelector"
    // which references a link to the module
    success: function (result){
      if (AEM) {
      moduleListSite = resolveLinks(result, true)
      var tree = $("<div" + result + "</div>");
      tree = tree.find(".tile-filter-hub__collection");
      var list = $(tree).find("a.article-teaser-item__content-link");
      console.log(list);
      var dropdown = $('#moduleSelector');
      dropdown.empty();
      for (var i = 0; i < list.length; i++) {
        dropdown.append('<option id="' + String(i) + '" value="' + $(list[i]).attr("href") + '"> ' + $(list[i]).attr("data-gtm-eventvalue") + ' </option>')
      }
      } else {
      moduleListSite = resolveLinks(result, false);
      var tree = $("<div>" + result + "</div>");
      tree = tree.find(".overview-page");
      var list = $(tree).find("a.server");
      console.log(list);
      var dropdown = $('#moduleSelector');
      dropdown.empty();
      for (var i = 0; i < list.length; i++) {
        dropdown.append('<option id="' + String(i) + '" value="' + $(list[i]).attr("href") + '"> ' + $(list[i]).find("b").html() + ' </option>')
      }
      }
    }
  });
}

//Perform a request on a URL, return the HTML as a string.
function viewModule(URL) {
  if (!AEM) {
    header = {
      "Authorization": "Basic " + btoa("" + ":" + "")
    };
  } else {
    header = {};
  }
  $.ajax
  ({
    type: "GET",
    credentials: 'same-origin',
    redirect: 'follow',
    agent: null,
    url: URL,
    headers: header,
    success: function (result){
    renderModule(result);
    }
  });
}

//Take what we need from the module page (for now, just get the first standalone url)
function understandModulePage(URL, AEM, URLStem) {
  var URL = URLStem + URL
  if (!AEM) {
    header = {
      "Authorization": "Basic " + btoa("" + ":" + "")
    };
  } else {
    header = {};
  }
  $.ajax
  ({
    type: "GET",
    credentials: 'same-origin',
    redirect: 'follow',
    agent: null,
    url: URL,
    headers: header,
    success: function (result){
      if (AEM) {
        var tree = $("<div>" + result + "</div>");
        tree = tree.find(".cmp-container");
        list = $(tree).children();
        console.log(list);
        var dropdown = $('#moduleSelector');
        dropdown.empty();
        for (var i = 0; i < list.length; i++) {
          dropdown.append('<option id="' + String(i) + '" value="' + String(i) + '"> ' + $(list[i]).attr("class") + ' </option>')
        }
        endSpurt = true;
      } else {
        var tree = $("<div>" + result + "</div>");
        link = $(tree.find("a:contains('Open Partial as standalone')")[0]).attr("href");
        viewModule(URLStem + link);
      }
      
    }
  });
}

//Insert chosen Module into the viewer's screen
function renderModule(text, AEM) {
  $( "#placeholder").remove(); //Remove placeholder div
  text = resolveLinks(text.outerHTML, AEM);
  var tree = $("<div>" + text + "</div>");
  var ourDiv = tree.find(".grid__container");
  $( "body" ).append( ourDiv );
  $( "body" ).append('<div id="screenshotdiv"><button onclick="takeshot()">Take Screenshot</button></div>')
  //Choose div with class "grid_container" from moduleSite
  //And insert as child of body on our document
}

//Fix links = replace href and src with full links
function resolveLinks(text, AEM) {
  if (AEM) {
    text = text.replace('src="/', 'src=https://preview-internet.zeiss.com/');
    text = text.replace('href="/', 'src=https://preview-internet.zeiss.com/');
    return text;
  } else {
    text = text.replace('src="/', 'src="https://development.frontend.webdev.zeiss.com/');
    text = text.replace('href="/', 'href="https://development.frontend.webdev.zeiss.com/');
    text = text.replace('"/imageResize/', '"https://development.frontend.webdev.zeiss.com/imageResize/')
    return text;
  }
}
