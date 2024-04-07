#! /usr/bin/env node

console.log(
  'This script populates some test brands, styles and shows to your database. Specified database as argument - e.g.: node populatedb "node populatedb mongodb+srv://<username>:<password>@cluster0.xpetqvd.mongodb.net/inventory_app?retryWrites=true&w=majority&appName=Cluster0"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

console.log(userArgs);

const Brand = require("./models/brand");
const Style = require("./models/style");
const Shoe = require("./models/shoe");

const brands = [];
const styles = [];
const shoes = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

console.log("test");
console.log(process.argv);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createBrands();
  await createStyles();
  await createShoes();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// brand[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function brandCreate(index, name) {
  const brand = new Brand({ name: name });
  await brand.save();
  brands[index] = brand;
  console.log(`Added brand: ${name}`);
}

async function styleCreate(index, name) {
  const style = new Style({ name: name });
  await style.save();
  styles[index] = style;
  console.log(`Added style: ${name}`);
}

async function shoeCreate(index, name, description, price, brand, style) {
  const shoeDetail = {
    name: name,
    description: description,
    price: price,
  };
  if (brand != false) shoeDetail.brand = brand;

  if (style != false) shoeDetail.style = style;

  const shoe = new Shoe(shoeDetail);
  await shoe.save();
  shoes[index] = shoe;
  console.log(`Added shoe: ${name}`);
}

async function createBrands() {
  console.log("Adding brands");
  await Promise.all([
    brandCreate(0, "Brooks"),
    brandCreate(1, "Asics"),
    brandCreate(2, "Saucony"),
    brandCreate(3, "Hoka"),
  ]);
}

async function createStyles() {
  console.log("Adding styles");
  await Promise.all([
    styleCreate(0, "Road Running"),
    styleCreate(1, "Trail Running"),
    styleCreate(2, "Racing Spike"),
  ]);
}

async function createShoes() {
  console.log("Adding shoes");
  await Promise.all([
    shoeCreate(
      0,
      "Ghost 15",
      "The Ghost is one of our most-loved running shoes. With a soft feel, smooth ride, and trusted fit, the men's Ghost 15 delivers the comfort and performance runners want.",
      140,
      brands[0],
      styles[0]
    ),
    shoeCreate(
      1,
      "GEL-TRABUCO 12",
      "A versatile trail style with adaptive stability properties.",
      140,
      brands[1],
      styles[1]
    ),
    shoeCreate(
      2,
      "KINVARA PRO",
      "Our latest iteration in the collection, Kinvara PRO is engineered to bring more efficiency to your daily running routine. It’s time to unlock your PROformance - the best version of yourself – day in, day out. After all, you can’t spell progress without PRO.",
      180,
      brands[2],
      styles[0]
    ),
    shoeCreate(
      3,
      "ELMN8 7",
      "Race your best in this middle-distance track spike. The ELMN8 7 is a time-tested running shoe made to help you tackle 400m-1,600m races.",
      150,
      brands[0],
      styles[2]
    ),
  ]);
}
