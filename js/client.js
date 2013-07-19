$(function() {

    $.pnotify.defaults.history = false;
    $.pnotify.defaults.delay = 4000;

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
    	],
        "fnPreDrawCallback": function() {
            $(".rating").raty({
                readOnly: true, 
                hints: ["Poor","Okay","Moderate","Good","Excellent"],
                path: 'img'
            });

            $(".trunc").truncate({
                width: 300,
                token: '&hellip;',
                side: 'right',
                multiline: false
            });
        }
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

    $("[rel=tooltip]").livequery(function() {
        $(this).tooltip({
            container: 'body'
        });
    });

    $(document).on("click", ".flag-content", function(e) {
        e.preventDefault();
        var $this = $(this);

        var defaults = {
            width: "30%",
            addclass: "stack-bar-top",
            cornerclass: "",
            hide: true,
            sticker: false,
            stack: {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0}
        };

        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            data: {
                id: $(this).attr('data-id'),
                name: $(this).closest('.modal').find('.name').text(),
                action: 'flag'
            }
        }).done(function() {
            $this.addClass('disabled');
            var opts = {
                title: "Thanks for your report!",
                text: "Your request to review this company has been accepted.",
                type: "success"
            };
            $.pnotify($.extend(defaults, opts));
        }).fail(function() {
            var opts = {
                title: "Error flagging this content!",
                text: "A solid connection to the server could not be established. Please try again later.",
                type: "error"
            };
            $.pnotify($.extend(defaults, opts));
        });
    });
});

