$(function() {
	$$("clients").dataTable({
        "bAutoWidth": false,
		"aoColumns": [
        	{ "sWidth": "110px" },
        	{ "sWidth": "300px" },
        	{ "sWidth": "120px" },
            { "sWidth": "320px" },
        	{ "sWidth": "120px", "bSearchable": false },
        	{ "sWidth": "80px", "bSortable": false, "bSearchable": false },
        	{ "sWidth": "90px", "bSortable": false, "bSearchable": false }
    	]
    });

    $(document).on('click', '.info[data-toggle="modal"]', function(e) {
        e.preventDefault();

        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            data: {
                id: $(this).attr('data-id'),
                action: 'get'
            }
        }).done(function(data) {
            if(!isModalActive())
                $(data).modal();
        });
    });

    $(document).on("click", ".analyze[data-toggle='modal']", function(e) {
        e.preventDefault();

        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            data: {
                id: $(this).attr('data-id'),
                site: $(this).attr('data-url'),
                action: 'analyze'
            }
        }).done(function(data) {
            if(!isModalActive())
                $(data).modal();
        });
    });

    $(".rating").livequery(function() {
        $(this).raty({
            readOnly: true, 
            hints: ["a","b","c","d","e"],
            path: 'img'
        });
    });

    $(".trunc").livequery(function() {
        $(this).truncate({
            width: 300,
            token: '&hellip;',
            side: 'right',
            multiline: false
        });
    });
});

