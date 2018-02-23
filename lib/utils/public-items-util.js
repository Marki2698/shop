function FilledArray(val) {
    return val.length > 0;
}

function FormatDocs(docs, category) {
    let formatted_docs = [];
    for(let i = 0; i < docs.length; i++) {
        formatted_docs.push(Object.assign({}, {
            category: category,
            id: docs[i].id,
            name: docs[i].name,
            src: !docs[i].images ? "/images/no_photo.png" : docs[i].images[0]
        }));
    }

    return formatted_docs;
}

exports.FilledArray = FilledArray;
exports.FormatDocs = FormatDocs;