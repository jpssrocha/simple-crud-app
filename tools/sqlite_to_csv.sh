#!/bin/bash

# This is a simple bash script to help me dump the tables from the sqlite
# database into CSV files.

# Requires: sqlite3

# Usage:
# ./sqlite_to_csv.sh <sqlite_file>

FILE=$1
DATABASE=$(echo $FILE | cut -d. -f1)

printf "Creating CSV from tables in the SQLite database: $DATABASE \n\n"

TABLES=$(sqlite3 $FILE .tables)

for TABLE in $TABLES; do
    echo "Creating CSV for table: $TABLE -> $DATABASE-$TABLE.csv"
    sqlite3 -header -csv $FILE "SELECT * FROM $TABLE" > $DATABASE-$TABLE.csv
done
