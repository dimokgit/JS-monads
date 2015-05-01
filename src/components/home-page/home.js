define(["knockout", "text!./home.html", "promise-monad"], function (ko, homeTemplate, PromiseMonad) {

  function fetch(search) {
    var p = $.Deferred();
    var req = $.ajax({
      type: "GET",
      crossDomain: true,
      url: search
    }).done(function (data) {
      p.resolve(data.count == 0 ? "Wrong address" : data);
    }).fail(function (error) {
      p.reject(error);
    });
    return p;
  }

  function HomeViewModel(route) {
    var me = this;
    this.message = ko.observable('Waiting for google search ...');
    this.error = ko.observable("")
    this.search = ko.observable("Nothing found yet.")
    // Init PM with fetch and show funcs
    var google = new PromiseMonad(fetch, PromiseMonad.lift(show));
    // Push some more funcs
    google.push(PromiseMonad.lift(function (msg) { return PromiseMonad.version + ":" + msg + " @ " + Date(); }));
    // Start processing pipe by "pumpimg" initial value
    google.pump("http://www.msn.com")
    //google.pump("http://www.google.com")
      .done(me.message)
      .fail(function (e) {
        me.error(JSON.stringify(e));
      });
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
