// uses closure - the inner function saves the conditions under which it was created

// displays an info icon at the beginning of every h2 element
// each icon is an event listener

var h2Elements = document.getElementsByTagName('h2');

for (i = 0; i < h2Elements.length; i++){
    var h2Parent = h2Elements[i].parentNode;
    var image = document.createElement('img');
    image.setAttribute("src", "http://localhost:5000/static/images/info_icon.png");
    image.addEventListener('click', onButtonClick(h2Parent), false);
    h2Elements[i].insertBefore(image, h2Elements[i].childNodes[0]);

}


// displays an iframe at the bottom of the section that is clicked on
// passes the section id into the url

function onButtonClick(h2Parent){
    return function(){
        var iframe = document.createElement('iframe');
        iframe.setAttribute("src", "http://localhost:5000/" + h2Parent.id);
        iframe.width = "750px";
        h2Parent.appendChild(iframe);
    };
}
