$(document).ready(() => {
    Download();
});

let downloaded = false;

function NavBar(categories) {

}

function DownloadCategories() {
    $("li.more").click((e) => {
        if (!downloaded) Download();

    });
}

function Download() {
    $.ajax({
        method: "GET",
        url: "/get-categories",
        success(res) {
            alert(Array.isArray(res));
            BuildList(res);
        },
        error(err) {
            console.error(err);
        }
    });
}

function BuildList(categories) {
    let top = document.querySelector("li.more").getBoundingClientRect().top;
    let list = document.createElement("div");
    list.className = "list";
    list.style.top = top;
    let close_p = document.createElement("p");
    let close_sign = document.createElement("span");
    close_sign.className = "close-categories";
    close_sign.innerHTML = `&times;`;
    close_p.appendChild(close_sign);
    list.appendChild(close_p);
    for (let category of categories) {
        let a = document.createElement("a");
        a.href = `/${category}`;
        a.innerHTML = category;
        list.appendChild(a);
    }
    document.querySelector("body").appendChild(list);
    ListenerForClose();
    ListenerForMore();
}

function ListenerForMore() {
    $("li.more").click((e) => {
        $(".list").addClass("list-display");
    });
}

function ListenerForClose() {
    $("span.close-categories").click((e) => {
        $(".list").removeClass("list-display");
    })
}