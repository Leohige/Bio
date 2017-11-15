// Init the app
$(document).ready(function(){
  createAllCards();
  createSearchFunction();
});

// When the main page is loaded all cards are shown
function createAllCards(){
  var jqxhr = $.get( "assets/json/diseases.json", function( data ) {
    $.each(data.diseases, function(i, disease) {
      $('#diseases').append(createCard(disease));
    })
  })
    .done(function() {
      configureButtons();
    })
    .fail(function() {
      $('#diseases').html('').html(withError());
    })
}

// Configure the cards buttons to call the correct modal
function configureButtons(){
  $(".view").click(function() {
    let id = $(this).val();
    createModal();
    createDiseaseModal(id);
  });
}

// Creates a disease card with title, image and button.
function createCard(disease){
  return '<div class="col-lg-4 col-md-6 col-sm-12 ' + disease.id + '"><div class="bs-component"><div class="card"><h3 class="card-header">' + disease.name + '</h3><img style="height: 200px; width: 100%; display: block; object-fit: cover;" src="' + disease.image + '" alt="Card image"><div class="card-body text-center"><button type="button" id="view" class="btn btn-success view" value="' + disease.id + '"><i class="fa fa-eye"></i> Visualizar</button></div></div></div></div>';  
}

// Creates a modal with full disease content
function createDiseaseModal(id){
  var jqxhr = $.get( "assets/json/diseases.json", function( data ) {
    $.each(data.diseases, function(i, disease) {
      if (disease.id == id){
        createModalWithContent(disease);
        return
      }
    })
  })
    .done(function() {
      configureButtons();
    })
    .fail(function() {
      $('#diseases').html('').html(withError());
    })
}

// Creates a default modal when the content is loaded
function createModal(){
  let html = '<div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-body">Carregando...</div></div></div>';
  $('#disease-modal').empty();
  $('#disease-modal').html(html);
  $('#disease-modal').modal('show');
}

function madeSearch(name){
  var jqxhr = $.get( "assets/json/diseases.json", function( data ) {
    let ignore = []; 
    $.each(data.diseases, function(i, disease) {
      let res = disease.name.toUpperCase().match(new RegExp(name.toUpperCase(), 'g'));
      if (res != undefined && res.length > 0){
        if ($('.' + disease.id).length == 0){
          card = createCard(disease);
          $('#diseases').append(card);
        }
        ignore.push('.' + disease.id);
      }
    })
    $("#diseases > *:not('" + ignore.join(', ') + "')").remove();
  })
    .done(function() {
      if ($('#diseases').children().length == 0){
        $('#diseases').html('').html(noResults());
      }
      configureButtons();
    })
    .fail(function() {
      $('#diseases').html('').html(withError());
    })
}

function createSearchFunction(){
  $( "#search" ).keyup(function() {
    let search = $(this).val();

    // If there is an error message it will be removed 
    if ($('.msg-error').length > 0){
      $('.msg-error').remove();
    }

    // If there is an no results message it will be removed
    if ($('.msg-no-results').length > 0){
      $('.msg-no-results').remove();
    }
  
    if (search.length == 0){
      createMissingCards();
    }else{
      madeSearch(search);
    }
  });
}

// Made a modal with disease content
function createModalWithContent(disease){
  let html = '<div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' + disease.name + '</h4><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div><div class="modal-body"></div></div></div>';
  $('#disease-modal').empty();
  $('#disease-modal').html(html);
  $('#disease-modal').modal('show');
}

// Creates missing cards
function createMissingCards(){
  var jqxhr = $.get( "assets/json/diseases.json", function( data ) {
    $.each(data.diseases, function(i, disease) {
      if ($('.' + disease.id).length == 0){
        card = createCard(disease);
        $('#diseases').append(card);
      }
    })
  })
    .done(function() {
      configureButtons();
    })
    .fail(function() {
      $('#diseases').html('').html(withError());
    })
}

// No results message
function noResults(){
  return html = '<div class="msg-error msg-no-results"><div class="alert alert-dismissible alert-danger">Nenhum resultado para sua pesquisa.</div></div>';
}

// Error message
function withError(){
  return html = '<div class="msg-error"><div class="alert alert-dismissible alert-danger">Ocorreu um erro desconhecido.</div></div>';
}
