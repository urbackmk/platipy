// var DOMAIN = "platipy.herokuapp.com";
var DOMAIN = "localhost:5000";

var createIframe = function(htmlSection, iframeId){
    var $iframe = $('<iframe></iframe>');
    var encodedHtmlSection = encodeURIComponent(htmlSection);
    $iframe.attr("src", "http://" + DOMAIN + "/comment?html_section=" + encodedHtmlSection);
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
var onInfoButtonClick = function($segmentElement, $sectionElement){
    return function(){
        var iframeId = $sectionElement.attr("id") + md5($segmentElement.text());
        var $iframe = $('#' + iframeId);
        var urlMinusSection = location.href.split("#")[0];
        if ($iframe.length === 0){
            var htmlSection = urlMinusSection + "#" + $sectionElement.attr('id') + ":" + md5($segmentElement.text());
            $iframe = createIframe(htmlSection, iframeId);
            $segmentElement.append($iframe);

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

// "sectionElement" = <div class="section"></div>
// "segmentElement" == a node that we're commenting on

//displays an info icon at the beginning of every h2 element
//loads an iframe for the section specified in the url hash
var main = function(){
    var $h2Elements = $('h2');
    $h2Elements.each(function(index, element){
        var $sectionElement = $(this).parent();
        var $segmentElement = $sectionElement;
        var $infoIcon = $('<img></img>');
        var clickHandler = onInfoButtonClick($segmentElement, $sectionElement);

        $infoIcon.attr("src", "http://" + DOMAIN + "/static/images/info_icon.png");
        $infoIcon.click(clickHandler);
        $(this).prepend($infoIcon);

        // if the url is pointing to a specific segment element:
        if (md5($segmentElement.text()) === location.hash.split(":")[1]){
            //load iframe
            clickHandler();

            // and scroll to that segment
            $('html, body').animate({
                scrollTop: $segmentElement.offset().top
            });
        }
    });
};

main();
