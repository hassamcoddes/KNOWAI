const { mod } = require('@tensorflow/tfjs');
const mysql=require('mysql')

const connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'KNOW_AI'
});

connection.connect((err)=>{
    if(err){
        console.error('Error connecting to the database:', err)
        return;
    } else {
        console.log('Connected to the mySQl Databse.')
    }
})

module.exports=connection;