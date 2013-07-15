$(function() {
	$$("clients").dataTable({
		"aoColumns": [
        	{ "sWidth": "25%" },
        	{ "sWidth": "50%" },
        	{ "sWidth": "20%" },
        	{ "sWidth": "15%", "bSortable": false },
        	{ "sWidth": "15%", "bSortable": false },
        	{ "sWidth": "15%", "bSortable": false },
    	]
    });

    $('[data-toggle="modal"]').click(function(e) {
        e.preventDefault();

        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            data: {
                id: $(this).attr('data-id'),
                action: 'get'
            }
        }).done(function(data) {
            $(data).modal();
        });
    });
});

