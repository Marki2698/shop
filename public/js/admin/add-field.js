$(document).ready(() => {
    $("input[name='add-field']").click(() => {
        ShowHideParametersMenu();
    });

    $("input[name='create-field']").click(() => {
        AddField();
        ShowHideParametersMenu();
    });

    $("p.close-parameters > span").click(() => {
        ShowHideParametersMenu();
    });

    $("input[name='create-category']").click(() => {
        //alert(2);
        BuildSchema();
    });
});

function ShowHideParametersMenu() {
    $("div.parameters").toggleClass("hidden-parameters");
    $("input[name='field-name']").val("");
}

function AddField() {
    let _name = $("input[name='field-name']").val();
    if (_name === "") {
        alert("Please fill this field");
        return false;
    }
    let _type = $("input[type='radio']:checked").val();
    let _params = [];
    //let str_params;
    let checkbox = $("input[type=checkbox]:checked");
    for (let i = 0; i < checkbox.length; i++) {
        _params.push($(checkbox[i]).val());
    }
    CreateField(_name, _type, _params);
}

function CreateField(name, type, params) {
    //alert(name, type, params);
    let container = $(document.createElement("div")).addClass("field");
    let _name = $(document.createElement("p")).addClass("name");
    let _type = $(document.createElement("p")).addClass("type");
    let span_type = $(document.createElement("span")).text(type);
    let _params = $(document.createElement("p")).addClass("params");
    let span_params = $(document.createElement("span")).text(params.join(','));
    $(_name).text(name);
    $(_type).text("type: ");
    $(_type).append(span_type);
    $(_params).text("params: ");
    $(_params).append(span_params);
    $(container).append(_name, _type, _params);
    $("div.schema").append(container);
}

function BuildParams(field) {
    let params = {};
    if (field.querySelector(".type")) {
        params["type"] = field.querySelector(".type > span").innerHTML;
    }
    if (field.querySelector(".params > span") && field.querySelector(".params > span").innerHTML !== "") {
        let list = field.querySelector(".params > span").innerHTML.split(",");
        for (let i = 0; i < list.length; i++) {
            params[list[i]] = true;
        }
    }
    return params;
}

function BuildSchema() {
    let category = {};
    let fields = document.querySelectorAll(".field");
    for (let i = 0; i < fields.length; i++) {
        category[fields.item(i).querySelector(".name").innerHTML] = BuildParams(fields.item(i));
    }
    //alert(JSON.stringify(schema));
    SendSchema(category);
}

function SendSchema(category) {
    let name = $("input[name='category-name']").val();
    if (name === "") {
        alert("Please enter the name of category");
        return false;
    }
    alert(JSON.stringify(category));
    //return false;
    $.ajax({
        method: "POST",
        url: "/create-category",
        data: {
            name: name
        },
        success(res) {
            alert(res);
            // code;
        },
        errorr(err) {
            // code;
            alert(err);
        }
    });
}