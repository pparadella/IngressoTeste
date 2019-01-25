var initialMovies;
$.ajax({
  url:
    "https://demo7856830.mockable.io/?fbclid=IwAR2rWVWFJUkbZ2i3VbirbcfhcBj57kuOB2G7olMCH7_NGlKDqF1aVOCqqhs",
  type: "GET",
  async:false,
	dataType: "json",
  headers: {
    accept: "application/jsonp;odata=verbose"
  },
  success: function(data) {
    initialMovies = data;
  },
  error: function(data) {
    console.log(data);
  }
});

var Movie = function (data){
  this.name = ko.observable(data.event.title);
  this.image = ko.observable(data.event.images[0].url);
  this.tags = ko.computed(function(){
    var tags = data.event.tags;
    var newTags = [];
    tags.forEach(function (item){
      if  (item == 'Família'){
        newTags.push([item,'familia']);
      }else{
        newTags.push([item,'generic']);
      }
    });
    return newTags;
  },this);
}

var ViewModel = function (){
  var self = this;

  this.movies = ko.observableArray([]);

  initialMovies.forEach(function(movieItem){
    self.movies.push(new Movie(movieItem));
  });

}

ko.applyBindings(new ViewModel());
