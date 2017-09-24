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
            ShowFields(res);
        },
        error(err) {
            alert(err);
        }
    });
}

function ShowFields(obj) {
    let parent = $("div.update-item");
    let fields = $(document.createElement("form"));
    fields.attr({
        "name": "update-form",
        "class": "update-form"
    });

    // WARNING!!!
    delete obj._id;
    delete obj.__v;
    delete obj.id;
    // WARNING!!!

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
    image_field.insertAfter($("p.id-number"));
    //parent.prepend(file_form, container);
}

function RemoveImage(src) {
    changeLog._src = [];
    changeLog._src.push(src);
    alert(changeLog._src);
}

function SaveChanges() {

}

function CancelChanges() {

}