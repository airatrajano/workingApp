const express = require('express');
const Papa = require('papaparse');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
// const { ServiceClass } = require('./service');

// import { ServiceClass } from './service.js';

const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:4200',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Accept'] 
}));


app.get('/api/products', (req, res) => {
  const filePath = path.join(__dirname, 'products.csv');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read CSV file' });
    }

    const parsedData = Papa.parse(data, {
      header: true, 
      skipEmptyLines: true, 
    });

    res.json({products: parsedData.data});
  });
});

app.get('/api/product/:id', (req, res) => {

  const { id } = req.params;  // Get the 'id' from the URL

  // Path to the CSV file
  const filePath = path.join(__dirname, 'products.csv');

  // Read the CSV file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read CSV file' });
    }

    // Parse the CSV file using PapaParse
    const parsedData = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
    });

    const row = parsedData.data.find(item => item.id === id);

    if (row) {
      return res.json(row);
    } else {
      return res.status(404).json({ error: `No product found with id ${id}` });
    }
  });
});

app.get('/api/product/:id', (req, res) => {

    const { id } = req.params; 

    const filePath = path.join(__dirname, 'products.csv');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
        return res.status(500).json({ error: 'Failed to read CSV file' });
        }

        const parsedData = Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        });

        const row = parsedData.data.find(item => item.id === id);

        if (row) {
        return res.json(row);
        } else {
        return res.status(404).json({ error: `No product found with id ${id}` });
        }
    });
});

app.get('/api/product-types', (req, res) => {

  const filePath = path.join(__dirname, 'products.csv');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read CSV file' });
    }

    const parsedData = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
    });

    const types = parsedData.data
      .map(item => item.type) 
      .filter(Boolean);

    const uniqueTypes = [...new Set(types)];

    return res.json({ types: uniqueTypes });
  });
});

app.post('/api/product', (req, res) =>{
    const { type, name, price } = req.body;
    
    // const newRow = `${type},${name},${id},${price}\n`;
    const filePath = path.join(__dirname, 'products.csv');
    // fs.appendFile(filePath, newRow, (err) => {
    //     if (err) {
    //       console.error('Error writing to CSV:', err);
    //       return res.status(500).json({ error: 'Error adding row to CSV' });
    //     }
    //     res.status(200).json({ message: 'Row added successfully!' });
    // });

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({message: 'Error reading the CSV file:', err});
        return;
      }
  
      // Parse the CSV data
      const parsedData = Papa.parse(data, {
        header: true,  // Treat first row as header
        skipEmptyLines: true,
      });
  
      // If the CSV file is empty or has no rows, start from ID = 1
      let maxId = 0;
      if (parsedData.data.length > 0) {
        // Find the highest current ID
        maxId = Math.max(...parsedData.data.map(row => parseInt(row.id, 10)));
      }
  
      // Increment the ID
      const newId = maxId + 1;
  
      // Create the new row with the incremented ID
      const newRow = {
        id: newId.toString(),  // Add the incremented ID
        name: name,  // Example: Add other fields with default values
        type: type,
        price: price
      };
  
      // Add the new row to the parsed data
      parsedData.data.push(newRow);
  
      // Convert the updated data back to CSV format
      const updatedCSV = Papa.unparse({
        fields: Object.keys(newRow),  // Ensure the header is correct
        data: parsedData.data,
      });
  
      // Write the updated CSV data back to the file
      fs.writeFile(filePath, updatedCSV, 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error adding row to CSV' });
          return;
        }
        res.status(200).json({message:'CSV updated successfully with the new row!'});
      });
    });
});

app.delete('/api/product/:id', (req, res) =>{
    const { id } = req.params; 

    const filePath = path.join(__dirname, 'products.csv');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
        return res.status(500).json({ error: 'Failed to read CSV file' });
        }

        const parsedData = Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
        });

        const filteredData = parsedData.data.filter(item => item.id !== id);

        if (filteredData.length === parsedData.data.length) {
            return res.status(404).json({ error: `Product with id ${id} not found` });
        }

        let updatedCSV = Papa.unparse({
        fields: Object.keys(filteredData[0]),
        data: filteredData,
        });
        
        if (!updatedCSV.endsWith('\n')) {
          updatedCSV += '\n';
        }

        // Write the updated CSV data back to the file
        fs.writeFile(filePath, updatedCSV, 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to write updated CSV file' });
        }
        // Respond with success
        return res.json({ message: `Product with id ${id} deleted successfully` });
        });
    });
})


app.get('/', (req, res) =>{
    // const service = new ServiceClass();
    res.send('Hello!')
})


app.listen(8080, ()=>{
    console.log(`Server listing port 8080`);
});


