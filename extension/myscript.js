// var DOMAIN = "platipy.herokuapp.com";
var DOMAIN = "localhost:5000";

function createIframe(url, iframeId){
    var $iframe = $('<iframe></iframe>');
    var encodedURL = encodeURIComponent(url);
    $iframe.attr("src", "http://" + DOMAIN + "/comment?html_section=" + encodedURL);
    $iframe.attr("id", iframeId);
    $iframe.attr("width", "100%");
    $iframe.attr("scrolling", "no");
    $iframe.attr("frameBorder", 0);
    return $iframe[0];
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

            // using a jquery plug-in for cross-domain iframe resizing
            $(iframe).iFrameSizer({
                log: true,
                contentWindowBodyMargin:8,
                doHeight:true,
                doWidth:false,
                enablePublicMethods:true,
                interval:32,
                callback:function(messageData){
                    console.log("got some messageData", messageData);
                }
            });

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

        infoIcon.setAttribute("src", "http://" + DOMAIN + "/static/images/info_icon.png");
        infoIcon.addEventListener('click', clickHandler, false);
        h2Elements[i].insertBefore(infoIcon, h2Elements[i].childNodes[0]);

        if ("#" + sectionElement.id === location.hash){
            clickHandler();
        }
    }
    // $('dt').prepend('<img src="http://localhost:5000/static/images/white_star.png" />');
}

main();

