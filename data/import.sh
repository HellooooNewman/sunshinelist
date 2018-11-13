ls -1 people/*.json | sed 's/.json$//' | while read col; do
    # mongoimport.exe -d db_name -c $col < $col.json;
    mongoimport.exe -h localhost -d sunshinelist_multiyear -c people < $col.json --jsonArray
done