$(document).ready(function () {
    $.ajax({
        url: '/public/javascripts/json/menu.json',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        crossDomain: 'true',
        draggable: true,
        success: function (data) {
            $.each(data, function (index, agent) {
                if(agent['role'] == 'CM') {
                    $('<ul/>', {
                        html: '<li><a href="/team/' + agent['id'] + '">ID ' + agent['id'] + ' - '+ agent['name'] + '</a></li>'
                    }).appendTo('#cmIdMap');
                }
                else if(agent['role'] == 'TL') {
                    $('<ul/>', {
                        html: '<li><a href="/team/' + agent['id'] + '">ID ' + agent['id'] + ' - '+ agent['name'] + '</a></li>'
                    }).appendTo('#tlIdMap');
                }
                else if(agent['role'] == 'WCM') {
                    $('<ul/>', {
                        html: '<li><a href="/team/' + agent['id'] + '">ID ' + agent['id'] + ' - '+ agent['name'] + '</a></li>'
                    }).appendTo('#wcmIdMap');
                }
                else {
                    $('<ul/>', {
                        html: 'ID ' + agent['id'] + ' - '+ agent['name'] + ' <a href="/team/' + agent['id'] + '">Jobcentre page</a>' + ' <a href="/calendar/' + agent['id'] + '">Calendar page</a>'
                    }).appendTo('#wcIdMap');
                }

            });

        },
        error: function () {
            console.log('Can not load file for menu agents');
        }
    });

});
