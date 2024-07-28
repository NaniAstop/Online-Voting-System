const fs=require('fs');
var data=prompt();
fs.writeFile('Hello.txt',data,(err)=>{
    if(err)
        console.log('err');
    else
        console.log('suuccesss');
})