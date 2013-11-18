// var DOMAIN = "platipy.herokuapp.com";
var DOMAIN = "localhost:5000";

var createIframe = function(url, iframeId){
    var $iframe = $('<iframe></iframe>');
    var encodedURL = encodeURIComponent(url);
    $iframe.attr("src", "http://" + DOMAIN + "/comment?html_section=" + encodedURL);
    $iframe.attr("id", iframeId);
    $iframe.attr("width", "100%");
    $iframe.attr("scrolling", "no");
    $iframe.attr("frameBorder", 0);
    return $iframe;
};

/**
 * if there is not already an iframe:
 * display an iframe at the bottom of the section that is clicked on
 * and pass the document section into the URL
 * if there is already an iframe:
 * remove the iframe element
 * uses closure - the inner function saves the conditions under which it was created
 */
var onInfoButtonClick = function($sectionElement){
    return function(){
        var iframeId = $sectionElement.attr("id") + "ihgfjhfdfjf";
        var $iframe = $('#' + iframeId);
        var urlMinusSection = location.href.split("#")[0];
        if ($iframe.length === 0){
            var url = urlMinusSection + "#" + $sectionElement.attr("id");
            $iframe = createIframe(url, iframeId);
            $sectionElement.append($iframe);

            // using a jquery plug-in for cross-domain iframe resizing
            $iframe.iFrameSizer({
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
            $iframe.remove();
        }
    };
};



//displays an info icon at the beginning of every h2 element
//loads an iframe for the section specified in the url hash
var main = function(){
    var $h2Elements = $('h2');
    $h2Elements.each(function(index, element){
        var $sectionElement = $(this).parent();
        var $infoIcon = $('<img></img>');
        var clickHandler = onInfoButtonClick($sectionElement);

        $infoIcon.attr("src", "http://" + DOMAIN + "/static/images/info_icon.png");
        $infoIcon.click(clickHandler);
        $(this).prepend($infoIcon);

        if ("#" + $sectionElement[0].id === location.hash){
            clickHandler();
        }
    });
};

main();

