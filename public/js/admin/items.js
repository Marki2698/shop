$(document).ready(() => {
    GetItems();
    AddItem();
});

function GetItems() {
    let name = document.title;
    //alert(name);
    $.ajax({
        method: "GET",
        url: "/get-admin-items",
        data: {
            name: name
        },
        success(res) {
            if (typeof res === "string") {
                $("p.amount").text(res);
            } else {
                $("p.amount").text(res.length);
                //alert(JSON.stringify(res));
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
    let list = $(document.createElement("div"));
    list.attr({
        "class": "items-list"
    });
    let container_for_four = $(document.createElement("div"));
    container_for_four.attr({
        "class": "flex-item-container"
    });
    for (let i = 0; i <= array.length; i++) {
        if (i % 4 === 0) {
            list.append(container_for_four);
            $("div.items").append(list);
            $(list).append(document.createElement("br"));
            container_for_four = $(document.createElement("div"));
            container_for_four.attr({
                "class": "flex-item-container"
            });
        }
        if (i === array.length) {
            list.append(container_for_four);
            $("div.items").append(list);
            break;
        }
        let item = $(document.createElement("div"));
        item.attr({
            "class": "item"
        });
        if (array[i].images) {
            let image = $(document.createElement("img"));
            if (array[i].images.length === 0) {
                image.attr({
                    "src": "/images/no_photo.png",
                    "alt": array[i].name
                });
            } else {
                image.attr({
                    "src": array[i].images[0],
                    "alt": array[i].name
                });
            }
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
        item.attr("item-id", array[i].id);
        $(item).click((e) => {
            let category = document.title;
            let id = item.attr("item-id");
            GoToItem(id);
        });
        container_for_four.append(item);
    }
}

function GoToItem(id) {
    window.location.href += `/${id}`;
}