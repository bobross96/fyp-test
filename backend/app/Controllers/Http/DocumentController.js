'use strict'
const Drive = use('Drive')
const File = use('App/Models/File')
const fs = require('fs')
const Helpers = use('Helpers')
const path = require('path')

class DocumentController {


    async store({ request, response}){
        console.log('inside');
        const postData = request.file('file')
        //console.log(postData);
        await postData.move(Helpers.tmpPath('uploads'), {
            name : 'blahem.pdf',
            overwrite : true
        })

        if (!postData.moved()){
            console.log('dsdsa');
            console.log(postData.error());
        }
        const file = new File()

        try {
            var image2 = fs.readFileSync(path.resolve(__dirname,'../../../tmp/uploads/blahem.pdf'))
            let imageDB = image2.toString('utf8')
            let arrByte = Uint8Array.from(image2)
            file.title = 'blahem2'
            file.document = arrByte
            await file.save()
              
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
              
        
        
        response.json({message : 'blahem'})
    }


}

module.exports = DocumentController
