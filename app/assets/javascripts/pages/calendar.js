var filterOption;

function filterCalendar(value) {
    filterOption = value;
    console.log("filtered with " + value);
    $('#calendar').fullCalendar('rerenderEvents');
}

$(document).ready(function () {
    console.log('JS File Logged User: ' + bookedBy + ', Showing calendar information for: ' + bookedFor);
    $('#calendar').fullCalendar({
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        defaultView: 'agendaWeek',
        weekends: false, // will hide Saturdays and Sundays
        minTime: '08:00:00',
        maxTime: '19:00:00',
        timeFormat: 'H(:mm)',
        views: {
            agendaWeek: {
                columnFormat: 'ddd D/M'
            }
        },
        firstDay: 1, //(Monday)
        lazyFetching: true,
        selectable: true,
        selectHelper: true,
        editable: true,
        droppable: true,
        header: {
            left: false,
            center: 'title',
            right: false
        },
        events: [{
          id: 4,
      title: 'R1-R2: Lunch 12.15-14.45',
      start: new Date(y, m, d+1, 12, 15),
      end: new Date(y, m, d+1, 14, 45),
      allDay: false,
      resources: ['resource1', 'resource2']
    }, {
      id: 4,
      title: 'R1: All day',
      start: new Date(y, m, d-2, 10, 30),
      end: new Date(y, m, d-2, 11, 0),
      allDay: true,
      resources: 'resource1'
    }, {
      id: 3,
      title: 'R2: Meeting 11.00',
      start: new Date(y, m, d, 11, 0),
      allDay: true,
      resources: 'resource2'
    }, {
      id: 2,
      title: 'R1/R2: Lunch 12-14',
      start: new Date(y, m, d, 12, 0),
      end: new Date(y, m, d, 14, 0),
      allDay: false,
      resources: ['resource1', 'resource2']
    }, {
      id: 777,
      title: 'Lunch',
      start: new Date(y, m, d+2, 12, 0),
      end: new Date(y, m, d+2, 14, 0),
      allDay: false,
      resources: ['resource1']
    }, {
      id: 999,
      title: 'Repeating Event',
      start: new Date(y, m, d - 3, 16, 0),
      allDay: false,
      resources: 'resource2'
    }, {
      id: 1,
      title: 'Repeating Event',
      start: new Date(y, m, d + 4, 16, 0),
      allDay: false,
      resources: 'resource2'
    }],
        /*events: function (start, end, timezone, callback) {
            if ((!timeStart) || (!timeEnd)) {
                timeStart = monday;
                timeEnd = friday;
            }
            else {
                view = $('#calendar').fullCalendar('getView');
                timeStart = moment(view.start).format('YYYY-MM-DD[T]HH:mm');
                timeEnd = moment(view.end).format('YYYY-MM-DD[T]HH:mm');
            }

            sourceURL = '/appointments?startTime=' + timeStart + '&endTime=' + timeEnd + '&bookedFor=' + bookedFor;
            $.ajax({
                url: sourceURL,
                dataType: 'json',
                type: 'get',
                crossDomain: 'true',
                success: function (data) {
                    var events = [];
                    $.each(data, function (key, val) {
                        console.log("filtered with " + val['option']);
                        events.push({
                            id: val['id'],
                            start: val['startTime'],
                            end: val['endTime'],
                            option: val['option'],
                            customer:val['customer'],
                            bookedFor: val['bookedFor'],
                            appointmentTypeId: val['type']['id'] ,
                            appointmentType: val['type']['name'] ,
                            title: val['type']['name']
                        });
                    });
                    console.log('Events data ---- '+ events)
                    $.ajax({
                        url: 'http://localhost:8082/workforce/agent/' + bookedFor,
                        dataType: 'json',
                        type: 'get',
                        crossDomain: 'true',
                        success: function (data) {
                          m = moment(todayStart).format('MM');
                              events.push({
                                  id: 'bg',
                                  start: (y + '-' + m + '-' + d + 'T') + data.startTime,
                                  end: (y + '-' + m + '-' + d + 'T') + data.endTime,
                                  rendering: 'background'
                              });

                            console.log(events);
                        },

                    });
                    callback(events);
                },

            });


        },*/
        eventClick: function(calEvent) {
            editEvent(calEvent);
        },
        select: function(start, end, resource, allDay, event) {
          eventData = {
            title: 'Appointment title',
            start: moment(start).format('YYYY-MM-DD[T]HH:mm'),
            end: moment(end).format('YYYY-MM-DD[T]HH:mm'),
            allDay: allDay,
            //resourceId: resource,
              bookedFor: bookedFor,
              bookedBy: bookedBy,
              locationId: locationId//,
//            bookedByName: 'John Doe'
          };
          saveNewEventGUI(eventData);
        },
        eventResize: function(event, dayDelta, minuteDelta) {
            editEvent(event);
        },
        eventDrop: function(event, delta, revertFunc) {
            editEvent(event);
        },
        // delete event
        eventDragStop: function(event, jsEvent) {
            deleteAppointment(event, jsEvent);
        },
        eventRender: function (event, element) {
            //element.context.innerText= event.customer.customerName;
            //return filterOption == event.option;
        }
    });
    $.ajax({
        url: 'http://localhost:8082/workforce/agentlocation/' + bookedFor,
        dataType: 'json',
        type: 'get',
        crossDomain: 'true',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (data) {
            console.log(data);
            console.log(data.location.id);
            locationId = data.location.id;

            locationName = data.location.name;

            $('#locationId').val('').val(data.location.id);
            $('#locationName').val('').val(data.location.name);
        },

    });
});

$('#submit').click(function (e) {
    e.preventDefault();
    var postData = $('#form-book-appointment').serializeArray();
    var postJSONData = {};
    var postJSONDataComplete = {};

    $.each(postData, function (key, val) {
        if (postJSONData[this.name] !== undefined) {
            if (!postJSONData[this.name].push) {
                postJSONData[this.name] = [postJSONData[this.name]];
            }
            postJSONData[this.name].push(this.value || '');
        } else {
            postJSONData[this.name] = this.value || '';
        }
    });


    var startTimeJSON = postJSONData['appointment-yy'] + '-' + postJSONData['appointment-mm'] + '-' + postJSONData['appointment-dd'] + 'T' + postJSONData['appointment-time'];
    var endTimeJSON = postJSONData['appointment-yy-to'] + '-' + postJSONData['appointment-mm-to'] + '-' + postJSONData['appointment-dd-to'] + 'T' + postJSONData['appointment-time-to'];

    postJSONDataID = (!postJSONData['appointment-id']) ? '' : postJSONData['appointment-id'];
    bookedBy = (!bookedBy) ? '' : bookedBy;
    bookedFor = (!postJSONData['bookedFor']) ? bookedFor : postJSONData['bookedFor'];
    appointmentTypeId = (!postJSONData['typeAppointment']) ? '' : postJSONData['typeAppointment'];
    locationId = (!postJSONData['locationId']) ? '' : postJSONData['locationId'];
    customerId = (!postJSONData['customerId']) ? '' : postJSONData['customerId'];
    option = (!postJSONData['option']) ? '' : postJSONData['option'];

    if(postJSONDataID == 'null'){
      postJSONDataComplete = {
          'bookedBy': bookedBy,
          'bookedFor': [bookedFor],
          'appointmentTypeId': appointmentTypeId,
          'locationId': locationId,
          'customerId': customerId,
          'startTime': startTimeJSON,
          'endTime': endTimeJSON,
          'travelTimeBefore': '0',
          'travelTimeAfter': '0'
      };
    }
    else {
      postJSONDataComplete = {
          'id': postJSONDataID,
          'bookedBy': bookedBy,
          'bookedFor': [bookedFor],
          'appointmentTypeId': appointmentTypeId,
          'locationId': locationId,
          'customerId': customerId,
          'startTime': startTimeJSON,
          'endTime': endTimeJSON,
          'travelTimeBefore': '0',
          'travelTimeAfter': '0'
      };
    }
    saveNewEvent(postJSONDataComplete, false);
});
