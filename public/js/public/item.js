$(document).ready(() => {
    getItem();
});

function getItem() {
    console.log(Number(document.querySelector(".id").innerHTML));
    console.log(document.querySelector(".category").innerHTML);
    $.ajax({
        method: "GET",
        url: "/get-item",
        data: {
            id: Number(document.querySelector(".id").innerHTML),
            category: document.querySelector(".category").innerHTML
        }, 
        success(res) {
            console.log(res);
        },
        error(err) {
            console.error(err);
        }
    });
}