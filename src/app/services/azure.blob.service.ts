// import { Subject } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class AzureBlobStorageService {
//   constructor(private http: HttpClient) { }

//   containers: string[] = environment.containers;
//   accountName: string = environment.accountName;
//   isUploading: boolean = false;
//   azureUploadController = new AbortController();

//   public progressIndicator = new Subject<any>();
//   public UploadingIndicator = new Subject<any>();

//   private containerClient(container: string, sas?: string): ContainerClient {
//     let token = sas ? sas : '';
//     return new BlobServiceClient(
//       `https://${this.accountName}.blob.core.windows.net?${token}`
//     ).getContainerClient(container);
//   }

//   private emitProgress(sub: Subject<any>, val: any) {
//     sub.next(val);
//   }

//   public async uploadFile(
//     file: File,
//     containerIndex: number,
//     access: number,
//     sizeInGB: number
//   ) {
//     this.emitProgress(this.UploadingIndicator, (this.isUploading = true));

//     const containerName = this.containers[containerIndex];
//     const sasToken = await this.getContainerSasToken(containerName, access, sizeInGB);
//     const blockBlobClient = this.containerClient(containerName, sasToken)
//       .getBlockBlobClient(file.name);

//     await blockBlobClient.uploadData(file, {
//       abortSignal: this.azureUploadController.signal,
//       blobHTTPHeaders: { blobContentType: file.type },
//       onProgress: (progress: any) => {
//         const completed = Math.round((progress.loadedBytes / file.size) * 100);
//         this.emitProgress(this.progressIndicator, completed);
//       },
//     });

//     this.emitProgress(this.UploadingIndicator, (this.isUploading = false));
//   }

//   private async getContainerSasToken(
//     container: string,
//     access: number,
//     sizeInGB: number
//   ): Promise<string> {
//     return this.http
//       .get(`${environment.apiUrl}/api/storage/container/${container}/${access}/${sizeInGB}`, {
//         responseType: 'text',
//       })
//       .toPromise()
//       .then((data) => data as string) // Ensure the returned type is string
//       .catch((err) => {
//         console.error('Error getting container SAS token:', err);
//         return ''; // Return an empty string to avoid undefined issues
//       });
//   }
  
// }
