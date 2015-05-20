define(["knockout", "promise-monad"], function (ko, PromiseMonad) {

  function fetch(url) {
    var p = $.Deferred();
    var req = $.ajax({
      type: "GET",
      crossDomain: true,
      url: url
    }).done(function (data) {
      p.resolve(data.count == 0 ? "Wrong address" : data);
    }).fail(function (error) {
      p.reject({ url: url, error: error });
    });
    return p;
  }

  function HomeViewModel(url) {
    var me = this;
    this.message = ko.observable('Waiting for google search ...');
    this.error = ko.observable("")
    this.search = ko.observable("Nothing found yet.")
    // Init PM with fetch and show funcs
    var google = new PromiseMonad(fetch, show);
    // Push some more funcs
    google.push(function (msg) { return PromiseMonad.version + ":" + msg + " @ " + Date(); });
    // Start processing pipe by "pumpimg" initial value
    google.pump(url)
      .done(me.message)
      .fail(function (e) {
        me.error(JSON.stringify(e), null, 2);
      });
    function show(text) {
      me.search(text);
      return "Done";
    }
  }

  return HomeViewModel;

});
