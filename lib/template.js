module.exports = {
    upperString: function(str) {
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
            ${list}
            ${control}
            <p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/MhrFDYQK-c8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </p> 
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
    }
}