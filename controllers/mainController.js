
// GET /: homepage of MM

exports.index = (req, res) =>
{
    res.render('./main/index');
};

// GET /about: homepage of MM

exports.about = (req, res) =>
{
    res.render('./main/about');
};

// GET /contact
exports.contact = (req, res) =>
{
    res.render('./main/contact')
}