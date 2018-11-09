var fs = require('fs');
const csv = require("csvtojson");

// Load in data set
var normalizedPath = require("path").join(__dirname, "raw-data");

console.time("convert to json");
var yearsArray = []
var years = []

// Get the file names
var folder = require("fs").readdirSync(normalizedPath)

folder.forEach((file) => {
  if(file.endsWith(".csv")) {
    // Get the csv contents

    csv()
    .fromFile(normalizedPath + '\/' + file)
    .then(jsonObj => {
      yearsArray.push(jsonObj);
      years = [...years, ...jsonObj];
      if(yearsArray.length === folder.length){
        console.log('done');
        console.timeEnd("convert to json");
        formatData();
      }
    });
  }
});



function formatData(){
  console.time("Format json");
  // Format Data
  var cache = {};
  var newData = []
  years.map(function(person) {
    // Format data
    let salary_paid = parseFloat(person["Salary Paid"].replace(/[$,]/g,''));
    let taxable_benefits = parseFloat(person["Taxable Benefits"].replace(/[$,]/g,''));
    let year = parseInt(person["Calendar Year"]);

    if(cache[`${person["First Name"]} ${person["Last Name"]}`]){
      // console.log(`${person["First Name"]} ${person["Last Name"]} is a duplicate`);
      // Add year to existing person
      let newYear = {
        year: year,
        sector: person["Sector"],
        taxable_benefits: taxable_benefits,
        salary_paid: salary_paid,
        job_title: person["Job Title"],
        employer: person["Employer"]
      }

      let index = newData.findIndex(data => data.first_name === person["First Name"] && data.last_name === person["Last Name"]);
      if(index === -1 || index === undefined) {
        console.log(person);
      } else {
        newData[index].years.push(newYear);
      }
    } else {

      // Add new person
      newData.push({
        first_name: person["First Name"],
        last_name: person["Last Name"],
        years: [{
          year: year,
          sector: person["Sector"],
          taxable_benefits: taxable_benefits,
          salary_paid: salary_paid,
          job_title: person["Job Title"],
          employer: person["Employer"]
        }],
      });
      cache[`${person["First Name"]} ${person["Last Name"]}`] = true;
      // console.log(`${person["First Name"]} ${person["Last Name"]} is new`);
    }
  })
  console.timeEnd("Format json");

  const content = JSON.stringify(newData);
  fs.writeFileSync('./years.json', content);
}

