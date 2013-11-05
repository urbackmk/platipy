// uses closure - the inner function saves the conditions under which it was created

// displays an info icon at the beginning of every h2 element
// displays a white star icon at the end of every h2 element
// the info icon is an event listener

var h2Elements = document.getElementsByTagName('h2');

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
// passes the section id into the url
function onInfoButtonClick(h2Parent){
    return function(){
        var iframe = document.createElement('iframe');
        iframe.setAttribute("src", "http://localhost:5000/" + h2Parent.id);
        iframe.width = "750px";
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
