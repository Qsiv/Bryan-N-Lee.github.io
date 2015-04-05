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
    table_section: null,
    table: null,
    table_body: null,
    active_datatable: null,
    prospects_btn: $('#prospects'),
    bryan_btn: null,
    cary_btn: null,
    larry_btn: null,
    mike_btn: null,
    mitchel_btn: null,
    tad_btn: null
};

var config = {
    mongolabURL: 'https://api.mongolab.com/api/1/databases/',
    mongolabApiKey: 'HIAnTqs9nA7nOr9qJW9PvrDkgfU9Ia0R',
    team_prospectsURL: 'baseball/collections/team_prospects',
    position_column: 0,
    player_column: 1,
    mlb_team_column: 2,
    age_column: 3,
    grade_column: 4,
    mlb_rank_column: 5,
    fangraphs_column: 6,
    team_column: 7,
    columnDefs: null
};

var columns = [{
        name: 'Position',
        key: 'pos',
        columnDef: { "width": '6%', "type": 'pos', "targets": config.position_column },
        classes: function(data) {
            return ['pos'];
        }
    },{
        name: 'Player',
        key: 'player',
        columnDef: { "width": '19%', "type": 'name', "targets": config.player_column },
        classes: function(data) {
            return ['player'];
        }
    },{
        name: 'MLB Team',
        key: 'mlb_team',
        columnDef: { "width": '12.5%', "targets": config.mlb_team_column },
        classes: function(data) {
            return ['mlb_team'];
        }
    },{
        name: 'Age',
        key: 'dob',
        columnDef: { "width": '12.5%', "targets": config.age_column },
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
        name: 'Grade',
        key: 'grade',
        columnDef: { "width": '12.5%', "targets": config.grade_column },
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
        columnDef: { "width": '12.5%', "type": 'rank', "targets": config.mlb_rank_column },
        classes: function(data) {
            return ['rank'];
        }
    },{
        name: 'Fangraphs Value',
        key: 'fangraphs',
        columnDef: { "width": '12.5%', "type": 'rank', "targets": config.fangraphs_column },
        classes: function(data) {
            return ['fangraphs'];
        }
    },{
        name: 'Under Control By',
        key: 'team',
        columnDef: { "width": '12.5%', "targets": config.team_column },
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
    elements.table_section = $('#table');
    elements.table = $('#prospects_table');
    elements.table_body = $('#table tbody');
    elements.prospects_btn = $('#prospects');
    elements.bryan_btn = $('#bryan');
    elements.cary_btn = $('#cary');
    elements.larry_btn = $('#larry');
    elements.mike_btn = $('#mike');
    elements.mitchel_btn = $('#mitchel');
    elements.tad_btn = $('#tad');
}

function init() {
    config.columnDefs = [];
    $.each(columns, function(index, column) {
        config.columnDefs.push(column.columnDef)
    });
    applyCustomSorting();
}

function start() {
    init();
    selectElements();
    showAllData();
    attachBtnActions();
}

/*
 *  Table
 */

function clearTable() {
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
        replaceData(data);
        elements.table.dataTable({
            "sDom": 'ltr',
            "bLengthChange": false,
            "columnDefs": config.columnDefs.concat({
                "visible": false,
                "targets": config.team_column
            }),
            "language": {
                "emptyTable": 'This team doesn\'t seem to have any prospects'
            }
        });
    });
}

function showAllData() {
    $.ajax({
        url: config.mongolabURL + config.team_prospectsURL + '?apiKey=' + config.mongolabApiKey,
        dataType: 'json',
        type: 'GET'
    }).done(function(data){
        buildTable(data);
        elements.active_datatable = elements.table.dataTable({
            "sDom": 'ltr',
            "bLengthChange": false,
            "columnDefs": config.columnDefs,
            "language": {
                "emptyTable": 'No prospects could be retrieved (Network Connection Problems?)'
            }
        });
    });
}

function buildTable(data) {
    if (elements.active_datatable) {
        elements.active_datatable.fnDestroy();
        elements.table.empty();
    }
    addHeaders();
    $.each(data, function(index, player) {
        addRow(player);
    })
}

function replaceData(data) {
    elements.active_datatable.fnDestroy();
    elements.table.empty();
    buildTable(data);
}

function addHeaders(){
    var headers = $('<thead></thead>');
    var tr = $('<tr></tr>');
    $.each(columns, function(index, column) {
        var td = $('<td></td>').html(column.name);
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
    });

    elements.bryan_btn.on('click', function(e) {
        showTeamData('bryan');
        $('.active').removeClass('active');
        elements.bryan_btn.addClass('active');
    });

    elements.cary_btn.on('click', function(e) {
        showTeamData('cary');
        $('.active').removeClass('active');
        elements.cary_btn.addClass('active');
    });

    elements.larry_btn.on('click', function(e) {
        showTeamData('larry');
        $('.active').removeClass('active');
        elements.larry_btn.addClass('active');
    });

    elements.mike_btn.on('click', function(e) {
        showTeamData('mike');
        $('.active').removeClass('active');
        elements.mike_btn.addClass('active');
    });

    elements.mitchel_btn.on('click', function(e) {
        showTeamData('mitchel');
        $('.active').removeClass('active');
        elements.mitchel_btn.addClass('active');
    });

    elements.tad_btn.on('click', function(e) {
        showTeamData('tad');
        $('.active').removeClass('active');
        elements.tad_btn.addClass('active');
    });
}



$(document).ready(function() {
    start();
});