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

function ShowRemoveItems() {
    $("form.items-ctrl > input[name='remove']").click((e) => {
        //alert("asdf");
        $("form.items-ctrl > input[name='remove']").off("click");
        $("form.items-ctrl > input[name='add']").off("click");
        $(".item").off("click");
        //alert("asdf");
        /*$(".item").each(() => {
            //alert("asdf");
            let elem = $(document.createElement("input"));
            elem.attr({
                "type": "checkbox",
                "name": "to-remove",
                "remove-id": $(this).attr("item-id")
            });
            //alert("asdf");
            //alert(JSON.stringify($(this)));
            $(this).prepend(elem);
            alert("asdf");
        });*/
        let elem = $(document.createElement("input"));
        elem.attr({
            "type": "checkbox",
            "name": "to-remove",
            "remove-id": $(this).attr("item-id")
        });
        let list = document.querySelectorAll(".item");
        for (let i = 0; i < list.length; i++) {
            /*let elem = $(document.createElement("input"));
            elem.attr({
                "type": "checkbox",
                "name": "to-remove",
                "remove-id": $(this).attr("item-id")
            });*/
            $(list.item(i)).prepend(elem);
            alert("asdf");
        }

        let cancelBtn = $(document.createElement("button"));
        cancelBtn.attr({
            "name": "cancel-remove"
        });
        cancelBtn.text("Cancel Remove");
        cancelBtn.click((e) => {
            $("form.items-ctrl > input[name='remove']").on("click");
            $("form.items-ctrl > input[name='add']").on("click");
            $(".item").on("click");
            HideRemoveItems(".item", elem);
        });

        let subminBtn = $(document.createElement("button"));
        subminBtn.attr({
            "name": "submit-remove"
        });
        subminBtn.text("Remove");
        subminBtn.click((e) => {
            $("form.items-ctrl > input[name='remove']").on("click");
            $("form.items-ctrl > input[name='add']").on("click");
            let checked = $("input[name='to-remove']");
            $(".item").on("click");
            RemoveSelectedItems(checked);
        });

        cancelBtn.insertAfter($("p.amount"));
        subminBtn.insertAfter($("p.amount"));
    });
}

function HideRemoveItems(selector, sign) {
    let parent = document.querySelectorAll(selector);
    for (let i = 0; i < parent.length; i++) {
        $(parent.item(i)).children(sign).remove(sign);
    }
    // cancel
}

function RemoveSelectedItems(checked) {
    //ajax request and re-render
}