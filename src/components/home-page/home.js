define(["knockout", "text!./home.html", "promise-monad"], function (ko, homeTemplate, PromiseMonad) {

  function fetch(search) {
    var p = $.Deferred();
    var req = $.ajax({
      type: "GET",
      crossDomain: true,
      url: "http://www.msn.com"
    }).done(function (data) {
      p.resolve(data.count == 0 ? "Wrong address" : data);
    }).fail(function (error) {
      p.resolve(JSON.stringify(error));
    });
    return p;
  }

  function HomeViewModel(route) {
    var me = this;
    this.message = ko.observable('Waiting for google search ...');
    this.search = ko.observable("Nothing found yet.")
    // Init PM with fetch and show funcs
    var google = new PromiseMonad(fetch, PromiseMonad.lift(show));
    // Push some more funcs
    google.push(PromiseMonad.lift(function (msg) { return msg + " @ " + Date(); }));
    // Start processing pipe by "pumpimg" initial value
    google.pump("itau").always(me.message);
    function show(text) {
      me.search(text);
      return "Done";
    }
  }

  HomeViewModel.prototype.doSomething = function() {
    this.message('You invoked doSomething() on the viewmodel.');
  };

  return { viewModel: HomeViewModel, template: homeTemplate };

});
