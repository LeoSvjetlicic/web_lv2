"use strict";

// const - constant (immutable)
// let - variable (mutable)
// require() - import
// console.log() - print

const readline = require("readline");
const process = require("process");

let walletAmount = 5000;

// (Almost all) JavaScript types:
// - number (const a = 1;)
// - string (const a = 'abc';)
// - boolean (const a = true;)
// - object (const a = { name: 'abc', age: 1 };)
// - array (const a = [1, 2, 3];)

let items = [
  {
    name: "Luka",
    price: 100,
  },
  {
    name: "Miha",
    price: 120,
  },
  {
    name: "Marko",
    price: 102,
  },
  {
    name: "Para",
    price: 99,
  },
  {
    name: "Leo",
    price: 104,
  },
];
let instructions = [
  { command: "help", description: "Shows available commands." },
  { command: "buy", description: "Buys items in the cart." },
  { command: "add", description: "Adds an item to the cart." },
  { command: "remove", description: "Removes an item from the cart." },
  { command: "cart", description: "Lists elements in the cart." },
  { command: "wallet", description: "Shows ballance." },
  { command: "storage", description: "Lists available elements for purchase." },
];
let cart = [];

function buy() {
  if (cart.length < 1) {
    console.log("Cart is empty");
  } else {
    console.log("You have succesfuly purchase the following items");
    console.log("-------------");
    for (let i = 0; i < cart.length; i++) {
      console.log(cart[i].name);
    }
    cart = [];
    walletAmount = 5000;
  }
}

function showBalance() {
  console.log(`You have ${walletAmount} available.`);
}

function listStorage() {
  console.log("Available items:");
  for (let i = 0; i < items.length; i++) {
    console.log("------");
    console.log(items[i].name);
    console.log(items[i].price);
  }
}

function addToCart(itemName, amount) {
  let tempElement = items.find((item) => item.name === itemName);
  if (tempElement) {
    const index = items.findIndex((item) => item.name === itemName);
    const item = items[index];
    // string interpolation - `${variable}` (backticks, not single quotes)
    // equivalent of %s in C printf (or %d, %f, etc.)
    console.log(`Buying ${item.name} with price ${item.price}`);

    if (item.price > walletAmount) {
      console.log("Not enough money");
      return;
    } else {
      for (let i = 0; i < amount; i++) {
        cart.push(item);
        walletAmount -= item.price;
      }
    }
  } else {
    console.log("Invalid input");
  }
}

function removeFromCart(itemName, amount) {
  for (let i = 0; i < amount; i++) {
    let elementIndex = cart.findIndex((item) => item.name === itemName);
    if (elementIndex >= 0) {
      walletAmount += cart[elementIndex].price;
      cart.splice(elementIndex, 1);

      console.log(`Removing from cart ${itemName}`);
    } else {
      console.log(`${itemName} doesn't exist or remove amout was too big`);
    }
  }
}

function listInstructions() {
  for (let i = 0; i < instructions.length; i++) {
    console.log("------");
    console.log(instructions[i].command);
    console.log(instructions[i].description);
  }
}

function listCart() {
  if (cart.length < 1) {
    console.log("You have no elements in the cart");
  } else {
    const itemMap = new Map();
    cart.forEach((item) => {
      if (itemMap.has(item.name)) {
        itemMap.set(item.name, itemMap.get(item.name) + 1);
      } else {
        itemMap.set(item.name, 1);
      }
    });

    itemMap.forEach((quantity, itemName) => {
      const index = items.findIndex((item) => item.name === itemName);
      const item = items[index];
      console.log(`${itemName} ${quantity} ${item.price * quantity}`);
    });
  }
}

function clearCart() {
  if (cart.length < 1) {
    console.log("No elements in the cart.");
  } else {
    walletAmount = 5000;
    cart = [];
    console.log("Cart cleared.");
  }
}

function removeAll(name) {
  if (name !== "") {
    let elementIndex = items.findIndex((item) => item.name === name);
    let itemPrice = items[elementIndex].price;
    let newList = cart.filter((item) => item.name !== name);
    if (newList.length === cart.length) {
      console.log("No elements with that name in the cart.");
    } else {
      walletAmount += (cart.length - newList.length) * itemPrice;
      cart = newList;
      console.log("Removed all elements");
    }
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Store");
rl.prompt();

// (argument) => { body } - arrow function
// higher-order function, equivalent of delegate in C#
// rl.on('line', (line) => { ... }) registers a function to
// get called when the user enters a line
rl.on("line", (line) => {
  const split = line.split(" "); // 'buy Apple' => ['buy', 'Apple']
  const command = split[0];
  const args = split[1] ? split[1] : ""; // Rest of the array. (['Apple'])
  const amount = split[2] ? split[2] : 1; // Rest of the array. (['Apple'])
  console.log(`Command: ${command}`);
  console.log(`Args: ${args}`);

  switch (command) {
    case "help":
      listInstructions();
      break;
    case "add":
      addToCart(args, amount);
      break;
    case "remove":
      removeFromCart(args, amount);
      break;
    case "buy":
      buy();
      break;
    case "cart":
      listCart();
      break;
    case "wallet":
      showBalance();
      break;
    case "storage":
      listStorage();
      break;
    case "removeall":
      removeAll(args);
      break;
    case "clear":
      clearCart();
      break;
    default:
      console.log(`Unknown command: ${command}`);
  }

  rl.prompt();
}).on("close", () => {
  console.log("Exit");
  process.exit(0);
});
