
var date, timeStart, timeEnd, todayStart, todayEnd, monday, friday, monthStart, monthEnd, sourceURL, calendars, sortedCalendars;

// dummy data to populate calendar during offline dev
var tempAppointments = [{"id": "55f6e001d4c67c780cc03acb", "bookedBy": "WC1", "bookedFor": ["WC1"], "appointmentTypeId": "55f6e001d4c67c780cc03aca", "locationId": "55f6e001d4c67c780cc03ab6", "customer": {"agentId": null, "customerName": "Mr James Smith"}, "startTime": "2015-09-17T12:00", "endTime": "2015-09-17T12:30", "option": null }, {"id": "55f6e001d4c67c780cc03acc", "bookedBy": "WC1", "bookedFor": ["WC1"], "appointmentTypeId": "55f6e001d4c67c780cc03aca", "locationId": "55f6e001d4c67c780cc03ab6", "customer": {"agentId": null, "customerName": "Mr James Smith"}, "startTime": "2015-09-17T11:30", "endTime": "2015-09-17T12:00", "option": null }, {"id": "55f6e001d4c67c780cc03acd", "bookedBy": "WC1", "bookedFor": ["WC1"], "appointmentTypeId": "55f6e001d4c67c780cc03aca", "locationId": "55f6e001d4c67c780cc03ab6", "customer": {"agentId": null, "customerName": "Mr James Smith"}, "startTime": "2015-09-17T12:01", "endTime": "2015-09-17T12:30", "option": null }, {"id": "55f6e001d4c67c780cc03ace", "bookedBy": "WC1", "bookedFor": ["WC2"], "appointmentTypeId": "55f6e001d4c67c780cc03aca", "locationId": "55f6e001d4c67c780cc03ab6", "customer": {"agentId": null, "customerName": "Mr James Smith"}, "startTime": "2015-09-17T12:31", "endTime": "2015-09-17T13:00", "option": null }, {"id": "55f6e001d4c67c780cc03acf", "bookedBy": "WC1", "bookedFor": ["WC2"], "appointmentTypeId": "55f6e001d4c67c780cc03aca", "locationId": "55f6e001d4c67c780cc03ab6", "customer": {"agentId": null, "customerName": "Mr James Smith"}, "startTime": "2015-09-17T11:30", "endTime": "2015-09-17T12:00", "option": null }, {"id": "55f6e001d4c67c780cc03ad0", "bookedBy": "WC1", "bookedFor": ["WC1", "WC2"], "appointmentTypeId": "55f6e001d4c67c780cc03aca", "locationId": "55f6e001d4c67c780cc03ab6", "customer": {"agentId": null, "customerName": "Mr James Smith"}, "startTime": "2015-09-17T12:01", "endTime": "2015-09-17T12:30", "option": null }, {"id": "55f6e001d4c67c780cc03ad1", "bookedBy": "WC1", "bookedFor": ["WC3"], "appointmentTypeId": "55f6e001d4c67c780cc03aca", "locationId": "55f6e001d4c67c780cc03ab6", "customer": {"agentId": null, "customerName": "Mr James Smith"}, "startTime": "2015-09-17T12:31", "endTime": "2015-09-17T13:00", "option": null}];


date = new Date();

//Get today's date - till the end of the day
todayStart = Date.today().toString('yyyy-MM-ddTHH:mm');
todayEnd = Date.today().addDays(1).toString('yyyy-MM-ddTHH:mm');

//Get Monday's & Friday's date this week
monday = (Date.today().is().monday()) ? Date.today().toString('yyyy-MM-ddTHH:mm') : Date.today().last().monday().toString('yyyy-MM-ddTHH:mm');
friday = (Date.today().is().friday()) ? Date.today().friday().toString('yyyy-MM-ddTHH:mm') : Date.today().next().friday().toString('yyyy-MM-ddTHH:mm');

//Get the first and last day of the month
monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toString('yyyy-MM-ddTHH:mm');
monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toString('yyyy-MM-ddTHH:mm');

//Get the first and last day of the month
monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toString('yyyy-MM-ddTHH:mm');
monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toString('yyyy-MM-ddTHH:mm');

$.ajax({
    url: '/public/javascripts/json/apointment-types.json',
    dataType: 'json',
    type: 'get',
    crossDomain: 'true',
    draggable: true,
    success: function (data) {
        var items = [];
        $.each(data, function (key, val) {
            items.push('<option value="' + val['id'] + '">' + val['type'] + '</option>');
        });
        $('<select/>', {
            'class': 'form-control max',
            'id': 'typeAppointment',
            'name': 'typeAppointment',
            'data-placeholder': 'Select a type of appointment',
            'tabindex': '-1',
            html: items.join('')
        }).appendTo('#select-appointment-type');
        $('#typeAppointment').selectize({
            create: true,
            sortField: 'value'
        });
    },
    error: function () {
        console.log('Can not find appointment types');
    }
});
var filterOption;


function filterCalendar(value) {
    filterOption = value;
    console.log("filtered with " + value);
    $('#calendar').fullCalendar('rerenderEvents');

}

// given a set of appointment data, sort into sets of data
function generateCalendars(appointmentData)
{
	console.log('in generateCalendars');

	var bookedForIds = [];

	// how many calendars do we need? (as per bookedFor field)
	appointmentData.forEach(function(appointment)
	{
		//console.log(appointment.bookedFor);
		appointment.bookedFor.forEach(function(id)
		{
			bookedForIds.push(id);
		}
		);
	});

	// remove duplicates
	bookedForIds = $.unique(bookedForIds);
	console.log(bookedForIds);

	// now with our array of IDs, go through the appointment data and make an object with event data in correct format for each of our calendars
	sortedCalendars = [];

	bookedForIds.forEach(function(bookedforid){
		var calendar = {};
		console.log('xxx' + bookedforid);
		calendar.name = bookedforid;
		var events = [];

		// now make
		var events = [];
        $.each(appointmentData, function (key, val) {
        	console.log(bookedforid);
        	console.log(this.bookedFor);
        	if($.inArray(bookedforid,this.bookedFor) !== -1)
        	{
	            events.push({
	                id: val['id'],
	                start: val['startTime'],
	                end: val['endTime'],
	                option: val['option'],
	                customer:val['customer']
	            });
            }
        });

        calendar.events = events;
    	sortedCalendars.push(calendar);

        console.log('events for ' + bookedforid);
    	console.log(events);

	});

	console.log('sorted calendar data:');
	console.log(sortedCalendars);

	// now generate new calendars divs in the dom with appropriate IDs and push the events on to them

	// for dev there are 3 hardcoded calendars called 'calendar_1', 'calendar_2', 'calendar_3'
	// ******************************
	// generate calendar DOM elements here
	// ******************************

	// dev temp - fudge names of the calendars to fit with hardcoded divs in dom
	sortedCalendars[0].name = 'calendar_1';
	sortedCalendars[1].name = 'calendar_2';
	sortedCalendars[2].name = 'calendar_3';


	// now go through each calendar and initialise with the appropriate events
	sortedCalendars.forEach(function(obj){
		instantiateCalendar(obj.name, obj.events);
	});


	console.log('appointmentData.length:' + appointmentData.length);
}

// gets all the appointments from database
function initialiseCalendars()
{
	sourceURL = '/appointments?startTime=' + timeStart + '&endTime=' + timeEnd + '&bookedFor=WC2'
	$.ajax({
	    url: sourceURL,
	    dataType: 'json',
	    type: 'get',
	    crossDomain: 'true',
	    success: function (data) {

	    	generateCalendars(data);

	        //fulCalStartMon = $('#calendar').fullCalendar('getView').start.format("DD-MMM-YYYY");
	        //fulCalStartMon += ' - ' + $('#calendar').fullCalendar('getView').end.format("DD-MMM-YYYY");
	        //$('#calendar-title').html(fulCalStartMon);
	    },
	    error: function()
	    {
	    	console.log("Can't retrieve appointments");

	    	// for dev, use temp data
	    	generateCalendars(tempAppointments);

	    }

	});

}

// sets up each calendar in the calendars array
// needs refactoring so we only get data from the server once, not per calendar
function instantiateCalendar(calendarId,calendarEvents)
{


	$('#' + calendarId).fullCalendar({
        defaultView: 'agendaDay',
        calendarId: calendarId,
        calendarEvents: calendarEvents,

        weekends: false, // will hide Saturdays and Sundays
        start: '09:00', // a start time (9am in this example)
        end: '18:00', // an end time (6pm in this example)
        dow: [1, 2, 3, 4, 5], // days of week. an array of zero-based day of week integers (0=Sunday) (Monday-Friday in this example)
        timeFormat: 'H(:mm)',
        views: {
            agendaWeek: {
                columnFormat: 'ddd D/M'
            }

        },
        firstDay: 1,//(Monday)

        lazyFetching: true,
        header: {
            left: false,
            center: 'title',
            right: false
        },


        events: function (start, end, timezone, callback) {
            if ((!timeStart) || (!timeEnd)) {
                timeStart = monday;
                timeEnd = friday;
            }
            console.log('my events:');
            console.log(calendarEvents);
            callback(calendarEvents);

        },
        eventRender: function (event, element) {
            element.context.innerText= event.customer;
            //console.log(event.customer);

            return filterOption == event.option;

        }
    });
}

$(document).ready(function () {
	console.log('page ready');



	// call setup function for each calendar
    //instantiateCalendars(calendars);

    // get data, sort into calendar sets of data, then generate the calendars
    initialiseCalendars();

// Calendar Pagination
    $('.calendar-pagination').click(function (e) {

        opts = $(this).find('a').attr('rel');
        console.log(opts);
        $('#calendar').fullCalendar(opts);
        e.preventDefault();
    });

    var appointmentForm = '#form-book-appointment';
    var formFind = $('body').find(appointmentForm);

    /*if ($(formFind).length) {
     $(appointmentForm).parsley({
     trigger: 'focusout', // What listen event shall trigger the validation
     successClass: "success", // Success class name
     errorClass: "error", // Error class name that will be applied on the element returned in the classHandler
     classHandler: function(el) {
     return el.$element.parent('.form-group');
     }, // classHandler returns the element where successClass and errorClass are applied
     errorsContainer: function(el) {
     return el.$element.parent().find('.error-container');
     }, // This tells the script which element we want to display the error message
     errorsWrapper: '<span class="error-message" aria-hidden="true"></span>', // This will wrap around our errorTemplate
     errorTemplate: '<span></span>' // The error message will be displayed within this HTML element
     }).on('form:success', function() {
     postData();
     });
     };*/
})
;

$('#submit').click(function (e) {

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


    var startTimeJSON = postJSONData['appointment-yy'] + '-' + postJSONData['appointment-mm'] + '-' + postJSONData['appointment-dd'] + '-T' + postJSONData['appointment-time'];
    var endTimeJSON = postJSONData['appointment-yy-to'] + '-' + postJSONData['appointment-mm-to'] + '-' + postJSONData['appointment-dd-to'] + '-T' + postJSONData['appointment-time-to'];

    postJSONDataID = (!postJSONData['id']) ? 'null' : postJSONData['id'];
    bookedBy = (!postJSONData['bookedBy']) ? 'null' : postJSONData['bookedBy'];
    bookedFor = (!postJSONData['bookedFor']) ? ['WC001'] : ['WC001'];
    appointmentTypeId = (!postJSONData['typeAppointment']) ? 'null' : postJSONData['typeAppointment'];
    locationId = (!postJSONData['locationId']) ? '1' : '1';
    customerId = (!postJSONData['customerId']) ? 'CLA001' : 'CLA001';
    option = (!postJSONData['option']) ? 'null' : postJSONData['option'];

    postJSONDataComplete = {
        'id': postJSONDataID,
        'bookedBy': bookedBy,
        'bookedFor': bookedFor,
        'appointmentTypeId': appointmentTypeId,
        'locationId': locationId,
        'startTime': startTimeJSON,
        'endTime': endTimeJSON,
        'option': option,
        'customerId': customerId
    };

    console.log('Posting --- ' + postJSONDataComplete);

    $.ajax({
        url: '/appointments',
        dataType: 'json',
        type: "POST",
        crossDomain: 'true',
        data: JSON.stringify(postJSONDataComplete),
        success: function (data) {
            console.log('Success');
            $('#calendar').fullCalendar('refresh');
            $('#booking-confirmation').show();
        },
        error: function (data) {
            console.log('Error creating appointment');
            $('#booking-confirmation').show();
        }
    });
    e.preventDefault();
});

// UI Calendar picker
$('.datepicker').datetimepicker({
    controlType: 'select',
    oneLine: true,
    timeFormat: 'hh:mm tt',
    minDate: new Date(todayStart),
    hourMin: 8,
    hourMax: 19,
    stepMinute: 15,
    showButtonPanel: false,
    onSelect: function (date) {
        //$('.datepicker-to').datetimepicker('option', 'minDate', date);

        date = date.split(/\//g);

        day = date[1];
        month = date[0];
        year = date[2];
        time = year.split(' ');
        year = time[0];
        time = time[1];

        $('#appointment-dd').val('').val(day);
        $('#appointment-mm').val('').val(month);
        $('#appointment-yy').val('').val(year);
        $('#appointment-time').val('').val(time);
    }
});

$('.datepicker-to').datetimepicker({
    controlType: 'select',
    oneLine: true,
    timeFormat: 'hh:mm tt',
    minDate: new Date(todayStart),
    hourMin: 8,
    hourMax: 19,
    stepMinute: 15,
    showButtonPanel: false,
    onSelect: function (date) {
        //$('.datepicker').datetimepicker('option', 'maxDate', date);

        date = date.split(/\//g);

        day = date[1];
        month = date[0];
        year = date[2];
        time = year.split(' ');
        year = time[0];
        time = time[1];

        $('#appointment-dd-to').val('').val(day);
        $('#appointment-mm-to').val('').val(month);
        $('#appointment-yy-to').val('').val(year);
        $('#appointment-time-to').val('').val(time);
    }
});
