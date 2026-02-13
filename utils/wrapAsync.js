function wrapAsync(fn){  //Adding wrapper func to errors
   return function (req,res,next){
      fn(req,res,next).catch(next);
   }
}

module.exports = wrapAsync;