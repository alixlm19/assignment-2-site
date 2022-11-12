let labelInput = document.getElementById("labelInput");
let labelContainer = document.getElementById("labelContainer");
let photoContainer = document.getElementById("photo-container");
let photoMainContainer = document.getElementById("photo-main-container");
let noPhotoContainer = document.getElementById("no-photo-container");
let searchResults = document.getElementById("search-results");
let btnStart = document.getElementById("btnStart");
let btnStop = document.getElementById("btnStop");
let audio = document.getElementById("audio");
let labels = new Set();

var transcribeservice = new AWS.TranscribeService();

labelInput.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
        event.preventDefault();
        let label = labelInput.value;
        if (!labels.has(label.toLowerCase())) {
            labels.add(label.toLowerCase());
            labelContainer.innerHTML += `
            <div class="photo-label" style="border-color: rgba(0,0,0,0);background: #324561;color: var(--bs-modal-bg);border-radius: 25px;padding: 12px;padding-right: 12px;margin-right: auto;margin-left: 0px;"><span>${label}</span><button class="btn-close btn-close-white" style="margin-top: 0px;padding-top: 0px;" onclick="deleteListItem(this);"></button></div>
            `;
        }
    }
});

btnStart.addEventListener('click', async () => {
    if (btnStart.style.display !== "none"){
        let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
        let mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        let chunks = [];
        btnStart.style.display = "none";
        btnStop.style.display = "flex";
    
        mediaRecorder.ondataavailable = (e)=>{
            chunks.push(e.data);
            console.log("recording"); 
        }
        //function to catch error
        mediaRecorder.onerror = (e)=>{
            alert(e.error);
        }
    
        mediaRecorder.onstop = (e)=>{
            let blob = new Blob(chunks);
            
            


            btnStart.style.display = "flex";
            btnStop.style.display = "none";
            console.log("recording stopped");

        }
        
        btnStop.addEventListener('click',()=>{
            if(btnStop.style.display !== "none") {
                mediaRecorder.stop();
                mediaRecorder.stopStream()
            }
        })
    }
})


function displayContainers() {
    if(photoContainer.children.length == 0) {
        photoMainContainer.style.display = "none"
        noPhotoContainer.style.display = "block"
    } else {
        photoMainContainer.style.display = "block"
        noPhotoContainer.style.display = "none"
    }
}

document.addEventListener("load", function() {
    displayContainers();
});

function addImages(results, query) {
    deleteAllPhotos();
    for (let result of results) {
        url = result.url
        labels = result.labels
        
        const img = document.createElement("div");
        img.className = "col item"
        img.innerHTML = `
            <a href="${url}" data-caption="${labels.join('\t')}">
                <img class="img-fluid" src="${url}" />
            </a>
        `
        photoContainer.appendChild(img);
    }

    searchResults.innerText = `Search results for: ${query}`
    console.log(photoContainer.children)
    displayContainers();
    updateBaguette();
}

function deleteAllPhotos() {
    photoContainer.innerHTML = "";
    displayContainers();
}

function deleteListItem(elem) {
    let label = elem.previousSibling.innerText;
    labels.delete(label);
    elem.parentNode.remove();
}

function getLabels() {
    return Array.from(labels);
}

function deleteAllListItems() {
    labelContainer.outerHTML = `
    <div id="labelContainer" class="d-xl-flex justify-content-xl-start" style="margin-bottom: 0px;margin-top: 0px;display: block;width: 100%;height: auto;padding-bottom: 60px;position: static;padding-top: 20px;margin-right: 20px;margin-left: auto;"></div>
    `
    labelContainer = document.getElementById("labelContainer");
    labels = new Set();
}