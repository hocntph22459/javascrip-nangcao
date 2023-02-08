'use strict';

//////////////////////////////////////////////////////////////////
// DATA
// We have different data now!
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-01-28T09:15:04.904Z',
    '2019-04-01T10:17:24.185Z',
    '2019-05-27T17:01:17.194Z',
    '2019-07-11T23:36:17.929Z',
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-03-08T14:11:59.604Z',
    '2020-03-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-01-25T14:18:46.235Z',
    '2019-02-05T16:33:06.386Z',
    '2019-03-10T14:43:26.374Z',
    '2019-04-25T18:49:59.371Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-02-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

//////////////////////////////////////////////////////////////////
// APP
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// LEC 16)
// 1.
const startLogOutTimer = function () {
  // 3.
  // There is always this 1s delay after the app loads and the start of the timer. And also between logins. So let's export the timer callback into its own function, and run it right away
  const tick = function () {
    let minutes = String(parseInt(time / 60, 10)).padStart(2, '0');
    let seconds = String(parseInt(time % 60, 10)).padStart(2, '0');
    // console.log(minutes, seconds);

    // Displaying time in element and clock
    labelTimer.textContent = `${minutes}:${seconds}`;

    // Finish timer
    if (time === 0) {
      // We need to finish the timer, otherwise it will run forever
      clearInterval(timer);

      // We log out the user, which means to fade out the app
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }

    // Subtract 1 second from time for the next iteration
    time--;
  };

  // Setting time to 5 minutes in seconds
  let time = 10 * 60;
  // let time = 10;

  tick();
  const timer = setInterval(tick, 1000);

  // LATER
  return timer;
};

const printWelcome = function (name) {
  const now = new Date();
  const greetings = new Map([
    [[6, 7, 8, 9, 10], 'Good Morning'],
    [[11, 12, 13, 14], 'Good Day'],
    [[15, 16, 17, 18], 'Good Afternoon'],
    [[19, 20, 21, 22], 'Good Evening'],
    [[23, 0, 1, 2, 3, 4, 5], 'Good Night'],
  ]);

  const arr = [...greetings.keys()].find(key => key.includes(now.getHours()));
  const greet = greetings.get(arr);
  labelWelcome.textContent = `${greet}, ${name}!`;
};

// LEC 9)
// 2.
const formatMovementDate = function (date, locale) {
  // LEC 12) add locale
  const calcDaysPassed = (date1, date2) =>
    Math.round((date1 - date2) / (60 * 60 * 24 * 1000));
  const now = new Date();
  const daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// LEC 8)
// const printMovements = function(movements) {
const printMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const mov = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  mov.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // LEC 8)
    let printDate = '';
    if (account.movementsDates) {
      const date = new Date(account.movementsDates[i]);

      // LEC 9)
      printDate = formatMovementDate(date, account.locale);
      // const day = `${date.getDate()}`.padStart(2, '0');
      // // Remember that MONTHS are 0-based!
      // const month = `${date.getMonth() + 1}`.padStart(2, '0');
      // const year = date.getFullYear();
      // printDate = `${day}/${month}/${year}`;
    }

    // LEC 14)
    // Now we can finally use the user's locale and account currency!
    // const formattedMov = new Intl.NumberFormat(account.locale, {
    //   style: 'currency',
    //   currency: account.currency,
    //   // currency: 'USD',
    // }).format(mov);
    const formattedMov = formatCur(mov, account.locale, account.currency);

    // LEC 4) + 14)
    // <div class="movements__value">${mov.toFixed(2)}€</div>
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${printDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// printMovements(account1.movements);
printMovements(account1);

const createUsernames = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// LEC 14)
// const calcPrintBalance = function(movements) {
const calcPrintBalance = function (account) {
  const balance = account.movements.reduce((accum, cur) => accum + cur, 0);
  currentAccount.balance = balance;

  // LEC 4)
  // labelBalance.textContent = `${balance}€`;
  // labelBalance.textContent = `${balance.toFixed(2)}€`;

  // LEC 14)
  labelBalance.textContent = formatCur(
    balance,
    account.locale,
    account.currency,
  );
};

const calcPrintSummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  // LEC 4) The .20 looks a lot nicer that the .2 we had before
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  // LEC 14)
  labelSumIn.textContent = formatCur(incomes, account.locale, account.currency);

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  // LEC 4)
  // labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  // LEC 14)
  labelSumOut.textContent = formatCur(
    Math.abs(out),
    account.locale,
    account.currency,
  );

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (currentAccount.interestRate / 100))
    .filter(int => int > 1)
    .reduce((acc, cur) => acc + cur, 0);
  // LEC 4)
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;

  // LEC 14)
  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency,
  );
};

//////////////////////////////////////////////////////////////////
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );

  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    console.log(currentAccount);

    // Reset input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Log in!
    containerApp.style.opacity = 100;

    // LEC 16)
    // 2.
    // If there is already a timer, then cancel it!
    if (timer) clearInterval(timer);

    // 1.
    // Start 5 minutes timer to log out user automatically)
    timer = startLogOutTimer();

    // 2.

    // Print welcome message
    // LEC 10)
    // labelWelcome.textContent = `Welcome back, ${
    //   currentAccount.owner.split(' ')[0]
    // }!`;
    printWelcome(`${currentAccount.owner.split(' ')[0]}`);

    // LEC 12)
    // 1.
    // Set current date and time!
    const now = new Date();
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options,
    ).format(now);

    // Test with JD first, then with JS

    // Print movements
    // LEC 8)
    printMovements(currentAccount);

    // LEC 14)
    // Print balance
    calcPrintBalance(currentAccount);

    // Print summary
    calcPrintSummary(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = +inputTransferAmount.value;

  if (
    receiver &&
    amount &&
    currentAccount.balance >= amount &&
    receiver.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    // LEC 8)
    // 3.
    currentAccount.movementsDates.push(new Date());
    receiver.movementsDates.push(new Date());

    // LEC 8)
    printMovements(currentAccount);

    // LEC 14)
    calcPrintBalance(currentAccount);
    calcPrintSummary(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputTransferTo.value = inputTransferAmount.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);

  if (currentAccount.movements.some(mov => mov >= amount / 10) && amount > 0) {
    currentAccount.movements.push(amount);

    // LEC 8)
    // 3.
    currentAccount.movementsDates.push(new Date());

    // LEC 15)
    // 5.
    setTimeout(() => {
      // LEC 8)
      printMovements(currentAccount);

      // LEC 14)
      calcPrintBalance(currentAccount);
      calcPrintSummary(currentAccount);
    }, 2500);

    // LEC 16)
    // 4.
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username,
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function () {
  printMovements(currentAccount, !sorted);

  // if (!sorted) {
  //   printMovements(currentAccount.movements.slice().sort((a, b) => a - b));
  // } else {
  //   printMovements(currentAccount);
  // }
  sorted = !sorted;
});

// let sorted = false;
// btnSort.addEventListener('click', function () {
//   if (!sorted) {
//     // We need to create a copy, otherwise the original array will be mutated, and we don't want that
//     printMovements(currentAccount.movements.slice().sort((a, b) => a - b));
//     // Here, for example, I'm using slice and not ... because I'm in the middle of a chain here, and so it's more useful to just keep chaining
//   } else {
//     printMovements(currentAccount.movements);
//   }
//   // We need to flip sorted, so that in the next click, the opposite happens
//   sorted = !sorted;
// });



// LAB3.2: (SECTION	11: WORKING	WITH	ARRAY > CODING	CHALLENGE	#1)
// Julia và Kate đang nghiên cứu về loài chó. Vì vậy, mỗi người trong số họ đã hỏi 5 
// chủ sở hữu chó về tuổi của con chó của họ và lưu trữ dữ liệu vào một mảng (một 
// mảng cho mỗi người). Hiện tại, họ chỉ quan tâm đến việc biết một con chó là 
// trưởng thành hay chó con. Chó được coi là trưởng thành nếu ít nhất 3 tuổi và là 
// chó con nếu chưa đầy 3 tuổi.
// Tạo một hàm 'checkDogs', hàm này chấp nhận 2 mảng tuổi của chó ('dogsJulia' và 
// 'dogsKate') và thực hiện những việc sau:
// 1. Julia phát hiện ra rằng chủ của hai con chó ĐẦU TIÊN và HAI con chó CUỐI 
// CÙNG thực sự nuôi mèo chứ không phải chó! Vì vậy, hãy tạo một bản sao nông 
// của mảng của Julia và xóa tuổi mèo khỏi mảng đã sao chép đó (vì đó là một cách 
// làm không tốt để thay đổi các tham số hàm)

// 2. Tạo một mảng có cả dữ liệu của Julia (đã sửa) và Kate

// 3. Đối với mỗi con chó còn lại, hãy đăng nhập vào bảng điều khiển xem đó là chó 
// trưởng thành ("Chó số 1 là người lớn và 5 tuổi") hay chó con ("Chó số 2 vẫn là chó 
// con �")

// 4. Chạy hàm cho cả hai bộ dữ liệu thử nghiệm
// GỢI Ý: Sử dụng các công cụ từ tất cả các bài giảng trong phần này cho đến nay �
// TEST DATA 1: Dữ liệu của Julia [3, 5, 2, 12, 7], dữ liệu của Kate [4, 1, 15, 8, 3]
// TEST DATA 2: Dữ liệu của Julia [9, 16, 6, 8, 3], dữ liệu của Kate [10, 5, 6, 1, 4]


const checkDogs = function(dogsJulia,dogsKate){
  const dogs = dogsJulia.slice();
  dogs.splice(0,1);
  dogs.splice(-2)
  console.log(dogs);

  const cho = dogs.concat(dogsKate);
  console.log(cho);

  cho.forEach(function(dog,i){
    if(dog >= 3){
        console.log(`Chó số ${i+1} là người lớn và ${dog} tuổi`);
    }else{
      console.log(`Chó số ${i+1} vẫn là chó con`);
    }
  })

}
checkDogs([9, 16, 6, 8, 3],[10, 5, 6, 1, 4])



// LAB3.3: (SECTION	11: WORKING	WITH	ARRAY > CODING	CHALLENGE	#2)
// Julia và Kate's đang học về loài chó. Lần này họ muốn tính tuổi trung bình của chó 
// theo tuổi của người.
// Viết 1 hàm gọi là 'calcAverageHumanAge', nhận vào 1 danh sách tuổi của các chú 
// chó ('ages'), và hãy làm theo thứ tự sau
// 1. Tính tuổi của chó theo tuổi của con người theo công thức sau: nếu tuổi của chó 
// <= 2, tuổi của người = tuổi của chó * 2. Nếu tuổi của chó > 2, tuổi người = 16 + 
// tuổi của chó * 4.
// 2. Loại trừ tất cả những chú chó có tuổi nhỏ hơn so với 1 người 18 tuổi (lấy ra tất 
// cả những chú chó trên 18 tuổi)
// 3. Tính tuổi trung bình của các chú chó trưởng thành ra tuổi người
// 4. Chạy hàm với các dữ liệu mẫu dưới đây:
// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

const calcAverageHumanAge = function(ages){
  const humanages = ages.map(age => age <= 2 ? 2 * age : 16 + age * 4)
  // console.log(humanages);
  const list = humanages.filter(age => age >= 18);
    console.log(humanages);
    console.log(list);

  const avg = list.reduce((acc,age,i,arr)=>acc + age / arr.length , 0);
  return avg;
};

const avg1 = calcAverageHumanAge ([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge ([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1,avg2);











// LAB3.4: (SECTION	11: WORKING	WITH	ARRAY > CODING	CHALLENGE	#4)
// Julia và Kate đang học về loài chó, và lần này họ đang học xem sẽ ra sao nếu chó 
// ăn quá nhiều hoặc quá ít.
// Ăn quá nhiều đồng nghĩa với phần ăn của chó lớn hơn mức khẩu phần khuyến 
// nghị và ngược lại nếu ăn quá ít
// Khẩu phần ăn hợp lý là lớn hơn hoặc nhỏ hơn không vượt quá 10% khẩu phần ăn 
// khuyến nghị
// 1. Lặp mảng gồm các object là thông tin của những chú chó, và với mỗi chú chó, 
// thêm 1 thuộc tính mới vào object là khẩu phẩn ăn hợp lý (recommended). KHÔNG 
// TẠO THÊM MẢNG MỚI, chỉ đơn giản là lặp mảng. Công thức: recommendedFood 
// = weight ** 0.75 * 28. (kết quả là khổi lượng thức ăn đượ tính theo gram, và cân 
// nặng của chú chó được tính theo kg)
// 2. Tìm ra chú chó của Sarah và in ra console xem chú chó đó ăn quá nhiều hay quá 
// ít. Lưu ý: Lưu ý 1 vài chú chó có nhiều hơn 1 chủ, vì vậy bạn phải tìm ra Sarah 
// trong mảng 'owner' �
// 3. Tạo ra mảng chứa tất cả chủ của những chú chó ăn quá nhiều 
// ('ownersEatTooMuch') và 1 mảng chứa tất cả chủ của những chú chó ăn quá ít 
// ('ownersEatTooLittle').
// 4. In ra 1 chuỗi tương ứng với mỗi mảng đã tạo ở Yêu cầu 3, Ví dụ: "Matilda and 
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat 
// too little!"
// LẬP TRÌNH JAVASCRIPT NÂNG CAO TRANG 4
// 5. In ra xem có chú chó nào có khẩu phần ăn chính xác với khẩu phần ăn khuyến 
// nghị (output yêu cầu là 'true' hoặc 'false')
// 6. In ra xem có chú chó nào có khẩu phần ăn ở mức hợp lý (không >10% hoặc 
// <10% mức đề nghị)(output yêu cầu là 'true' hoặc 'false')
// 7. In ra tất cả các chú chó có khẩu phần ăn hợp lý (sử dụng lại điều kiện đã tìm 
// được ở y.c 6 để in ra mảng gồm các phần tử thỏa mãn)
// 8. Tạo ra 1 mảng chưa các chú chó mới và sắp xếp theo khẩu phần ăn đề nghị
// theo thứ tự tăng dần (hãy nhớ rằng khẩu phần ăn của mỗi chú chó nằm trong 
// mảng mỗi object thuộc mảng)
// HINT 1: Có thể sử dụng những công cụ khác nhau để xử lý bài toán, bạn có thể
// tổng hợp lại bài học để chọn ra 1 trong số các tất các cách làm mà bạn hiểu �
// HINT 2: Khẩu phần ăn không quá 10% hoặc ít hơn 10% khẩu phần đề nghị có thể
// hiểu như sau: current > (recommended * 0.90) && current < (recommended * 
// 1.10). Cơ bản thì khẩu phần ăn hiện tại nằm trong khoảng 90% và 110% của khẩu 
// phần ăn đề nghị
// TEST DATA:
// const dogs = [
//  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//  { weight: 8, curFood: 200, owners: ['Matilda'] },
//  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//  { weight: 32, curFood: 340, owners: ['Michael'] }
// ];
const dogs = [
	{ weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
	{ weight: 8, curFood: 200, owners: ['Matilda'] },
	{ weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
	{ weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(
	(dog) =>
		// 1. Lặp mảng gồm các object là thông tin của những chú chó, và với mỗi chú chó,
		// thêm 1 thuộc tính mới vào object là khẩu phẩn ăn hợp lý (recommended). KHÔNG
		// TẠO THÊM MẢNG MỚI, chỉ đơn giản là lặp mảng. Công thức: recommendedFood
		// = weight ** 0.75 * 28. (kết quả là khổi lượng thức ăn đượ tính theo gram, và cân
		// nặng của chú chó được tính theo kg)
		(dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);
// 2. Tìm ra chú chó của Sarah và in ra console xem chú chó đó ăn quá nhiều hay quá
// ít. Lưu ý: Lưu ý 1 vài chú chó có nhiều hơn 1 chủ, vì vậy bạn phải tìm ra Sarah
// trong mảng 'owner' �
const dogSarah = dogs.find((dog) => dog.owners.includes('Sarah'));
console.log('🚀 ~ file: app.js:30 ~ dogSarah', dogSarah);
if (dogSarah) {
	console.log(
		`chú chó đó ăn quá ${
			dogSarah?.recommendedFood > dogSarah?.curFood ? 'it' : 'nhều'
		}`
	);
}

// 3. Tạo ra mảng chứa tất cả chủ của những chú chó ăn quá nhiều
// ('ownersEatTooMuch') và 1 mảng chứa tất cả chủ của những chú chó ăn quá ít
// ('ownersEatTooLittle').
const ownersEatTooMuch = dogs
	.filter((dog) => dog.curFood > dog.recommendedFood)
	.map((dog) => dog.owners)
	.flat();
console.log('🚀 ~ file: app.js:45 ~ ownersEatTooMuch', ownersEatTooMuch);
const ownersEatTooLittle = dogs
	.filter((dog) => dog.curFood < dog.recommendedFood)
	.map((dog) => dog.owners)
	.flat();
console.log('🚀 ~ file: app.js:51 ~ ownersEatTooLittle', ownersEatTooLittle);

// 4. In ra 1 chuỗi tương ứng với mỗi mảng đã tạo ở Yêu cầu 3, Ví dụ: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5. In ra xem có chú chó nào có khẩu phần ăn chính xác với khẩu phần ăn khuyến
// nghị (output yêu cầu là 'true' hoặc 'false')
dogs.forEach((dog) => {
	console.log(`${dog.curFood === dog.recommendedFood ? true : false}`);
});

// 6. In ra xem có chú chó nào có khẩu phần ăn ở mức hợp lý (không >10% hoặc
// <10% mức đề nghị)(output yêu cầu là 'true' hoặc 'false')
console.log(
	`${dogs.some((dog) =>
		dog.curFood < dog.recommendedFood * 1.1 ||
		dog.curFood > dog.recommendedFood * 0.9
			? true
			: false
	)}`
);

// 7. In ra tất cả các chú chó có khẩu phần ăn hợp lý (sử dụng lại điều kiện đã tìm
// được ở y.c 6 để in ra mảng gồm các phần tử thỏa mãn)
const check = dogs.filter((dog) => {
	return (
		dog.curFood < dog.recommendedFood * 1.1 &&
		dog.curFood > dog.recommendedFood * 0.9
	);
});
console.log('🚀 ~ file: app.js:84 ~ check ~ check', check);

// 8. Tạo ra 1 mảng chưa các chú chó mới và sắp xếp theo khẩu phần ăn đề nghị
// theo thứ tự tăng dần (hãy nhớ rằng khẩu phần ăn của mỗi chú chó nằm trong
// mảng mỗi object thuộc mảng)
const dogCopy = [...dogs].sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log('🚀 ~ file: app.js:90 ~ dogCopy', dogCopy);

