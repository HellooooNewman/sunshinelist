# Sunshine list application

## What is the sunshine list?

"The names, positions, salaries and total taxable benefits of public sector employees paid $100,000 or more in a calendar year." For more information go to this [link](https://www.ontario.ca/page/public-sector-salary-disclosure)

## What is this?

It's an application that shows the data from the sunshine list in a more visual way than a table. In the future I'm going to look to do more than just one year and show all the years.

## Extraction of Data

Run in bash because cmd doesn't support quotes very well\

Had to do some manual cleaning of keys and commas in the original file

`cat sunshinelist2017.json | ./jq-win64.exe --raw-output '[.[] | {sector: .Sector, taxable_benefits: ."Taxable Benefits"|tonumber, salary_paid: .salary_paid|tonumber, last_name: ."Last Name", first_name: ."First Name", calendar: ."Calendar Year"|tonumber, job_title: ."Job Title", employer: .Employer}]' > sunshine-clean.json`

Test query

`cat sunshinelist2017.json | ./jq-win64.exe --raw-output '.[0] | {sector: .Sector, taxable_benefits: ."Taxable Benefits"|tonumber, salary_paid: .salary_paid|tonumber, last_name: ."Last Name", first_name: ."First Name", calendar: ."Calendar Year"|tonumber, job_title: ."Job Title", employer: .Employer}' > sunshine-clean.json`

Import into your db

`mongoimport -h localhost -d sunshinelist2017 -c people --file "C:\Users\just-\Desktop\sunshine-clean.json" --jsonArray`

## Server Installation

`npm i`

## Client Installation

`cd client && npm i`
