
$(document).ready(function () {
    var xget = function(url, successHandler, errorHandler) {
	var onResponse = function(data, status) {
	    if (data.success) {
		successHandler(data);
	    }
	    else {
		errorHandler(data);
	    }
	};
	$.ajax({dataType: 'json',
		error: function(request, status, err) {
		    /*alert('AJAX error: '+status);*/
		    $('#actionFailDiv').overlay({api: true}).load();
		},
	        success: onResponse,
		type: 'GET',
		url: url});
    };

    var xpost = function(url, data, successHandler, errorHandler) {
	var onResponse = function(data, status) {
	    if (data.success) {
		successHandler(data);
	    }
	    else {
		errorHandler(data);
	    }
	};
	$.ajax({data: data,
		dataType: 'json',
		error: function(request, status, err) {
		    /*alert('AJAX error: '+status);*/
		    $('#actionFailDiv').overlay({api: true}).load();
		},
	        success: onResponse,
	        type: 'POST',
	        url: url})
    };

    /* notify about AJAX */
    $('#inajax').bind('ajaxSend', function () {
	$(this).show();
    }).bind('ajaxComplete', function () {
	$(this).hide();
    });

    /* actions on the DB list page */
    $('a[name="clone"]').click(function () {
	var dbName = $(this).parent().siblings().first().children('a').text();
	$('#cloneDiv h3').text('Enter name for clone of database "'+dbName+'":');
	$('#cloneDiv form input[name="original"]').attr('value', dbName);
	$(this).overlay({api: true}).load();
	$('#cloneDiv input').focus();
    });
    $('a[name="drop"]').click(function () {
	var dbName = $(this).parent().siblings().first().children('a').text();
	$('#dropDiv h3').text('Are you sure you want to drop database "'+dbName+'"?');
	$('#dropDiv form input[name="db"]').attr('value', dbName);
	$(this).overlay({api: true}).load();
    });
    $('#dropDiv form button[value="No"]').click(function () {
	/* $('#dropDiv').overlay().close(); */
	/* close drop database overlay by immitating click on the
	   "cancel" button as the previous doesn't work */
	$('#dropDiv div.close').click();
    });
    $('a[name="repair"]').click(function () {
	var dbName = $(this).parent().siblings().first().children('a').text();
	$('#repairDiv h3').text('Really repair the database "'+dbName+'"?');
	$('#repairDiv form input[name="db"]').attr('value', dbName);
	$(this).overlay({api: true}).load();	
    });

    /* submitting the DB clone form */
    $('#cloneDiv form').submit(function () {
	var url = $(this).attr('action');
	var val = $(this).children('input').val();
	var data = $(this).serialize();
	xpost(url,
	      data,
	      function () {
		  $('#actionWinDiv').overlay({api: true}).load();
		  setTimeout(function () {
		      $('#actionWinDiv').overlay().close();
		      document.location = '/';
		  }, 1618);
	      },
	      function () {
		  $('#actionFailDiv').overlay({api: true}).load();
	      });
	return false;
    });
    /* submitting the DB drop form */
    $('#dropDiv form').submit(function () {
	var url = $(this).attr('action');
	var data = $(this).serialize();
	xpost(url,
	      data,
	      function () {
		  $('#actionWinDiv').overlay({api: true}).load();
		  setTimeout(function () {
		      $('#actionWinDiv').overlay().close();
		      document.location = '/';
		  }, 1618);
	      },
	      function () {
		  $('#actionFailDiv').overlay({api: true}).load();
	      });
	return false;
    });
    /* submitting the DB repair form */
    $('#repairDiv form').submit(function () {
	var url = $(this).attr('action');
	var data = $(this).serialize();
	xpost(url,
	      data,
	      function () {
		  $('#actionWinDiv').overlay({api: true}).load();
		  setTimeout(function () {
		      $('#actionWinDiv').overlay().close();
		  }, 1618);
	      },
	      function () {
		  $('#actionFailDiv').overlay({api: true}).load();
	      });
	return false;
    });
});