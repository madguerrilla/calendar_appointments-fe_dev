var bookedBy, bookedFor, bookedByRole, date, timeStart, timeEnd, todayStart, todayEnd, monday, friday, monthStart, monthEnd, sourceURL, startTime, endTime, selectedDate, myCalendarStateView, fcClass, selectizeThis, locationId, deleteId, auditMsg;
var locationsArr = [], locationsArrBuild = [], workcoachesArrBuild = [], teamsArr = [], teamsArrId = [], appoitmentTypes = [], appoitmentTypesArr = [], events = [], resourcesWC = [], resourcesWCTeam = [], eventsTeam = [], resourcesWCId = [], eventData = [], getBusinessHours = [];
var today = $('#calendar').fullCalendar('getDate');
var locationId, locationName;
var modalID = '#populateModal';

var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();

//Get today's date - till the end of the day
todayNoTime = Date.today().toString('yyyy-MM-dd');
todayStart = Date.today().toString('yyyy-MM-ddTHH:mm');
todayEnd = Date.today().addDays(1).toString('yyyy-MM-ddTHH:mm');

//Get Monday's & Friday's date this week
monday = (Date.today().is().monday()) ? Date.today().toString('yyyy-MM-ddTHH:mm') : Date.today().last().monday().toString('yyyy-MM-ddTHH:mm');
friday = (Date.today().is().saturday()) ? Date.today().saturday().toString('yyyy-MM-ddTHH:mm') : Date.today().next().saturday().toString('yyyy-MM-ddTHH:mm');

//Get the first and last day of the month
monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toString('yyyy-MM-ddTHH:mm');
monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toString('yyyy-MM-ddTHH:mm');

//Get the first and last day of the month
monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toString('yyyy-MM-ddTHH:mm');
monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toString('yyyy-MM-ddTHH:mm');

var bookedBy = 'WC9';

// Edit event
function editEvent(calEvent){
	openForm();
  if((calEvent.id) > ''){
    $('#appointment-id').val(calEvent.id);
  }
    document.getElementById("appointmentTypeNewOrEditDiv").innerHTML = "Edit Appointment";
	$('#appointment-dd').val(moment(calEvent.start).format('DD'));
	$('#appointment-mm').val(moment(calEvent.start).format('MM'));
	$('#appointment-yy').val(moment(calEvent.start).format('YYYY'));
	$('#appointment-time').val(moment(calEvent.start).format('HH:mm'));
	$('#appointment-full-date').val(moment(calEvent.start).format('MM/DD/YYYY h:mm a'));

	$('#appointment-dd-to').val(moment(calEvent.end).format('DD'));
	$('#appointment-mm-to').val(moment(calEvent.end).format('MM'));
	$('#appointment-yy-to').val(moment(calEvent.end).format('YYYY'));
	$('#appointment-time-to').val(moment(calEvent.end).format('HH:mm'));
	$('#appointment-full-date-to').val(moment(calEvent.start).format('MM/DD/YYYY h:mm a'));

	//$('.datepicker').datetimepicker('option', 'minDate', (moment(calEvent.start).format('MM/DD/YYYY h:mm a')));
	//$('.datepicker').datetimepicker('refresh');

	$('#customerId').val(calEvent.customer.id);
	$('#bookedFor').val(calEvent.bookedFor[0]);
	$('#locationName').val(calEvent.location.id);

   var $select = $('#typeAppointment').selectize();
   var control = $select[0].selectize;
   control.clear();
   control.setValue([0, calEvent.appointmentTypeId]);

	$(this).css('border-color', 'red');
}

// Open side form
function openForm(){
	if($('#pull-out-form').is(':hidden')) {
		$('#calendar-wrapper').animate({width: '65%'}, 500, function(){
			$('#pull-out-form').slideToggle();
		});
	};
};

// Close side form
function closeForm(){
	if($('#pull-out-form').is(':visible')) {
		$('#calendar-wrapper').animate({width: '100%'}, 500, function(){
			$('#pull-out-form').slideToggle();
		});
	};
};

// Save brand new appointments
function saveNewEvent(postJSONDataComplete, confirmDoubleBook){
    var serverUrl = '/appointments';
    if(confirmDoubleBook) {
        serverUrl += '?confirmDoubleBook=true';
    }
  $.ajax({
      url: serverUrl,
      dataType: 'json',
      type: 'POST',
      crossDomain: 'true',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(postJSONDataComplete),
      beforeSend: function(){
         console.log(JSON.stringify(postJSONDataComplete));
      },
      success: function (data) {
          console.log('Success');
          if(data.exception && data.exception =='uk.gov.gsi.dwp.dsc.as.app.exception.CustomerNotFoundException'){
              alert(data.message);
          }
          else if (data.exception && data.exception =='uk.gov.gsi.dwp.dsc.as.app.exception.WrongAppointmentTypeException') {
              alert(data.message);
          }
          else if (data.exception && data.exception =='uk.gov.gsi.dwp.dsc.as.app.exception.AppointmentConflictException' && data.code == '1') {
              alert(data.message);
              hideModal(postJSONDataComplete);
          }
          else if (data.exception && data.exception =='uk.gov.gsi.dwp.dsc.as.app.exception.AppointmentConflictException' && data.code == '2') {
              // Show preconfiguration screen for double booking message and if press yes then submit.
              var r = confirm(data.message);
              if (r == true) {
                  saveNewEvent(postJSONDataComplete, true);
              }
              /*
              else {
                  hideModal();
              }*/
          }
          else if (data.exception && data.exception =='uk.gov.gsi.dwp.dsc.as.app.exception.AppointmentConflictException' && data.code == '3') {
              alert(data.message);
          }
          else if (data.exception && data.exception =='uk.gov.gsi.dwp.dsc.as.app.exception.AppointmentConflictException' && data.code == '4') {
              alert(data.message);
              //hideModal(postJSONDataComplete);
          }
          else if (data.exception && data.exception =='uk.gov.gsi.dwp.dsc.as.app.exception.AppointmentConflictException' && data.code == '5') {
              alert(data.message);
              hideModal(postJSONDataComplete);
          }
          else if (data.exception && data.exception =='uk.gov.gsi.dwp.dsc.as.app.exception.AppointmentConflictException' && data.code == '6') {
              alert(data.message);
              hideModal(postJSONDataComplete);
          }
          else if (data.exception && data.exception =='uk.gov.gsi.dwp.dsc.as.app.exception.IdNotPresentException' && data.code == '1') {
              alert(data.message);
              hideModal(postJSONDataComplete);
          }
          else if (data.exception && data.exception =='uk.gov.gsi.dwp.dsc.as.app.exception.IdNotPresentException' && data.code == '2') {
              alert(data.message);
              hideModal(postJSONDataComplete);
          }
          else {
              $('#calendar').fullCalendar('refetchEvents');
              messages('Your appointment has been booked', 'positive');
              hideModal(postJSONDataComplete);
          }
      },
      error: function (data) {
				messages('There has been a problem saving your appointment, please try again', 'negative');
				hideModal();
      }
  });
};

function messages(msg, msgclass, pretitle){
	$('#messages h1 span').html(msg);
	$('#messages .pre-title').html(pretitle);
	$('#messages').removeClass('positive').removeClass('negative');
	$('#messages').addClass(msgclass).slideDown();
	timer = null;
	if(timer){clearTimeout(timer)};
	timer = setTimeout(
		function(){
			$('#messages').slideUp();
		} , 6000
	);
};

// Create event modal (click and drag events) on the calendar GUI
function saveNewEventGUI(eventData){

    modalData = '<ol class="modal-list">';
    modalData += '<li><strong>Type of appointment:</strong><span id="select-appointment-modal" class="fiftypc"></span></li>';
    modalData += '<div class="alert alert-danger hide-to-show appointment-alert" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>Please select a appointment</div>';
    modalData += '<li><input id="startDateModal" type="text" value="' + moment(eventData.start).format('YYYY-MM-DD[T]HH:mm') + '"></li>';
    modalData += '<li><input id="endDateModal" type="text" value="' + moment(eventData.end).format('YYYY-MM-DD[T]HH:mm') + '"></li>';
    //modalData += '<li><strong>Start date & time:</strong> ' + moment(eventData.start).format('DD/MM/YYYY HH:mm') + '</li>';
    //modalData += '<li><strong>End date & time:</strong> ' + moment(eventData.end).format('DD/MM/YYYY HH:mm') + '</li>';
    modalData += '<li><strong>Customer ID: </strong><input class="form-control fiftypc" id="customerId-modal" name="customerId-modal" required></li>';
    //modalData += '<div class="alert alert-danger hide-to-show custId-alert" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>Please enter a customer ID</div>';
    modalData += '<li><strong>Booked for:</strong>' + eventData.bookedFor +'</li>';
    modalData += '<li><strong>Booked by:</strong>' + eventData.bookedBy +'</li>';
    modalData += '</ol>';

		populateModal('Create new appointment', modalData, 'Close', 'Save & close', 'save-changes')

		bookedBy = eventData.bookedBy;
		bookedFor = eventData.bookedFor;

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

function getWcAsList(){
  /*console.log(resourcesWCId);
  pickWC = [];
  $.each(resourcesWCId, function (key, val) {
      pickWC.push('<option value="' + val + '">' + val + '</option>');
      console.log(val);
  });
  selectizeThis = $('<select/>', {
      'class': 'form-control max',
      'id': 'pickWC',
      'name': 'pickWC',
      'data-placeholder': 'Select a work coach',
      'tabindex': '-1',
      html: pickWC.join('')
  });
  console.log(selectizeThis);*/
  selectizeThis = '<input class="form-control fiftypc" id="wcSelect-modal" name="wcSelect-modal" required>'
  return selectizeThis
}

// Save the new event from the modal GUI
$(modalID).on('click', '#save-changes', function(){
  if(!eventData){

  }
  else {
    if(!$('#select-appointment-m').val()) {
      $('#select-appointment-m').focus();
      $('#modalSaveNewEvent .modal-body .select-appointment').show();
      var go = 'false';
    }

    if (go != 'false'){
			console.log(bookedBy);
      eventData = {
        startTime: $('#startDateModal').val(),
        endTime: $('#endDateModal').val(),
        bookedBy: bookedBy,
        bookedFor: [bookedFor],
        'appointmentTypeId': $('#select-appointment-m').val(),
        'locationId': locationId,
        'customerId': $('#customerId-modal').val(),
        'travelTimeBefore': '0',
        'travelTimeAfter': '0'
      };
        saveNewEvent(eventData, false);
    }
  }
});

function hideModal(postJSONDataComplete) {
     $(modalID).modal('hide');
    var locationName = $('#locationName').val();
    document.getElementById("form-book-appointment").reset();
    $('#locationId').val('').val(postJSONDataComplete.locationId);
    $('#locationName').val('').val(locationName);
    document.getElementById("appointmentTypeNewOrEditDiv").innerHTML = "New Appointment";

}
// Insert date values from datepicker
function insertDateValues(date, fieldSet){
  fullDate = date;
  date = date.split(/\//g);
  day = date[1];
  month = date[0];
  year = date[2];
  time = year.split(' ');
  year = time[0];
  time = time[1];
  console.log(time);
  $(fieldSet + '.appointment-dd').val('').val(day);
  $(fieldSet + '.appointment-mm').val('').val(month);
  $(fieldSet + '.appointment-yy').val('').val(year);
  $(fieldSet + '.appointment-time').val('').val(time);
  $('#datepicker-to #appointment-full-date-to').datetimepicker('option', 'minDate', fullDate);
  $('#datepicker-to #appointment-full-date-to').datetimepicker('refresh');
}

// UI Calendar picker

var datePickerOpts =
  {controlType: 'select',
  oneLine: true,
  timeFormat: 'hh:mm tt',
  minDate: 0,
  hourMin: 8,
  hourMax: 19,
  stepMinute: 15,
  showButtonPanel: false,
  showOn: 'button',
  buttonText: '<i class="fa fa-calendar datepicker-btn left"></i>'};

$('#appointment-full-date').datetimepicker({
  controlType: 'select',
  oneLine: true,
  timeFormat: 'HH:mm tt',
  minDate: 0,
  hourMin: 8,
  hourMax: 19,
  stepMinute: 15,
  showButtonPanel: false,
  showOn: 'button',
  buttonText: '<i class="fa fa-calendar datepicker-btn left"></i>',
    onSelect: function (date) {
      insertDateValues(date, '#datepicker-from ');
    }
});

// Insert date and time on fields from date picker
$('#appointment-full-date-to').datetimepicker({
  controlType: 'select',
  oneLine: true,
  timeFormat: 'HH:mm tt',
  minDate: 0,
  hourMin: 8,
  hourMax: 19,
  stepMinute: 15,
  showButtonPanel: false,
  showOn: 'button',
  buttonText: '<i class="fa fa-calendar datepicker-btn left"></i>',
    onSelect: function (date) {
      insertDateValues(date, '#datepicker-to ');
    }
});

$(document).ready(function () {
	// Get user agent details for top right corner
  if(bookedBy > ''){
    $.ajax({
        url: '/public/javascripts/json/workforce-agent.json', //+ bookedBy,
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        crossDomain: 'true',
        draggable: true,
        success: function (data) {
        userDetails = ((data[0].avatar) != '') ? '<li class="user-avatar"><img src="/public/images/'+ data[0].avatar +'" alt="'+ data[0].name +' - '+ data[0].role +'"></li>' : '<li class="user-avatar"></li>';
        userDetails += '<li class="user-name">'+ data[0].name +'</li><li class="user-job">'+ data[0].role +'</li>'
        $(userDetails).appendTo('#user-agent');
        },
        error: function () {
            console.log('Can not load file for menu agents');
        }
    });

  };

    /*if(bookedBy > ''){
        $.ajax({
            url: 'http://localhost:8082//workforce/agent/' + bookedFor,
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: 'get',
            crossDomain: 'true',
            draggable: true,
            success: function (data) {

                document.getElementById("bookedForDiv").innerHTML = "<h3>Work Coach: " + data.name + "</h3>";
            },
            error: function () {
                console.log('Can not load file for menu agents');
            }
        });

    };
*/
		// Added for Heroku demo purposes
		$('#bookedForDiv').append('<h3>Work Coach: John Doe</h3>');


	// Get appointment types and use selectize plugin
  $.ajax({
      url: '/public/javascripts/json/appointment-types.json',
      dataType: 'json',
      type: 'get',
      crossDomain: 'true',
      draggable: true,
      success: function (data) {
          $.each(data, function (key, val) {
              appoitmentTypesArr.push({
                id: val['id'],
                appointment: val['name']
              });
              appoitmentTypes.push('<option value="' + val['id'] + '">' + val['type'] + '</option>');
          });
          if('#typeAppointment' != '') {
            $('<select/>', {
                'class': 'max',
                'id': 'typeAppointment',
                'name': 'typeAppointment',
                'data-placeholder': 'Select a type of appointment',
                'tabindex': '-1',
                html: appoitmentTypes.join('')
            }).appendTo('#select-appointment-type');
            $('#typeAppointment').selectize({
                create: true,
                sortField: 'value'
            });
            console.log('Appointment types loaded into drop down');
          }
          else {
            console.log('Appointment types loaded but no drop down selection is avaiable');
          }
      },
      error: function () {
          console.log('Can not load file for appointnment types');
      }
  });
  // calendar Views (Day, Week, Month)
  $('.filter-dwm').click(function (e) {
      opts = $(this).find('a').attr('rel');
      $('.filter-dwm').removeClass('active');
      $(this).addClass('active');
      getDateByView('changeView', opts);
  });


  function getDateByView(fulCalRun, opts){
      switch (opts) {
          case 'month':
              timeStart = monthStart;
              timeEnd = monthEnd;
              $('#filter-today .button').html('This month');
              break;
          case 'agendaWeek':
              timeStart = monday;
              timeEnd = friday;
              $('#filter-today .button').html('This week');
              break;
          case 'agendaDay':
              timeStart = todayStart;
              timeEnd = todayEnd;
              $('#filter-today .button').html('Today');
              break;
      }
      if(fulCalRun != 'pagination') {
        $('#calendar').fullCalendar(fulCalRun, opts);
      }
      else {
        $('#calendar').fullCalendar(opts);
      };
      $('#calendar').fullCalendar('refetchEvents');
  };

  // Calendar Pagination
  $('.calendar-pagination').click(function (e) {
      opts = $(this).find('a').attr('rel');
      $('#calendar').fullCalendar(opts);
      $('#calendar').fullCalendar('rerenderEvents');

      e.preventDefault();
  });

  var appointmentForm = '#form-book-appointment';
  var formFind = $('body').find(appointmentForm);
});

// Close appointment form
$('.closeForm').click(function (e) {
  closeForm();
});

// Close a message
$('#messages').on('click', '.close-msg', function(){
  var clsMsg = $(this).parent('h2');
  $(clsMsg).hide(function(){
    $(clsMsg).animate({'opacity' : '0', 'height' : '0', 'width' : '100%'}, 500)
  });
});

function deleteAppointment(event, jsEvent) {
    var trashEl = jQuery('#delete');
    var ofs = trashEl.offset();
    var x1 = ofs.left;
    var x2 = ofs.left + trashEl.outerWidth(true);
    var y1 = ofs.top;
    var y2 = ofs.top + trashEl.outerHeight(true);
    if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 && jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
				deleteId = event.id;
				modalData = '<p><strong>Delete appointment:</strong> '+ event.title +'</p>';
				modalData += '<p><strong>Start time:</strong> '+ (moment(event.start).format('DD/MM/YYYY HH:mm'));
				modalData += '<br><strong>End time:</strong> '+ (moment(event.end).format('DD/MM/YYYY HH:mm')) +'</p>'
				modalData += '<div class="form-group width100"><label class="form-hint" for="delete-msg"><span aria-hidden="true">Please provide a reason</span></label><textarea rows="3" class="form-control" id="delete-msg" name="delete-msg" autocomplete="off" /></div>';
        populateModal('Do you want to delete this appointment?', modalData, 'No', 'Yes', 'delete-appointment');
    }
};

$(modalID).on('click', '#delete-appointment', function(){
	auditMsg = $('#delete-msg').val();
	auditMsg = (!auditMsg) ? 'No message provided' : auditMsg;
	//deleteAppointmentConfirm(deleteId, auditMsg); Removed for Heroku
	$('#calendar').fullCalendar('removeEvents', deleteId);
	$(modalID).modal('toggle');
  $('#calendar').fullCalendar('rerenderEvents');
  $('#calendar').fullCalendar('refetchEvents');
	messages('The appointment has been deleted');
  //location.reload();
});

function deleteAppointmentConfirm(deleteId, auditMsg) {
	$.ajax({
			url: '/appointments?id=' + deleteId + '&auditBy=' + bookedBy + '&auditMsg='+ auditMsg,
			dataType: 'json',
			type: 'DELETE',
			crossDomain: 'true',
			headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
			},
			success: function(data) {
                if(data.message){
                    alert(data.message);
                }
				$('#calendar').fullCalendar('removeEvents', deleteId);
                //$('#calendar').fullCalendar(
                //    'removeEvents', deleteId //or something like that
                //);
                //$('#calendar').fullCalendar(
                //    'renderEvent', data.eventblock, false
                //);
			},

			error: function(data) {
				console.log('Can not delete appointment');
                //$('#calendar').fullCalendar(
                //    'removeEvents', deleteId //or something like that
                //);
                //$('#calendar').fullCalendar(
                //    'renderEvent', data.eventblock, false
                //);
			}
	});
    $('#calendar').fullCalendar( 'refetchEvents' );
};

function populateModal(modalTitle, modalData, secondaryBtn, primaryBtn, trigger) {
	if(modalID.length) {
		$(modalID + ' #modal-title').empty().append(modalTitle);
		$(modalID + ' .modal-body').empty().append(modalData);
		$(modalID + ' .btn-default').empty().append(secondaryBtn);
		$(modalID + ' .btn-primary').attr('id', trigger).empty().append(primaryBtn);
		$(modalID).modal('toggle');
	}
}
