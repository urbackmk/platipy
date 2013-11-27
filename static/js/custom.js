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

// default to showing .about-row and hiding .favorites-row
$('.favorites-row').hide();
$('#about-button').addClass("selected");

// on About button click
$('#about-button').click(function(){
    $('.favorites-row').hide();
    $('.website-button').removeClass("selected");
    $('.about-row').show();
    $(this).addClass("selected");
});

// on favorites website button click
$('.website-button').click(function(){
    $('.about-row').hide();
    $('.website-button').removeClass("selected");
    $('#about-button').removeClass("selected");
    $('.favorites-row').hide();
    var id = $(this).attr('id').replace("-link", "");
    $('#'+id).show();
    $(this).addClass("selected");
});

// hide everything
// show just what you want