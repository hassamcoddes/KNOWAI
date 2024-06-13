const { resolve } = require("packages/lib/resolver");

function fetchData(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            const success="fail"
            if(success==="pass"){
                resolve("Data fetched successfully!");
            } else {
                reject("Error fetching data.")
            }
        },2000)
    })
}

//Using the Promise

fetchData()
.then(result=>{
    console.log(result);
})
.catch(error=>{
    console.error(error);
})