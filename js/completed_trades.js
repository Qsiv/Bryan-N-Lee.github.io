
var completed_config = {
    table_headers: ['Occurred', 'Team 1', 'Sends', 'Team 2', 'Sends'],
    occurred_col: 0,
    team1_col: 1,
    team1_offering_col: 2,
    team2_col: 3,
    team2_offering_col: 4
};


var completed_elements = {
    table: null,
    active_datatable: null
};


function selectCompletedElements() {
    completed_elements.table = $('#completed_trades_table');
}


function initCompleted() {
    selectCompletedElements();
}


function clearCompletedTable() {
    if (completed_elements.active_datatable) {
        completed_elements.active_datatable.destroy();
    }
    completed_elements.table.empty();
}


function buildCompletedTable(trades) {
    addCompletedHeaders();
    $.each(trades, function(index, trade) {
        addTradeToCompletedTable(trade);
    });
}


function replaceCompletedData(data) {
    clearCompletedTable();
    buildCompletedTable(data);
}


function addCompletedHeaders(){
    var headers = $('<thead></thead>');
    var tr = $('<tr></tr>');
    $.each(completed_config.table_headers, function(index, header) {
        var td = $('<td></td>').html(header);
        tr.append(td);
    });
    headers.append(tr);
    completed_elements.table.append(headers);
}


function addCompletedRow(teams, team1_offering, team2_offering, timestamp){
    var row = $('<tr></tr>');
    var occurred = $('<td></td>').html(timestamp);
    var team1_name = $('<td></td>').html((teams[0]).toUpperCase());
    var team2_name = $('<td></td>').html((teams[1]).toUpperCase());
    var team1_players = $('<ul></ul>');
    var team2_players = $('<ul></ul>');
    $.each(team1_offering, function(index, player) {
        team1_players.append($('<li></li>').html(player));
    });
    $.each(team2_offering, function(index, player) {
        team2_players.append($('<li></li>').html(player));
    });
    row.append(occurred).append(team1_name);
    var bs1 = $('<td></td>').append(team1_players);
    var bs2 = $('<td></td>').append(team2_players);
    row.append(bs1);

    row.append(team2_name);
    row.append(bs2);
    completed_elements.table.append(row);
}


function addTradeToCompletedTable(trade_details){
    var team1 = trade_details.team1;
    var team2 = trade_details.team2;
    var teams = [team1.team, team2.team];
    var team1_players = [];
    var team2_players = [];
    $.each(team1.offering, function(index, player_id){
        team1_players.push(getPlayerFormat(player_id));
    });
    $.each(team2.offering, function(index, player_id){
        team2_players.push(getPlayerFormat(player_id));
    });
    addCompletedRow(teams, team1_players, team2_players, trade_details.timestamp);
}


function loadCompletedTrades() {
    selectCompletedElements();
    $.ajax({
        url: config.mongolabURL + config.completed_tradesURL + '?apiKey=' + config.mongolabApiKey,
        dataType: 'json',
        type: 'GET'
    }).done(function(completed_trades){
        console.log(completed_trades);
        if (completed_elements.active_datatable) {
            replaceCompletedData(completed_trades);
        } else {
            buildCompletedTable(completed_trades);
        }
        completed_elements.active_datatable = completed_elements.table.DataTable({
            "sDom": 'ltr',
            "bLengthChange": false,
            "columnDefs": [{
                "targets": completed_config.occurred_col, "width": '20%'
            },{
                "targets": [ completed_config.team1_offering_col, completed_config.team2_offering_col ],
                "orderable": false
            }],
            "order": [[ 0, "desc" ]],
            "language": {
                "emptyTable": 'There are currently no completed trades'
            }
        });
    });
}

var completed_trades = {
    init: initCompleted,
    load: loadCompletedTrades
};
