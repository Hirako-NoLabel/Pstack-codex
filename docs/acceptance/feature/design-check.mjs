const inputs=['ΟΣ','ος','οσ'];
const query='ΟΣ';
console.log(JSON.stringify({lowercase:inputs.filter(x=>x.toLowerCase().includes(query.toLowerCase())),unicodeRegex:inputs.filter(x=>new RegExp(query,'iu').test(x))}));
