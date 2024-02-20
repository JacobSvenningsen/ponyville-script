// ==UserScript==
// @name        PastePonyville
// @namespace   ponyville-script
// @grant       none
// @version     1.0
// @author      Hu
// @description Allow pasting images to ponyville quickreply
// @include       https://ponyville.us/*
// @updateURL     https://github.com/JacobSvenningsen/ponyville-script/raw/main/script.user.js
// @downloadURL   https://github.com/JacobSvenningsen/ponyville-script/raw/main/script.user.js
// ==/UserScript==


let qr = document.getElementById("quick-reply");

if (qr)
{
  let commentField = document.getElementById("body");
  let browseInputElement = qr.getElementsByTagName("input").file;
  let browseRow = browseInputElement.parentElement.parentElement;
  commentField.onpaste = async function (event)
  {
    // use event.originalEvent.clipboard for newer chrome versions
    var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
    // find pasted image among pasted items
    var imageAsBase64 = null;
    var blob = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
        imageAsBase64 = await GetBase64FromBlob(blob);
        break;
      }
    }
    // load image if there is a pasted image
    if (imageAsBase64 !== null) {
      AppendImageElement(imageAsBase64, browseRow);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(blob);
      browseInputElement.files = dataTransfer.files;
    }
  }
}

function GetBase64FromBlob(blob)
{
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function AppendImageElement(imageAsBase64, sipling)
{
  let imageElement = document.getElementById("qr-image-preview-element");
  if (imageElement)
  {
    imageElement.src = imageAsBase64;
  }
  else
  {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.colSpan = 2;
    td.classList.add("image-preview");
    let img = document.createElement("img");
    img.src = imageAsBase64;
    img.id = "qr-image-preview-element";
    td.append(img);
    tr.append(td);
    sipling.after(tr);
  }
}
