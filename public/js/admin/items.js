$(document).ready(() => {
    GetItems();
    AddItem();
    ShowRemoveItems();
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
        ListenerForAddItemsBtn();
    });
}

function ListenerForAddItemsBtn() {
    alert(window.location.href);
    localStorage.setItem("category", document.title);
    window.location.href += "/new-item";
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
            GoToItem();
        });
        container_for_four.append(item);
    }
}

function GoToItem() {
    let category = document.title;
    let id = $(".item").attr("item-id");
    window.location.href += `/${id}`;
}

function ShowRemoveItems() {
    $("form.items-ctrl > input[name='remove']").click((e) => {
        ListenerForRemoveItemsBtn();
    });
}

function ListenerForRemoveItemsBtn() {
    $("form.items-ctrl > input[name='remove']").off("click");
    $("form.items-ctrl > input[name='add']").off("click");
    $(".item").off("click");
    /*let elem = $(document.createElement("input"));
    elem.attr({
        "type": "checkbox",
        "name": "to-remove"
    });*/
    let list = document.querySelectorAll(".item");
    for (let i = 0; i < list.length; i++) {
        alert(i);
        let elem = $(document.createElement("input"));
        elem.attr({
            "type": "checkbox",
            "name": "to-remove"
        });
        $(list.item(i)).prepend(elem);
        $(list.item(i)).children(elem).attr("remove-id", $(elem).parent().attr("item-id"));
        //alert("asdf");
    }

    let cancelBtn = $(document.createElement("button"));
    cancelBtn.attr({
        "name": "cancel-remove"
    });
    cancelBtn.text("Cancel Remove");
    cancelBtn.click((e) => {
        $("form.items-ctrl > input[name='remove']").click((e) => {
            ListenerForRemoveItemsBtn();
        });
        $("form.items-ctrl > input[name='add']").click((e) => {
            ListenerForAddItemsBtn();
        });
        $(".item").click((e) => {
            GoToItem();
        });
        HideRemoveItems(".item", "input[name='to-remove']");
    });

    let subminBtn = $(document.createElement("button"));
    subminBtn.attr({
        "name": "submit-remove"
    });
    subminBtn.text("Remove");
    subminBtn.click((e) => {
        $("form.items-ctrl > input[name='remove']").click((e) => {
            ListenerForRemoveItemsBtn();
        });
        $("form.items-ctrl > input[name='add']").click((e) => {
            ListenerForAddItemsBtn();
        });
        let checked = document.querySelectorAll("input[name='to-remove']");
        $(".item").click((e) => {
            GoToItem();
        });
        //RemoveSelectedItems(checked);
        HideRemoveItems(".item", "input[name='to-remove']");
        RemoveSelectedItems(checked);
    });

    cancelBtn.insertAfter($("p.amount"));
    subminBtn.insertAfter($("p.amount"));
}

function HideRemoveItems(selector, sign) {
    let parent = document.querySelectorAll(selector);
    let _sign = document.querySelectorAll(sign);
    for (let i = 0; i < parent.length; i++) {
        alert(parent.length);
        parent.item(i).removeChild(_sign.item(i));
    }

    HideRemoveButtons();
    // cancel
}

function HideRemoveButtons() {
    $("button[name='cancel-remove']").remove();
    $("button[name='submit-remove']").remove();
}

function RemoveSelectedItems(checked) {
    let arr_id = [];
    for (let i = 0; i < checked.length; i++) {
        if (checked.item(i).checked) arr_id.push(checked.item(i).getAttribute("remove-id"));
    }
    alert(document.title);
    alert(arr_id);

    let info = {
        category: document.title,
        items: arr_id
    };
    $.ajax({
        method: "POST",
        url: "/remove-admin-items",
        data: {
            info: JSON.stringify(info)
        },
        success(res) {
            alert(res);
            $(".items-list").remove();
            GetItems();
        },
        error(err) {
            alert(err);
        }
    });
    //ajax request and re-render
}