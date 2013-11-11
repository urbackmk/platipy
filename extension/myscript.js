// uses closure - the inner function saves the conditions under which it was created

// displays an info icon at the beginning of every h2 element
// the info icon is an event listener

var h2Elements = document.getElementsByTagName('h2');
url = window.location.href;

for (i = 0; i < h2Elements.length; i++){
    var h2Parent = h2Elements[i].parentNode;
    var infoIcon = document.createElement('img');
    infoIcon.setAttribute("src", "http://localhost:5000/static/images/info_icon.png");
    infoIcon.addEventListener('click', onInfoButtonClick(h2Parent), false);

    h2Elements[i].insertBefore(infoIcon, h2Elements[i].childNodes[0]);

}

/**
 * if there is not already an iframe:
 * display an iframe at the bottom of the section that is clicked on
 * and pass the document section into the URL
 * if there is already an iframe:
 * remove the iframe element
 */
function onInfoButtonClick(h2Parent){
    return function(){
        var iframeId = h2Parent.id + "ihgfjhfdfjf";
        var iframe = document.getElementById(iframeId);
        if (!iframe){
            iframe = document.createElement('iframe');
            var encodedURL = encodeURIComponent(url + "#" + h2Parent.id);

            iframe.setAttribute("src", "http://localhost:5000/comment?html_section=" + encodedURL);
            iframe.setAttribute("id", iframeId);
            iframe.width = "790px";
            iframe.height = "300px";
            iframe.frameBorder=0;
            h2Parent.appendChild(iframe);
        } else {
            iframe.parentNode.removeChild(iframe);
        }
    };
}
