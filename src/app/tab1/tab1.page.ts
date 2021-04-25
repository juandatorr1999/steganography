import { Component, ElementRef, ViewChild } from '@angular/core';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { Plugins, registerWebPlugin } from '@capacitor/core';

import {ImagePicker} from '@ionic-native/image-picker/ngx'


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  imageResponse: any;
  options: any;
  msg:any;
  msg_binary;

  canvas:any;
  context:any;

  image:any;
  

  

  constructor(private imagePicker: ImagePicker) { }
  ngOnInit() {
    console.log("Register custom capacitor plugins");
    registerWebPlugin(FileSharer);
  }

  saveGallery(){

    //Convert the message to binary and store it  in msg_binary
    this.convertWordToBinary();
    // this.encryptImage();
    //Share the picture 
    Plugins.FileSharer.share({
      filename: "test112.png",
      base64Data: this.imageResponse.replace('data:image/png;base64,', '').toString(),
      contentType: "image/png",
    }).then(() => {
        console.log("shared!!!");
    }).catch(error => {
        console.error("File sharing failed!", error.message);
    });
  }

  encryptImage(){
    this.image = document.getElementById('myImgP');
    this.canvas = document.getElementById('myCanvas');
    var context = this.canvas.getContext('2d');
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    context.drawImage(this.image, 0, 0);
    
    
    var imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    console.log(imageData.data.length);
    // for (var i = 0; i < imageData.data.length; i++) {
    //   imageData.data[i] = 255;
    // }
    // context.putImageData(imageData, 0, 0);
  }

  convertLetterToBinary(letter){
    return letter.charCodeAt(0).toString(2);
  }

  convertWordToBinary(){
    this.msg_binary = []
    for (var i = 0 ;i<this.msg.length;i++){
      if(this.msg.charCodeAt(0)<64){
        this.msg_binary[i] = "000"+this.convertLetterToBinary(this.msg[i]);
      }
      else if(this.msg.charCodeAt(0)<64){
        this.msg_binary[i] = "00"+this.convertLetterToBinary(this.msg[i]);
      }
      else if(this.msg.charCodeAt(0)<128)
      this.msg_binary[i] = "0"+this.convertLetterToBinary(this.msg[i]);
      else{
        this.msg_binary[i] = this.convertLetterToBinary(this.msg[i]);
      }
    }
    console.log(this.msg_binary);
  }
  
  public getImage(){
    this.options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      maximumImagesCount: 1,

      // max width and height to allow the images to be.  Will keep aspect
      // ratio no matter what.  So if both are 800, the returned image
      // will be at most 800 pixels wide and 800 pixels tall.  If the width is
      // 800 and height 0 the image will be 800 pixels wide if the source
      // is at least that wide.
      width: 500,
      //height: 200,
      
      // quality of resized image, defaults to 100
      

      // output type, defaults to FILE_URIs.
      // available options are 
      // window.imagePicker.OutputType.FILE_URI (0) or 
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 1
    };
    
    this.imagePicker.getPictures(this.options).then((results) => {
      
        this.imageResponse = ('data:image/png;base64,' + results[0]);
        // this.img = ('data:image/png;base64,' + results[0]);
        // console.log(results[0])
    }, (err) => { 
      alert(err);
    });
  }
  


}
