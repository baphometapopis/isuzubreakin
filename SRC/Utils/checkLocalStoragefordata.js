import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

const rootFolderPath =
  Platform.OS === 'ios'
    ? RNFS.DocumentDirectoryPath
    : RNFS.ExternalDirectoryPath;
const inspectionImagesFolder = 'inspection_images';

// Function to check if a file exists
// const checkFileExists = async filePath => {
//   try {
//     const exists = await RNFS.exists(filePath);
//     return exists;
//   } catch (error) {
//     console.error('Error checking file existence:', error);
//     return false;
//   }
// };

// Function to check if the inspection images folder is empty
export const isInspectionImagesFolderEmpty = async proposalNumber => {
  try {
    console.log(proposalNumber);
    const fetched = await fetchAndSendImagesToAPI(proposalNumber);
    // const folderPath = `${rootFolderPath}/${proposalNumber}/${inspectionImagesFolder}`;
    // const folderContents = await RNFS.readdir(folderPath);
    // console.log(folderContents, 'content');

    return fetched;
  } catch (error) {
    console.error('Error checking inspection images folder:', error);
    return false;
  }
};

export const fetchAndSendImagesToAPI = async proposalNumber => {
  try {
    const proposalFolder = `${rootFolderPath}/${proposalNumber}`;
    const inspectionImagesFolderPath = `${proposalFolder}/${inspectionImagesFolder}`;

    // Read the contents of the inspection images folder
    const folderContents = await RNFS.readdir(inspectionImagesFolderPath);

    // Construct the data format to send to the API
    const imagesData = folderContents.map(fileName => {
      const imagePath = `${inspectionImagesFolderPath}/${fileName}`;
      const name = fileName; // Convert underscores back to spaces
      const part = fileName.replace(/_/g, ' ').split('.')[0]; // Trim file extension
      return {
        name: name,
        uri: `file://${imagePath}`,
        type: 'image/jpeg', // Adjust as needed based on image type
        part: part, // Assign trimmed file name to part
      };
    });

    // Send the images data to the API
    // Example:
    // await YourAPI.sendImagesData(imagesData);

    return imagesData;
  } catch (error) {
    console.error('Error fetching and sending images:', error);
  }
};
