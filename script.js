
    //TO DO LIST
    let todo = [
        "push to github",
        "#consider project of progamin to do list to use inside porject"
    ]
    let to_do_string = ""
    let count_of_task = 1
    todo.forEach(task => {
        to_do_string += count_of_task + ". " + task + ".\n"
        count_of_task++
    });
    count_of_task = 1;

    // alert(to_do_string)


let search = document.getElementById("search")
let artist_link = document.createElement("a")

let images
let search_phrase
let page_number = 1 // current page number
let last_page = 2 //last page needed to block pagination
let visible_images //images currently shown in results
search.style.visibility = "visible"

$("#open-search").click( ToggleSearchBox)
$("#search-button").click( GetImages)
$("#search-close").click( ToggleSearchBox)
$("#search-text").change( () => {
    search_phrase = $("#search-text").val()
    GetImages()
})
$("#prev-page").click( () =>{
    if(page_number != 1){
        page_number--
        GetImages()
    }
})
$("#next-page").click( () =>{
    if (page_number <= last_page) {
        page_number++
        GetImages()
    }    
})
function ToggleSearchBox(){
    if (search.style.visibility === "hidden"){
        search.style.visibility = "visible"
    }else{
        search.style.visibility = "hidden"
    }
}
//show first or clicked image on the right
function PreviewImage(e, isFirst){
    if (isFirst != "first-img"){
        visible_images.forEach(img =>{
            if(e.target.id == img.id){
                artist_link.href = img.user.links.html
                artist_link.innerHTML = img.user.name
                $("#preview").css("backgroundImage", "url(" + img.urls.regular + ")")
                $("#search-background").css("background-image", "url(" + img.urls.regular + ")")
                
            }
        })
    }else{
        $("#preview-description").html("Visit artist page: ")
        artist_link.href = visible_images[0].user.links.html
        artist_link.innerHTML = visible_images[0].user.name
        $("#preview").css("backgroundImage", "url(" + visible_images[0].urls.regular + ")")
        $("#search-background").css("background-image", "url(" + visible_images[0].urls.regular + ")")
    }
    // $("#preview").css("backgroundImage", "url(" + img.urls.regular + ")")
    $("#preview-description").append(artist_link)
}

//get images from unsplash api 
function GetImages(initial){
    let url = "https://api.unsplash.com/photos?client_id="
    let client_id = "962e0d3d5b8b75303121a16a9e46fb17d4b9831880d45af2543a4dccdc32fcde"
    let per_page = 6
    
    if(initial){
        //if initial then do not search for any keywords and show recent photos
        ClearSearch();
        url += client_id + "&per_page=" + per_page
    }else{
        //else search for given keyword
        url = "https://api.unsplash.com/search/photos?client_id="
        url += client_id + "&page=" + page_number + "&per_page=" + per_page + "&query=" + search_phrase
    }
    $.get(url, (data) => {
        if(data.total > 0 || initial == true){                   
            last_page = data.total_pages
            if(!initial){
                data = data.results
            }
            ClearResults()  

            visible_images = data; 
            
            PreviewImage({ id: data[0].urls.regular, name: data[0].user.name  }, "first-img")
            
            data.forEach(image => {
                SmallPhoto(image.urls.small, image.user.name, image.id);
            })
        }else{
            NoImagesFound();
            GetImages(true);
        }
        if(initial == true)
            HidePagination()
        else
            ShowPagination();
    })
}
function SmallPhoto(small_url, small_name, id){

    //thumbnail photo for search results
    let newImage = document.createElement("div")
    // newImage.style.height = "45%"
    newImage.style.width = "42%"
    newImage.style.backgroundSize = "cover"
    newImage.style.backgroundImage = "url('" + small_url + "')"
    newImage.style.display = "flex"
    newImage.style.alignItems = "flex-end"
    newImage.style.cursor = "pointer"
    newImage.style.margin = "4% 4% 4% 4% "
    newImage.style.cursor = "pointer"
    newImage.id = id
    newImage.addEventListener("click", PreviewImage)

    //author name on top of the thumbnail
    let author = document.createElement("p")
    author.style.backgroundColor = "rgba(0,0,0, 0.6)"
    author.style.color = "white"
    author.style.width = "100%"
    author.style.textAlign = "center"
    author.style.fontSize = "14px"
    author.innerHTML = small_name

    $("#s-body").append(newImage)
    newImage.appendChild(author)
}

//remove all photos from results
function ClearResults(){
    $("#s-body").html("");   
}

//clear search and value of the input 
function ClearSearch(){
    search_phrase = "";
    $("#search-text").val("");
}

//show alert if there in no photos for this query
function NoImagesFound(){
    GetImages(true);
    alert("Sorry, no results for this search. \n Try another one");
}
function ShowPagination(){
    $("#next-page").css("visibility", "visible")
    $("#prev-page").css("visibility", "visible")
}
function HidePagination() {
    $("#next-page").css("visibility", "hidden")
    $("#prev-page").css("visibility", "hidden")
}
GetImages(true);