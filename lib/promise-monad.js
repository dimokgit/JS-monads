(function () {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else
    throw new Error("PromiseMonad requires RequireJS");
  function factory($) {
    function PromiseMonad() {
      var funcArray = Array.prototype.slice.call(arguments);
      /*** Public ***/
      this.push = function (f) {
        funcArray.push(f); return this;
      }
      // Pump a starting value to the execution pipe
      this.pump = function (x) { return pipe(x, funcArray); }
      /*** Private ***/
      // bind :: Promise a -> (a -> Promise b) -> Promise b
      function bind(input, f) {
        var output = $.Deferred();
        $.when(input)
          .done(function (x) {
            $.when(f(x))
            .done(function (y) {
              output.resolve(y);
            })
            .fail(function (y) {
              output.reject(y);
            });
          })
          .fail(function (x) {
            output.reject(x);
          });
        return output;
      };
      // pipe :: [a] -> [a -> [b]] -> [b]
      function pipe(x, functions) {
        for (var i = 0, n = functions.length; i < n; i++) {
          x = bind(x, functions[i]);
        }
        return x;
      };
    }
    // unit :: a -> Promise a
    PromiseMonad.unit = function unit(x) {
      return arguments.length ? new $.when(x) : $.Deferred();
    };
    // lift :: (x -> y) -> (x -> Promise y)
    PromiseMonad.lift = function lift(f) {
      return function (x) {
        return PromiseMonad.unit(f(x));
      }
    };
    PromiseMonad.version = "0.1.1";
    return PromiseMonad;
  }
})();
