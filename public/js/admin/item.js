$(document).ready((e) => {
    //alert(window.location.pathname);
    getData();
});

let changeLog = {};

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
            changeLog._default = res;
            changeLog._src = res["images"];
            ShowFields(res);
        },
        error(err) {
            alert(err);
        }
    });
}

function ShowFields(obj) {
    let parent = $("div.update-item-fields");
    let fields = $(document.createElement("form"));
    fields.attr({
        "name": "update-form",
        "class": "update-form"
    });

    if (obj.hasOwnProperty("_id")) RemoveKeys(obj);

    for (let key in obj) {
        if (key !== "id" || key !== "_id" || key !== "__v") {
            if (key === "images") {
                BuildImageField(key, obj[key], parent);
            } else {
                let label = $(document.createElement("label"));
                label.attr({
                    "for": key
                });
                label.text(key);
                let input = $(document.createElement("input"));
                input.attr({
                    "name": key,
                    "type": "text",
                    "value": obj[key]
                });
                fields.append(label, input, $(document.createElement("br")));
            }
        }
    }

    let save = $(document.createElement("button"));
    save.text("Save");
    save.click((e) => {
        SaveChanges();
    });

    let cancel = $(document.createElement("button"));
    cancel.text("Cancel");

    cancel.click((e) => {
        CancelChanges();
    });

    parent.append(fields, save, cancel);
}

function BuildImageField(key, array, parent) {
    let image_field = $(document.createElement("div"));
    image_field.attr({
        "class": "image-field"
    });
    let file_form = $(document.createElement("form"));
    file_form.attr({
        "name": "file-form",
        "enctype": "multipart/form-data",
        "class": "file-form"
    });
    let label = $(document.createElement("label"));
    label.attr({
        "for": key
    });
    label.text(key);
    let file_input = $(document.createElement("input"));
    file_input.attr({
        "name": key,
        "type": "file",
        "multiple": ""
    });

    let container = $(document.createElement("div"));
    container.attr({
        "class": "flex-image-list"
    });
    for (let i = 0; i < array.length; i++) {
        let image = $(document.createElement("img"));
        image.attr({
            "src": array[i],
            "alt": `image_${i}`
        });
        image.click((e) => {
            //alert($(e.target).attr("src"));
            RemoveImage($(e.target).attr("src"));
        });
        container.append(image);
    }

    file_form.append(label, file_input);
    image_field.append(file_form, container);
    parent.prepend(image_field);
    //parent.prepend(file_form, container);
}

function RemoveKeys(obj) {
    delete obj._id;
    delete obj.__v;
    delete obj.id;
}

function RefreshItem(res) {
    $("div.update-item-fields").empty();
    ShowFields(res);
}

function RemoveImage(src) {
    if (!changeLog._src) changeLog._src = changeLog._default["images"];
    alert(changeLog._src);
    let index = changeLog._src.indexOf(src);
    changeLog._src.splice(index, 1);
    alert(changeLog._src);
}

function AddImages() {
    if ($("form.file-form")) return new FormData(document.querySelector("form.file-form"));
    return false;
}

function ImgFolder() {
    // 7 + name of category
    if (!changeLog._src) {
        if (changeLog._default["images"]) {
            let category_length = document.title.length;
            return changeLog._default["images"][0].substr(0, 7 + category_length);
        } else {
            // ???
        }
    } else {
        let category_length = document.title.length;
        if (!changeLog._src[0]) {
            return "";
        } else {
            return changeLog._src[0].substr(0, 7 + category_length);
        }
        //let substr = changeLog._src[0].substr(0, 7 + category_length);
        //alert(substr);
        //return substr;
    }
}

function ConfigureData() {
    RemoveKeys(changeLog._default);
    let update = {};
    let data;
    for (let key in changeLog._default) {
        if (key === "images") {
            data = AddImages();
        } else {
            data = new FormData();
        }
    }
    for (let key in changeLog._default) {
        if (key === "images") {
            alert(changeLog._src + " is src");
            update[key] = changeLog._src;
        } else {
            update[key] = $("input[name='" + key + "']").val();
        }
    }
    //update["remove-images"] = changeLog._src;
    data.append("update", JSON.stringify(update));
    data.append("category", document.title);
    data.append("id", $("p.id-number").text());
    data.append("folder", ImgFolder());
    //alert(data.valueOf());
    return data;
}

function SaveChanges() {
    let data = ConfigureData();
    $.ajax({
        method: "POST",
        url: "/update-item",
        data: data,
        cashe: false,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success(res) {
            alert(res);
        },
        error(err) {
            console.error(err);
        }
    });
    //alert(JSON.stringify(update));
}

function CancelChanges() {
    alert(JSON.stringify(changeLog._default));
    RefreshItem(changeLog._default);
}