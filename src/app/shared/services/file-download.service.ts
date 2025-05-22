import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  downloadFile(fileData: Blob, fileName: string) {
    let blob = new Blob([fileData], { type: this.getBlobType(fileName) });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private getBlobType(fileName: string) {
    if (fileName.indexOf('.pdf') != -1) {
      return 'application/pdf';
    }

    if (fileName.indexOf('.jpg') != -1 || fileName.indexOf('.jpeg') != -1) {
      return 'image/jpeg';
    }

    if (fileName.indexOf('.png') != -1) {
      return 'image/png';
    }

    if (fileName.indexOf('.gif') != -1) {
      return 'image/gif';
    }

    return `text/plain`;
  }
}
