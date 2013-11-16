var textArea = document.getElementById();

$(document).ready(function(){
    $('#text_area').autosize();
    $("#insert_code").click(function(){
        $('#text_area').val($('#text_area').val() + '[code]\n[/code]');
    });
});