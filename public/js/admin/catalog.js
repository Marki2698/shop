"use strict"

$(document).ready(() => {
    /*$.ajax({
        method: "GET",
        url: "/get-categories",
        success(res) {
            if (typeof res === "string") $("p.message").text(res);
            else if (Array.isArray(res)) {
                console.log(res);
                ShowCategories(res);
            }
        },
        error(err) {
            console.log(err);
        }
    });*/
    //setTimeout(GetCategories, 500);
    GetCategories();

    $("input[name='add-category']").click(() => {
        window.location.pathname = "/admin-panel/new-category";
    });

    $("input[name='remove-category']").click(() => {
        ShowRemoveSign();
    });

    /* $("span.remove-category").click(() => {
         let sure = confirm("Are you sure that you want to remove this category \nPlease note that after confirm operation will be uncancelable");
         alert(sure);
     });*/
});

function GetCategories() {
    $.ajax({
        method: "GET",
        url: "/get-categories",
        success(res) {
            if (typeof res === "string") $("p.message").text(res);
            else if (Array.isArray(res)) {
                console.log(res);
                ShowCategories(res);
            }
        },
        error(err) {
            console.log(err);
        }
    });
}

function ShowCategories(arr) {
    let parent = $("div.categories");
    let wrapper = $(document.createElement("div")).addClass("wrapper");
    for (let i = 0; i < arr.length; i++) {
        if (i % 4 == 0) {
            $(parent).append($(document.createElement("br")));
            wrapper = $(document.createElement("div")).addClass("wrapper");
        }
        //let wrapper = $(document.createElement("div")).addClass("wrapper");
        let item = $(document.createElement("div")).addClass("category-item");
        let name_item = $(document.createElement("p")).text(arr[i]);
        $(item).append(name_item);
        $(wrapper).append(item);
        $(parent).append(wrapper);
        /*if (i % 4 == 0) {
            $(parent).append($(document.createElement("br")));
            wrapper = $(document.createElement("div")).addClass("wrapper");
        }*/
    }

    ReferenceButton();
}

function ReferenceButton() {
    $("div.category-item > p").click((e) => {
        let category = $(e.target).text();
        window.location.pathname += `/${category}`;
    });
}

function ClearCategories() {
    $("div.categories").empty();
}

function ShowRemoveSign() {
    let items = $("div.category-item");
    let parent = $("div.categories");
    $(parent).prepend($(document.createElement("p")).addClass("cancel-remove").text("Cancel"));
    for (let i = 0; i < items.length; i++) {
        let removeSign = $(document.createElement("span")).addClass("remove-category").html("&times;");
        $(items[i]).addClass("remove-category-item").append(removeSign);
    }

    $("input[name='remove-category']").off("click");
    $("div.category-item").off("click");

    $("p.cancel-remove").click(() => {
        //alert($(this));
        HideRemoveSign();
        //$(this).off("click");
    });

    /*document.querySelector(".remove-category").addEventListener("click", (e) => {
        let sure = confirm("Are you sure that you want to remove this category \nPlease note that after confirm operation will be uncancelable");
        let target = e.target;
        alert(target.previousSibling());

        let name = document.querySelector($(this)).closest("p");
        RemoveCategory(sure, name);
    });*/
    $("span.remove-category").click((e) => {
        let sure = confirm("Are you sure that you want to remove this category \nPlease note that after confirm operation will be uncancelable");
        //alert(JSON.stringify(e));
        let name = $(e.target).prev().text();

        RemoveCategory(sure, name);
    });
}

function HideRemoveSign() {
    let items = document.querySelectorAll(".category-item");
    let crosses = document.querySelectorAll(".remove-category");
    $(".cancel-remove").off("click");
    let categories = document.querySelector(".categories");
    categories.removeChild(document.querySelector(".cancel-remove"));
    for (let i = 0; i < items.length; i++) {
        items.item(i).classList.remove("remove-category-item");
        items.item(i).removeChild(crosses.item(i));
    }

    $("input[name='remove-category']").click(() => {
        ShowRemoveSign();
    });
    ReferenceButton();
}

function RemoveCategory(sure, name) {
    if (!sure) {
        return false;
    }
    $.ajax({
        method: "DELETE",
        url: "/remove-category",
        data: {
            name
        },
        success(res) {
            alert(res);
            ClearCategories();
            GetCategories();
        },
        error(err) {
            console.error(err);
        }
    })
}