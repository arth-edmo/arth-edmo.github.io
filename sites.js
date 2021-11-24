$(function()
{
    listModules();
    $('#moduleSelector').on('change', function () {
      alert(String($('#moduleSelector').val()));
      understandModulePage($('#moduleSelector').val());
    });

    //viewModule("https://development.frontend.webdev.zeiss.com/components/partial/modules/stage50-50");
})

var output = "";

//Perform a request on a URL, return the HTML as a string.
function viewModule(URL) {
  $.ajax
  ({
    type: "GET",
    credentials: 'same-origin',
    redirect: 'follow',
    agent: null,
    url: URL,
    headers: {
      "Authorization": "Basic " + btoa("zeiss" + ":" + "licht")
    },
    success: function (result){
    renderModule(result);
    }
  });
}

//Read the module list and insert all choices into our dropdown
/* Entries look like this:
  <td>
    <div>
      <a class="server" href="/components/FormKit/modules">FormKit/<b>modules</b></a>
    </div>
  </td>
*/
function listModules() {
  $.ajax
  ({
    type: "GET",
    credentials: 'same-origin',
    redirect: 'follow',
    agent: null,
    url: "https://development.frontend.webdev.zeiss.com/components/modules",
    headers: {
      "Authorization": "Basic " + btoa("zeiss" + ":" + "licht")
    },
    success: function (result){
      moduleListSite = fixLinks(result);
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
  });
  // For recognised module in moduleSite
  // insert entry in the dropdown with id "moduleSelector"
  // which references a link to the module
}


//Take what we need from the module page (for now, just get the first standalone url)
/* Its link looks like this:
  <a href="/components/partial/modules/accordionModule?option=0" target="_blank">
    Open Partial as standalone
  </a>
*/
function understandModulePage(URL) {
  var URL = "https://development.frontend.webdev.zeiss.com" + URL
  $.ajax
  ({
    type: "GET",
    credentials: 'same-origin',
    redirect: 'follow',
    agent: null,
    url: URL,
    headers: {
      "Authorization": "Basic " + btoa("zeiss" + ":" + "licht")
    },
    success: function (result){
      var tree = $("<div>" + result + "</div>");
      link = $(tree.find("a:contains('Open Partial as standalone')")[0]).attr("href");
      viewModule("https://development.frontend.webdev.zeiss.com" + link);
    }
  });
}

//Insert chosen Module into the viewer's screen
function renderModule(text) {
  $( "#placeholder").remove(); //Remove placeholder div
  text = fixLinks(text);
  var tree = $("<div>" + text + "</div>");
  ourDiv = tree.find(".grid__container");
  $( "body" ).append( ourDiv );
  alert("yay");
  //Choose div with class "grid_container" from moduleSite
  //And insert as child of body on our document
}

//Fix links = replace href and src with full links
function fixLinks(text) {
  text = text.replace('src="/', 'src="https://development.frontend.webdev.zeiss.com/');
  text = text.replace('href="/', 'href="https://development.frontend.webdev.zeiss.com/');
  text = text.replace('"/imageResize/', '"https://development.frontend.webdev.zeiss.com/imageResize/')
  return text;
}

/*
const requestmodules = new Request("https://development.frontend.webdev.zeiss.com/components/modules/downloads?option=0");
fetch(requestmodules, {
    method: 'GET',
    credentials: 'same-origin',
    redirect: 'follow',
    agent: null,
    headers: {
    "Content-Type": "text/plain",
    'Authorization': 'Basic ' + btoa('zeiss:licht')
    }
})
    .then(response => response.text())
    .then(text => console.log(data));
alert("OK?")
*/