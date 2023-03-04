const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: 'stevepetes26@gmail.com',
        pass: 'dcqlyjoedlvughau'
    }
});


const message = {
    from: 'Esteban stevepetes26@gmail.com',
    to: 'bikosteven2001@gmail.com',
    subject: 'Nodmailer Test',
    text: 'Thank You Success Attained'
};


transporter.sendMail(message, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Email sent: ' + info.response);
    }
});
