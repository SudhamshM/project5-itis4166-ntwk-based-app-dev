const model = require('../models/meetupEvent');
const rsvpModel = require('../models/rsvp');
var mongoose = require('mongoose');

// /GET stories: send all stories to user

exports.index = (req, res, next) =>
{
    model.find()
    .then((events) => 
    {
        let array = Array.from(events);
        result = array.reduce(function (eventObject, event) 
        {
            eventObject[event.category] = eventObject[event.category] || [];
            eventObject[event.category].push(event);
            return eventObject;
        }, Object.create(null));
        return res.render('./event/index', {eventObject: result})
    })
    .catch(err => next(err))
   
    
};

exports.new = (req, res) =>
{
    res.render('./event/new');
};

exports.create = (req, res, next) =>
{
    let event = req.body;
    event.hostName = req.session.user;
    event.image = "images/" + req.file.filename;
    let eventModel = new model(event);
    eventModel.save()
    .then((event) => 
    {
        req.flash("success", "Meetup successfully created!")
        return res.redirect('/events/' + event.id)
    })
    .catch(err => 
        {
            if (err.name === 'ValidationError')
            {
                err.status = 400;
            }
            req.flash("error", err.message);
            return res.redirect('back');
        })
    
};

exports.show = (req, res, next) =>
{
    let id = req.params.id;
    model.findById(id).populate('hostName')
    .then(
        (event) => {
            if (event)
            {
                res.render('./event/show', {event})
            }
            else
            {
                let err = new Error("Cannot find event with id " + id);
                err.status = 404;
                next(err);
            }
}
    )
    .catch(err => next(err))
    
};

exports.edit = (req, res, next) =>
{
    let id = req.params.id; 
    model.findById(id)
    .then(
        (event) => {
            if (event)
            {
                res.render('./event/edit', {event})
            }
            else
            {
                let err = new Error("Cannot find event with id " + id);
                err.status = 404;
                next(err);
            }
                }
    )
    .catch(err => next(err))
};

exports.update = (req, res, next) => 
{
    let event = req.body;
    let id = req.params.id;
    event.image = "images/" + req.file.filename;
    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then((event) =>
    {
        if (event)
        {
            req.flash("success", "Meetup successfully updated!")
            return res.redirect('/events/' + id);
        }
        else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    } )
    .catch(err => 
        {
            if (err.name === 'ValidationError')
            {
                err.status = 400;
            }
            req.flash("error", err.message);
            return res.redirect(err.message); 
        })
    
   
};

exports.delete = (req, res, next) =>
{
    let id = req.params.id;
    model.findOneAndDelete({_id: id})
    .then((event) =>
    {
        if (event)
        {
            req.flash("success", "Meetup successfully deleted.")
            return res.redirect('/events');
        }
        else
        {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err))
};

exports.rsvp = (req, res, next) =>
{
    let id = req.params.id;

    let rsvpItem = new rsvpModel({
        status: req.body.rsvp,
        hostName: req.session.user,
        event: new mongoose.Types.ObjectId(id),
    });
    rsvpItem.save()
    .then((event) =>
    {
        console.log(event);
        req.flash("success", "RSVP status set to " + req.body.rsvp + "!")
        return res.redirect('/events/' + id)
    })
    .catch((err) => next(err))
}

