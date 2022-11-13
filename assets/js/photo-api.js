let searchInput = document.getElementById("search-input");
let apiClient = apigClientFactory.newClient({
    "apiKey" : "ta5mXXq5iK4ufGKGD0uKs5TG1BdjvIyR8FzH51Jp"
});
let reader = new FileReader();
let enc_file;

reader.addEventListener("load", () => {
    // convert image file to base64 string
    putImage(reader.result, reader.name, reader.filetype);
  }, false);

searchInput.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
        event.preventDefault();
        getImages();
    }
})

// Invokes the /search get method from api gateway
function getImages() {
    const query = searchInput.value;
    if(query.length == 0) {
        return {}
    }

    // Request parameters
    params = {
        "q" : query
    };

    body = {}

    additionalParams = {
        "headers" : {
            "Content-Type" : "application/json"
        }
    }
    
    // Reset the photo search bar
    response = apiClient.searchGet(params, {})
        .then(function(result) {
            searchInput.value = "";
            console.log("success");
            console.log(result);
            addImages(result.data.results, query);
        }).catch(function(result){
            console.log("failure")
            console.log(result)
        });
}

function putImages() {
    // Get list of images
    const fileInput = document.getElementById("files");
    const files = fileInput.files;


    // Get list of labels
    customLabels = getLabels();

    for(let file of files) {
        reader.name = file.name
        reader.filetype = file.type
        reader.readAsDataURL(file);
        
    }

}

function putImage(body, filename, filetype) {


        params = {
            "folder" : "assignment2.b2",
            "object" : Date.now() + filename,
            "x-amz-meta-customLabels" : customLabels.join(', '),
            "Accept" : filetype,
            "Content-Type" : filetype
        };

        body = body.replace(/^data:image.+;base64,/, '');
        // body = window.atob(body)
        customLabels = getLabels();

        additionalParams = {
            "headers": {
            }
        };

        console.log(additionalParams)
        response = apiClient.uploadFolderObjectPut(params, body, additionalParams)
            .then(function(result) {
                console.log("image uploaded successfully");
                
                // Delete all label pills
                deleteAllListItems();

                console.log(result);
                
            }).catch(function(result){
                console.log("failure");
                console.error(result);
            });
        console.log(params, body, additionalParams);
}