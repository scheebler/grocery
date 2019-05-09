var command = [];
var total_price = 0;
var product_id = -1;
var prod_bill_id = 0;
var products = [];
var product_type =  [];
var isHover = false;
var interval;
var form = {
    fname : document.getElementById("fname"),
    lname : document.getElementById("lname"),
    address : document.getElementById("address"),
    email : document.getElementById("email"),
    phone : document.getElementById("phone"),
}
var to_search = document.getElementById("search");
var max_price = document.getElementById("search-price"); 
var width = 0;
var elem = document.getElementById("myBar");   



var current_slide = 0;

function currentDiv(n){
    width = 0;
    elem.style.width = width + '%'; 
    var slides = document.getElementsByClassName("mySlides");
    slides[current_slide].classList.remove("mySlidesShow");
    slides[n].classList.add("mySlidesShow");
    var circles = document.getElementsByClassName("circle");
    circles[current_slide].classList.remove("circleShow");
    circles[n].classList.add("circleShow");
    current_slide = n;
}

function skip_slide(n){
  var next_slide;
  var slides = document.getElementsByClassName("mySlides");
  if (!n){
      n = 1;
  }
    next_slide = current_slide + n;
    if (next_slide === -1){
        next_slide = slides.length - 1;
    }
    if (next_slide === slides.length){
        next_slide = 0;
    }

    width = 0;
    elem.style.width = width + '%';
    slides[current_slide].classList.remove("mySlidesShow");
    slides[next_slide].classList.add("mySlidesShow");
    var circles = document.getElementsByClassName("circle");
    circles[current_slide].classList.remove("circleShow");
    circles[next_slide].classList.add("circleShow");
    current_slide = next_slide;
    clearInterval(interval);
    showDivs();
}

function showDivs() {
    interval = setInterval(frame, 30);
    function frame() {
        if(!isHover){
            if (width >= 100) {
                skip_slide(1);
            } else {
                width++; 
                elem.style.width = width + '%'; 
            }
        }      
    } 
}

showDivs();

function set_command(name, price) {
    total_price += Number(price);
    var isProduct = 0;
    for(var index in command){
        if (command[index].name === name){   
            isProduct = 1;
            command[index].quantity += 1;
        }
    }
    if (!isProduct) {
        var new_prod = {
            "id": prod_bill_id,
            "name": name,
            "quantity": 1,
            "price": price
        }
        ++prod_bill_id;
        command.push(new_prod);
    }
    update_cart();
}

function submit_FORM(event) {
    event.preventDefault();
    if (total_price === 0){
        alert("Nu ati ales niciun produs")
        return;
    }
    var bill = "Comanda ta a fost procesata! Detalii mai jos: \n";
    bill += "Total de plata: " + total_price + " RON \n";
    for (var key in command) {
        bill += "   " + command[key].name + ": " + command[key].quantity + "\n";
    }
    
    bill += form.fname.value + " " + form.lname.value + "\n";
    bill += form.address.value + "\n";
    bill += form.email.value + "\n";
    bill += form.phone.value + "\n";
    document.getElementsByTagName("form")[0].reset();
    alert(bill);
    commad = [];
    total_price = 0;
    window.location.reload(false);
}

fetch('http://demo8450084.mockable.io/mygrocery/fruits')
    .then(response => {
        return response.json();
    })
  .then(function(response) {
      for(var fruit of Object.values(response)){
        ++product_id;
        products.push(fruit);
        product_type.push("fruit");
        document.getElementById("fruits").innerHTML += add_product(fruit);
        document.getElementById("fruits-modal").innerHTML +=  modal(fruit);

      }  
  });

  fetch('http://demo8450084.mockable.io/mygrocery/vegetables')
    .then(response => {
        return response.json();
    })
  .then(function(response) {
      for(var vegetable of Object.values(response)){
        ++product_id;
        products.push(vegetable);
        product_type.push("vegetable");
        document.getElementById("vegetables").innerHTML += add_product(vegetable);
        document.getElementById("vegetables-modal").innerHTML += modal(vegetable);

      }  
  });

function update_cart(){
    document.getElementById("price").innerHTML = Number(total_price);
    document.getElementById("demanded").innerHTML = " ";
    for (var key in command) {
        document.getElementById('demanded').innerHTML +=
         add_product_to_bill(command[key].name, command[key].quantity, command[key].price, command[key].id);
    }
}

function inc_product(key) {
    console.log(command);
    console.log(key);
    total_price += Number(command[key].price);
    command[key].quantity += 1;
    update_cart();
}

function dec_product(key) {
    total_price -= Number(command[key].price);
    command[key].quantity -= 1;
    if (!command[key].quantity){
        delete command[key];
    }
    update_cart();
}

function remove_product(key) {
    total_price -= command[key].price * command[key].quantity;
    delete command[key];
    update_cart();
}

function add_product_to_bill(name, quantity, price, id){
    return `<div data-id="${id}">
        ${name}   ${quantity}  kg x   ${price}
        <br />
        <span>
            <div id="inc">
                <button>+</button>
            </div>
            <div id="dec">
                <button>-</button>
            </div>
            <div id="rem">
                <button>x</button>
            </div>
        </span>
    </div>`
}

function add_product(product){
    id = get_product_id_by_name(product.name);
    return `<div class="produs col-25">
    <div class="highlight">
        <h4 class="nume">${product.name}</h4>
        <h5 class="pret">${product.price} RON/kg</h5>
        <a href="#${id}" rel="modal:open">More</a>
    </div>
    <img src="${product.img}" alt="${product.name}" />
    <button data-id="${id}">Adauga in cos</button>
    </div>`
}

function modal(product){
    id = get_product_id_by_name(product.name);
    return `<div class="modal" id="${id}">
    <h4 class="nume">${product.name}</h4>
    <h5 class="pret">${product.price} RON/kg</h5>
    <img src="${product.img}" alt="${product.name}" />
    <button data-id="${id}">Adauga in cos</button>
    </div>`
}


function get_parent_crud()
{
    return $(this).parents("[data-id]").data("id");
}

function get_current_product()
{
    return products[$(this).data("id")];
}

function get_product_id_by_name(name){
    for (var index = 0; index < products.length; ++index){
        if (products[index].name === name){
            return index;
        }
    }
}

function search(event) {
    // TO DO refactor witch filer/reducer
    check_legume = document.getElementById("check-legume").checked;
    check_fructe = document.getElementById("check-fructe").checked;
    event.preventDefault();
    console.log(to_search.value);
    document.getElementById("vegetables").innerHTML = "";
    document.getElementById("fruits").innerHTML = "";
    for (var index = 0; index < products.length; ++index){
        if (products[index].name.toLowerCase().includes(to_search.value.toLowerCase())){
            if(products[index].price <= max_price.value){
                if(check_legume === true){
                    if (product_type[index] === "vegetable"){
                        document.getElementById("vegetables").innerHTML += add_product(products[index]);
                    }
                }
                if(check_fructe === true){
                    if (product_type[index] === "fruit"){
                        document.getElementById("fruits").innerHTML += add_product(products[index]);
                    }
                }
            }
        }
    }
}

function change_price(){
    document.getElementById('maximum-price').innerHTML = "Maximum price: " + max_price.value + " RON";
}

document.addEventListener("DOMContentLoaded", function(event){
    document.getElementById('cum-comand').onsubmit = submit_FORM;
    document.getElementById('search-container').oninput = search;
    document.getElementById('choose-prod').oninput = search;
    $("#legume").on("click", "[data-id]", function(){
        var prod = get_current_product.call(this);
        set_command(prod.name, prod.price);
    });
    $("#fructe").on("click", "[data-id]", function(){
        var prod = get_current_product.call(this);
        set_command(prod.name, prod.price);
    });
    $("#demanded").on("click", "#inc", function(){
        inc_product(get_parent_crud.call(this));
    });
    $("#demanded").on("click", "#dec", function(){
        dec_product(get_parent_crud.call(this));
    });
    $("#demanded").on("click", "#rem", function(){
        remove_product(get_parent_crud.call(this));
    });
    $("#slider").on("click", "#slide-left", function(){
        skip_slide(-1);
    });
    $("#slider").on("click", "#slide-right", function(){
        skip_slide(1);
    });
    $( "#slider" ).hover(function() {
       isHover = true;
    }, function () {
        isHover = false;
    });
    $("#price-range").on("input", "#search-price", function(e){
        change_price();
        search(e);
    });
    $("#vegetables-modal").on("click", "[data-id]", function(){
        console.log("aici");
        var prod = get_current_product.call(this);
        set_command(prod.name, prod.price);
    });
});