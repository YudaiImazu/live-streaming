const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const fs = require("fs");
const multer = require("multer");



app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("./public"));


app.get("/", (req,res) => {
    res.send("Welcome to the home page baby");
})

app.post("/user_create", (req, res) => {
    console.log("trying to create user....");

    console.log("First Name:" + req.body.last_name);
    res.end();
})

app.post("/video", (req,res) => {

    const ID = "AKIA6E6FFYILN4QR2OGP";
    const SECRET = "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";
    
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    });
    
    // const uploadFile = (fileName,name) => {
    //     const fileContent = fs.readFileSync(fileName);
    
    //     const params = {
    //         Bucket: "test-for-video-imazu",
    //         Key: name,
    //         Body: fileContent
    //     };

    const uploadFile = (file,name) => {

       
        const fileContent = fs.readFileSync(file);

        const params = {
            Bucket: "test-for-video-imazu",
            Key: name,
            Body: fileContent
        };
    
    
        s3.upload(params, function(err, data) {
            if (err) {
                throw err;
            } else {
                console.log('File upload successfully. ${data.Location}');
            }
        })
    }
    
    
    uploadFile(req.body.file, req.body.name);

    res.end();

})




app.post("/test", (req,res) => {
    console.log("******** test get called *******")

    const ID = "AKIA6E6FFYILN4QR2OGP";
    const SECRET = "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";
    
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    });
    
    // const uploadFile = (fileName,name) => {
    //     const fileContent = fs.readFileSync(fileName);
    
    //     const params = {
    //         Bucket: "test-for-video-imazu",
    //         Key: name,
    //         Body: fileContent
    //     };

    const uploadFile = (file) => {
  
        const fileContent = fs.readFileSync(file);


       
      

        const params = {
            Bucket: "test-for-video-imazu",
            Key: "test1",
            Body: fileContent,
            
            // ACL: "public-read",
        };
    
    
        // s3.upload(params, function(err, data) {
        //     if (err) {
        //         throw err;
        //     } else {
        //         console.log('File upload successfully. ${data.Location}');
        //     }
        // })
        s3.putObject(params, function(err, data) {
            if (err) {
                results.innerHTML = 'ERROR: ' + err;
                console.log(data);
            } else {
                console.log('File upload successfully. ${data.Location}');
            }
        });
    }
    
    
    uploadFile(req.body.video);

    res.end();

})


// const localStorage = multer.diskStorage({
//     destination: function(req, file, cd) {
//         const destination = "./upload";
//         console.log("deatination", destination);
//         cd(null, destination);
//     },
//     filename: function(req, file, cd) {
//         const filename = req.body.id + "." + file.mimetype.toString().slice(file.mimetype.toString().lastIndexOf("/") + 1);
//         console.log("filename", filename);
//         cd(null, filename);
//     }
// });
// const uploadLocal = multer({
//     storage: localStorage
// });

// app.post("/upload-temp", uploadLocal.array("upload"), async(req, res, next) => {
    
//     res.json({id: req.body.id});
// });

const upload = multer({ dest: './uploads/' }).single('thumbnail');
app.post("/upload-temp", function(req, res) {
    console.log("test")
    console.log(req.body);
    console.log("**************");
    
    upload(req, res, function(err) {
        if(err) {
            res.send("Failede to write" + req.body.q.file.destination + "with" + err)
        } else {
            res.send("uploaded : " + req.body.q);
        }
    })
})


app.post("/ffmpeg", async(req, res, next) => {
    try {
        const reqPath = path.join(__dirname, "../upload/canvas-upload");
        const {id, type} = req.body;
        const localFileInput = `${reqPath}${id}.webm`;
        const localFileOutput = `${reqPath}${id}.${type}`;
        console.log("localInput", localFileInput);
        console.log("localOutput", localFileOutput);
        const key = `canvas/${id}.${type}`;
        await new Promise((resolve, reject) => {
           ffmpeg().input(localFileInput)
           .withOutputFormat(type)
           .output(localFileOutput)
           .on("end", async () => {
               const fileContent = await fs.readFileSync(localFileOutput);
               await fs.unlinkSync(localFileInput);
               await fs.unlinkSync(localFileOutput);
               const params = {
                Bucket: "test-for-video-imazu",
                Key: "test1",
                Body: fileContent,
               }
               await s3.putObject(params).promise();
               resolve();
           }).run();
        })
        res.send("success");
    } catch(error) {
        console.log(error);
        res.send(error);
    }
})


const port = process.env.port || 3000;

app.listen(port, () => {
    console.log("wwwwww");
});



