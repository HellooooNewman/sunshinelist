var fs = require('fs')
const csv = require("csvtojson")

// Load in data set
var normalizedPath = require("path").join(__dirname, "raw-data")


var yearsArray = []
var years = []

// Get the file names
var folder = require("fs").readdirSync(normalizedPath)

console.time("convert to json")
// Loop over each file in the folder
folder.forEach((file) => {
  // make sure they end with .csv
  if(file.endsWith(".csv")) {
    // Load the csv content and add it to the array
    csv()
    .fromFile(normalizedPath + '\/' + file)
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
  console.time("Format json")
  // Format Data
  var cache = {}
  var newData = []
  var missingPeople = []
  years.map(function(person) {
    // Format data
    let salary_paid = parseFloat(person["Salary Paid"].replace(/[$,]/g,''))
    let taxable_benefits = parseFloat(person["Taxable Benefits"].replace(/[$,]/g,''))
    let year = parseInt(person["Calendar Year"])

    if(cache[`${person["First Name"]} ${person["Last Name"]}`]){
      // console.log(`${person["First Name"]} ${person["Last Name"]} is a duplicate`)
      // Add year to existing person
      let newYear = {
        year: year,
        sector: person["Sector"],
        taxable_benefits: taxable_benefits,
        salary_paid: salary_paid,
        job_title: person["Job Title"],
        employer: person["Employer"]
      }

      let index = newData.findIndex(data => data.first_name === person["First Name"] && data.last_name === person["Last Name"])
      if(index === -1 || index === undefined) {
        missingPeople.push(person);
      } else {
        newData[index].years.push(newYear)
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
      })
      cache[`${person["First Name"]} ${person["Last Name"]}`] = true
      // console.log(`${person["First Name"]} ${person["Last Name"]} is new`)
    }
  })
  console.timeEnd("Format json")

  var batchSize = 100000
  var batch = []

  let i = 0
  for([index, value] of newData.entries()){
    i++
    batch.push(data)

    if(i == batchSize){
      let content = JSON.stringify(batch)
      console.time(`Write json ${index / batchSize}`)
      fs.writeFileSync(`./people/people-${index / batchSize}.json`, content)
      console.timeEnd(`Write json ${index / batchSize}`)
      i = 0
      batch = []
    }

    if(index === newData.length - 1){
      let content = JSON.stringify(batch)
      console.time(`Write json ${index / batchSize}`)
      fs.writeFileSync(`./people/people-${index / batchSize}.json`, content)
      console.timeEnd(`Write json ${index / batchSize}`)
      i = 0
      batch = []
    }
  }
}
