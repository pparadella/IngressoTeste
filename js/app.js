var initialMovies = [];
$.ajax({
  url:
    "https://api-content.ingresso.com/v0/templates/highlights/1/partnership/home",
  type: "GET",
  async:false,
	dataType: "json",
  headers: {
    accept: "application/jsonp;odata=verbose"
  },
  success: function(data) {
    initialMovies.push(data);
    
  },
  error: function(data) {
    console.log(data);
  }
});
$.ajax({
  url:
    "https://api-content.ingresso.com/v0/templates/highlights/2/partnership/home",
  type: "GET",
  async:false,
	dataType: "json",
  headers: {
    accept: "application/jsonp;odata=verbose"
  },
  success: function(data) {
    initialMovies.push(data);
  },
  error: function(data) {
    console.log(data);
  }
});
function closePopUp (){
  $('.popUp').css('display','none');
  $('.popUp article iframe').attr('src','');
}
function toggleChangeCity (){
  var elem = document.getElementsByClassName('changeCity')
  if (elem[0].style.display == ""){
    elem[0].style.display = "block"
  }else{
    elem[0].style.display = ""
  }
}
function filter(filtro){
  console.log(filtro);
}

function searchMovie (){
  var input, filter, main, article, a, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    main = document.getElementsByTagName('main');
    article = main[0].getElementsByTagName("article");
    for (i = 0; i < article.length; i++) {
        a = article[i].getElementsByClassName('nome')[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            article[i].style.display = "block";
        } else {
            article[i].style.display = "none";
        }
    }
}

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

  this.type = ko.computed(function(){
    var showTimes = data.showtimes;
    var types = [];
    showTimes.forEach(function (item){
      item.rooms.forEach(function(sala){
        sala.sessions[0].type.forEach(function(type){
          types.push(type);
        });
      });
    });
    types = types.filter((v,i) => types.indexOf(v) === i);
    return types;
  },this);

  this.trailer = ko.computed(function(){
    var trailer1 = data.event.trailers;
    //console.log(trailer1)
    if (trailer1.length == 0){
      trailer1 = data.event.siteURL;
    }else{
      trailer1 = 'https:'+data.event.trailers[0].embeddedUrl;
    }
    return trailer1;
  },this);
}

var ViewModel = function (){
  var self = this;

  this.cities = ko.observableArray(['São Paulo','Rio de Janeiro']);
  this.currentCity = ko.observable('São Paulo');
  /*
  this.movies = ko.observableArray([]);

  initialMovies[0].forEach(function(movieItem){
    self.movies.push(new Movie(movieItem));
  });
  */

  this.typeChecked = ko.observableArray([]);

  this.check = function (){
    return true;
  };
  //console.log(checked);
  this.movies = ko.computed(function(){
    var movie = []
    if (self.currentCity() == 'São Paulo' ){

      initialMovies[0].forEach(function(movieItem){
        movie.push(new Movie(movieItem));
      });

    }else if (self.currentCity() == 'Rio de Janeiro' ){
      initialMovies[1].forEach(function(movieItem){
        movie.push(new Movie(movieItem));
      });
    }


    //console.log(movie)
    return movie;
  },this);

  this.currentMovies = ko.computed(function(){
    var newMovies = []
    if (self.typeChecked() != ''){
      for (i in self.movies()){
        for (j in self.typeChecked()){
          if (self.movies()[i].type().includes(self.typeChecked()[j])){
            newMovies.push(self.movies()[i]);

            break;
          }
        }
      }
    }else{
      newMovies = self.movies();
    }
    return newMovies;
  },this);

  this.changeCity =  function (city){
    //console.log(city)
    self.currentCity(city);
  };


  this.type = ko.computed(function(){
    var types = [];
    self.movies().forEach(function(item){
      item.type().forEach(function(type){
        types.push(type);
      });
    });
    types = types.filter((v,i) => types.indexOf(v) === i);
    return types;
  },this);

  this.showTrailer = function (movie){
    var string = movie.trailer();
    if (string.includes("youtube")){
      $('.popUp article iframe').attr('src',movie.trailer());
      $('.popUp').css('display','flex');
    }else{
      window.location.href = string;
    }
  };

}

ko.applyBindings(new ViewModel());
