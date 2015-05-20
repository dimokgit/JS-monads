define(["knockout", "text!./home.html", "HomeViewModel"], function (ko, homeTemplate, HomeViewModel) {

  return { viewModel: function HVM() { return new HomeViewModel("http://www.msn.com"); }, template: homeTemplate };

});
