var fs = require('fs')
const csv = require("csvtojson")
const path = require("path")
// Load in data set
var outputPathNormal = path.join(__dirname, "raw-data")
var inputPathNormal = path.join(__dirname, "raw-data")


// var rimraf = require('rimraf');
// rimraf('/some/directory', function () { console.log('done'); });



var yearsArray = []
var years = []

// Get the file names
var folder = require("fs").readdirSync(outputPathNormal)
console.log("Start to convert to json");
console.time("convert to json")
// Loop over each file in the folder
folder.forEach((file) => {
  // make sure they end with .csv
  if(file.endsWith(".csv")) {
    // Load the csv content and add it to the array
    csv()
    .fromFile(outputPathNormal + '\/' + file)
    .then(jsonObj => {
      yearsArray.push(jsonObj)
      years = [...years, ...jsonObj]
      if(yearsArray.length === folder.length){
        console.timeEnd("convert to json")
        formatData()
      }
    })
  }
})

function formatData(){
  console.time("Sort json");
  console.log("Start sort")

  // Format Data
  var cache = {}
  var newData = []
  var missingPeople = []
  years.map(function(person) {
    // Format data
    let salary_paid = parseFloat(person["Salary Paid"].replace(/[$,]/g,''))
    let taxable_benefits = parseFloat(person["Taxable Benefits"].replace(/[$,]/g,''))
    let year = parseInt(person["Calendar Year"])
    let first_name = person["First Name"].toLowerCase();
    let last_name = person["Last Name"].toLowerCase();
    let job_title = person["Job Title"].toLowerCase();
    let sector = person["Sector"].toLowerCase();
    let employer = person["Employer"].toLowerCase();

    //////////////////////// Lower case all strings
    //////////////////////// Check for any weird characters

    if(cache[`${first_name} ${last_name} ${sector}`]){
      // console.log(`${person["First Name"]} ${person["Last Name"]} is a duplicate`)
      // Add year to existing person
      let newYear = {
        year,
        taxable_benefits,
        salary_paid,
        job_title,
        employer,
      }

      let index = newData.findIndex(data => data.first_name === last_name && data.last_name === person["Last Name"] && data.sector === person["Sector"])
      if(index === -1 || index === undefined) {
        missingPeople.push(person);

      } else {
        newData[index].years.push(newYear)
      }
    } else {
      // Add new person
      newData.push({
        first_name,
        last_name,
        sector,
        years: [{
          year,
          taxable_benefits,
          salary_paid,
          job_title,
          employer,
        }],
      })
      cache[`${first_name} ${last_name} ${sector}`] = true
      // console.log(`${person["First Name"]} ${person["Last Name"]} is new`)
    }
  })
  fs.writeFileSync(`./people/missing-people.json`, JSON.stringify(missingPeople));
  console.timeEnd("Sort json");

  var batchSize = 100000
  var batch = []
  console.log("Start file write");

  for([index, value] of newData.entries()){
    i++
    batch.push(value)

    if(i === batchSize + 1){
      let content = JSON.stringify(batch)
      let name = Math.round(index / batchSize);

      console.time(`Write json ${name}`)
      fs.writeFileSync(`./people/people-${name}.json`, content)
      console.timeEnd(`Write json ${name}`)
      i = 0
      batch = []
    }

    if(index === newData.length - 1){
      let content = JSON.stringify(batch)
      let name = Math.round(name);

      console.time(`Write json ${name}`)
      fs.writeFileSync(`./people/people-${name}.json`, content)
      console.timeEnd(`Write json ${name}`)
      i = 0
      batch = []
      console.log("Done :)")
    }
  }
  console.log("Write to file")
}

