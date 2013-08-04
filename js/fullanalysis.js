$(function() {

	$$("analysis").dataTable({
        "bAutoWidth": false,
		"aoColumns": [
        	{ "sWidth": "110px" },
        	{ "sWidth": "200px" },
        	{ "sWidth": "120px" },
            { "sWidth": "35px" },
            { "sWidth": "320px" },
            { "sWidth": "100px" }
    	],
        "fnPreDrawCallback": function() {
            $(".rating").raty({
                round: { down: .26, full: .6, up: .91 },
                readOnly: true, 
                hints: ["Poor","Okay","Moderate","Good","Excellent"],
                path: 'img',               
                score: function() {
                    return $(this).attr('data-score');
                }
            });
        }
    });

    $(".csvexport").click(function() {
        ga('send', 'event', 'Subscription Features', 'click', 'Subscribe [CSV]');
    });
});