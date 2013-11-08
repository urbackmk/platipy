// uses closure - the inner function saves the conditions under which it was created

// displays an info icon at the beginning of every h2 element
// the info icon is an event listener
console.log('hi');

var h2Elements = document.getElementsByTagName('h2');
url = window.location.href;

for (i = 0; i < h2Elements.length; i++){
    var h2Parent = h2Elements[i].parentNode;
    var infoIcon = document.createElement('img');
    infoIcon.setAttribute("src", "http://localhost:5000/static/images/info_icon.png");
    infoIcon.addEventListener('click', onInfoButtonClick(h2Parent), false);

    h2Elements[i].insertBefore(infoIcon, h2Elements[i].childNodes[0]);

}

// displays an iframe at the bottom of the section that is clicked on
// passes the DOM section id into the url
function onInfoButtonClick(h2Parent){
    return function(){
        var iframe = document.createElement('iframe');
        var encodedURL = encodeURIComponent(url + "#" + h2Parent.id);

        iframe.setAttribute("src", "http://localhost:5000/comment/?html_section=" + encodedURL);
        iframe.width = "750px";
        iframe.height = "300px";
        iframe.frameBorder=0;
        h2Parent.appendChild(iframe);
    };
}


