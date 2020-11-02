// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
// https://tc39.es/ecma402/#numberformat-objects

//function formatNumberCurrency(num, currency = "USD", locale="en-US", ) {
//   return 
//}

// numberSignColor(num)
// return boostrap color and minus sign if num is negative
function numberSignColor(num) {
   if (num < 0) {
      var color = "text-danger";
      var sign = "";
   } else {
      var color = "text-success";
      var sign = "+";
   }
   return {color: color, sign: sign};
}

// myError(err)
// error Handle
function myError(err) {
   console.log(err);
   $("#error").html(err);
}