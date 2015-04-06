/*
 *  Sorting
 */
function applyCustomSorting() {
    $.fn.dataTableExt.oSort['rank-asc'] = function (a, b) {
        var x = parseInt(a);
        var y = parseInt(b);
        return ((isNaN(y) || x < y) ? -1 : ((isNaN(x) || x > y) ? 1 : 0));
    };
    $.fn.dataTableExt.oSort['rank-desc'] = function (a, b) {
        var x = parseInt(a);
        var y = parseInt(b);
        return ((isNaN(x) || x < y) ? 1 : ((isNaN(y) || x > y) ? -1 : 0));
    };

    $.fn.dataTableExt.oSort['pos-asc'] = function (a, b) {
        var x = posNum(a);
        var y = posNum(b);
        return x < y ? -1 : (x > y ? 1 : 0);
    };
    $.fn.dataTableExt.oSort['pos-desc'] = function (a, b) {
        var x = posNum(a);
        var y = posNum(b);
        return x < y ? 1 : (x > y ? -1 : 0);
    };

    $.fn.dataTableExt.oSort['name-asc'] = function (a, b) {
        var x = a.split(' ');
        var y = b.split(' ');
        return x[x.length - 1] < y[y.length - 1] ? -1 : (x[x.length - 1] > y[y.length - 1] ? 1 : 0);
    };
    $.fn.dataTableExt.oSort['name-desc'] = function (a, b) {
        var x = a.split(' ');
        var y = b.split(' ');
        return x[x.length - 1] < y[y.length - 1] ? 1 : (x[x.length - 1] > y[y.length - 1] ? -1 : 0);
    };
}

/*
 *  Config
 */

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
    pending_trades_btn: null,
    submit_trades_btn: null,
    submit_trade_btn: null,
    cancel_trade_btn: null,
    message: null,
    page_link: null,
    submit_trade_sec: null,
    pending_trades_sec: null
};

var farmsystem_config = {
    position_column: 0,
    player_column: 1,
    mlb_team_column: 2,
    age_column: 3,
    grade_column: 4,
    mlb_rank_column: 5,
    fangraphs_column: 6,
    team_column: 7,
    columnDefs: null,
    errorMsg: '<p>An error occurred while attempting to receive the team\'s players (Network connection error?)</p>',
    tradeSentMsg_success: '<p>The trade proposal was successfully submitted (You can view it in <i>Pending Trades</i></p>'
};

var columns = [{
        name: 'Position',
        key: 'pos',
        columnDef: { "width": '6%', "type": 'pos', "targets": farmsystem_config.position_column },
        classes: function(data) {
            return ['pos'];
        }
    },{
        name: 'Player',
        key: 'player',
        columnDef: { "width": '19%', "type": 'name', "targets": farmsystem_config.player_column },
        classes: function(data) {
            return ['player'];
        }
    },{
        name: 'MLB Team',
        key: 'mlb_team',
        columnDef: { "width": '12.5%', "targets": farmsystem_config.mlb_team_column },
        classes: function(data) {
            return ['mlb_team'];
        }
    },{
        name: 'Age',
        key: 'dob',
        columnDef: { "width": '12.5%', "targets": farmsystem_config.age_column },
        format: function(date) {
            var dob = new Date(date.split('-'));
            var ageDifMs = Date.now() - dob.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        },
        classes: function(data) {
            return ['age'];
        }
    },{
        name: 'SB Nation Grade',
        key: 'grade',
        columnDef: { "width": '12.5%', "targets": farmsystem_config.grade_column },
        classes: function(data) {
            var _class = [];
            switch(data) {
                case 'A+':
                case 'A':
                case 'A-':
                    _class.push('grade_a');
                    break;
                case 'B+':
                case 'B':
                case 'B-':
                    _class.push('grade_b');
                    break;
                case 'C+':
                case 'C':
                case 'C-':
                    _class.push('grade_c');
                    break;
                case 'D+':
                case 'D':
                case 'D-':
                    _class.push('grade_d');
                    break;
                default:
                    _class.push('grade_low');
            }
            return _class;
        }
    },{
        name: 'MLB Rank',
        key: 'rank',
        columnDef: { "width": '12.5%', "type": 'rank', "targets": farmsystem_config.mlb_rank_column },
        classes: function(data) {
            return ['rank'];
        }
    },{
        name: 'Fangraphs Value',
        key: 'fangraphs',
        columnDef: { "width": '12.5%', "type": 'rank', "targets": farmsystem_config.fangraphs_column },
        classes: function(data) {
            return ['fangraphs'];
        }
    },{
        name: 'Under Control By',
        key: 'team',
        columnDef: { "width": '12.5%', "targets": farmsystem_config.team_column },
        classes: function(data) {
            return ['team'];
        },
        format: function(team) {
            return team.toUpperCase();
        }
    }];

var posNum = function(pos) {
    switch (pos) {
        case 'RHP':
            return 0;
        case 'LHP':
            return 1;
        case 'C':
            return 2;
        case '1B':
            return 3;
        case '2B':
            return 4;
        case '3B':
            return 5;
        case 'SS':
            return 6;
        case 'OF':
        case 'LF':
            return 7;
        case 'CF':
            return 8;
        case 'RF':
            return 9;
        default:
            return 10;
    }
};

function selectElements() {
    elements.content = $('#content');
    elements.table = $('#prospects_table');
    elements.table_body = $('#table tbody');
    elements.prospects_btn = $('#prospects');
    elements.bryan_btn = $('#bryan');
    elements.cary_btn = $('#cary');
    elements.larry_btn = $('#larry');
    elements.mike_btn = $('#mike');
    elements.mitchel_btn = $('#mitchel');
    elements.tad_btn = $('#tad');
    elements.pending_trades_btn = $('#pending_trades');
    elements.submit_trades_btn = $('#submit_trade');
    elements.submit_trade_btn = $('#submit_trade_btn');
    elements.cancel_trade_btn = $('#cancel_trade_btn');
    elements.message = $('#message');
    elements.page_link = $('#page_link');
    elements.submit_trade_sec = $('#submit_trade_sec');
    elements.pending_trades_sec = $('#pending_trades_sec');
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    return '';
}

function init() {
    farmsystem_config.columnDefs = [];
    $.each(columns, function(index, column) {
        farmsystem_config.columnDefs.push(column.columnDef)
    });
    applyCustomSorting();
}

function start() {
    init();
    selectElements();
    attachBtnActions();
    var team = getUrlParameter('team');
    if (team === ''){
        showAllData();
    } else {
        team = team.toLowerCase();
        switch(team) {
            case 'bryan':
                elements.bryan_btn.trigger('click');
                break;
            case 'cary':
                elements.cary_btn.trigger('click');
                break;
            case 'larry':
                elements.larry_btn.trigger('click');
                break;
            case 'mike':
                elements.mike_btn.trigger('click');
                break;
            case 'mitchel':
                elements.mitchel_btn.trigger('click');
                break;
            case 'tad':
                elements.tad_btn.trigger('click');
                break;
            case 'pending':
                elements.pending_trades_btn.trigger('click');
                break;
            case 'submit':
                elements.submit_trades_btn.trigger('click');
                break;
            default:
                showAllData();
        }
    }
}

/*
 *  Table
 */

function showError(header, message) {
    elements.message.removeClass('hidden');
    elements.message.addClass('alert-danger alert-dismissible fade in');
    elements.message.append('<h4>' + header + '</h4>');
    elements.message.append(message);
}

function showSuccess(header, message) {
    elements.message.removeClass('hidden');
    elements.message.addClass('alert-success');
    elements.message.append('<h4>' + header + '</h4>');
    elements.message.append(message);
}

function clearTable() {
    if (elements.active_datatable) {
        elements.active_datatable.destroy();
    }
    elements.table.empty();
}

function showTeamData(team) {
    var query = encodeURIComponent(JSON.stringify({
        "team" : team
    }));
    $.ajax({
        url: config.mongolabURL + 'baseball/collections/team_prospects?q=' + query + '&apiKey=' + config.mongolabApiKey,
        dataType: 'json',
        type: 'GET'
    }).done(function(data){
        elements.message.addClass('hidden');
        if (elements.active_datatable) {
            replaceData(data);
        } else {
            buildTable(data);
        }
        elements.active_datatable = elements.table.DataTable({
            "sDom": 'ltr',
            "bLengthChange": false,
            "columnDefs": farmsystem_config.columnDefs.concat({
                "visible": false,
                "targets": farmsystem_config.team_column
            }),
            "language": {
                "emptyTable": 'This team doesn\'t seem to have any prospects'
            }
        });
    }).fail(function() {
        clearTable();
        showError('Error', farmsystem_config.errorMsg);
    });
}

function showAllData() {
    $.ajax({
        url: config.mongolabURL + config.team_prospectsURL + '?apiKey=' + config.mongolabApiKey,
        dataType: 'json',
        type: 'GET'
    }).done(function(data){
        elements.message.addClass('hidden');
        if (elements.active_datatable) {
            replaceData(data);
        } else {
            buildTable(data);
        }
        elements.active_datatable = elements.table.DataTable({
            "sDom": 'ltr',
            "bLengthChange": false,
            "columnDefs": farmsystem_config.columnDefs,
            "language": {
                "emptyTable": 'No prospects could be retrieved (Network Connection Problems?)'
            }
        });
    }).fail(function() {
        clearTable();
        showError('Error', farmsystem_config.errorMsg);
    });
}

function sendTradeProposal() {
    var trade_proposal_json = JSON.stringify(trades.getTradeProposal());
    $.ajax({
        url: config.mongolabURL + config.trade_proposalsURL + '?apiKey=' + config.mongolabApiKey,
        data: trade_proposal_json,
        contentType: 'application/json',
        type: 'POST'
    }).done(function(data){
        showSuccess('Success', farmsystem_config.tradeSentMsg_success);
    }).fail(function(){
        console.log('error');
    });
}

function buildTable(data) {
    addHeaders();
    $.each(data, function(index, player) {
        addRow(player);
    })
}

function replaceData(data) {
    clearTable();
    buildTable(data);
}

function addHeaders(){
    var headers = $('<thead></thead>');
    var tr = $('<tr></tr>');
    $.each(columns, function(index, column) {
        var header = column.name;
        //if (column.key === 'player') {
        //    header += '<br><input type="text" id="filter-' + column.key + '" placeholder="Filter ' + column.name + '" />';
        //}
        var td = $('<td></td>').html(header);
        tr.append(td);
    });
    headers.append(tr);
    elements.table.append(headers);
}


function addRow(row_data){
    var row = $('<tr></tr>');
    $.each(columns, function(index, column) {
        var cell = $('<td></td>');
        var cell_text = '';
        if (column.key in row_data) {
            if (column.classes) {
                cell.attr('class', column.classes(row_data[column.key]).join(' '));
            }
            if (column.format) {
                cell_text = column.format(row_data[column.key]);
            } else {
                cell_text = row_data[column.key];
            }
        } else if (column.no_data) {
            cell_text = column.no_data();
        }
        cell.html(cell_text);
        row.append(cell);
    });
    elements.table.append(row);
}

/*
 *  Interaction
 */
function attachBtnActions() {
    elements.prospects_btn.on('click', function(e) {
        showAllData();
        $('.active').removeClass('active');
        elements.prospects_btn.addClass('active');
        elements.page_link.attr('href', 'farmsystems.html');
    });

    elements.bryan_btn.on('click', function(e) {
        showTeamData('bryan');
        $('.active').removeClass('active');
        elements.bryan_btn.addClass('active');
        elements.page_link.attr('href', 'farmsystems.html?team=bryan');
    });

    elements.cary_btn.on('click', function(e) {
        showTeamData('cary');
        $('.active').removeClass('active');
        elements.cary_btn.addClass('active');
        elements.page_link.attr('href', 'farmsystems.html?team=cary');
    });

    elements.larry_btn.on('click', function(e) {
        showTeamData('larry');
        $('.active').removeClass('active');
        elements.larry_btn.addClass('active');
        elements.page_link.attr('href', 'farmsystems.html?team=larry');
    });

    elements.mike_btn.on('click', function(e) {
        showTeamData('mike');
        $('.active').removeClass('active');
        elements.mike_btn.addClass('active');
        elements.page_link.attr('href', 'farmsystems.html?team=mike');
    });

    elements.mitchel_btn.on('click', function(e) {
        showTeamData('mitchel');
        $('.active').removeClass('active');
        elements.mitchel_btn.addClass('active');
        elements.page_link.attr('href', 'farmsystems.html?team=mitchel');
    });

    elements.tad_btn.on('click', function(e) {
        showTeamData('tad');
        $('.active').removeClass('active');
        elements.tad_btn.addClass('active');
        elements.page_link.attr('href', 'farmsystems.html?team=tad');
    });

    elements.pending_trades_btn.on('click', function(e) {
        elements.message.addClass('hidden');

    });

    elements.submit_trades_btn.on('click', function(e) {
        elements.message.addClass('hidden');
        $('.active').removeClass('active');
        elements.submit_trades_btn.addClass('active');

        elements.table.addClass('hidden');
        elements.submit_trade_sec.removeClass('hidden');
    });

    elements.submit_trade_btn.on('click', function(e) {
        sendTradeProposal();
    });

    elements.cancel_trade_btn.on('click', function(e) {

    });

    $('#table').on('keyup change', '#filter-player', function (e) {
        elements.active_datatable.columns().search(this.value).draw();
    });

    $(".close").click(function(){
        elements.message.alert();
    });
}



$(document).ready(function() {
    start();
    trades.initTrades();
});