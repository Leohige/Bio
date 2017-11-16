// Init the app
$(document).ready(function(){
  var jqxhr = $.get( "assets/json/diseases.json", function( data ) {
    localStorage.setItem('diseases', JSON.stringify(data.diseases));
  })
    .done(function() {
      createThatCards(getDiseases());
      configureSearch();
    })
    .fail(function() {
      $('#diseases').html(errorMsg('Ocorreu um erro ao carregar os dados.'));
    })
});

function configureSearch(){
  $("#search").keyup(function() {
    let name = $(this).val();

    removeMsg();
  
    if (name.length == 0){
      createThatCards(getMissingDiseases());
    }else{
      makeSearch(name);
    }
  });
}

function makeSearch(name){
  let cards = [];

  $.each(getDiseases(), function(i, disease) {
    let result = disease.name.toUpperCase().match(new RegExp(name.toUpperCase(), 'g'));

    if ((result != undefined) && (result.length > 0)){
      if ($('.' + disease.id).length == 0){
        cards.push(disease);
      }
    }else{
      $('.' + disease.id).remove();
    }
  });

  createThatCards(cards);

  if ($('#diseases').children().length == 0){
    $('#diseases').html(errorMsg('Nada foi encontrando.'));
  }
}

function getMissingDiseases(){
  cards = [];

  $.each(getDiseases(), function(i, disease){
    if ($('.' + disease.id).length == 0){
      cards.push(disease);
    }
  });

  return cards;
}

function configureButtons(){
  $(".view").click(function() {
    let id = $(this).val();
    createModal(getDiseaseById(id));
  });
}

function createAllCards(){
  $.each(getDiseases(), function(i, disease) {
    createCard(disease);
  })
}

function configureButtons(){
  $(".view").click(function() {
    let id = $(this).val();
    createModal(id);
  });
}

function createThatCards(diseases){
  removeMsg();

  $.each(diseases, function(i, disease) {
    createCard(disease);
  });

  configureButtons();
}

function createCard(disease){
  let html = '<div class="col-lg-4 col-md-6 col-sm-12 ' + disease.id + '"><div class="bs-component"><div class="card"><h3 class="card-header">' + disease.name + '</h3><img style="height: 200px; width: 100%; display: block; object-fit: cover;" src="' + disease.image + '" alt="Card image"><div class="card-body text-center"><button type="button" id="view" class="btn btn-success view" value="' + disease.id + '"><i class="fa fa-eye"></i> Visualizar</button></div></div></div></div>';  

  $('#diseases').append(html);
}

function createModal(id){
  let disease = getDiseaseById(id);
  let html = '<div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' + disease.name + '</h4><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div><div class="modal-body"></div></div></div>';
  
  $('#disease-modal').empty();
  $('#disease-modal').html(html);
  $('#disease-modal').modal('show');
}

function getDiseases(){
  return JSON.parse(localStorage.getItem('diseases'));
}

function getDiseaseById(id){
  let result = undefined;

  $.each(getDiseases(), function(i, disease) {
    if (disease.id == id){
      result = disease;
      return
    }
  });

  return result;
}

function errorMsg(msg){
  return '<div class="msg-error"><div class="alert alert-dismissible alert-danger">' + msg + '</div></div>'
}

function removeMsg(){
  if ($('.msg-error').length > 0){
    $('.msg-error').remove();
  }
}