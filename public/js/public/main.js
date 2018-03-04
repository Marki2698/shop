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
            DownloadNew();
            DownloadHot();
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
    if(Array.isArray(categories)) {
        for (let category of categories) {
            let a = document.createElement("a");
            a.href = `/${category}`;
            a.innerHTML = category;
            list.appendChild(a);
        }
    } else {
        let p = document.createElement("p");
        p.innerHTML = categories;
        list.appendChild(p);
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

function getCategoryList() {
    let categories = document.querySelectorAll("div.list a");
    let names  = [];
    for(let item of categories) {
        names.push(item.innerHTML);
    }
    return names;
}

function DownloadHot() {
    //alert(names);
    $.ajax({
        method: "GET",
        url: "/get-hot",
        data: {
            names: getCategoryList()
        },
        success(res) {
            console.log(res + " = hot");
            if(typeof res === "string") EmptyCarousel("HotProducts", res);
            else BuildCarousel(res, "HotProducts");
        },
        error(err) {
            console.error(err);
        }
    });
}

function DownloadNew() {
    $.ajax({
        method: "GET",
        url: "/get-new",
        data: {
            names: getCategoryList()
        },
        success(res) {
            console.log(res + " = new");
            if(typeof res === "string") EmptyCarousel("NewProducts", res);
            else BuildCarousel(res, "NewProducts");
        },
        error(err) {
            console.error(err);
        }
    });
}

function EmptyCarousel(id, msg) {
    $(`#${id}`).empty();
    let p = document.createElement("p");
    p.className = "message";
    p.innerHTML = msg;
    $(`#${id}`).append(p);
}


function BuildCarousel(arr, id) { // arr = [{}]
    for(let i = 0; i < arr.length; i++) {
        console.log(i);
        //console.log(`#${id} > .carousel-indicators`);
        let indicator_parent = document.querySelector(`#${id} > .carousel-indicators`);
        let indicator = document.createElement("li");
        indicator.setAttribute("data-target", `#${id}`);

        let image_parent = document.querySelector(`#${id} > .carousel-inner`);
        let image_container = document.createElement("div");
        image_container.className = "carousel-item";
        let img = document.createElement("img");
        img.classList = "d-block w-100";

        let anchor_container = document.createElement("div");
        anchor_container.classList = "carousel-caption d-md-block";
        let anchor = document.createElement("a");
        
        if(i === 0) {
            indicator.className = "active";
            image_container.classList.add("active");    
        }        
        indicator.setAttribute("data-slide-to", i.toString(10));
        indicator_parent.appendChild(indicator);
        img.alt = arr[i].name;
        img.src = arr[i].src;
        anchor.href = `/${arr[i].category}/${arr[i].id}`;
        anchor.innerHTML = arr[i].name;
        image_container.appendChild(img);
        anchor_container.appendChild(anchor);
        image_container.appendChild(anchor_container);
        image_parent.appendChild(image_container);
    }
};