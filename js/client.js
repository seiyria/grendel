$(function() {

    initializeDefaults();

	$$("clients").dataTable({
        "bAutoWidth": false,
		"aoColumns": [
        	{ "sWidth": "110px" },
        	{ "sWidth": "300px" },
        	{ "sWidth": "120px" },
            { "sWidth": "320px" },
        	{ "sWidth": "120px", "bSearchable": false },
        	{ "sWidth": "85px", "bSortable": false, "bSearchable": false },
        	{ "sWidth": "95px", "bSortable": false, "bSearchable": false }
    	],
        "fnPreDrawCallback": function() {
            $(".rating").raty({
                readOnly: true, 
                hints: ["Poor","Okay","Moderate","Good","Excellent"],
                path: 'img',               
                score: function() {
                    return $(this).attr('data-score');
                }
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

        $.blockUI();

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
        }).fail(function(data) {

        }).always(function(data) {
            $.unblockUI();
        });
    });

    $(document).on("click", ".analyze[data-toggle='modal']", function(e) {
        e.preventDefault();

        $.blockUI();

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

        }).fail(function(data) {

        }).always(function(data) {
            $.unblockUI();
        });
    });

    $(document).on("click", ".flag-content", function(e) {
        e.preventDefault();
        var $this = $(this);

        if($this.hasClass('disabled')) return;

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
            $.pnotify(opts);
        }).fail(function() {
            var opts = {
                title: "Error flagging this content!",
                text: "A solid connection to the server could not be established. Please try again later.",
                type: "error"
            };
            $.pnotify(opts);
        });
    });

    $("[rel=tooltip]").livequery(function() {
        $(this).tooltip({
            container: 'body'
        });
    });

    $(".modal-body").livequery(function() {
        $(this).niceScroll();
    });
});

function initializeDefaults() {
    var pnotifyDefaults = {
        width: "30%",
        addclass: "stack-bar-top",
        cornerclass: "",
        hide: true,
        sticker: false,
        stack: {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0},
        history: false,
        delay: 4000
    };

    $.extend($.pnotify.defaults, pnotifyDefaults);

    var blockUIDefaults = {
        overlayCSS: {
            opacity: 0.8,
            cursor: "wait",
            backgroundColor: "#000"
        },
        message: $("#loader")
    };

    $.extend($.blockUI.defaults, blockUIDefaults);
}