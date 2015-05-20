define(["knockout", "text!../home-page/home.html", "HomeViewModel"], function (ko, homeTemplate, HomeViewModel) {

  return { viewModel: function HVM() { return new HomeViewModel("http://www.google.com"); }, template: homeTemplate };

});
