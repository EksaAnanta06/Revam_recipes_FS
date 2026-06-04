const numbers = [45, 4, 9, 16, 25];

let hasilJumlahArrayDiAtas = 0;

numbers.forEach((value1, value2, value3) => {
    return hasilJumlahArrayDiAtas += value1;
})

console.log(hasilJumlahArrayDiAtas)