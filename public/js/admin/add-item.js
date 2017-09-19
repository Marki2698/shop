$(document).ready(() => {
    getSchema();
});

function getSchema() {
    $.ajax({
        method: "GET",
        url: "/get-schema",
        data: {
            name: localStorage.getItem("category")
        },
        success(res) {
            alert(JSON.stringify(res));
            makeFields(res);
        },
        error(err) {
            alert(err);
        }
    });
}

function makeFields(fields) {
    let form = $(document.createElement("form"));
    form.attr({
        "name": "create-form",
        "class": "create-form"
    });
    for (let key in fields) {
        let required;
        //console.log(fields);
        if (key === "images" || key === "photos" || key === "photo" || key === "image") {
            let file_form = $(document.createElement("form"));
            file_form.attr({
                "enctype": "multipart/form-data",
                "class": "file-form"
            });
            let label = $(document.createElement("label"));
            let file_input = $(document.createElement("input"));
            //let required;
            if (fields[key]["required"]) {
                required = true;
                label.text(`${key} (required) : `);
            } else {
                required = false;
                label.text(`${key} : `);
            }
            file_input.attr({
                "name": key,
                "type": "file",
                "required": required,
                "multiple": "",
                "placeholder": fields[key]["type"]
            });
            $(file_form).append(label, file_input);
            $("div.item-form").append(file_form);
        } else {
            let label = $(document.createElement("label"));
            label.attr("for", key);
            if (fields[key]["required"]) {
                required = true;
                label.text(key + " (required) : ");
            } else {
                required = false;
                label.text(key + " : ");
            }
            let field = $(document.createElement("input"));
            field.attr({
                "name": key,
                "type": "text",
                "required": required,
                "placeholder": fields[key]["type"]
            });
            $(form).append(label, field);
        }
    }
    let create = $(document.createElement("input"));
    create.attr({
        "name": "create",
        "type": "button",
        "value": "Create Item"
    });
    let reset = $(document.createElement("input"));
    reset.attr({
        "name": "reset",
        "type": "button",
        "value": "Reset fields"
    });
    $(form).append($(document.createElement("br")), create, reset);
    $("div.item-form").append(form);
    createItem(fields);
    resetFields();
}

function createItem(fields) {
    $("input[name='create']").click((e) => {

        let inputs = document.querySelectorAll("div.item-form .create-form input[type='text']");
        let labels = document.querySelectorAll("div.item-form .create-form label");
        let obj = {};
        //alert(labels.length + " is length");
        for (let i = 0; i < inputs.length; i++) {
            //alert(labels.item(i).hasAttribute("for"));
            if (inputs.item(i).getAttribute("required") !== "" && inputs.item(i).value !== "") {
                obj[labels.item(i).getAttribute("for")] = inputs.item(i).value;
            } else if (inputs.item(i).getAttribute("required") === "") {
                obj[labels.item(i).getAttribute("for")] = inputs.item(i).value;
            } else {
                alert("You should enter required fields");
                break;
                return false;
            }
        }
        //alert(JSON.stringify(obj));
        SendImages(obj, fields);
    });
}

function SendImages(obj, fields) {
    if (document.querySelector("form.file-form")) {
        let form = new FormData(document.querySelector("form.file-form"));
        $.ajax({
            method: "POST",
            url: "/add-images",
            data: form,
            cashe: false,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success(res) {
                //alert(1);
                alert(res);
                SendData(obj, fields, res);

                //SendData(obj)
                //alert(res);
            },
            error(err) {
                alert(err);
            }
        });
    } else {
        SendData(obj, fields);
    }
}

function SendData(obj, fields, pathes) {
    let correct_obj = {};
    alert(JSON.stringify(obj));
    alert(JSON.stringify(fields) + " are fields");
    for (let key in fields) {
        if (!obj.hasOwnProperty(key) && key === "images") {
            correct_obj[key] = pathes;
        } else {
            correct_obj[key] = obj[key];
        }
    }
    alert(JSON.stringify(correct_obj) + " is obj");
    //for(let key in fields)
    $.ajax({
        method: "POST",
        url: "/add-item",
        data: {
            info: JSON.stringify(correct_obj),
            category: localStorage.getItem("category")
        },
        success(res) {
            alert(res);
        },
        error(err) {
            alert(err);
        }
    });
}

function resetFields() {
    $("input[name='reset']").click((e) => {
        let inputs = document.querySelector("div.item-form > form").querySelectorAll("input[type='text']");
        for (let i = 0; i < inputs.length; i++) {
            inputs.item(i).value = "";
        }
    });
}