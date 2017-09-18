$(document).ready(() => {
    GetItems();
    AddItem();
});

function GetItems() {
    let name = document.title;
    //alert(name);
    $.ajax({
        method: "GET",
        url: "/get-items",
        data: {
            name: name
        },
        success(res) {
            if (typeof res === "string") {
                $("p.amount").text(res);
            } else {
                $("p.amount").text(res.length);
                alert(JSON.stringify(res));
                BuildListOfItems(res);
            }
            //alert(res);
        },
        error(err) {
            console.error(err);
        }
    });
}

function AddItem() {
    $("form.items-ctrl > input[name='add']").click((e) => {
        alert(window.location.href);
        localStorage.setItem("category", document.title);
        window.location.href += "/new-item";
    });
}

function BuildListOfItems(array) {
    alert(Array.isArray(array));
    let list = $(document.createElement("div"));
    list.attr({
        "class": "items-list"
    });
    //$("div.items").append(list);
    let container_for_four = $(document.createElement("div"));
    container_for_four.attr({
        "class": "flex-item-container"
    });
    for (let i = 0; i < array.length; i++) {
        //alert(123);
        if (i === 4) {
            $(list).append(document.createElement("br"));
            container_for_four = $(document.createElement("div"));
            $(container_for_four).attr({
                "class": "flex-item-container"
            });
        }
        let item = $(document.createElement("div"));
        item.attr({
            "class": "item"
        });
        if (array[i].images) {
            let image = $(document.createElement("img"));
            image.attr({
                "src": array[i].images[0],
                "alt": array[i].name
            });
            item.append(image);
        } else {
            let image = $(document.createElement("img"));
            image.attr({
                "src": "/images/no_photo.png",
                "alt": array[i].name
            });
            item.append(image);
        }
        let name = $(document.createElement("p"));
        name.text(array[i].name);
        item.append(name);
        container_for_four.append(item);
        //list.append(fontainer_for_four);
        alert(123);
    }
    list.append(container_for_four);
    $("div.items").append(list);
}