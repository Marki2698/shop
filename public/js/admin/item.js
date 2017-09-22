$(document).ready((e) => {
    //alert(window.location.pathname);
    getData();
});

function getData() {
    $.ajax({
        method: "GET",
        url: "/get-admin-item",
        data: {
            category: document.title,
            id: Number($("p.id-number").text())
        },
        success(res) {
            alert(Object.getOwnPropertyNames(res));
        },
        error(err) {
            alert(err);
        }
    });
}