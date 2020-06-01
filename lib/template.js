{
    /* <p>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/MhrFDYQK-c8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </p>  */
}

module.exports = {
    upperString: function (str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    },
    HTML: function (title, list, body, control) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>WEB1 - ${this.upperString(title)}</title>
            <meta charset="utf-8" />
            <link rel="icon" href="data:;base64,iVBORw0KGgo=">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            <h4><a href="/author">Author</a></h4>
            ${list}
            ${control}
            
            <h1>${this.upperString(title)}</h1>
            ${body}
        </body>
        </html>
        `;
    },
    List: function (topics) {
        var list = '<ul>'
        topics.forEach(element => {
            if (element !== 'welcome') {
                var onTitle = this.upperString(element.title);
                list = list + `<li><a href="/?id=${element.id}">${onTitle}</a></li>`
            }
        });
        list = list + '</ul>';
        return list;
    },
    authorSelect: function (authors, id) {
        var tag = '';
        // var i = 0;
        // while(i < authors.length) {
        //     tag = tag + `<option value="${authors[i].id}">${authors[i].name}</option>`;
        //     i++;
        // }
        var author_id = parseInt(id);
        authors.forEach(element => {
            var selected = '';
            if (author_id === element.id) {
                selected = ' selected';
            }
            tag = tag + `<option value="${element.id}"${selected}>${element.name}</option>`;
        });
        return `
            <select name="author">
                ${tag}
            </select>
        `;
    },
    authorHTML: function (title, list, body, create) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
            table, th, td {
                border: 1px solid black;
            }
        </style>
            <title>WEB1 - ${this.upperString(title)}</title>
            <meta charset="utf-8" />
            <link rel="icon" href="data:;base64,iVBORw0KGgo=">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            <p><a href="/author">Author</a></p>
            ${list}

            <h1>${this.upperString(title)}</h1>
            ${body}
            ${create}
        </body>
        </html>
        `;
    },
    authorTable: function (authors) {
        var tag = '';
        authors.forEach(element => {
            tag = tag + `
            <tr>
                <td>${element.name}</td>
                <td>${element.profile}</td>
                <td>
                    <a href="/author/update?id=${element.id}">Update</a> 
                </td>
                <td>
                    <form action="delete_process" method="post">
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
    authorForm: function (gbn, post) {
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
            var id = post[0].id;
            var name = post[0].name;
            var profile = post[0].profile;

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