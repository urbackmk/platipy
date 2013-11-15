function createIframe(url, iframeId){
    var iframe = document.createElement('iframe');
    var encodedURL = encodeURIComponent(url);
    iframe.setAttribute("src", "http://localhost:5000/comment?html_section=" + encodedURL);
    iframe.setAttribute("id", iframeId);
    iframe.width = "790px";
    iframe.height = "300px";
    iframe.frameBorder=0;
    return iframe;
}

/**
 * if there is not already an iframe:
 * display an iframe at the bottom of the section that is clicked on
 * and pass the document section into the URL
 * if there is already an iframe:
 * remove the iframe element
 * uses closure - the inner function saves the conditions under which it was created
 */
function onInfoButtonClick(sectionElement){
    return function(){
        var iframeId = sectionElement.id + "ihgfjhfdfjf";
        var iframe = document.getElementById(iframeId);
        var urlMinusSection = location.href.split("#")[0];
        if (!iframe){
            var url = urlMinusSection + "#" + sectionElement.id;
            iframe = createIframe(url, iframeId);
            sectionElement.appendChild(iframe);
        } else {
            iframe.parentNode.removeChild(iframe);
        }
    };
}


// displays an info icon at the beginning of every h2 element
// loads an iframe for the section specified in the url hash
function main(){
    var h2Elements = document.getElementsByTagName('h2');
    for (i = 0; i < h2Elements.length; i++){
        var sectionElement = h2Elements[i].parentNode;
        var infoIcon = document.createElement('img');
        var clickHandler = onInfoButtonClick(sectionElement);

        infoIcon.setAttribute("src", "http://localhost:5000/static/images/info_icon.png");
        infoIcon.addEventListener('click', clickHandler, false);
        h2Elements[i].insertBefore(infoIcon, h2Elements[i].childNodes[0]);

        if ("#" + sectionElement.id === location.hash){
            clickHandler();
        }
    }
    // $('dt').prepend('<img src="http://localhost:5000/static/images/white_star.png" />');
}

main();

