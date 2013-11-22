// using a jquery plug-in for cross-domain iframe resizing
if (window.iFrameSizer && window.iFrameSizer.trigger) {
    window.iFrameSizer.trigger();
}

var textArea = document.getElementById();

$(document).ready(function(){
    $('#text_area').autosize({
        //triggers the iframe to resize if the textarea resizes
        callback: function(){
            if (window.iFrameSizer && window.iFrameSizer.trigger)  {
                window.iFrameSizer.trigger();
            }
        }
    });
    $("#insert_code").click(function(){
        $('#text_area').val($('#text_area').val() + '[code]\n[/code]');
    });
});

// toggle info on landing page

$('.favorites-row').hide();

$('#about-button').click(function(){
    $('.about-row').show();
    $('.favorites-row').hide();
});

$('.website-button').click(function(){
    $('.about-row').hide();
    $('.favorites-row').show();
});