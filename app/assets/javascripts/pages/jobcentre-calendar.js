if((!startTime) || (!endTime)){
	startTime = moment(today).format('YYYY-MM-DD[T]00:00');
	endTime = moment(today).format('YYYY-MM-DD[T]23:59');
}

sourceURL = '/appointments/location?startTime=' + startTime + '&endTime=' + endTime + '&locationId=Croydon';

$(document).ready(function() {
	function loadCalendarSources(sourceURL, startTime, endTime, resourcesWC, myCalendarStateView, fcClass) {
    $.ajax({
        url: sourceURL,
        dataType: 'json',
        type: 'get',
        crossDomain: 'true',
        success: function(data) {
					resourcesWC = (!resourcesWC) ? []: resourcesWC;
					console.log(resourcesWC);
					events = [];
					if($.isEmptyObject(data)){
						resourcesWC = [{id: 'WCEmpty', name: 'WCEmpty', className: ['blue']}];
						events = [];
					}
					else{
            var ajaxData = data;
						console.log(ajaxData);
            $.each(ajaxData, function(key, val) {
                $.each(val.bookedFor, function(key, val) {
									if($.inArray(val, resourcesWCId) == -1){
                    resourcesWC.push({
                        id: val,
                        name: val,
                        className: ['blue']
                    });
										console.log(val);
										resourcesWCId.push(val);
									};
                });
            });
            $.each(ajaxData, function(key, val) {
                events.push({
                    id: val['id'],
                    resources: val['bookedFor'],
                    resourceId: val['bookedFor'],
                    start: val['startTime'],
                    end: val['endTime'],
                    title: val['type']['name'],
                    name: val['type']['name'],
                    customerId: val['customer']['id'],
                    customerName: val['customer']['customerName'],
                    locationId: val['location']['id'],
                    duration: val['type']['duration'],
                });
            });
					}
					loadMultiViewCalendar(startTime, endTime, resourcesWC, myCalendarStateView, fcClass);
        },
        error: function() {
            console.log('Can not load source for calendar - ' + sourceURL);
        }
    });
	}

  // Calendar Pagination
  $('.calendar-pagination-day').click(function(e) {
      opts = $(this).find('a').attr('rel');
      console.log(opts);
      today = $('#calendar').fullCalendar('getDate');

      switch (opts) {
          case 'next':
              tomorrow = today.add(1, 'days');
							//console.log(tomorrow);
              startTime = moment(tomorrow).format('YYYY-MM-DD[T]00:00');
              endTime = moment(tomorrow).format('YYYY-MM-DD[T]23:59');
              break;

          case 'today':
              startTime = moment(date).format('YYYY-MM-DD[T]00:00');
              endTime = moment(date).format('YYYY-MM-DD[T]23:59');
              break;

          case 'prev':
              yesterday = today.subtract(1, 'days');
              startTime = moment(yesterday).format('YYYY-MM-DD[T]00:00');
              endTime = moment(yesterday).format('YYYY-MM-DD[T]23:59');
              break;
      }

      sourceURL = '/appointments/location?startTime=' + startTime + '&endTime=' + endTime + '&locationId=Croydon';
			console.log('Viewing - ' + sourceURL);

			$('#calendar').fullCalendar('destroy');
			console.log(resourcesWC + '   - pagination');
			loadCalendarSources(sourceURL, startTime, endTime, resourcesWC);
      e.preventDefault();
  });


	function loadMultiViewCalendar(startTime, endTime, resourcesWC, myCalendarStateView, fcClass) {
			startTime = (!startTime) ? moment(date).format('YYYY-MM-DD[T]00:00') : startTime;
			endTime = (!endTime) ? moment(date).format('YYYY-MM-DD[T]23:59') : endTime;

	    $('#calendar').fullCalendar({
	        weekends: false, // will hide Saturdays and Sundays
	        start: '09:00pm', // a start time (9am in this example)
	        end: '18:00pm', // an end time (6pm in this example)
	        dow: [1, 2, 3, 4, 5], // days of week. an array of zero-based day of week integers (0=Sunday) (Monday-Friday in this example)
	        timeFormat: 'H(:mm)',
	        defaultView: 'timelineDay',
					defaultDate: startTime,
	        selectable: true,
	        selectHelper: true,
	        editable: true,
	        droppable: true,
	        //lazyFetching: true,
	        slotMinutes: 15,
	        editable: true,
	        header: {
	            left: false,
	            center: 'title',
	            right: false
	        },
	        resources: resourcesWC,
	        events: events,
	        eventResourceField: 'resources',
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
							bookedBy: 'WC001',
							bookedByName: 'John Doe'
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
					eventAfterAllRender: function(){
						console.log(fcClass);
						switch (myCalendarStateView) {
			          case 'removedWCView':
										$('#messages').append('<h2 class="heading-medium highlighted">Removed '+ fcClass +'<small class="right close-msg">Close <i class="fa fa-times"></i></small></h2>');
			              break;
								case 'newEvent':
										$('#messages').append('<h2 class="heading-medium highlighted">New event</h2>');
			              break;
			      };

						$('.fc-view-resourceDay th[class^="fc-col"]').on('click', function(){
							fcClass = $(this).text();
							if(resourcesWC.length > 1){
								$('#calendar').fullCalendar('destroy');
								resourcesWC = $.grep(resourcesWC, function(e) {return e.id!=fcClass});
								myCalendarStateView = 'removedWCView';
								loadCalendarSources(sourceURL, startTime, endTime, resourcesWC, myCalendarStateView, fcClass);
							};
						});
					}
	    });
	};

	loadCalendarSources(sourceURL);
});
