var trades_config = {
    num_propsect_spots: 6,
    tradeSentMsg_success: 'The trade proposal was successfully submitted (You can view it in <i>Pending Trades</i>)'
};

function initTrades() {
    $('#team1').chosen();
    $('#team2').chosen();
    $('#submit_trade_form').find('tbody').find('select').chosen({display_disabled_options: false});
    teamSelection();
}

function sortJsonPlayers(a, b) {
    if (!('player' in a)) {
        return 1;
    } else if (!('player' in b)) {
        return -1;
    }
    var a_names = a.player.split(' ');
    var b_names = b.player.split(' ');
    var a_last = a_names[a_names.length - 1];
    var b_last = b_names[b_names.length - 1];
    return (a_last < b_last ? -1 : (a_last > b_last ? 1 : 0));
}

function getTeamProspects(team, column) {
    var query = encodeURIComponent(JSON.stringify({
        "team" : team
    }));
    $.ajax({
        url: config.mongolabURL + config.team_prospectsURL + '?q=' + query + '&apiKey=' + config.mongolabApiKey,
        dataType: 'json',
        type: 'GET'
    }).done(function(data){
        var prospects = [];
        $.each(data, function(index, player){
            prospects.push(player);
        });
        prospects.sort(sortJsonPlayers);

        var prospect_selects = $('#submit_trade_form')
            .find('tbody')
            .find('td:nth-child(' + (column + 1) + ')')
            .find('select');

        prospect_selects.empty();
        prospect_selects.append('<option></option>');

        $('#team' + column + '-p1').append($('<option></option>')
            .attr('value', 'No Prospects').html("[No Prospects]"));

        $.each(prospects, function(index, player){
            var prospect_option = $('<option></option>');
            prospect_option.attr('value', player._id.$oid);
            prospect_option.html(player.player + ' - ' + player.mlb_team + ' - ' + player.pos);
            prospect_selects.append(prospect_option);
        });
        prospect_selects.append('<option value="none">[None]</option>');
        $('.chosen-select').trigger("chosen:updated");
    });
}

/**
 * Returns all selected players including 'No Prospects' so take that into account, but not 'None'
 * @param column
 * @returns {Array}
 */
function getSelectedPlayers(column) {
    var player_ids = [];
    for(var i = 1; i <= trades_config.num_propsect_spots; ++i) {
        var player_id = $('#team' + column + '-p' + i).find('option:selected').val();
        if (player_id !== '' && player_id !== 'none') {
            player_ids.push(player_id);
        }
    }
    return player_ids;
}

/**
 * Get prospects who are not selected (by determine who are selected)
 * @param column                team/column #
 * @param _selected_players     (optional)
 */
function getNonSelectedPlayers(column, _selected_players) {
    var selected_players = typeof _selected_players !== 'undefined' ? _selected_players : getSelectedPlayers(column);
    var player_ids = [];
    $('#team' + column + '-p1').find('option').each(function(index, option){
        var player_id = option.getAttribute('value');
        if (player_id && selected_players.indexOf(player_id) < 0 && player_id !== 'none') {
            player_ids.push(player_id);
        }
    });
    return player_ids;
}

/**
 * Enables and disables players in the select options
 * @param column
 * @param exclude_select    The current select input
 */
function updatePlayerSelects(column, exclude_select) {
    var disable_players = getSelectedPlayers(column);
    var enabled_players = getNonSelectedPlayers(column, disable_players);
    var form = $('#submit_trade_form');
    var prospect_selects = form.find('tbody')
        .find('td:nth-child(' + (column + 1) + ')');

    var all_but_current = prospect_selects
        .find('select[id!="' + exclude_select + '"]');


    $.each(disable_players, function(index, player_id){
        if (player_id !== 'No Prospects') {
            all_but_current.find('option[value="' + player_id + '"]').attr('disabled', 'disabled');
        }
    });
    $.each(enabled_players, function(index, player_id){
        if (player_id !== 'No Prospects') {
            prospect_selects.find('option[value="' + player_id + '"]').removeAttr('disabled');
        }
    });
    $('.chosen-select').trigger("chosen:updated");
}

function clearTable() {
    var team1_select = $('#team1');
    var team2_select = $('#team2');
    team1_select.val('');
    team1_select.find('option').removeAttr('disabled');
    team2_select.val('');
    team2_select.find('option').removeAttr('disabled');

    var trade_form = $('#submit_trade_form');
    var column1 = trade_form.find('tbody').find('td:nth-child(2)').find('select');
    var column2 = trade_form.find('tbody').find('td:nth-child(3)').find('select');
    column1.empty();
    column1.append('<option></option>');

    column2.empty();
    column2.append('<option></option>');

    $('.chosen-select').trigger("chosen:updated");
}

function teamSelection() {
    $('#team1').change(function() {
        var team = $('#team1').find('option:selected').val();
        // Disable select in other selector
        var team2 = $('#team2');
        team2.find('option[value!="' + team + '"]').removeAttr('disabled');
        team2.find('option[value="' + team + '"]').attr('disabled', 'disabled');
        $('.chosen-select').trigger("chosen:updated");

        // Get Prospects for menu
        getTeamProspects(team, 1);
    });

    $('#team2').change(function() {
        var team = $('#team2').find('option:selected').val();
        // Disable select in other selector
        var team1 = $('#team1');
        team1.find('option[value!="' + team + '"]').removeAttr('disabled');
        team1.find('option[value="' + team + '"]').attr('disabled', 'disabled');
        $('.chosen-select').trigger("chosen:updated");

        // Get Prospects for menu
        getTeamProspects(team, 2);
    });

    $('#submit_trade_form').find('tbody').find('td:nth-child(2)').change(function(e) {
        updatePlayerSelects(1, this.id);
    });

    $('#submit_trade_form').find('tbody').find('td:nth-child(3)').change(function() {
        updatePlayerSelects(2, this.id);
    });
}

function sendTradeProposal(trade_proposal_json) {
    return $.ajax({
        url: config.mongolabURL + config.pending_tradesURL + '?apiKey=' + config.mongolabApiKey,
        data: trade_proposal_json,
        contentType: 'application/json',
        type: 'POST'
    }).done(function(data){
        showSuccess('Success', trades_config.tradeSentMsg_success);
        clearTable();
        return 1;
    }).fail(function(){
        showError('Error', 'Failed to send Trade Proposal (Network connection issues?)');
    });
}

/**
 *
 * @returns boolean (false) if error | json
 */
function getTradeProposalAsJson() {
    var team1 = $('#team1').find('option:selected').val();
    var team2 = $('#team2').find('option:selected').val();

    var team1_players = getSelectedPlayers(1);
    var team2_players = getSelectedPlayers(2);

    console.log(team1_players);
    console.log(team2_players);

    if ((team1_players.length === 0 || team2_players.length === 0) ||
        ($.inArray('No Prospects', team1_players) >= 0 && $.inArray('No Prospects', team2_players) >= 0)) {
        return false;
    }

    return {
        'team1': {
            'team': team1,
            'offering': $.inArray('No Prospects', team1_players) < 0 ? team1_players : ['No Prospects']
        },
        'team2': {
            'team': team2,
            'offering': $.inArray('No Prospects', team2_players) < 0 ? team2_players : ['No Prospects']
        },
        'timestamp': getPCT().toLocaleString()
    }
}

var trades = {
    init: initTrades,
    getTradeProposal: getTradeProposalAsJson,
    resetTrade: clearTable,
    sendTradeProposal: sendTradeProposal
};
