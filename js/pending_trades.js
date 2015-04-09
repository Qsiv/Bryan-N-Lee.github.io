
var pending_config = {
    table_headers: ['Occurred', 'Team 1', 'Offering', 'Team 2', 'Offering'],
    occurred_col: 0,
    team1_col: 1,
    team1_offering_col: 2,
    team2_col: 3,
    team2_offering_col: 4
};


var pending_elements = {
    table: null,
    active_datatable: null
};


function selectPendingElements() {
    pending_elements.table = $('#pending_trades_table');
}


function initPending() {
    selectPendingElements();
}


function clearPendingTable() {
    if (pending_elements.active_datatable) {
        pending_elements.active_datatable.destroy();
    }
    pending_elements.table.empty();
}


function buildPendingTable(trades) {
    addPendingHeaders();
    $.each(trades, function(index, trade) {
        addTradeToTable(trade);
    });
}


function replacePendingData(data) {
    clearPendingTable();
    buildPendingTable(data);
}


function addPendingHeaders(){
    var headers = $('<thead></thead>');
    var tr = $('<tr></tr>');
    $.each(pending_config.table_headers, function(index, header) {
        var td = $('<td></td>').html(header);
        tr.append(td);
    });
    headers.append(tr);
    pending_elements.table.append(headers);
}


function addPendingRow(teams, team1_offering, team2_offering, timestamp){
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
    pending_elements.table.append(row);
}


function addTradeToTable(trade_details){
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
    addPendingRow(teams, team1_players, team2_players, trade_details.timestamp);
}


function loadPendingTrades() {
    selectPendingElements();
    $.ajax({
        url: config.mongolabURL + config.pending_tradesURL + '?apiKey=' + config.mongolabApiKey,
        dataType: 'json',
        type: 'GET'
    }).done(function(pending_trades){
        if (pending_elements.active_datatable) {
            replacePendingData(pending_trades);
        } else {
            buildPendingTable(pending_trades);
        }
        pending_elements.active_datatable = pending_elements.table.DataTable({
            "sDom": 'ltr',
            "bLengthChange": false,
            "columnDefs": [{
                "targets": pending_config.occurred_col, "width": '20%'
            },{
                "targets": [ pending_config.team1_offering_col, pending_config.team2_offering_col ],
                "orderable": false
            }],
            "order": [[ 0, "desc" ]],
            "language": {
                "emptyTable": 'There are currently no pending trades'
            }
        });
    });
}

var pending_trades = {
    init: initPending,
    load: loadPendingTrades
};
