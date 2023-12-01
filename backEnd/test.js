function closestNumbers(numbers) {
    // Write your code here
    numbers.sort((a,b) => {
        if (a<b) return -1;
        if (a>b) return 1;
        return 0;
    });
    console.log(numbers)
    let closestNumber = 100000000;
    for (let i = 0; i < numbers.length; i++) {
        if ( (numbers[i+1] - numbers[i]) != 0 )
            if ((numbers[i+1] - numbers[i]) < closestNumber) closestNumber = numbers[i+1] - numbers[i]
    }
    console.log(numbers, closestNumber)
    for (let i = 0; i < numbers.length-1; i++) {
        if ((numbers[i+1] - numbers[i]) === closestNumber ) console.log(numbers[i], numbers[i+1])
    }
}

function main() {


    let numbers = [4,4,-2,-1,3, 5,5,6,6];


    closestNumbers(numbers);
}

main()