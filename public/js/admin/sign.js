$(document).ready(() => {
    $("input[name='submit']").click(() => {
        if ($("input[name='password']").val() !== $("input[name='confirm']").val()) {
            alert("Passwords don't match");
            return false;
        } else {;
            /*$.ajax({
                method: "POST",
                url: "/admin-sign",
                data: {
                    email: $("input[name='email']").val(),
                    password: $("input[name='password']").val()
                },
                success(res) {
                    console.log(res);
                },
                error(res) {
                    console.error(res);
                }
            });*/
        }
    });
});