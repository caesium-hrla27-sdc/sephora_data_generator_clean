const fs = require("fs");
const faker = require("faker");

function makeData(i) {

  var newProduct = {};
  newProduct.id = i;
	newProduct.name = faker.commerce.productName();
	
  newProduct.breadcrumbs = "";
  var breadcrumbCount = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < breadcrumbCount; i++) {
    let crumb = faker.lorem.word();
    crumb = crumb[0].toUpperCase() + crumb.slice(1);
    newProduct.breadcrumbs = newProduct.breadcrumbs + " " + crumb
	}

	newProduct.breadcrumbs = newProduct.breadcrumbs.substring(1);

  newProduct.description = faker.lorem
    .lines(1)
    .split(" ")
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ")
    .slice(0, -1);

  newProduct.size = faker.lorem.word();
  newProduct.item_number = Math.floor(Math.random() * 9000 + 9999);
  newProduct.price = Math.floor(Math.random()*999999);
  newProduct.details = faker.lorem.paragraphs(2, ' ');
  newProduct.how_to_use = faker.lorem.paragraph();
  newProduct.ingredients = faker.lorem.paragraph();
  newProduct.about_the_brand = faker.lorem.paragraph();
  newProduct.shipping_returns = faker.lorem.paragraph();
  newProduct.exclusive = faker.random.boolean();
  newProduct.average_rating = Math.floor(Math.random() * 500);
  newProduct.review_count = Math.floor(Math.random() * 50);
	newProduct.loves_count = Math.floor(Math.random() * 2500);

  newProduct.media = "";

  var imageCount = Math.floor(Math.random() * 7) + 1;
  for (let i = 0; i < imageCount; i++) {

    url = Math.floor(Math.random() * 1000);
		newProduct.media  = newProduct.media +" "+url;
		
	}
	newProduct.media = newProduct.media.substring(1);

	var outString = ""
	for (key in newProduct) {
		outString = outString.concat(","+newProduct[key])
	}
  return outString.substring(1);
}

function writeTenMillionTimes(writer, data, encoding, callback) {
  let i = 1e7;
  write();
  function write() {
    if (i % 100000 == 0) {
      console.log("progress at i:", i);
    }
    let ok = true;
    do {
      i--;
      if (i === 1e7/2) {
        writer.write("" + makeData(i), encoding, callback);
      } else {
        ok = writer.write(makeData(i) + "\n", encoding);
      }
    } while (i > 1e7/2 && ok);
    if (i > 1e7/2) {
      writer.once("drain", write);
    }
  }
}

var writerWS = fs.createWriteStream("dummy_pt1.csv");

var columns = "id,name,breadcrumbs,description,size,item_number,price,details,how_to_use,ingredients,about_the_brand,shipping_returns,exclusive,average_rating,review_count,loves_count,media\n"
writerWS.write(columns, "utf-8"); //wrap in begginging bracket

writeTenMillionTimes(writerWS, null, "utf-8", () => {
  console.log("done");
  writerWS.write("", "utf-8");
});
