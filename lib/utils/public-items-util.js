function FilledArray(val) {
    return val.length > 0;
}

function FormatDocs(docs) {
    let formatted_docs = [];
    for(let i = 0; i < docs.length; i++) {
        let img;
        if(docs[i].images.length === 0) {
            img = "/images/no_photo.png";
        } else {
            img = docs[i].images[0];
        }
        let obj = {
            category: docs[i].category,
            id: docs[i].id,
            name: docs[i].name,
            src: img
        }
        formatted_docs.push(obj);
    }
    return formatted_docs
}

function FormatArray(arrs) {
    let formatted = [];
    for(let sub_arr of arrs) {
        formatted.push(...sub_arr);
    }
    return formatted;
}

exports.FilledArray = FilledArray;
exports.FormatDocs = FormatDocs;
exports.FormatArray = FormatArray;