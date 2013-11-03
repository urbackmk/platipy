// displays an info icon for every h2 element

var newElements2 = document.getElementsByTagName('h2');

for (i = 0; i < newElements2.length; i++){
    var image = document.createElement('img');
    image.setAttribute("src", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIR09SKvoCEVXv8o4RkMrumjOnC9GSyS1sPTxQhw0su3CogFwE2Q");
    newElements2[i].appendChild(image);
}


// displays an iframe at the bottom of every section

var newElements3 = document.getElementsByClassName('section');

for (i = 0; i < newElements3.length; i++) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute("src", "http://en.wikipedia.org/wiki/Platypus");
    iframe.width = "750 px";
    newElements3[i].appendChild(iframe);
}

// trying to display an image button which loads an iframe instead of a static image

// function createButton(context, func){
//     var button = document.createElement('input');
//     button.type = "button";
//     button.image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIR09SKvoCEVXv8o4RkMrumjOnC9GSyS1sPTxQhw0su3CogFwE2Q";
//     button.onclick = func;
//     context.appendChild(button);
// }

// function onButtonClick(){
//     var iframe = document.createElement('iframe');
//     iframe.setAttribute("src", "http://www.meghanurback.com");
//     newElements2.appendChild(iframe);
// }

// for (i = 0; i < newElements2.length; i++){
//     createButton(newElements2, onButtonClick);
// }
