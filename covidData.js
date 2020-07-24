var input = document.querySelector('input');
var preview = document.querySelector('.preview');

input.style.opacity = 0;

const fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
];

function validFileType(file) {
    return fileTypes.includes(file.type);
}

function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number >= 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number >= 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
    }
}

function updateImageDisplay() {
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    const curFiles = input.files;
    if (curFiles.length === 0) {
        const para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        const list = document.createElement('ol');
        preview.appendChild(list);

        for (const file of curFiles) {
            const listItem = document.createElement('li');
            const para = document.createElement('p');
            if (validFileType(file)) {
                para.textContent = `File name ${file.name}, file size ${returnFileSize(file.size)}.`;
                const image = document.createElement('img');
                image.src = URL.createObjectURL(file);

                listItem.appendChild(image);
                listItem.appendChild(para);
            } else {
                para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
                listItem.appendChild(para);
            }

            list.appendChild(listItem);
        }
    }
}

input.addEventListener('change', updateImageDisplay);




const images = document.querySelector('#images');

const checkBtn = document.querySelector('#checkBtn');

// console.log(images);
// console.log(images.files[0]);

// checkBtn.addEventListener('click', checkFile);

// images.addEventListener('click', checkImageFile);

function checkImageFile(obj) {
    console.log(this);
    obj = this
    console.log(obj);
    var fileList = this.files;
    for (var file of fileList) {
        // console.log(file.size);
        // console.log(file.name);
    }

}

function checkFileList(event) {
    var files = event.files;

    var formData = new FormData();

    // Array.from(files).forEach(file => {
    //     formData.append("uploadFile", file);
    // })
    for (var i = 0; i < files.length; i++) {
        formData.append('uploadFiles', files[i]);
    }

    for (var key of formData.keys()) {

        console.log(key);

    }

    for (var value of formData.values()) {

        console.log(value);

    }

}

function addFile() {
    var inputFile = document.createElement('INPUT');
    inputFile.type = "file";
    inputFile.name = "uploadFiles";
    inputFile.className = "uploadFiles";
    inputFile.accept = ".pptx, .ppt, .pdf, application/pdf, application/vnd.ms-powerpoint";

    document.querySelector('#inputFiles').appendChild(inputFile);

    var list = document.querySelectorAll('.uploadFiles');

    for (var i = 0; i < list.length; i++) {
        list[i].id = `uploadFiles_${i + 1}`;
    };
    for (var i = 0; i < list.length; i++) {
        if (i == list.length - 1) {
            var deleteBtn = document.createElement('INPUT');
            deleteBtn.type = 'button';
            deleteBtn.id = `deleteBtn_${i + 1}`;
            deleteBtn.value = 'X';
            deleteBtn.onclick = function () {
                var file = document.querySelector(`#uploadFiles_${i}`);
                file.remove();
                var delBtn = document.querySelector(`#deleteBtn_${i}`);
                delBtn.remove();
            }
            document.querySelector('#inputFiles').appendChild(deleteBtn);
        }
    }
    inputFile.click();

}

result = [{
    name: "kim"
}, {
    name: "min"
}, {
    name: "so"
}];

// result.forEach(category => {
//     console.log(category);
// })

var list = {
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5"
}
console.log(list.four);
var sale_dept_code = "";

Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
        return size;
    }
}
var listSize2 = Object.keys(list).length;
var listSize = Object.size(list);

console.log(listSize2);
console.log(listSize);



var frag = document.createDocumentFragment();

var div = document.createElement("div");


div.textContent = "DIV";


for (var i = 0; i < 10; i++) {
    var span = document.createElement("span");
    span.textContent = "SPAN";
    flag.appendChild(span);
}




var newDiv = document.querySelector("#newDiv");

newDiv.appendChild(div);


var parent = document.querySelector('#timeTotr');

for (var i = 0; i < 3; i++) {
    var tr = document.createElement("tr");
    tr.id = `tr_${i}`;
    // for(var element in list) {
    //     var td = document.createElement("td");
    //     td.id = `td_${list[element]}`;
    //     td.textContent = `tdNo_${element}`;
    //     tr.appendChild(td);
    // // }
    // var td = document.createElement("td");
    // td.textContent = `tdNo_${element}`;

    // tr.appendChild(td);
    // parent.appendChild(tr);
}

function goMediumCategory(obj) {
    var param = {
        "up_category_code": obj.value
    };
    $M.goNextPageAjax('/web/common/mediumCategory', $M.toGetParam(param), '',
        function (result) {
            makeMediumCategory(result);
        }
    )
}

function makeMediumCategory(result) {
    var selectDom = document.querySelector('#medium_category');
    selectDom.options.length = 0;
    var frag = document.createDocumentFragment();
    var option = document.createElement('option');
    option.text = "- 선택 -";
    option.value = "";
    selectDom.appendChild(option);
    result.forEach(category => {
        var option = document.createElement('option');
        option.text = category.category_name;
        option.value = category.category_value;
        frag.appendChild(option);
    })
    selectDom.appendChild(frag);
}