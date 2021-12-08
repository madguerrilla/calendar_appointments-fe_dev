$(document).ready(function () {
    $.ajax({
        url: '/public/javascripts/json/agentlocation.json', //+ bookedBy,
        dataType: 'json',
        type: 'get',
        crossDomain: 'true',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (data) {
            console.log(data);
            console.log(data[0].agent[0].id);
            locationId = data[0].location[0].id;
            bookedByRole = data[0].agent[0].role;
            locationName = data[0].location[0].name;
            loadjobCentre();
        }

    });
    function loadjobCentre () {
        $.ajax({
            url: '/public/javascripts/json/jobcentre-locations.json',
            dataType: 'json',
            type: 'get',
            crossDomain: 'true',
            draggable: true,
            success: function (data) {
                $.each(data, function (key, val) {
                    if ((bookedByRole == 'WC' || bookedByRole == 'WCM') && val['id'] == locationId) {
                        locationsArr.push({
                            id: val['id'],
                            name: val['name']
                        });
                        locationsArrBuild.push('<option value="' + val['id'] + '">' + val['name'] + '</option>');

                    }
                    else if (bookedByRole == 'CM' || bookedByRole == 'TL') {
                        locationsArr.push({
                            id: val['id'],
                            name: val['name']
                        });
                        locationsArrBuild.push('<option value="' + val['id'] + '">' + val['name'] + '</option>');
                    }
                });

                //Added for Heroku
                locationsArrBuild.push('<option value="Croydon">Croydon</option>');

                if ('#locations-container' != '') {
                    $('<select/>', {
                        'class': 'max',
                        'id': 'locations',
                        'name': 'locations',
                        'data-placeholder': 'Select a locations',
                        'tabindex': '-1',
                        html: locationsArrBuild.join('')
                    }).appendTo('#select-location');
                    var $selectize = $('#locations').selectize({
                        create: true,
                        sortField: 'value',
                        onChange: function (value) {
                            loadTeamsForLocation(value);
                        },
                        onInitialize: function (value) {
                            loadTeamsForLocation(locationsArr[0].id);
                        }
                    });
                    console.log('Locations loaded into drop down');
                }
                else {
                    console.log('Locations loaded but no drop down selection is avaiable');
                }
            },
            error: function () {
                console.log('Can not load file for locations');
            }
        });
    }
    function loadTeamsForLocation (locationName){
      $.ajax({
          url: '/public/javascripts/json/workforce-team-location-' + locationName + '.json',
          dataType: 'json',
          type: 'get',
          crossDomain: 'true',
          success: function (data) {
            i = 1;
            var teamsArr = [], teamsArrId = [];
              $.each(data, function (key, val) {
                  teamsArrId.push({id: val['id'], name: val['name']});
                  if(i == 1){
                    teamsArr.push('<li role="presentation" id="' + val['id'] + '" class="active"><a href="#' + val['id'] + '" aria-controls="' + val['name'] + '" role="tab" data-toggle="tab">' + val['name'] + '</a></li>');
                    i++;
                  }
                  else{
                    teamsArr.push('<li role="presentation" id="' + val['id'] + '"><a href="#' + val['id'] + '" aria-controls="' + val['name'] + '" role="tab" data-toggle="tab">' + val['name'] + '</a></li>');
                  }
              });
              teamsArr = teamsArr.join('');
              $('#teams-layout .nav').empty();
              $('#teams-layout .nav').append(teamsArr);
              var teamsArrIdPanels = [];
              i = 1;
              $.each(teamsArrId, function (key, val) {
                if(i == 1){
                  teamsArrIdPanels.push('<div role="tabpanel" class="tab-pane active" id="'+ val['id'] +'"><div id="calendar" class="calendar-'+ val['id'] +'"></div></div>')
                  i++;
                }
                else{
                  teamsArrIdPanels.push('<div role="tabpanel" class="tab-pane" id="'+ val['id'] +'"><div id="calendar" class="calendar-'+ val['id'] +'"></div></div>')
                }
              });
              teamsArrIdPanels = teamsArrIdPanels.join('');
              $('#teams-layout .tab-content').empty();
              $('#teams-layout .tab-content').append(teamsArrIdPanels);
              loadWcPerTeam(teamsArrId);
          },
          error: function () {
              console.log('Can not load file for teams');
          }
      });
    };
    function loadWcPerTeam (teamsArrId, teamIdDefault){
        var teamIdDefault = (!teamIdDefault) ? teamsArrId[0].id : teamIdDefault;
        console.log('Viewing Team - ' + teamIdDefault);
        $.ajax({
            url: '/public/javascripts/json/workforce-agent-team-' + teamIdDefault + '.json',
            dataType: 'json',
            type: 'get',
            crossDomain: 'true',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                var resourcesWCTeam = [], eventsTeam = [], getBusinessHours = [], workcoachesArrBuild= [];
                workcoachesArrBuild.push('<option value="0"></option>');

                $.each(data, function (key, val) {
                  resourcesWCTeam.push({
                      id: val['id'],
                      resourceId: val['id'],
                      name: val['name'],
                      title: val['name'],
                      role: val['role']
                  });
                    workcoachesArrBuild.push('<option value="' + val['id'] + '">' + val['name'] + '</option>');
                });
                $('#select-workcoaches').empty();
                $('<select/>', {
                    'class': 'max',
                    'id': 'workcoaches',
                    'name': 'workcoaches',
                    'data-placeholder': 'Select a work coach',
                    'tabindex': '-1',
                    html: workcoachesArrBuild.join('')
                }).appendTo('#select-workcoaches');

                $('#workcoaches').selectize({
                   create: true,
                   sortField: 'value',
                   onChange : function(value) {
                    loadWorkCoachCalendar(value);
                   }
                });

                  $.each(data, function (key, val) {
                    getBusinessHours.push({
                      id: val['id'],
                      resourceId: val['id'],
                      rendering: 'background',
                      start: val['startTime'],
                      end:  val['endTime']
                    });
                });

                /*$.ajax({
                    url: '/public/javascripts/json/croyB.json',
                    dataType: 'json',
                    type: 'get',
                    crossDomain: 'true',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    success: function (data) {
                      $.each(data, function (key, val) {
                        getBusinessHours.push({
                          id: val['id'],
                          resourcesId: val['bookedFor'][0],
                          wcId: val['id'],
                          start: val['startTime'],
                          end: val['endTime'],
                          title: val['type']['name'],
                          customer:val['customer'],
                          bookedFor: val['bookedFor'],
                          appointmentTypeId: val['type']['id'],
                          appointmentType: val['type']['name']
                        });
                      });
                      loadAllDataForTeamCalendar(resourcesWCTeam, getBusinessHours, teamIdDefault);
                    }
                  });*/
                  getBusinessHours.push({
                    id: 'WC1',
                    resourcesId: 'WC1',
                    wcId: 'WC1',
                    start: todayNoTime + 'T09:15',
                    end: todayNoTime + 'T10:30',
                    title: 'Rooney Mara',
                    customer: 'Customer ID',
                    bookedFor: 'WC1',
                  });
                  console.log(teamIdDefault);
                  loadAllDataForTeamCalendar(resourcesWCTeam, getBusinessHours, teamIdDefault);

            },
            error: function () {
                console.log('Can not load file for team work coaches');
            }
        });

    $(function() {
      $('#teams-layout .nav li a').on('click', function(e) {
          tabbing = $(this).attr('href');
          $('#teams-layout .nav li').removeClass('active');
          $(this).parent('li').addClass('active');
          $('#teams-layout .tab-content .tab-pane').removeClass('active');
          $('#teams-layout .tab-content '+ tabbing).addClass('active');
          tabbing = tabbing.replace('#', '');
          loadWcPerTeam(teamsArrId, tabbing)
          console.log(tabbing);
          e.preventDefault();
      });

        $('#select-workcoaches').on('change', '#workcoaches', function(e) {
            console.log($(this).val());
            window.location.href = "/calendar/" + bookedBy + "/" + $(this).val();
            e.preventDefault();
        });

    });
    }
});

function loadAllDataForTeamCalendar(resourcesWCTeam, getBusinessHours, teamIdDefault) {
  $('.calendar-' + teamIdDefault).fullCalendar({
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      defaultView: 'timelineDay',
      weekends: false, // will hide Saturdays and Sundays
      minTime: '08:00:00',
      maxTime: '19:00:00',
      timeFormat: 'H(:mm)',
      defaultDate: startTime,
      selectable: true,
      selectHelper: true,
      editable: true,
      droppable: true,
      slotMinutes: 15,
      editable: true,
      height: 400,
      header: {
          left: false,
          center: 'title',
          right: false
      },
      resourceLabelText: 'Work coaches',
      resources: resourcesWCTeam,
      events: getBusinessHours,
      eventResourceField: 'resourceId',
      eventClick: function(calEvent) {
          editEvent(calEvent);
      },
      select: function(start, end, resource, allDay, event) {
        eventData = {
          title: '',
          start: moment(start).format('YYYY-MM-DD[T]HH:mm'),
          end: moment(end).format('YYYY-MM-DD[T]HH:mm'),
          allDay: allDay,
          //resourceId: resource,
          bookedFor: bookedFor,
          bookedBy: bookedBy,
          locationId: locationId
        };
        saveNewEventGUITemp(eventData);
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
      eventAfterAllRender: function(){
        //$('.calendar-' + teamIdDefault).fullCalendar('rerenderEvents');
      }
  });
}

function saveNewEventGUITemp(eventData){

    modalData = '<ol class="modal-list">';
    modalData += '<li><strong>Type of appointment:</strong><span id="select-appointment-modal" class="fiftypc"></span></li>';
    modalData += '<div class="alert alert-danger hide-to-show appointment-alert" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>Please select a appointment</div>';
    modalData += '<li><input id="startDateModal" type="text" value="' + moment(eventData.start).format('YYYY-MM-DD[T]HH:mm') + '"></li>';
    modalData += '<li><input id="endDateModal" type="text" value="' + moment(eventData.end).format('YYYY-MM-DD[T]HH:mm') + '"></li>';
    //modalData += '<li><strong>Start date & time:</strong> ' + moment(eventData.start).format('DD/MM/YYYY HH:mm') + '</li>';
    //modalData += '<li><strong>End date & time:</strong> ' + moment(eventData.end).format('DD/MM/YYYY HH:mm') + '</li>';
    modalData += '<li><strong>Customer ID: </strong><input class="form-control fiftypc" id="customerId-modal" name="customerId-modal" required></li>';
    modalData += '<div class="alert alert-danger hide-to-show custId-alert" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>Please enter a customer ID</div>';
    modalData += '<li><strong>Booked for:</strong>' + eventData.bookedFor +'</li>';
    modalData += '<li><strong>Booked by:</strong>' + eventData.bookedBy +'</li>';
    modalData += '</ol>';
    eventData.title = 'Appointment';
		populateModal('Create new appointment', modalData, 'Close', 'Save & close', 'save-changesTemp')

		bookedBy = eventData.bookedBy;
		bookedFor = eventData.bookedFor;
		eventData.bookedFor = eventData.resourceId ;

    arrX = [];
    $.each(resourcesWCId, function (key, val) {
        arrX.push('<option value="' + val + '">' + val + '</option>');
    });
    $('<select/>', {
        'class': 'form-control',
        'id': 'pickWC',
        'name': 'pickWC',
        'data-placeholder': 'Select a work coach',
        'tabindex': '-1',
        html: arrX.join('')}).appendTo('#select-pickWC');

    arrX = [];
    $.each(appoitmentTypesArr, function (key, val) {
        arrX.push('<option value="' + val['id'] + '">' + val['appointment'] + '</option>');
    });
    $('<select/>', {
        'class': 'form-control',
        'id': 'select-appointment-m',
        'name': 'select-appointment-m',
        'data-placeholder': 'Select an appointment',
        'tabindex': '-1',
        html: arrX.join('')}).appendTo('#select-appointment-modal');
};

$(modalID).on('click', '#save-changesTemp', function(){
  $(modalID).modal('toggle');
  console.log(eventData);
  $('#calendar').fullCalendar('renderEvent', eventData ,'stick'  )
});

function loadWorkCoachCalendar(value){
  console.log(value);
}
