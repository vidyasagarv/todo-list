$(function(){

  $.get('/todos', appendToList);

  $('form').on('submit', function(event) {
    event.preventDefault();

    var form = $(this);
    var todoData = form.serialize();

    $('.alert').hide();

    $.ajax({
      type: 'POST', url: '/todos', data: todoData
    })
    .error(function() {
      $('.alert').show();
    })
    .success(function(todoName){
      appendToList([todoName]);
      form.trigger('reset');
    });
  });

  function appendToList(todos) {
    var list = [];
    var content, todo;
    for(var i in todos){
      todo = todos[i];
      content = '<a href="/todos/'+todo+'">'+todo+'</a>'+ // + // example on how to serve static images
        ' <a href="#" data-todo="'+todo+'">'+
        '<img src="delete.png" width="15px"></a>';
      list.push($('<li>', { html: content }));
    }

    $('.todo-list').append(list)
  }


  $('.todo-list').on('click', 'a[data-todo]', function (event) {
    if(!confirm('Are you sure ?')){
      return false;
    }

    var target = $(event.currentTarget);

    $.ajax({
      type: 'DELETE',
      url: '/todos/' + target.data('todo')
    }).done(function () {
      target.parents('li').remove();
    });
  });

});