"use strict";
const Drive = use("Drive");
const File = use("App/Models/File");
const Task = use("App/Models/Task");
const fs = require("fs");
const Helpers = use("Helpers");
const path = require("path");

class DocumentController {
  async store({ params, request, response }) {
    console.log("inside");
    const taskID = params.taskID;

    const postData = request.file("file");

    //console.log(postData);
    await postData.move(Helpers.tmpPath("uploads"), {
      name: "blahem",
      overwrite: true,
    });

    if (!postData.moved()) {
      console.log("dsdsa");
      console.log(postData.error());
    }
    const file = new File();

    try {
      var image2 = fs.readFileSync(
        path.resolve(__dirname, "../../../tmp/uploads/blahem")
      );
      let arrByte = Uint8Array.from(image2);
      console.log(arrByte);
      file.title = postData.clientName;
      file.task_id = taskID;
      file.document = arrByte;
      await file.save();
      const task = await Task.find(taskID);
      await task.files().save(file);
    } catch (error) {
      console.log(error);
    }

    /* request.multipart.file('file', {}, async (file) => {
                let imageTest = await file.stream
                try {
                    var image2 = Buffer.from(imageTest).toString('bsae64')
                console.log(image2);    
                } catch (error) {
                    console.log(error);
                }
                
                const file = new File()    
                file.document = image64
                await file.save()  
            }) */

    // var image64 = fs.readFileSync(image,'base64')

    response.json({ message: "blahem" });
  }

  async show({ params, request, response }) {
    const taskID = params.taskID;
    const task = await Task.find(taskID);
    const docs = await task.files().fetch();
    //console.log(docs.rows[0])
    //const testDoc = await File.findBy({task_id : taskID})
    response.send(docs);
  }

  async destroy({ params, request, response }) {
    console.log("in the zone");
    const fileID = params.fileID;
    console.log(fileID);
    const file = await File.find(fileID);
    await file.delete();

    response.json({ message: "deleted success" });
  }
}

module.exports = DocumentController;
