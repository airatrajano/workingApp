// const express = require('express');
const Papa = require('papaparse');
const fs = require('fs');
// const bodyParser = require('body-parser');
const path = require('path');

export class ServiceClass {
    
    getData (){
        const filePath = path.join(__dirname, 'products.csv');

          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to read CSV file' });
            }
        
            const parsedData = Papa.parse(data, {
              header: true,
              skipEmptyLines: true,
            });
            return parsedData.data
          });
    }
}