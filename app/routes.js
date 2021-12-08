module.exports = {
  bind : function (app) {
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Headers', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    app.get('/', function (req, res) {
      res.render('menu');
    });

    app.get('/test/:testparam', function (req, res) {
      //console.log('xxx hello ' + req.params.testparam);
      res.render('calendar', { test_param: req.params.testparam });
    });

    app.get('/team/:bookedBy', function (req, res) {
      res.render('team-overview', { jobcentreID: req.params.jobcentreID, bookedBy: req.params.bookedBy, });
    });

    app.get('/jobcentrecalendar/:jobcentreID', function (req, res) {
      res.render('jobcentre-calendar', { jobcentreID: req.params.jobcentreID });
    });

    app.get('/teamcalendar/:jobcentreID/:teamID', function (req, res) {
      res.render('team-calendar', { jobcentreID: req.params.jobcentreID, teamID: req.params.teamID });
    });

    app.get('/calendar/:bookedBy', function (req, res) {
      res.render('calendar', { bookedBy: req.params.bookedBy, bookedFor: req.params.bookedBy });
    });

    app.get('/calendar/:bookedBy/:bookedFor', function (req, res) {
      res.render('calendar', { bookedBy: req.params.bookedBy, bookedFor: req.params.bookedFor });
    });

    app.post('/appointments', function (req, res) {
      res.send('/appointments');
    });

    app.put('/appointments', function (req, res) {
      res.send('/appointments');
    });

    app.put('/jobcentrecalendar/:jobcentreID', function (req, res) {
      res.send('jobcentre-calendar', {jobcentreID: req.params.jobcentreID});
    });

    // add your routes here

  }
};
