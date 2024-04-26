import {Platform} from 'react-native';
import RNFS from 'react-native-fs'; // Import React Native FS for file system operations

const rootFolder =
  Platform.OS === 'ios'
    ? RNFS.DocumentDirectoryPath
    : RNFS.ExternalDirectoryPath;
const inspectionImagesFolder = 'inspection_images';

export const saveImagestoLocalStorage = async (proposalNumber, images) => {
  console.log(proposalNumber, images, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  try {
    const proposalFolder = `${rootFolder}/${proposalNumber}`;
    const inspectionImagesFolderPath = `${proposalFolder}/${inspectionImagesFolder}`;
    await RNFS.mkdir(inspectionImagesFolderPath, {recursive: true}); // Create proposal and inspection images folders recursively if not exists

    images.forEach(async image => {
      const {name, uri} = image;
      const imageName = name.replace(/ /g, '_'); // Modify image name if necessary
      const imagePath = `${inspectionImagesFolderPath}/${imageName}`;

      // Read the image data from the URI
      const imageData = await RNFS.readFile(uri, 'base64');

      // Write the image data to the file system
      await RNFS.writeFile(imagePath, imageData, 'base64');
    });
  } catch (error) {
    console.error('Error saving images:', error);
  }
};
