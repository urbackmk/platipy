var DOMAIN = "platipy.herokuapp.com";
// var DOMAIN = "localhost:5000";


//also needs to pass the text of the segment
var createIframe = function(htmlSection, iframeId, $pageTitle, $sectionTitle, $segmentText){
    var $iframe = $('<iframe></iframe>');
    var encodedHtmlSection = encodeURIComponent(htmlSection);
    $iframe.attr("src", "http://" + DOMAIN +
        "/comment?html_section=" + encodedHtmlSection +
        "&pageTitle=" + encodeURIComponent($pageTitle) +
        "&sectionTitle=" + encodeURIComponent($sectionTitle) +
        "&segmentText=" + encodeURIComponent($segmentText));
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
            var htmlSection = urlMinusSection +
                "#" + $sectionElement.attr('id') +
                ":" + md5($segmentElement.text());
            var $pageTitle = document.title;
            var $hTag = $('#' + $sectionElement.attr('id') + '> :header').eq(0);
            var $sectionTitle = $hTag.text();
            var $segmentText = $segmentElement.text();
            $iframe = createIframe(htmlSection, iframeId, $pageTitle, $sectionTitle, $segmentText);
            var $p = $('<p></p>');
            $segmentElement.append($p);
            $p.append($iframe);

            // using a jquery plug-in for cross-domain iframe resizing
            $iframe.iFrameSizer({
                log: true,
                contentWindowBodyMargin:8,
                doHeight:true,
                doWidth:false,
                enablePublicMethods:true,
                interval:32,
                callback:function(messageData){
                }
            });

        } else {
            $iframe.remove();
        }
    };
};

var returnHtmlSection = function($segmentElement, $sectionElement){
    var urlMinusSection = location.href.split("#")[0];
    var htmlSection = urlMinusSection +
                "#" + $sectionElement.attr('id') +
                ":" + md5($segmentElement.text());
    return htmlSection;
};
// "sectionElement" = <div class="section"></div>
// "segmentElement" == a node that we're commenting on
var infoIconCache = {};

var main = function(){
    var $segmentElements = $(".section > p, .section > dl, .section > table, .section > ol, " +
          ".section > div.highlight-python, .section > ul, .section > .admonition, .section > blockquote");
    $segmentElements.each(function(index, element){
        if (!($(this).text().length < 100 && $(this).is('p'))){
            var $sectionElement = $(this).parent();
            var $segmentElement = $(this);
            var $infoIcon = $('<img></img>');

            var clickHandler = onInfoButtonClick($segmentElement, $sectionElement);
            $infoIcon.attr("src", "http://" + DOMAIN + "/static/images/info_icon_25px.png");
            $infoIcon.attr("style", "position: absolute; margin-left: -30px");
            $infoIcon.click(clickHandler);
            $(this).prepend($infoIcon);

            // store infoIcon in the dictionary cache so that I can change it's attributes later
            htmlSection = returnHtmlSection($segmentElement, $sectionElement);
            infoIconCache[htmlSection] = $infoIcon;

            // if the url is pointing to a specific segment element:
            if (md5($segmentElement.text()) === location.hash.split(":")[1]){
                //load iframe
                clickHandler();
                // and scroll to that segment
                $('html, body').animate({
                    scrollTop: $segmentElement.offset().top
                });
            }
        }
    });
};

main();

var changeInfoIconColor = function(){
    $.getJSON("http://" + DOMAIN + "/num_comments", {pageTitle: document.title} )
        .done(
            function(data){
                for (var item in data){
                    if (item in infoIconCache){
                        infoIconCache[item].attr("src", "http://" + DOMAIN + "/static/images/info_icon_green_25px.png");
                    }
                }
            });
};

changeInfoIconColor();

