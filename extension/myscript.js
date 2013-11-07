// uses closure - the inner function saves the conditions under which it was created

// displays an info icon at the beginning of every h2 element
// displays a white star icon at the end of every h2 element
// the info icon is an event listener


// hash function taken from: http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash-
function hashCode(str){
    var hash = 0;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}


var h2Elements = document.getElementsByTagName('h2');
url = window.location.href;

for (i = 0; i < h2Elements.length; i++){
    var h2Parent = h2Elements[i].parentNode;
    var infoIcon = document.createElement('img');
    var whiteStar = document.createElement('img');

    whiteStar.setAttribute("src", "http://localhost:5000/static/images/white_star.png");
    whiteStar.setAttribute('id', 'whiteStar');
    infoIcon.setAttribute("src", "http://localhost:5000/static/images/info_icon.png");

    infoIcon.addEventListener('click', onInfoButtonClick(h2Parent), false);
    whiteStar.addEventListener('click', onStarButtonClick(h2Elements[i]), false);
    
    h2Elements[i].appendChild(whiteStar);
    h2Elements[i].insertBefore(infoIcon, h2Elements[i].childNodes[0]);

}

// displays an iframe at the bottom of the section that is clicked on
// passes the DOM section id into the url
function onInfoButtonClick(h2Parent){
    return function(){
        var iframe = document.createElement('iframe');

        var hashedURL = hashCode(url + "#" + h2Parent.id);

        iframe.setAttribute("src", "http://localhost:5000/comment/" + hashedURL);
        iframe.width = "750px";
        iframe.height = "300px";
        iframe.frameBorder=0;
        h2Parent.appendChild(iframe);
    };
}

// changes white star to yellow star when clicked
function onStarButtonClick(h2Element){
    return function(){
        var whiteStar = document.getElementById('whiteStar');
        var yellowStar = document.createElement('img');
        yellowStar.setAttribute("src", "http://localhost:5000/static/images/yellow_star.png");
        h2Element.replaceChild(yellowStar, whiteStar);
    };
}
