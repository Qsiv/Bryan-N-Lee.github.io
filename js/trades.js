var trades_config = {
    num_propsect_spots: 6
};

var trade_elements = {
    team1: null,
    team2: null,
    submit_trade_form: null
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
        url: config.mongolabURL + 'baseball/collections/team_prospects?q=' + query + '&apiKey=' + config.mongolabApiKey,
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
        all_but_current.find('option[value="' + player_id + '"]').attr('disabled', 'disabled');
    });
    $.each(enabled_players, function(index, player_id){
        prospect_selects.find('option[value="' + player_id + '"]').removeAttr('disabled');
    });
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

function getTradeProposalAsJson() {
    var team1 = $('#team1').find('option:selected').val();
    var team2 = $('#team2').find('option:selected').val();

    var team1_players = getSelectedPlayers(1);
    var team2_players = getSelectedPlayers(2);

    return {
        'team1': {
            'team': team1,
            'proposed': team1_players
        },
        'team2': {
            'team': team2,
            'proposed': team2_players
        }
    }
}

var trades = {
    initTrades: initTrades,
    getTradeProposal: getTradeProposalAsJson
};
