var sanitizeHtml = require('sanitize-html');

module.exports = {
    upperString: function (str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    },
    HTML: function (title, list, body, control, filter) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>WEB1 - ${sanitizeHtml(this.upperString(title))}</title>
            <meta charset="utf-8" />
            <link rel="icon" href="data:;base64,iVBORw0KGgo=">
            <style>
                table {
                    border-collapse: collapse;
                }
                table, th, td {
                    border: 1px solid black;
                }
        </style>
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            <h4><a href="/author">Author</a></h4>
            ${filter}
            ${list}
            <p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/MhrFDYQK-c8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </p>
            ${control}
            
            <h1>${sanitizeHtml(this.upperString(title))}</h1>
            ${body}
        </body>
        </html>
        `;
    },
    List: function (topics, filterId) {
        var list = '<ul>'
        topics.forEach(element => {
            if (element !== 'welcome') {
                var onTitle = sanitizeHtml(this.upperString(element.title));
                list = list + `<li><a href="/?id=${element.id}&sort=${filterId}">${onTitle}</a></li>`
            }
        });
        list = list + '</ul>';
        return list;
    },
    Filter: function (filters, id) {
        var list = `<select onchange="if(this.value) location.href=(this.value);">`;
        list = list + `<option value="">선택</option>`;
        if (id) {
            var filter_id = parseInt(id);
        }
        filters.forEach(element => {
            var selected = '';
            if (filter_id === element.id) {
                selected = ' selected';
            }
            list = list + `<option value="/sort?sort=${element.id}"${selected}>${sanitizeHtml(element.name)}</option>`;
        });
        list = list + `</select>`;
        return list;
    },
    authorSelect: function (authors, id) {
        var tag = '';
        // var i = 0;
        // while(i < authors.length) {
        //     tag = tag + `<option value="${authors[i].id}">${authors[i].name}</option>`;
        //     i++;
        // }
        if (id) {
            var author_id = parseInt(id);
        }
        authors.forEach(element => {
            var selected = '';
            if (author_id === element.id) {
                selected = ' selected';
            }
            tag = tag + `<option value="${element.id}"${selected}>${sanitizeHtml(element.name)}</option>`;
        });
        return `
            <select name="author">
                ${tag}
            </select>
        `;
    },
    authorTable: function (authors) {
        var tag = '';
        authors.forEach(element => {
            tag = tag + `
            <tr>
                <td>${sanitizeHtml(element.name)}</td>
                <td>${sanitizeHtml(element.profile)}</td>
                <td>
                    <a href="/author/update?id=${element.id}">Update</a> 
                </td>
                <td>
                    <form action="/author/delete_process" method="post">
                        <input type="hidden" name="id" value="${element.id}">
                        <input type="submit" value="Delete">
                    </form>
                </td>
            </tr>`;
        });
        return `
        <table>
            <tr>
                <th>Name</th>
                <th>Profile</th>
                <th>Update</th>
                <th>Delete</th>
            </tr>
            ${tag}
        </table>
        `;
    },
    authorForm: function (gbn, author) {
        if (gbn === 'create') {
            return `
            <h4>Create Author</h4>
            <form action="author/create_process" method="post">
                <p>
                    <input type="text" name="name" value="" placeholder="name">
                </p>
                
                <p>
                    <textarea name="profile" placeholder="profile"></textarea>
                </p>
                
                <p>
                    <input type="submit" value="Create">
                </p>
            </form>
            `;
        } else if (gbn === 'update') {
            var id = sanitizeHtml(author[0].id);
            var name = sanitizeHtml(author[0].name);
            var profile = sanitizeHtml(author[0].profile);

            return `
            <h4>Update Author</h4>
            <form action="update_process" method="post">
                <p>
                    <input type="hidden" name="id" value="${id}">
                </p>
                <p>
                    <input type="text" name="name" value="${name}" placeholder="name">
                </p>
                
                <p>
                    <textarea name="profile" placeholder="profile">${profile}</textarea>
                </p>
                
                <p>
                    <input type="submit" value="Update">
                </p>
            </form>
            `;
        }
    }
}