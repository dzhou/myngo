
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
    $('a[name="cloneDB"]').click(function () {
	var dbName = $(this).parent().siblings().first().children('a').text();
	$('#cloneDBDiv h3').text('Enter name for clone of database "'+dbName+'":');
	$('#cloneDBDiv form input[name="original"]').attr('value', dbName);
	$(this).overlay({api: true}).load();
	$('#cloneDBDiv input').focus();
    });
    $('a[name="dropDB"]').click(function () {
	var dbName = $(this).parent().siblings().first().children('a').text();
	$('#dropDBDiv h3').text('Are you sure you want to drop database "'+dbName+'"?');
	$('#dropDBDiv form input[name="db"]').attr('value', dbName);
	$(this).overlay({api: true}).load();
    });
    $('#dropDBDiv form button[value="No"]').click(function () {
	/* $('#dropDBDiv').overlay().close(); */
	/* close drop database overlay by immitating click on the
	   "cancel" button as the previous doesn't work */
	$('#dropDBDiv div.close').click();
    });
    $('a[name="repairDB"]').click(function () {
	var dbName = $(this).parent().siblings().first().children('a').text();
	$('#repairDBDiv h3').text('Really repair the database "'+dbName+'"?');
	$('#repairDBDiv form input[name="db"]').attr('value', dbName);
	$(this).overlay({api: true}).load();	
    });

    /* submitting the DB clone form */
    $('#cloneDBDiv form').submit(function () {
	var url = $(this).attr('action');
	var data = $(this).serialize();
	xpost(url,
	      data,
	      function () {
		  $('#actionWinDiv').overlay({api: true}).load();
		  setTimeout(function () {
		      $('#actionWinDiv').overlay().close();
		      document.location = '/';
		  }, 809);
	      },
	      function () {
		  $('#actionFailDiv').overlay({api: true}).load();
	      });
	return false;
    });
    /* submitting the DB drop form */
    $('#dropDBDiv form').submit(function () {
	var url = $(this).attr('action');
	var data = $(this).serialize();
	xpost(url,
	      data,
	      function () {
		  $('#actionWinDiv').overlay({api: true}).load();
		  setTimeout(function () {
		      $('#actionWinDiv').overlay().close();
		      document.location = '/';
		  }, 809);
	      },
	      function () {
		  $('#actionFailDiv').overlay({api: true}).load();
	      });
	return false;
    });
    /* submitting the DB repair form */
    $('#repairDBDiv form').submit(function () {
	var url = $(this).attr('action');
	var data = $(this).serialize();
	xpost(url,
	      data,
	      function () {
		  $('#actionWinDiv').overlay({api: true}).load();
		  setTimeout(function () {
		      $('#actionWinDiv').overlay().close();
		  }, 809);
	      },
	      function () {
		  $('#actionFailDiv').overlay({api: true}).load();
		  return false;
	      });
	return false;
    });

    /* actions on the collection list page */
    $('a[name="dropColl"]').click(function () {
	var collName = $(this).parent().siblings('td:first').text();
	$('#dropCollDiv h3').text('Are you sure you want to drop collection "'+collName+'"?');
	$('#dropCollDiv form input[name="coll"]').attr('value', collName);
	$(this).overlay({api: true}).load();
    });
    $('#dropCollDiv form button[value="No"]').click(function () {
	$('#dropCollDiv div.close').click(); /* for expl. see the same method at drop DB */
    });
    $('a[name="renameColl"]').click(function () {
	var collName = $(this).parent().siblings('td:first').text();
	$('#renameCollDiv h3').text('Enter new name for collection "'+collName+'":');
	$('#renameCollDiv form input[name="original"]').attr('value', collName);
	$(this).overlay({api: true}).load();
	$('#renameCollDiv input[name="new"]').focus();
    });
    $('a[name="validateColl"]').click(function () {
	var collName = $(this).parent().siblings('td:first').text();
	$('#validateCollDiv form input[name="coll"]').attr('value', collName);
	var url = $('#validateCollDiv form').attr('action');
	xpost(url,
	      $('#validateCollDiv form').serialize(),
	      function (data) {
		  $('#validateCollDiv h3').text('Result of validating "'+data.ns+'":');
		  $('#validateCollDiv h3').after(data.result);
		  $('#validateCollDiv').overlay({api: true}).load();
		  return false;
	      },
	      function () {
		  $('#actionFailDiv').overlay({api: true}).load();
		  return false;
	      });
	$('#validateCollDiv form').remove();
	return false;
    });

    /* submitting the collection rename form */
    $('#renameCollDiv form').submit(function () {
	var url = $(this).attr('action');
	var data = $(this).serialize();
	xpost(url,
	      data,
	      function () {
		  $('#actionWinDiv').overlay({api: true}).load();
		  setTimeout(function () {
		      $('#actionWinDiv').overlay().close();
		      document.location = document.location.pathname;
		  }, 809);
		  return false;
	      },
	      function () {
		  $('#actionFailDiv').overlay({api: true}).load();
		  return false;
	      });
	return false;
    });
    /* submitting the collection drop form */
    $('#dropCollDiv form').submit(function () {
	var url = $(this).attr('action');
	var data = $(this).serialize();
	xpost(url,
	      data,
	      function () {
		  $('#actionWinDiv').overlay({api: true}).load();
		  setTimeout(function () {
		      $('#actionWinDiv').overlay().close();
		      document.location = document.location.pathname;
		  }, 809);
		  return false;
	      },
	      function () {
		  $('#actionFailDiv').overlay({api: true}).load();
		  return false;
	      });
	return false;
    });
});