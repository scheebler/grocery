var command = [];
var total_price = 0;
var product_id = 0;
function set_command(product, price) {
    total_price += price;
    var ok = 0;
    for(var index in command){
        if (command[index].name === product){   
            ok = 1;
            command[index].quantity += 1;
        }
    }
    if (ok == 0) {
        var new_prod = {
            "id": product_id,
            "name": product,
            "quantity": 1,
            "price": price
        }
        ++product_id;
        command.push(new_prod);
    }
    update_cart();
}

fname = document.getElementById("fname");
lname = document.getElementById("lname");
address = document.getElementById("address");
email = document.getElementById("email");
phone = document.getElementById("phone");

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
    
    bill += fname.value + " " + lname.value + "\n";
    bill += address.value + "\n";
    bill += email.value + "\n";
    bill += phone.value + "\n";
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
      console.log(response);
      for(var fruit of Object.values(response)){
        document.getElementById("fruits").innerHTML += add_product(fruit);
      }  
  });

  fetch('http://demo8450084.mockable.io/mygrocery/vegetables')
    .then(response => {
        return response.json();
    })
  .then(function(response) {
      console.log(response);
      for(var vegetable of Object.values(response)){
        document.getElementById("vegetables").innerHTML += add_product(vegetable);
      }  
  });

function update_cart(){
    document.getElementById("price").innerHTML = Math.round(total_price * 100) / 100;
    document.getElementById("demanded").innerHTML = " ";
    for (var key in command) {
        document.getElementById('demanded').innerHTML +=
         add_product_to_bill(command[key].name, command[key].quantity, command[key].price, command[key].id);
    }
}

function inc_product(key) {
    total_price += command[key].price;
    command[key].quantity += 1;
    update_cart();
}

function dec_product(key) {
    total_price -= command[key].price;
    command[key].quantity -= 1;
    if (command[key].quantity == 0){
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
        ${name} ${quantity} ${price}
        <br />
        <button id="inc" onclick="inc_product(${id})">+</button>
        <button id="dex" onclick="dec_product(${id})">-</button>
        <button id="rem" onclick="remove_product(${id})">x</span>
    </div>`
}

function add_product(product){
    return `<div class="produs col-25" >
    <div class="highlight">
        <h4>${product.name}</h4>
        <h5 class="pret">${product.price} RON/kg</h5>
    </div>
    <img src="${product.img}" alt="${product.name}" />
    <button data-id="${product.id}" onclick="set_command('${product.name}', ${product.price})">Adauga in cos</button>
    </div>`
}


document.addEventListener("DOMContentLoaded", function(event){
    document.getElementById('contactForm').onsubmit = submit_FORM;
    
});