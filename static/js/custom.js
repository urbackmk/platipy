var textArea = document.getElementById();

$(document).ready(function(){
    $("#insert_code").click(function(){
        $('#text_area').val($('#text_area').val() + '[code]\n[/code]');
        $('#text_area').setCursorPosition(6);
    });
});