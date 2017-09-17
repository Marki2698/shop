$(document).ready(() => {
    $("input[name='submit']").click(() => {
        if ($("input[name='password']").val() === "" || $("input[name='email']").val() === "") {
            alert("Fill both fields!");
            return false;
        }
    });
});