
// Post A Book Function
function PostABook(adPlacePopup, adPlaceButton, method="POST", url="/catalog-api/createabook") {
    adPlaceButton.disabled = true;
    adPlacePopup.querySelector('img').src = "https://cdn.jsdelivr.net/gh/kitappcompany/kitappstatic@latest/myicons/comment.svg"
    adPlacePopup.querySelector('.ad-place-popup-header').innerHTML = "Elanınız yayınlanır ..."
    adPlacePopup.style.display = "block";

    let csrf = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    let user_token = document.querySelector("#user_token").value;

    let sellbook = document.querySelector("#sell-book");
    let inputs = sellbook.querySelectorAll("input");
    let summary = sellbook.querySelector('textarea');

    var name = ['title', 'author.full_name', 'genre.name', 'condition', 'price','language.name', 'image', 'image', 'image', 'locations'];
    const data = new FormData();

    let images_place =  []
    for (var i = 0; i < inputs.length; i++) {
        if (name.length <= i) name.push("locations"); // add location, last elements are location
        if (name[i]==='price' && radioBtnOnclick) {data.append(name[i], 0); continue}

        if (name[i]==='locations') {
            try{
                inputs[i].style.borderColor = "";
                add_style('::placeholder { color: rgb(245, 76, 110); }');
                listElement = inputs[i].parentElement.querySelector('.selected').children[0].children[0];

                let city_name = ""
                city_name = listElement.dataset.city.split(',');
                city_name = city_name[city_name.length-1]

                let loc_data = {"title":listElement.dataset.title,"pk":listElement.dataset.key, "position":listElement.dataset.position, "city":city_name} ;
                data.append(name[i], JSON.stringify(loc_data) );
                continue;
            }catch(e){
                    adPlaceButton.disabled = false;
                     if (method==="POST") {
                        adPlacePopup.querySelector('img').src = "https://cdn.jsdelivr.net/gh/kitappcompany/kitappstatic@latest/img/404.svg";
                        adPlacePopup.querySelector('.ad-place-popup-header').innerHTML = "Error"
                        inputs[i].style.borderColor = "red";
                        inputs[i].value="";
                        return;
                     } else if (method==="PATCH"  & inputs[i].value.length != 0) {  data.append(name[i], JSON.stringify({"title":inputs[i].value}) );  continue; }
                      else {continue; }
            }
        }

        if (name[i]!="image") data.append(name[i], inputs[i].value);
        else{
            if(inputs[i].files[0]!=undefined){
                data.append(name[i]+"_"+i, inputs[i].files[0]);
                if (method==="PATCH") {//it means, wanted to update image at this place
                    images_place.push(inputs[i].dataset.nth);
                }
            }
        }
    }
    data.append("nth", images_place)
    data.append("summary", summary.value);

    // MAKING REQUEST
    const request = new XMLHttpRequest();
    request.open(method, url);
    request.setRequestHeader("Authorization", "Token " + user_token)
    request.setRequestHeader("X-CSRFToken", csrf)

    request.onload = ()=>{
        adPlaceButton.disabled = false;
        if (request.status === 201 || request.status === 200) {
            let info = "Elanınız yayınlandı";
            if (method==="PATCH") {
                info = "Məlumatlar uğurla dəyişdirildi."
            }
            adPlacePopup.querySelector('img').src = "https://cdn.jsdelivr.net/gh/kitappcompany/kitappstatic@latest/icons/undraw_done_a34v.svg";
            adPlacePopup.querySelector('.ad-place-popup-header').innerHTML = info

            // after 3 sec take user to home page
            setInterval(function(){ window.location.href = '/' },1800)

        }
        else {
            adPlacePopup.querySelector('img').src = "https://cdn.jsdelivr.net/gh/kitappcompany/kitappstatic@latest/icons/404.svg";
            adPlacePopup.querySelector('.ad-place-popup-header').innerHTML = "Error"
            let error_az = {
                "title":"Kitabın adını daxil edin",
                "condition":" Kitabın Yeni və Köhnə olduğunu daxil edin ",
                "author":"Kitabın Müəllifinin adını daxil edin",
                "summary":"Kitab haqqında məlumat daxil edin",
                "price":"Yalnız ədəd daxil edin",
                "genre":"Kitabın janrını daxil edin",
                "image":"Kitabın ən azı bir şəkilini daxil edin",
                "locations":"Ən azı bir uyğun* çatdırılma yeri daxil edin"
            }

            // show to user what is wrong
            let arr = ['title', 'author', 'genre', 'condition', 'price', 'image','image', 'image', 'locations'];
            const res = JSON.parse(request.responseText);

            add_style('::placeholder { color: rgb(245, 76, 110); }');

            for (let i=0; i<arr.length; i++){

                if (res[arr[i]]!=undefined){
                    if(inputs[i].type != "file") {inputs[i].value = "";inputs[i].placeholder = error_az[arr[i]]; inputs[i].style = "border: 0.1rem solid rgb(245, 76, 110);";}
                }else{
                    if(inputs[i].type != "file") { inputs[i].style = "";inputs[i].placeholder = ""; }
                }

                if (res["summary"]!=undefined){
                    summary.style = "border: 0.1rem solid rgb(245, 76, 110);";
                    summary.placeholder = error_az["summary"]
                }else{
                    summary.style = "";
                    summary.placeholder = ""
                }
            }
            // end of for loop
        }//end of else

    }//end of onload

    request.send(data)
}

// add style to document
function add_style(argument, idName) {

        if (document.querySelector('#'+idName) != null) {
            document.querySelector('#'+idName).remove();
        }
        let css = argument,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        style.id = idName;
        if (style.styleSheet){
          // This is required for IE8 and below.
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
}


// UPLOAD PRO

function PostABookPro(images_data, adPlacePopup, adPlaceButton, method="POST", url="/catalog-api/createabook") {
    // FOR USER EXPERIENCE
    adPlaceButton.disabled = true;
    adPlacePopup.querySelector('img').src = "https://cdn.jsdelivr.net/gh/kitappcompany/kitappstatic@latest/myicons/comment.svg"
    adPlacePopup.querySelector('.ad-place-popup-header').innerHTML = "Elanınız yayınlanır ..."
    adPlacePopup.style.display = "block";

    // if no images uploaded
    if (!images_data) {
        adPlacePopup.querySelector('img').src = "https://cdn.jsdelivr.net/gh/kitappcompany/kitappstatic@latest/img/404.svg";
        adPlacePopup.querySelector('.ad-place-popup-header').innerHTML = "Error"
        // Sekil yuklenmedi
        return
    }

    // DATA FOR REQUEST
    let csrf = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    let user_token = document.querySelector("#user_token").value;

    let title = document.getElementsByName("sell_title")[0].value;
    let author = document.getElementsByName("sell_author")[0].value;
    let genre = document.getElementsByName("sell_genre")[0].value;
    let price = document.getElementsByName("sell_price")[0].value;
    let condition = document.getElementsByName("sell_condition")[0].value;
    let summary = document.getElementsByName("sell_summary")[0].value;
    let language = document.getElementsByName("sell_language")[0].value;

    let pictures = document.getElementsByName("sell_pictures");
    let locations = document.getElementsByName("sell_locations");

    // Get locations as JSON for request
    let locations_data = make_location(locations, adPlacePopup);
    if (!locations_data) return;

    // data to request
    let datam = {
        "title": title, "condition": condition,
        "author": { "full_name": author },
        "summary": "sd", "price": 1,
        "genre": { "name": genre },
        "language": { "name": language, "short_name": language},
        "locations": locations_data,
        "img": images_data
        }

    console.log(datam);

    // REQUEST STAFF
    const request = new XMLHttpRequest();
    request.open(method, url);
    request.setRequestHeader("Authorization", "Token " + user_token)
    request.setRequestHeader("X-CSRFToken", csrf)

    request.onload = ()=>{
        console.log(request.responseText,"RESPONSE")
    }
    request.send(JSON.stringify(datam));
}

function make_location(locations, adPlacePopup) {
    // body...
        locations_data = [];
        try{

                for (var i = 0; i < locations.length; i++) {
                    location = locations[i];

                    location.style.borderColor = "";
                    add_style('::placeholder { color: rgb(245, 76, 110); }');
                    let listElement = location.parentElement.querySelector('.selected').children[0].children[0];

                    let position = listElement.dataset.position.split(",");

                    let loc_data = {
                        "locations.name":listElement.dataset.title,
                        "locations.displayLocation":{"Latitude":position[0], "Longitude":position[1]},
                        "lat":1, "lng":2
                    } ;

                    loc_data_pro = JSON.stringify(loc_data)
                    loc_data['data'] = loc_data_pro

                    if (!location) {locations_data=false; break;};
                    locations_data.push(location)
                }

                return locations_data

            }catch(e){
                adPlacePopup.querySelector('img').src = "https://cdn.jsdelivr.net/gh/kitappcompany/kitappstatic@latest/img/404.svg";
                adPlacePopup.querySelector('.ad-place-popup-header').innerHTML = "Error"
                location.style.borderColor = "red";
                location.value="";
                return false;
            }

}

function upload_image( adPlacePopup, adPlaceButton, method="POST", url="/catalog-api/createabook"){
    // Show user that uploading
    // FOR USER EXPERIENCE
    adPlaceButton.disabled = true;
    adPlacePopup.querySelector('img').src = "https://cdn.jsdelivr.net/gh/kitappcompany/kitappstatic@latest/myicons/comment.svg"
    adPlacePopup.querySelector('.ad-place-popup-header').innerHTML = "Elanınız yayınlanır ..."
    adPlacePopup.style.display = "block";

    let images = document.getElementsByName("sell_pictures");

    // UPLOAD STAFF
    let images_data = []
    for (var i = 0; i < images.length; i++) {
          var files = images[i].files;
          if (!files.length) {
            continue ;
          }
          var file = files[0];
          var fileName = file.name;
          var albumPhotosKey = encodeURIComponent(albumBucketName) + "/";

          var photoKey = albumPhotosKey + fileName;
          // Use S3 ManagedUpload class as it supports multipart uploads
          var upload = new AWS.S3.ManagedUpload({
            params: {
              Bucket: albumBucketName,
              Key: photoKey,
              Body: file,
              ACL: "public-read"
            }
          });

          var promise = upload.promise();

          promise.then(
            function(data) {
                console.log(photoKey)
                console.log(data)
                images_data.push({"img":photoKey, "opt_img":photoKey})

                if (i === images.length -1) {
                    PostABookPro(images_data, adPlacePopup, adPlaceButton, method, url);
                    // dont go to end
                }
            },
            function(err) {
              PostABookPro(false, adPlacePopup, adPlaceButton, method, url);
            }
          );

    }

    return images_data;
}