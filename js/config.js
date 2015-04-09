
var config = {
    mongolabURL: 'https://api.mongolab.com/api/1/databases/',
    mongolabApiKey: 'HIAnTqs9nA7nOr9qJW9PvrDkgfU9Ia0R',
    team_prospectsURL: 'baseball/collections/team_prospects',
    pending_tradesURL: 'baseball/collections/pending_trades',
    completed_tradesURL: 'baseball/collections/completed_trades'
};

var elements = {
    content: null,
    table: null,
    table_body: null,
    active_datatable: null,
    prospects_btn: null,
    bryan_btn: null,
    cary_btn: null,
    larry_btn: null,
    mike_btn: null,
    mitchel_btn: null,
    tad_btn: null,
    completed_trades_btn: null,
    pending_trades_btn: null,
    submit_trades_btn: null,
    submit_trade_btn: null,
    cancel_trade_btn: null,
    message: null,
    page_link: null,
    submit_trade_sec: null,
    pending_trades_table: null,
    completed_trades_table: null
};

var config_data = {
    prospects: {}
};

function showError(header, message) {
    $('#message').remove();
    var error_msg = $('<div></div>').attr('id', 'message')
        .attr('class', 'alert alert-danger alert-dismissible fade in')
        .attr('role', 'alert');

    var close_btn = $('<button></button>').attr('type', 'button')
        .attr('class', 'close')
        .attr('data-dismiss', 'alert')
        .attr('aria-label', 'Close');

    var close = $('<span></span>').attr('aria-hidden', 'true').html('&times;');
    close_btn.append(close);
    error_msg.append(close_btn);

    var header_html = $('<h4></h4>').html(header);
    var msg_html = $('<p></p>').html(message);

    error_msg.append(header_html).append(msg_html);

    elements.content.append(error_msg);
}

function showSuccess(header, message) {
    $('#message').remove();
    var error_msg = $('<div></div>').attr('id', 'message')
        .attr('class', 'alert alert-success fade in')
        .attr('role', 'alert');

    var close_btn = $('<button></button>').attr('type', 'button')
        .attr('class', 'close')
        .attr('data-dismiss', 'alert')
        .attr('aria-label', 'Close');

    var close = $('<span></span>').attr('aria-hidden', 'true').html('&times;');
    close_btn.append(close);
    error_msg.append(close_btn);

    var header_html = $('<h4></h4>').html(header);
    var msg_html = $('<p></p>').html(message);

    error_msg.append(header_html).append(msg_html);

    elements.content.append(error_msg);
}

function loadAllProspects(callbackFunction) {
    $.ajax({
        url: config.mongolabURL + config.team_prospectsURL + '?apiKey=' + config.mongolabApiKey,
        dataType: 'json',
        type: 'GET'
    }).done(function(players){
        config_data.prospects = {};
        $.each(players, function(index, player){
            config_data.prospects[player._id['$oid']] = {
                'dob': player.dob,
                'fangraphs': player.fangraphs,
                'grade': player.grade,
                'mlb_team': player.mlb_team,
                'player': player.player,
                'pos': player.pos,
                'rank': player.rank,
                'team': player.team
            }
        });
        if (callbackFunction) {
            console.log(callbackFunction);
            callbackFunction();
        }
    }).fail(function(){
        console.error("fail - prospects");
    });
}

function getPlayerFormat(player_id) {
    if(! (player_id in config_data.prospects)) {
        return '';
    }
    var prospect = config_data.prospects[player_id];
    return prospect.player + ' - ' + prospect.mlb_team + ' - ' + prospect.pos;
}

function getPCT() {
    var offset = 3; // offset of PCT to UTC
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    return new Date(utc + (3600000*offset))
}
