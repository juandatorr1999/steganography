import { Component } from '@angular/core';
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

  constructor(private imagePicker: ImagePicker) { }
  ngOnInit() {
    console.log("Register custom capacitor plugins");
    registerWebPlugin(FileSharer);
  }

  saveGallery(){
    Plugins.FileSharer.share({
      filename: "test12.png",
      base64Data: this.imageResponse.replace('data:image/png;base64,', '').toString(),
      contentType: "image/png",
  }).then(() => {
      console.log("shared!!!");
  }).catch(error => {
      console.error("File sharing failed", error.message);
  });
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
      width: 1000,
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
      
    }, (err) => { 
      alert(err);
    });
  }
  


}
